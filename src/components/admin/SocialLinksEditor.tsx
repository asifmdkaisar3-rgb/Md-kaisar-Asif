import React, { useState } from 'react';
import { Share2, Plus, Trash2, Save, CheckCircle2, AlertCircle, MessageCircle, ExternalLink } from 'lucide-react';
import { SocialLink } from '../../types';
import { api } from '../../api/client';

interface SocialLinksEditorProps {
  initialLinks: SocialLink[];
  onRefresh: () => void;
}

export const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({
  initialLinks,
  onRefresh
}) => {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newPlatform, setNewPlatform] = useState('YouTube');
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const platforms = [
    'WhatsApp',
    'Email',
    'YouTube',
    'Behance',
    'LinkedIn',
    'ArtStation',
    'Instagram',
    'X (Twitter)',
    'Facebook',
    'TikTok',
    'Vimeo',
    'Pinterest',
    'Apple Music / iTunes',
    'Personal Website',
    'Custom'
  ];

  const handleUpdate = (id: string, field: keyof SocialLink, value: any) => {
    setLinks(links.map(l => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleRemove = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const isWa = newPlatform === 'WhatsApp';
    const newLink: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: newPlatform,
      label: newLabel.trim(),
      url: isWa ? '' : newUrl.trim(),
      phone: isWa ? newUrl.trim() : undefined,
      prefill: isWa ? "Hi Shoyen, I'd like to collaborate on a 2D animation project!" : undefined,
      showInNav: false,
      showInFooter: true,
      showInContact: true,
      enabled: true,
      order: links.length + 1
    };
    setLinks([...links, newLink]);
    setNewLabel('');
    setNewUrl('');
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.updateSocialLinks(links);
      setStatus({ type: 'success', message: 'Social channels and contact links successfully saved.' });
      onRefresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to save social links.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div>
          <h3 className="font-display text-base font-bold text-[#EDE7DC]">
            Social Profiles & Direct Contact Manager
          </h3>
          <p className="text-xs text-[#9EA5A8]">
            Configure WhatsApp international direct messaging, verified portfolio channels, and placement.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Channels'}</span>
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

      {/* Existing Social Profiles */}
      <div className="space-y-4">
        {links.map(link => {
          const isWhatsApp = link.platform === 'WhatsApp';
          return (
            <div
              key={link.id}
              className="p-5 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(237,231,220,0.06)]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs font-bold text-[#E8913C] font-mono">
                    {link.platform}
                  </span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => handleUpdate(link.id, 'label', e.target.value)}
                    placeholder="Display Label"
                    className="px-3 py-1.5 rounded bg-[#101317] border border-[rgba(237,231,220,0.1)] text-xs font-semibold text-[#EDE7DC]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-mono text-[#9EA5A8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.enabled}
                      onChange={e => handleUpdate(link.id, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-[#E8913C] focus:ring-0 bg-[#101317]"
                    />
                    <span>Active</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemove(link.id)}
                    className="p-1.5 text-[#9EA5A8] hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* URL or WhatsApp fields */}
              {isWhatsApp ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">
                      WhatsApp International Number (e.g. +8801700000000)
                    </label>
                    <input
                      type="text"
                      value={link.phone || ''}
                      onChange={e => handleUpdate(link.id, 'phone', e.target.value)}
                      placeholder="+8801700000000"
                      className="w-full px-3 py-2 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">
                      Prefilled Message
                    </label>
                    <input
                      type="text"
                      value={link.prefill || ''}
                      onChange={e => handleUpdate(link.id, 'prefill', e.target.value)}
                      placeholder="Hi Shoyen, I'd like to collaborate..."
                      className="w-full px-3 py-2 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">
                    Profile / Channel URL
                  </label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={e => handleUpdate(link.id, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
                  />
                </div>
              )}

              {/* Placement checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono text-[#9EA5A8]">
                <span>Show in:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.showInNav}
                    onChange={e => handleUpdate(link.id, 'showInNav', e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#E8913C] bg-[#101317]"
                  />
                  <span>Navigation</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.showInContact}
                    onChange={e => handleUpdate(link.id, 'showInContact', e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#E8913C] bg-[#101317]"
                  />
                  <span>Contact Section</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.showInFooter}
                    onChange={e => handleUpdate(link.id, 'showInFooter', e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#E8913C] bg-[#101317]"
                  />
                  <span>Footer</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Channel Card */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-widest text-[#E8913C] font-semibold">
          Add New Professional Channel
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">Platform</label>
            <select
              value={newPlatform}
              onChange={e => setNewPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            >
              {platforms.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">Display Label</label>
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="e.g. YouTube Showreel"
              className="w-full px-3 py-2 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9EA5A8] mb-1">
              {newPlatform === 'WhatsApp' ? 'Phone (+country code)' : 'URL'}
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              placeholder={newPlatform === 'WhatsApp' ? '+880...' : 'https://...'}
              className="w-full px-3 py-2 rounded bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-[#101317] hover:bg-white/10 text-xs font-mono text-[#EDE7DC] border border-[rgba(237,231,220,0.15)] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E8913C]" />
          <span>Add Channel</span>
        </button>
      </div>

    </div>
  );
};
