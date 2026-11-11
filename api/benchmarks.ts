import fs from 'node:fs';
import path from 'node:path';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const candidates = [
      path.resolve(process.cwd(), 'src/data/live/benchmarks.json'),
      path.resolve(__dirname, '../src/data/live/benchmarks.json'),
      path.resolve(__dirname, 'benchmarks.json')
    ];

    let benchmarksData = null;
    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        benchmarksData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        break;
      }
    }

    if (!benchmarksData) {
      return res.status(500).json({ error: 'Benchmark data file unavailable' });
    }

    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=7200');
    return res.status(200).json(benchmarksData);
  } catch (err: any) {
    console.error('[API/BENCHMARKS ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve benchmarks data' });
  }
}
