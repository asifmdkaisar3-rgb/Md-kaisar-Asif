# Shoyen Kaiser Asif — 2D Animator Portfolio & Studio CMS

A cinematic, editorial portfolio website and full-stack content management system built specifically for 2D Animator, Cartoon Designer, and Background Artist Shoyen Kaiser Asif.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Architecture & Defaults:**
> - **Backend & Persistence**: Full-stack Node.js + Express integrated with persistent JSON file database and dedicated disk media storage for high reliability and zero-friction deployment.
> - **Initial Content**: Initialized with Shoyen Kaiser Asif's verified profile, biography, training at Twenty One Academy, and creative specialties. Portfolio starts with polished replaceable demo showcase entries clearly tagged as editable placeholders so the visual galleries and throwable deck are immediately experiential.
> - **Admin Setup**: First-run security wizard allows setting the initial master admin password directly, with password-protected sessions, rate-limiting, and CSRF protection.

---

## 1. Overview & Core Concept

- **What It Does**: Presents Shoyen Kaiser Asif's creative animation identity, projects, cartoon characters, background environments, storyboards, and client inquiry pipeline with a high-end studio aesthetic, coupled with an authenticated private CMS at `/admin` to manage all content, media, theme settings, and inquiries without touching code.
- **Target Audience**: Animation studios, YouTube creators, independent filmmakers, creative agencies, and commercial clients seeking 2D animation, character design, and environment art.
- **Key Value**: Delivers the visual prestige of a boutique animation studio with tactile, scroll-driven interactions (portal hero, throwable project deck, lightbox galleries) and real-time administrative control over every project and setting.

---

## 2. User Experience & Visual Design

### A. Key User Flows
1. **Public Exploration**: Visitors land on the immersive portal hero; scrolling smoothly parts the curtain panels, scales the central wordmark while tightening letter spacing, and introduces the amber/teal duotone atmosphere.
2. **Featured Throwable Deck**: Visitors can drag, throw, or navigate via keyboard through an interactive physical stack of featured artwork cards with inertia and rotation.
3. **Categorized Showcases**: Visitors filter and explore 2D Animation, Character Design (turnarounds, expression sheets), Background Art (Bengali rural landscapes, interiors), and Storyboards (sequential frame inspection) with a high-resolution lightbox.
4. **Client Inquiry**: Visitors submit validated project proposals (name, email, project type, budget, concept); submissions are validated and recorded securely into the inquiries database.
5. **Admin Management (`/admin`)**: The artist logs in securely, creates/edits projects, uploads media files, reorders sections, customizes theme accents/fonts, and reviews client inquiries with status flags.

### B. Visual Identity & Theme
- **Aesthetic Direction**: Cinematic dark editorial studio. Deep charcoal canvas, warm off-white typography, hairline borders, and selective amber & teal accents that highlight craftsmanship.
- **Color Palette**:
  - Primary Background: `#0A0C0E`
  - Secondary Background / Cards: `#101317`
  - Primary Text: `#EDE7DC`
  - Secondary Text: `#9EA5A8`
  - Muted Hairlines: `rgba(237, 231, 220, 0.13)`
  - Amber Accent: `#E8913C` (focus, CTAs, hero highlights)
  - Teal Accent: `#2E6B72` (duotone atmosphere, secondary indicators)
- **Typography**:
  - Display / Headings: `Syne` (weights 600–800) with tight tracking for dramatic wordmarks and section titles.
  - Body & UI: `Sora` (weights 400–600) for clean legibility, unboxed metadata, and form inputs.
- **Strict Anti-Slop Discipline**:
  - No generic pills or badge sandwiches; unboxed metadata separated by quiet dots (`·`).
  - Clean 3-zone top bar contract (`[Wordmark] — [Nav Links] — [CTA button]`).
  - No fake AI scores or mechanical pseudo-code headers (`// 01`).
  - `prefers-reduced-motion` fully respected with graceful static fallback.

---

## 3. Key Product Decisions & Trade-Offs

- **Node/Express Full-Stack Architecture**:
  - *Chosen*: Vite development server integrated with Express API routes (`/api/*`) and static uploads (`/uploads/*`), persisting state into structured JSON records on disk (`data/db.json`) and media into `public/uploads`.
  - *Why*: Provides real server-side session authentication, file upload processing via `multer`, persistent storage across reloads, and instantaneous zero-dependency local/cloud operation without third-party vendor lock-in.
- **Scroll-Driven Portal Hero via Motion**:
  - *Chosen*: Uses `motion`'s `useScroll` and `useTransform` hooks with hardware-accelerated compositor transforms (`transform: translateX()`, `scale()`, `letterSpacing`).
  - *Why*: Reversible 1:1 scroll binding that functions fluidly across desktop and mobile, with instant fallback when reduced motion is requested.
- **Physics-Informed Card Deck**:
  - *Chosen*: Touch-friendly pointer drag with rotational torque and release thresholds for discarding top cards, accompanied by keyboard arrow support and dot pagination.
  - *Why*: Tactile, physical presentation that replicates flipping through an animator's physical acetate sleeves.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Vite & Express Server                           │
│                             (Port 3000)                                │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
          ┌─────────┴─────────┐            ┌─────────┴─────────┐
          │  Public Client    │            │   Admin Portal    │
          │  React 19 Views   │            │   (/admin/*)      │
          └─────────┬─────────┘            └─────────┬─────────┘
                    │                                │
     ┌──────────────┼──────────────┐                 │
     ▼              ▼              ▼                 ▼
┌─────────┐   ┌───────────┐  ┌───────────┐    ┌─────────────┐
│ Portal  │   │ Throwable │  │ Showcases │    │ CMS Manager │
│  Hero   │   │ Card Deck │  │ & Inquire │    │ Auth & CRUD │
└────┬────┘   └─────┬─────┘  └─────┬─────┘    └──────┬──────┘
     │              │              │                 │
     └──────────────┴──────┬───────┴─────────────────┘
                           │ API Requests & Uploads (/api/*)
                           ▼
              ┌──────────────────────────┐
              │  Express REST Services   │
              │  - Auth (PBKDF2 Hash)    │
              │  - Projects & Categories │
              │  - Content & Appearance  │
              │  - Media Uploads (Multer)│
              │  - Inquiries Storage     │
              └────────────┬─────────────┘
                           │ Disk Persistence
                           ▼
          ┌───────────────────────────────────┐
          │ data/portfolio.json & /uploads/*  │
          └───────────────────────────────────┘
```

### Core Entities & State
1. **Artist Profile & Content**: Name, title, 2+ years experience, Twenty One Academy training, Adobe Animate CC, biography, hero texts, statement texts, services, social links (WhatsApp international format, YouTube, Behance, ArtStation, LinkedIn, etc.).
2. **Project Record**: Title, slug, category (`2d-animation`, `character-design`, `background-art`, `storyboards`, `visual-development`), cover image, thumbnail, gallery images, video URL (YouTube/Vimeo or MP4 upload), software used, production notes, featured toggle, display order, published status.
3. **Appearance Settings**: Primary/secondary backgrounds, text colors, amber/teal accents, font presets, radius, hero height, and section toggles.
4. **Client Inquiries**: Submitter name, email, project type, budget, message, timestamp, status (`unread`, `read`, `archived`).
5. **Admin Session**: Secure token session with encrypted credential store and rate limiting.
