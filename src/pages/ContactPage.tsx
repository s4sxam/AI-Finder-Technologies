import React, { useState } from 'react';
import { Mail, CheckCircle2, MessageSquare, Send, ShieldAlert } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  initialIntent?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, initialIntent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(
    initialIntent === 'submit' ? 'submit-tool' : 'general'
  );
  const [toolUrl, setToolUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please complete all required fields before submitting.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 dark:hover:text-white">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Contact &amp; Submissions</span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Get in Touch with Our Editorial Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          Submit new AI products for evaluation, dispute benchmark findings, or inquire about research partnerships.
        </p>
      </div>

      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Submission Received
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{name}</strong>. Our engineering review team reviews all submissions on a weekly cycle. If your tool passes initial evaluation criteria, we will reach out directly at <strong>{email}</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                  setToolUrl('');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#2F5BFF] bg-[#2F5BFF]/10 rounded-md hover:bg-[#2F5BFF] hover:text-white transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 dark:text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                Inquiry Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#2F5BFF]"
              >
                <option value="submit-tool">Submit a Tool for Verification</option>
                <option value="benchmark-dispute">Dispute or Update Benchmark Data</option>
                <option value="editorial">Editorial Pitch or Contribution</option>
                <option value="general">General Inquiries &amp; Press</option>
              </select>
            </div>

            {topic === 'submit-tool' && (
              <div>
                <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                  Tool Website URL
                </label>
                <input
                  type="url"
                  value={toolUrl}
                  onChange={(e) => setToolUrl(e.target.value)}
                  placeholder="https://yourtool.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-900 dark:text-white mb-1">
                Message &amp; Technical Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your request, reproduction steps for benchmark questions, or architectural details about your model..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2F5BFF]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2F5BFF] hover:bg-[#1E46E6] text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Editorial Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
