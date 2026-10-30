import React, { useState } from 'react';
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  Video, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Edit3, 
  Play, 
  Pause, 
  RotateCcw,
  Smartphone,
  Eye,
  Sliders,
  Share2,
  Download,
  ExternalLink,
  Tv
} from 'lucide-react';
import { ApprovalStatus, ChannelOutputs, StyleProfile } from '../types';
import { exportSlideAsPng } from '../utils/carouselRenderer';
import { TeleprompterModal } from './TeleprompterModal';

interface ChannelsWorkspaceProps {
  channels: ChannelOutputs;
  onUpdateChannels: (updated: ChannelOutputs) => void;
  styleProfile: StyleProfile;
  onRefinePost?: (platform: string, currentContent: any, instruction: string) => Promise<string | void>;
  onSwitchToIngestion?: () => void;
}

type ChannelKey = 'linkedin' | 'twitter' | 'instagram' | 'newsletter' | 'videoClip';

export const ChannelsWorkspace: React.FC<ChannelsWorkspaceProps> = ({
  channels,
  onUpdateChannels,
  styleProfile,
  onRefinePost,
  onSwitchToIngestion,
}) => {
  const [activeChannel, setActiveChannel] = useState<ChannelKey>('linkedin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeIgSlide, setActiveIgSlide] = useState(0);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('preview');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStatusChange = (channelKey: ChannelKey, newStatus: ApprovalStatus) => {
    onUpdateChannels({
      ...channels,
      [channelKey]: {
        ...channels[channelKey],
        status: newStatus
      }
    });
  };

  const handleQuickRefine = async (instruction: string) => {
    if (!onRefinePost) return;
    setIsRefining(true);
    try {
      let content = '';
      if (activeChannel === 'linkedin') content = `${channels.linkedin.hook}\n\n${channels.linkedin.body}`;
      else if (activeChannel === 'twitter') content = channels.twitter.thread.map(t => t.text).join('\n\n');
      else if (activeChannel === 'instagram') content = channels.instagram.caption;
      else if (activeChannel === 'newsletter') content = channels.newsletter.deepDiveMarkdown;
      else if (activeChannel === 'videoClip') content = channels.videoClip.storyboard.map(s => s.teleprompterText).join('\n');

      const refined = await onRefinePost(activeChannel, content, instruction);
      if (refined && typeof refined === 'string') {
        if (activeChannel === 'linkedin') {
          onUpdateChannels({
            ...channels,
            linkedin: { ...channels.linkedin, body: refined }
          });
        } else if (activeChannel === 'instagram') {
          onUpdateChannels({
            ...channels,
            instagram: { ...channels.instagram, caption: refined }
          });
        }
      }
    } finally {
      setIsRefining(false);
      setRefineInstruction('');
    }
  };

  const currentChannelData = channels[activeChannel];

  return (
    <div className="space-y-6">
      {/* Channel Header Navigation & Human Approval Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>Stage 6 & 7</span>
              <span className="text-slate-600">·</span>
              <span>Multi-Channel Generation & Human Approval</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              Channel Workspaces & Live Feed Previews
            </h2>
          </div>

          {/* View Mode Switcher & Global Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'preview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Device Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('editor')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'editor'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Text Editor</span>
              </button>
            </div>

            {/* Approval State Segmented Controller */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['draft', 'in_review', 'approved', 'scheduled'] as ApprovalStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(activeChannel, st)}
                  className={`px-2.5 py-1 text-[11px] font-semibold capitalize rounded-md transition-colors ${
                    currentChannelData.status === st
                      ? st === 'approved' || st === 'scheduled'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5 Channel Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveChannel('linkedin')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
              activeChannel === 'linkedin'
                ? 'bg-indigo-950/70 border-indigo-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Linkedin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block">LinkedIn</span>
              <span className="text-[10px] text-slate-400 capitalize">
                {channels.linkedin.status}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('twitter')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
              activeChannel === 'twitter'
                ? 'bg-indigo-950/70 border-indigo-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Twitter className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block">X / Twitter</span>
              <span className="text-[10px] text-slate-400 capitalize">
                {channels.twitter.thread.length} Tweets · {channels.twitter.status}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('instagram')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
              activeChannel === 'instagram'
                ? 'bg-indigo-950/70 border-indigo-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block">Instagram</span>
              <span className="text-[10px] text-slate-400 capitalize">
                {channels.instagram.carouselSlides.length} Slides · {channels.instagram.status}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('newsletter')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
              activeChannel === 'newsletter'
                ? 'bg-indigo-950/70 border-indigo-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block">Newsletter</span>
              <span className="text-[10px] text-slate-400 capitalize">
                {channels.newsletter.estimatedReadTime} · {channels.newsletter.status}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('videoClip')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 col-span-2 sm:col-span-1 ${
              activeChannel === 'videoClip'
                ? 'bg-indigo-950/70 border-indigo-500 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block">Short Video</span>
              <span className="text-[10px] text-slate-400 capitalize">
                ~{channels.videoClip.durationSeconds}s · {channels.videoClip.status}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* AI Refinement & Editorial Quick-Actions Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 w-full sm:w-auto">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>AI Refine Tools:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Make hook punchier and more scroll-stopping')}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/60 transition-colors"
            >
              Punchier Hook
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Shorten by 25% and remove filler words')}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/60 transition-colors"
            >
              Shorten 25%
            </button>
            <button
              type="button"
              disabled={isRefining}
              onClick={() => handleQuickRefine('Add concrete tactical numbers and steps')}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700/60 transition-colors"
            >
              Add Tactical Data
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* LinkedIn Slide Exporter */}
          {activeChannel === 'linkedin' && channels.linkedin.carouselSlides.length > 0 && (
            <button
              type="button"
              onClick={() => {
                channels.linkedin.carouselSlides.forEach((slide, idx) => {
                  setTimeout(() => {
                    exportSlideAsPng(
                      slide,
                      idx,
                      channels.linkedin.carouselSlides.length,
                      styleProfile.name,
                      '#6366f1'
                    );
                  }, idx * 250);
                });
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              title="Download all carousel slides as 1080x1080 PNG images"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Carousel PNGs</span>
            </button>
          )}

          {/* Instagram Slide Exporter */}
          {activeChannel === 'instagram' && channels.instagram.carouselSlides.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const currentSlide = channels.instagram.carouselSlides[activeIgSlide];
                if (currentSlide) {
                  exportSlideAsPng(
                    currentSlide,
                    activeIgSlide,
                    channels.instagram.carouselSlides.length,
                    styleProfile.name,
                    currentSlide.accentColor || '#ec4899'
                  );
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              title="Download current slide as PNG"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>Download Slide #{activeIgSlide + 1} PNG</span>
            </button>
          )}

          {/* Twitter Web Intent */}
          {activeChannel === 'twitter' && channels.twitter.thread.length > 0 && (
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                channels.twitter.thread[0]?.text || ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Post Hook to X</span>
            </a>
          )}

          {/* Video Teleprompter Launcher */}
          {activeChannel === 'videoClip' && (
            <button
              type="button"
              onClick={() => setIsTeleprompterOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Launch Teleprompter Studio</span>
            </button>
          )}

          {/* Copy Current Channel Output Button */}
          <button
            type="button"
            onClick={() => {
              let fullText = '';
              if (activeChannel === 'linkedin') fullText = `${channels.linkedin.hook}\n\n${channels.linkedin.body}\n\n${channels.linkedin.callToAction}\n\n${channels.linkedin.hashtags.join(' ')}`;
              else if (activeChannel === 'twitter') fullText = channels.twitter.thread.map(t => `${t.index}/${channels.twitter.thread.length}\n${t.text}`).join('\n\n');
              else if (activeChannel === 'instagram') fullText = `${channels.instagram.caption}\n\nFirst Comment Hashtags:\n${channels.instagram.firstCommentHashtags.niche.join(' ')}`;
              else if (activeChannel === 'newsletter') fullText = `# ${channels.newsletter.subjectLines[0]?.text}\n\n${channels.newsletter.deepDiveMarkdown}`;
              else if (activeChannel === 'videoClip') fullText = channels.videoClip.storyboard.map(s => `[${s.timeRange}] ${s.teleprompterText} (B-Roll: ${s.visualBroll})`).join('\n\n');
              copyToClipboard(fullText, activeChannel);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedKey === activeChannel ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Post</span>
              </>
            )}
          </button>

          {/* Quick Live Voice Ingestion Trigger */}
          {onSwitchToIngestion && (
            <button
              type="button"
              onClick={onSwitchToIngestion}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
              title="Record live audio or ingest new text/video"
            >
              <span>🎙️ Live Ingest</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Channel Surface: Split between Interactive Feed Preview & Text / Outlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Device Mockup / Live Feed Preview (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Native Feed Simulation ({activeChannel})
            </span>
            <span className="text-[11px] text-slate-400">
              Author: {styleProfile.name}
            </span>
          </div>

          {/* LINKEDIN PREVIEW */}
          {activeChannel === 'linkedin' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-100 max-w-xl mx-auto shadow-2xl">
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={styleProfile.avatarUrl || '/src/assets/images/creator_profile_avatar_1793360171826.jpg'}
                  alt={styleProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{styleProfile.name}</span>
                    <span className="text-slate-500 font-normal">· 1st</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{styleProfile.role}</p>
                  <p className="text-[10px] text-slate-500">1h · Edited · 🌐</p>
                </div>
              </div>

              {/* Hook (Before Fold) */}
              <div className="text-xs text-slate-100 font-medium whitespace-pre-line leading-relaxed mb-3">
                {channels.linkedin.hook}
              </div>

              {/* Body */}
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed space-y-2 mb-4">
                {channels.linkedin.body}
              </div>

              {/* CTA & Hashtags */}
              <div className="text-xs font-medium text-slate-200 mb-2">
                {channels.linkedin.callToAction}
              </div>
              <div className="text-xs text-indigo-400 font-semibold mb-4">
                {channels.linkedin.hashtags.join(' ')}
              </div>

              {/* Carousel Document Teaser */}
              {channels.linkedin.carouselSlides.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-200">
                      📄 Document ({channels.linkedin.carouselSlides.length} pages)
                    </span>
                    <span className="text-indigo-400">Swipe Carousel</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded border border-slate-800/80">
                    <h5 className="text-sm font-bold text-white mb-2">
                      Slide 1: {channels.linkedin.carouselSlides[0]?.title}
                    </h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                      {channels.linkedin.carouselSlides[0]?.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Engagement Bar Simulation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                <span>👍 148 · 💬 42 comments</span>
                <span>{channels.linkedin.estimatedReads} estimated reads</span>
              </div>
            </div>
          )}

          {/* TWITTER / X THREAD PREVIEW */}
          {activeChannel === 'twitter' && (
            <div className="space-y-4 max-w-xl mx-auto">
              {channels.twitter.thread.map((tweet) => (
                <div
                  key={tweet.index}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 relative"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={styleProfile.avatarUrl || '/src/assets/images/creator_profile_avatar_1793360171826.jpg'}
                      alt={styleProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-white truncate">{styleProfile.name}</span>
                          <span className="text-slate-500 truncate">@{styleProfile.name.toLowerCase().replace(/\s+/g, '')}</span>
                          <span className="text-slate-500">· 2h</span>
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400 shrink-0">
                          {tweet.index}/{channels.twitter.thread.length}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed mb-2.5">
                        {tweet.text}
                      </p>

                      {tweet.visualPrompt && (
                        <div className="bg-slate-900 border border-slate-800/80 rounded p-2 text-[11px] text-slate-400 italic mb-2">
                          🖼️ Visual Cue: {tweet.visualPrompt}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>💬 18</span>
                        <span>🔄 34</span>
                        <span>❤️ 192</span>
                        <span className="font-mono tabular-nums">{tweet.charCount}/280</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INSTAGRAM CAROUSEL PREVIEW */}
          {activeChannel === 'instagram' && (
            <div className="max-w-md mx-auto space-y-4">
              {/* Carousel Slide Card with Navigation */}
              <div 
                className="aspect-square rounded-2xl border border-slate-800 p-6 flex flex-col justify-between text-white relative shadow-2xl transition-all"
                style={{
                  background: `linear-gradient(145deg, #090d16 0%, ${channels.instagram.carouselSlides[activeIgSlide]?.accentColor || '#4f46e5'}25 100%)`
                }}
              >
                {/* Slide Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                    {channels.instagram.carouselSlides[activeIgSlide]?.headline}
                  </span>
                  <span className="text-xs font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-300">
                    {activeIgSlide + 1} / {channels.instagram.carouselSlides.length}
                  </span>
                </div>

                {/* Big Bold Slide Content */}
                <div className="my-auto text-center py-6">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
                    {channels.instagram.carouselSlides[activeIgSlide]?.textOverlay}
                  </h3>
                  <p className="text-xs text-slate-400 italic max-w-xs mx-auto">
                    Visual Note: {channels.instagram.carouselSlides[activeIgSlide]?.visualDescription}
                  </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={activeIgSlide === 0}
                    onClick={() => setActiveIgSlide(prev => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-full bg-slate-900/80 text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {channels.instagram.carouselSlides.map((_, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === activeIgSlide ? 'w-4 bg-indigo-500' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={activeIgSlide === channels.instagram.carouselSlides.length - 1}
                    onClick={() => setActiveIgSlide(prev => Math.min(channels.instagram.carouselSlides.length - 1, prev + 1))}
                    className="p-1.5 rounded-full bg-slate-900/80 text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Caption & First Comment */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
                <div>
                  <span className="font-bold text-white mr-1.5">{styleProfile.name.toLowerCase().replace(/\s+/g, '')}</span>
                  <span className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {channels.instagram.caption}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-400 block mb-1">First Comment Hashtags:</span>
                  <p className="text-slate-400">
                    {channels.instagram.firstCommentHashtags.niche.join(' ')} {channels.instagram.firstCommentHashtags.category.join(' ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NEWSLETTER PREVIEW */}
          {activeChannel === 'newsletter' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-200 max-w-xl mx-auto space-y-4">
              {/* Inbox Header Simulation */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>From: {styleProfile.name} &lt;updates@repurpose.studio&gt;</span>
                  <span>Today, 9:00 AM</span>
                </div>
                <div className="font-bold text-white text-sm">
                  Subject: {channels.newsletter.subjectLines[0]?.text}
                </div>
                <div className="text-slate-400 text-xs">
                  Preview: {channels.newsletter.previewText}
                </div>
              </div>

              {/* TL;DR Box */}
              <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-lg p-3 text-xs">
                <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block mb-1.5">
                  Executive TL;DR
                </span>
                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                  {channels.newsletter.tldr.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>

              {/* Deep Dive Prose */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line prose prose-invert prose-sm">
                {channels.newsletter.deepDiveMarkdown}
              </div>

              {/* Action Item */}
              <div className="bg-slate-900 border border-emerald-800/60 rounded-lg p-3 text-xs">
                <span className="font-bold text-emerald-400 text-[10px] uppercase tracking-wider block mb-1">
                  💡 This Week's Concrete Exercise
                </span>
                <p className="text-slate-300">{channels.newsletter.actionableTakeaway}</p>
              </div>

              {/* PostScript */}
              <div className="text-xs text-slate-400 italic pt-2 border-t border-slate-800">
                {channels.newsletter.postScript}
              </div>
            </div>
          )}

          {/* SHORT VIDEO CLIP STORYBOARD & TELEPROMPTER */}
          {activeChannel === 'videoClip' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* 9:16 Smartphone Mockup with Teleprompter */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between text-white shadow-2xl aspect-[9/16] relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
                  <span className="font-semibold text-white">Reels / Shorts</span>
                  <span className="font-mono text-rose-400">REC 00:45</span>
                </div>

                {/* Teleprompter Text Display */}
                <div className="my-auto py-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block mb-1">
                    Spoken Script
                  </span>
                  <p className="text-sm font-bold text-white leading-relaxed">
                    "{channels.videoClip.storyboard[0]?.teleprompterText}"
                  </p>
                  <div className="mt-3 inline-block bg-rose-950/80 border border-rose-700/60 px-2.5 py-1 rounded text-[10px] font-mono text-rose-300">
                    Overlay: {channels.videoClip.storyboard[0]?.textOverlay}
                  </div>
                </div>

                {/* Video controls */}
                <div className="z-10 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>B-Roll: Talking Head</span>
                    <span className="font-mono">{channels.videoClip.durationSeconds}s</span>
                  </div>
                </div>
              </div>

              {/* Storyboard Cue Cards */}
              <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Storyboard Scene Breakdown
                </h4>
                {channels.videoClip.storyboard.map((scene, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-indigo-400 font-bold">
                      <span>Scene {idx + 1}</span>
                      <span>[{scene.timeRange}]</span>
                    </div>
                    <p className="text-slate-200 font-medium">"{scene.teleprompterText}"</p>
                    <div className="text-[11px] text-slate-400">
                      <span className="text-slate-500">Visual:</span> {scene.visualBroll}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span className="text-slate-500">SFX:</span> {scene.sfxCues}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Direct Text Editor & Slide Structure (Spans 5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  In-Place Content Editor
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Human Editor-in-Chief</span>
            </div>

            {/* Editable Form depending on active channel */}
            {activeChannel === 'linkedin' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Viral Hook (Above 'See more' fold):
                  </label>
                  <textarea
                    rows={3}
                    value={channels.linkedin.hook}
                    onChange={(e) =>
                      onUpdateChannels({
                        ...channels,
                        linkedin: { ...channels.linkedin, hook: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Body & Takeaway Meat:
                  </label>
                  <textarea
                    rows={8}
                    value={channels.linkedin.body}
                    onChange={(e) =>
                      onUpdateChannels({
                        ...channels,
                        linkedin: { ...channels.linkedin, body: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Call To Action:
                  </label>
                  <input
                    type="text"
                    value={channels.linkedin.callToAction}
                    onChange={(e) =>
                      onUpdateChannels({
                        ...channels,
                        linkedin: { ...channels.linkedin, callToAction: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeChannel === 'twitter' && (
              <div className="space-y-3 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">
                  Thread Tweets ({channels.twitter.thread.length}):
                </span>
                {channels.twitter.thread.map((tweet, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-[10px] text-indigo-400 block mb-1">
                      Tweet {idx + 1} ({tweet.text.length} chars)
                    </span>
                    <textarea
                      rows={3}
                      value={tweet.text}
                      onChange={(e) => {
                        const updated = [...channels.twitter.thread];
                        updated[idx] = { ...tweet, text: e.target.value, charCount: e.target.value.length };
                        onUpdateChannels({
                          ...channels,
                          twitter: { ...channels.twitter, thread: updated }
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeChannel === 'instagram' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Post Caption:
                  </label>
                  <textarea
                    rows={6}
                    value={channels.instagram.caption}
                    onChange={(e) =>
                      onUpdateChannels({
                        ...channels,
                        instagram: { ...channels.instagram, caption: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-y"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Active Slide Overlay ({activeIgSlide + 1}):
                  </label>
                  <input
                    type="text"
                    value={channels.instagram.carouselSlides[activeIgSlide]?.textOverlay || ''}
                    onChange={(e) => {
                      const updated = [...channels.instagram.carouselSlides];
                      if (updated[activeIgSlide]) {
                        updated[activeIgSlide] = { ...updated[activeIgSlide], textOverlay: e.target.value };
                        onUpdateChannels({
                          ...channels,
                          instagram: { ...channels.instagram, carouselSlides: updated }
                        });
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {activeChannel === 'newsletter' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Winning Subject Line:
                  </label>
                  <input
                    type="text"
                    value={channels.newsletter.subjectLines[0]?.text || ''}
                    onChange={(e) => {
                      const updated = [...channels.newsletter.subjectLines];
                      if (updated[0]) updated[0].text = e.target.value;
                      onUpdateChannels({
                        ...channels,
                        newsletter: { ...channels.newsletter, subjectLines: updated }
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Newsletter Deep Dive Markdown:
                  </label>
                  <textarea
                    rows={9}
                    value={channels.newsletter.deepDiveMarkdown}
                    onChange={(e) =>
                      onUpdateChannels({
                        ...channels,
                        newsletter: { ...channels.newsletter, deepDiveMarkdown: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 resize-y"
                  />
                </div>
              </div>
            )}

            {activeChannel === 'videoClip' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Primary Spoken Hook:
                  </label>
                  <textarea
                    rows={3}
                    value={channels.videoClip.hookVariations[0]?.verbal || ''}
                    onChange={(e) => {
                      const updated = [...channels.videoClip.hookVariations];
                      if (updated[0]) updated[0].verbal = e.target.value;
                      onUpdateChannels({
                        ...channels,
                        videoClip: { ...channels.videoClip, hookVariations: updated }
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Video Caption & Hashtags:
                  </label>
                  <textarea
                    rows={5}
                    value={channels.videoClip.caption}
                    onChange={(e) =>
                      onUpdateChannels({
                        ...channels,
                        videoClip: { ...channels.videoClip, caption: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Schedule Date Indicator */}
          <div className="pt-4 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Cadence:</span>
            </div>
            <span className="font-mono text-slate-200">
              {currentChannelData.scheduledFor || 'Auto-Scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Teleprompter Studio */}
      <TeleprompterModal
        videoClip={channels.videoClip}
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
      />
    </div>
  );
};
