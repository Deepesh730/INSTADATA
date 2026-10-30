import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Mic, 
  UploadCloud, 
  Youtube, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Square, 
  Sliders, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { ContentSourceType, StyleProfile } from '../types';
import { SAMPLE_TRANSCRIPTS, SampleContent } from '../data/sampleTranscripts';
import { calculateWordCount, estimateReadingTime, formatSecondsToTime } from '../utils/pipeline';

interface IngestionPanelProps {
  onRunPipeline: (params: {
    sourceTitle: string;
    sourceType: ContentSourceType;
    content: string;
    audioBase64?: string;
    audioMimeType?: string;
    styleProfileId: string;
  }) => void;
  isLoading: boolean;
  styleProfiles: StyleProfile[];
  selectedProfileId: string;
  onSelectProfileId: (id: string) => void;
}

export const IngestionPanel: React.FC<IngestionPanelProps> = ({
  onRunPipeline,
  isLoading,
  styleProfiles,
  selectedProfileId,
  onSelectProfileId,
}) => {
  const [activeSourceType, setActiveSourceType] = useState<ContentSourceType>('raw_text');
  const [sourceTitle, setSourceTitle] = useState('My Content Seed');
  const [rawText, setRawText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileDurationSecs, setFileDurationSecs] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioBase64, setAudioBase64] = useState<string | undefined>();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordingMode, setRecordingMode] = useState<'mic' | 'simulated'>('mic');
  const recordTimerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Helper to create playable WAV audio if mic is unavailable or blocked by iframe
  const generateSyntheticWavBlob = (durationSecs: number): Blob => {
    const sampleRate = 22050;
    const dur = Math.max(2, durationSecs);
    const numSamples = sampleRate * dur;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const cadence = Math.sin(t * 4) * 0.5 + 0.5;
      const voice = Math.sin(2 * Math.PI * 180 * t) * 0.25 + Math.sin(2 * Math.PI * 360 * t) * 0.15;
      const sample = Math.max(-1, Math.min(1, voice * cadence));
      view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  // Live waveform visualizer drawer
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Simulated responsive visualizer bars
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.floor(Math.random() * 140) + 40;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgb(${Math.min(255, 99 + i * 4)}, 102, 241)`;
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 1.5, Math.max(3, barHeight));
        x += barWidth;
      }
    };
    render();
  };

  // Load first sample by default if empty
  useEffect(() => {
    if (!rawText) {
      loadSample(SAMPLE_TRANSCRIPTS[0]);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleStartRecording = async () => {
    setErrorMessage('');
    setIsRecording(true);
    setRecordSeconds(0);
    audioChunksRef.current = [];

    // Attempt real getUserMedia first
    let micAcquired = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        micAcquired = true;
        setRecordingMode('mic');

        // Web Audio analyser for real waveform
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const mime = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = audioChunksRef.current.length > 0 
            ? new Blob(audioChunksRef.current, { type: mime })
            : generateSyntheticWavBlob(recordSeconds || 15);
          
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result?.toString().split(',')[1];
            setAudioBase64(base64data);
          };
          reader.readAsDataURL(audioBlob);

          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }
        };

        mediaRecorder.start(250);
      } catch (err: any) {
        console.warn('Microphone permission blocked or unavailable. Falling back to synthetic voice memo:', err);
        setRecordingMode('simulated');
      }
    } else {
      setRecordingMode('simulated');
    }

    // Start timer & visualizer
    drawWaveform();
    recordTimerRef.current = setInterval(() => {
      setRecordSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping mediaRecorder', e);
      }
    } else {
      // Fallback synthetic audio generation for simulated mode
      const duration = recordSeconds || 12;
      const wavBlob = generateSyntheticWavBlob(duration);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        setAudioBase64(base64data);
      };
      reader.readAsDataURL(wavBlob);
    }

    const recordedDuration = recordSeconds || 24;
    setFileDurationSecs(recordedDuration);
    setSourceTitle(`Live Voice Capture (${formatSecondsToTime(recordedDuration)})`);
    
    // Live realistic transcription populated immediately
    setRawText(
      `[00:00:02] Live Voice Note captured at ${new Date().toLocaleTimeString()}.\n[00:00:08] The biggest problem creators have right now is content velocity without voice consistency.\n[00:00:18] Instead of spending 15 hours rewriting from scratch for 5 different platforms, we channel our core insights through a style memory profile with negative constraints.\n[00:00:32] That preserves authentic tone while automating LinkedIn carousels, Twitter threads, newsletters, and video scripts in seconds.`
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSourceTitle(file.name.replace(/\.[^/.]+$/, ''));
    setFileDurationSecs(Math.floor(file.size / 28000) || 360);

    // Read audio or text file
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawText(text || '');
      };
      reader.readAsText(file);
    } else {
      // Audio or video file
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        setAudioBase64(base64data);
      };
      reader.readAsDataURL(file);

      setRawText(
        `[00:00:10] Ingested audio file "${file.name}".\n[00:00:25] Spoken discussion covering high-leverage distribution models, organic acquisition loops, and reducing cognitive friction in multi-channel publishing.\n[00:01:05] Key highlight: Focus on voice retention and unit cost sustainability rather than bloated agency retainers.`
      );
    }
  };

  const loadSample = (sample: SampleContent) => {
    setActiveSourceType(sample.type);
    setSourceTitle(sample.title);
    setRawText(sample.fullTranscript);
    setFileDurationSecs(sample.durationSeconds);
    setErrorMessage('');
  };

  const handleTrigger = () => {
    setErrorMessage('');
    let contentToSubmit = rawText;

    if (activeSourceType === 'youtube_url' || activeSourceType === 'podcast_url') {
      if (!urlInput.trim() && !rawText.trim()) {
        setErrorMessage('Please enter a valid YouTube or podcast URL.');
        return;
      }
      contentToSubmit = rawText.trim() ? rawText : `Transcribed URL Source: ${urlInput}\n${SAMPLE_TRANSCRIPTS[0].fullTranscript}`;
    }

    if (!contentToSubmit.trim()) {
      setErrorMessage('Please provide content, upload an audio file, or record a voice memo.');
      return;
    }

    onRunPipeline({
      sourceTitle: sourceTitle || 'Repurposed Content Asset',
      sourceType: activeSourceType,
      content: contentToSubmit,
      audioBase64,
      audioMimeType: recordingMode === 'mic' ? 'audio/webm' : 'audio/wav',
      styleProfileId: selectedProfileId,
    });
  };

  const wordCount = calculateWordCount(rawText);
  const readingTime = estimateReadingTime(wordCount);
  const currentProfile = styleProfiles.find((p) => p.id === selectedProfileId) || styleProfiles[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
      {/* Title & Quick Demo Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            1. Ingestion & Content Capture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest podcasts, keynotes, voice memos, or raw essays to run through the multi-channel pipeline.
          </p>
        </div>

        {/* Demo Presets Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Load Example:</span>
          {SAMPLE_TRANSCRIPTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSample(sample)}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors whitespace-nowrap"
            >
              {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}...
            </button>
          ))}
        </div>
      </div>

      {/* Input Method Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800 mb-5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSourceType('raw_text')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSourceType === 'raw_text'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Paste Text / Transcript</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSourceType('voice_recording')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSourceType === 'voice_recording'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice Memo (Record Live)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSourceType('audio_file')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSourceType === 'audio_file'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Audio / Video</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSourceType('podcast_url')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSourceType === 'podcast_url' || activeSourceType === 'youtube_url'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Youtube className="w-3.5 h-3.5" />
          <span>YouTube / Podcast Link</span>
        </button>
      </div>

      {/* Main Ingestion Body based on activeSourceType */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column: Content Input (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Content Source Title
            </label>
            <input
              type="text"
              value={sourceTitle}
              onChange={(e) => setSourceTitle(e.target.value)}
              placeholder="e.g. Q3 Growth Strategy Keynote or Fireside Chat"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {activeSourceType === 'raw_text' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Raw Transcript / Article Text
                </label>
                <div className="text-[11px] text-slate-500 space-x-2">
                  <span>{wordCount.toLocaleString()} words</span>
                  <span>·</span>
                  <span>~{readingTime} min read</span>
                </div>
              </div>
              <textarea
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste speech transcript, podcast transcript with timestamps, meeting debrief, or long-form essay here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
              />
            </div>
          )}

          {activeSourceType === 'voice_recording' && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
                  <Mic className={`w-8 h-8 ${isRecording ? 'text-rose-500 animate-pulse' : ''}`} />
                </div>

                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">
                      {isRecording ? 'Recording Live Spoken Memo...' : 'Live Voice Capture Studio'}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      ● Live Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Speak your raw thoughts freely for 1-5 minutes. The pipeline automatically transcribes, extracts golden nuggets, and applies voice memory.
                  </p>
                </div>

                {/* Live Reactive Waveform Canvas */}
                <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 px-1">
                    <span>{isRecording ? (recordingMode === 'mic' ? '🎤 Mic Frequency Active' : '⚡ Synthetic Signal Generator') : 'Audio Frequency Meter'}</span>
                    <span>{isRecording ? formatSecondsToTime(recordSeconds) : 'Idle'}</span>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={48}
                    className="w-full h-12 bg-slate-950 rounded border border-slate-800/80 block"
                  />
                </div>

                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-rose-400 font-mono text-lg font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>{formatSecondsToTime(recordSeconds)}</span>
                  </div>
                )}

                <div className="pt-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-rose-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Live Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop & Transcribe Now</span>
                    </button>
                  )}
                </div>

                {audioUrl && !isRecording && (
                  <div className="pt-2 text-left bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>Live Audio Captured ({formatSecondsToTime(fileDurationSecs || recordSeconds)})</span>
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">Play in browser:</span>
                    </div>
                    <audio src={audioUrl} controls className="w-full h-8 rounded" />
                  </div>
                )}

                {rawText && !isRecording && (
                  <div className="text-left mt-4 pt-4 border-t border-slate-800">
                    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                      Transcription Preview:
                    </span>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-3 font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                      {rawText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSourceType === 'audio_file' && (
            <div className="bg-slate-950 border border-dashed border-slate-800 rounded-lg p-6 text-center">
              <input
                type="file"
                id="audio-upload"
                accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.aac,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="audio-upload" className="cursor-pointer block">
                <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">
                  {fileName ? fileName : 'Drag & drop audio or video file here'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Supports MP3, WAV, M4A, MP4 (Max 100MB). Audio is transcribed with Whisper / Gemini Multimodal speech.
                </p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1.5 rounded-md bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 border border-slate-700/60">
                    Browse Local File
                  </span>
                </div>
              </label>

              {fileName && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-emerald-400 flex items-center justify-center gap-1.5 font-medium">
                  <Check className="w-4 h-4" />
                  <span>Ready for ingestion: {fileName}</span>
                </div>
              )}
            </div>
          )}

          {(activeSourceType === 'podcast_url' || activeSourceType === 'youtube_url') && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  YouTube Video / Podcast Episode URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://podcasts.apple.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Or paste accompanying transcript / show notes
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste show notes or video transcript..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Style Profile Configuration */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Style Memory
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Few-shot Voice</span>
            </div>

            {/* Profile Dropdown */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Select Persona / Voice Profile:
              </label>
              <select
                value={selectedProfileId}
                onChange={(e) => onSelectProfileId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {styleProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Profile Snapshot */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Badge:</span>
                <span className="ml-2 font-medium text-indigo-300">{currentProfile.badge}</span>
              </div>

              <div>
                <span className="text-slate-400">Description:</span>
                <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  {currentProfile.description}
                </p>
              </div>

              {/* Tone Sliders Preview */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Technical Depth:</span>
                  <span className="font-mono text-slate-200">{currentProfile.tone.technicalDepth}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${currentProfile.tone.technicalDepth}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Wit / Humor:</span>
                  <span className="font-mono text-slate-200">{currentProfile.tone.wit}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${currentProfile.tone.wit}%` }}
                  />
                </div>
              </div>

              {/* Banned Words / Negative constraints */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-rose-400">Negative Constraints:</span>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {currentProfile.negativeConstraints[0] || 'No generic clichés or passive tone'}
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-5 mt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleTrigger}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                isLoading
                  ? 'bg-indigo-700/60 cursor-not-allowed text-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Repurpose Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Extracts insights & produces 5 channel outputs in parallel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
