export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      websiteUrl,
      category,
      pricing,
      startingPrice,
      hasFreeTier,
      tagline,
      description,
      submitterName,
      submitterEmail,
      submittedAt
    } = req.body || {};

    // Validate required fields
    if (!name || !websiteUrl || !submitterEmail) {
      return res.status(400).json({ error: 'Missing required tool submission fields' });
    }

    // Optional webhook forwarding to Slack / Discord / Formspree / Email
    const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚀 *New Tool Submission on AI Finder Technologies*\n*Tool*: ${name} (${websiteUrl})\n*Category*: ${category}\n*Pricing*: ${pricing} (${startingPrice || 'N/A'})\n*Free Tier*: ${hasFreeTier ? 'Yes' : 'No'}\n*Submitter*: ${submitterName} <${submitterEmail}>\n*Tagline*: ${tagline}\n*Notes*: ${description}`
        })
      }).catch((e) => console.error('Webhook notification error:', e));
    }

    return res.status(200).json({
      success: true,
      message: 'Submission successfully received and queued for editorial audit.',
      tool: {
        name,
        websiteUrl,
        category,
        submittedAt: submittedAt || new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Submit tool API error:', err);
    return res.status(500).json({ error: 'Internal server error processing submission' });
  }
}
