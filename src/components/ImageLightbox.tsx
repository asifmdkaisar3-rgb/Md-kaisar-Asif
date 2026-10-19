import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  caption?: string;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageUrl,
  title,
  caption,
  onClose
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between text-[#EDE7DC] pointer-events-none">
        <div className="pointer-events-auto">
          <h4 className="font-display text-sm sm:text-base font-bold truncate max-w-md">
            {title}
          </h4>
          {caption && (
            <p className="text-xs text-[#9EA5A8] font-mono truncate max-w-lg">
              {caption}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="pointer-events-auto p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#EDE7DC] transition-colors cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div
        className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center p-2"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-mono text-[#9EA5A8] pointer-events-none">
        Press [ESC] or tap outside to close
      </div>
    </div>
  );
};
