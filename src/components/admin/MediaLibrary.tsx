import React, { useState, useRef } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Video, AlertCircle, Search } from 'lucide-react';
import { MediaAsset } from '../../types';
import { api } from '../../api/client';
import { ConfirmDialog } from './ConfirmDialog';

interface MediaLibraryProps {
  mediaList: MediaAsset[];
  onRefresh: () => void;
  onSelectUrl?: (url: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaList,
  onRefresh,
  onSelectUrl
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      for (let i = 0; i < files.length; i++) {
        await api.uploadMedia(files[i], files[i].name);
      }
      setSuccessMsg(`Successfully uploaded ${files.length} file(s).`);
      setTimeout(() => setSuccessMsg(null), 3000);
      onRefresh();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload media file.');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteMedia(deleteTarget.id);
      setSuccessMsg(`Deleted "${deleteTarget.originalName || deleteTarget.filename}".`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Cannot delete media asset.');
      setDeleteTarget(null);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter(m =>
    m.filename.toLowerCase().includes(search.toLowerCase()) ||
    (m.altText && m.altText.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9EA5A8]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] placeholder-[#6C7378] focus:border-[#E8913C] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] text-xs text-[#9EA5A8]">
          No media files found. Upload an animation keyframe, turnaround, or background file.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map(asset => {
            const isVideo = asset.mimeType?.startsWith('video/') || asset.url.endsWith('.mp4');
            return (
              <div
                key={asset.id}
                className="group relative rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] overflow-hidden hover:border-[#E8913C]/40 transition-all flex flex-col justify-between"
              >
                {/* Media preview */}
                <div className="relative aspect-video w-full bg-black/60 overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={asset.url}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.altText || asset.filename}
                      className="w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="absolute top-2 left-2 p-1 rounded bg-[#0A0C0E]/80 backdrop-blur-md text-[#9EA5A8]">
                    {isVideo ? <Video className="w-3 h-3 text-[#E8913C]" /> : <ImageIcon className="w-3 h-3" />}
                  </div>

                  {onSelectUrl && (
                    <button
                      onClick={() => onSelectUrl(asset.url)}
                      className="absolute inset-0 bg-[#E8913C]/80 text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Select Asset
                    </button>
                  )}
                </div>

                {/* Info & Actions */}
                <div className="p-3 space-y-2">
                  <div className="text-[11px] font-mono text-[#EDE7DC] truncate" title={asset.filename}>
                    {asset.originalName || asset.filename}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6C7378]">
                    <span>{(asset.size / 1024).toFixed(0)} KB</span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(asset.url, asset.id)}
                        className="p-1 rounded text-[#9EA5A8] hover:text-[#E8913C] transition-colors cursor-pointer"
                        title="Copy Asset Path"
                      >
                        {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setDeleteTarget(asset)}
                        className="p-1 rounded text-[#9EA5A8] hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Asset"
        message={`Are you sure you want to delete "${deleteTarget?.originalName || deleteTarget?.filename}"? Any project or profile section referencing this image will be updated.`}
        confirmLabel="Yes, Delete Asset"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
