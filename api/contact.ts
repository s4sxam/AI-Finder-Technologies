import { z } from 'zod';

// Best-effort in-memory rate limiting per IP (resets on serverless cold starts)
const rateLimitMap = new Map<string, { count: number; firstSeen: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(254, 'Email too long'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message cannot exceed 5000 characters'),
  honeypot: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
  timeOnPageMs: z.number().min(2000, 'Submission was too fast. Please take your time.'),
  turnstileToken: z.string().optional()
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. IP Rate Limiting
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
  const now = Date.now();

  const ipRecord = rateLimitMap.get(ip);
  if (ipRecord) {
    if (now - ipRecord.firstSeen < RATE_LIMIT_WINDOW_MS) {
      if (ipRecord.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          error: 'Too many contact requests from this IP. Please try again later.'
        });
      }
      ipRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, firstSeen: now });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, firstSeen: now });
  }

  // 2. Validate input schema with Zod
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    const firstError = parseResult.error.errors[0]?.message || 'Validation failed';
    return res.status(400).json({ error: firstError, details: parseResult.error.flatten() });
  }

  const { name, email, message, turnstileToken } = parseResult.data;

  // 3. Optional Cloudflare Turnstile Verification
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && turnstileToken) {
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip
        })
      });
      const verifyData: any = await verifyRes.json();
      if (!verifyData.success) {
        return res.status(403).json({ error: 'Turnstile verification failed. Please refresh and try again.' });
      }
    } catch (e: any) {
      console.warn('[CONTACT TURNSTILE WARNING]', e.message);
    }
  }

  // 4. Check Resend API Key and Target Email
  const resendApiKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.CONTACT_TO_EMAIL || process.env.PUBLIC_CONTACT_EMAIL;

  if (!resendApiKey || !targetEmail) {
    const fallbackEmail = targetEmail || 'hello@aifindertechnologies.com';
    return res.status(503).json({
      error: `Contact delivery is temporarily unconfigured. Please email us directly at ${fallbackEmail}.`,
      fallbackEmail
    });
  }

  // 5. Send Email via Resend
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AI Finder Contact <onboarding@resend.dev>',
        to: [targetEmail],
        reply_to: email,
        subject: `[AI Finder] Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSender IP: ${ip}\nSent At: ${new Date().toISOString()}`
      })
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error('[RESEND API ERROR]', errBody);
      return res.status(502).json({
        error: `Could not send right now — email us at ${targetEmail}.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been delivered to our research team.'
    });
  } catch (err: any) {
    console.error('[CONTACT DISPATCH ERROR]', err);
    return res.status(500).json({
      error: `Could not send right now — email us at ${targetEmail}.`
    });
  }
}
