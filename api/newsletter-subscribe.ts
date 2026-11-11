import { z } from 'zod';

const subscriberSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(254, 'Email too long')
});

const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export default async function handler(req: any, res: any) {
  // Feature flag check on GET
  if (req.method === 'GET') {
    const isConfigured = Boolean(
      (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) ||
      process.env.BUTTONDOWN_API_KEY
    );
    return res.status(200).json({ enabled: isConfigured });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
  const now = Date.now();

  const ipRecord = rateLimitMap.get(ip);
  if (ipRecord) {
    if (now - ipRecord.firstSeen < RATE_LIMIT_WINDOW_MS) {
      if (ipRecord.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({ error: 'Too many subscription attempts from this IP. Please try again later.' });
      }
      ipRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, firstSeen: now });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
  }

  // Validation
  const parseResult = subscriberSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors[0]?.message || 'Invalid email address' });
  }

  const { email } = parseResult.data;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;
  const buttondownApiKey = process.env.BUTTONDOWN_API_KEY;

  if ((!resendApiKey || !resendAudienceId) && !buttondownApiKey) {
    return res.status(503).json({
      error: 'Newsletter subscription service is currently unconfigured.'
    });
  }

  try {
    // 1. Resend Audience
    if (resendApiKey && resendAudienceId) {
      const response = await fetch(`https://api.resend.com/audiences/${resendAudienceId}/contacts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          unsubscribed: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[RESEND NEWSLETTER ERROR]', errorText);
        return res.status(502).json({ error: 'Could not process newsletter subscription. Please try again later.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Check your inbox to confirm your subscription.'
      });
    }

    // 2. Buttondown
    if (buttondownApiKey) {
      const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Token ${buttondownApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[BUTTONDOWN ERROR]', errorText);
        return res.status(502).json({ error: 'Could not process newsletter subscription. Please try again later.' });
      }

      return res.status(200).json({
        success: true,
        message: 'Check your inbox to confirm your subscription.'
      });
    }

    return res.status(503).json({ error: 'Subscription service unavailable' });
  } catch (err: any) {
    console.error('[NEWSLETTER EXCEPTION]', err);
    return res.status(500).json({ error: 'Internal subscription processing error' });
  }
}
