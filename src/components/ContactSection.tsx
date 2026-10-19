import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { ArtistProfile, SocialLink } from '../types';
import { api } from '../api/client';

interface ContactSectionProps {
  profile: ArtistProfile;
  socialLinks: SocialLink[];
  initialProjectType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  socialLinks,
  initialProjectType = '2D Cartoon Animation'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(initialProjectType);
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your full name.' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setStatus({ type: 'error', message: 'Please provide at least 10 characters describing your animation needs.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitInquiry({
        name,
        email,
        projectType,
        budget: budget || undefined,
        message
      });

      setStatus({
        type: 'success',
        message: res.message || 'Inquiry submitted successfully! Shoyen Kaiser Asif will respond promptly.'
      });
      // Clear form
      setName('');
      setEmail('');
      setBudget('');
      setMessage('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to submit inquiry. Please try contacting directly via email or WhatsApp.'
      });
    } finally {
      setLoading(false);
    }
  };

  const contactSocials = socialLinks.filter(s => s.showInContact && s.enabled);
  const waSocial = socialLinks.find(s => s.platform === 'WhatsApp' && s.enabled && s.phone);
  const cleanPhone = waSocial?.phone?.replace(/[^0-9]/g, '');
  const waUrl = cleanPhone && waSocial
    ? `https://wa.me/${cleanPhone}${waSocial.prefill ? `?text=${encodeURIComponent(waSocial.prefill)}` : ''}`
    : null;

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#101317] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="flex items-center gap-3">
            <span className="w-6 h-[1px] bg-[#E8913C]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
              COMMISSIONS & INQUIRIES
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
            {profile.contactHeadline || "Have a Project in Mind? Let's Work Together."}
          </h2>
          <p className="text-sm sm:text-base text-[#9EA5A8] leading-relaxed">
            {profile.contactSubtext ||
              "Looking for a 2D animator, cartoon designer, or background artist for your next project? I'd love to hear about your ideas."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Contact Channels & Direct Links */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] space-y-6">
              <h3 className="font-display text-xl font-bold text-[#EDE7DC]">
                Direct Communication
              </h3>
              <p className="text-xs text-[#9EA5A8] leading-relaxed">
                Whether you have complete storyboards ready for animation or just a concept looking for character development, reach out directly.
              </p>

              <div className="space-y-4 pt-2">
                {/* Direct Email */}
                <a
                  href="mailto:mdasifkaisar333@gmail.com"
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#101317] hover:bg-[#101317]/80 border border-[rgba(237,231,220,0.1)] group transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-[#0A0C0E] text-[#E8913C] group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#9EA5A8]">
                      Direct Email
                    </div>
                    <div className="text-xs font-semibold text-[#EDE7DC] truncate">
                      mdasifkaisar333@gmail.com
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#101317] hover:bg-[#101317]/80 border border-[rgba(237,231,220,0.1)] group transition-all"
                  >
                    <div className="p-2.5 rounded-lg bg-[#0A0C0E] text-[#2E6B72] group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4 text-[#E8913C]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#9EA5A8]">
                        WhatsApp International
                      </div>
                      <div className="text-xs font-semibold text-[#EDE7DC]">
                        {waSocial?.phone || 'Direct Chat'}
                      </div>
                    </div>
                  </a>
                )}
              </div>

              {/* Social Channels List */}
              <div className="pt-4 border-t border-[rgba(237,231,220,0.08)]">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#9EA5A8] block mb-3">
                  Verified Portfolios & Channels
                </span>
                <div className="flex flex-wrap gap-2">
                  {contactSocials.map(soc => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#101317] hover:bg-[#E8913C] hover:text-[#0A0C0E] text-[#9EA5A8] border border-[rgba(237,231,220,0.1)] text-xs font-mono transition-colors flex items-center gap-1.5"
                    >
                      <span>{soc.label || soc.platform}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Project Inquiry Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] space-y-6 shadow-2xl"
            >
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-[#EDE7DC]">
                  Project Inquiry Form
                </h3>
                <p className="text-xs text-[#9EA5A8]">
                  Submissions are recorded into the studio database and notified directly to the artist.
                </p>
              </div>

              {status && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 text-xs leading-relaxed ${
                    status.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-xs transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. alex@studio.com"
                    className="w-full px-4 py-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-2">
                    Service / Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-xs transition-colors"
                  >
                    <option value="2D Cartoon Animation">2D Cartoon Animation</option>
                    <option value="Cartoon Character Design">Cartoon Character Design</option>
                    <option value="2D Background Illustration">2D Background Illustration</option>
                    <option value="Storyboard Creation">Storyboard Creation</option>
                    <option value="Visual Development">Visual Development</option>
                    <option value="Animation-Ready Artwork">Animation-Ready Artwork</option>
                    <option value="Other Creative Work">Other Creative Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-2">
                    Estimated Budget (Optional)
                  </label>
                  <select
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-xs transition-colors"
                  >
                    <option value="">Select a range...</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 - $1,500">$500 – $1,500</option>
                    <option value="$1,500 - $3,500">$1,500 – $3,500</option>
                    <option value="$3,500+">$3,500+</option>
                    <option value="To Be Discussed">To Be Discussed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-2">
                  Project Scope & Creative Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell me about your animation storyline, required duration, character count, or target deadline..."
                  className="w-full px-4 py-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-xs transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#E8913C]/20 disabled:opacity-50"
              >
                {loading ? (
                  <span>Recording Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Project Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
