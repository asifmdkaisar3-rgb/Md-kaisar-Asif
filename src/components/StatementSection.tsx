import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArtistProfile } from '../types';

interface StatementSectionProps {
  profile: ArtistProfile;
}

export const StatementSection: React.FC<StatementSectionProps> = ({ profile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Subtle drift and rotation of the circular artwork
  const circleRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-15, 25]);
  const circleY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [60, -60]);

  const statement = profile.statementText ||
    "Every character has a story. Every background creates a world. Every frame brings imagination closer to life.";
  const highlight = profile.statementHighlight || "Every frame brings imagination closer to life.";

  // Render text with highlight
  const parts = statement.split(highlight);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] py-24 sm:py-32 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.08)] overflow-hidden flex items-center"
    >
      {/* Background oversized outlined numeral */}
      <div className="absolute left-6 lg:left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.06]">
        <span className="font-display font-extrabold text-[180px] sm:text-[280px] md:text-[380px] leading-none text-[#EDE7DC]">
          {profile.statementNumeral || "01"}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Statement Prose */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#E8913C]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8913C] font-semibold">
              {profile.statementLabel || "CREATIVE PHILOSOPHY"}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#EDE7DC] leading-[1.15] tracking-tight text-balance">
            {parts[0]}
            <span className="text-[#E8913C] underline decoration-[#E8913C]/30 decoration-wavy decoration-2 underline-offset-8">
              {highlight}
            </span>
            {parts[1]}
          </h2>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs uppercase tracking-wider text-[#9EA5A8] font-mono">
            <span>Discipline: 2D Animation & Visual Art</span>
            <span className="hidden sm:inline">·</span>
            <span>Focus: Traditional & Vector Timing</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[#2E6B72]">Twenty One Academy Trained</span>
          </div>
        </div>

        {/* Right Column: Drifting Circular Visual Motif */}
        <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
          <motion.div
            style={{
              rotate: circleRotate,
              y: circleY
            }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2 border border-[rgba(237,231,220,0.15)] shadow-2xl shadow-black/80 will-change-transform"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                src={profile.statementImage || profile.avatarUrl || "/src/assets/images/artist_avatar_portrait_1792408025842.jpg"}
                alt="Shoyen Kaiser Asif animation workstation artwork"
                className="w-full h-full object-cover object-center filter saturate-[1.1]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0E]/70 via-transparent to-transparent" />
            </div>

            {/* Orbiting Badge Tag */}
            <div className="absolute -bottom-3 -left-3 px-4 py-2 bg-[#101317]/95 border border-[rgba(237,231,220,0.2)] rounded-lg backdrop-blur-md shadow-xl text-left">
              <p className="text-[10px] uppercase tracking-wider text-[#9EA5A8] font-mono">Artist Studio</p>
              <p className="text-xs font-semibold text-[#EDE7DC]">{profile.fullName}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
