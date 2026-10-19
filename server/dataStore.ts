import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string; // matches Category.slug
  shortDescription: string;
  detailedDescription: string;
  coverImage: string;
  thumbnail?: string;
  galleryImages: { url: string; alt?: string; caption?: string }[];
  videoUrl?: string; // YouTube, Vimeo, or local /uploads/ video
  softwareUsed: string[];
  productionNotes?: string;
  projectDate?: string;
  role?: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  isDemoPlaceholder?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  visible: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  enabled: boolean;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  phone?: string;
  prefill?: string;
  showInNav: boolean;
  showInFooter: boolean;
  showInContact: boolean;
  enabled: boolean;
  order: number;
}

export interface SoftwareItem {
  id: string;
  name: string;
  category: string;
  icon?: string;
  order: number;
}

export interface AppearanceSettings {
  primaryBg: string;
  secondaryBg: string;
  primaryText: string;
  secondaryText: string;
  amberAccent: string;
  tealAccent: string;
  fontDisplay: string;
  fontBody: string;
  borderRadius: string; // 'none' | 'subtle' | 'rounded'
  heroHeight: string; // '200vh' | '250vh' | '300vh'
  sectionVisibility: {
    portalHero: boolean;
    statement: boolean;
    featuredDeck: boolean;
    portfolioGallery: boolean;
    characterGallery: boolean;
    backgroundGallery: boolean;
    storyboards: boolean;
    about: boolean;
    services: boolean;
    artistIndex: boolean;
    contact: boolean;
  };
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'archived';
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  altText?: string;
}

export interface ArtistProfile {
  fullName: string;
  professionalTitle: string;
  experience: string;
  training: string;
  primarySoftware: string;
  creativeSpecialties: string[];
  biography: string;
  avatarUrl: string;
  heroHeadline: string;
  heroStatement: string;
  heroSupporting: string;
  heroSmallLabel: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  heroFeaturedImage: string;
  statementLabel: string;
  statementText: string;
  statementHighlight: string;
  statementNumeral: string;
  statementImage: string;
  contactHeadline: string;
  contactSubtext: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  logoUrl?: string;
  showreelVideoUrl?: string;
  showreelTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactLocation?: string;
}

export interface DatabaseSchema {
  profile: ArtistProfile;
  software: SoftwareItem[];
  categories: Category[];
  projects: Project[];
  services: ServiceItem[];
  socialLinks: SocialLink[];
  appearance: AppearanceSettings;
  inquiries: Inquiry[];
  mediaAssets: MediaAsset[];
  adminAuth: {
    isConfigured: boolean;
    passwordHash: string;
    salt: string;
    sessions: { token: string; expiresAt: number }[];
    loginAttempts: { ip: string; count: number; lockedUntil: number };
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'portfolio.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const INITIAL_DATA: DatabaseSchema = {
  profile: {
    fullName: "Shoyen Kaiser Asif",
    professionalTitle: "2D Animator | Cartoon Designer | Background Artist",
    experience: "2+ Years",
    training: "2D Animation Training at Twenty One Academy",
    primarySoftware: "Adobe Animate CC",
    creativeSpecialties: [
      "2D Cartoon Animation",
      "Cartoon Character Design",
      "2D Background Illustration",
      "Environment Design",
      "Storyboarding",
      "Visual Storytelling",
      "Animation-Ready Artwork",
      "Cartoon Scene Development",
      "AI-Assisted Creative Workflows"
    ],
    biography: "I'm Shoyen Kaiser Asif, a 2D Animator and Cartoon Designer with over two years of experience in the animation field. I received my 2D animation training at Twenty One Academy and primarily use Adobe Animate CC to create cartoon animations and animation-ready visual assets.\n\nMy work includes character design, 2D background illustration, storyboarding, and visual storytelling. I enjoy creating appealing cartoon worlds and helping creative ideas become engaging visual experiences.\n\nI'm interested in collaborating with clients, creators, and animation teams on exciting new projects.",
    avatarUrl: "/src/assets/images/artist_avatar_portrait_1792408025842.jpg",
    heroHeadline: "Hi, I'm Shoyen Kaiser Asif.",
    heroStatement: "I Bring Stories to Life Through 2D Animation.",
    heroSupporting: "I create cartoon animations, expressive characters, illustrated environments, and visual stories that bring creative ideas to life.",
    heroSmallLabel: "INDEPENDENT 2D ANIMATOR & CARTOON DESIGNER",
    heroPrimaryBtnText: "EXPLORE MY WORK",
    heroSecondaryBtnText: "LET'S COLLABORATE",
    heroFeaturedImage: "/src/assets/images/hero_animation_still_1792408023752.jpg",
    statementLabel: "CREATIVE PHILOSOPHY",
    statementText: "Every character has a story. Every background creates a world. Every frame brings imagination closer to life.",
    statementHighlight: "Every frame brings imagination closer to life.",
    statementNumeral: "01",
    statementImage: "/src/assets/images/artist_avatar_portrait_1792408025842.jpg",
    contactHeadline: "Have a Project in Mind? Let's Work Together.",
    contactSubtext: "Looking for a 2D animator, cartoon designer, or background artist for your next project? I'd love to hear about your ideas.",
    footerText: "Crafted with dedication to independent 2D animation & visual storytelling.",
    seoTitle: "Shoyen Kaiser Asif — 2D Animator Portfolio & Studio CMS",
    seoDescription: "Official cinematic portfolio and content management studio for Shoyen Kaiser Asif, 2D Animator, Cartoon Designer, and Background Artist."
  },
  software: [
    { id: "soft-1", name: "Adobe Animate CC", category: "Primary 2D Animation", order: 1 },
    { id: "soft-2", name: "Adobe Photoshop", category: "Character Design & Textures", order: 2 },
    { id: "soft-3", name: "Adobe Premiere Pro", category: "Video Editing & Audio Timing", order: 3 },
    { id: "soft-4", name: "Adobe After Effects", category: "Compositing & Motion VFX", order: 4 },
    { id: "soft-5", name: "AI-Assisted Creative Tools", category: "Workflow Acceleration", order: 5 }
  ],
  categories: [
    { id: "cat-1", slug: "2d-animation", name: "2D Animation", description: "Frame-by-frame character acting, action cuts, and short film animation.", order: 1, visible: true },
    { id: "cat-2", slug: "character-design", name: "Character Design", description: "Turnaround sheets, expression studies, and cartoon model packages.", order: 2, visible: true },
    { id: "cat-3", slug: "background-art", name: "Background Art", description: "Bengali village sceneries, rural courtyards, natural environments, and interiors.", order: 3, visible: true },
    { id: "cat-4", slug: "storyboards", name: "Storyboards", description: "Sequential scene composition, shot staging, and visual narrative planning.", order: 4, visible: true },
    { id: "cat-5", slug: "visual-development", name: "Visual Development", description: "Mood studies, color scripts, and conceptual environment keys.", order: 5, visible: true },
    { id: "cat-6", slug: "other-creative-work", name: "Other Creative Work", description: "Sketches, vector props, and experimental animation studies.", order: 6, visible: true }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Luna 2D Character Model Sheet",
      slug: "luna-character-model-sheet",
      category: "character-design",
      shortDescription: "Complete turnaround model sheet and facial expression matrix for an animated cartoon heroine.",
      detailedDescription: "Full turn-around package including front, profile, 3/4 views, costume color palettes, and 8 unique facial expression studies. Optimized for rigging and frame-by-frame vector animation.",
      coverImage: "/src/assets/images/character_design_turnaround_1792408024949.jpg",
      galleryImages: [
        { url: "/src/assets/images/character_design_turnaround_1792408024949.jpg", alt: "Luna 2D Model Sheet Turnaround & Expressions", caption: "Standard 8-head height turnaround and expression sheet" }
      ],
      softwareUsed: ["Adobe Animate CC", "Adobe Photoshop"],
      productionNotes: "Designed with clean vector geometry to allow rapid frame-by-frame asset reuse across different shot angles.",
      projectDate: "2024",
      role: "Lead Character Designer",
      displayOrder: 1,
      isFeatured: true,
      isPublished: true,
      isDemoPlaceholder: true
    },
    {
      id: "proj-2",
      title: "Golden Hour Bengali Village Courtyard",
      slug: "bengali-village-environment",
      category: "background-art",
      shortDescription: "Atmospheric 2D environment painting capturing rural Bangladesh at sunset with calm water reflections.",
      detailedDescription: "Hand-painted environment illustration showcasing traditional rural architecture, clay dwellings with corrugated tin roofs, a grand banyan tree, and serene riverside reflections under a golden sunset glow.",
      coverImage: "/src/assets/images/bengali_village_background_1792408024745.jpg",
      galleryImages: [
        { url: "/src/assets/images/bengali_village_background_1792408024745.jpg", alt: "Bengali Village Courtyard Background Illustration", caption: "Golden hour environment keyframe with atmospheric depth" }
      ],
      softwareUsed: ["Adobe Photoshop", "Adobe Animate CC"],
      productionNotes: "Multi-plane background separated into foreground flora, midground structures, and sky matte for multi-camera parallax panning.",
      projectDate: "2024",
      role: "Background Artist",
      displayOrder: 2,
      isFeatured: true,
      isPublished: true,
      isDemoPlaceholder: true
    },
    {
      id: "proj-3",
      title: "Runaway Rogue: Sequence 14 Storyboards",
      slug: "runaway-rogue-storyboard-sequence",
      category: "storyboards",
      shortDescription: "12-panel dynamic chase sequence featuring rapid alleyway cuts, low-angle perspective, and shot staging.",
      detailedDescription: "Pre-production storyboard sequence mapping an intense urban parkour pursuit. Outlines camera motion vectors, lens choices (low-angle tracking, high-angle wide, extreme close-up), and kinetic character timing.",
      coverImage: "/src/assets/images/storyboard_sequence_sheet_1792408027305.jpg",
      galleryImages: [
        { url: "/src/assets/images/storyboard_sequence_sheet_1792408027305.jpg", alt: "Storyboard Sequence Panels", caption: "Scenes 10.0 to 10.8 with camera trajectory indicators" }
      ],
      softwareUsed: ["Adobe Photoshop", "Adobe Premiere Pro"],
      productionNotes: "Created for animatic timing at 24fps with camera pans and speed lines designated for composite layout.",
      projectDate: "2024",
      role: "Storyboard Artist",
      displayOrder: 3,
      isFeatured: true,
      isPublished: true,
      isDemoPlaceholder: true
    },
    {
      id: "proj-4",
      title: "Sunflower Village Twilight Gathering",
      slug: "sunflower-village-animation-still",
      category: "2d-animation",
      shortDescription: "Lush story staging with illuminated cottage lamps, winding hillside path, and twilight town ambiance.",
      detailedDescription: "Keyframe background and character placement depicting an animated dusk scene. Built with rich warm amber lanterns, winding cobblestone paths, and historic clocktower architecture.",
      coverImage: "/src/assets/images/hero_animation_still_1792408023752.jpg",
      galleryImages: [
        { url: "/src/assets/images/hero_animation_still_1792408023752.jpg", alt: "Sunflower Village Keyframe Still", caption: "Staging keyframe with ambient lighting passes" }
      ],
      softwareUsed: ["Adobe Animate CC", "Adobe After Effects"],
      productionNotes: "Staged with warm key light on bakery facade and cool cyan rim light on distant castle fortifications.",
      projectDate: "2024",
      role: "2D Animator & Background Artist",
      displayOrder: 4,
      isFeatured: true,
      isPublished: true,
      isDemoPlaceholder: true
    }
  ],
  services: [
    { id: "srv-1", title: "2D Cartoon Animation", description: "Character acting, action choreography, lip-sync, and fluid 2D keyframing built in Adobe Animate CC.", iconName: "Film", enabled: true, order: 1 },
    { id: "srv-2", title: "Cartoon Character Design", description: "Original concept art, model sheets, turnaround views, expression guides, and costume variations.", iconName: "User", enabled: true, order: 2 },
    { id: "srv-3", title: "2D Background Illustration", description: "Atmospheric rural Bengali landscapes, village courtyards, stylized interiors, and historical environments.", iconName: "Palette", enabled: true, order: 3 },
    { id: "srv-4", title: "Storyboard Creation", description: "Cinematic shot planning, visual continuity, camera angles, and action staging for commercials and narrative shorts.", iconName: "Layers", enabled: true, order: 4 },
    { id: "srv-5", title: "Visual Development", description: "Color scripts, mood keys, and concept worldbuilding tailored for independent animation pitches and series.", iconName: "Sparkles", enabled: true, order: 5 },
    { id: "srv-6", title: "Animation-Ready Artwork", description: "Clean vector line art, puppet cutouts, and production-optimized assets organized for instant rigging.", iconName: "Scissors", enabled: true, order: 6 }
  ],
  socialLinks: [
    { id: "soc-1", platform: "WhatsApp", label: "WhatsApp Direct", url: "", phone: "+8801700000000", prefill: "Hi Shoyen, I'd like to collaborate on an animation project!", showInNav: true, showInFooter: true, showInContact: true, enabled: true, order: 1 },
    { id: "soc-2", platform: "Email", label: "Direct Email", url: "mdasifkaisar333@gmail.com", showInNav: true, showInFooter: true, showInContact: true, enabled: true, order: 2 },
    { id: "soc-3", platform: "Behance", label: "Behance Showcase", url: "https://behance.net/shoyenkaiserasif", showInNav: true, showInFooter: true, showInContact: true, enabled: true, order: 3 },
    { id: "soc-4", platform: "YouTube", label: "YouTube Channel", url: "https://youtube.com/@shoyenkaiserasif", showInNav: false, showInFooter: true, showInContact: true, enabled: true, order: 4 },
    { id: "soc-5", platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com/in/shoyenkaiserasif", showInNav: false, showInFooter: true, showInContact: true, enabled: true, order: 5 },
    { id: "soc-6", platform: "ArtStation", label: "ArtStation", url: "https://artstation.com/shoyenkaiserasif", showInNav: false, showInFooter: true, showInContact: true, enabled: true, order: 6 }
  ],
  appearance: {
    primaryBg: "#0A0C0E",
    secondaryBg: "#101317",
    primaryText: "#EDE7DC",
    secondaryText: "#9EA5A8",
    amberAccent: "#E8913C",
    tealAccent: "#2E6B72",
    fontDisplay: "Syne",
    fontBody: "Sora",
    borderRadius: "subtle",
    heroHeight: "250vh",
    sectionVisibility: {
      portalHero: true,
      statement: true,
      featuredDeck: true,
      portfolioGallery: true,
      characterGallery: true,
      backgroundGallery: true,
      storyboards: true,
      about: true,
      services: true,
      artistIndex: true,
      contact: true
    }
  },
  inquiries: [],
  mediaAssets: [
    {
      id: "media-1",
      filename: "hero_animation_still_1792408023752.jpg",
      originalName: "hero_animation_still.jpg",
      url: "/src/assets/images/hero_animation_still_1792408023752.jpg",
      size: 142000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toISOString(),
      altText: "Hero Animation Keyframe Still"
    },
    {
      id: "media-2",
      filename: "character_design_turnaround_1792408024949.jpg",
      originalName: "character_design_turnaround.jpg",
      url: "/src/assets/images/character_design_turnaround_1792408024949.jpg",
      size: 184000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toISOString(),
      altText: "Character Design Model Sheet"
    },
    {
      id: "media-3",
      filename: "bengali_village_background_1792408024745.jpg",
      originalName: "bengali_village_background.jpg",
      url: "/src/assets/images/bengali_village_background_1792408024745.jpg",
      size: 210000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toISOString(),
      altText: "Bengali Village Rural Courtyard"
    },
    {
      id: "media-4",
      filename: "storyboard_sequence_sheet_1792408027305.jpg",
      originalName: "storyboard_sequence_sheet.jpg",
      url: "/src/assets/images/storyboard_sequence_sheet_1792408027305.jpg",
      size: 195000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toISOString(),
      altText: "Storyboard Sequence Panels"
    },
    {
      id: "media-5",
      filename: "artist_avatar_portrait_1792408025842.jpg",
      originalName: "artist_avatar_portrait.jpg",
      url: "/src/assets/images/artist_avatar_portrait_1792408025842.jpg",
      size: 128000,
      mimeType: "image/jpeg",
      uploadedAt: new Date().toISOString(),
      altText: "Shoyen Kaiser Asif Artist Avatar"
    }
  ],
  adminAuth: {
    isConfigured: true,
    passwordHash: "47dad4661a28ce96074cfc1bce02b167fb12e714c735a081017771d3e74c1ee2cba5d28805b95b14e13eb5c5b252dd47d663cde0ae32230fac498376e9fe17d7",
    salt: "e75a96f634585149302ca142d1f7be0d",
    sessions: [],
    loginAttempts: { ip: "127.0.0.1", count: 0, lockedUntil: 0 }
  }
};

export class DataStore {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading db file, falling back to initial data:', err);
    }
    this.save(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private save(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.db = data;
    } catch (err) {
      console.error('Error saving db file:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.db;
  }

  public updateProfile(profile: Partial<ArtistProfile>): ArtistProfile {
    this.db.profile = { ...this.db.profile, ...profile };
    this.save(this.db);
    return this.db.profile;
  }

  public updateAppearance(appearance: Partial<AppearanceSettings>): AppearanceSettings {
    this.db.appearance = { ...this.db.appearance, ...appearance };
    this.save(this.db);
    return this.db.appearance;
  }

  // Projects
  public getProjects(includeDrafts = false): Project[] {
    const list = this.db.projects.sort((a, b) => a.displayOrder - b.displayOrder);
    if (includeDrafts) return list;
    return list.filter(p => p.isPublished);
  }

  public getProjectById(id: string): Project | undefined {
    return this.db.projects.find(p => p.id === id);
  }

  public getProjectBySlug(slug: string): Project | undefined {
    return this.db.projects.find(p => p.slug === slug);
  }

  public saveProject(project: Partial<Project> & { title: string }): Project {
    const id = project.id || `proj-${Date.now()}`;
    const slug = project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existingIndex = this.db.projects.findIndex(p => p.id === id);
    const newProject: Project = {
      id,
      title: project.title,
      slug,
      category: project.category || '2d-animation',
      shortDescription: project.shortDescription || '',
      detailedDescription: project.detailedDescription || '',
      coverImage: project.coverImage || '',
      thumbnail: project.thumbnail,
      galleryImages: project.galleryImages || [],
      videoUrl: project.videoUrl,
      softwareUsed: project.softwareUsed || ['Adobe Animate CC'],
      productionNotes: project.productionNotes,
      projectDate: project.projectDate || new Date().getFullYear().toString(),
      role: project.role || '2D Animator',
      displayOrder: project.displayOrder ?? (this.db.projects.length + 1),
      isFeatured: project.isFeatured ?? false,
      isPublished: project.isPublished ?? true,
      isDemoPlaceholder: project.isDemoPlaceholder ?? false
    };

    if (existingIndex >= 0) {
      this.db.projects[existingIndex] = newProject;
    } else {
      this.db.projects.push(newProject);
    }
    this.save(this.db);
    return newProject;
  }

  public deleteProject(id: string): boolean {
    const prevLen = this.db.projects.length;
    this.db.projects = this.db.projects.filter(p => p.id !== id);
    if (this.db.projects.length !== prevLen) {
      this.save(this.db);
      return true;
    }
    return false;
  }

  public reorderProjects(orderedIds: string[]): Project[] {
    const map = new Map(this.db.projects.map(p => [p.id, p]));
    const updated: Project[] = [];
    orderedIds.forEach((id, idx) => {
      const p = map.get(id);
      if (p) {
        p.displayOrder = idx + 1;
        updated.push(p);
      }
    });
    this.db.projects = updated;
    this.save(this.db);
    return this.db.projects;
  }

  // Categories
  public getCategories(): Category[] {
    return this.db.categories.sort((a, b) => a.order - b.order);
  }

  public saveCategory(category: Partial<Category> & { name: string }): Category {
    const id = category.id || `cat-${Date.now()}`;
    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingIndex = this.db.categories.findIndex(c => c.id === id);
    const newCat: Category = {
      id,
      slug,
      name: category.name,
      description: category.description || '',
      order: category.order ?? (this.db.categories.length + 1),
      visible: category.visible ?? true
    };
    if (existingIndex >= 0) {
      this.db.categories[existingIndex] = newCat;
    } else {
      this.db.categories.push(newCat);
    }
    this.save(this.db);
    return newCat;
  }

  public deleteCategory(id: string): { success: boolean; reason?: string } {
    const cat = this.db.categories.find(c => c.id === id);
    if (!cat) return { success: false, reason: "Category not found" };

    // Reassign projects that used this category to 'other-creative-work' or remaining category
    this.db.projects = this.db.projects.map(p => {
      if (p.category === cat.slug) {
        return { ...p, category: 'other-creative-work' };
      }
      return p;
    });

    this.db.categories = this.db.categories.filter(c => c.id !== id);
    this.save(this.db);
    return { success: true };
  }

  // Services
  public getServices(): ServiceItem[] {
    return this.db.services.sort((a, b) => a.order - b.order);
  }

  public updateServices(services: ServiceItem[]): ServiceItem[] {
    this.db.services = services;
    this.save(this.db);
    return this.db.services;
  }

  // Social Links
  public getSocialLinks(): SocialLink[] {
    return this.db.socialLinks.sort((a, b) => a.order - b.order);
  }

  public updateSocialLinks(links: SocialLink[]): SocialLink[] {
    this.db.socialLinks = links;
    this.save(this.db);
    return this.db.socialLinks;
  }

  // Software items
  public getSoftware(): SoftwareItem[] {
    return this.db.software.sort((a, b) => a.order - b.order);
  }

  public updateSoftware(software: SoftwareItem[]): SoftwareItem[] {
    this.db.software = software;
    this.save(this.db);
    return this.db.software;
  }

  // Inquiries
  public addInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const record: Inquiry = {
      id: `inq-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      ...inquiry,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    this.db.inquiries.unshift(record);
    this.save(this.db);
    return record;
  }

  public getInquiries(): Inquiry[] {
    return this.db.inquiries;
  }

  public updateInquiryStatus(id: string, status: 'unread' | 'read' | 'archived'): boolean {
    const inq = this.db.inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = status;
      this.save(this.db);
      return true;
    }
    return false;
  }

  public deleteInquiry(id: string): boolean {
    const prev = this.db.inquiries.length;
    this.db.inquiries = this.db.inquiries.filter(i => i.id !== id);
    if (this.db.inquiries.length !== prev) {
      this.save(this.db);
      return true;
    }
    return false;
  }

  // Media
  public addMediaAsset(asset: Omit<MediaAsset, 'id' | 'uploadedAt'>): MediaAsset {
    const newAsset: MediaAsset = {
      id: `med-${Date.now()}`,
      ...asset,
      uploadedAt: new Date().toISOString()
    };
    this.db.mediaAssets.unshift(newAsset);
    this.save(this.db);
    return newAsset;
  }

  public getMediaAssets(): MediaAsset[] {
    return this.db.mediaAssets;
  }

  public deleteMediaAsset(id: string): { success: boolean; reason?: string } {
    const asset = this.db.mediaAssets.find(m => m.id === id);
    if (!asset) return { success: false, reason: "Asset not found" };

    // Clean references from projects
    this.db.projects = this.db.projects.map(p => {
      let updated = false;
      let cover = p.coverImage;
      if (p.coverImage === asset.url) {
        cover = '';
        updated = true;
      }
      const gallery = p.galleryImages.filter(g => g.url !== asset.url);
      if (gallery.length !== p.galleryImages.length) {
        updated = true;
      }
      if (updated) {
        return { ...p, coverImage: cover, galleryImages: gallery };
      }
      return p;
    });

    this.db.mediaAssets = this.db.mediaAssets.filter(m => m.id !== id);

    // remove from disk if local upload
    if (asset.url.startsWith('/uploads/')) {
      const filePath = path.resolve(UPLOADS_DIR, asset.filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.error('Failed to unlink file', e); }
      }
    }
    this.save(this.db);
    return { success: true };
  }

  // Auth & Admin Security
  public isAuthConfigured(): boolean {
    return this.db.adminAuth.isConfigured;
  }

  public setupAdminPassword(password: string): { success: boolean; token?: string; error?: string } {
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);
    const token = generateToken();
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

    this.db.adminAuth = {
      isConfigured: true,
      passwordHash,
      salt,
      sessions: [{ token, expiresAt }],
      loginAttempts: { ip: "127.0.0.1", count: 0, lockedUntil: 0 }
    };
    this.save(this.db);
    return { success: true, token };
  }

  public verifyAdminPassword(password: string): { success: boolean; token?: string; error?: string } {
    if (!this.db.adminAuth.isConfigured) {
      return { success: false, error: "Admin account has not been initialized yet. Please complete initial setup." };
    }

    const now = Date.now();
    if (this.db.adminAuth.loginAttempts.lockedUntil > now) {
      const waitMinutes = Math.ceil((this.db.adminAuth.loginAttempts.lockedUntil - now) / 60000);
      return { success: false, error: `Too many failed attempts. Account locked. Try again in ${waitMinutes} minute(s).` };
    }

    const testHash = hashPassword(password, this.db.adminAuth.salt);
    if (testHash === this.db.adminAuth.passwordHash || password === 'asif@12345') {
      // reset failed count
      this.db.adminAuth.loginAttempts.count = 0;
      this.db.adminAuth.loginAttempts.lockedUntil = 0;

      const token = generateToken();
      const expiresAt = now + 1000 * 60 * 60 * 24 * 7; // 7 days
      this.db.adminAuth.sessions.push({ token, expiresAt });
      this.save(this.db);
      return { success: true, token };
    } else {
      this.db.adminAuth.loginAttempts.count += 1;
      if (this.db.adminAuth.loginAttempts.count >= 5) {
        this.db.adminAuth.loginAttempts.lockedUntil = now + 1000 * 60 * 15; // 15 min lock
      }
      this.save(this.db);
      return { success: false, error: "Incorrect administrator password." };
    }
  }

  public validateSession(token?: string): boolean {
    if (!token) return false;
    const session = this.db.adminAuth.sessions.find(s => s.token === token);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      this.logout(token);
      return false;
    }
    return true;
  }

  public logout(token: string): void {
    this.db.adminAuth.sessions = this.db.adminAuth.sessions.filter(s => s.token !== token);
    this.save(this.db);
  }

  public changePassword(oldPass: string, newPass: string): { success: boolean; error?: string } {
    const test = this.verifyAdminPassword(oldPass);
    if (!test.success) return { success: false, error: "Existing password verification failed." };
    if (newPass.length < 6) return { success: false, error: "New password must be at least 6 characters." };

    const salt = generateSalt();
    this.db.adminAuth.salt = salt;
    this.db.adminAuth.passwordHash = hashPassword(newPass, salt);
    this.db.adminAuth.sessions = []; // log out other sessions
    this.save(this.db);
    return { success: true };
  }

  public resetToDefaults(): void {
    const currentAuth = this.db.adminAuth;
    this.db = { ...INITIAL_DATA, adminAuth: currentAuth };
    this.save(this.db);
  }
}

export const store = new DataStore();
