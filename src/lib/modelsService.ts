import { collection, doc, setDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AI_TOOLS } from '../data/tools';
import { Tool, ToolCategory, PricingType } from '../types';

export interface NewModelPayload {
  name: string;
  slug?: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  pricing: PricingType;
  startingPrice?: string;
  hasFreeTier: boolean;
  websiteUrl: string;
  tags?: string[];
  keyFeatures?: string[];
  pros?: string[];
  cons?: string[];
  submitterName?: string;
  submitterEmail?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateReason?: string;
  matchedField?: 'name' | 'slug' | 'websiteUrl';
  existingModel?: {
    name: string;
    slug: string;
    websiteUrl: string;
    source: 'built-in' | 'community';
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Color palette for auto-generating monograms
const ACCENT_COLORS = [
  '#2F5BFF', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B',
  '#06B6D4', '#6366F1', '#14B8A6', '#D97706', '#E11D48'
];

/**
 * Normalizes strings by removing whitespace, punctuation, and lowercasing for fuzzy matching
 */
export function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Normalizes URLs to compare root domains & paths regardless of protocol or www
 */
export function normalizeUrl(urlStr: string): string {
  try {
    const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    return (parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '')).toLowerCase();
  } catch {
    return urlStr.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  }
}

/**
 * Creates a clean URL-friendly slug from a model name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Validates model input fields strictly
 */
export function validateModelPayload(payload: NewModelPayload): ValidationResult {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push('Model name must be at least 2 characters long.');
  } else if (payload.name.length > 100) {
    errors.push('Model name cannot exceed 100 characters.');
  }

  const slug = payload.slug || generateSlug(payload.name);
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug must contain only lowercase alphanumeric characters and hyphens.');
  }

  if (!payload.tagline || payload.tagline.trim().length < 5) {
    errors.push('Tagline must be at least 5 characters long.');
  } else if (payload.tagline.length > 250) {
    errors.push('Tagline cannot exceed 250 characters.');
  }

  if (payload.description && payload.description.length > 3000) {
    errors.push('Description cannot exceed 3,000 characters.');
  }

  if (!payload.websiteUrl || (!payload.websiteUrl.startsWith('http://') && !payload.websiteUrl.startsWith('https://'))) {
    errors.push('Official website URL must start with http:// or https://');
  }

  const validCategories: ToolCategory[] = [
    'chat', 'coding', 'image', 'video', 'audio', 'research', 'writing', 'productivity', 'design', 'marketing'
  ];
  if (!validCategories.includes(payload.category)) {
    errors.push(`Invalid category: ${payload.category}`);
  }

  const validPricing: PricingType[] = ['Free', 'Freemium', 'Paid', 'Free Trial'];
  if (!validPricing.includes(payload.pricing)) {
    errors.push(`Invalid pricing model: ${payload.pricing}`);
  }

  if (payload.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.submitterEmail)) {
    errors.push('Please provide a valid submitter email address.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Checks if a model name, slug, or website URL already exists in either:
 * 1. The 63 verified built-in dataset
 * 2. The live Firestore community database
 */
export async function detectDuplicateModel(
  name: string,
  websiteUrl: string,
  customSlug?: string,
  communityModels: Tool[] = []
): Promise<DuplicateCheckResult> {
  const targetNameNorm = normalizeKey(name);
  const targetSlug = (customSlug || generateSlug(name)).toLowerCase();
  const targetUrlNorm = normalizeUrl(websiteUrl);

  // 1. Check against built-in tools
  for (const tool of AI_TOOLS) {
    const existingNameNorm = normalizeKey(tool.name);
    const existingSlug = tool.slug.toLowerCase();
    const existingUrlNorm = normalizeUrl(tool.websiteUrl);

    if (existingSlug === targetSlug) {
      return {
        isDuplicate: true,
        matchedField: 'slug',
        duplicateReason: `A verified model with the identifier slug "${existingSlug}" already exists (${tool.name}).`,
        existingModel: {
          name: tool.name,
          slug: tool.slug,
          websiteUrl: tool.websiteUrl,
          source: 'built-in'
        }
      };
    }

    if (existingNameNorm === targetNameNorm) {
      return {
        isDuplicate: true,
        matchedField: 'name',
        duplicateReason: `An AI model with the name "${tool.name}" is already cataloged in the directory.`,
        existingModel: {
          name: tool.name,
          slug: tool.slug,
          websiteUrl: tool.websiteUrl,
          source: 'built-in'
        }
      };
    }

    if (existingUrlNorm === targetUrlNorm && targetUrlNorm.length > 3) {
      return {
        isDuplicate: true,
        matchedField: 'websiteUrl',
        duplicateReason: `The website "${tool.websiteUrl}" is already registered under "${tool.name}".`,
        existingModel: {
          name: tool.name,
          slug: tool.slug,
          websiteUrl: tool.websiteUrl,
          source: 'built-in'
        }
      };
    }
  }

  // 2. Check against already loaded or passed community models
  for (const cTool of communityModels) {
    const existingNameNorm = normalizeKey(cTool.name);
    const existingSlug = cTool.slug.toLowerCase();
    const existingUrlNorm = normalizeUrl(cTool.websiteUrl);

    if (existingSlug === targetSlug) {
      return {
        isDuplicate: true,
        matchedField: 'slug',
        duplicateReason: `A community AI model with slug "${existingSlug}" was already uploaded previously.`,
        existingModel: {
          name: cTool.name,
          slug: cTool.slug,
          websiteUrl: cTool.websiteUrl,
          source: 'community'
        }
      };
    }

    if (existingNameNorm === targetNameNorm) {
      return {
        isDuplicate: true,
        matchedField: 'name',
        duplicateReason: `The community model "${cTool.name}" has already been uploaded to the database.`,
        existingModel: {
          name: cTool.name,
          slug: cTool.slug,
          websiteUrl: cTool.websiteUrl,
          source: 'community'
        }
      };
    }

    if (existingUrlNorm === targetUrlNorm && targetUrlNorm.length > 3) {
      return {
        isDuplicate: true,
        matchedField: 'websiteUrl',
        duplicateReason: `The website domain "${cTool.websiteUrl}" is already registered under community model "${cTool.name}".`,
        existingModel: {
          name: cTool.name,
          slug: cTool.slug,
          websiteUrl: cTool.websiteUrl,
          source: 'community'
        }
      };
    }
  }

  // 3. Fallback direct Firestore check if communityModels was not provided or empty
  if (communityModels.length === 0) {
    try {
      const modelsCol = collection(db, 'models');
      const snap = await getDocs(modelsCol);
      for (const d of snap.docs) {
        const data = d.data();
        if (data.slug?.toLowerCase() === targetSlug) {
          return {
            isDuplicate: true,
            matchedField: 'slug',
            duplicateReason: `A model with slug "${targetSlug}" already exists in the database.`,
            existingModel: {
              name: data.name,
              slug: data.slug,
              websiteUrl: data.websiteUrl,
              source: 'community'
            }
          };
        }
        if (normalizeKey(data.name || '') === targetNameNorm) {
          return {
            isDuplicate: true,
            matchedField: 'name',
            duplicateReason: `A model named "${data.name}" has already been uploaded previously.`,
            existingModel: {
              name: data.name,
              slug: data.slug,
              websiteUrl: data.websiteUrl,
              source: 'community'
            }
          };
        }
        if (normalizeUrl(data.websiteUrl || '') === targetUrlNorm) {
          return {
            isDuplicate: true,
            matchedField: 'websiteUrl',
            duplicateReason: `This website URL is already linked to model "${data.name}".`,
            existingModel: {
              name: data.name,
              slug: data.slug,
              websiteUrl: data.websiteUrl,
              source: 'community'
            }
          };
        }
      }
    } catch (err) {
      console.warn('Could not query Firestore for duplicate check, proceeding with local check', err);
    }
  }

  return { isDuplicate: false };
}

/**
 * Uploads a validated, deduplicated model directly into Firestore
 */
export async function uploadModel(payload: NewModelPayload, existingCommunity: Tool[] = []): Promise<Tool> {
  // 1. Strict validation
  const validation = validateModelPayload(payload);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  const slug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.name);

  // 2. Duplicate detection
  const duplicate = await detectDuplicateModel(payload.name, payload.websiteUrl, slug, existingCommunity);
  if (duplicate.isDuplicate) {
    throw new Error(`DUPLICATE DETECTED: ${duplicate.duplicateReason}`);
  }

  // 3. Construct clean Tool document
  const monogram = payload.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || payload.name.slice(0, 2).toUpperCase();

  const accentColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
  const docId = `model-${slug}`;
  const now = new Date().toISOString();

  const firestoreData = {
    id: docId,
    name: payload.name.trim(),
    slug,
    tagline: payload.tagline.trim(),
    description: (payload.description || payload.tagline).trim(),
    category: payload.category,
    pricing: payload.pricing,
    startingPrice: payload.startingPrice?.trim() || (payload.hasFreeTier ? 'Free' : 'Custom'),
    hasFreeTier: payload.hasFreeTier,
    pricingDetails: payload.startingPrice
      ? `Pricing starts at ${payload.startingPrice}. ${payload.hasFreeTier ? 'Free tier available.' : 'Paid subscription required.'}`
      : `${payload.pricing} model. ${payload.hasFreeTier ? 'Includes free tier.' : ''}`,
    platforms: ['Web', 'API'],
    websiteUrl: payload.websiteUrl.trim(),
    rating: 4.8,
    reviewCount: 1,
    trendingRank: 99,
    featured: false,
    releaseYear: new Date().getFullYear(),
    lastUpdated: now.slice(0, 7),
    bestFor: `Teams, researchers, and creators looking for specialized ${payload.category} capabilities.`,
    keyFeatures: payload.keyFeatures && payload.keyFeatures.length > 0
      ? payload.keyFeatures
      : [payload.tagline],
    pros: payload.pros && payload.pros.length > 0 ? payload.pros : ['Community verified and live in directory'],
    cons: payload.cons && payload.cons.length > 0 ? payload.cons : ['Recent release under active community testing'],
    faqs: [
      {
        question: `How do I get started with ${payload.name}?`,
        answer: `Visit the official website at ${payload.websiteUrl} to review documentation and access the model.`
      }
    ],
    alternatives: [],
    verified: false,
    monogram,
    accentColor,
    tags: payload.tags || [payload.category, 'AI', 'Community'],
    submitterName: payload.submitterName || 'Community Contributor',
    submitterEmail: payload.submitterEmail || '',
    status: 'published',
    createdAt: now
  };

  // 4. Save to Firestore
  const path = 'models';
  try {
    const docRef = doc(db, path, docId);
    await setDoc(docRef, firestoreData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${docId}`);
  }

  return firestoreData as Tool;
}

/**
 * Attaches real-time Firestore listener for all published community models
 */
export function subscribeToCommunityModels(
  onUpdate: (models: Tool[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'models';
  try {
    const modelsCol = collection(db, path);
    return onSnapshot(
      modelsCol,
      (snapshot) => {
        const loaded: Tool[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.status === 'published' || !data.status) {
            loaded.push(data as Tool);
          }
        });
        onUpdate(loaded);
      },
      (error) => {
        console.error('Community models subscription error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (err) {
    console.error('Failed to set up models listener:', err);
    return () => {};
  }
}
