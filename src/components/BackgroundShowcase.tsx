import React, { useState } from 'react';
import { Palette, Maximize2, Compass, Sun, MapPin } from 'lucide-react';
import { Project } from '../types';

interface BackgroundShowcaseProps {
  projects: Project[];
  onOpenLightbox: (imageUrl: string, title: string, caption?: string) => void;
  onSelectProject: (project: Project) => void;
}

export const BackgroundShowcase: React.FC<BackgroundShowcaseProps> = ({
  projects,
  onOpenLightbox,
  onSelectProject
}) => {
  const bgProjects = projects.filter(
    p => p.category === 'background-art' || p.category === 'visual-development'
  );

  const [activeTheme, setActiveTheme] = useState<string>('all');

  const themes = [
    { id: 'all', label: 'All Environments' },
    { id: 'bengali-rural', label: 'Bengali Village & Courtyards' },
    { id: 'natural', label: 'Fields & Natural Sceneries' },
    { id: 'interiors', label: 'Stylized Interiors' }
  ];

  if (bgProjects.length === 0) return null;

  return (
    <section id="backgrounds" className="py-24 sm:py-32 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                2D BACKGROUND & ENVIRONMENT ART
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
              Atmospheric Worldbuilding
            </h2>
            <p className="text-sm text-[#9EA5A8] max-w-xl">
              Authentic rural Bengali village landscapes, traditional homestead courtyards, serene ponds, and stylized interiors painted for multi-plane parallax animation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9EA5A8]">
            <MapPin className="w-4 h-4 text-[#E8913C]" />
            <span>Rural Heritage & Fantasy Scapes</span>
          </div>
        </div>

        {/* Feature Wide Showcase */}
        <div className="mt-12 space-y-16">
          {bgProjects.map(project => (
            <div
              key={project.id}
              className="group relative bg-[#101317] border border-[rgba(237,231,220,0.12)] rounded-2xl overflow-hidden shadow-2xl hover:border-[#E8913C]/40 transition-all duration-300"
            >
              {/* Wide Cinematic Background Frame */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-black/80">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out cursor-zoom-in"
                  onClick={() =>
                    onOpenLightbox(
                      project.coverImage,
                      project.title,
                      project.detailedDescription
                    )
                  }
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101317] via-transparent to-black/20 opacity-80" />

                {/* Top Corner Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-[#0A0C0E]/80 backdrop-blur-md border border-[rgba(237,231,220,0.15)] text-[11px] font-mono uppercase text-[#E8913C] flex items-center gap-1.5">
                    <Sun className="w-3 h-3 text-[#E8913C]" />
                    <span>Golden Hour Atmosphere</span>
                  </span>
                </div>

                {/* Zoom Trigger Button */}
                <button
                  onClick={() =>
                    onOpenLightbox(
                      project.coverImage,
                      project.title,
                      project.detailedDescription
                    )
                  }
                  className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#0A0C0E]/80 text-[#EDE7DC] hover:text-[#E8913C] border border-[rgba(237,231,220,0.2)] backdrop-blur-md opacity-90 hover:opacity-100 transition-all cursor-pointer shadow-lg"
                  title="Expand Full Panoramic View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Editorial Caption Bar */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#2E6B72]">
                    <span>Background Art</span>
                    <span aria-hidden="true">·</span>
                    <span>Bengali Village Environment</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#9EA5A8]">Parallax Separated</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#EDE7DC]">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9EA5A8] leading-relaxed max-w-3xl">
                    {project.detailedDescription || project.shortDescription}
                  </p>
                </div>

                <div className="md:col-span-4 flex md:justify-end items-center gap-3">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-5 py-2.5 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#E8913C]/20"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      onOpenLightbox(
                        project.coverImage,
                        project.title,
                        project.detailedDescription
                      )
                    }
                    className="px-4 py-2.5 rounded-lg bg-[#0A0C0E] text-[#EDE7DC] hover:text-[#E8913C] border border-[rgba(237,231,220,0.15)] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Full Pan
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
