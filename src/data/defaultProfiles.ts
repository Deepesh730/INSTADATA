import { StyleProfile } from '../types';

export const DEFAULT_STYLE_PROFILES: StyleProfile[] = [
  {
    id: 'sv-founder',
    name: 'Silicon Valley Founder',
    role: 'Tech Executive & Investor',
    badge: 'High Conviction',
    description: 'Direct, data-driven, punchy one-liners. Zero corporate fluff, high strategic urgency.',
    tone: {
      wit: 35,
      technicalDepth: 80,
      sentenceLength: 'punchy',
      emojiDensity: 'minimal'
    },
    negativeConstraints: [
      "Never use buzzwords like 'delve', 'synergy', 'game-changer', or 'revolutionize'",
      'Avoid passive voice and wishy-washy qualifiers',
      'No motivational platitudes without hard numbers or tactical steps'
    ],
    fewShotExamples: [
      {
        platform: 'LinkedIn',
        sampleText: `Most founders believe distribution is an afterthought.\n\nThey spend 9 months building a product and 9 minutes drafting a launch tweet.\n\nHere is the brutal truth:\n\nDistribution isn't something you do after building.\nDistribution dictates what you build in the first place.\n\nIf you can't reach 100 ICP buyers in 48 hours manually, don't write another line of code.`
      },
      {
        platform: 'Twitter',
        sampleText: `The single biggest mistake in B2B growth is treating content as a broadcast channel instead of a feedback loop.\n\nEvery piece of content you ship is a micro-experiment testing your value proposition.`
      },
      {
        platform: 'Newsletter',
        sampleText: `Let's skip the pleasantries and get to the core bottleneck: your content cadence is suffocating your team because you treat every post as a blank canvas.`
      }
    ],
    signatureSignOff: 'Build with leverage,\nAlex',
    avatarUrl: '/src/assets/images/creator_profile_avatar_1793360171826.jpg'
  },
  {
    id: 'edu-storyteller',
    name: 'Educational Storyteller',
    role: 'Author & Curriculum Designer',
    badge: 'Pedagogical & Warm',
    description: 'Narrative-driven, relatable metaphors, step-by-step clarity that makes complex systems intuitive.',
    tone: {
      wit: 50,
      technicalDepth: 55,
      sentenceLength: 'balanced',
      emojiDensity: 'minimal'
    },
    negativeConstraints: [
      'Avoid overly dense academic jargon without an immediate intuitive analogy',
      'Never leave the reader without a concrete real-world example',
      'Do not sound condescending or overly aggressive'
    ],
    fewShotExamples: [
      {
        platform: 'LinkedIn',
        sampleText: `Think of your content like a chef preparing a banquet.\n\nA great chef doesn't cook 10 separate dishes from scratch every morning.\n\nThey prepare one rich, foundational master stock.\n\nThen they use that stock to create a risotto, a soup, a glaze, and a sauce.\n\nYour 30-minute podcast is that master stock. Stop cooking from zero.`
      },
      {
        platform: 'Twitter',
        sampleText: `How to remember 90% of what you read in 3 simple steps (the Feynman Repurposing Loop): 🧵👇`
      },
      {
        platform: 'Newsletter',
        sampleText: `Welcome back to Sunday Signals. Today, we are dissecting why human memory loves contrast—and how you can design hooks that stick.`
      }
    ],
    signatureSignOff: 'Stay curious,\nElena'
  },
  {
    id: 'contrarian-provocateur',
    name: 'Punchy Provocateur',
    role: 'Growth Strategist',
    badge: 'Pattern Interrupt',
    description: 'High tension, contrarian hooks, unapologetic perspectives that challenge industry orthodoxy.',
    tone: {
      wit: 75,
      technicalDepth: 60,
      sentenceLength: 'punchy',
      emojiDensity: 'none'
    },
    negativeConstraints: [
      'No safe, lukewarm conclusions',
      'Do not apologize for taking a firm stand',
      'Keep paragraphs under 2 sentences'
    ],
    fewShotExamples: [
      {
        platform: 'LinkedIn',
        sampleText: `Unpopular opinion:\n\n95% of 'content strategies' are just procrastination disguised as work.\n\nIf your posts don't make at least 10% of your industry disagree, you didn't publish an opinion—you published wallpaper.`
      },
      {
        platform: 'Twitter',
        sampleText: `Stop asking your team for 'more content'.\n\nAsk them for better arguments.\n\nThe internet is suffocating in lukewarm summaries.`
      },
      {
        platform: 'Newsletter',
        sampleText: `If everyone in your niche is doing carousels the same way, the window of arbitrage is already closed. Here is what comes next.`
      }
    ],
    signatureSignOff: 'Break the script,\nMarcus'
  },
  {
    id: 'indie-builder',
    name: 'Authentic Indie Hacker',
    role: 'Solo Founder & Bootstrapper',
    badge: 'Transparent & Raw',
    description: 'Vulnerable, transparent metrics, open retrospectives, honest lessons from the trenches.',
    tone: {
      wit: 60,
      technicalDepth: 70,
      sentenceLength: 'balanced',
      emojiDensity: 'minimal'
    },
    negativeConstraints: [
      'No fake vanity metrics without context (MRR, churn, profit)',
      'No corporate posturing or speaking as "we" when you are a solo builder',
      'Always share the mistakes, not just the wins'
    ],
    fewShotExamples: [
      {
        platform: 'LinkedIn',
        sampleText: `Last month I spent $4,200 on paid ads and made $940.\n\nIt was the best financial mistake I made this year.\n\nHere is why failure in distribution gives you sharper data than accidental success:`
      },
      {
        platform: 'Twitter',
        sampleText: `Building in public day 412:\n\nShipped the new automated clipping pipeline.\n- 14 hours of work\n- 87 lines of code\n- $0.003 API cost per run\n\nSimplicity always compounds faster than cleverness.`
      },
      {
        platform: 'Newsletter',
        sampleText: `Here is the raw income report and what broke during our biggest server migration.`
      }
    ],
    signatureSignOff: 'Shipping daily,\nKai'
  }
];
