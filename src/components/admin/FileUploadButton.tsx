import React, { useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

interface FileUploadButtonProps {
  label?: string;
  accept?: string;
  onUploaded: (url: string) => void;
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  label = 'Upload Image from Computer',
  accept = 'image/*,video/mp4,video/webm',
  onUploaded,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      const asset = await api.uploadMedia(file, file.name);
      onUploaded(asset.url);
      setMessage('Uploaded!');
      setTimeout(() => setMessage(null), 2500);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="px-3 py-1.5 rounded-lg bg-[#101317] hover:bg-[#E8913C] text-[#EDE7DC] hover:text-[#0A0C0E] border border-[rgba(237,231,220,0.15)] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E8913C]" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5 text-[#E8913C]" />
            <span>{label}</span>
          </>
        )}
      </button>

      {message && (
        <span
          className={`text-[11px] font-mono ${
            message.startsWith('Error') ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {message}
        </span>
      )}
    </div>
  );
};
