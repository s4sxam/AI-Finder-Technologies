import { z } from 'zod';

export const toolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  tagline: z.string().min(5),
  description: z.string().min(20),
  category: z.enum([
    'chat',
    'coding',
    'image',
    'video',
    'audio',
    'research',
    'writing',
    'productivity',
    'design',
    'marketing'
  ]),
  tags: z.array(z.string()).min(1),
  pricing: z.enum(['Free', 'Freemium', 'Paid', 'Free Trial']),
  startingPrice: z.string().optional(),
  hasFreeTier: z.boolean(),
  pricingDetails: z.string().min(5),
  platforms: z.array(z.string()).min(1),
  websiteUrl: z.string().regex(/^https:\/\/[^\s]+$/, 'Must be a valid HTTPS URL'),
  rating: z.number().min(1).max(5),
  reviewCount: z.number().nonnegative(),
  trendingRank: z.number().positive(),
  featured: z.boolean(),
  releaseYear: z.number().min(1990).max(2035),
  lastUpdated: z.string().min(4),
  bestFor: z.string().min(5),
  keyFeatures: z.array(z.string()).min(1),
  pros: z.array(z.string()).min(1),
  cons: z.array(z.string()).min(1),
  faqs: z.array(
    z.object({
      question: z.string().min(3),
      answer: z.string().min(5)
    })
  ),
  alternatives: z.array(z.string()),
  verified: z.boolean(),
  monogram: z.string().min(1).max(4),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  monthlyUsers: z.string().optional(),
  githubStars: z.string().optional(),
  capabilities: z.record(z.number()).optional(),
  lastReviewed: z.string().optional(),
  domainKey: z.string().optional(),
  source: z.enum(['built-in', 'community']).optional(),
  lastVerified: z.string().optional(),
  sourceUrl: z.string().optional(),
  priceVerifiedAt: z.string().optional(),
  needsReview: z.boolean().optional()
});

export const toolsDatasetSchema = z.array(toolSchema).refine(
  (tools) => {
    const slugs = new Set<string>();
    const ids = new Set<string>();
    for (const tool of tools) {
      if (slugs.has(tool.slug)) return false;
      if (ids.has(tool.id)) return false;
      slugs.add(tool.slug);
      ids.add(tool.id);
    }
    return true;
  },
  { message: 'All tool slugs and IDs must be completely unique.' }
);
