import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Eye, Sparkles, Layers, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface ThrowableDeckProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAll: () => void;
  onContactClick: () => void;
}

export const ThrowableDeck: React.FC<ThrowableDeckProps> = ({
  projects,
  onSelectProject,
  onViewAll,
  onContactClick
}) => {
  const featuredProjects = projects.filter(p => p.isFeatured && p.isPublished);
  const deckProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDragAction = useRef(false);

  const currentProject = deckProjects[currentIndex % deckProjects.length];

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % deckProjects.length);
    setDragOffset({ x: 0, y: 0 });
    setHasInteracted(true);
  }, [deckProjects.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + deckProjects.length) % deckProjects.length);
    setDragOffset({ x: 0, y: 0 });
    setHasInteracted(true);
  }, [deckProjects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is focusing an input or modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    isDragAction.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      isDragAction.current = true;
    }

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    setIsDragging(false);

    // If dragged past threshold (>110px), throw card out
    if (Math.abs(dragOffset.x) > 110) {
      handleNext();
    } else if (!isDragAction.current && currentProject) {
      // Click without drag: open project
      onSelectProject(currentProject);
    }

    setDragOffset({ x: 0, y: 0 });
    dragStartRef.current = null;
  };

  if (deckProjects.length === 0) {
    return (
      <section className="py-24 bg-[#101317] border-t border-[rgba(237,231,220,0.08)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Layers className="w-12 h-12 text-[#9EA5A8] mx-auto mb-4 stroke-1" />
          <h3 className="font-display text-2xl font-bold text-[#EDE7DC]">Portfolio In Development</h3>
          <p className="mt-2 text-sm text-[#9EA5A8]">
            No featured animation projects published yet. Please log into the Studio CMS to add your first work.
          </p>
        </div>
      </section>
    );
  }

  // Pre-calculate rotation offsets for physical stack cards behind the active card
  const stackOffsets = [
    { rotate: 0, x: 0, y: 0, scale: 1 },
    { rotate: 4, x: 12, y: 8, scale: 0.96 },
    { rotate: -3, x: -10, y: 14, scale: 0.92 },
    { rotate: 6, x: 18, y: 20, scale: 0.88 }
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[#101317] border-t border-[rgba(237,231,220,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Introduction */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                FEATURED SLEEVES & SEQUENCES
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] leading-tight tracking-tight">
              Tactile Artwork Stack
            </h2>

            <p className="text-sm sm:text-base text-[#9EA5A8] leading-relaxed">
              Drag and toss the cards or use your arrow keys to cycle through keyframe animation studies, character turnaround packages, and rural environment paintings.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onViewAll}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-wider uppercase text-[#0A0C0E] bg-[#E8913C] hover:bg-[#f39c4a] rounded transition-all cursor-pointer shadow-md shadow-[#E8913C]/20"
              >
                <span>EXPLORE ALL PROJECTS</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onContactClick}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase text-[#EDE7DC] bg-[#0A0C0E] hover:bg-black/80 border border-[rgba(237,231,220,0.15)] rounded transition-all cursor-pointer"
              >
                <span>INQUIRE ABOUT THIS WORK</span>
              </button>
            </div>

            {/* Instruction Cue */}
            <div className="pt-6 border-t border-[rgba(237,231,220,0.1)] flex items-center justify-between text-xs text-[#9EA5A8] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E8913C]" />
                <span>Drag horizontally to toss card</span>
              </span>
              <span className="hidden sm:inline">Use [←] / [→] keys</span>
            </div>
          </div>

          {/* Right Column: Physical Card Deck Stage */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square select-none touch-pan-y">
              
              {/* Cards in Deck (rendered from back to front) */}
              {[3, 2, 1, 0].map(offset => {
                const projectIdx = (currentIndex + offset) % deckProjects.length;
                const project = deckProjects[projectIdx];
                const stackStyle = stackOffsets[offset] || stackOffsets[3];
                const isTop = offset === 0;

                // Active drag physics computation
                const rotationAngle = isTop && isDragging
                  ? dragOffset.x * 0.08
                  : stackStyle.rotate;

                const translateX = isTop && isDragging
                  ? dragOffset.x
                  : stackStyle.x;

                const translateY = isTop && isDragging
                  ? dragOffset.y * 0.3
                  : stackStyle.y;

                const cardScale = isTop && isDragging
                  ? 1.03
                  : stackStyle.scale;

                return (
                  <div
                    key={`${project.id}-${offset}`}
                    style={{
                      transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotationAngle}deg) scale(${cardScale})`,
                      zIndex: 30 - offset,
                      transition: isDragging && isTop ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s'
                    }}
                    onPointerDown={isTop ? handlePointerDown : undefined}
                    onPointerMove={isTop ? handlePointerMove : undefined}
                    onPointerUp={isTop ? handlePointerUp : undefined}
                    className={`absolute inset-0 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.18)] shadow-2xl shadow-black/90 overflow-hidden flex flex-col cursor-${
                      isTop ? (isDragging ? 'grabbing' : 'grab') : 'default'
                    }`}
                  >
                    {/* Artwork Preview */}
                    <div className="relative flex-1 w-full overflow-hidden bg-black/40">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0E] via-transparent to-transparent opacity-80" />

                      {/* Top Bar on Card */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-[#0A0C0E]/80 backdrop-blur-md border border-[rgba(237,231,220,0.15)] text-[#E8913C]">
                          {project.category.replace('-', ' ')}
                        </span>
                        {project.isDemoPlaceholder && (
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-[#9EA5A8] border border-white/10">
                            Demo Asset
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Bar */}
                    <div className="p-5 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.1)] flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-display text-base sm:text-lg font-bold text-[#EDE7DC] truncate">
                          {project.title}
                        </h4>
                        <div className="text-xs text-[#9EA5A8] font-mono truncate mt-0.5">
                          {project.softwareUsed?.slice(0, 2).join(' · ') || 'Adobe Animate CC'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(project);
                        }}
                        className="shrink-0 p-2.5 rounded-lg bg-[#101317] hover:bg-[#E8913C] text-[#EDE7DC] hover:text-[#0A0C0E] border border-[rgba(237,231,220,0.15)] transition-all cursor-pointer"
                        title="View Full Case Study"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Deck Controls & Dots */}
            <div className="mt-8 flex items-center justify-between w-full max-w-[440px] px-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-[#0A0C0E] hover:bg-[#E8913C] text-[#EDE7DC] hover:text-[#0A0C0E] border border-[rgba(237,231,220,0.15)] transition-all cursor-pointer"
                aria-label="Previous card"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {deckProjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setHasInteracted(true);
                    }}
                    className={`transition-all rounded-full cursor-pointer ${
                      currentIndex === idx
                        ? 'w-6 h-2 bg-[#E8913C]'
                        : 'w-2 h-2 bg-[rgba(237,231,220,0.25)] hover:bg-[rgba(237,231,220,0.5)]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#9EA5A8]">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(deckProjects.length).padStart(2, '0')}
                </span>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-[#0A0C0E] hover:bg-[#E8913C] text-[#EDE7DC] hover:text-[#0A0C0E] border border-[rgba(237,231,220,0.15)] transition-all cursor-pointer"
                  aria-label="Next card"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
