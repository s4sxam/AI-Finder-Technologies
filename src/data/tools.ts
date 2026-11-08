import { Tool } from '../types';

export const AI_TOOLS: Tool[] = [
  // --- CODING ---
  {
    id: 'tool-cursor',
    name: 'Cursor',
    slug: 'cursor',
    tagline: 'The AI-first code editor built for rapid pair programming and repository refactoring.',
    description: 'Cursor is an AI-powered fork of VS Code engineered to understand entire codebases. It features multi-file editing, intelligent agentic terminal execution, contextual tab-completion, and codebase-wide indexing for instantaneous semantic code search.',
    category: 'coding',
    pricing: 'Freemium',
    pricingDetails: 'Free tier available with 2,000 completions. Pro is $20/month for unlimited fast requests, Claude 3.7 Sonnet & GPT-4o.',
    platforms: ['Mac', 'Windows', 'Linux'],
    websiteUrl: 'https://cursor.com',
    rating: 4.9,
    reviewCount: 3820,
    trendingRank: 1,
    featured: true,
    releaseYear: 2023,
    bestFor: 'Engineers who want deep codebase intelligence with familiar VS Code keybindings and extensions.',
    keyFeatures: [
      'Composer: Multi-file code generation and diff application across whole directories',
      'Codebase Indexing: Semantic embeddings over your entire git tree for precise contextual recall',
      'Predictive Tab: Multi-token autocomplete that anticipates cursor moves and next edits',
      'Terminal Agent: Natural language command generation with error auto-debugging'
    ],
    pros: [
      'Flawless VS Code extension and keybinding compatibility',
      'Unrivaled multi-file refactoring with unified diff preview',
      'Supports leading frontier models (Claude 3.7 Sonnet, GPT-4o, o3-mini)'
    ],
    cons: [
      'Closed-source fork requiring separate editor installation',
      'Pro plan usage caps during peak server demand periods'
    ],
    faqs: [
      {
        question: 'Does Cursor share proprietary code with LLM providers?',
        answer: 'Cursor offers a Privacy Mode that guarantees zero code storage or model training on your codebase. Enterprise contracts enforce SOC 2 Type II compliance.'
      },
      {
        question: 'Can I import my existing VS Code extensions and settings into Cursor?',
        answer: 'Yes, on initial launch Cursor provides a 1-click import that mirrors all your installed extensions, keymaps, snippets, and UI themes.'
      }
    ],
    alternatives: ['github-copilot', 'claude-code', 'aider', 'replit-agent'],
    verified: true,
    monogram: 'CR',
    accentColor: '#3B82F6',
    monthlyUsers: '1.2M+'
  },
  {
    id: 'tool-github-copilot',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    tagline: 'The industry-standard AI pair programmer integrated across all major IDEs.',
    description: 'GitHub Copilot turns natural language prompts into code suggestions across dozens of languages. Backed by OpenAI and GitHub, it provides inline ghost-text completions, an interactive chat sidebar, automated pull request summarization, and CLI guidance.',
    category: 'coding',
    pricing: 'Paid',
    pricingDetails: '$10/month or $100/year for individuals. Free for verified open-source maintainers and students. Business tier at $19/user/month.',
    platforms: ['VS Code', 'Visual Studio', 'JetBrains', 'Neovim', 'Web', 'CLI'],
    websiteUrl: 'https://github.com/features/copilot',
    rating: 4.7,
    reviewCount: 12400,
    trendingRank: 4,
    featured: true,
    releaseYear: 2021,
    bestFor: 'Developers seeking frictionless autocomplete directly inside their established IDE workflow.',
    keyFeatures: [
      'Ghost text completions as you type in 50+ programming languages',
      'Copilot Chat with @workspace, @vscode, and @terminal context filters',
      'Pull request descriptions and code review assistance directly in GitHub',
      'Enterprise audit logs and strict public code reference filters'
    ],
    pros: [
      'Works in VS Code, JetBrains, Visual Studio, and Neovim without switching editors',
      'Free for verified students, educators, and open-source maintainers',
      'Deep integration with GitHub issues, PRs, and team permissions'
    ],
    cons: [
      'Lacks the holistic multi-file composer capabilities found in Cursor',
      'Context window can lose track of complex architectural patterns across large repos'
    ],
    faqs: [
      {
        question: 'How do I filter out public code snippets with Copilot?',
        answer: 'In GitHub account settings, toggle "Suggestions matching public code" to blocked to prevent Copilot from outputting code that matches public GitHub repositories.'
      }
    ],
    alternatives: ['cursor', 'claude-code', 'v0'],
    verified: true,
    monogram: 'GH',
    accentColor: '#10B981',
    monthlyUsers: '10M+'
  },
  {
    id: 'tool-v0',
    name: 'v0 by Vercel',
    slug: 'v0',
    tagline: 'Generative UI system turning natural language and design screenshots into production React and Tailwind code.',
    description: 'v0 by Vercel is a specialized design-to-code engine that generates accessible React components styled with Tailwind CSS and Radix UI primitives. It allows front-end teams to iterate visually, fork variations, and run code instantly inside browser previews.',
    category: 'coding',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with 200 credits/month. Premium tier at $20/month with 5,000 credits and team collaboration.',
    platforms: ['Web'],
    websiteUrl: 'https://v0.dev',
    rating: 4.8,
    reviewCount: 2950,
    trendingRank: 2,
    featured: true,
    releaseYear: 2023,
    bestFor: 'Product designers and frontend developers generating clean, copy-pasteable React + Tailwind UI components.',
    keyFeatures: [
      'Prompt-to-React generation using clean Tailwind CSS and shadcn/ui conventions',
      'Image-to-code upload: converts wireframes and screenshots to clean JSX',
      'Direct copy-paste or npx v0 add integration into Next.js projects',
      'Interactive visual canvas with responsive viewport preview'
    ],
    pros: [
      'Produces production-ready component code with zero styling bloat',
      'Accessible Radix UI keyboard and screen-reader compliant foundations',
      'Seamless deployment to Vercel previews'
    ],
    cons: [
      'Limited to frontend UI; does not build backend databases or API routes',
      'Credit consumption can be rapid during heavy iteration cycles'
    ],
    faqs: [
      {
        question: 'Can I use v0 generated components in commercial projects?',
        answer: 'Yes, all code generated by v0 is licensed under MIT / public domain and is 100% royalty-free for commercial use.'
      }
    ],
    alternatives: ['cursor', 'replit-agent'],
    verified: true,
    monogram: 'V0',
    accentColor: '#000000',
    monthlyUsers: '800K+'
  },

  // --- CHAT & GENERAL ---
  {
    id: 'tool-claude',
    name: 'Claude 3.7 Sonnet',
    slug: 'claude',
    tagline: 'Anthropic\'s hybrid reasoning model excelling at complex logic, coding, and nuanced prose.',
    description: 'Claude 3.7 Sonnet is Anthropic\'s premier frontier AI model. It features a continuous reasoning architecture that lets users dial between instant conversational responses and extended step-by-step thinking for mathematically rigorous and high-depth coding workflows.',
    category: 'chat',
    pricing: 'Freemium',
    pricingDetails: 'Free access with daily message limits. Claude Pro is $20/month with 5x capacity, Projects, and Artifacts.',
    platforms: ['Web', 'iOS', 'Android', 'API'],
    websiteUrl: 'https://claude.ai',
    rating: 4.95,
    reviewCount: 9100,
    trendingRank: 3,
    featured: true,
    releaseYear: 2024,
    bestFor: 'Developers, researchers, and writers who need deep analytical reasoning and honest, nuanced output.',
    keyFeatures: [
      'Hybrid reasoning toggle: fast answers or deep step-by-step chain of thought',
      '200,000 token context window (supports entire book manuscripts or full code repos)',
      'Claude Artifacts: interactive React, SVG, HTML, and markdown side-by-side workspace',
      'Claude Projects: persistent document knowledge bases for dedicated workspaces'
    ],
    pros: [
      'Industry-leading human-like prose without generic formulaic templates',
      'Exceptional performance on complex algorithmic and architectural code',
      'Artifacts interface makes reviewing code and documents interactive'
    ],
    cons: [
      'Does not have a live native web browsing mode on the free tier',
      'Context limits can be reached quickly when uploading multiple 100-page PDFs'
    ],
    faqs: [
      {
        question: 'What is the difference between Claude 3.5 Sonnet and 3.7 Sonnet?',
        answer: 'Claude 3.7 Sonnet introduces hybrid reasoning, allowing the model to produce visible, inspectable thinking tokens before responding to complex mathematical and architectural problems.'
      }
    ],
    alternatives: ['chatgpt', 'gemini-advanced', 'deepseek-r1'],
    verified: true,
    monogram: 'CL',
    accentColor: '#D97706',
    monthlyUsers: '25M+'
  },
  {
    id: 'tool-chatgpt',
    name: 'ChatGPT',
    slug: 'chatgpt',
    tagline: 'OpenAI\'s flagship multimodal intelligence with web search, voice mode, and o3 reasoning.',
    description: 'ChatGPT is the world\'s most widely adopted conversational AI platform. Powered by GPT-4o and OpenAI\'s o-series reasoning models, it offers advanced real-time voice conversations, live web browsing, canvas document editing, and custom GPT configurations.',
    category: 'chat',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with standard GPT-4o access. Plus is $20/month for advanced voice mode, o3-mini reasoning, and custom GPTs.',
    platforms: ['Web', 'iOS', 'Android', 'Mac', 'Windows'],
    websiteUrl: 'https://chatgpt.com',
    rating: 4.85,
    reviewCount: 45000,
    trendingRank: 5,
    featured: true,
    releaseYear: 2022,
    bestFor: 'Professionals seeking an all-in-one multimodal assistant for daily research, drafting, and voice interaction.',
    keyFeatures: [
      'Advanced Voice Mode with ultra-low latency emotional intonation',
      'OpenAI Canvas: dedicated collaborative side-editor for writing and coding',
      'Integrated live web search with citations and real-time news retrieval',
      'Custom GPTs marketplace for tailored team workflows'
    ],
    pros: [
      'Most versatile multimodal capabilities including live camera and voice',
      'Extensive ecosystem of plugins, GPTs, and integrations',
      'Reliable web search grounding with live source citations'
    ],
    cons: [
      'Writing tone can default to formulaic structures without custom instructions',
      'Rate limits on o-series deep reasoning models during high-traffic hours'
    ],
    faqs: [
      {
        question: 'Is ChatGPT free to use without a credit card?',
        answer: 'Yes, ChatGPT offers a free tier accessible without payment info, providing access to GPT-4o with rate limits.'
      }
    ],
    alternatives: ['claude', 'gemini-advanced', 'perplexity'],
    verified: true,
    monogram: 'GP',
    accentColor: '#10B981',
    monthlyUsers: '300M+'
  },
  {
    id: 'tool-gemini-advanced',
    name: 'Google Gemini Advanced',
    slug: 'gemini-advanced',
    tagline: 'Multimodal AI with an unprecedented 2-million token context window and Google Workspace synergy.',
    description: 'Gemini Advanced represents Google\'s frontier AI model. With an industry-record 2-million token context window, it can digest hours of video, entire codebases, and audio files in a single prompt while natively syncing with Google Docs, Drive, and Gmail.',
    category: 'chat',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with Gemini Flash. Gemini Advanced is $19.99/month (includes 2TB Google One cloud storage).',
    platforms: ['Web', 'Android', 'iOS'],
    websiteUrl: 'https://gemini.google.com',
    rating: 4.75,
    reviewCount: 18200,
    trendingRank: 7,
    featured: false,
    releaseYear: 2023,
    bestFor: 'Users deeply invested in the Google ecosystem who need massive document and multi-hour video analysis.',
    keyFeatures: [
      '2-Million token context window capable of analyzing 1,500+ pages of text simultaneously',
      'Native Google Workspace integration: summarizes emails, drives, and slides seamlessly',
      'Multimodal video comprehension: upload MP4s and query specific frames or timestamp events',
      'Built-in Python execution sandbox for verified data visualization and chart generation'
    ],
    pros: [
      'Unmatched context window capacity in the consumer market',
      'Great value bundle with 2TB Google One storage included in the subscription',
      'Exceptional multimodal understanding of audio and video inputs'
    ],
    cons: [
      'Creative writing outputs occasionally carry excessive safety disclaimers',
      'Coding suggestions can be less idiomatic than Claude or Cursor'
    ],
    faqs: [
      {
        question: 'Can Gemini Advanced analyze raw video recordings directly?',
        answer: 'Yes, Gemini can ingest full video files up to an hour long and pinpoint exact timecodes, transcribe dialogue, and explain visual actions.'
      }
    ],
    alternatives: ['claude', 'chatgpt', 'notebooklm'],
    verified: true,
    monogram: 'GM',
    accentColor: '#4285F4',
    monthlyUsers: '80M+'
  },

  // --- RESEARCH & SEARCH ---
  {
    id: 'tool-perplexity',
    name: 'Perplexity AI',
    slug: 'perplexity',
    tagline: 'An answer engine replacing traditional search engines with cited, synthesized intelligence.',
    description: 'Perplexity AI delivers accurate, concise answers accompanied by inline numbered citations to verifiable sources. It supports Pro Search with multi-step reasoning, specialized focus domains (Academic, YouTube, Reddit, Computational), and Collections for organized research.',
    category: 'research',
    pricing: 'Freemium',
    pricingDetails: 'Free standard searches. Perplexity Pro is $20/month with 300+ Pro queries daily, file uploads, and model choice.',
    platforms: ['Web', 'iOS', 'Android', 'Mac'],
    websiteUrl: 'https://perplexity.ai',
    rating: 4.9,
    reviewCount: 14200,
    trendingRank: 6,
    featured: true,
    releaseYear: 2022,
    bestFor: 'Researchers, journalists, and professionals wanting factual answers with real-time citations instead of blue links.',
    keyFeatures: [
      'Inline numbered citations linking to primary journalism, academic papers, and official docs',
      'Pro Search: Autonomous query reformulation that explores multiple angles before synthesizing',
      'Focus Modes: Target searches exclusively to Academic papers, Reddit discussions, or YouTube',
      'Perplexity Pages: Transform researched topics into beautifully formatted shareable articles'
    ],
    pros: [
      'Virtually eliminates search engine clutter, SEO-farm spam, and ad bloat',
      'Lets you choose the underlying model (Claude 3.7, GPT-4o, Sonar Large)',
      'Organized Spaces allow team document sharing and targeted research archives'
    ],
    cons: [
      'Occasional citation hallucination on obscure historical or niche technical inquiries',
      'Free tier search depth is limited to basic single-pass queries'
    ],
    faqs: [
      {
        question: 'Is Perplexity legal to use for academic citations?',
        answer: 'Yes, Perplexity provides direct URLs and titles to original research papers and news articles, which can be cited in APA or MLA format.'
      }
    ],
    alternatives: ['notebooklm', 'consensus', 'chatgpt'],
    verified: true,
    monogram: 'PX',
    accentColor: '#0EA5E9',
    monthlyUsers: '15M+'
  },
  {
    id: 'tool-notebooklm',
    name: 'Google NotebookLM',
    slug: 'notebooklm',
    tagline: 'Personalized AI research assistant grounded exclusively in your own source notes and documents.',
    description: 'NotebookLM is a breakthrough research notebook created by Google Labs. Grounded strictly in the notes, PDFs, Google Docs, and YouTube links you upload, it guarantees factual accuracy without hallucinating outside sources, complete with viral two-host Audio Overviews.',
    category: 'research',
    pricing: 'Free',
    pricingDetails: 'Completely free during the Google Labs public preview phase.',
    platforms: ['Web'],
    websiteUrl: 'https://notebooklm.google.com',
    rating: 4.9,
    reviewCount: 6800,
    trendingRank: 8,
    featured: true,
    releaseYear: 2023,
    bestFor: 'Students, researchers, and podcast lovers who want source-grounded notes and AI-generated audio discussions.',
    keyFeatures: [
      'Source-Grounded synthesis: answers questions strictly from your uploaded materials with direct citations',
      'Audio Overview: Generates stunningly realistic 10-15 minute deep-dive podcast discussions between two AI hosts',
      'Supports up to 50 sources per notebook (PDFs, Google Docs, Google Slides, web URLs, YouTube links)',
      'Automated study guides, briefing docs, timelines, and FAQ generation'
    ],
    pros: [
      '100% free with zero advertisements or subscription barriers',
      'Zero hallucination policy: model admits when facts are not in your source materials',
      'Audio Overview podcasts are extraordinarily engaging for auditory learners'
    ],
    cons: [
      'Cannot perform general live web searches outside of provided source URLs',
      'Does not yet support direct interactive interruption of the generated Audio Overview podcast'
    ],
    faqs: [
      {
        question: 'Can I upload proprietary corporate PDFs to NotebookLM?',
        answer: 'Google states that personal data uploaded into NotebookLM is not used to train future foundation models, but enterprise users should review their organization Google Workspace terms.'
      }
    ],
    alternatives: ['perplexity', 'consensus'],
    verified: true,
    monogram: 'NL',
    accentColor: '#8B5CF6',
    monthlyUsers: '5M+'
  },
  {
    id: 'tool-consensus',
    name: 'Consensus',
    slug: 'consensus',
    tagline: 'AI search engine searching 200M+ peer-reviewed scientific papers for evidence-based answers.',
    description: 'Consensus searches over 200 million academic papers to synthesize scientific consensus on medicine, psychology, nutrition, and technology. It extracts key findings, calculates consensus meters, and provides direct links to PubMed, DOI, and journal citations.',
    category: 'research',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with unlimited basic search. Premium is $8.99/month for GPT-4o synthesis and study snapshot filters.',
    platforms: ['Web'],
    websiteUrl: 'https://consensus.app',
    rating: 4.8,
    reviewCount: 3100,
    trendingRank: 11,
    featured: false,
    releaseYear: 2022,
    bestFor: 'Academics, clinicians, and health professionals needing peer-reviewed scientific evidence and study design filters.',
    keyFeatures: [
      'Consensus Meter: Visual percentage showing scientific agreement (Yes / Possibly / No)',
      'Study Snapshot: Flags sample size, methodology (RCT, Meta-analysis, Cohort), and citations',
      'Direct Semantic Scholar and PubMed citation exports in BibTeX and RIS format',
      'Synthesized summaries written at non-specialist or expert comprehension levels'
    ],
    pros: [
      'Extracts genuine scientific consensus rather than marketing claims',
      'Filters for randomized controlled trials (RCTs) and human studies',
      'Cites exact authors, publication year, and journal impact score'
    ],
    cons: [
      'Less useful for non-academic topics like consumer technology or business news',
      'Some paywalled journal full-texts cannot be displayed in full'
    ],
    faqs: [
      {
        question: 'How does Consensus determine the Consensus Meter percentage?',
        answer: 'Consensus analyzes top search-relevant peer-reviewed papers answering a yes/no question and classifies each paper\'s abstract findings into affirmative, neutral, or dissenting categories.'
      }
    ],
    alternatives: ['perplexity', 'notebooklm'],
    verified: true,
    monogram: 'CS',
    accentColor: '#14B8A6',
    monthlyUsers: '2M+'
  },

  // --- IMAGE & DESIGN ---
  {
    id: 'tool-midjourney',
    name: 'Midjourney v6.1',
    slug: 'midjourney',
    tagline: 'The undisputed gold standard for photorealistic and cinematic generative imagery.',
    description: 'Midjourney produces world-class visual aesthetics, photorealism, and artistic versatility. Version 6.1 features improved coherence, realistic skin textures, accurate 8k lighting rendering, inpainting/outpainting, and a standalone web interface alongside Discord.',
    category: 'image',
    pricing: 'Paid',
    pricingDetails: 'Plans start at $10/month (Basic) up to $60/month (Pro) for fast GPU hours and stealth mode.',
    platforms: ['Web', 'Discord'],
    websiteUrl: 'https://midjourney.com',
    rating: 4.95,
    reviewCount: 22000,
    trendingRank: 9,
    featured: true,
    releaseYear: 2022,
    bestFor: 'Art directors, designers, and creatives needing award-winning cinematic fidelity and artistic flair.',
    keyFeatures: [
      'Photorealistic texture fidelity, subsurface scattering, and natural lighting',
      'Web-based canvas editor with pan, zoom, varying regions (inpainting), and upscaling',
      'Style Reference (--sref) and Character Consistency (--cref) parameters',
      'High text rendering accuracy inside signage and graphic banners'
    ],
    pros: [
      'Unsurpassed aesthetic beauty and artistic composition out of the box',
      'Vibrant community showcase with searchable prompt recipes',
      'Dedicated web creation interface eliminates Discord friction'
    ],
    cons: [
      'No free tier available anymore',
      'Image generations on basic tiers are publicly viewable by default'
    ],
    faqs: [
      {
        question: 'Do I own the commercial rights to images generated on Midjourney?',
        answer: 'Yes, paid subscribers own full commercial rights to images generated on their accounts.'
      }
    ],
    alternatives: ['flux', 'ideogram', 'recraft'],
    verified: true,
    monogram: 'MJ',
    accentColor: '#EC4899',
    monthlyUsers: '18M+'
  },
  {
    id: 'tool-flux',
    name: 'Flux.1 by Black Forest Labs',
    slug: 'flux',
    tagline: 'Open-weights frontier image model with exceptional prompt adherence and anatomy realism.',
    description: 'Created by the original team behind Stable Diffusion at Black Forest Labs, FLUX.1 represents the current pinnacle of open-weights generative imagery. It achieves flawless human hands, typography rendering, and photorealistic skin nuances across Schnell, Dev, and Pro models.',
    category: 'image',
    pricing: 'Freemium',
    pricingDetails: 'Open-weights weights (Schnell/Dev) free for local/non-commercial use. Hosted API starts at $0.03/image.',
    platforms: ['Web', 'API', 'Local (ComfyUI)'],
    websiteUrl: 'https://blackforestlabs.ai',
    rating: 4.9,
    reviewCount: 7800,
    trendingRank: 10,
    featured: true,
    releaseYear: 2024,
    bestFor: 'Developers and creators who need open-weights models runnable locally with zero content censorship or licensing hurdles.',
    keyFeatures: [
      '12-Billion parameter flow-matching transformer architecture',
      'Perfect text rendering across signs, clothing, book titles, and badges',
      'Realistic human anatomy with flawless fingers, joints, and eye reflections',
      'Available across Schnell (4-step fast), Dev (non-commercial open), and Pro (commercial API)'
    ],
    pros: [
      'Can be run 100% offline and locally via ComfyUI with sufficient GPU VRAM',
      'Significantly higher prompt adherence than SDXL',
      'Open weights allow custom fine-tuning and LoRA development'
    ],
    cons: [
      'Demands powerful local GPU (12GB+ VRAM minimum for quantized models)',
      'No official all-in-one consumer chat application provided directly by Black Forest Labs'
    ],
    faqs: [
      {
        question: 'What is the difference between Flux Schnell and Flux Dev?',
        answer: 'Flux Schnell is optimized for 4-step generation and is Apache 2.0 licensed for commercial use. Flux Dev is a 28-step distilled model for non-commercial research and highest fidelity.'
      }
    ],
    alternatives: ['midjourney', 'ideogram'],
    verified: true,
    monogram: 'FX',
    accentColor: '#F97316',
    monthlyUsers: '4M+'
  },
  {
    id: 'tool-ideogram',
    name: 'Ideogram 2.0',
    slug: 'ideogram',
    tagline: 'The industry champion for accurate typography, graphic design, and vector-style generation.',
    description: 'Ideogram 2.0 solves the historic failure of AI image models: rendering crisp, spelled-correct text and graphic typography. Ideal for posters, logos, t-shirt prints, book covers, and marketing cards, it offers dedicated Color Palette controls and realistic rendering modes.',
    category: 'image',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with 40 priority credits/week. Basic plan is $8/month; Plus is $20/month with private generation.',
    platforms: ['Web', 'iOS', 'Android'],
    websiteUrl: 'https://ideogram.ai',
    rating: 4.85,
    reviewCount: 5400,
    trendingRank: 13,
    featured: false,
    releaseYear: 2023,
    bestFor: 'Graphic designers, marketers, and print-on-demand creators needing pristine typography inside visual artwork.',
    keyFeatures: [
      'Flawless typographic rendering of multi-sentence phrases in varied font styles',
      'Custom hex color palette selector to maintain brand color guidelines',
      'Magic Prompt feature that intelligently enriches brief prompts for superior aesthetics',
      'Multiple style modes: Realistic, Design, 3D, and Anime'
    ],
    pros: [
      'Best-in-class text rendering in banners, t-shirts, and logos',
      'Generous free daily tier for quick experimentation',
      'Precise control over aspect ratios (16:9, 1:1, 9:16, 3:4, etc.)'
    ],
    cons: [
      'Photorealism on faces can occasionally look slightly illustrated compared to Midjourney v6',
      'Queue times can increase on the free tier during peak hours'
    ],
    faqs: [
      {
        question: 'Can Ideogram generate transparent PNG graphics?',
        answer: 'Ideogram focuses on raster compositions, but the Design style mode produces clean high-contrast backgrounds suitable for 1-click background removal tools.'
      }
    ],
    alternatives: ['midjourney', 'flux', 'recraft'],
    verified: true,
    monogram: 'ID',
    accentColor: '#6366F1',
    monthlyUsers: '3.5M+'
  },

  // --- VIDEO & ANIMATION ---
  {
    id: 'tool-runway',
    name: 'Runway Gen-3 Alpha',
    slug: 'runway',
    tagline: 'Hollywood-grade generative video with granular camera and motion control.',
    description: 'Runway Gen-3 Alpha represents the benchmark for AI video generation. Supporting text-to-video, image-to-video, camera control vectors, motion brushes, and lip-sync audio matching, Runway is utilized by creative studios worldwide for film and commercial visual effects.',
    category: 'video',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with 125 one-time credits. Standard is $15/month; Pro is $35/month with 4K upscaling and custom watermarks.',
    platforms: ['Web', 'iOS'],
    websiteUrl: 'https://runwayml.com',
    rating: 4.8,
    reviewCount: 8900,
    trendingRank: 12,
    featured: true,
    releaseYear: 2023,
    bestFor: 'Filmmakers, video editors, and creative agencies producing commercial-grade cinematic sequences.',
    keyFeatures: [
      'Gen-3 Alpha Turbo: Generates 5s and 10s clips with photorealistic motion dynamics',
      'Camera Control: Specify exact dolly, pan, zoom, pedestal, and tilt camera trajectory vectors',
      'Motion Brush: Paint up to 5 individual scene regions to control independent motion velocities',
      'Lip-Sync: Animate portrait characters with accurate speech phoneme synchronizations'
    ],
    pros: [
      'Cinematic lighting, camera motions, and lens effects look authentic',
      'Motion brush allows surgical directional control over scene elements',
      'Comprehensive editing suite with frame interpolation and background cleanup'
    ],
    cons: [
      'High credit consumption per 10-second generation',
      'Complex human physics (walking up stairs, intricate hand gestures) can still warp'
    ],
    faqs: [
      {
        question: 'Can I extend Runway video clips beyond 10 seconds?',
        answer: 'Yes, Runway allows you to extend generated clips forward and backward in 5-second increments to build longer scene narratives.'
      }
    ],
    alternatives: ['luma-dream-machine', 'kling-ai'],
    verified: true,
    monogram: 'RW',
    accentColor: '#EC4899',
    monthlyUsers: '6M+'
  },
  {
    id: 'tool-luma-dream-machine',
    name: 'Luma Dream Machine',
    slug: 'luma-dream-machine',
    tagline: 'High-speed generative video with realistic physical interactions and fluid camera dynamics.',
    description: 'Luma Dream Machine is a cutting-edge video generation foundation model trained directly on video. Capable of generating 5-second shots with consistent characters, realistic physics simulations, and fluid camera sweeps in under 120 seconds.',
    category: 'video',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with 30 generations/month. Standard is $29.99/month; Pro is $99.99/month with priority queue.',
    platforms: ['Web', 'iOS'],
    websiteUrl: 'https://lumalabs.ai/dream-machine',
    rating: 4.75,
    reviewCount: 4200,
    trendingRank: 14,
    featured: false,
    releaseYear: 2024,
    bestFor: 'Creators needing rapid image-to-video animations with fluid camera trajectories.',
    keyFeatures: [
      'Fast video rendering: creates 5-second 720p clips in under two minutes',
      'Image-to-Video mode transforms static portraits and landscape artwork into dynamic camera sweeps',
      'Keyframing feature: specify start and end image frames to guide smooth transitions',
      'Consistent object physics and lighting continuity across camera moves'
    ],
    pros: [
      'Very generous free tier offering 30 video generations per month',
      'Start-to-end keyframe interpolation produces intentional storytelling',
      'Clean intuitive web interface with fast preview turnaround'
    ],
    cons: [
      'Occasional morphing artifacts when moving between disparate visual subjects',
      'Free tier generations take longer to queue during busy hours'
    ],
    faqs: [
      {
        question: 'What resolution does Luma Dream Machine export at?',
        answer: 'Dream Machine generates natively at 720p with optional 1080p and 4K upscaling available on paid subscription tiers.'
      }
    ],
    alternatives: ['runway', 'kling-ai'],
    verified: true,
    monogram: 'LM',
    accentColor: '#3B82F6',
    monthlyUsers: '3M+'
  },

  // --- WRITING & EDITORIAL ---
  {
    id: 'tool-notion-ai',
    name: 'Notion AI',
    slug: 'notion-ai',
    tagline: 'Context-aware intelligence built directly into your notes, docs, and team wikis.',
    description: 'Notion AI augments the classic Notion workspace with workspace-wide semantic search (Q&A), automated document drafting, action item extraction, translation, and tone rewriting. It references your entire team wiki to answer company-specific inquiries.',
    category: 'writing',
    pricing: 'Paid',
    pricingDetails: '$10/member/month (or $8/member/month billed annually) as an add-on to any Notion plan.',
    platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android'],
    websiteUrl: 'https://notion.so/product/ai',
    rating: 4.8,
    reviewCount: 9600,
    trendingRank: 15,
    featured: true,
    releaseYear: 2023,
    bestFor: 'Teams and individuals who already organize their life or business inside Notion workspace databases.',
    keyFeatures: [
      'Notion Q&A: Inquire anything across thousands of company pages with source attribution',
      'Autofill databases: Automatically summarize, tag, and extract metrics across database rows',
      'Inline text transformation: rewrite for clarity, fix spelling/grammar, translate into 15+ languages',
      'Meeting note processor: extracts key action items and assignees automatically'
    ],
    pros: [
      'Zero context switching: operates directly where your thoughts and team docs live',
      'Q&A understands company permissions and only references pages you have access to',
      'Database autofill saves hundreds of hours of manual categorization'
    ],
    cons: [
      'Requires a paid add-on on top of standard Notion subscription',
      'Less specialized for long-form SEO blog generation compared to dedicated tools like Jasper'
    ],
    faqs: [
      {
        question: 'Does Notion AI share my private notes with other companies?',
        answer: 'No, Notion maintains strict SOC 2 compliance and does not use customer data or private pages to train public LLMs.'
      }
    ],
    alternatives: ['claude', 'chatgpt'],
    verified: true,
    monogram: 'NT',
    accentColor: '#000000',
    monthlyUsers: '35M+'
  },
  {
    id: 'tool-jasper',
    name: 'Jasper AI',
    slug: 'jasper',
    tagline: 'Enterprise marketing co-pilot with brand voice governance, SEO mode, and campaign workflows.',
    description: 'Jasper is built specifically for enterprise marketing teams, agency copywriters, and content directors. It guarantees strict adherence to company brand guidelines, style rules, and product knowledge while orchestrating multi-channel marketing campaigns.',
    category: 'writing',
    pricing: 'Paid',
    pricingDetails: 'Pro plan starts at $49/seat/month billed annually. Business plan with custom SSO and API access.',
    platforms: ['Web', 'Chrome Extension'],
    websiteUrl: 'https://jasper.ai',
    rating: 4.7,
    reviewCount: 11200,
    trendingRank: 16,
    featured: false,
    releaseYear: 2021,
    bestFor: 'Marketing agencies and enterprise growth teams executing multi-channel brand campaigns at scale.',
    keyFeatures: [
      'Brand Voice & Style Guide memory: strictly aligns outputs with tone and banned phrasing',
      'Integrated SurferSEO mode for live keyword density and semantic scoring',
      'Campaign orchestration: turns a single product brief into 10 multi-channel assets',
      'Enterprise security controls with role-based access and plagiarism checks'
    ],
    pros: [
      'Unrivaled brand voice governance prevents off-brand marketing copy',
      'Direct integration with SurferSEO ensures high search ranking potential',
      'Campaign workflow produces social posts, press releases, and emails in one go'
    ],
    cons: [
      'Steeper pricing compared to general consumer chat models like Claude or ChatGPT',
      'Requires onboarding and configuring brand memory to get optimal results'
    ],
    faqs: [
      {
        question: 'How is Jasper different from using standard ChatGPT for marketing?',
        answer: 'Jasper includes dedicated brand memory, campaign asset templates, team style rules, SurferSEO scoring, and multi-model routing tuned specifically for conversion marketing.'
      }
    ],
    alternatives: ['notion-ai', 'claude', 'chatgpt'],
    verified: true,
    monogram: 'JS',
    accentColor: '#8B5CF6',
    monthlyUsers: '1.5M+'
  },

  // --- REASONING / OPEN WEIGHTS ---
  {
    id: 'tool-deepseek-r1',
    name: 'DeepSeek R1',
    slug: 'deepseek-r1',
    tagline: 'Open-weights frontier reasoning model matching o1 performance at a fraction of compute cost.',
    description: 'DeepSeek R1 is a breakthrough open-weights reasoning model developed using large-scale reinforcement learning. It showcases transparent, inspectable chain-of-thought reasoning that excels at competitive programming, higher mathematics, and formal logic verification.',
    category: 'chat',
    pricing: 'Free',
    pricingDetails: 'Completely open-weights (MIT license) for local deployment. Official web interface and mobile app free to use.',
    platforms: ['Web', 'iOS', 'Android', 'API', 'Local (Ollama/vLLM)'],
    websiteUrl: 'https://chat.deepseek.com',
    rating: 4.88,
    reviewCount: 16500,
    trendingRank: 2,
    featured: true,
    releaseYear: 2025,
    bestFor: 'Developers, mathematicians, and researchers seeking open reasoning with zero subscription fees and inspectable logic.',
    keyFeatures: [
      'Fully transparent chain-of-thought: inspect the model\'s internal self-correction and reasoning steps',
      'Distilled versions (1.5B to 70B parameters) runnable locally on consumer laptops and workstations',
      'Open MIT license allows unrestricted commercial deployment and fine-tuning',
      'Near parity with proprietary reasoning models on AIME and Codeforces benchmarks'
    ],
    pros: [
      '100% free web chat and remarkably low API inference costs ($0.14/million tokens)',
      'Self-reflective thinking process can be inspected and audited',
      'Distilled weights can run locally offline via Ollama'
    ],
    cons: [
      'High traffic on public servers can occasionally cause server busy notices',
      'Thinking phase adds latency before initial tokens appear'
    ],
    faqs: [
      {
        question: 'Can DeepSeek R1 be run completely offline on a private machine?',
        answer: 'Yes, quantized versions such as DeepSeek-R1-Distill-Qwen-14B or 32B run locally via Ollama or LM Studio without any internet connection.'
      }
    ],
    alternatives: ['claude', 'chatgpt'],
    verified: true,
    monogram: 'DS',
    accentColor: '#2563EB',
    monthlyUsers: '40M+'
  },
  {
    id: 'tool-replit-agent',
    name: 'Replit Agent',
    slug: 'replit-agent',
    tagline: 'Autonomous software engineering agent that builds and deploys full-stack apps from natural language.',
    description: 'Replit Agent is an autonomous programming agent that reasons, plans, writes code, creates PostgreSQL databases, installs dependencies, and deploys production cloud web applications directly from a natural language prompt on your phone or desktop.',
    category: 'coding',
    pricing: 'Paid',
    pricingDetails: 'Available to Replit Core subscribers ($25/month) with usage-based cloud compute and deployment credits.',
    platforms: ['Web', 'iOS', 'Android'],
    websiteUrl: 'https://replit.com',
    rating: 4.7,
    reviewCount: 3400,
    trendingRank: 17,
    featured: false,
    releaseYear: 2024,
    bestFor: 'Founders, product builders, and non-technical creators wanting an autonomous agent to build and host full web apps.',
    keyFeatures: [
      'Autonomous architecture planning: drafts schemas, frontend UI, backend routes, and configs',
      'Integrated live PostgreSQL database provisioning and instant secrets management',
      'Instant cloud deployment with custom domain mapping and SSL configuration',
      'Mobile web building: prompt, review, and deploy functioning apps directly from an iPhone or Android'
    ],
    pros: [
      'Takes an idea from prompt to hosted production URL in minutes',
      'Eliminates local development environment setup entirely',
      'Full-stack execution includes database tables and real API endpoints'
    ],
    cons: [
      'Requires Replit Core subscription; no unlimited free plan for the agent',
      'Complex refactoring on existing legacy codebases can sometimes introduce regressions'
    ],
    faqs: [
      {
        question: 'Do I get access to the underlying source code built by Replit Agent?',
        answer: 'Yes, you have complete access to the git repository, files, environment variables, and exportable source code.'
      }
    ],
    alternatives: ['cursor', 'v0'],
    verified: true,
    monogram: 'RP',
    accentColor: '#F97316',
    monthlyUsers: '2.5M+'
  }
];

export const CATEGORIES_META: Record<Tool['category'], {
  name: string;
  slug: string;
  description: string;
  count: number;
  featuredTools: string[];
}> = {
  chat: {
    name: 'Chat & Reasoning',
    slug: 'chat',
    description: 'Conversational frontier models and deep reasoning engines for problem-solving, logic, and synthesis.',
    count: AI_TOOLS.filter(t => t.category === 'chat').length,
    featuredTools: ['claude', 'chatgpt', 'deepseek-r1']
  },
  coding: {
    name: 'Coding & Dev Tools',
    slug: 'coding',
    description: 'AI code editors, multi-file refactoring copilots, and generative UI component engines.',
    count: AI_TOOLS.filter(t => t.category === 'coding').length,
    featuredTools: ['cursor', 'v0', 'github-copilot']
  },
  image: {
    name: 'Image & Generative Art',
    slug: 'image',
    description: 'Photorealistic generators, typography-precise engines, and open-weights diffusion transformers.',
    count: AI_TOOLS.filter(t => t.category === 'image').length,
    featuredTools: ['midjourney', 'flux', 'ideogram']
  },
  video: {
    name: 'Video & Motion',
    slug: 'video',
    description: 'Cinematic generative video, motion brushes, keyframing, and camera trajectory controls.',
    count: AI_TOOLS.filter(t => t.category === 'video').length,
    featuredTools: ['runway', 'luma-dream-machine']
  },
  research: {
    name: 'Research & Search',
    slug: 'research',
    description: 'Cited answer engines, academic consensus synthesizers, and source-grounded notebooks.',
    count: AI_TOOLS.filter(t => t.category === 'research').length,
    featuredTools: ['perplexity', 'notebooklm', 'consensus']
  },
  writing: {
    name: 'Writing & Editorial',
    slug: 'writing',
    description: 'Context-aware workspace copilots, enterprise brand voice memory, and marketing campaign generators.',
    count: AI_TOOLS.filter(t => t.category === 'writing').length,
    featuredTools: ['notion-ai', 'jasper']
  }
};
