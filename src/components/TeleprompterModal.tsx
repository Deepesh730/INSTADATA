import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Camera, 
  CameraOff, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { VideoClipOutput } from '../types';

interface TeleprompterModalProps {
  videoClip: VideoClipOutput;
  isOpen: boolean;
  onClose: () => void;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  videoClip,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(140); // Words per minute
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('xl');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Full teleprompter text compiled from scenes
  const fullScript = videoClip.storyboard
    .map((s, idx) => `[Scene ${idx + 1} · ${s.timeRange}]\n${s.teleprompterText}\n*(Visual Cue: ${s.visualBroll})*`)
    .join('\n\n');

  // Handle auto-scroll animation
  useEffect(() => {
    let animId: number;
    if (isPlaying && scrollContainerRef.current) {
      const scrollStep = () => {
        if (scrollContainerRef.current) {
          // scroll speed factor
          const pixelsPerFrame = (scrollSpeed / 140) * 0.9;
          scrollContainerRef.current.scrollTop += pixelsPerFrame;
        }
        animId = requestAnimationFrame(scrollStep);
      };
      animId = requestAnimationFrame(scrollStep);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, scrollSpeed]);

  // Handle Camera toggling
  const toggleCamera = async () => {
    setCameraNotice(null);
    if (cameraEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraEnabled(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraEnabled(true);
        } else {
          setCameraNotice('Camera preview unavailable in this browser environment. Using clean script view.');
        }
      } catch (err) {
        console.warn('Camera permission denied or unavailable:', err);
        setCameraNotice('Camera access denied or unavailable. You can use full-width teleprompter mode.');
        setTimeout(() => setCameraNotice(null), 4000);
      }
    }
  };

  const handleStartWithCountdown = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsPlaying(true);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Short Video Teleprompter Studio (~{videoClip.durationSeconds}s Target)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Control */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Pacing:</span>
              <span className="font-mono font-bold text-indigo-400">{scrollSpeed} WPM</span>
              <input
                type="range"
                min="80"
                max="240"
                step="10"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Font Size Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['base', 'lg', 'xl', '2xl'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-0.5 rounded uppercase font-semibold text-[10px] ${
                    fontSize === sz ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Camera Toggle */}
            <button
              type="button"
              onClick={toggleCamera}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                cameraEnabled
                  ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Webcam Preview"
            >
              {cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Notice Bar */}
        {cameraNotice && (
          <div className="bg-amber-950/90 border-b border-amber-800/80 px-6 py-2 text-xs text-amber-300 flex items-center justify-between">
            <span>{cameraNotice}</span>
            <button type="button" onClick={() => setCameraNotice(null)} className="text-amber-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Teleprompter Viewing Canvas (Split with Optional Webcam) */}
        <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden bg-black">
          {/* Webcam Mirror Surface if Enabled */}
          {cameraEnabled && (
            <div className="w-full md:w-1/2 h-full bg-slate-950 border-r border-slate-800 relative flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 opacity-90"
              />
              <div className="absolute top-4 left-4 bg-rose-600/90 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                LIVE CAMERA FEED
              </div>
            </div>
          )}

          {/* Scrolling Script Canvas */}
          <div
            ref={scrollContainerRef}
            className={`flex-1 h-full overflow-y-auto px-8 md:px-16 py-20 relative select-none scrollbar-none ${
              cameraEnabled ? 'md:w-1/2' : 'w-full max-w-3xl mx-auto'
            }`}
          >
            {/* Center Reading Focus Bar Indicator */}
            <div className="sticky top-28 w-full border-y border-indigo-500/30 bg-indigo-500/5 py-3 px-4 rounded pointer-events-none mb-6">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                ▲ READ FOCUS ZONE ▲
              </span>
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                <span className="text-8xl font-black text-rose-500 font-mono animate-ping">
                  {countdown}
                </span>
              </div>
            )}

            <div className={`space-y-8 font-sans font-bold leading-relaxed text-slate-100 ${
              fontSize === 'base' ? 'text-lg' : fontSize === 'lg' ? 'text-2xl' : fontSize === 'xl' ? 'text-3xl' : 'text-4xl'
            }`}>
              {videoClip.storyboard.map((scene, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                    [{scene.timeRange}] Scene {idx + 1}
                  </div>
                  <p className="text-white drop-shadow-md">
                    {scene.teleprompterText}
                  </p>
                  <p className="text-xs font-normal text-slate-500 italic">
                    Visual Cue: {scene.visualBroll} · SFX: {scene.sfxCues}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-64" />
          </div>
        </div>

        {/* Bottom Playback Controls */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rewind to Top</span>
          </button>

          <button
            type="button"
            onClick={handleStartWithCountdown}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Teleprompter</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Teleprompter</span>
              </>
            )}
          </button>

          <div className="text-xs text-slate-400 font-mono">
            {videoClip.durationSeconds}s Script · {videoClip.storyboard.length} Scenes
          </div>
        </div>
      </div>
    </div>
  );
};
