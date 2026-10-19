import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowDown, Sparkles, Film, PenTool } from 'lucide-react';
import { ArtistProfile } from '../types';

interface PortalHeroProps {
  profile: ArtistProfile;
  onExploreClick: () => void;
  onCollaborateClick: () => void;
}

export const PortalHero: React.FC<PortalHeroProps> = ({
  profile,
  onExploreClick,
  onCollaborateClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking across 2.5 viewport heights
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Layer 4 & 5: Split Panels translation (Curtains opening)
  const leftPanelX = useTransform(
    scrollYProgress,
    [0, 0.65],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '-105%']
  );
  const rightPanelX = useTransform(
    scrollYProgress,
    [0, 0.65],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '105%']
  );

  // Layer 1: Background image scale (from 1.18 overscale to 1.0 natural scale)
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.7],
    shouldReduceMotion ? [1.0, 1.0] : [1.18, 1.0]
  );

  // Layer 2: Duotone overlay opacity & saturation blend
  const duotoneOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0.15, 0.6]);

  // Layer 5: Accent dots drifting apart
  const leftDotX = useTransform(scrollYProgress, [0, 0.6], ['0px', '-180px']);
  const rightDotX = useTransform(scrollYProgress, [0, 0.6], ['0px', '180px']);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.45, 0.7], [1, 0.8, 0]);

  // Layer 6: Split Wordmark scaling up while tightening letter spacing & translating in opposite directions
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.6], [1.0, 1.25]);
  const wordmarkTracking = useTransform(scrollYProgress, [0, 0.6], ['0.08em', '-0.04em']);
  const spanOneX = useTransform(scrollYProgress, [0, 0.65], ['0px', '-70px']);
  const spanTwoX = useTransform(scrollYProgress, [0, 0.65], ['0px', '70px']);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.55, 0.75], [1, 0.9, 0.15]);

  // Text content reveal when portal opens
  const contentOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.35, 0.75], ['40px', '0px']);

  // Scroll indicator fade
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-[250vh] bg-[#0A0C0E]"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Layer 1: Full-Bleed Featured Artwork */}
        <motion.div
          style={{ scale: imageScale }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <img
            src={profile.heroFeaturedImage || "/src/assets/images/hero_animation_still_1792408023752.jpg"}
            alt="Cinematic 2D animation still by Shoyen Kaiser Asif"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Layer 2: Amber & Teal Duotone Atmospheric Overlay */}
        <motion.div
          style={{ opacity: duotoneOpacity }}
          className="absolute inset-0 pointer-events-none mix-blend-color will-change-[opacity]"
        >
          <div className="w-full h-full bg-gradient-to-tr from-[#2E6B72]/70 via-[#101317]/20 to-[#E8913C]/60" />
        </motion.div>

        {/* Layer 3: Radial Dark Veil around image edges */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(10,12,14,0.3)_0%,rgba(10,12,14,0.85)_80%,rgba(10,12,14,0.98)_100%)]" />

        {/* Layer 4: Two Opaque Split Panels Meeting at Center */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              style={{ x: leftPanelX }}
              className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#0A0C0E] border-r border-[rgba(237,231,220,0.1)] z-10 will-change-transform shadow-[10px_0_40px_rgba(0,0,0,0.8)]"
            />
            <motion.div
              style={{ x: rightPanelX }}
              className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#0A0C0E] border-l border-[rgba(237,231,220,0.1)] z-10 will-change-transform shadow-[-10px_0_40px_rgba(0,0,0,0.8)]"
            />
          </>
        )}

        {/* Layer 5: Accent Dots around center seam */}
        {!shouldReduceMotion && (
          <motion.div
            style={{ opacity: dotOpacity }}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              style={{ x: leftDotX }}
              className="w-2.5 h-2.5 rounded-full bg-[#E8913C] shadow-[0_0_12px_#E8913C]"
            />
            <div className="w-6" />
            <motion.div
              style={{ x: rightDotX }}
              className="w-2.5 h-2.5 rounded-full bg-[#2E6B72] shadow-[0_0_12px_#2E6B72]"
            />
          </motion.div>
        )}

        {/* Layer 6: Split Oversized Artist Wordmark */}
        <motion.div
          style={{
            scale: wordmarkScale,
            opacity: wordmarkOpacity,
            letterSpacing: wordmarkTracking
          }}
          className="absolute z-20 pointer-events-none text-center px-4 will-change-transform select-none"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 font-display font-extrabold text-4xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tight text-[#EDE7DC]">
            <motion.span style={{ x: spanOneX }} className="inline-block drop-shadow-2xl">
              SHOYEN
            </motion.span>
            <motion.span
              style={{ x: spanTwoX }}
              className="inline-block text-[#EDE7DC]/90 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#EDE7DC] via-[#EDE7DC] to-[#E8913C]"
            >
              KAISER ASIF
            </motion.span>
          </div>
          <div className="mt-3 text-xs sm:text-sm tracking-[0.25em] uppercase text-[#9EA5A8] font-medium">
            2D Animator · Cartoon Designer · Background Artist
          </div>
        </motion.div>

        {/* Primary Content Reveal (Reveals as portal fully opens) */}
        <motion.div
          style={{
            opacity: shouldReduceMotion ? 1 : contentOpacity,
            y: shouldReduceMotion ? 0 : contentY
          }}
          className="relative z-30 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#101317]/80 backdrop-blur-md border border-[rgba(237,231,220,0.15)] text-[#E8913C] text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-[#E8913C]" />
            <span>{profile.heroSmallLabel || "INDEPENDENT 2D ANIMATOR & CARTOON DESIGNER"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#EDE7DC] leading-tight balance">
            {profile.heroStatement || "I Bring Stories to Life Through 2D Animation."}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9EA5A8] max-w-2xl font-normal leading-relaxed">
            {profile.heroSupporting ||
              "I create cartoon animations, expressive characters, illustrated environments, and visual stories that bring creative ideas to life."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-7 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#0A0C0E] bg-[#E8913C] hover:bg-[#f39c4a] active:scale-[0.98] rounded transition-all shadow-lg shadow-[#E8913C]/20 cursor-pointer"
            >
              {profile.heroPrimaryBtnText || "EXPLORE MY WORK"}
            </button>
            <button
              onClick={onCollaborateClick}
              className="px-7 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#EDE7DC] bg-[#101317]/90 hover:bg-[#101317] hover:border-[#E8913C]/50 border border-[rgba(237,231,220,0.2)] rounded backdrop-blur-md transition-all cursor-pointer"
            >
              {profile.heroSecondaryBtnText || "LET'S COLLABORATE"}
            </button>
          </div>
        </motion.div>

        {/* Corner Studio Metadata */}
        <div className="absolute bottom-6 left-6 z-30 hidden sm:flex flex-col text-[11px] tracking-wider uppercase text-[#9EA5A8]/80 font-mono">
          <span className="text-[#EDE7DC] font-semibold">{profile.fullName}</span>
          <span>{profile.professionalTitle}</span>
          <span className="text-[#2E6B72]">{profile.training}</span>
        </div>

        <div className="absolute bottom-6 right-6 z-30 hidden sm:flex flex-col items-end text-[11px] tracking-wider uppercase text-[#9EA5A8]/80 font-mono">
          <span className="text-[#EDE7DC] font-semibold">Primary Animation Tool</span>
          <span className="text-[#E8913C]">{profile.primarySoftware}</span>
          <span>{profile.experience} Experience</span>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#9EA5A8] font-medium">
            Scroll to open portal
          </span>
          <ArrowDown className="w-4 h-4 text-[#E8913C] animate-bounce" />
        </motion.div>

      </div>
    </section>
  );
};
