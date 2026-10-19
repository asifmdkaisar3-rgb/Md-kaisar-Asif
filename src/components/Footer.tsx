import React from 'react';
import { ArrowUp, Lock, MessageCircle, ExternalLink } from 'lucide-react';
import { ArtistProfile, SocialLink } from '../types';

interface FooterProps {
  profile: ArtistProfile;
  socialLinks: SocialLink[];
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  socialLinks,
  onOpenAdmin,
  onNavigate
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSocials = socialLinks.filter(s => s.showInFooter && s.enabled);

  return (
    <footer className="bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.1)] py-16 text-xs text-[#9EA5A8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Col 1: Wordmark & Bio */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-display text-lg font-bold tracking-tight text-[#EDE7DC] block">
              {profile.fullName.toUpperCase()}
            </span>
            <p className="text-xs text-[#9EA5A8] max-w-sm leading-relaxed">
              {profile.footerText || "Crafted with dedication to independent 2D animation, character design, and environment art."}
            </p>
            <div className="text-[11px] font-mono text-[#6C7378]">
              {profile.training} · {profile.primarySoftware}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-[#EDE7DC] font-semibold uppercase tracking-wider block">
              Index
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-[#E8913C] transition-colors cursor-pointer"
                >
                  Portfolio Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('character-art')}
                  className="hover:text-[#E8913C] transition-colors cursor-pointer"
                >
                  Character Model Sheets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('backgrounds')}
                  className="hover:text-[#E8913C] transition-colors cursor-pointer"
                >
                  2D Background Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E8913C] transition-colors cursor-pointer"
                >
                  About the Artist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#E8913C] transition-colors cursor-pointer"
                >
                  Start an Inquiry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Admin */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[#EDE7DC] font-semibold uppercase tracking-wider font-mono block">
              Connect & Studio Access
            </span>
            <div className="flex flex-wrap gap-2">
              {footerSocials.map(soc => {
                let href = soc.url;
                if (soc.platform === 'WhatsApp' && soc.phone) {
                  const cleanPhone = soc.phone.replace(/[^0-9]/g, '');
                  href = `https://wa.me/${cleanPhone}${soc.prefill ? `?text=${encodeURIComponent(soc.prefill)}` : ''}`;
                } else if (soc.platform === 'Email') {
                  href = `mailto:${soc.url}`;
                }
                return (
                  <a
                    key={soc.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#101317] hover:bg-[#E8913C] hover:text-[#0A0C0E] text-[#9EA5A8] border border-[rgba(237,231,220,0.1)] text-xs font-mono transition-colors"
                  >
                    {soc.label || soc.platform}
                  </a>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#101317] hover:bg-white/10 text-[#6C7378] hover:text-[#EDE7DC] text-xs font-mono transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Studio CMS Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[rgba(237,231,220,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#6C7378]">
          <div>
            © {new Date().getFullYear()} {profile.fullName}. All animation rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#9EA5A8] hover:text-[#E8913C] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
