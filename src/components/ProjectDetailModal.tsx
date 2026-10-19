import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, Play, Maximize2, Calendar, UserCheck, Layers, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  allProjects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  onOpenLightbox: (imageUrl: string, title: string, caption?: string) => void;
  onCollaborateClick: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  allProjects,
  isOpen,
  onClose,
  onSelectProject,
  onOpenLightbox,
  onCollaborateClick
}) => {
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const galleryList = [
    { url: project.coverImage, alt: project.title, caption: 'Primary Cover Artwork' },
    ...(project.galleryImages || [])
  ];

  const activeMedia = galleryList[selectedGalleryIdx] || galleryList[0];

  // Helper for embed video URL (YouTube / Vimeo)
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const vidId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vidId}?autoplay=0`;
    }
    if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vidId}?autoplay=0`;
    }
    if (url.includes('vimeo.com/')) {
      const vidId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${vidId}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(project.videoUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center">
        
        {/* Modal Window Container */}
        <div className="relative w-full max-w-5xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] rounded-2xl shadow-2xl overflow-hidden my-auto">
          
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0A0C0E]/95 backdrop-blur-md border-b border-[rgba(237,231,220,0.1)]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#E8913C] px-2.5 py-1 rounded bg-[#101317] border border-[rgba(237,231,220,0.1)]">
                {project.category.replace('-', ' ')}
              </span>
              {project.isDemoPlaceholder && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2E6B72]/20 text-[#2E6B72] border border-[#2E6B72]/40">
                  Demo Placeholder
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#101317] hover:bg-white/10 text-[#EDE7DC] transition-colors cursor-pointer"
              aria-label="Close Project Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Media Showcase (Video or Active Gallery Image) */}
          <div className="relative w-full aspect-[16/9] bg-black overflow-hidden flex items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={project.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : project.videoUrl?.endsWith('.mp4') || project.videoUrl?.endsWith('.webm') ? (
              <video
                controls
                className="w-full h-full object-contain"
                poster={project.coverImage}
              >
                <source src={project.videoUrl} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            ) : (
              <div className="relative w-full h-full group">
                <img
                  src={activeMedia.url}
                  alt={activeMedia.alt || project.title}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => onOpenLightbox(activeMedia.url, project.title, activeMedia.caption)}
                  referrerPolicy="no-referrer"
                />
                
                <button
                  onClick={() => onOpenLightbox(activeMedia.url, project.title, activeMedia.caption)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-black/80 hover:bg-[#E8913C] text-white hover:text-[#0A0C0E] border border-white/20 transition-all cursor-pointer"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails Strip (if multiple) */}
          {galleryList.length > 1 && (
            <div className="p-4 bg-[#101317] border-b border-[rgba(237,231,220,0.1)] flex items-center gap-3 overflow-x-auto no-scrollbar">
              {galleryList.map((media, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedGalleryIdx(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedGalleryIdx === idx
                      ? 'border-[#E8913C] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={media.url}
                    alt={media.alt || `View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Project Information */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            <div className="space-y-3">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#EDE7DC]">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base text-[#9EA5A8] leading-relaxed">
                {project.shortDescription}
              </p>
            </div>

            {/* Detailed Story / Description */}
            {project.detailedDescription && (
              <div className="space-y-3 text-xs sm:text-sm text-[#EDE7DC]/90 leading-relaxed pt-4 border-t border-[rgba(237,231,220,0.08)]">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#E8913C] block">
                  Project Overview & Execution
                </span>
                <p className="whitespace-pre-line">{project.detailedDescription}</p>
              </div>
            )}

            {/* Production Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-[rgba(237,231,220,0.08)] text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.08)]">
                <span className="text-[#9EA5A8] block text-[10px] uppercase mb-1">Role / Contribution</span>
                <span className="text-[#EDE7DC] font-semibold">{project.role || '2D Animator'}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.08)]">
                <span className="text-[#9EA5A8] block text-[10px] uppercase mb-1">Software Tools</span>
                <span className="text-[#EDE7DC] font-semibold">{project.softwareUsed?.join(', ') || 'Adobe Animate CC'}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.08)]">
                <span className="text-[#9EA5A8] block text-[10px] uppercase mb-1">Production Year</span>
                <span className="text-[#EDE7DC] font-semibold">{project.projectDate || '2024'}</span>
              </div>
            </div>

            {/* Production Notes */}
            {project.productionNotes && (
              <div className="p-4 rounded-xl bg-[#101317]/60 border border-[rgba(237,231,220,0.08)] text-xs font-mono text-[#9EA5A8] space-y-1">
                <span className="text-[#E8913C] font-semibold uppercase text-[10px] tracking-wider block">
                  Studio Production Notes
                </span>
                <p className="leading-relaxed">{project.productionNotes}</p>
              </div>
            )}

            {/* CTA action */}
            <div className="pt-6 border-t border-[rgba(237,231,220,0.1)] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => {
                  onClose();
                  onCollaborateClick(project.title);
                }}
                className="px-6 py-3 rounded-xl bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#E8913C]/20"
              >
                Inquire For Similar Animation
              </button>

              {/* Prev / Next Navigation */}
              <div className="flex items-center gap-3">
                {prevProject && (
                  <button
                    onClick={() => {
                      setSelectedGalleryIdx(0);
                      onSelectProject(prevProject);
                    }}
                    className="p-3 rounded-lg bg-[#101317] hover:bg-[#101317]/80 text-[#EDE7DC] hover:text-[#E8913C] border border-[rgba(237,231,220,0.15)] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                )}
                {nextProject && (
                  <button
                    onClick={() => {
                      setSelectedGalleryIdx(0);
                      onSelectProject(nextProject);
                    }}
                    className="p-3 rounded-lg bg-[#101317] hover:bg-[#101317]/80 text-[#EDE7DC] hover:text-[#E8913C] border border-[rgba(237,231,220,0.15)] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
