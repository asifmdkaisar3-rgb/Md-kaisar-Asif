import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Video, Check, Upload, RefreshCw } from 'lucide-react';
import { MediaAsset } from '../../types';
import { api } from '../../api/client';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset'
}) => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const list = await api.getMedia();
      setMedia(list);
    } catch (err) {
      console.error('Failed to fetch media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    try {
      let lastUploadedUrl = '';
      for (let i = 0; i < files.length; i++) {
        const asset = await api.uploadMedia(files[i], files[i].name);
        lastUploadedUrl = asset.url;
      }
      await fetchMedia();
      if (files.length === 1 && lastUploadedUrl) {
        onSelect(lastUploadedUrl);
        onClose();
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const filtered = media.filter(m =>
    m.filename.toLowerCase().includes(search.toLowerCase()) ||
    (m.originalName && m.originalName.toLowerCase().includes(search.toLowerCase())) ||
    (m.altText && m.altText.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#101317] border border-[rgba(237,231,220,0.2)] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A0C0E] border-b border-[rgba(237,231,220,0.1)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#E8913C]" />
            <h3 className="font-display text-base font-bold text-[#EDE7DC]">
              {title}
            </h3>
            <span className="text-xs font-mono text-[#9EA5A8] ml-2">
              ({media.length} items in library)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9EA5A8] hover:text-[#EDE7DC] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div className="p-4 bg-[#101317] border-b border-[rgba(237,231,220,0.08)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9EA5A8]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search images by name or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC] placeholder-[#6C7378] focus:border-[#E8913C] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMedia}
              disabled={loading}
              className="p-2 rounded-lg bg-[#0A0C0E] text-[#9EA5A8] hover:text-[#EDE7DC] border border-[rgba(237,231,220,0.1)] cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E8913C]' : ''}`} />
            </button>

            <label className="px-4 py-2 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#E8913C]/20 shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Upload From PC'}</span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="px-6 py-2 bg-rose-950/40 border-b border-rose-500/20 text-rose-300 text-xs">
            {uploadError}
          </div>
        )}

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#9EA5A8] space-y-3">
              <ImageIcon className="w-8 h-8 mx-auto text-[#6C7378]" />
              <p>No media files found matching your query.</p>
              <p className="text-[11px] text-[#6C7378]">Upload new artwork from your computer using the button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map(asset => {
                const isVideo = asset.mimeType?.startsWith('video/') || asset.url.endsWith('.mp4');
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      onSelect(asset.url);
                      onClose();
                    }}
                    className="group relative rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] hover:border-[#E8913C] p-2 transition-all flex flex-col text-left cursor-pointer overflow-hidden"
                  >
                    <div className="relative aspect-video w-full rounded-lg bg-black/60 overflow-hidden mb-2">
                      {isVideo ? (
                        <video src={asset.url} className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute inset-0 bg-[#E8913C]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-[#0A0C0E]/90 text-[11px] font-bold text-[#E8913C]">
                          Use Image
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-[#EDE7DC] truncate w-full" title={asset.originalName || asset.filename}>
                      {asset.originalName || asset.filename}
                    </div>
                    <div className="text-[10px] font-mono text-[#6C7378]">
                      {(asset.size / 1024).toFixed(0)} KB
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0A0C0E] border-t border-[rgba(237,231,220,0.1)] flex items-center justify-between text-xs font-mono text-[#9EA5A8] shrink-0">
          <span>Click any image to immediately select and apply it.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#101317] hover:bg-white/10 text-[#EDE7DC] cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
