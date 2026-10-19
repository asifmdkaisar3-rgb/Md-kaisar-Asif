import React, { useState } from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, FolderPlus, Save, X } from 'lucide-react';
import { Category, Project } from '../../types';
import { api } from '../../api/client';
import { ConfirmDialog } from './ConfirmDialog';

interface CategoriesManagerProps {
  categories: Category[];
  projects: Project[];
  onRefresh: () => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  projects,
  onRefresh
}) => {
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [visible, setVisible] = useState(true);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleStartCreate = () => {
    setEditingCategory({});
    setName('');
    setSlug('');
    setDescription('');
    setVisible(true);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setVisible(cat.visible);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory?.id) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      await api.saveCategory({
        id: editingCategory?.id,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        visible
      });
      setStatus({ type: 'success', message: 'Category saved successfully.' });
      setEditingCategory(null);
      onRefresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to save category.' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteCategory(deleteTarget.id);
      setStatus({ type: 'success', message: `Category "${deleteTarget.name}" deleted.` });
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete category.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div>
          <h3 className="font-display text-base font-bold text-[#EDE7DC]">
            Portfolio Categories Manager
          </h3>
          <p className="text-xs text-[#9EA5A8]">
            Organize animation, characters, backgrounds, and custom artistic disciplines.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
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

      {/* Editing Form Modal / Inline */}
      {editingCategory && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl bg-[#0A0C0E] border border-[#E8913C]/50 space-y-4 shadow-2xl animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(237,231,220,0.08)]">
            <h4 className="font-display text-sm font-bold text-[#EDE7DC]">
              {editingCategory.id ? 'Edit Category' : 'Create New Category'}
            </h4>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="text-[#9EA5A8] hover:text-[#EDE7DC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. 2D Cartoon Animation"
                className="w-full px-3.5 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="2d-cartoon-animation"
                className="w-full px-3.5 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of works in this category..."
              className="w-full px-3.5 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[#EDE7DC] cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={e => setVisible(e.target.checked)}
                className="w-4 h-4 rounded text-[#E8913C] bg-[#101317]"
              />
              <span>Visible in Public Filter Bar</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-3.5 py-1.5 text-xs font-mono text-[#9EA5A8] hover:text-[#EDE7DC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-1.5 rounded-lg bg-[#E8913C] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider hover:bg-[#f39c4a]"
              >
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] overflow-hidden shadow-xl">
        <div className="divide-y divide-[rgba(237,231,220,0.06)]">
          {categories.map((cat, idx) => {
            const projectCount = projects.filter(p => p.category === cat.slug).length;
            return (
              <div
                key={cat.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-xs text-[#6C7378] w-6">
                    0{idx + 1}.
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#EDE7DC]">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#2E6B72] px-2 py-0.5 rounded bg-[#101317]">
                        /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-[#9EA5A8] truncate mt-0.5 max-w-md">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono text-[#9EA5A8]">
                    {projectCount} project{projectCount === 1 ? '' : 's'}
                  </span>

                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 rounded text-[#9EA5A8] hover:text-[#E8913C] hover:bg-white/5 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 rounded text-[#9EA5A8] hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any projects currently in this category will be preserved and reassigned to other creative work.`}
        confirmLabel="Yes, Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
