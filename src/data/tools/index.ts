import { Tool, ToolCategory } from '../../types';
import tool_0 from './claude.json';
import tool_1 from './chatgpt.json';
import tool_2 from './deepseek-r1.json';
import tool_3 from './gemini-advanced.json';
import tool_4 from './grok.json';
import tool_5 from './le-chat.json';
import tool_6 from './meta-ai.json';
import tool_7 from './cursor.json';
import tool_8 from './github-copilot.json';
import tool_9 from './v0.json';
import tool_10 from './windsurf.json';
import tool_11 from './claude-code.json';
import tool_12 from './aider.json';
import tool_13 from './replit-agent.json';
import tool_14 from './lovable.json';
import tool_15 from './bolt-new.json';
import tool_16 from './tabnine.json';
import tool_17 from './devin.json';
import tool_18 from './midjourney.json';
import tool_19 from './flux.json';
import tool_20 from './ideogram.json';
import tool_21 from './recraft.json';
import tool_22 from './leonardo.json';
import tool_23 from './krea.json';
import tool_24 from './magnific.json';
import tool_25 from './freepik-pikaso.json';
import tool_26 from './runway.json';
import tool_27 from './luma-dream-machine.json';
import tool_28 from './kling-ai.json';
import tool_29 from './hailuo-ai.json';
import tool_30 from './pika.json';
import tool_31 from './heygen.json';
import tool_32 from './synthesia.json';
import tool_33 from './elevenlabs.json';
import tool_34 from './suno.json';
import tool_35 from './udio.json';
import tool_36 from './whisper.json';
import tool_37 from './descript.json';
import tool_38 from './soundraw.json';
import tool_39 from './perplexity.json';
import tool_40 from './notebooklm.json';
import tool_41 from './consensus.json';
import tool_42 from './elicit.json';
import tool_43 from './scite.json';
import tool_44 from './semantic-scholar.json';
import tool_45 from './notion-ai.json';
import tool_46 from './jasper.json';
import tool_47 from './copy-ai.json';
import tool_48 from './writesonic.json';
import tool_49 from './grammarly-ai.json';
import tool_50 from './sudowrite.json';
import tool_51 from './granola.json';
import tool_52 from './otter-ai.json';
import tool_53 from './superhuman-ai.json';
import tool_54 from './raycast-ai.json';
import tool_55 from './fathom.json';
import tool_56 from './routine-ai.json';
import tool_57 from './figma-ai.json';
import tool_58 from './uizard.json';
import tool_59 from './spline-ai.json';
import tool_60 from './meshy.json';
import tool_61 from './tripo-3d.json';
import tool_62 from './framer-ai.json';
import tool_63 from './surfer-seo.json';
import tool_64 from './adcreative-ai.json';
import tool_65 from './mutiny.json';
import tool_66 from './lately-ai.json';
import tool_67 from './brand24-ai.json';
import tool_68 from './taplio.json';

export const AI_TOOLS: Tool[] = [
  tool_0 as unknown as Tool,
  tool_1 as unknown as Tool,
  tool_2 as unknown as Tool,
  tool_3 as unknown as Tool,
  tool_4 as unknown as Tool,
  tool_5 as unknown as Tool,
  tool_6 as unknown as Tool,
  tool_7 as unknown as Tool,
  tool_8 as unknown as Tool,
  tool_9 as unknown as Tool,
  tool_10 as unknown as Tool,
  tool_11 as unknown as Tool,
  tool_12 as unknown as Tool,
  tool_13 as unknown as Tool,
  tool_14 as unknown as Tool,
  tool_15 as unknown as Tool,
  tool_16 as unknown as Tool,
  tool_17 as unknown as Tool,
  tool_18 as unknown as Tool,
  tool_19 as unknown as Tool,
  tool_20 as unknown as Tool,
  tool_21 as unknown as Tool,
  tool_22 as unknown as Tool,
  tool_23 as unknown as Tool,
  tool_24 as unknown as Tool,
  tool_25 as unknown as Tool,
  tool_26 as unknown as Tool,
  tool_27 as unknown as Tool,
  tool_28 as unknown as Tool,
  tool_29 as unknown as Tool,
  tool_30 as unknown as Tool,
  tool_31 as unknown as Tool,
  tool_32 as unknown as Tool,
  tool_33 as unknown as Tool,
  tool_34 as unknown as Tool,
  tool_35 as unknown as Tool,
  tool_36 as unknown as Tool,
  tool_37 as unknown as Tool,
  tool_38 as unknown as Tool,
  tool_39 as unknown as Tool,
  tool_40 as unknown as Tool,
  tool_41 as unknown as Tool,
  tool_42 as unknown as Tool,
  tool_43 as unknown as Tool,
  tool_44 as unknown as Tool,
  tool_45 as unknown as Tool,
  tool_46 as unknown as Tool,
  tool_47 as unknown as Tool,
  tool_48 as unknown as Tool,
  tool_49 as unknown as Tool,
  tool_50 as unknown as Tool,
  tool_51 as unknown as Tool,
  tool_52 as unknown as Tool,
  tool_53 as unknown as Tool,
  tool_54 as unknown as Tool,
  tool_55 as unknown as Tool,
  tool_56 as unknown as Tool,
  tool_57 as unknown as Tool,
  tool_58 as unknown as Tool,
  tool_59 as unknown as Tool,
  tool_60 as unknown as Tool,
  tool_61 as unknown as Tool,
  tool_62 as unknown as Tool,
  tool_63 as unknown as Tool,
  tool_64 as unknown as Tool,
  tool_65 as unknown as Tool,
  tool_66 as unknown as Tool,
  tool_67 as unknown as Tool,
  tool_68 as unknown as Tool
];

export const CATEGORIES_META: Record<
  ToolCategory,
  {
    name: string;
    slug: ToolCategory;
    description: string;
    intro: string;
    count: number;
    featuredTools: string[];
  }
> = {
  "chat": {
    "name": "Chat & Reasoning",
    "slug": "chat",
    "description": "Conversational frontier models and deep reasoning engines for multi-step logic, problem-solving, and general synthesis.",
    "intro": "Frontier conversational models have evolved far beyond basic chat. Modern reasoning engines like Claude 3.7 Sonnet, DeepSeek R1, and ChatGPT o3-mini introduce inspectable thinking tokens, multi-million token context windows, and real-time search integration. Here is our rigorously benchmarked ranking of the best conversational and reasoning AI tools.",
    "count": 7,
    "featuredTools": [
      "claude",
      "chatgpt",
      "deepseek-r1"
    ]
  },
  "coding": {
    "name": "Coding & Developer Tools",
    "slug": "coding",
    "description": "AI code editors, multi-file refactoring copilots, command-line agents, and generative UI component engines.",
    "intro": "Software engineering is undergoing its largest architectural shift in decades. Modern developer tools now index entire git repositories, propose unified multi-file diffs across frontend and backend boundaries, and autonomously fix compiler errors. Explore the top-rated AI code editors and programming copilots tested on real production codebases.",
    "count": 11,
    "featuredTools": [
      "cursor",
      "v0",
      "github-copilot",
      "windsurf"
    ]
  },
  "image": {
    "name": "Image & Generative Art",
    "slug": "image",
    "description": "Photorealistic diffusion models, typography-precise engines, vector SVG generators, and real-time design canvases.",
    "intro": "Generative image models now render realistic human anatomy, crisp multi-line typography, and scalable vector graphics (SVG). Whether you are producing commercial advertising assets, game concept art, or brand design systems, these verified tools deliver industry-leading fidelity without plastic AI artifacts.",
    "count": 8,
    "featuredTools": [
      "midjourney",
      "flux",
      "ideogram",
      "recraft"
    ]
  },
  "video": {
    "name": "Video & Motion",
    "slug": "video",
    "description": "Cinematic video foundations, motion brushes, camera trajectory vectors, and photorealistic talking avatars.",
    "intro": "From Hollywood-grade visual effects B-roll to corporate avatar presentations, generative video models have mastered spatial physics, cinematic camera vectors, and emotional facial expressions. Here are the leading AI video generation and editing tools evaluated for frame stability and production utility.",
    "count": 7,
    "featuredTools": [
      "runway",
      "luma-dream-machine",
      "kling-ai",
      "heygen"
    ]
  },
  "audio": {
    "name": "Audio & Speech",
    "slug": "audio",
    "description": "Broadcast-quality music generation, text-to-speech with emotional inflections, voice cloning, and text-based podcast editing.",
    "intro": "Generative audio tools now compose complete radio-quality songs with vocals, master speech-to-text with near-human transcription accuracy, and clone vocal timbre from 60 seconds of audio. Explore our benchmarked list of the premier AI tools for music composition, voiceover dubbing, and audio editing.",
    "count": 6,
    "featuredTools": [
      "elevenlabs",
      "suno",
      "udio",
      "whisper"
    ]
  },
  "research": {
    "name": "Research & Search",
    "slug": "research",
    "description": "Cited answer engines, peer-reviewed scientific paper analyzers, consensus meters, and source-grounded research notebooks.",
    "intro": "Traditional search engines are congested with affiliate lists and SEO farm spam. Modern AI research assistants synthesize primary sources, provide inline clickable citations to peer-reviewed studies, and eliminate hallucinations through strict source grounding. Find the best AI research assistants for literature reviews and investigations.",
    "count": 6,
    "featuredTools": [
      "perplexity",
      "notebooklm",
      "consensus",
      "elicit"
    ]
  },
  "writing": {
    "name": "Writing & Editorial",
    "slug": "writing",
    "description": "Context-aware workspace copilots, brand voice memory, long-form SEO article generators, and narrative fiction assistants.",
    "intro": "Thin AI content farms are dead. The premier AI writing tools of 2026 serve as tireless developmental editors, brand voice enforcers, and narrative brainstormers. Discover the top tools for executive communication, long-form SEO articles, and creative storytelling.",
    "count": 6,
    "featuredTools": [
      "notion-ai",
      "jasper",
      "copy-ai",
      "grammarly-ai"
    ]
  },
  "productivity": {
    "name": "Productivity & Workspace",
    "slug": "productivity",
    "description": "Silent meeting notetakers, inbox zero copilots, system-wide Mac command bars, and automated agenda planners.",
    "intro": "Reclaim hours each week by automating repetitive administrative chores. The best AI productivity tools run quietly in the background—transcribing meetings without awkward bot attendees, drafting personalized email replies, and prioritizing your daily agenda.",
    "count": 6,
    "featuredTools": [
      "granola",
      "raycast-ai",
      "superhuman-ai",
      "fathom"
    ]
  },
  "design": {
    "name": "Design & 3D",
    "slug": "design",
    "description": "UI screen generators, 3D geometric meshes with PBR textures, sketch-to-prototype tools, and no-code website publishers.",
    "intro": "Bridge the gap from concept to interactive visual design. These AI design and 3D modeling tools generate production-ready React UI screens, export clean quad-mesh 3D models with PBR textures, and publish responsive websites with zero code.",
    "count": 6,
    "featuredTools": [
      "figma-ai",
      "spline-ai",
      "framer-ai",
      "meshy"
    ]
  },
  "marketing": {
    "name": "Marketing & SEO",
    "slug": "marketing",
    "description": "SERP competitors intelligence, ad creative generators, website personalization, and social media listening.",
    "intro": "Scale marketing performance with empirical data. These AI marketing platforms optimize articles against Google SERP competitors, generate high-converting ad variations, personalize websites for enterprise accounts, and monitor brand sentiment in real-time.",
    "count": 6,
    "featuredTools": [
      "surfer-seo",
      "adcreative-ai",
      "mutiny",
      "taplio"
    ]
  }
};
