import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Check, ArrowRight, BrainCircuit } from 'lucide-react';
import { StyleProfile } from '../types';

interface VoiceTrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: StyleProfile) => void;
}

export const VoiceTrainModal: React.FC<VoiceTrainModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
}) => {
  const [creatorName, setCreatorName] = useState('My Custom Voice');
  const [samples, setSamples] = useState<string[]>([
    `Most people treat audience building like a popularity contest.\n\nIt isn't. It's a discovery engine for your highest-conviction ideas.\n\nIf you want more inbound opportunities, stop broadcasting and start sharing your actual decision logs.`,
    `We just killed a product feature after 6 months of development.\n\nWhy? Because only 3% of users clicked it twice.\n\nNever fall in love with the code you write; fall in love with the problem your customer is trying to solve.`
  ]);
  const [newSample, setNewSample] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddSample = () => {
    if (!newSample.trim()) return;
    setSamples([...samples, newSample.trim()]);
    setNewSample('');
  };

  const handleRemoveSample = (idx: number) => {
    setSamples(samples.filter((_, i) => i !== idx));
  };

  const handleRunAnalysis = async () => {
    if (samples.length === 0) {
      setError('Please provide at least one writing sample.');
      return;
    }
    setError('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleTexts: samples,
          creatorName: creatorName || 'Custom Persona',
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.profile) {
        onProfileCreated(data.profile);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze samples.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/80 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Train Style Profile from Existing Posts
              </h3>
              <p className="text-xs text-slate-400">
                AI extracts your sentence length, tone parameters, and negative constraints.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Persona / Brand Name:
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="e.g. Alex Rivera or Tech Founder Voice"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Existing Samples */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Writing Samples ({samples.length} Added):
            </label>
            <div className="space-y-2.5">
              {samples.map((sample, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg text-xs text-slate-300 relative group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-indigo-400 uppercase font-semibold">
                      Sample #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSample(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-xs">
                    {sample}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Sample Box */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-lg space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Paste another post you wrote:
            </span>
            <textarea
              rows={3}
              value={newSample}
              onChange={(e) => setNewSample(e.target.value)}
              placeholder="Paste a LinkedIn post, tweet, or newsletter excerpt..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSample}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700/60"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sample</span>
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800 p-2.5 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleRunAnalysis}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calibrating Voice Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Style Memory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
