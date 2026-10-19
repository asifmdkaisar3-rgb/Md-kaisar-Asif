import React, { useState } from 'react';
import { User, Maximize2, Layers, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface CharacterShowcaseProps {
  projects: Project[];
  onOpenLightbox: (imageUrl: string, title: string, caption?: string) => void;
  onSelectProject: (project: Project) => void;
}

export const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({
  projects,
  onOpenLightbox,
  onSelectProject
}) => {
  const characterProjects = projects.filter(
    p => p.category === 'character-design' || p.category === '2d-animation'
  );

  const [activeTab, setActiveTab] = useState<'turnarounds' | 'expressions' | 'poses'>('turnarounds');

  if (characterProjects.length === 0) return null;

  return (
    <section id="character-art" className="py-24 sm:py-32 bg-[#101317] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                CHARACTER DESIGN & TURNAROUNDS
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
              Cartoon Character Studio
            </h2>
            <p className="text-sm text-[#9EA5A8] max-w-xl">
              Model sheets, 360° turnarounds, facial expression charts, and puppet-ready vector rigs built for expressive animation.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] rounded-lg">
            {(['turnarounds', 'expressions', 'poses'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#E8913C] text-[#0A0C0E] font-bold shadow-sm'
                    : 'text-[#9EA5A8] hover:text-[#EDE7DC]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Spotlight Presentation */}
        <div className="mt-12 space-y-12">
          {characterProjects.map(project => (
            <div
              key={project.id}
              className="bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Art Preview */}
                <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-black/60 border border-[rgba(237,231,220,0.15)] group">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-auto object-cover max-h-[540px] cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300"
                    onClick={() =>
                      onOpenLightbox(
                        project.coverImage,
                        project.title,
                        project.detailedDescription
                      )
                    }
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Zoom Button */}
                  <button
                    onClick={() =>
                      onOpenLightbox(
                        project.coverImage,
                        project.title,
                        project.detailedDescription
                      )
                    }
                    className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-[#0A0C0E]/90 text-[#EDE7DC] hover:text-[#E8913C] border border-[rgba(237,231,220,0.2)] backdrop-blur-md opacity-90 hover:opacity-100 transition-all cursor-pointer"
                    title="Fullscreen Lightbox Inspection"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded bg-[#0A0C0E]/80 backdrop-blur-md border border-[rgba(237,231,220,0.2)] text-[11px] font-mono uppercase text-[#E8913C]">
                      Full Turnaround & Expression Sheet
                    </span>
                  </div>
                </div>

                {/* Character Breakdown Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#2E6B72]">
                      Original Character Concept
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#EDE7DC] mt-1">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9EA5A8] leading-relaxed">
                    {project.detailedDescription || project.shortDescription}
                  </p>

                  {/* Character Specs */}
                  <div className="space-y-3 py-4 border-y border-[rgba(237,231,220,0.1)] text-xs font-mono">
                    <div className="flex justify-between text-[#9EA5A8]">
                      <span>Turnaround Angles</span>
                      <span className="text-[#EDE7DC]">Front, Profile, 3/4, Back</span>
                    </div>
                    <div className="flex justify-between text-[#9EA5A8]">
                      <span>Expression Matrix</span>
                      <span className="text-[#EDE7DC]">8 Core Emotion Studies</span>
                    </div>
                    <div className="flex justify-between text-[#9EA5A8]">
                      <span>Rigging Readiness</span>
                      <span className="text-[#E8913C]">Vector Optimized (Animate CC)</span>
                    </div>
                    <div className="flex justify-between text-[#9EA5A8]">
                      <span>Software</span>
                      <span className="text-[#EDE7DC]">{project.softwareUsed?.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-3 px-4 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-md shadow-[#E8913C]/20"
                    >
                      Project Case Study
                    </button>
                    <button
                      onClick={() =>
                        onOpenLightbox(
                          project.coverImage,
                          project.title,
                          project.detailedDescription
                        )
                      }
                      className="p-3 rounded-lg bg-[#101317] hover:bg-[#101317]/80 text-[#EDE7DC] border border-[rgba(237,231,220,0.2)] transition-all cursor-pointer"
                      title="Inspect High-Res Sheet"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
