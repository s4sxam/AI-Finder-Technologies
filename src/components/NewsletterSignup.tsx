import React, { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'footer' | 'standalone';
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  variant = 'footer'
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  // Check if newsletter provider is configured in environment via API check
  useEffect(() => {
    let isMounted = true;
    fetch('/api/newsletter-subscribe')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setIsEnabled(Boolean(data?.enabled));
        }
      })
      .catch(() => {
        if (isMounted) setIsEnabled(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // If newsletter provider is unconfigured, hide the form rather than presenting a dead input
  if (isEnabled === false) {
    return null;
  }

  // While checking config on initial load, do not flash empty box
  if (isEnabled === null) {
    return null;
  }

  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address (e.g., name@domain.com).');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit newsletter subscription');
      }

      setStatus('success');
      setMessage(data.message || 'Check your inbox to confirm your subscription.');
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setStatus('error');
      setMessage(err.message || 'Unable to subscribe right now. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1 ${className}`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
          <Check className="w-4 h-4 shrink-0" />
          <span>Confirmation Link Sent</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
          {message}
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setMessage('');
          }}
          className="text-[10px] text-[#2F5BFF] dark:text-blue-400 hover:underline pt-1"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="space-y-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
          AI Engineering Updates
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
          Periodic notifications when new benchmark models or major verified AI tools are cataloged.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2" noValidate>
        <div className="relative flex items-center">
          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') {
                setStatus('idle');
                setMessage('');
              }
            }}
            placeholder="developer@company.com"
            disabled={status === 'loading'}
            aria-label="Email address for AI engineering updates"
            className="w-full pl-8 pr-24 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF] focus:ring-1 focus:ring-[#2F5BFF] transition-all"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#2F5BFF] hover:bg-[#1E46E6] disabled:opacity-60 text-white text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1 shadow-xs"
          >
            {status === 'loading' ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <span>Subscribe</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </>
            )}
          </button>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-1.5 text-rose-500 text-[11px] animate-in fade-in duration-150">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="text-[10px] text-slate-400">
          Double opt-in verification. Unsubscribe at any time with one click.
        </div>
      </form>
    </div>
  );
};
