import React from 'react';
import { ArrowUpRight, Film } from 'lucide-react';
import { Project } from '../types';

interface WorkIndexProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const WorkIndex: React.FC<WorkIndexProps> = ({
  projects,
  onSelectProject
}) => {
  if (projects.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[rgba(237,231,220,0.1)]">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
              CHRONOLOGICAL ARCHIVE
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#EDE7DC] mt-1">
              Production Index & Roster
            </h2>
          </div>
          <span className="text-xs font-mono text-[#9EA5A8]">
            {projects.length} Total Registered Production Entries
          </span>
        </div>

        {/* Hairline-Ruled Editorial Table */}
        <div className="divide-y divide-[rgba(237,231,220,0.08)]">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-white/[0.02] -mx-4 px-4 rounded-lg transition-colors cursor-pointer"
            >
              {/* Index number & Category */}
              <div className="md:col-span-3 flex items-center gap-3">
                <span className="font-mono text-xs text-[#6C7378]">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-[#2E6B72] group-hover:text-[#E8913C] transition-colors">
                  {project.category.replace('-', ' ')}
                </span>
              </div>

              {/* Title */}
              <div className="md:col-span-5">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#EDE7DC] group-hover:text-[#E8913C] transition-colors">
                  {project.title}
                </h3>
              </div>

              {/* Software & Role */}
              <div className="md:col-span-3 flex items-center gap-2 text-xs font-mono text-[#9EA5A8]">
                <span>{project.role || '2D Artist'}</span>
                <span aria-hidden="true">/</span>
                <span>{project.projectDate || '2024'}</span>
              </div>

              {/* Action icon */}
              <div className="md:col-span-1 flex justify-end">
                <div className="p-2 rounded-full text-[#9EA5A8] group-hover:text-[#E8913C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
