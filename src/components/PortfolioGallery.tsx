import React, { useState, useMemo } from 'react';
import { Eye, Film, Layers, Play, Sparkles } from 'lucide-react';
import { Project, Category } from '../types';

interface PortfolioGalleryProps {
  projects: Project[];
  categories: Category[];
  onSelectProject: (project: Project) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  projects,
  categories,
  onSelectProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter categories that actually have published projects
  const availableCategories = useMemo(() => {
    const projectCatSlugs = new Set(projects.map(p => p.category));
    return categories.filter(c => projectCatSlugs.has(c.slug));
  }, [categories, projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter(p => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                CURATED PORTFOLIO
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
              Selected Animation & Artwork
            </h2>
            <p className="text-sm text-[#9EA5A8] max-w-xl">
              From kinetic 2D character acting to layered environmental backgrounds and pre-production storyboards.
            </p>
          </div>

          <div className="text-xs font-mono text-[#9EA5A8] shrink-0">
            <span>Showing {filteredProjects.length} of {projects.length} Works</span>
          </div>
        </div>

        {/* Filter Bar (Segmented Controls) */}
        <div className="pt-8 pb-10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#E8913C] text-[#0A0C0E] font-bold shadow-md shadow-[#E8913C]/20'
                : 'bg-[#101317] text-[#9EA5A8] hover:text-[#EDE7DC] hover:bg-[#101317]/80 border border-[rgba(237,231,220,0.1)]'
            }`}
          >
            All Works ({projects.length})
          </button>

          {availableCategories.map(cat => {
            const count = projects.filter(p => p.category === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8913C] text-[#0A0C0E] font-bold shadow-md shadow-[#E8913C]/20'
                    : 'bg-[#101317] text-[#9EA5A8] hover:text-[#EDE7DC] hover:bg-[#101317]/80 border border-[rgba(237,231,220,0.1)]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#101317]/50 border border-[rgba(237,231,220,0.08)]">
            <Sparkles className="w-10 h-10 text-[#9EA5A8] mx-auto mb-3 stroke-1" />
            <h3 className="font-display text-lg font-bold text-[#EDE7DC]">No Projects in this Category</h3>
            <p className="mt-1 text-xs text-[#9EA5A8]">
              More animation and visual assets will be uploaded soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => (
              <article
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group relative flex flex-col bg-[#101317] border border-[rgba(237,231,220,0.12)] rounded-xl overflow-hidden hover:border-[#E8913C]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 cursor-pointer"
              >
                {/* Media Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading={idx < 4 ? "eager" : "lazy"}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101317] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top indicators */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded bg-[#0A0C0E]/80 backdrop-blur-md border border-[rgba(237,231,220,0.15)] text-[#E8913C]">
                      {project.category.replace('-', ' ')}
                    </span>
                    {project.videoUrl && (
                      <span className="p-1 rounded-full bg-[#E8913C] text-[#0A0C0E]" title="Video Showcase">
                        <Play className="w-3 h-3 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Hover Eye Trigger */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8913C] text-[#0A0C0E] text-xs font-bold tracking-wider uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Project</span>
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#9EA5A8] font-mono">
                      <span>{project.projectDate || '2024'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.role || 'Animator'}</span>
                      {project.isDemoPlaceholder && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#2E6B72]">Replaceable Demo</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#EDE7DC] group-hover:text-[#E8913C] transition-colors leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[#9EA5A8] line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Software footer */}
                  <div className="pt-3 border-t border-[rgba(237,231,220,0.08)] flex items-center justify-between text-[11px] font-mono text-[#6C7378]">
                    <span>{project.softwareUsed?.slice(0, 2).join(' / ') || 'Adobe Animate CC'}</span>
                    <span className="text-[#E8913C] group-hover:translate-x-0.5 transition-transform">Inspect →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
