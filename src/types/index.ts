export type ToolCategory =
  | 'chat'
  | 'coding'
  | 'image'
  | 'video'
  | 'audio'
  | 'research'
  | 'writing'
  | 'productivity'
  | 'design'
  | 'marketing';

export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial';

export interface ToolFaq {
  question: string;
  answer: string;
}

export type TaskId =
  | 'chat'
  | 'coding'
  | 'imageGen'
  | 'videoGen'
  | 'audioVoice'
  | 'research'
  | 'writing'
  | 'dataAnalysis'
  | 'docAnalysis'
  | 'agents';

export type TaskScore = 0 | 1 | 2; // 0 = no, 1 = limited, 2 = strong

export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  pricing: PricingType;
  startingPrice?: string; // e.g. "$10/mo" or "Free"
  hasFreeTier: boolean;
  pricingDetails: string;
  platforms: string[];
  websiteUrl: string;
  rating: number; // e.g. 4.9
  reviewCount: number;
  trendingRank: number;
  featured: boolean;
  releaseYear: number;
  lastUpdated: string; // e.g. "2026-03"
  bestFor: string;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  faqs: ToolFaq[];
  alternatives: string[]; // slugs of alternative tools
  verified: boolean;
  monogram: string;
  accentColor: string;
  monthlyUsers?: string;
  githubStars?: string;
  capabilities?: Partial<Record<TaskId, TaskScore>>;
  lastReviewed?: string;
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  author: Author;
  category: ToolCategory | 'general';
  tags: string[];
  readTimeMinutes: number;
  targetKeyword: string;
  searchIntent: 'Commercial' | 'Informational' | 'Comparative' | 'Educational';
  outline: string[];
  content: string;
  faqs: ToolFaq[];
  relatedToolSlugs: string[];
}

export interface FilterOptions {
  search: string;
  category: ToolCategory | 'all';
  pricing: PricingType | 'all';
  hasFreeTier?: boolean;
  platform: string;
  sortBy: 'trending' | 'rating' | 'newest' | 'alphabetical';
  onlyVerified: boolean;
  onlyBookmarked: boolean;
}

// Phase 4: Live Benchmark Models
export interface LiveModel {
  id: string;
  name: string;
  creator: string;
  intelligenceIndex: number | null;
  codingIndex: number | null;
  agenticIndex: number | null;
  outputTokensPerSec: number | null;
  ttftSec: number | null;
  priceInPerM: number | null;
  priceOutPerM: number | null;
  contextLength: number | null;
  isFree: boolean;
  modality?: string;
  toolSlug?: string; // Link to tool in directory if applicable
}

export interface BenchmarkData {
  fetchedAt: string;
  source: string;
  totalModels: number;
  freeModelsCount: number;
  models: LiveModel[];
}

export interface BenchmarkHistoryPoint {
  date: string;
  models: {
    id: string;
    name: string;
    intelligenceIndex: number;
  }[];
}

export type BenchmarkHistory = BenchmarkHistoryPoint[];

// Phase 6: Free AI API Provider Hub
export interface FreeApiStep {
  title: string;
  instruction: string;
  codeSnippet?: {
    lang: string;
    filename?: string;
    code: string;
  };
  note?: string;
}

export interface FreeApiProvider {
  id: string;
  name: string;
  websiteUrl: string;
  getKeyUrl: string;
  docsUrl: string;
  limitsUrl: string;
  baseUrl: string;
  openAiCompatible: boolean;
  creditCardRequired: 'no' | 'yes' | 'unknown';
  phoneVerification: boolean | 'unknown';
  envVarName: string;
  bestFor: string;
  freeTierSummary: string;
  regionNotes?: string;
  steps: FreeApiStep[];
  lastVerified: string;
  isDataApi?: boolean;
  attributionNote?: string;
}
