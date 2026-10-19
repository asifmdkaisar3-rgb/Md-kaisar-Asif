import React, { useState } from 'react';
import { X, Plus, Trash2, Image, Video, Check, Layers, AlertCircle } from 'lucide-react';
import { Project, Category, MediaAsset } from '../../types';
import { api } from '../../api/client';
import { FileUploadButton } from './FileUploadButton';

interface ProjectEditModalProps {
  project: Partial<Project> | null;
  categories: Category[];
  mediaList: MediaAsset[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  project,
  categories,
  mediaList,
  isOpen,
  onClose,
  onSaved
}) => {
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [category, setCategory] = useState(project?.category || (categories[0]?.slug || '2d-animation'));
  const [shortDescription, setShortDescription] = useState(project?.shortDescription || '');
  const [detailedDescription, setDetailedDescription] = useState(project?.detailedDescription || '');
  const [coverImage, setCoverImage] = useState(project?.coverImage || '');
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl || '');
  const [softwareUsed, setSoftwareUsed] = useState<string[]>(project?.softwareUsed || ['Adobe Animate CC']);
  const [softwareInput, setSoftwareInput] = useState('');
  const [productionNotes, setProductionNotes] = useState(project?.productionNotes || '');
  const [projectDate, setProjectDate] = useState(project?.projectDate || new Date().getFullYear().toString());
  const [role, setRole] = useState(project?.role || '2D Animator');
  const [isFeatured, setIsFeatured] = useState(project?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState(project?.isPublished ?? true);
  const [isDemoPlaceholder, setIsDemoPlaceholder] = useState(project?.isDemoPlaceholder ?? false);
  const [galleryImages, setGalleryImages] = useState<{ url: string; alt?: string; caption?: string }[]>(
    project?.galleryImages || []
  );

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  const [showMediaPickerFor, setShowMediaPickerFor] = useState<'cover' | 'gallery' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!project?.id) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleAddSoftware = () => {
    if (softwareInput.trim() && !softwareUsed.includes(softwareInput.trim())) {
      setSoftwareUsed([...softwareUsed, softwareInput.trim()]);
      setSoftwareInput('');
    }
  };

  const handleRemoveSoftware = (name: string) => {
    setSoftwareUsed(softwareUsed.filter(s => s !== name));
  };

  const handleAddGalleryItem = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryImages([
      ...galleryImages,
      { url: newGalleryUrl.trim(), caption: newGalleryCaption.trim() || undefined }
    ]);
    setNewGalleryUrl('');
    setNewGalleryCaption('');
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!coverImage.trim()) {
      setError('Please provide a cover image URL or select from media.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await api.saveProject({
        id: project?.id,
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim(),
        coverImage: coverImage.trim(),
        videoUrl: videoUrl.trim() || undefined,
        softwareUsed,
        productionNotes: productionNotes.trim() || undefined,
        projectDate: projectDate.trim() || undefined,
        role: role.trim() || undefined,
        isFeatured,
        isPublished,
        isDemoPlaceholder,
        galleryImages
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#101317] border border-[rgba(237,231,220,0.15)] rounded-2xl shadow-2xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-[#0A0C0E] border-b border-[rgba(237,231,220,0.1)] flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-[#EDE7DC]">
            {project?.id ? 'Edit Animation Project' : 'Create New Project'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9EA5A8] hover:text-[#EDE7DC] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-6 mb-0 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Luna Character Turnaround"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="luna-character-turnaround"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
              />
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
                Role / Contribution
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Lead Character Designer"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
                Production Year
              </label>
              <input
                type="text"
                value={projectDate}
                onChange={e => setProjectDate(e.target.value)}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9EA5A8]">
                Cover Image *
              </label>
              <div className="flex items-center gap-2">
                <FileUploadButton
                  label="Upload from Computer"
                  onUploaded={url => setCoverImage(url)}
                />
                <button
                  type="button"
                  onClick={() => setShowMediaPickerFor(showMediaPickerFor === 'cover' ? null : 'cover')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-[11px] font-mono text-[#E8913C] hover:bg-white/5 cursor-pointer"
                >
                  {showMediaPickerFor === 'cover' ? 'Close Media' : 'Library'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {coverImage && (
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <input
                type="text"
                required
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="/src/assets/images/... or /uploads/..."
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
              />
            </div>

            {/* Inline Media Picker */}
            {showMediaPickerFor === 'cover' && (
              <div className="mt-3 p-3 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {mediaList.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setCoverImage(m.url);
                      setShowMediaPickerFor(null);
                    }}
                    className="aspect-video w-full rounded overflow-hidden border border-white/10 hover:border-[#E8913C] transition-all cursor-pointer"
                  >
                    <img src={m.url} alt={m.filename} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Video URL (YouTube, Vimeo, or /uploads/video.mp4)
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or /uploads/animation.mp4"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
            />
          </div>

          {/* Short & Detailed Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Short Description (Card Teaser)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              placeholder="1-2 sentences summarizing this animation or artwork..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Detailed Description & Case Study
            </label>
            <textarea
              rows={4}
              value={detailedDescription}
              onChange={e => setDetailedDescription(e.target.value)}
              placeholder="Full production breakdown, character backstory, environmental lighting approach, rigging methodology..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC] resize-none"
            />
          </div>

          {/* Software Used Tags */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Software Tools
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {softwareUsed.map(s => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] flex items-center gap-1.5 font-mono"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSoftware(s)}
                    className="text-[#9EA5A8] hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={softwareInput}
                onChange={e => setSoftwareInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSoftware())}
                placeholder="Add software (e.g. Adobe Animate CC, Photoshop)..."
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
              />
              <button
                type="button"
                onClick={handleAddSoftware}
                className="px-3 py-2 rounded-lg bg-[#0A0C0E] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] border border-[rgba(237,231,220,0.15)]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Production Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Production Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={productionNotes}
              onChange={e => setProductionNotes(e.target.value)}
              placeholder="Technical specs, frame rates (24fps), vector reuse guidelines..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC] resize-none"
            />
          </div>

          {/* Gallery Images List */}
          <div className="space-y-3 pt-2 border-t border-[rgba(237,231,220,0.1)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#9EA5A8]">
                Additional Gallery Images ({galleryImages.length})
              </label>
              <FileUploadButton
                label="Upload Image to Gallery"
                onUploaded={url => setGalleryImages(prev => [...prev, { url }])}
              />
            </div>

            {galleryImages.map((img, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
                <img src={img.url} alt="" className="w-12 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[#EDE7DC] truncate">{img.url}</div>
                  {img.caption && <div className="text-[10px] text-[#9EA5A8] truncate">{img.caption}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryItem(i)}
                  className="p-1 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={e => setNewGalleryUrl(e.target.value)}
                placeholder="Image URL..."
                className="flex-1 px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
              />
              <input
                type="text"
                value={newGalleryCaption}
                onChange={e => setNewGalleryCaption(e.target.value)}
                placeholder="Caption (optional)..."
                className="w-48 px-3.5 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
              />
              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="px-3 py-2 rounded-lg bg-[#0A0C0E] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] border border-[rgba(237,231,220,0.15)] cursor-pointer"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Visibility and Featured Toggles */}
          <div className="pt-4 border-t border-[rgba(237,231,220,0.1)] flex flex-wrap items-center gap-6 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#E8913C] focus:ring-0 bg-[#0A0C0E] border-[rgba(237,231,220,0.2)]"
              />
              <span className="text-[#EDE7DC]">Published (Visible on site)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#E8913C] focus:ring-0 bg-[#0A0C0E] border-[rgba(237,231,220,0.2)]"
              />
              <span className="text-[#EDE7DC]">Featured (Show in Throwable Deck)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDemoPlaceholder}
                onChange={e => setIsDemoPlaceholder(e.target.checked)}
                className="w-4 h-4 rounded text-[#E8913C] focus:ring-0 bg-[#0A0C0E] border-[rgba(237,231,220,0.2)]"
              />
              <span className="text-[#9EA5A8]">Tagged as Replaceable Demo</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="sticky bottom-0 pt-4 bg-[#101317] border-t border-[rgba(237,231,220,0.1)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-[#9EA5A8] hover:text-[#EDE7DC] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
