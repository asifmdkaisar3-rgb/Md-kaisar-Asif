import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#101317] border border-[rgba(237,231,220,0.18)] rounded-2xl p-6 shadow-2xl shadow-black space-y-4">
        
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <h4 className="font-display text-base font-bold text-[#EDE7DC]">
              {title}
            </h4>
            <p className="text-xs text-[#9EA5A8] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[rgba(237,231,220,0.08)] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-[#0A0C0E] hover:bg-white/5 text-[#9EA5A8] hover:text-[#EDE7DC] text-xs font-mono transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30'
                : 'bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};
