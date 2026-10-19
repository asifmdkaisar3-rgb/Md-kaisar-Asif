import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, ExternalLink, MessageCircle } from 'lucide-react';
import { ArtistProfile, SocialLink } from '../types';

interface NavbarProps {
  profile: ArtistProfile;
  socialLinks: SocialLink[];
  onOpenAdmin: () => void;
  onOpenContact: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  socialLinks,
  onOpenAdmin,
  onOpenContact,
  onNavigate,
  activeSection
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'character-art', label: 'Characters' },
    { id: 'backgrounds', label: 'Backgrounds' },
    { id: 'storyboards', label: 'Storyboards' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const navSocials = socialLinks.filter(s => s.showInNav && s.enabled);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[58px] transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0C0E]/90 backdrop-blur-md border-b border-[rgba(237,231,220,0.13)] shadow-lg shadow-black/40'
          : 'bg-[#0A0C0E]/40 backdrop-blur-sm border-b border-[rgba(237,231,220,0.06)]'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-left group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E8913C]"
        >
          <span className="font-display text-sm sm:text-base font-bold tracking-tight text-[#EDE7DC] group-hover:text-[#E8913C] transition-colors whitespace-nowrap block">
            {profile.fullName.toUpperCase()}
          </span>
          <span className="text-[10px] tracking-wider text-[#9EA5A8] font-normal uppercase hidden sm:block">
            2D Animation & Concept Studio
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-[#9EA5A8]">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`transition-colors whitespace-nowrap relative py-1 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-[#E8913C] font-semibold'
                    : 'hover:text-[#EDE7DC]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#E8913C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: CTA & Admin Entry */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick WhatsApp / Direct action if configured */}
          {navSocials.map(soc => {
            if (soc.platform === 'WhatsApp' && soc.phone) {
              const cleanPhone = soc.phone.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${cleanPhone}${soc.prefill ? `?text=${encodeURIComponent(soc.prefill)}` : ''}`;
              return (
                <a
                  key={soc.id}
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#2E6B72] hover:text-[#EDE7DC] hover:bg-[#2E6B72]/20 border border-[#2E6B72]/40 rounded transition-all whitespace-nowrap"
                  title="Chat directly on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#E8913C]" />
                  <span>WhatsApp</span>
                </a>
              );
            }
            return null;
          })}

          <button
            onClick={onOpenContact}
            className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#0A0C0E] bg-[#E8913C] hover:bg-[#f39c4a] active:scale-[0.98] rounded transition-all shadow-sm hover:shadow-[#E8913C]/20 whitespace-nowrap cursor-pointer"
          >
            {profile.heroSecondaryBtnText || "LET'S COLLABORATE"}
          </button>

          {/* Discreet Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#6C7378] hover:text-[#EDE7DC] hover:bg-white/5 rounded transition-colors cursor-pointer"
            title="Studio CMS Admin Portal"
            aria-label="Studio CMS Admin Portal"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-[#EDE7DC] hover:text-[#E8913C] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[58px] bg-[#0A0C0E]/98 border-b border-[rgba(237,231,220,0.13)] backdrop-blur-xl px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`text-left text-sm uppercase tracking-wider py-1.5 transition-colors cursor-pointer ${
                  activeSection === item.id ? 'text-[#E8913C] font-semibold' : 'text-[#9EA5A8] hover:text-[#EDE7DC]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-[rgba(237,231,220,0.13)] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold tracking-wider uppercase text-[#0A0C0E] bg-[#E8913C] rounded cursor-pointer"
            >
              Start a Project
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 text-center text-xs text-[#9EA5A8] hover:text-[#EDE7DC] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Studio CMS Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
