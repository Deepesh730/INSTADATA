export type ContentSourceType = 
  | 'voice_recording' 
  | 'audio_file' 
  | 'youtube_url' 
  | 'podcast_url' 
  | 'raw_text' 
  | 'pdf_document';

export interface IngestionMetadata {
  title: string;
  sourceType: ContentSourceType;
  wordCount: number;
  durationSeconds: number;
  readingTimeMinutes: number;
  detectedSpeakers: string[];
  audioSampleRate?: string;
  fileSizeBytes?: number;
  uploadedAt: string;
}

export interface TranscriptSegment {
  id: string;
  startTime: string;
  endTime: string;
  speaker: string;
  text: string;
}

export interface TranscriptionData {
  provider: 'Gemini Multimodal Audio' | 'Whisper v3 Turbo' | 'Deepgram Nova-2';
  fullText: string;
  confidence: number;
  segments: TranscriptSegment[];
}

export interface ContentInsight {
  id: string;
  title: string;
  explanation: string;
  impact: 'High' | 'Critical' | 'Medium';
}

export interface GoldenQuote {
  quote: string;
  context: string;
  timestamp?: string;
  speaker?: string;
}

export interface ExtractedInsights {
  coreSummary: string;
  takeaways: ContentInsight[];
  goldenQuotes: GoldenQuote[];
  counterIntuitiveAngles: string[];
  audiencePainPoints: string[];
  actionFramework: {
    name: string;
    steps: string[];
  };
  viralityPotential: number; // 0-100
  readabilityGrade: string;
}

export interface StyleTone {
  wit: number; // 0-100
  technicalDepth: number; // 0-100
  sentenceLength: 'punchy' | 'balanced' | 'comprehensive';
  emojiDensity: 'none' | 'minimal' | 'expressive';
}

export interface StyleProfile {
  id: string;
  name: string;
  role: string;
  badge: string;
  description: string;
  tone: StyleTone;
  negativeConstraints: string[];
  fewShotExamples: Array<{
    platform: 'LinkedIn' | 'Twitter' | 'Newsletter';
    sampleText: string;
  }>;
  signatureSignOff: string;
  avatarUrl?: string;
}

export type ApprovalStatus = 'draft' | 'in_review' | 'approved' | 'scheduled';

export interface LinkedInCarouselSlide {
  slideNumber: number;
  title: string;
  bullets: string[];
  designNote: string;
}

export interface LinkedInOutput {
  id: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  carouselSlides: LinkedInCarouselSlide[];
  status: ApprovalStatus;
  scheduledFor: string;
  estimatedReads: string;
}

export interface TweetItem {
  index: number;
  text: string;
  visualPrompt?: string;
  charCount: number;
}

export interface TwitterOutput {
  id: string;
  thread: TweetItem[];
  callToAction: string;
  hashtags: string[];
  status: ApprovalStatus;
  scheduledFor: string;
  estimatedImpressions: string;
}

export interface InstagramSlide {
  slideNumber: number;
  headline: string;
  visualDescription: string;
  textOverlay: string;
  accentColor: string;
}

export interface InstagramOutput {
  id: string;
  caption: string;
  carouselSlides: InstagramSlide[];
  firstCommentHashtags: {
    niche: string[];
    category: string[];
    reach: string[];
  };
  status: ApprovalStatus;
  scheduledFor: string;
}

export interface SubjectLineVariant {
  variant: 'Curiosity' | 'Direct Benefit' | 'Urgency';
  text: string;
  predictedOpenRate: string;
}

export interface NewsletterOutput {
  id: string;
  subjectLines: SubjectLineVariant[];
  previewText: string;
  tldr: string[];
  deepDiveMarkdown: string;
  actionableTakeaway: string;
  postScript: string;
  status: ApprovalStatus;
  scheduledFor: string;
  estimatedReadTime: string;
}

export interface VideoStoryboardScene {
  timeRange: string;
  teleprompterText: string;
  visualBroll: string;
  sfxCues: string;
  textOverlay: string;
}

export interface VideoClipOutput {
  id: string;
  title: string;
  durationSeconds: number;
  hookVariations: Array<{
    verbal: string;
    visualCue: string;
  }>;
  storyboard: VideoStoryboardScene[];
  caption: string;
  status: ApprovalStatus;
  scheduledFor: string;
}

export interface ChannelOutputs {
  linkedin: LinkedInOutput;
  twitter: TwitterOutput;
  instagram: InstagramOutput;
  newsletter: NewsletterOutput;
  videoClip: VideoClipOutput;
}

export type PipelineStage = 
  | 'idle' 
  | 'ingesting' 
  | 'transcribing' 
  | 'extracting_insights' 
  | 'styling' 
  | 'generating' 
  | 'completed' 
  | 'error';

export interface TokenMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  geminiCostUsd: number;
  traditionalCostUsd: number;
  savingsPercentage: number;
  processingTimeMs: number;
}

export interface PipelineRun {
  id: string;
  timestamp: string;
  activeStage: PipelineStage;
  stageProgress: number; // 0-100
  stageMessage: string;
  source: {
    title: string;
    type: ContentSourceType;
    rawContent: string;
  };
  ingestion: IngestionMetadata;
  transcription: TranscriptionData;
  insights: ExtractedInsights;
  styleProfile: StyleProfile;
  channels: ChannelOutputs;
  metrics: TokenMetrics;
}
