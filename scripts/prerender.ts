import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AI_TOOLS, CATEGORIES_META } from '../src/data/tools.ts';
import { BLOG_POSTS } from '../src/data/blogPosts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const publicDir = path.resolve(rootDir, 'public');

const BASE_URL = process.env.VITE_APP_URL || 'https://yourdomain.com';

interface RouteMeta {
  path: string;
  title: string;
  description: string;
  type?: string;
  jsonLd?: object[];
}

// 1. Gather all routes
const routes: RouteMeta[] = [
  {
    path: '/',
    title: 'AI Finder Technologies – Premier Directory of AI Tools & Benchmarks',
    description: 'Discover, compare, and master premier AI tools for coding, writing, research, visual creation, and workflow automation. Verified reviews, pricing, and benchmarks.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'AI Finder Technologies',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.svg`,
        sameAs: ['https://twitter.com/aifindertech', 'https://github.com/aifindertech']
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'AI Finder Technologies',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/tools?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  },
  {
    path: '/tools',
    title: 'AI Tools Directory – Browse All 60+ Verified Software | AI Finder',
    description: 'Filter and compare 60+ verified AI applications across developer tools, foundation reasoning, generative video, and academic search.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Directory', item: `${BASE_URL}/tools` }
        ]
      }
    ]
  },
  {
    path: '/categories',
    title: 'AI Categories & Taxonomies | AI Finder Technologies',
    description: 'Explore artificial intelligence applications organized across 10 distinct creative, engineering, and research disciplines.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE_URL}/categories` }
        ]
      }
    ]
  },
  {
    path: '/compare',
    title: 'Side-by-Side AI Tool Comparison Matrix | AI Finder Technologies',
    description: 'Compare top artificial intelligence software side by side across pricing, platforms, features, pros, and trade-offs.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Compare', item: `${BASE_URL}/compare` }
        ]
      }
    ]
  },
  {
    path: '/blog',
    title: 'AI Engineering Benchmarks & Editorial Guides | AI Finder',
    description: 'Original, non-sponsored investigations and comparative benchmarks designed to help developers and researchers choose the right AI tools.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` }
        ]
      }
    ]
  },
  {
    path: '/about',
    title: 'About AI Finder Technologies – Independence Manifesto & Testing Methodology',
    description: 'Learn about our 4-stage evaluation framework, zero-sponsored ranking guarantee, and research architecture team.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` }
        ]
      }
    ]
  },
  {
    path: '/contact',
    title: 'Contact & Submit a Tool | AI Finder Technologies',
    description: 'Submit a new artificial intelligence tool for editorial verification, challenge benchmark data, or contact our research team.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` }
        ]
      }
    ]
  },
  {
    path: '/submit',
    title: 'Submit an AI Tool for Evaluation | AI Finder Technologies',
    description: 'Submit a new artificial intelligence tool for independent verification, benchmarks, and inclusion in our directory.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Submit a Tool', item: `${BASE_URL}/submit` }
        ]
      }
    ]
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | AI Finder Technologies',
    description: 'Our privacy-by-design policy: zero tracking pixels, local bookmark storage, and zero selling of personal data.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${BASE_URL}/privacy` }
        ]
      }
    ]
  },
  {
    path: '/terms',
    title: 'Terms of Service | AI Finder Technologies',
    description: 'Terms of use, evaluation disclaimers, and intellectual property terms for AI Finder Technologies.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${BASE_URL}/terms` }
        ]
      }
    ]
  },
  {
    path: '/nexus-3d',
    title: '3D AI Constellation Nexus (WebGL PBR) | AI Finder Technologies',
    description: 'Interactive Three.js 3D spatial constellation nexus for exploring artificial intelligence tools and category clusters.',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: '3D Nexus', item: `${BASE_URL}/nexus-3d` }
        ]
      }
    ]
  }
];

// Add all 10 Category routes
(Object.keys(CATEGORIES_META) as Array<keyof typeof CATEGORIES_META>).forEach((catKey) => {
  const meta = CATEGORIES_META[catKey];
  routes.push({
    path: `/category/${catKey}`,
    title: `Best AI ${meta.name} Tools in 2026 | AI Finder Technologies`,
    description: meta.description,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Categories', item: `${BASE_URL}/categories` },
          { '@type': 'ListItem', position: 3, name: meta.name, item: `${BASE_URL}/category/${catKey}` }
        ]
      }
    ]
  });
});

// Add all 60+ Tool routes
AI_TOOLS.forEach((tool) => {
  routes.push({
    path: `/tools/${tool.slug}`,
    title: `${tool.name} Review, Pricing & Alternatives (2026) | AI Finder`,
    description: `${tool.tagline} Verified ratings, specifications, pros & cons, and key alternatives.`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Directory', item: `${BASE_URL}/tools` },
          { '@type': 'ListItem', position: 3, name: tool.category, item: `${BASE_URL}/category/${tool.category}` },
          { '@type': 'ListItem', position: 4, name: tool.name, item: `${BASE_URL}/tools/${tool.slug}` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: tool.category,
        operatingSystem: tool.platforms.join(', '),
        description: tool.description,
        offers: {
          '@type': 'Offer',
          price: tool.hasFreeTier ? '0' : '20.00',
          priceCurrency: 'USD'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.rating,
          reviewCount: tool.reviewCount,
          bestRating: '5',
          worstRating: '1'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      }
    ]
  });
});

// Add all 10 Blog Post routes
BLOG_POSTS.forEach((post) => {
  routes.push({
    path: `/blog/${post.slug}`,
    title: `${post.title} | AI Finder`,
    description: post.description,
    type: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated,
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role
        },
        publisher: {
          '@type': 'Organization',
          name: 'AI Finder Technologies',
          url: BASE_URL
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/blog/${post.slug}`
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      }
    ]
  });
});

// Helper to sanitize strings for HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function runPrerender() {
  console.log(`[PRERENDER] Starting static HTML generation for ${routes.length} routes...`);

  const templatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`[PRERENDER ERROR] Could not find ${templatePath}. Run 'vite build' first.`);
    process.exit(1);
  }

  const baseTemplate = fs.readFileSync(templatePath, 'utf8');

  // Prerender each route to its own index.html
  for (const route of routes) {
    const canonicalUrl = `${BASE_URL}${route.path === '/' ? '' : route.path}`;
    const escapedTitle = escapeHtml(route.title);
    const escapedDesc = escapeHtml(route.description);
    const ogType = route.type || 'website';
    const ogImage = `${BASE_URL}/og-default.png`;

    let html = baseTemplate;

    // Replace title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapedTitle}</title>`);

    // Replace or inject meta description
    if (html.includes('name="description"')) {
      html = html.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${escapedDesc}" />`
      );
    } else {
      html = html.replace('</head>', `  <meta name="description" content="${escapedDesc}" />\n</head>`);
    }

    // Replace or inject canonical
    if (html.includes('rel="canonical"')) {
      html = html.replace(
        /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    // Replace OpenGraph & Twitter tags
    html = html.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${escapedTitle}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${escapedDesc}" />`
    );
    html = html.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
    html = html.replace(
      /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:type" content="${ogType}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapedTitle}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapedDesc}" />`
    );

    // Inject JSON-LD structured data
    if (route.jsonLd && route.jsonLd.length > 0) {
      const jsonLdTag = `\n  <script type="application/ld+json">\n${JSON.stringify(
        route.jsonLd.length === 1 ? route.jsonLd[0] : { '@context': 'https://schema.org', '@graph': route.jsonLd },
        null,
        2
      )}\n  </script>\n`;
      html = html.replace('</head>', `${jsonLdTag}</head>`);
    }

    // Write file
    const targetDir = route.path === '/' ? distDir : path.join(distDir, route.path.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
  }

  // Also create a polished 404.html for Vercel
  const notFoundHtml = baseTemplate
    .replace(/<title>.*?<\/title>/i, '<title>Page Not Found | AI Finder Technologies</title>')
    .replace(/<meta name="description".*?>/i, '<meta name="description" content="The requested page could not be found." />');
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

  // Generate dynamic sitemap.xml
  generateSitemap();

  // Generate robots.txt
  generateRobots();

  console.log(`[PRERENDER] Successfully generated ${routes.length} pre-rendered HTML routes, sitemap.xml, robots.txt, and 404.html!`);
}

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => {
    let priority = '0.7';
    let changefreq = 'weekly';
    if (r.path === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (r.path === '/tools' || r.path === '/blog') {
      priority = '0.9';
      changefreq = 'daily';
    } else if (r.path.startsWith('/category/')) {
      priority = '0.85';
      changefreq = 'daily';
    } else if (r.path.startsWith('/tools/')) {
      priority = '0.8';
      changefreq = 'weekly';
    } else if (r.path.startsWith('/blog/')) {
      priority = '0.8';
      changefreq = 'monthly';
    }

    return `  <url>
    <loc>${BASE_URL}${r.path === '/' ? '' : r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
}

function generateRobots() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
}

runPrerender().catch((err) => {
  console.error('[PRERENDER FATAL ERROR]', err);
  process.exit(1);
});
