import {
  PublicPortfolioData,
  Project,
  Category,
  ServiceItem,
  SocialLink,
  SoftwareItem,
  AppearanceSettings,
  Inquiry,
  MediaAsset,
  AdminOverview,
  ArtistProfile
} from '../types';

const TOKEN_KEY = 'ska_admin_session_token';

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Public
  getPublicData: () => request<PublicPortfolioData>('/api/public/data'),
  getProjectBySlug: (slug: string) => request<Project>(`/api/public/projects/${slug}`),
  submitInquiry: (payload: {
    name: string;
    email: string;
    projectType: string;
    budget?: string;
    message: string;
  }) =>
    request<{ success: boolean; message: string; inquiryId: string }>('/api/public/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Auth
  getAuthStatus: () => request<{ isConfigured: boolean; isAuthenticated: boolean }>('/api/auth/status'),
  setupAdminPassword: (password: string) =>
    request<{ success: boolean; token: string }>('/api/auth/setup', {
      method: 'POST',
      body: JSON.stringify({ password })
    }),
  login: (password: string) =>
    request<{ success: boolean; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    }),
  logout: () =>
    request<{ success: boolean }>('/api/auth/logout', {
      method: 'POST'
    }),

  // Admin
  getOverview: () => request<AdminOverview>('/api/admin/overview'),
  getAllProjects: () => request<Project[]>('/api/admin/projects'),
  saveProject: (project: Partial<Project> & { title: string }) =>
    request<Project>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    }),
  deleteProject: (id: string) =>
    request<{ success: boolean }>(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    }),
  duplicateProject: (id: string) =>
    request<Project>(`/api/admin/projects/duplicate/${id}`, {
      method: 'POST'
    }),
  reorderProjects: (orderedIds: string[]) =>
    request<Project[]>('/api/admin/projects/reorder', {
      method: 'POST',
      body: JSON.stringify({ orderedIds })
    }),

  getCategories: () => request<Category[]>('/api/admin/categories'),
  saveCategory: (category: Partial<Category> & { name: string }) =>
    request<Category>('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    }),
  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/api/admin/categories/${id}`, {
      method: 'DELETE'
    }),

  updateProfile: (profile: Partial<ArtistProfile>) =>
    request<ArtistProfile>('/api/admin/profile', {
      method: 'POST',
      body: JSON.stringify(profile)
    }),
  updateServices: (services: ServiceItem[]) =>
    request<ServiceItem[]>('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify({ services })
    }),
  updateSocialLinks: (socialLinks: SocialLink[]) =>
    request<SocialLink[]>('/api/admin/social-links', {
      method: 'POST',
      body: JSON.stringify({ socialLinks })
    }),
  updateSoftware: (software: SoftwareItem[]) =>
    request<SoftwareItem[]>('/api/admin/software', {
      method: 'POST',
      body: JSON.stringify({ software })
    }),
  updateAppearance: (appearance: Partial<AppearanceSettings>) =>
    request<AppearanceSettings>('/api/admin/appearance', {
      method: 'POST',
      body: JSON.stringify(appearance)
    }),
  resetAppearance: () =>
    request<AppearanceSettings>('/api/admin/appearance/reset', {
      method: 'POST'
    }),

  getInquiries: () => request<Inquiry[]>('/api/admin/inquiries'),
  updateInquiryStatus: (id: string, status: 'unread' | 'read' | 'archived') =>
    request<{ success: boolean }>(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  deleteInquiry: (id: string) =>
    request<{ success: boolean }>(`/api/admin/inquiries/${id}`, {
      method: 'DELETE'
    }),

  getMedia: () => request<MediaAsset[]>('/api/admin/media'),
  uploadMedia: (file: File, altText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);
    return request<MediaAsset>('/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
  },
  deleteMedia: (id: string) =>
    request<{ success: boolean }>(`/api/admin/media/${id}`, {
      method: 'DELETE'
    }),
  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ success: boolean }>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword })
    })
};
