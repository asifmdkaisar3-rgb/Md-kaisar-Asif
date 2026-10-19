import React, { useState } from 'react';
import { Image as ImageIcon, Upload, FolderOpen, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { MediaPickerModal } from './MediaPickerModal';

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: 'square' | 'video' | 'wide' | 'avatar';
  helpText?: string;
  placeholder?: string;
  required?: boolean;
}

export const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  value,
  onChange,
  aspect = 'video',
  helpText,
  placeholder = '/uploads/... or /src/assets/images/...',
  required = false
}) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const asset = await api.uploadMedia(file, file.name);
      onChange(asset.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Direct upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const getAspectClass = () => {
    switch (aspect) {
      case 'square':
        return 'aspect-square w-20';
      case 'avatar':
        return 'aspect-square w-20 rounded-full';
      case 'wide':
        return 'aspect-[21/9] w-32';
      case 'video':
      default:
        return 'aspect-video w-28';
    }
  };

  return (
    <div className="space-y-2.5 p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)]">
      {/* Label and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#9EA5A8] flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-[#E8913C]">*</span>}
        </label>

        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <label className="px-3 py-1.5 rounded-lg bg-[#0A0C0E] hover:bg-[#E8913C] text-[#EDE7DC] hover:text-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer">
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8913C]" />
                <span>Uploading...</span>
              </>
            ) : uploadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uploaded!</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#E8913C]" />
                <span>Upload From PC</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,video/mp4"
              onChange={handleDirectUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {/* Library Picker Button */}
          <button
            type="button"
            onClick={() => setIsLibraryOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#0A0C0E] hover:bg-white/10 text-xs font-mono text-[#E8913C] border border-[rgba(237,231,220,0.15)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Browse Library</span>
          </button>
        </div>
      </div>

      {helpText && (
        <p className="text-[11px] text-[#6C7378] leading-tight">
          {helpText}
        </p>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 font-mono">
          {error}
        </p>
      )}

      {/* Visual Preview & URL Input Field */}
      <div className="flex items-center gap-3">
        {value ? (
          <div className={`relative shrink-0 overflow-hidden bg-black/60 border border-[rgba(237,231,220,0.2)] ${getAspectClass()}`}>
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-0.5 rounded bg-black/80 hover:bg-rose-600 text-white transition-colors"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className={`shrink-0 flex items-center justify-center bg-[#0A0C0E] border border-dashed border-[rgba(237,231,220,0.15)] text-[#6C7378] ${getAspectClass()}`}>
            <ImageIcon className="w-5 h-5 opacity-40" />
          </div>
        )}

        <div className="flex-1 relative">
          <input
            type="text"
            required={required}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-xs text-[#EDE7DC] font-mono"
          />
        </div>
      </div>

      {/* Modal Media Library */}
      <MediaPickerModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={url => onChange(url)}
        title={`Select Image for ${label}`}
      />
    </div>
  );
};
