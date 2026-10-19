import React, { useState } from 'react';
import { Mail, Check, Archive, Trash2, Clock, MailOpen, User, Reply, AlertCircle } from 'lucide-react';
import { Inquiry } from '../../types';
import { api } from '../../api/client';
import { ConfirmDialog } from './ConfirmDialog';

interface InquiriesManagerProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export const InquiriesManager: React.FC<InquiriesManagerProps> = ({
  inquiries,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: 'unread' | 'read' | 'archived') => {
    try {
      await api.updateInquiryStatus(id, status);
      onRefresh();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update status.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteInquiry(deleteTarget.id);
      if (selectedInquiry?.id === deleteTarget.id) setSelectedInquiry(null);
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete inquiry.');
      setDeleteTarget(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div>
          <h3 className="font-display text-base font-bold text-[#EDE7DC]">
            Client Project Inquiries ({inquiries.length})
          </h3>
          <p className="text-xs text-[#9EA5A8]">
            {unreadCount} unread client submission{unreadCount === 1 ? '' : 's'} recorded in the studio database.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101317] border border-[rgba(237,231,220,0.1)] rounded-lg">
          {(['all', 'unread', 'read', 'archived'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-[#E8913C] text-[#0A0C0E] font-bold shadow-sm'
                  : 'text-[#9EA5A8] hover:text-[#EDE7DC]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Inquiries List */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] text-xs text-[#9EA5A8]">
              No inquiries found in this view.
            </div>
          ) : (
            filteredInquiries.map(item => {
              const isSelected = selectedInquiry?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedInquiry(item);
                    if (item.status === 'unread') {
                      handleStatusChange(item.id, 'read');
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? 'bg-[#101317] border-[#E8913C]'
                      : item.status === 'unread'
                      ? 'bg-[#0A0C0E] border-[rgba(237,231,220,0.25)] shadow-md shadow-black/50'
                      : 'bg-[#0A0C0E]/60 border-[rgba(237,231,220,0.08)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#EDE7DC] truncate">
                      {item.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                        item.status === 'unread'
                          ? 'bg-amber-950/60 text-[#E8913C] border border-[#E8913C]/30'
                          : item.status === 'read'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#2E6B72] truncate">
                    {item.projectType}
                  </div>

                  <p className="text-xs text-[#9EA5A8] line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="text-[10px] font-mono text-[#6C7378] pt-1 border-t border-[rgba(237,231,220,0.06)] flex justify-between items-center">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>{item.budget || 'Custom budget'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Inquiry Detail View */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.12)] space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(237,231,220,0.08)]">
                <div>
                  <h4 className="font-display text-xl font-bold text-[#EDE7DC]">
                    {selectedInquiry.name}
                  </h4>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs font-mono text-[#E8913C] hover:underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2">
                  {selectedInquiry.status === 'unread' ? (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, 'read')}
                      className="p-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] flex items-center gap-1 cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, 'unread')}
                      className="p-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#9EA5A8] flex items-center gap-1 cursor-pointer"
                      title="Mark as Unread"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'archived')}
                    className="p-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#9EA5A8] hover:text-[#EDE7DC] cursor-pointer"
                    title="Archive"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(selectedInquiry)}
                    className="p-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#9EA5A8] hover:text-rose-400 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inquiry Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.06)]">
                  <span className="text-[#9EA5A8] block text-[10px] uppercase">Service Type</span>
                  <span className="text-[#EDE7DC] font-semibold">{selectedInquiry.projectType}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.06)]">
                  <span className="text-[#9EA5A8] block text-[10px] uppercase">Budget Range</span>
                  <span className="text-[#EDE7DC] font-semibold">{selectedInquiry.budget || 'Not specified'}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.06)] col-span-2 sm:col-span-1">
                  <span className="text-[#9EA5A8] block text-[10px] uppercase">Received At</span>
                  <span className="text-[#EDE7DC] font-semibold">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Project Scope Body */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#9EA5A8] block">
                  Creative Scope & Brief
                </span>
                <div className="p-4 rounded-xl bg-[#101317] border border-[rgba(237,231,220,0.1)] text-xs sm:text-sm text-[#EDE7DC] whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Direct Reply Email Button */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your 2D Animation Inquiry: ${encodeURIComponent(selectedInquiry.projectType)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E8913C]/20"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email ({selectedInquiry.email})</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] text-xs text-[#9EA5A8] space-y-2">
              <Mail className="w-8 h-8 mx-auto text-[#6C7378]" />
              <p>Select an inquiry from the left to view the complete client brief and respond.</p>
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Inquiry"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.name}" (${deleteTarget?.email})?`}
        confirmLabel="Yes, Delete Inquiry"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
