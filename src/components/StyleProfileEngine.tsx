import React, { useState } from 'react';
import { 
  Sliders, 
  BrainCircuit, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Sparkles, 
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { StyleProfile } from '../types';
import { VoiceTrainModal } from './VoiceTrainModal';

interface StyleProfileEngineProps {
  profiles: StyleProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onUpdateProfile: (profile: StyleProfile) => void;
  onAddProfile?: (profile: StyleProfile) => void;
}

export const StyleProfileEngine: React.FC<StyleProfileEngineProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onUpdateProfile,
  onAddProfile,
}) => {
  const current = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const [profileDraft, setProfileDraft] = useState<StyleProfile>({ ...current });
  const [newConstraint, setNewConstraint] = useState('');
  const [newExamplePlatform, setNewExamplePlatform] = useState<'LinkedIn' | 'Twitter' | 'Newsletter'>('LinkedIn');
  const [newExampleText, setNewExampleText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);

  // Sync draft when switching profile
  const handleSelect = (id: string) => {
    onSelectProfile(id);
    const selected = profiles.find((p) => p.id === id);
    if (selected) {
      setProfileDraft({ ...selected });
      setSaveSuccess(false);
    }
  };

  const handleAddConstraint = () => {
    if (!newConstraint.trim()) return;
    setProfileDraft((prev) => ({
      ...prev,
      negativeConstraints: [...prev.negativeConstraints, newConstraint.trim()],
    }));
    setNewConstraint('');
  };

  const handleRemoveConstraint = (index: number) => {
    setProfileDraft((prev) => ({
      ...prev,
      negativeConstraints: prev.negativeConstraints.filter((_, i) => i !== index),
    }));
  };

  const handleAddExample = () => {
    if (!newExampleText.trim()) return;
    setProfileDraft((prev) => ({
      ...prev,
      fewShotExamples: [
        ...prev.fewShotExamples,
        { platform: newExamplePlatform, sampleText: newExampleText.trim() },
      ],
    }));
    setNewExampleText('');
  };

  const handleRemoveExample = (index: number) => {
    setProfileDraft((prev) => ({
      ...prev,
      fewShotExamples: prev.fewShotExamples.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onUpdateProfile(profileDraft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Intro & Philosophy Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              <span>Voice Memory & Personalization Architecture</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Style Profile Engine (Few-Shot & Negative Constraints)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Default LLMs default to homogenized corporate noise. The Style Profile Engine acts as your brand’s cognitive memory, calibrating tone parameters, few-shot examples, and strict negative constraints so all outputs sound authentically yours.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsTrainModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Train Voice with AI</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Voice Memory Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Voice Calibration</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Card Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {profiles.map((p) => {
            const isSelected = p.id === profileDraft.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-sm shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{p.name}</span>
                  <span className="text-[10px] font-semibold text-indigo-400">{p.badge}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Author Identity & Tone Controls (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            {profileDraft.avatarUrl ? (
              <img
                src={profileDraft.avatarUrl}
                alt={profileDraft.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold">
                {profileDraft.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white">{profileDraft.name}</h3>
              <p className="text-xs text-slate-400">{profileDraft.role}</p>
            </div>
          </div>

          {/* Profile Name & Role Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Persona Name
              </label>
              <input
                type="text"
                value={profileDraft.name}
                onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={profileDraft.role}
                onChange={(e) => setProfileDraft({ ...profileDraft, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Style Archetype Description
              </label>
              <textarea
                rows={2}
                value={profileDraft.description}
                onChange={(e) => setProfileDraft({ ...profileDraft, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Tone Sliders */}
          <div className="pt-3 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Voice Tone Calibrations</span>
            </h4>

            {/* Technical Depth */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Technical Depth:</span>
                <span className="font-mono text-indigo-400 font-bold">{profileDraft.tone.technicalDepth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profileDraft.tone.technicalDepth}
                onChange={(e) =>
                  setProfileDraft({
                    ...profileDraft,
                    tone: { ...profileDraft.tone, technicalDepth: Number(e.target.value) },
                  })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Layman / Accessible</span>
                <span>Deep Architecture</span>
              </div>
            </div>

            {/* Wit / Humor */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Wit & Edge:</span>
                <span className="font-mono text-indigo-400 font-bold">{profileDraft.tone.wit}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profileDraft.tone.wit}
                onChange={(e) =>
                  setProfileDraft({
                    ...profileDraft,
                    tone: { ...profileDraft.tone, wit: Number(e.target.value) },
                  })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Formal & Direct</span>
                <span>Punchy & Sarcastic</span>
              </div>
            </div>

            {/* Sentence Length */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Sentence Length:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['punchy', 'balanced', 'comprehensive'] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() =>
                      setProfileDraft({
                        ...profileDraft,
                        tone: { ...profileDraft.tone, sentenceLength: len },
                      })
                    }
                    className={`py-1.5 px-2 rounded text-center capitalize transition-colors ${
                      profileDraft.tone.sentenceLength === len
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji Density */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Emoji Density:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['none', 'minimal', 'expressive'] as const).map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() =>
                      setProfileDraft({
                        ...profileDraft,
                        tone: { ...profileDraft.tone, emojiDensity: emo },
                      })
                    }
                    className={`py-1.5 px-2 rounded text-center capitalize transition-colors ${
                      profileDraft.tone.emojiDensity === emo
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Sign-Off */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Signature Sign-Off:
              </label>
              <textarea
                rows={2}
                value={profileDraft.signatureSignOff}
                onChange={(e) => setProfileDraft({ ...profileDraft, signatureSignOff: e.target.value })}
                placeholder="e.g. Build with leverage, Alex"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Negative Constraints & Few-Shot Samples (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Negative Constraints (Anti-Slop Rules) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Negative Constraints (Banned Clichés & Formatting Rules)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The model is hard-instructed to NEVER violate these rules during generation.
                </p>
              </div>
            </div>

            {/* List of Constraints */}
            <div className="space-y-2 mb-4">
              {profileDraft.negativeConstraints.map((constraint, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{constraint}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveConstraint(idx)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Constraint Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                placeholder="Add negative constraint (e.g. Never use exclamation marks, no passive voice...)"
                onKeyDown={(e) => e.key === 'Enter' && handleAddConstraint()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1 shrink-0 border border-slate-700/60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rule</span>
              </button>
            </div>
          </div>

          {/* Few-Shot Examples (Style Memory Bank) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Few-Shot Training Memory Bank ({profileDraft.fewShotExamples.length} Samples)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Exemplar posts that demonstrate your personal pacing, cadence, and line-break structure.
                </p>
              </div>
            </div>

            {/* Exemplar Cards */}
            <div className="space-y-3 mb-4">
              {profileDraft.fewShotExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 text-xs relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">
                      {ex.platform} Exemplar #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExample(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove exemplar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <pre className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed text-xs">
                    {ex.sampleText}
                  </pre>
                </div>
              ))}
            </div>

            {/* Add New Exemplar */}
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Add New Training Exemplar
                </span>
                <select
                  value={newExamplePlatform}
                  onChange={(e) => setNewExamplePlatform(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>

              <textarea
                rows={3}
                value={newExampleText}
                onChange={(e) => setNewExampleText(e.target.value)}
                placeholder="Paste an authentic post you wrote that performed exceptionally well..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-y"
              />

              <button
                type="button"
                onClick={handleAddExample}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Memory Bank</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Calibration Modal */}
      <VoiceTrainModal
        isOpen={isTrainModalOpen}
        onClose={() => setIsTrainModalOpen(false)}
        onProfileCreated={(newProfile) => {
          onAddProfile?.(newProfile);
          onSelectProfile(newProfile.id);
          setProfileDraft(newProfile);
        }}
      />
    </div>
  );
};
