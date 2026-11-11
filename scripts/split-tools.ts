import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AI_TOOLS, CATEGORIES_META } from '../src/data/tools.ts';
import { toolSchema, toolsDatasetSchema } from '../src/data/toolSchema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const toolsDir = path.resolve(rootDir, 'src/data/tools');

if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

console.log(`[SPLIT TOOLS] Processing ${AI_TOOLS.length} tools...`);

const processedTools: any[] = [];
const slugList: string[] = [];

for (const tool of AI_TOOLS) {
  const updated: any = { ...tool };

  if (tool.slug === 'claude') {
    updated.name = 'Claude';
    updated.tagline = 'Frontier reasoning intelligence model excelling at complex logic, deep coding, and nuanced prose.';
    updated.description = "Anthropic's flagship family of models (Opus, Sonnet, and Haiku) offering instant responses, extended thinking tokens, and industry-leading developer and coding capabilities.";
    updated.websiteUrl = 'https://claude.ai';
    updated.sourceUrl = 'https://docs.anthropic.com';
    updated.lastVerified = '2026-11-10';
    updated.priceVerifiedAt = '2026-11-10';
    updated.startingPrice = '$20/mo';
    updated.hasFreeTier = true;
    updated.verified = true;
    updated.needsReview = false;
  } else {
    // Preserve existing verified data, set needsReview for manual auditor verification
    updated.sourceUrl = tool.websiteUrl;
    updated.lastVerified = tool.lastReviewed || '2026-03-01';
    updated.needsReview = true;
  }

  // Validate single tool schema
  const parsed = toolSchema.parse(updated);
  processedTools.push(parsed);
  slugList.push(tool.slug);

  const toolFilePath = path.join(toolsDir, `${tool.slug}.json`);
  fs.writeFileSync(toolFilePath, JSON.stringify(parsed, null, 2), 'utf8');
}

// Validate entire dataset (uniqueness of slugs, IDs)
toolsDatasetSchema.parse(processedTools);
console.log(`[SPLIT TOOLS] All ${processedTools.length} tools successfully validated with Zod!`);

// Generate src/data/tools/index.ts
const importsCode = slugList
  .map((slug, idx) => `import tool_${idx} from './${slug}.json';`)
  .join('\n');

const arrayItems = slugList
  .map((_, idx) => `  tool_${idx} as unknown as Tool`)
  .join(',\n');

const categoriesMetaCode = JSON.stringify(CATEGORIES_META, null, 2);

const indexTsContent = `import { Tool, ToolCategory } from '../../types';
${importsCode}

export const AI_TOOLS: Tool[] = [
${arrayItems}
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
> = ${categoriesMetaCode};
`;

fs.writeFileSync(path.join(toolsDir, 'index.ts'), indexTsContent, 'utf8');
console.log(`[SPLIT TOOLS] Written src/data/tools/index.ts.`);
