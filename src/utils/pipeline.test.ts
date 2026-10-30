import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWordCount,
  estimateReadingTime,
  formatSecondsToTime,
  calculateTokenAndCostMetrics,
  validateSourceInput,
  generateCampaignMarkdown
} from './pipeline';
import { PipelineRun } from '../types';

test('calculateWordCount handles strings and empty values', () => {
  assert.equal(calculateWordCount(''), 0);
  assert.equal(calculateWordCount('   '), 0);
  assert.equal(calculateWordCount('Building an AI content repurposing pipeline'), 6);
  assert.equal(calculateWordCount('  Line one\n\nLine two with multiple   spaces  '), 7);
});

test('estimateReadingTime calculates expected minutes', () => {
  assert.equal(estimateReadingTime(0), 0);
  assert.equal(estimateReadingTime(100), 1);
  assert.equal(estimateReadingTime(200), 1);
  assert.equal(estimateReadingTime(450), 3);
});

test('formatSecondsToTime formats MM:SS correctly', () => {
  assert.equal(formatSecondsToTime(0), '00:00');
  assert.equal(formatSecondsToTime(65), '01:05');
  assert.equal(formatSecondsToTime(600), '10:00');
  assert.equal(formatSecondsToTime(3665), '61:05');
  assert.equal(formatSecondsToTime(-10), '00:00');
});

test('calculateTokenAndCostMetrics calculates accurate tokens and savings', () => {
  const metrics = calculateTokenAndCostMetrics(1000, 2000, 300, 1200);
  assert.ok(metrics.inputTokens > 1000);
  assert.ok(metrics.outputTokens > 2000);
  assert.ok(metrics.totalTokens === metrics.inputTokens + metrics.outputTokens);
  assert.ok(metrics.geminiCostUsd < metrics.traditionalCostUsd);
  assert.ok(metrics.savingsPercentage > 80);
});

test('validateSourceInput catches empty content and short text', () => {
  const emptyRes = validateSourceInput('', 'raw_text');
  assert.equal(emptyRes.isValid, false);

  const shortRes = validateSourceInput('Too short', 'raw_text');
  assert.equal(shortRes.isValid, false);

  const validTextRes = validateSourceInput(
    'This is a valid long text excerpt with enough substantive content to be processed by the insight extractor.',
    'raw_text'
  );
  assert.equal(validTextRes.isValid, true);

  const invalidUrlRes = validateSourceInput('not a url', 'youtube_url');
  assert.equal(invalidUrlRes.isValid, false);

  const validUrlRes = validateSourceInput('https://youtube.com/watch?v=12345', 'youtube_url');
  assert.equal(validUrlRes.isValid, true);
});

test('generateCampaignMarkdown formats full bundle', () => {
  const mockRun: PipelineRun = {
    id: 'test-run-1',
    timestamp: '2026-10-30T10:00:00Z',
    activeStage: 'completed',
    stageProgress: 100,
    stageMessage: 'Completed',
    source: {
      title: 'Building Modern AI Systems',
      type: 'raw_text',
      rawContent: 'Sample content here...'
    },
    ingestion: {
      title: 'Building Modern AI Systems',
      sourceType: 'raw_text',
      wordCount: 500,
      durationSeconds: 150,
      readingTimeMinutes: 3,
      detectedSpeakers: ['Deepesh'],
      uploadedAt: '2026-10-30'
    },
    transcription: {
      provider: 'Gemini Multimodal Audio',
      fullText: 'Sample transcription',
      confidence: 0.98,
      segments: []
    },
    insights: {
      coreSummary: 'AI pipelines require voice memory and rapid multichannel distillation.',
      takeaways: [
        { id: '1', title: 'Speed matters', explanation: 'Instant generation retains focus.', impact: 'High' }
      ],
      goldenQuotes: [{ quote: 'Content is leverage.', context: 'Opening remark' }],
      counterIntuitiveAngles: ['Repurposing is not duplicating.'],
      audiencePainPoints: ['Creators burn out across 5 networks.'],
      actionFramework: { name: 'Repurpose Loop', steps: ['Ingest', 'Distill', 'Adapt'] },
      viralityPotential: 92,
      readabilityGrade: 'Grade 7'
    },
    styleProfile: {
      id: 'founder',
      name: 'Silicon Valley Founder',
      role: 'Tech Executive',
      badge: 'High Conviction',
      description: 'Punchy, contrarian, metrics-driven',
      tone: { wit: 40, technicalDepth: 85, sentenceLength: 'punchy', emojiDensity: 'minimal' },
      negativeConstraints: ["No 'delve'"],
      fewShotExamples: [],
      signatureSignOff: 'Build every day.'
    },
    channels: {
      linkedin: {
        id: 'li-1',
        hook: 'Most founders waste 20 hrs/week rewriting content.',
        body: 'Here is what changes when you build an automated workflow.',
        callToAction: 'How do you repurpose your keynotes?',
        hashtags: ['#AI', '#Founders'],
        carouselSlides: [{ slideNumber: 1, title: 'The Dilemma', bullets: ['Too many platforms'], designNote: 'Bold black text' }],
        status: 'approved',
        scheduledFor: 'Tomorrow, 08:30 AM',
        estimatedReads: '4.2k'
      },
      twitter: {
        id: 'tw-1',
        thread: [{ index: 1, text: 'Most founders waste 20 hours a week.', charCount: 38 }],
        callToAction: 'RT if this helped.',
        hashtags: ['#buildinpublic'],
        status: 'scheduled',
        scheduledFor: 'Tomorrow, 12:15 PM',
        estimatedImpressions: '12k'
      },
      instagram: {
        id: 'ig-1',
        caption: 'Stop starting from scratch every Monday.',
        carouselSlides: [{ slideNumber: 1, headline: 'The Multi-Channel Trap', visualDescription: 'Dark contrast', textOverlay: 'Why 1 idea > 5 posts', accentColor: '#4f46e5' }],
        firstCommentHashtags: { niche: ['#solopreneur'], category: ['#creatoreconomy'], reach: ['#contentstrategy'] },
        status: 'draft',
        scheduledFor: 'Friday, 06:00 PM'
      },
      newsletter: {
        id: 'nl-1',
        subjectLines: [{ variant: 'Direct Benefit', text: 'How to 5x your content throughput', predictedOpenRate: '48%' }],
        previewText: 'A breakdown of our voice memory engine',
        tldr: ['Use one seed asset', 'Extract golden nuggets', 'Publish in parallel'],
        deepDiveMarkdown: 'Long form breakdown here...',
        actionableTakeaway: 'Audit your best performing keynote.',
        postScript: 'P.S. We just crossed 10k users.',
        status: 'approved',
        scheduledFor: 'Sunday, 09:00 AM',
        estimatedReadTime: '4 min'
      },
      videoClip: {
        id: 'vid-1',
        title: 'The Repurposing Playbook',
        durationSeconds: 45,
        hookVariations: [{ verbal: 'You are wasting 80% of your best ideas.', visualCue: 'Camera zoom in' }],
        storyboard: [{ timeRange: '0:00-0:05', teleprompterText: 'Stop making new posts from scratch.', visualBroll: 'Close up talking head', sfxCues: 'Subtle bass drop', textOverlay: '80% Wasted Ideas' }],
        caption: 'The highest leverage creator asset is memory.',
        status: 'draft',
        scheduledFor: 'Monday, 10:00 AM'
      }
    },
    metrics: {
      inputTokens: 1200,
      outputTokens: 2400,
      totalTokens: 3600,
      geminiCostUsd: 0.00108,
      traditionalCostUsd: 0.065,
      savingsPercentage: 98.3,
      processingTimeMs: 1450
    }
  };

  const md = generateCampaignMarkdown(mockRun);
  assert.ok(md.includes('# OmniRepurpose Campaign: Building Modern AI Systems'));
  assert.ok(md.includes('## 💼 1. LinkedIn Post'));
  assert.ok(md.includes('## 🐦 2. Twitter / X Thread'));
  assert.ok(md.includes('## 📸 3. Instagram Carousel & Caption'));
  assert.ok(md.includes('## 📧 4. Newsletter Edition'));
  assert.ok(md.includes('## 🎬 5. Short Video Script'));
});
