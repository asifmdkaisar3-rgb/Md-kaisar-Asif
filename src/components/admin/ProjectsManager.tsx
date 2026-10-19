import React, { useState } from 'react';
import { Plus, Edit3, Copy, Trash2, ArrowUp, ArrowDown, Star, CheckCircle, Eye, EyeOff, Search } from 'lucide-react';
import { Project, Category, MediaAsset } from '../../types';
import { api } from '../../api/client';
import { ProjectEditModal } from './ProjectEditModal';
import { ConfirmDialog } from './ConfirmDialog';

interface ProjectsManagerProps {
  projects: Project[];
  categories: Category[];
  mediaList: MediaAsset[];
  onRefresh: () => void;
  onPreviewProject: (project: Project) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  categories,
  mediaList,
  onRefresh,
  onPreviewProject
}) => {
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingProject({
      category: categories[0]?.slug || '2d-animation',
      softwareUsed: ['Adobe Animate CC'],
      isPublished: true,
      isFeatured: false,
      galleryImages: []
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicateProject(id);
      showToast('Project duplicated successfully.');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to duplicate project.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteProject(deleteTarget.id);
      showToast(`Deleted "${deleteTarget.title}".`);
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project.');
    }
  };

  const handleTogglePublished = async (project: Project) => {
    try {
      await api.saveProject({
        ...project,
        isPublished: !project.isPublished
      });
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await api.saveProject({
        ...project,
        isFeatured: !project.isFeatured
      });
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update featured flag.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const orderedIds = copy.map(p => p.id);
    try {
      await api.reorderProjects(orderedIds);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder projects.');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9EA5A8]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] placeholder-[#6C7378] focus:border-[#E8913C] focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] focus:border-[#E8913C] focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Table / List */}
      <div className="rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#101317] text-[#9EA5A8] border-b border-[rgba(237,231,220,0.08)] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Artwork</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(237,231,220,0.06)] text-[#EDE7DC]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#9EA5A8]">
                    No projects found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Reorder arrows */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(idx, 'up')}
                          className="text-[#9EA5A8] hover:text-[#E8913C] disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === filteredProjects.length - 1}
                          onClick={() => handleMoveOrder(idx, 'down')}
                          className="text-[#9EA5A8] hover:text-[#E8913C] disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-16 h-10 rounded overflow-hidden bg-black/60 border border-white/10 shrink-0">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm text-[#EDE7DC] truncate max-w-xs">
                        {project.title}
                      </div>
                      <div className="text-[10px] text-[#6C7378] truncate max-w-xs">
                        /{project.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#101317] border border-[rgba(237,231,220,0.1)] text-[#2E6B72] text-[10px] uppercase">
                        {project.category}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          project.isFeatured ? 'text-[#E8913C]' : 'text-[#6C7378] hover:text-[#EDE7DC]'
                        }`}
                        title="Toggle Featured in Throwable Deck"
                      >
                        <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublished(project)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                          project.isPublished
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {project.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onPreviewProject(project)}
                          className="p-1.5 rounded text-[#9EA5A8] hover:text-[#EDE7DC] hover:bg-white/5 transition-colors cursor-pointer"
                          title="Preview Project"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1.5 rounded text-[#9EA5A8] hover:text-[#E8913C] hover:bg-white/5 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(project.id)}
                          className="p-1.5 rounded text-[#9EA5A8] hover:text-[#2E6B72] hover:bg-white/5 transition-colors cursor-pointer"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
                          className="p-1.5 rounded text-[#9EA5A8] hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This artwork project and its case study will be removed from your portfolio.`}
        confirmLabel="Yes, Delete Project"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Edit Modal */}
      <ProjectEditModal
        isOpen={isModalOpen}
        project={editingProject}
        categories={categories}
        mediaList={mediaList}
        onClose={() => setIsModalOpen(false)}
        onSaved={onRefresh}
      />
    </div>
  );
};
