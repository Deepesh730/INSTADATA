import React, { useState } from 'react';
import { 
  Sparkles, 
  Quote, 
  CheckCircle, 
  Clock, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Compass, 
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExtractedInsights, IngestionMetadata, TranscriptionData } from '../types';
import { formatSecondsToTime } from '../utils/pipeline';

interface ContentUnderstandingViewProps {
  ingestion: IngestionMetadata;
  transcription: TranscriptionData;
  insights: ExtractedInsights;
}

export const ContentUnderstandingView: React.FC<ContentUnderstandingViewProps> = ({
  ingestion,
  transcription,
  insights,
}) => {
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Metadata Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>Stage 2 & 3 Completed</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Transcription & Deep Ingestion</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              {ingestion.title}
            </h2>
          </div>

          {/* Virality & Readability Scores */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
              <span className="text-slate-400">Virality Index:</span>
              <span className="font-mono font-bold text-emerald-400">{insights.viralityPotential}/100</span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
              <span className="text-slate-400">Readability:</span>
              <span className="font-semibold text-slate-200">{insights.readabilityGrade}</span>
            </div>
          </div>
        </div>

        {/* 4 Quantitative Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Est. Audio Duration</span>
            </div>
            <p className="text-sm font-semibold font-mono text-white">
              {formatSecondsToTime(ingestion.durationSeconds)}
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Word Count</span>
            </div>
            <p className="text-sm font-semibold font-mono text-white">
              {ingestion.wordCount.toLocaleString()} words
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Diarized Speakers</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {ingestion.detectedSpeakers.join(', ')}
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Engine Provider</span>
            </div>
            <p className="text-sm font-semibold text-white truncate">
              {transcription.provider}
            </p>
          </div>
        </div>
      </div>

      {/* Core Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
          Synthesized Core Thesis
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed">
          {insights.coreSummary}
        </p>
      </div>

      {/* 3 Key Takeaways & Golden Quotes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 3 Core Takeaways */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Core Takeaways & Golden Nuggets
            </h3>
          </div>

          <div className="space-y-4">
            {insights.takeaways.map((takeaway, idx) => (
              <div
                key={takeaway.id || idx}
                className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{takeaway.title}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      takeaway.impact === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                    }`}
                  >
                    {takeaway.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {takeaway.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Golden Quotes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Quote className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Memorable Spoken Quotes (Verbatim)
            </h3>
          </div>

          <div className="space-y-3.5">
            {insights.goldenQuotes.map((q, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5 relative"
              >
                <p className="text-xs italic text-slate-200 leading-relaxed mb-2">
                  "{q.quote}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Context: {q.context}</span>
                  {q.timestamp && (
                    <span className="font-mono text-indigo-300">[{q.timestamp}]</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Framework & Counter-Intuitive Angles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Framework */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Action Framework: {insights.actionFramework.name}
            </h3>
          </div>

          <ol className="space-y-2.5 text-xs">
            {insights.actionFramework.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60"
              >
                <span className="font-mono text-emerald-400 font-bold shrink-0">
                  Step 0{idx + 1}:
                </span>
                <span className="text-slate-300 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Counter-Intuitive Insights & Pain Points */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Contrarian Angles & Reader Pain Points
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1.5">
                Pattern-Interrupt Angles:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {insights.counterIntuitiveAngles.map((angle, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 shrink-0 font-bold">›</span>
                    <span>{angle}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1.5">
                Target Audience Friction Addressed:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {insights.audiencePainPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0 font-bold">✕</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamped Transcript Drawer (Collapsible) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Timestamped Audio Transcript ({transcription.segments.length} segments)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowFullTranscript(!showFullTranscript)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <span>{showFullTranscript ? 'Collapse Transcript' : 'Expand Full Transcript'}</span>
            {showFullTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showFullTranscript && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
            {transcription.segments.map((seg) => (
              <div
                key={seg.id}
                className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span className="text-indigo-300 font-semibold">{seg.speaker}</span>
                  <span>
                    [{seg.startTime} ➔ {seg.endTime}]
                  </span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed">{seg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
