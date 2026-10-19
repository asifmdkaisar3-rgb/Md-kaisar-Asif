import React, { useState } from 'react';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ArtistProfile, SoftwareItem, ServiceItem } from '../../types';
import { api } from '../../api/client';
import { FileUploadButton } from './FileUploadButton';

interface ContentEditorProps {
  initialProfile: ArtistProfile;
  initialSoftware: SoftwareItem[];
  initialServices: ServiceItem[];
  onRefresh: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  initialProfile,
  initialSoftware,
  initialServices,
  onRefresh
}) => {
  const [profile, setProfile] = useState<ArtistProfile>(initialProfile);
  const [software, setSoftware] = useState<SoftwareItem[]>(initialSoftware);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newSoftwareName, setNewSoftwareName] = useState('');
  const [newSoftwareCategory, setNewSoftwareCategory] = useState('');

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleProfileChange = (field: keyof ArtistProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !profile.creativeSpecialties.includes(newSpecialty.trim())) {
      setProfile(prev => ({
        ...prev,
        creativeSpecialties: [...prev.creativeSpecialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setProfile(prev => ({
      ...prev,
      creativeSpecialties: prev.creativeSpecialties.filter(s => s !== spec)
    }));
  };

  const handleAddSoftware = () => {
    if (!newSoftwareName.trim()) return;
    const item: SoftwareItem = {
      id: `soft-${Date.now()}`,
      name: newSoftwareName.trim(),
      category: newSoftwareCategory.trim() || 'Animation Tool',
      order: software.length + 1
    };
    setSoftware([...software, item]);
    setNewSoftwareName('');
    setNewSoftwareCategory('');
  };

  const handleRemoveSoftware = (id: string) => {
    setSoftware(software.filter(s => s.id !== id));
  };

  const handleServiceChange = (id: string, field: keyof ServiceItem, value: any) => {
    setServices(services.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.updateProfile(profile);
      await api.updateSoftware(software);
      await api.updateServices(services);
      setStatus({ type: 'success', message: 'All website content successfully updated and saved.' });
      onRefresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div>
          <h3 className="font-display text-base font-bold text-[#EDE7DC]">
            Website Content & Profile Editor
          </h3>
          <p className="text-xs text-[#9EA5A8]">
            Customize biography, hero text, software list, and service definitions.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs ${
            status.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* 1. Artist Profile & Identity */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          1. Artist Profile & Verified Identity
        </h4>

        {/* Avatar Image Upload */}
        <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)] flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/60 border border-[rgba(237,231,220,0.2)] shrink-0">
            <img
              src={profile.avatarUrl || "/src/assets/images/artist_avatar_portrait_1792408025842.jpg"}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#9EA5A8]">
                Profile Photograph / Illustrated Avatar
              </label>
              <FileUploadButton
                label="Upload New Avatar"
                onUploaded={url => handleProfileChange('avatarUrl', url)}
              />
            </div>
            <input
              type="text"
              value={profile.avatarUrl}
              onChange={e => handleProfileChange('avatarUrl', e.target.value)}
              placeholder="/uploads/... or /src/assets/..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={e => handleProfileChange('fullName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Professional Title *
            </label>
            <input
              type="text"
              value={profile.professionalTitle}
              onChange={e => handleProfileChange('professionalTitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Experience Duration
            </label>
            <input
              type="text"
              value={profile.experience}
              onChange={e => handleProfileChange('experience', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Professional Training
            </label>
            <input
              type="text"
              value={profile.training}
              onChange={e => handleProfileChange('training', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Primary Software
            </label>
            <input
              type="text"
              value={profile.primarySoftware}
              onChange={e => handleProfileChange('primarySoftware', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Narrative Biography (Paragraphs separated by blank lines)
          </label>
          <textarea
            rows={5}
            value={profile.biography}
            onChange={e => handleProfileChange('biography', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Creative Specialties */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
            Creative Specialties List
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.creativeSpecialties.map(spec => (
              <span
                key={spec}
                className="px-3 py-1 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] flex items-center gap-2 font-mono"
              >
                <span>{spec}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialty(spec)}
                  className="text-[#9EA5A8] hover:text-rose-400 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={e => setNewSpecialty(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
              placeholder="Add specialty (e.g. Cartoon Scene Development)..."
              className="flex-1 px-3.5 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
            <button
              type="button"
              onClick={handleAddSpecialty}
              className="px-3 py-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] border border-[rgba(237,231,220,0.15)] cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* 2. Portal Hero Content */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          2. Cinematic Portal Hero Content
        </h4>

        {/* Featured Hero Artwork Preview & Direct Uploader */}
        <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)] flex flex-col sm:flex-row items-center gap-4">
          <div className="w-28 h-16 rounded-xl overflow-hidden bg-black/60 border border-[rgba(237,231,220,0.2)] shrink-0">
            <img
              src={profile.heroFeaturedImage || "/src/assets/images/hero_animation_still_1792408023752.jpg"}
              alt="Hero Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#9EA5A8]">
                Featured Hero Animation Background
              </label>
              <FileUploadButton
                label="Upload & Replace Hero Artwork"
                onUploaded={url => handleProfileChange('heroFeaturedImage', url)}
              />
            </div>
            <input
              type="text"
              value={profile.heroFeaturedImage}
              onChange={e => handleProfileChange('heroFeaturedImage', e.target.value)}
              placeholder="/uploads/... or /src/assets/..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Small Kicker Label
          </label>
          <input
            type="text"
            value={profile.heroSmallLabel}
            onChange={e => handleProfileChange('heroSmallLabel', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Main Statement Headline
          </label>
          <input
            type="text"
            value={profile.heroStatement}
            onChange={e => handleProfileChange('heroStatement', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Hero Supporting Prose
          </label>
          <textarea
            rows={2}
            value={profile.heroSupporting}
            onChange={e => handleProfileChange('heroSupporting', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Primary Button Label
            </label>
            <input
              type="text"
              value={profile.heroPrimaryBtnText}
              onChange={e => handleProfileChange('heroPrimaryBtnText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Secondary Button Label
            </label>
            <input
              type="text"
              value={profile.heroSecondaryBtnText}
              onChange={e => handleProfileChange('heroSecondaryBtnText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>
        </div>
      </div>

      {/* 3. Creative Philosophy Statement Section */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          3. Statement Section
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Section Label
            </label>
            <input
              type="text"
              value={profile.statementLabel}
              onChange={e => handleProfileChange('statementLabel', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
              Index Numeral
            </label>
            <input
              type="text"
              value={profile.statementNumeral}
              onChange={e => handleProfileChange('statementNumeral', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Full Statement
          </label>
          <textarea
            rows={2}
            value={profile.statementText}
            onChange={e => handleProfileChange('statementText', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] resize-none"
          />
        </div>

        {/* Statement Circular Artwork Preview & Direct Uploader */}
        <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)] flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black/60 border border-[rgba(237,231,220,0.2)] shrink-0">
            <img
              src={profile.statementImage || profile.avatarUrl || "/src/assets/images/artist_avatar_portrait_1792408025842.jpg"}
              alt="Statement Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#9EA5A8]">
                Statement Circular Drifting Artwork
              </label>
              <FileUploadButton
                label="Upload & Replace Statement Art"
                onUploaded={url => handleProfileChange('statementImage', url)}
              />
            </div>
            <input
              type="text"
              value={profile.statementImage}
              onChange={e => handleProfileChange('statementImage', e.target.value)}
              placeholder="/uploads/... or /src/assets/..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Phrase to Highlight in Amber Accent
          </label>
          <input
            type="text"
            value={profile.statementHighlight}
            onChange={e => handleProfileChange('statementHighlight', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
          />
        </div>
      </div>

      {/* 4. Production Software List */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          4. Software Tools List ({software.length})
        </h4>

        <div className="space-y-3">
          {software.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.1)]"
            >
              <div>
                <span className="text-xs font-bold text-[#EDE7DC]">{item.name}</span>
                <span className="text-[11px] font-mono text-[#9EA5A8] ml-3">({item.category})</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSoftware(item.id)}
                className="p-1 text-[#9EA5A8] hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSoftwareName}
            onChange={e => setNewSoftwareName(e.target.value)}
            placeholder="Software Name (e.g. Adobe After Effects)..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
          />
          <input
            type="text"
            value={newSoftwareCategory}
            onChange={e => setNewSoftwareCategory(e.target.value)}
            placeholder="Discipline / Role..."
            className="w-52 px-3.5 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
          />
          <button
            type="button"
            onClick={handleAddSoftware}
            className="px-4 py-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] border border-[rgba(237,231,220,0.15)] cursor-pointer"
          >
            Add Software
          </button>
        </div>
      </div>

      {/* 5. Services Definitions */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          5. Professional Services ({services.length})
        </h4>

        <div className="space-y-4">
          {services.map(service => (
            <div
              key={service.id}
              className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)] space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={service.title}
                  onChange={e => handleServiceChange(service.id, 'title', e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs font-bold text-[#EDE7DC]"
                />
                <label className="flex items-center gap-2 text-xs font-mono text-[#9EA5A8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={service.enabled}
                    onChange={e => handleServiceChange(service.id, 'enabled', e.target.checked)}
                    className="w-4 h-4 rounded text-[#E8913C] focus:ring-0 bg-[#0A0C0E]"
                  />
                  <span>Active</span>
                </label>
              </div>

              <textarea
                rows={2}
                value={service.description}
                onChange={e => handleServiceChange(service.id, 'description', e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. SEO & Meta Settings */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          6. SEO & Social Metadata
        </h4>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            HTML Page Title
          </label>
          <input
            type="text"
            value={profile.seoTitle}
            onChange={e => handleProfileChange('seoTitle', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1.5">
            Meta Description (Search Engines & Social Cards)
          </label>
          <textarea
            rows={2}
            value={profile.seoDescription}
            onChange={e => handleProfileChange('seoDescription', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] resize-none"
          />
        </div>
      </div>

    </div>
  );
};
