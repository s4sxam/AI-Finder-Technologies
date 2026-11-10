import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Tool, ToolCategory, PricingType } from '../types';
import { AI_TOOLS } from '../data/tools';

export interface CommunityToolDoc {
  name: string;
  slug: string;
  websiteUrl: string;
  domainKey: string;
  description: string;
  category: ToolCategory;
  pricing: PricingType;
  tags: string[];
  logoUrl: string;
  ownerUid: string;
  submitterName: string;
  submitterPhotoURL: string;
  showSubmitter: boolean;
  createdAt: any;
  hidden: boolean;
  source: 'community';
}

export interface DuplicateCheckOutput {
  isBlocked: boolean;
  isWarning: boolean;
  message: string;
  existingTool?: {
    name: string;
    slug: string;
    websiteUrl: string;
    source: 'built-in' | 'community';
  };
}

// Blocked shorteners
const URL_SHORTENERS = new Set([
  'bit.ly',
  't.co',
  'tinyurl.com',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'goo.gl',
  'cutt.ly',
  'rebrand.ly',
  'shorturl.at',
  'rb.gy',
  't.ly',
  'bl.ink',
  'snip.ly',
  'clck.ru'
]);

// Shared platform hostnames that require host + first path segment
const SHARED_PLATFORM_HOSTS = [
  'huggingface.co',
  'github.com',
  'github.io',
  'vercel.app',
  'netlify.app',
  'notion.site',
  'streamlit.app',
  'replit.app',
  'firebaseapp.com',
  'web.app',
  'glitch.me',
  'onrender.com'
];

const ACCENT_COLORS = [
  '#2F5BFF', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B',
  '#06B6D4', '#6366F1', '#14B8A6', '#D97706', '#E11D48'
];

/**
 * Normalizes website URL into a canonical domainKey.
 * Validates HTTPS, rejects IP addresses, localhost, and URL shorteners.
 */
export function normalizeDomainKey(rawUrl: string): { domainKey?: string; error?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { error: 'Website URL is required.' };
  }

  if (!trimmed.startsWith('https://')) {
    return { error: 'Only secure HTTPS URLs are permitted (must start with https://).' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { error: 'Please enter a valid, well-formed URL.' };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  // Reject localhost and IP addresses
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
    hostname.includes(':') // IPv6
  ) {
    return { error: 'IP addresses and localhost URLs are not permitted.' };
  }

  // Reject URL shorteners
  if (URL_SHORTENERS.has(hostname)) {
    return { error: 'URL shorteners (e.g. bit.ly, tinyurl) are not permitted. Please provide the direct tool website.' };
  }

  // Check if this is a shared host needing the first path segment
  const isShared = SHARED_PLATFORM_HOSTS.some(
    (h) => hostname === h || hostname.endsWith(`.${h}`)
  );

  let key = hostname;
  if (isShared) {
    const firstSegment = parsed.pathname
      .split('/')
      .filter(Boolean)[0]
      ?.toLowerCase()
      .replace(/[^a-z0-9_-]/g, '');
    if (firstSegment) {
      key = `${hostname}_${firstSegment}`;
    }
  }

  // Clean domainKey to be valid Firestore document ID (only a-z, 0-9, ., _, -)
  const sanitizedKey = key.replace(/[^a-z0-9._-]/g, '_');
  if (!sanitizedKey || sanitizedKey.length < 3) {
    return { error: 'Invalid domain key computed from URL.' };
  }

  return { domainKey: sanitizedKey };
}

/**
 * Clean URL slug generator
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

/**
 * Standard Levenshtein Distance for typo and similar name detection
 */
export function levenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= bl; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= al; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bl; i++) {
    for (let j = 1; j <= al; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bl][al];
}

/**
 * Check for duplicate domain (blocking) or similar name (warning)
 */
export function checkDuplicateTool(
  name: string,
  websiteUrl: string,
  staticTools: Tool[],
  communityTools: Tool[]
): DuplicateCheckOutput {
  const normKeyResult = normalizeDomainKey(websiteUrl);
  const targetDomainKey = normKeyResult.domainKey;
  const allExisting = [...staticTools, ...communityTools];

  // 1. Strict Domain Check (BLOCKING)
  if (targetDomainKey) {
    for (const tool of allExisting) {
      const toolKeyResult = normalizeDomainKey(tool.websiteUrl);
      if (toolKeyResult.domainKey && toolKeyResult.domainKey === targetDomainKey) {
        return {
          isBlocked: true,
          isWarning: false,
          message: `Already listed: ${tool.name}. Tools sharing the same domain are already cataloged.`,
          existingTool: {
            name: tool.name,
            slug: tool.slug,
            websiteUrl: tool.websiteUrl,
            source: tool.source === 'community' ? 'community' : 'built-in'
          }
        };
      }
    }
  }

  // 2. Similar Name Check (WARNING)
  const cleanTargetName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanTargetName.length >= 3) {
    for (const tool of allExisting) {
      const cleanExistingName = tool.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Exact match after normalization
      if (cleanExistingName === cleanTargetName) {
        return {
          isBlocked: false,
          isWarning: true,
          message: `A tool named "${tool.name}" already exists in the directory. Is your tool distinct?`,
          existingTool: {
            name: tool.name,
            slug: tool.slug,
            websiteUrl: tool.websiteUrl,
            source: tool.source === 'community' ? 'community' : 'built-in'
          }
        };
      }

      // Levenshtein distance <= 2 for strings of reasonable length
      if (cleanTargetName.length >= 4 && cleanExistingName.length >= 4) {
        const dist = levenshteinDistance(cleanTargetName, cleanExistingName);
        if (dist <= 2) {
          return {
            isBlocked: false,
            isWarning: true,
            message: `Similar tool exists: "${tool.name}". Please ensure you are not uploading a duplicate.`,
            existingTool: {
              name: tool.name,
              slug: tool.slug,
              websiteUrl: tool.websiteUrl,
              source: tool.source === 'community' ? 'community' : 'built-in'
            }
          };
        }
      }

      // One contains the other
      if (
        cleanTargetName.length >= 5 &&
        cleanExistingName.length >= 5 &&
        (cleanTargetName.includes(cleanExistingName) || cleanExistingName.includes(cleanTargetName))
      ) {
        return {
          isBlocked: false,
          isWarning: true,
          message: `Similar tool exists: "${tool.name}". Is your tool an independent project?`,
          existingTool: {
            name: tool.name,
            slug: tool.slug,
            websiteUrl: tool.websiteUrl,
            source: tool.source === 'community' ? 'community' : 'built-in'
          }
        };
      }
    }
  }

  return { isBlocked: false, isWarning: false, message: '' };
}

/**
 * Converts a communityTools document into the standard Tool interface
 */
export function formatCommunityDocToTool(docData: CommunityToolDoc): Tool {
  const monogram = docData.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || docData.name.slice(0, 2).toUpperCase();

  // Deterministic accent color from name
  let hash = 0;
  for (let i = 0; i < docData.name.length; i++) {
    hash = docData.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const accentColor = ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];

  const now = new Date().toISOString();
  const createdDateStr = docData.createdAt?.toDate
    ? docData.createdAt.toDate().toISOString()
    : typeof docData.createdAt === 'string'
    ? docData.createdAt
    : now;

  return {
    id: `community-${docData.domainKey}`,
    name: docData.name,
    slug: docData.slug,
    tagline: docData.description,
    description: docData.description,
    category: docData.category,
    tags: docData.tags || [docData.category, 'Community'],
    pricing: docData.pricing,
    startingPrice: docData.pricing === 'Free' ? 'Free' : '$0 - Freemium',
    hasFreeTier: docData.pricing !== 'Paid',
    pricingDetails: `${docData.pricing} AI tool submitted by community creator.`,
    platforms: ['Web'],
    websiteUrl: docData.websiteUrl,
    rating: 4.8,
    reviewCount: 1,
    trendingRank: 99,
    featured: false,
    releaseYear: new Date().getFullYear(),
    lastUpdated: createdDateStr.slice(0, 7),
    bestFor: `Teams, researchers, and creators looking for specialized ${docData.category} capabilities.`,
    keyFeatures: docData.tags.length > 0 ? docData.tags : [docData.category, 'Community Added'],
    pros: ['Community verified and live immediately', 'Direct creator submission'],
    cons: ['Independent community release under active user evaluation'],
    faqs: [
      {
        question: `How do I use ${docData.name}?`,
        answer: `Access the tool directly at ${docData.websiteUrl} to review documentation, pricing, and capabilities.`
      }
    ],
    alternatives: [],
    verified: false,
    monogram,
    accentColor,
    domainKey: docData.domainKey,
    source: 'community',
    ownerUid: docData.ownerUid,
    submitterName: docData.submitterName,
    submitterPhotoURL: docData.submitterPhotoURL,
    showSubmitter: docData.showSubmitter !== false,
    logoUrl: docData.logoUrl,
    hidden: docData.hidden || false,
    createdAt: createdDateStr
  };
}

// In-Memory cache for community tools
let memoryCommunityTools: Tool[] | null = null;
let memoryCacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = 'aifinder_community_tools_cache_v1';

/**
 * Fetches all non-hidden community tools from Firestore with 5-minute memory + sessionStorage cache.
 */
export async function fetchCommunityTools(forceRefresh = false): Promise<Tool[]> {
  const now = Date.now();

  // 1. In-memory check
  if (!forceRefresh && memoryCommunityTools && (now - memoryCacheTimestamp < CACHE_TTL_MS)) {
    return memoryCommunityTools;
  }

  // 2. SessionStorage check
  if (!forceRefresh) {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.timestamp && (now - parsed.timestamp < CACHE_TTL_MS) && Array.isArray(parsed.tools)) {
          memoryCommunityTools = parsed.tools;
          memoryCacheTimestamp = parsed.timestamp;
          return memoryCommunityTools!;
        }
      }
    } catch (e) {
      console.warn('SessionStorage cache read warning:', e);
    }
  }

  // 3. Firestore Read
  try {
    const colRef = collection(db, 'communityTools');
    const q = query(colRef, limit(300));
    const snapshot = await getDocs(q);

    const tools: Tool[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as CommunityToolDoc;
      if (data.hidden !== true) {
        tools.push(formatCommunityDocToTool(data));
      }
    });

    memoryCommunityTools = tools;
    memoryCacheTimestamp = now;

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: now, tools }));
    } catch (e) {
      console.warn('SessionStorage write warning:', e);
    }

    return tools;
  } catch (err) {
    console.error('Failed to fetch communityTools from Firestore:', err);
    handleFirestoreError(err, OperationType.LIST, 'communityTools');
    return memoryCommunityTools || [];
  }
}

/**
 * Direct lookup for a community tool by slug (for direct /tools/:slug hits)
 */
export async function getCommunityToolBySlug(slug: string): Promise<Tool | null> {
  const cleanSlug = slug.toLowerCase().trim();

  // Check current memory/session cache first
  const cached = await fetchCommunityTools();
  const foundInCache = cached.find((t) => t.slug === cleanSlug);
  if (foundInCache) return foundInCache;

  // Direct Firestore query
  try {
    const colRef = collection(db, 'communityTools');
    const q = query(colRef, where('slug', '==', cleanSlug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docData = snapshot.docs[0].data() as CommunityToolDoc;
      if (docData.hidden !== true) {
        const formatted = formatCommunityDocToTool(docData);
        // Cache update
        if (memoryCommunityTools) {
          memoryCommunityTools = [
            ...memoryCommunityTools.filter((t) => t.slug !== cleanSlug),
            formatted
          ];
        }
        return formatted;
      }
    }
    return null;
  } catch (err) {
    console.error(`Failed to query community tool by slug ${cleanSlug}:`, err);
    return null;
  }
}

/**
 * Dispatches a global event so all components update their tool state
 */
export function notifyCommunityToolsUpdated() {
  memoryCommunityTools = null;
  memoryCacheTimestamp = 0;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent('aifinder_community_tools_changed'));
}

/**
 * Submits a new community tool immediately into Firestore.
 * Performs a batched write including rate-limit tracking doc at `users/{uid}/limits/submissions`.
 */
export async function submitCommunityTool(
  params: {
    name: string;
    websiteUrl: string;
    description: string;
    category: ToolCategory;
    pricing: PricingType;
    tags?: string[];
    showSubmitter?: boolean;
    customSlug?: string;
  },
  user: User
): Promise<{ success: boolean; slug: string; tool: Tool }> {
  if (!user) {
    throw new Error('Authentication required: please sign in with Google to submit.');
  }

  const { domainKey, error: domainError } = normalizeDomainKey(params.websiteUrl);
  if (domainError || !domainKey) {
    throw new Error(domainError || 'Invalid website URL.');
  }

  const name = params.name.trim();
  if (name.length < 2 || name.length > 100) {
    throw new Error('Tool name must be between 2 and 100 characters.');
  }

  const description = params.description.trim();
  if (description.length < 20 || description.length > 300) {
    throw new Error('Description must be between 20 and 300 characters.');
  }

  const slug = (params.customSlug?.trim() || generateSlug(name)).toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug must contain only lowercase letters, numbers, and hyphens.');
  }

  const parsedTags = (params.tags || [])
    .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
    .filter(Boolean)
    .slice(0, 10);

  // Logo URL using high-res Google favicon service
  const hostname = new URL(params.websiteUrl).hostname.replace(/^www\./, '');
  const logoUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  // Rate limit check: fetch users/{uid}/limits/submissions
  const limitDocRef = doc(db, 'users', user.uid, 'limits', 'submissions');
  let currentCount = 0;
  let windowStartTimestamp = Timestamp.now();

  try {
    const limitSnap = await getDoc(limitDocRef);
    if (limitSnap.exists()) {
      const data = limitSnap.data();
      const windowStart = data.windowStart as Timestamp;
      const count = typeof data.count === 'number' ? data.count : 0;
      const windowAgeMs = Date.now() - (windowStart?.toMillis ? windowStart.toMillis() : 0);

      // 24 hour window = 86,400,000 ms
      if (windowAgeMs < 24 * 60 * 60 * 1000) {
        if (count >= 5) {
          throw new Error('Daily rate limit reached: users can submit up to 5 tools per 24 hours to prevent spam.');
        }
        currentCount = count;
        windowStartTimestamp = windowStart;
      } else {
        // Reset window
        currentCount = 0;
        windowStartTimestamp = Timestamp.now();
      }
    }
  } catch (err: any) {
    if (err?.message?.includes('rate limit')) throw err;
    console.warn('Rate limit read warning:', err);
  }

  const nextCount = currentCount + 1;

  // Prepare communityTools doc payload
  const communityDocRef = doc(db, 'communityTools', domainKey);

  // Check if document already exists
  try {
    const existingSnap = await getDoc(communityDocRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data();
      throw new Error(`Already listed: "${existingData.name || name}". A tool for this website is already live.`);
    }
  } catch (err: any) {
    if (err?.message?.includes('Already listed')) throw err;
  }

  const communityDocPayload: CommunityToolDoc = {
    name,
    slug,
    websiteUrl: params.websiteUrl.trim(),
    domainKey,
    description,
    category: params.category,
    pricing: params.pricing,
    tags: parsedTags,
    logoUrl,
    ownerUid: user.uid,
    submitterName: user.displayName || 'Community Creator',
    submitterPhotoURL: user.photoURL || '',
    showSubmitter: params.showSubmitter !== false,
    createdAt: serverTimestamp(),
    hidden: false,
    source: 'community'
  };

  const batch = writeBatch(db);
  batch.set(communityDocRef, communityDocPayload);
  batch.set(limitDocRef, {
    count: nextCount,
    windowStart: windowStartTimestamp,
    updatedAt: serverTimestamp()
  });

  try {
    await batch.commit();
  } catch (err: any) {
    console.error('Batch submission commit error:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
      throw new Error(`Submission blocked by security policy: tool may already exist or daily rate limit (5 tools/day) exceeded.`);
    }
    handleFirestoreError(err, OperationType.WRITE, `communityTools/${domainKey}`);
    throw err;
  }

  const createdTool = formatCommunityDocToTool({
    ...communityDocPayload,
    createdAt: new Date().toISOString()
  });

  notifyCommunityToolsUpdated();

  return {
    success: true,
    slug,
    tool: createdTool
  };
}

/**
 * Updates editable fields of a user-owned community tool.
 */
export async function updateCommunityTool(
  domainKey: string,
  updates: {
    description?: string;
    tags?: string[];
    showSubmitter?: boolean;
  },
  user: User
): Promise<void> {
  if (!user) throw new Error('Authentication required.');

  const docRef = doc(db, 'communityTools', domainKey);

  const payload: Record<string, any> = {};
  if (updates.description !== undefined) {
    const desc = updates.description.trim();
    if (desc.length < 20 || desc.length > 300) {
      throw new Error('Description must be between 20 and 300 characters.');
    }
    payload.description = desc;
  }
  if (updates.tags !== undefined) {
    payload.tags = updates.tags
      .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
      .filter(Boolean)
      .slice(0, 10);
  }
  if (updates.showSubmitter !== undefined) {
    payload.showSubmitter = Boolean(updates.showSubmitter);
  }

  try {
    await updateDoc(docRef, payload);
    notifyCommunityToolsUpdated();
  } catch (err) {
    console.error('Failed to update community tool:', err);
    handleFirestoreError(err, OperationType.UPDATE, `communityTools/${domainKey}`);
  }
}

/**
 * Deletes a community tool owned by the user.
 */
export async function deleteCommunityTool(domainKey: string, user: User): Promise<void> {
  if (!user) throw new Error('Authentication required.');

  const docRef = doc(db, 'communityTools', domainKey);
  try {
    await deleteDoc(docRef);
    notifyCommunityToolsUpdated();
  } catch (err) {
    console.error('Failed to delete community tool:', err);
    handleFirestoreError(err, OperationType.DELETE, `communityTools/${domainKey}`);
  }
}

/**
 * Submits a takedown/content report for a community tool.
 * Document ID = `reports/{domainKey}_{uid}`
 */
export async function submitToolReport(
  domainKey: string,
  slug: string,
  reason: string,
  user: User
): Promise<void> {
  if (!user) throw new Error('Authentication required to submit a report.');

  const cleanReason = reason.trim();
  if (cleanReason.length < 5 || cleanReason.length > 500) {
    throw new Error('Report explanation must be between 5 and 500 characters.');
  }

  const reportId = `${domainKey}_${user.uid}`;
  const reportDocRef = doc(db, 'reports', reportId);

  try {
    await setDoc(reportDocRef, {
      domainKey,
      slug,
      reason: cleanReason,
      reporterUid: user.uid,
      reporterName: user.displayName || 'Anonymous Reporter',
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Failed to submit tool report:', err);
    handleFirestoreError(err, OperationType.CREATE, `reports/${reportId}`);
  }
}

/**
 * Fetches all community tools submitted by a specific user (for /account/submissions).
 */
export async function fetchUserCommunityTools(uid: string): Promise<Tool[]> {
  try {
    const colRef = collection(db, 'communityTools');
    const q = query(colRef, where('ownerUid', '==', uid));
    const snapshot = await getDocs(q);

    const tools: Tool[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as CommunityToolDoc;
      tools.push(formatCommunityDocToTool(data));
    });
    return tools;
  } catch (err) {
    console.error('Failed to fetch user community tools:', err);
    handleFirestoreError(err, OperationType.LIST, 'communityTools');
    return [];
  }
}

/**
 * Migrates legacy `submissions` docs for the signed-in user into `communityTools`.
 */
export async function migrateLegacySubmissions(user: User): Promise<{ migratedCount: number; errors: string[] }> {
  if (!user) throw new Error('Authentication required.');

  const legacyCol = collection(db, 'submissions');
  const q = query(legacyCol, where('ownerUid', '==', user.uid));
  const snap = await getDocs(q);

  let migratedCount = 0;
  const errors: string[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    if (data.migrated === true) continue;

    const rawUrl = data.websiteUrl || '';
    const { domainKey, error } = normalizeDomainKey(rawUrl);
    if (error || !domainKey) {
      errors.push(`Could not migrate "${data.name}": ${error || 'Invalid URL'}`);
      continue;
    }

    try {
      const targetDocRef = doc(db, 'communityTools', domainKey);
      const existsSnap = await getDoc(targetDocRef);

      if (!existsSnap.exists()) {
        const communityPayload: CommunityToolDoc = {
          name: data.name || 'Untitled Tool',
          slug: data.slug || generateSlug(data.name || 'tool'),
          websiteUrl: rawUrl,
          domainKey,
          description: data.description?.slice(0, 300) || data.tagline?.slice(0, 300) || 'Community submitted AI tool.',
          category: data.category || 'coding',
          pricing: data.pricing || 'Freemium',
          tags: Array.isArray(data.keyFeatures) ? data.keyFeatures.slice(0, 10) : [data.category || 'AI'],
          logoUrl: `https://www.google.com/s2/favicons?domain=${new URL(rawUrl).hostname.replace(/^www\./, '')}&sz=128`,
          ownerUid: user.uid,
          submitterName: user.displayName || 'Community Creator',
          submitterPhotoURL: user.photoURL || '',
          showSubmitter: true,
          createdAt: serverTimestamp(),
          hidden: false,
          source: 'community'
        };

        await setDoc(targetDocRef, communityPayload);
        migratedCount++;
      }

      // Mark legacy doc as migrated
      await updateDoc(docSnap.ref, { migrated: true });
    } catch (err: any) {
      errors.push(`Error migrating "${data.name}": ${err?.message || 'Write failed'}`);
    }
  }

  if (migratedCount > 0) {
    notifyCommunityToolsUpdated();
  }

  return { migratedCount, errors };
}
