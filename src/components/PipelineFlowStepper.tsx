import React from 'react';
import { 
  Upload, 
  Cpu, 
  Headphones, 
  Sparkles, 
  BrainCircuit, 
  Share2, 
  CheckCircle2, 
  Calendar,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { PipelineStage, TokenMetrics } from '../types';

interface PipelineFlowStepperProps {
  currentStage: PipelineStage;
  stageProgress: number;
  stageMessage?: string;
  metrics?: TokenMetrics;
  onSelectStageTab?: (stageTab: 'pipeline' | 'insights' | 'profiles' | 'channels' | 'scheduler') => void;
}

interface StepItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  stageTrigger: PipelineStage[];
  tabTarget?: 'pipeline' | 'insights' | 'profiles' | 'channels' | 'scheduler';
}

const STEPS: StepItem[] = [
  {
    id: 'upload',
    label: 'Upload Content',
    sublabel: 'Audio/Video/Text/URL',
    icon: Upload,
    stageTrigger: ['ingesting'],
    tabTarget: 'pipeline'
  },
  {
    id: 'ingestion',
    label: 'Ingestion Service',
    sublabel: 'Validate & Chunk',
    icon: Cpu,
    stageTrigger: ['ingesting'],
    tabTarget: 'pipeline'
  },
  {
    id: 'transcription',
    label: 'Transcription',
    sublabel: 'Whisper / Deepgram',
    icon: Headphones,
    stageTrigger: ['transcribing'],
    tabTarget: 'insights'
  },
  {
    id: 'insights',
    label: 'Insight Extraction',
    sublabel: 'Claude / GPT / Gemini',
    icon: Sparkles,
    stageTrigger: ['extracting_insights'],
    tabTarget: 'insights'
  },
  {
    id: 'style',
    label: 'Style Profile Engine',
    sublabel: 'Embeddings + Few-Shot',
    icon: BrainCircuit,
    stageTrigger: ['styling'],
    tabTarget: 'profiles'
  },
  {
    id: 'generation',
    label: 'Generation Engine',
    sublabel: '5 Native Channels',
    icon: Share2,
    stageTrigger: ['generating'],
    tabTarget: 'channels'
  },
  {
    id: 'approval',
    label: 'Human Approval',
    sublabel: 'Review & Refine',
    icon: CheckCircle2,
    stageTrigger: ['completed'],
    tabTarget: 'channels'
  },
  {
    id: 'schedule',
    label: 'Scheduling / Export',
    sublabel: 'Calendar & Bundles',
    icon: Calendar,
    stageTrigger: ['completed'],
    tabTarget: 'scheduler'
  }
];

export const PipelineFlowStepper: React.FC<PipelineFlowStepperProps> = ({
  currentStage,
  stageProgress,
  stageMessage,
  metrics,
  onSelectStageTab
}) => {
  const isRunning = currentStage !== 'idle' && currentStage !== 'completed' && currentStage !== 'error';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
      {/* Top Bar with Stage title and Economics Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Live Architecture Pipeline
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              End-to-End Multichannel Ingestion
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200 mt-1">
            {stageMessage || (currentStage === 'completed' 
              ? 'Multi-channel assets generated and ready for human review' 
              : 'Ready to ingest content and extract insights')}
          </p>
        </div>

        {/* Live Token & Cost Telemetry */}
        {metrics && (
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-slate-300 bg-slate-950/70 px-3.5 py-2 rounded-lg border border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Tokens:</span>
              <span className="font-semibold text-white">{metrics.totalTokens.toLocaleString()}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Cost:</span>
              <span className="text-emerald-400 font-semibold">${metrics.geminiCostUsd.toFixed(4)}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.savingsPercentage}% Saved</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive 8-Stage Node Pipeline */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-[920px]">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isStepActive = step.stageTrigger.includes(currentStage);
            const isStepDone = currentStage === 'completed';

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => step.tabTarget && onSelectStageTab?.(step.tabTarget)}
                  className={`flex-1 text-left p-3 rounded-lg border transition-all duration-200 group ${
                    isStepActive
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : isStepDone
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/30 border-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                        isStepActive
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : isStepDone
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                      {step.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors truncate pl-8">
                    {step.sublabel}
                  </p>
                </button>

                {idx < STEPS.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Progress Bar when running */}
      {isRunning && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Executing {currentStage.replace('_', ' ')}...</span>
            <span className="font-mono tabular-nums">{stageProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 rounded-full"
              style={{ width: `${stageProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
