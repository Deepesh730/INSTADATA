import React, { useState } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  CheckCircle2, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { TokenMetrics } from '../types';

interface CorePhilosophyAndEconomicsProps {
  currentMetrics?: TokenMetrics;
}

export const CorePhilosophyAndEconomics: React.FC<CorePhilosophyAndEconomicsProps> = ({
  currentMetrics,
}) => {
  const [monthlyRuns, setMonthlyRuns] = useState(250);

  // Calculation for monthly simulations:
  // Gemini 3.8 Flash per run: ~$0.001
  // Traditional Multi-Model Stack: ~$0.075 ($0.03 audio whisper + $0.045 GPT-4o / Claude Sonnet)
  const geminiMonthlyCost = Number((monthlyRuns * 0.001).toFixed(2));
  const traditionalMonthlyCost = Number((monthlyRuns * 0.075).toFixed(2));
  const annualSavings = Number(((traditionalMonthlyCost - geminiMonthlyCost) * 12).toFixed(2));
  const savingsPercent = Math.round(((traditionalMonthlyCost - geminiMonthlyCost) / traditionalMonthlyCost) * 100);

  return (
    <div className="space-y-6">
      {/* 4 Pillars Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            OmniRepurpose Core Philosophy
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Four foundational commitments governing model selection, workflow ergonomics, and unit economics.
          </p>
        </div>

        {/* 4 Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/80 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              1. Best-in-Class Intelligence
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Powered by Google Gemini 3.8 Flash for native multimodal audio comprehension, sub-second latency, and structured insight extraction.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 border border-purple-800/80 flex items-center justify-center mb-3">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              2. Workflows & Style Memory
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zero generic AI slop. Persistent voice memory, few-shot exemplar databases, and strict negative constraints (banned clichés) safeguard your brand identity.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              3. Reliability & Ease of Use
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deterministic fallbacks, in-place editing, and 1-click publishing simulators ensure operators never encounter broken screens or cognitive blocks.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/80 flex items-center justify-center mb-3">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              4. Costs Under Control
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sub-cent unit economics ($0.001 per run) reduce cloud inference bills by over 98% compared to multi-vendor Whisper + GPT-4o / Claude pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* Unit Economics Deep Dive & Cost Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-5">
          <div>
            <h3 className="text-base font-bold text-white">
              Unit Economics: Gemini 3.8 Flash vs Traditional Multi-Model Stack
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison for full 5-channel ingestion, transcription, insight extraction, and multi-asset formatting.
            </p>
          </div>

          <div className="bg-emerald-950 border border-emerald-800/80 text-emerald-300 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold">
            98.7% Cost Reduction
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Pipeline Stage</th>
                <th className="py-2.5 px-3">Traditional Multi-Vendor Stack</th>
                <th className="py-2.5 px-3 text-indigo-400">OmniRepurpose (Gemini Flash)</th>
                <th className="py-2.5 px-3 text-emerald-400 text-right">Margin Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-white">1. Audio Transcription</td>
                <td className="py-2.5 px-3 text-slate-400">Whisper API ($0.006 / min)</td>
                <td className="py-2.5 px-3 text-indigo-300">Gemini Multimodal Audio ($0.0002)</td>
                <td className="py-2.5 px-3 text-emerald-400 text-right font-bold">96.7% cheaper</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-white">2. Insight Extraction</td>
                <td className="py-2.5 px-3 text-slate-400">GPT-4o ($2.50/M input, $10.00/M out)</td>
                <td className="py-2.5 px-3 text-indigo-300">Gemini 3.8 Flash ($0.10/M in, $0.40/M out)</td>
                <td className="py-2.5 px-3 text-emerald-400 text-right font-bold">96.0% cheaper</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-white">3. 5-Channel Generation</td>
                <td className="py-2.5 px-3 text-slate-400">Claude 3.5 Sonnet ($3.00/M in, $15.00/M out)</td>
                <td className="py-2.5 px-3 text-indigo-300">Gemini 3.8 Flash Batching</td>
                <td className="py-2.5 px-3 text-emerald-400 text-right font-bold">97.3% cheaper</td>
              </tr>
              <tr className="bg-slate-950 font-bold">
                <td className="py-3 px-3 font-sans text-white">Total Cost Per Run</td>
                <td className="py-3 px-3 text-rose-400 font-bold">~$0.0750 USD</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">~$0.0009 USD</td>
                <td className="py-3 px-3 text-emerald-400 text-right font-bold">~83x Lower Cost</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Interactive Volume Savings Calculator */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Monthly Repurposing Volume Calculator
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulate annual infrastructure savings for your agency or content team.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Simulate:</span>
              <span className="font-mono text-sm font-bold text-white">{monthlyRuns} runs / month</span>
            </div>
          </div>

          <input
            type="range"
            min="20"
            max="2000"
            step="10"
            value={monthlyRuns}
            onChange={(e) => setMonthlyRuns(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer mb-5"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono tabular-nums">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-sans text-slate-400 block mb-1">
                OmniRepurpose Monthly:
              </span>
              <span className="text-lg font-bold text-indigo-400">
                ${geminiMonthlyCost}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[11px] font-sans text-slate-400 block mb-1">
                Traditional Stack Monthly:
              </span>
              <span className="text-lg font-bold text-rose-400">
                ${traditionalMonthlyCost}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80">
              <span className="text-[11px] font-sans text-emerald-300 block mb-1">
                Net Annual Savings:
              </span>
              <span className="text-lg font-bold text-emerald-400">
                +${annualSavings.toLocaleString()} / year
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
