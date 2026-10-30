import { ContentSourceType } from '../types';

export interface SampleContent {
  id: string;
  title: string;
  type: ContentSourceType;
  durationLabel: string;
  durationSeconds: number;
  wordCount: number;
  speaker: string;
  snippet: string;
  fullTranscript: string;
}

export const SAMPLE_TRANSCRIPTS: SampleContent[] = [
  {
    id: 'sample-tech-keynote',
    title: 'The Post-Software Era & Autonomous AI Systems',
    type: 'podcast_url',
    durationLabel: '18 min keynote',
    durationSeconds: 1080,
    wordCount: 840,
    speaker: 'Dr. Aris Vance (Keynote Speaker)',
    snippet: 'Software used to be deterministic recipes written by programmers. The next era is intent-driven systems where memory and style profiles govern agentic execution...',
    fullTranscript: `[00:00:15] Welcome everyone. We are witnessing the end of what I call the deterministic software era.
[00:00:42] For forty years, engineering meant writing static instructions. If user clicks A, execute procedure B.
[00:01:20] But with foundation models, software is no longer a static recipe. It is an adaptive cognitive runtime.
[00:02:10] The biggest misconception among tech founders today is that intelligence is the scarce commodity. It isn't. Intelligence has been commoditized down to sub-penny tokens.
[00:03:05] The true bottleneck—and the defensible moat of modern software—is Context, Memory, and Workflow Orchestration.
[00:04:15] Let me give you a concrete example: content repurposing.
[00:04:45] A founder gives a 45-minute keynote filled with original insights, raw data, and hard-earned war stories.
[00:05:30] What happens next? In 90% of companies, that video sits on YouTube collecting dust with 400 views.
[00:06:15] Why? Because translating spoken thought into a high-engagement LinkedIn carousel, an X thread, a subscriber newsletter, and vertical video clips requires 15 hours of human translation.
[00:07:05] Traditional AI fails here because generic prompts produce homogenized corporate slop. It wipes out the author's idiosyncratic voice.
[00:08:00] When you introduce a Style Profile Engine—anchored by few-shot examples, negative constraints, and tone calibration—the AI doesn't rewrite; it channels the creator.
[00:09:20] Furthermore, multi-model architectures must balance cost and latency. Calling heavy frontier models for simple parsing wastes 90% of your cloud budget.
[00:10:45] By utilizing Gemini Flash for multimodal ingestion, whisper-level transcription, and rapid parallel channel generation, you bring unit economics down from $0.15 per run to fractions of a cent.
[00:12:10] That is a 98% margin expansion. That is how you turn a cost center into an unfair competitive flywheel.
[00:13:30] To summarize: Don't build for raw model capacity. Build for voice memory. Build for automated multi-channel velocity. And above all, keep human approval in the loop as the editor-in-chief.`
  },
  {
    id: 'sample-saas-fireside',
    title: 'Zero to $10M ARR Without Paid Ads - The Organic Engine',
    type: 'audio_file',
    durationLabel: '24 min fireside',
    durationSeconds: 1440,
    wordCount: 790,
    speaker: 'Maya Chen & David Ross (Podcast)',
    snippet: 'Every founder asks how much to spend on Google or Meta ads. We spent zero dollars. Instead, we turned every customer onboarding call and engineering demo into 7 multi-platform assets...',
    fullTranscript: `[00:00:10] David: Maya, congratulations on crossing $10M ARR. The most astonishing part of your story is your marketing budget line item: literally $0 in paid advertising.
[00:01:05] Maya: Thanks David. People think we have some secret growth hack. We don't. We just respect the principle of Content Conservation of Energy.
[00:02:00] David: What do you mean by Content Conservation of Energy?
[00:02:45] Maya: In physics, energy cannot be created or destroyed, only transformed. Content is the same.
[00:03:30] Most founders believe they need to sit down at 7 AM every day and stare at an empty Twitter box or LinkedIn composer. That is pure friction and leads directly to burnout.
[00:04:40] Instead, you already produce massive amounts of high-signal content naturally during your workday:
[00:05:15] 1. The customer discovery call where a prospect explains why current solutions fail.
[00:06:00] 2. The Slack message where your lead engineer explains a complex architectural bug fix.
[00:06:50] 3. The quarterly board memo outlining your product thesis.
[00:07:45] All of that is golden source material. If you run that through a transcription and insight extraction pipeline, you instantly extract 5 golden nuggets.
[00:08:40] One customer complaint became our highest-performing LinkedIn post with 450,000 views and drove 32 enterprise demos.
[00:09:35] David: But how do you ensure the tone doesn't sound like a generic robot?
[00:10:20] Maya: That is where the Style Profile Engine comes in. We programmed strict negative constraints: no sycophantic praise, no cliché phrases like "in today's fast-paced world", and strict rules on short paragraph breaks.
[00:11:45] When our CEO reviews the drafts in our approval dashboard, she only spends 3 minutes tweaking hooks rather than 45 minutes drafting.
[00:12:50] The result is 10x distribution velocity with 1/10th of the mental load.`
  },
  {
    id: 'sample-product-deepdive',
    title: 'Why 85% of Generative AI Features Suffer 30-Day Churn',
    type: 'raw_text',
    durationLabel: '8 min read',
    durationSeconds: 480,
    wordCount: 680,
    speaker: 'Product Analysis Paper',
    snippet: 'The novelty curve of generative AI wrappers is steep and brutal. Users try the prompt box once or twice for curiosity, but abandon it when it creates more editing work than it saves...',
    fullTranscript: `The Generative AI Churn Paradox: Why Magic Buttons Lose Retention After Week Two.

Across 120 SaaS products tracked over the last 18 months, generative AI features show an alarming pattern:
A massive initial spike in Day 1 activation (over 65% of active users try the feature), followed by a steep drop-off to less than 8% weekly retention by Day 30.

Why does this happen? The core reasons are structural:

1. The "Blank Canvas" Dilemma:
Asking users to "Prompt AI" forces them to do the hardest part of the cognitive work: conceptualizing the query and structuring the input. Good products don't ask users to prompt; they ingest what the user already does (record voice, paste an existing URL, upload a deck) and automatically surface structured outcomes.

2. The Tone Homogenization Trap:
Default LLM outputs sound identical across competitors. They use the same overly eager, polished marketing adjectives. For serious creators and B2B leaders, publishing generic content actively damages brand equity. Without an explicit Voice Memory and Style Profile engine that remembers user preferences, output gets rejected.

3. The Missing Human-in-the-Loop Bridge:
Fully autonomous publishing without human approval creates existential anxiety for brands. Conversely, dumping 5,000 words into a raw text box creates an editing nightmare. The winning design pattern is structured atomic review: let the user review the hook, toggle approval status, and adjust tone in a single click before scheduling.

4. Unchecked Infrastructure Costs:
Teams relying on chained heavyweight LLM calls spend $0.05 to $0.12 per generation. At scale, this destroys unit economics. Modern lightweight models like Gemini 3.8 Flash provide near-instant latency and sub-cent economics, making real-time multi-channel repurposing financially sustainable.`
  }
];
