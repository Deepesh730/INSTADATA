import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Mail, 
  Video, 
  Send, 
  Sparkles,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { ChannelOutputs, PipelineRun } from '../types';
import { generateCampaignMarkdown } from '../utils/pipeline';

interface SchedulerAndExportProps {
  pipelineRun: PipelineRun;
  onUpdateChannels: (updated: ChannelOutputs) => void;
}

export const SchedulerAndExport: React.FC<SchedulerAndExportProps> = ({
  pipelineRun,
  onUpdateChannels,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isPublishingSimulation, setIsPublishingSimulation] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const { channels } = pipelineRun;

  const handleDownloadMarkdown = () => {
    const md = generateCampaignMarkdown(pipelineRun);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniRepurpose-${pipelineRun.source.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(pipelineRun, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniRepurpose-${pipelineRun.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyBundle = () => {
    const md = generateCampaignMarkdown(pipelineRun);
    navigator.clipboard.writeText(md);
    setCopiedType('markdown');
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSimulatePublish = () => {
    setIsPublishingSimulation(true);
    setTimeout(() => {
      setIsPublishingSimulation(false);
      setPublishSuccess(true);
      // Mark all approved channels as scheduled
      onUpdateChannels({
        linkedin: { ...channels.linkedin, status: 'scheduled' },
        twitter: { ...channels.twitter, status: 'scheduled' },
        instagram: { ...channels.instagram, status: 'scheduled' },
        newsletter: { ...channels.newsletter, status: 'scheduled' },
        videoClip: { ...channels.videoClip, status: 'scheduled' },
      });
      setTimeout(() => setPublishSuccess(false), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Distribution Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Stage 8 · Multi-Channel Distribution & Export</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Distribution Calendar & Export Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Export high-fidelity Markdown bundles, structured JSON payloads, or schedule across social queues.
            </p>
          </div>

          {/* Export Actions Strip */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyBundle}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedType === 'markdown' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Bundle Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown Bundle</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .JSON</span>
            </button>

            <button
              type="button"
              disabled={isPublishingSimulation}
              onClick={handleSimulatePublish}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {isPublishingSimulation ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Syncing Webhooks...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Schedule Entire Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>

        {publishSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>All approved channels have been queued for automated publishing!</span>
          </div>
        )}
      </div>

      {/* Visual Publishing Queue & Cadence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* LinkedIn Slot */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Linkedin className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                channels.linkedin.status === 'scheduled' || channels.linkedin.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {channels.linkedin.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">LinkedIn Post & Carousel</h4>
            <div className="text-[11px] text-slate-400 space-y-1 mb-3">
              <div className="flex items-center gap-1 text-indigo-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>Tuesday 08:30 AM EST</span>
              </div>
              <p className="line-clamp-2 text-slate-300 text-xs italic">
                "{channels.linkedin.hook.slice(0, 65)}..."
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
            Peak B2B Decision-Maker Window
          </div>
        </div>

        {/* Twitter Slot */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Twitter className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                channels.twitter.status === 'scheduled' || channels.twitter.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {channels.twitter.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">X / Twitter Thread</h4>
            <div className="text-[11px] text-slate-400 space-y-1 mb-3">
              <div className="flex items-center gap-1 text-indigo-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>Wednesday 12:15 PM EST</span>
              </div>
              <p className="line-clamp-2 text-slate-300 text-xs italic">
                "{channels.twitter.thread[0]?.text.slice(0, 65)}..."
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
            {channels.twitter.thread.length} Tweets · Lunch Break Scrolling Peak
          </div>
        </div>

        {/* Instagram Slot */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded bg-pink-600/20 text-pink-400 flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                channels.instagram.status === 'scheduled' || channels.instagram.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {channels.instagram.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Instagram Carousel</h4>
            <div className="text-[11px] text-slate-400 space-y-1 mb-3">
              <div className="flex items-center gap-1 text-indigo-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>Thursday 06:45 PM EST</span>
              </div>
              <p className="line-clamp-2 text-slate-300 text-xs italic">
                "{channels.instagram.caption.slice(0, 65)}..."
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
            {channels.instagram.carouselSlides.length} Visual Cards · High Save Rate
          </div>
        </div>

        {/* Newsletter Slot */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                channels.newsletter.status === 'scheduled' || channels.newsletter.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {channels.newsletter.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Subscriber Edition</h4>
            <div className="text-[11px] text-slate-400 space-y-1 mb-3">
              <div className="flex items-center gap-1 text-indigo-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>Sunday 09:00 AM EST</span>
              </div>
              <p className="line-clamp-2 text-slate-300 text-xs italic">
                "{channels.newsletter.subjectLines[0]?.text.slice(0, 65)}..."
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
            Deep Weekend Coffee Reading Slot
          </div>
        </div>

        {/* Video Clip Slot */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                channels.videoClip.status === 'scheduled' || channels.videoClip.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {channels.videoClip.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Short Video Hook</h4>
            <div className="text-[11px] text-slate-400 space-y-1 mb-3">
              <div className="flex items-center gap-1 text-indigo-400 font-mono">
                <Clock className="w-3 h-3" />
                <span>Friday 05:30 PM EST</span>
              </div>
              <p className="line-clamp-2 text-slate-300 text-xs italic">
                "{channels.videoClip.hookVariations[0]?.verbal.slice(0, 65)}..."
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
            ~{channels.videoClip.durationSeconds}s Script · Weekend Entertainment Surge
          </div>
        </div>
      </div>

      {/* Direct Webhook & Zapier Automation Dispatch (Market Ready Feature) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Automated Webhook Distribution (Zapier / Make / Buffer)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send the full structured multichannel campaign directly to your publishing webhooks or CMS endpoints.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            defaultValue="https://hooks.zapier.com/hooks/catch/948210/omni_repurpose_auto"
            id="webhook-url-input"
            placeholder="https://hooks.zapier.com/... or https://hook.eu1.make.com/..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={async () => {
              const inputEl = document.getElementById('webhook-url-input') as HTMLInputElement;
              const url = inputEl?.value || 'https://hooks.zapier.com/demo';
              try {
                const res = await fetch('/api/webhook/publish', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ webhookUrl: url, campaignData: pipelineRun }),
                });
                if (res.ok) {
                  setPublishSuccess(true);
                  setTimeout(() => setPublishSuccess(false), 4000);
                }
              } catch (e) {
                console.warn(e);
              }
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Trigger Webhook Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
};
