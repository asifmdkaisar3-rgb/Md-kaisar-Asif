import React, { useState } from 'react';
import { Palette, CheckCircle2, AlertCircle, RotateCcw, Save } from 'lucide-react';
import { AppearanceSettings } from '../../types';
import { api } from '../../api/client';
import { ConfirmDialog } from './ConfirmDialog';

interface AppearanceEditorProps {
  initialAppearance: AppearanceSettings;
  onRefresh: () => void;
}

export const AppearanceEditor: React.FC<AppearanceEditorProps> = ({
  initialAppearance,
  onRefresh
}) => {
  const [appearance, setAppearance] = useState<AppearanceSettings>(initialAppearance);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleColorChange = (field: keyof AppearanceSettings, value: string) => {
    setAppearance(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleSection = (sectionKey: keyof AppearanceSettings['sectionVisibility']) => {
    setAppearance(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [sectionKey]: !prev.sectionVisibility[sectionKey]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.updateAppearance(appearance);
      setStatus({ type: 'success', message: 'Appearance settings updated successfully.' });
      onRefresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to update appearance.' });
    } finally {
      setSaving(false);
    }
  };

  const confirmReset = async () => {
    setIsResetConfirmOpen(false);
    setSaving(true);
    setStatus(null);
    try {
      const reset = await api.resetAppearance();
      setAppearance(reset);
      setStatus({ type: 'success', message: 'Appearance reset to default design tokens.' });
      onRefresh();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to reset appearance.' });
    } finally {
      setSaving(false);
    }
  };

  const sectionsList: { key: keyof AppearanceSettings['sectionVisibility']; label: string; desc: string }[] = [
    { key: 'portalHero', label: 'Cinematic Portal Hero', desc: 'Sticky viewport opening curtains and split wordmark' },
    { key: 'statement', label: 'Creative Statement', desc: 'Editorial philosophy quote with circular artwork drift' },
    { key: 'featuredDeck', label: 'Throwable Card Deck', desc: 'Physics-informed interactive card stack' },
    { key: 'portfolioGallery', label: 'Portfolio Gallery', desc: 'Filterable work showcase with category tabs' },
    { key: 'characterGallery', label: 'Character Design Studio', desc: 'Turnarounds, model sheets, and expression charts' },
    { key: 'backgroundGallery', label: '2D Background Environments', desc: 'Panoramic Bengali village and environment paintings' },
    { key: 'storyboards', label: 'Storyboards & Sequential Art', desc: 'Camera staging and pre-production sheets' },
    { key: 'about', label: 'About the Artist', desc: 'Biography, Twenty One Academy credentials, and software stack' },
    { key: 'services', label: 'Professional Services', desc: 'Offerings overview and commission inquiries' },
    { key: 'artistIndex', label: 'Chronological Index', desc: 'Hairline-ruled table of all production assets' },
    { key: 'contact', label: 'Contact & Inquiry Form', desc: 'Client project submission and direct channels' }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)]">
        <div>
          <h3 className="font-display text-base font-bold text-[#EDE7DC]">
            Appearance & Visual Theme Customizer
          </h3>
          <p className="text-xs text-[#9EA5A8]">
            Refine palette accents, hero height, and toggle public section visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#101317] hover:bg-white/10 text-[#9EA5A8] hover:text-[#EDE7DC] border border-[rgba(237,231,220,0.15)] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#E8913C]/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Apply Theme'}</span>
          </button>
        </div>
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

      {/* 1. Palette Color Tokens */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          1. Color Palette Tokens
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Primary Bg */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
              Primary Background
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.primaryBg}
                onChange={e => handleColorChange('primaryBg', e.target.value)}
                className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-[#EDE7DC]">{appearance.primaryBg}</span>
            </div>
          </div>

          {/* Secondary Bg */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
              Secondary Background
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.secondaryBg}
                onChange={e => handleColorChange('secondaryBg', e.target.value)}
                className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-[#EDE7DC]">{appearance.secondaryBg}</span>
            </div>
          </div>

          {/* Primary Text */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
              Primary Typography
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.primaryText}
                onChange={e => handleColorChange('primaryText', e.target.value)}
                className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-[#EDE7DC]">{appearance.primaryText}</span>
            </div>
          </div>

          {/* Amber Accent */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
              Amber Accent (Focal CTAs)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.amberAccent}
                onChange={e => handleColorChange('amberAccent', e.target.value)}
                className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-[#E8913C]">{appearance.amberAccent}</span>
            </div>
          </div>

          {/* Teal Accent */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
              Teal Accent (Atmosphere)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.tealAccent}
                onChange={e => handleColorChange('tealAccent', e.target.value)}
                className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-[#2E6B72]">{appearance.tealAccent}</span>
            </div>
          </div>

          {/* Hero Height */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EA5A8] mb-2">
              Portal Hero Height
            </label>
            <select
              value={appearance.heroHeight}
              onChange={e => handleColorChange('heroHeight', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#101317] border border-[rgba(237,231,220,0.15)] text-xs text-[#EDE7DC]"
            >
              <option value="200vh">200vh (Faster Reveal)</option>
              <option value="250vh">250vh (Standard Studio Pace)</option>
              <option value="300vh">300vh (Ultra Cinematic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Public Section Visibility Controls */}
      <div className="p-6 rounded-2xl bg-[#0A0C0E] border border-[rgba(237,231,220,0.1)] space-y-6">
        <h4 className="font-display text-lg font-bold text-[#EDE7DC] pb-3 border-b border-[rgba(237,231,220,0.08)]">
          2. Section Visibility Controls
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sectionsList.map(sec => {
            const isVisible = appearance.sectionVisibility[sec.key];
            return (
              <div
                key={sec.key}
                onClick={() => handleToggleSection(sec.key)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isVisible
                    ? 'bg-[#101317] border-[rgba(237,231,220,0.2)]'
                    : 'bg-[#0A0C0E]/50 border-white/5 opacity-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#EDE7DC]">{sec.label}</div>
                  <div className="text-[10px] text-[#9EA5A8] leading-tight mt-0.5">{sec.desc}</div>
                </div>

                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    isVisible ? 'bg-[#E8913C]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-[#0A0C0E] transition-transform ${
                      isVisible ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Design Tokens"
        message="Are you sure you want to reset all theme colors, fonts, corner radius, and section visibility toggles back to the default studio values?"
        confirmLabel="Yes, Reset Defaults"
        isDestructive={false}
        onConfirm={confirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
