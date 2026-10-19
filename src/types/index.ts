export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  detailedDescription: string;
  coverImage: string;
  thumbnail?: string;
  galleryImages: { url: string; alt?: string; caption?: string }[];
  videoUrl?: string;
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
  borderRadius: string;
  heroHeight: string;
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

export interface PublicPortfolioData {
  profile: ArtistProfile;
  categories: Category[];
  projects: Project[];
  services: ServiceItem[];
  socialLinks: SocialLink[];
  software: SoftwareItem[];
  appearance: AppearanceSettings;
}

export interface AdminOverview {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalCategories: number;
  totalMedia: number;
  unreadInquiries: number;
}
