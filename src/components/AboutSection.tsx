import React from 'react';
import { Award, CheckCircle2, Cpu, Film, GraduationCap, Monitor, PenTool, Sparkles } from 'lucide-react';
import { ArtistProfile, SoftwareItem } from '../types';

interface AboutSectionProps {
  profile: ArtistProfile;
  software: SoftwareItem[];
  onCollaborateClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  software,
  onCollaborateClick
}) => {
  const paragraphs = profile.biography ? profile.biography.split('\n\n') : [];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.08)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[rgba(237,231,220,0.1)]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#E8913C]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
                ARTIST PROFILE & BACKGROUND
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#EDE7DC] tracking-tight">
              About Shoyen Kaiser Asif
            </h2>
            <p className="text-sm text-[#9EA5A8] max-w-xl">
              2D Animator, Cartoon Designer, and Background Artist dedicated to traditional vector motion, rich rural atmospheres, and character charm.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#E8913C]">
            <GraduationCap className="w-4 h-4 text-[#E8913C]" />
            <span>Twenty One Academy Alumnus</span>
          </div>
        </div>

        {/* Content Split */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait & Verified Credentials Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative rounded-2xl overflow-hidden border border-[rgba(237,231,220,0.15)] bg-[#101317] shadow-2xl p-3">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/60">
                <img
                  src={profile.avatarUrl || "/src/assets/images/artist_avatar_portrait_1792408025842.jpg"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover object-center filter saturate-[1.05]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0E]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm font-bold text-[#EDE7DC] font-display">
                    {profile.fullName}
                  </div>
                  <div className="text-xs text-[#E8913C] font-mono">
                    {profile.professionalTitle}
                  </div>
                </div>
              </div>

              {/* Verified Credentials Strip */}
              <div className="mt-4 p-4 rounded-xl bg-[#0A0C0E]/90 border border-[rgba(237,231,220,0.08)] space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[#9EA5A8]">
                  <span>Experience</span>
                  <span className="text-[#EDE7DC] font-semibold">{profile.experience}</span>
                </div>
                <div className="flex items-center justify-between text-[#9EA5A8]">
                  <span>Professional Training</span>
                  <span className="text-[#EDE7DC] text-right truncate max-w-[200px]" title={profile.training}>
                    Twenty One Academy
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#9EA5A8]">
                  <span>Primary Software</span>
                  <span className="text-[#E8913C] font-semibold">{profile.primarySoftware}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onCollaborateClick}
              className="w-full py-3.5 px-6 rounded-xl bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-lg shadow-[#E8913C]/20"
            >
              Start A Conversation
            </button>
          </div>

          {/* Right Column: Narrative Biography & Specialties */}
          <div className="lg:col-span-7 space-y-10">
            {/* Biography Prose */}
            <div className="space-y-5 text-sm sm:text-base text-[#9EA5A8] leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Creative Specialties */}
            <div className="space-y-4 pt-6 border-t border-[rgba(237,231,220,0.1)]">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#E8913C] font-semibold">
                Core Creative Disciplines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.creativeSpecialties.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.08)] text-xs text-[#EDE7DC]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#2E6B72] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Software Stack */}
            <div className="space-y-4 pt-6 border-t border-[rgba(237,231,220,0.1)]">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#E8913C] font-semibold">
                Production Software & Toolkit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {software.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.08)] hover:border-[#E8913C]/30 transition-colors"
                  >
                    <div className="font-semibold text-xs text-[#EDE7DC]">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#6C7378] mt-1">
                      {item.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
