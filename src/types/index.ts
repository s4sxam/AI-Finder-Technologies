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
