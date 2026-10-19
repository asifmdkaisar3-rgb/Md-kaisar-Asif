import React, { useState, useEffect, useCallback } from 'react';
import { PublicPortfolioData, Project } from './types';
import { api } from './api/client';
import { Navbar } from './components/Navbar';
import { PortalHero } from './components/PortalHero';
import { StatementSection } from './components/StatementSection';
import { ThrowableDeck } from './components/ThrowableDeck';
import { PortfolioGallery } from './components/PortfolioGallery';
import { CharacterShowcase } from './components/CharacterShowcase';
import { BackgroundShowcase } from './components/BackgroundShowcase';
import { StoryboardShowcase } from './components/StoryboardShowcase';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { WorkIndex } from './components/WorkIndex';
import { ContactSection } from './components/ContactSection';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ImageLightbox } from './components/ImageLightbox';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';

export default function App() {
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active section for navbar highlighting
  const [activeSection, setActiveSection] = useState('hero');

  // Modals & view states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    caption?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: ''
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [inquiryServicePreset, setInquiryServicePreset] = useState<string>('2D Cartoon Animation');

  // Load public portfolio data
  const loadPublicData = useCallback(async () => {
    try {
      const res = await api.getPublicData();
      setData(res);
      // Sync document title and meta description
      if (res.profile?.seoTitle) {
        document.title = res.profile.seoTitle;
      }
    } catch (err: any) {
      console.error('Failed to load portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublicData();

    // Check for #admin in URL
    if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
      setIsAdminOpen(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [loadPublicData]);

  // Apply custom appearance CSS variables
  useEffect(() => {
    if (!data?.appearance) return;
    const app = data.appearance;
    const root = document.documentElement;

    if (app.primaryBg) root.style.setProperty('--bg-primary', app.primaryBg);
    if (app.secondaryBg) root.style.setProperty('--bg-secondary', app.secondaryBg);
    if (app.primaryText) root.style.setProperty('--text-primary', app.primaryText);
    if (app.secondaryText) root.style.setProperty('--text-secondary', app.secondaryText);
    if (app.amberAccent) root.style.setProperty('--accent-amber', app.amberAccent);
    if (app.tealAccent) root.style.setProperty('--accent-teal', app.tealAccent);
  }, [data?.appearance]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLightbox = (imageUrl: string, title: string, caption?: string) => {
    setLightboxState({
      isOpen: true,
      imageUrl,
      title,
      caption
    });
  };

  const handleSelectService = (serviceTitle: string) => {
    setInquiryServicePreset(serviceTitle);
    scrollToSection('contact');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C0E] text-[#EDE7DC] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#E8913C] border-t-transparent rounded-full animate-spin" />
        <div className="font-display font-bold text-sm tracking-widest uppercase text-[#9EA5A8]">
          Shoyen Kaiser Asif Studio
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0A0C0E] text-[#EDE7DC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="font-display text-2xl font-bold text-[#E8913C]">
          Studio Temporarily Unavailable
        </div>
        <p className="text-xs text-[#9EA5A8] max-w-md">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            loadPublicData();
          }}
          className="px-6 py-2.5 rounded-lg bg-[#E8913C] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { profile, categories, projects, services, socialLinks, software, appearance } = data;
  const visibility = appearance.sectionVisibility;

  return (
    <div className="relative min-h-screen bg-[#0A0C0E] text-[#EDE7DC] selection:bg-[#E8913C]/30 selection:text-white">
      {/* Fixed Navigation */}
      <Navbar
        profile={profile}
        socialLinks={socialLinks}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContact={() => scrollToSection('contact')}
      />

      <main className="relative z-10">
        {/* Section 4: Cinematic Portal Hero */}
        {visibility.portalHero && (
          <PortalHero
            profile={profile}
            onExploreClick={() => scrollToSection('portfolio')}
            onCollaborateClick={() => scrollToSection('contact')}
          />
        )}

        {/* Section 5: Statement Section */}
        {visibility.statement && (
          <StatementSection profile={profile} />
        )}

        {/* Section 6: Throwable Project Card Deck */}
        {visibility.featuredDeck && (
          <ThrowableDeck
            projects={projects}
            onSelectProject={setSelectedProject}
            onViewAll={() => scrollToSection('portfolio')}
            onContactClick={() => scrollToSection('contact')}
          />
        )}

        {/* Section 7: Complete Filterable Portfolio Gallery */}
        {visibility.portfolioGallery && (
          <PortfolioGallery
            projects={projects}
            categories={categories}
            onSelectProject={setSelectedProject}
          />
        )}

        {/* Section 8: Dedicated Character Design Showcase */}
        {visibility.characterGallery && (
          <CharacterShowcase
            projects={projects}
            onOpenLightbox={handleOpenLightbox}
            onSelectProject={setSelectedProject}
          />
        )}

        {/* Section 9: Dedicated 2D Background Art Showcase */}
        {visibility.backgroundGallery && (
          <BackgroundShowcase
            projects={projects}
            onOpenLightbox={handleOpenLightbox}
            onSelectProject={setSelectedProject}
          />
        )}

        {/* Section 10: Storyboards & Visual Development */}
        {visibility.storyboards && (
          <StoryboardShowcase
            projects={projects}
            onOpenLightbox={handleOpenLightbox}
            onSelectProject={setSelectedProject}
          />
        )}

        {/* Section 11: About the Artist */}
        {visibility.about && (
          <AboutSection
            profile={profile}
            software={software}
            onCollaborateClick={() => scrollToSection('contact')}
          />
        )}

        {/* Section 12: Professional Services */}
        {visibility.services && (
          <ServicesSection
            services={services}
            onSelectService={handleSelectService}
          />
        )}

        {/* Section 13: Selected Work Index & Production Roster */}
        {visibility.artistIndex && (
          <WorkIndex
            projects={projects}
            onSelectProject={setSelectedProject}
          />
        )}

        {/* Section 15: Contact & Inquiries */}
        {visibility.contact && (
          <ContactSection
            profile={profile}
            socialLinks={socialLinks}
            initialProjectType={inquiryServicePreset}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        profile={profile}
        socialLinks={socialLinks}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={Boolean(selectedProject)}
        project={selectedProject}
        allProjects={projects}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
        onOpenLightbox={handleOpenLightbox}
        onCollaborateClick={title => {
          setSelectedProject(null);
          setInquiryServicePreset(title);
          scrollToSection('contact');
        }}
      />

      {/* Fullscreen High-Resolution Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        imageUrl={lightboxState.imageUrl}
        title={lightboxState.title}
        caption={lightboxState.caption}
        onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Private Studio CMS Admin Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
        onPreviewProject={p => {
          setIsAdminOpen(false);
          setSelectedProject(p);
        }}
        onPublicDataUpdated={loadPublicData}
      />
    </div>
  );
}
