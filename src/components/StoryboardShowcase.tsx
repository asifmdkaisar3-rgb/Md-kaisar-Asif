import React from 'react';
import { Layers, Maximize2, Camera, Film } from 'lucide-react';
import { Project } from '../types';

interface StoryboardShowcaseProps {
  projects: Project[];
  onOpenLightbox: (imageUrl: string, title: string, caption?: string) => void;
  onSelectProject: (project: Project) => void;
}

export const StoryboardShowcase: React.FC<StoryboardShowcaseProps> = ({
  projects,
  onOpenLightbox,
  onSelectProject
}) => {
  const storyboards = projects.filter(
    p => p.category === 'storyboards' || p.category === 'visual-development'
  );

  if (storyboards.length === 0) return null;

  return (
    <section id="storyboards" className="py-24 sm:py-32 bg-[#101317] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                PRE-PRODUCTION & SEQUENTIAL ART
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
              Storyboards & Visual Flow
            </h2>
            <p className="text-sm text-[#9EA5A8] max-w-xl">
              Camera angles, shot staging, beat pacing, action blocking, and dynamic animatic composition for animated shorts and series.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9EA5A8]">
            <Camera className="w-4 h-4 text-[#2E6B72]" />
            <span>24 FPS Staging & Motion Vectors</span>
          </div>
        </div>

        {/* Storyboard Sheets Grid */}
        <div className="mt-12 space-y-12">
          {storyboards.map(project => (
            <div
              key={project.id}
              className="bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(237,231,220,0.08)]">
                <div>
                  <span className="text-xs font-mono text-[#E8913C] uppercase tracking-wider">
                    Sequential Production Sheet
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#EDE7DC]">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      onOpenLightbox(
                        project.coverImage,
                        project.title,
                        project.detailedDescription
                      )
                    }
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101317] hover:bg-[#101317]/80 text-[#EDE7DC] hover:text-[#E8913C] border border-[rgba(237,231,220,0.15)] text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Inspect Sequence</span>
                  </button>
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-4 py-1.5 rounded-lg bg-[#E8913C] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider hover:bg-[#f39c4a] transition-all cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Storyboard Image Frame */}
              <div
                className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/80 border border-[rgba(237,231,220,0.15)] cursor-zoom-in group"
                onClick={() =>
                  onOpenLightbox(
                    project.coverImage,
                    project.title,
                    project.detailedDescription
                  )
                }
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-[#0A0C0E]/90 border border-white/10 text-[10px] font-mono text-[#9EA5A8]">
                  Click to inspect full-resolution panels & camera notes
                </div>
              </div>

              {/* Sequence Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs font-mono text-[#9EA5A8]">
                <div>
                  <span className="text-[#EDE7DC] block font-semibold mb-1">Shot Composition</span>
                  <p className="leading-relaxed">
                    Dynamic wide, low-angle tracking, and handheld close-ups staged for kinetic pursuit tension.
                  </p>
                </div>
                <div>
                  <span className="text-[#EDE7DC] block font-semibold mb-1">Production Notes</span>
                  <p className="leading-relaxed">
                    {project.productionNotes || 'Pacing calibrated for rapid-cut animatic with vector camera pan marks.'}
                  </p>
                </div>
                <div>
                  <span className="text-[#EDE7DC] block font-semibold mb-1">Target Pipeline</span>
                  <p className="leading-relaxed">
                    Designed for direct import into Adobe Animate CC timeline for keyframe tweening.
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
