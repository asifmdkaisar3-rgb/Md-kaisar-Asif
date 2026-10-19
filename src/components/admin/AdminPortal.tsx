import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Image as ImageIcon,
  FileText,
  Palette,
  Share2,
  Mail,
  LogOut,
  ExternalLink,
  Shield,
  KeyRound,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import {
  PublicPortfolioData,
  Project,
  Category,
  MediaAsset,
  Inquiry,
  AdminOverview
} from '../../types';
import { api, setAdminToken } from '../../api/client';
import { AdminLogin } from './AdminLogin';
import { AdminSetup } from './AdminSetup';
import { ProjectsManager } from './ProjectsManager';
import { MediaLibrary } from './MediaLibrary';
import { ContentEditor } from './ContentEditor';
import { AppearanceEditor } from './AppearanceEditor';
import { SocialLinksEditor } from './SocialLinksEditor';
import { InquiriesManager } from './InquiriesManager';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewProject: (project: Project) => void;
  onPublicDataUpdated: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onPreviewProject,
  onPublicDataUpdated
}) => {
  const [authState, setAuthState] = useState<{ isConfigured: boolean; isAuthenticated: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'media' | 'content' | 'appearance' | 'social' | 'inquiries'
  >('overview');

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [publicData, setPublicData] = useState<PublicPortfolioData | null>(null);

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const status = await api.getAuthStatus();
      setAuthState(status);
      if (status.isAuthenticated) {
        loadAdminData();
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const [ov, projs, cats, meds, inqs, pub] = await Promise.all([
        api.getOverview(),
        api.getAllProjects(),
        api.getCategories(),
        api.getMedia(),
        api.getInquiries(),
        api.getPublicData()
      ]);
      setOverview(ov);
      setAllProjects(projs);
      setCategories(cats);
      setMediaList(meds);
      setInquiries(inqs);
      setPublicData(pub);
      onPublicDataUpdated();
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen, checkAuth]);

  if (!isOpen) return null;

  // Unconfigured state: show setup wizard
  if (authState && !authState.isConfigured) {
    return (
      <AdminSetup
        onSuccess={() => {
          checkAuth();
        }}
        onCancel={onClose}
      />
    );
  }

  // Not authenticated state: show login
  if (authState && !authState.isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          checkAuth();
        }}
        onCancel={onClose}
      />
    );
  }

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (_) {}
    setAdminToken(null);
    checkAuth();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    try {
      await api.changePassword(oldPassword, newPassword);
      setPasswordStatus({ type: 'success', message: 'Password changed successfully.' });
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setIsPasswordModalOpen(false), 1500);
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message || 'Failed to change password.' });
    }
  };

  interface AdminTab {
    id: 'overview' | 'projects' | 'media' | 'content' | 'appearance' | 'social' | 'inquiries';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }

  const tabs: AdminTab[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Manager', icon: Layers, count: allProjects.length },
    { id: 'media', label: 'Media Library', icon: ImageIcon, count: mediaList.length },
    { id: 'content', label: 'Content & Bio', icon: FileText },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'social', label: 'Social & WhatsApp', icon: Share2 },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: Mail,
      count: inquiries.filter(i => i.status === 'unread').length
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0C0E] text-[#EDE7DC] flex flex-col font-sans">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 h-16 bg-[#101317] border-b border-[rgba(237,231,220,0.12)] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-extrabold text-base tracking-tight text-[#EDE7DC]">
            SHOYEN KAISER ASIF <span className="text-[#E8913C] font-mono text-xs font-normal">STUDIO CMS</span>
          </span>
          <span className="hidden md:inline-block px-2.5 py-0.5 rounded bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] text-[10px] font-mono text-[#2E6B72]">
            Disk Storage Persistent
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#0A0C0E] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] border border-[rgba(237,231,220,0.15)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E8913C]" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="p-2 rounded-lg bg-[#0A0C0E] hover:bg-white/10 text-[#9EA5A8] hover:text-[#EDE7DC] transition-colors cursor-pointer"
            title="Change Admin Password"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-[#0A0C0E] hover:bg-rose-950/40 text-[#9EA5A8] hover:text-rose-400 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[rgba(237,231,220,0.1)] pb-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#E8913C] text-[#0A0C0E] font-bold shadow-md shadow-[#E8913C]/20'
                    : 'bg-[#101317] text-[#9EA5A8] hover:text-[#EDE7DC] hover:bg-[#101317]/80 border border-[rgba(237,231,220,0.08)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-[#0A0C0E] text-[#EDE7DC]' : 'bg-[#0A0C0E] text-[#9EA5A8]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9EA5A8] block">
                  Published Projects
                </span>
                <span className="font-display text-3xl font-extrabold text-[#EDE7DC]">
                  {overview.publishedProjects}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9EA5A8] block">
                  Draft Projects
                </span>
                <span className="font-display text-3xl font-extrabold text-[#9EA5A8]">
                  {overview.draftProjects}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9EA5A8] block">
                  Categories
                </span>
                <span className="font-display text-3xl font-extrabold text-[#2E6B72]">
                  {overview.totalCategories}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9EA5A8] block">
                  Media Files
                </span>
                <span className="font-display text-3xl font-extrabold text-[#EDE7DC]">
                  {overview.totalMedia}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-[#E8913C] block">
                  Unread Inquiries
                </span>
                <span className="font-display text-3xl font-extrabold text-[#E8913C]">
                  {overview.unreadInquiries}
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Quick Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-4">
                  <h4 className="font-display text-lg font-bold text-[#EDE7DC]">
                    Studio Quick Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="p-4 rounded-xl bg-[#0A0C0E] hover:border-[#E8913C]/50 border border-[rgba(237,231,220,0.1)] text-left transition-all cursor-pointer group"
                    >
                      <Layers className="w-5 h-5 text-[#E8913C] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-[#EDE7DC]">Manage Projects</div>
                      <div className="text-[10px] text-[#9EA5A8]">Add artwork, reorder cards, toggle drafts</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('media')}
                      className="p-4 rounded-xl bg-[#0A0C0E] hover:border-[#E8913C]/50 border border-[rgba(237,231,220,0.1)] text-left transition-all cursor-pointer group"
                    >
                      <ImageIcon className="w-5 h-5 text-[#2E6B72] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-[#EDE7DC]">Upload Media Files</div>
                      <div className="text-[10px] text-[#9EA5A8]">Upload MP4 videos, JPG, PNG, WebP</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('content')}
                      className="p-4 rounded-xl bg-[#0A0C0E] hover:border-[#E8913C]/50 border border-[rgba(237,231,220,0.1)] text-left transition-all cursor-pointer group"
                    >
                      <FileText className="w-5 h-5 text-[#E8913C] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-[#EDE7DC]">Edit Artist Bio</div>
                      <div className="text-[10px] text-[#9EA5A8]">Update credentials, headline, services</div>
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="p-4 rounded-xl bg-[#0A0C0E] hover:border-[#E8913C]/50 border border-[rgba(237,231,220,0.1)] text-left transition-all cursor-pointer group"
                    >
                      <Mail className="w-5 h-5 text-[#E8913C] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-[#EDE7DC]">Review Inquiries</div>
                      <div className="text-[10px] text-[#9EA5A8]">Check client briefs & reply directly</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Studio Health & Info */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-2xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-4 text-xs font-mono">
                  <h4 className="font-display text-base font-bold text-[#EDE7DC] font-sans">
                    System & Storage Health
                  </h4>
                  <div className="space-y-2 text-[#9EA5A8]">
                    <div className="flex justify-between py-1 border-b border-[rgba(237,231,220,0.06)]">
                      <span>Server Engine</span>
                      <span className="text-[#EDE7DC]">Node.js & Express</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgba(237,231,220,0.06)]">
                      <span>Database Path</span>
                      <span className="text-[#2E6B72]">/data/portfolio.json</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgba(237,231,220,0.06)]">
                      <span>Uploads Directory</span>
                      <span className="text-[#2E6B72]">/public/uploads/</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgba(237,231,220,0.06)]">
                      <span>Password Protection</span>
                      <span className="text-emerald-400">PBKDF2 Salted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Projects Manager */}
        {activeTab === 'projects' && (
          <ProjectsManager
            projects={allProjects}
            categories={categories}
            mediaList={mediaList}
            onRefresh={loadAdminData}
            onPreviewProject={onPreviewProject}
          />
        )}

        {/* Tab 3: Media Library */}
        {activeTab === 'media' && (
          <MediaLibrary
            mediaList={mediaList}
            onRefresh={loadAdminData}
          />
        )}

        {/* Tab 4: Content & Bio */}
        {activeTab === 'content' && publicData && (
          <ContentEditor
            initialProfile={publicData.profile}
            initialSoftware={publicData.software}
            initialServices={publicData.services}
            onRefresh={loadAdminData}
          />
        )}

        {/* Tab 5: Appearance */}
        {activeTab === 'appearance' && publicData && (
          <AppearanceEditor
            initialAppearance={publicData.appearance}
            onRefresh={loadAdminData}
          />
        )}

        {/* Tab 6: Social & WhatsApp */}
        {activeTab === 'social' && publicData && (
          <SocialLinksEditor
            initialLinks={publicData.socialLinks}
            onRefresh={loadAdminData}
          />
        )}

        {/* Tab 7: Inquiries */}
        {activeTab === 'inquiries' && (
          <InquiriesManager
            inquiries={inquiries}
            onRefresh={loadAdminData}
          />
        )}

      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#101317] border border-[rgba(237,231,220,0.15)] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h4 className="font-display text-base font-bold text-[#EDE7DC]">
              Change Master Password
            </h4>

            {passwordStatus && (
              <div
                className={`p-3 rounded-lg text-xs ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                }`}
              >
                {passwordStatus.message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">
                  New Password (min. 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-mono text-[#9EA5A8] hover:text-[#EDE7DC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E8913C] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider hover:bg-[#f39c4a]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
