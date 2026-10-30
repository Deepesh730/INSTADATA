import {
  ChannelOutputs,
  ContentSourceType,
  ExtractedInsights,
  IngestionMetadata,
  PipelineRun,
  TokenMetrics,
  TranscriptionData
} from '../types';

/**
 * Calculates word count from a text string
 */
export function calculateWordCount(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Estimates reading time in minutes (based on 200 words per minute)
 */
export function estimateReadingTime(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Formats seconds into MM:SS format
 */
export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculates Token metrics and cost comparison between Gemini Flash and Traditional Multi-Model Stack
 * Gemini 3.8 Flash: ~$0.10 per 1M input tokens, ~$0.40 per 1M output tokens
 * Traditional multi-model stack (Whisper API + Claude 3.5 Sonnet / GPT-4o):
 * ~$3.00 - $5.00 per 1M input, $15.00 per 1M output, + $0.006 per min audio
 */
export function calculateTokenAndCostMetrics(
  inputWordCount: number,
  outputWordCount: number,
  audioDurationSeconds: number = 0,
  processingTimeMs: number = 1420
): TokenMetrics {
  // Approximate 1 word = ~1.33 tokens
  const inputTokens = Math.max(100, Math.round(inputWordCount * 1.33));
  const outputTokens = Math.max(200, Math.round(outputWordCount * 1.33));
  const totalTokens = inputTokens + outputTokens;

  // Gemini 3.8 Flash Pricing: $0.10 / 1M input, $0.40 / 1M output
  const geminiInputCost = (inputTokens / 1_000_000) * 0.10;
  const geminiOutputCost = (outputTokens / 1_000_000) * 0.40;
  const geminiCostUsd = Number((geminiInputCost + geminiOutputCost).toFixed(6));

  // Traditional Multi-Model Stack Pricing:
  // Whisper ($0.006/min) + GPT-4o / Claude ($3.00/1M input + $15.00/1M output)
  const audioMinutes = audioDurationSeconds / 60;
  const whisperCost = audioMinutes * 0.006;
  const traditionalInputCost = (inputTokens / 1_000_000) * 3.50;
  const traditionalOutputCost = (outputTokens / 1_000_000) * 15.00;
  const traditionalCostUsd = Number((whisperCost + traditionalInputCost + traditionalOutputCost).toFixed(4));

  const savingsPercentage = traditionalCostUsd > 0
    ? Math.min(99.4, Math.round(((traditionalCostUsd - geminiCostUsd) / traditionalCostUsd) * 1000) / 10)
    : 94.5;

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    geminiCostUsd,
    traditionalCostUsd: Math.max(0.045, traditionalCostUsd),
    savingsPercentage,
    processingTimeMs
  };
}

/**
 * Validates text or source input
 */
export function validateSourceInput(content: string, type: ContentSourceType): { isValid: boolean; error?: string } {
  if (!content || !content.trim()) {
    return { isValid: false, error: 'Please provide content, paste text, or upload an audio file.' };
  }

  if (type === 'youtube_url' || type === 'podcast_url') {
    const isUrl = /^https?:\/\/.+/i.test(content.trim());
    if (!isUrl) {
      return { isValid: false, error: 'Please enter a valid URL (starting with http:// or https://).' };
    }
  }

  if (type === 'raw_text' && content.trim().length < 40) {
    return { isValid: false, error: 'Input text is too short. Please provide at least 40 characters for meaningful insight extraction.' };
  }

  return { isValid: true };
}

/**
 * Generates an aggregated Markdown bundle ready for export or download
 */
export function generateCampaignMarkdown(run: PipelineRun): string {
  const { source, ingestion, insights, styleProfile, channels } = run;

  const dateStr = new Date().toISOString().split('T')[0];

  return `# OmniRepurpose Campaign: ${source.title}
Generated: ${dateStr}
Style Profile: ${styleProfile.name} (${styleProfile.role})
Original Source: ${source.type} | ${ingestion.wordCount} words | ${formatSecondsToTime(ingestion.durationSeconds)} duration

---

## 📌 Executive Insights & Golden Nuggets

### Core Summary
${insights.coreSummary}

### 3 Key Takeaways
${insights.takeaways.map((t, idx) => `${idx + 1}. **${t.title}** (${t.impact} Impact)\n   ${t.explanation}`).join('\n\n')}

### Golden Quotes
${insights.goldenQuotes.map(q => `> "${q.quote}"\n> — *${q.context}*`).join('\n\n')}

### Action Framework: ${insights.actionFramework.name}
${insights.actionFramework.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## 💼 1. LinkedIn Post
**Status:** ${channels.linkedin.status.toUpperCase()} | **Scheduled:** ${channels.linkedin.scheduledFor}

${channels.linkedin.hook}

${channels.linkedin.body}

${channels.linkedin.callToAction}

${channels.linkedin.hashtags.join(' ')}

### Carousel Slides Outline:
${channels.linkedin.carouselSlides.map(s => `#### Slide ${s.slideNumber}: ${s.title}
${s.bullets.map(b => `- ${b}`).join('\n')}
*Design Note: ${s.designNote}*`).join('\n\n')}

---

## 🐦 2. Twitter / X Thread
**Status:** ${channels.twitter.status.toUpperCase()} | **Scheduled:** ${channels.twitter.scheduledFor}

${channels.twitter.thread.map(t => `### Tweet ${t.index}/${channels.twitter.thread.length} (${t.charCount} chars)
${t.text}
${t.visualPrompt ? `*[Visual Suggestion: ${t.visualPrompt}]*` : ''}`).join('\n\n')}

**Closing CTA:** ${channels.twitter.callToAction}
**Tags:** ${channels.twitter.hashtags.join(' ')}

---

## 📸 3. Instagram Carousel & Caption
**Status:** ${channels.instagram.status.toUpperCase()} | **Scheduled:** ${channels.instagram.scheduledFor}

### Caption:
${channels.instagram.caption}

### Carousel Frames:
${channels.instagram.carouselSlides.map(s => `#### Frame ${s.slideNumber}: ${s.headline}
- **Overlay Text:** ${s.textOverlay}
- **Visual:** ${s.visualDescription}
- **Accent:** ${s.accentColor}`).join('\n\n')}

### First Comment Hashtag Strategy:
- **Niche:** ${channels.instagram.firstCommentHashtags.niche.join(' ')}
- **Category:** ${channels.instagram.firstCommentHashtags.category.join(' ')}
- **Reach:** ${channels.instagram.firstCommentHashtags.reach.join(' ')}

---

## 📧 4. Newsletter Edition
**Status:** ${channels.newsletter.status.toUpperCase()} | **Scheduled:** ${channels.newsletter.scheduledFor}

### Subject Line Tests:
${channels.newsletter.subjectLines.map(s => `- [${s.variant}] "${s.text}" (Est. Open: ${s.predictedOpenRate})`).join('\n')}

**Preview Text:** ${channels.newsletter.previewText}

### TL;DR:
${channels.newsletter.tldr.map(p => `- ${p}`).join('\n')}

### Deep Dive:
${channels.newsletter.deepDiveMarkdown}

### 💡 Weekly Action Item:
${channels.newsletter.actionableTakeaway}

**P.S.:** ${channels.newsletter.postScript}

---

## 🎬 5. Short Video Script (Reels / TikTok / Shorts)
**Status:** ${channels.videoClip.status.toUpperCase()} | **Duration:** ~${channels.videoClip.durationSeconds}s

### Hook Variations:
${channels.videoClip.hookVariations.map((h, i) => `${i + 1}. **Verbal:** "${h.verbal}"\n   **Visual Cue:** [${h.visualCue}]`).join('\n')}

### Storyboard & Teleprompter:
${channels.videoClip.storyboard.map(scene => `#### [${scene.timeRange}]
- **Spoken:** "${scene.teleprompterText}"
- **B-Roll / Visual:** ${scene.visualBroll}
- **On-screen Text:** ${scene.textOverlay}
- **SFX:** ${scene.sfxCues}`).join('\n\n')}

**Video Caption:** ${channels.videoClip.caption}
`;
}
