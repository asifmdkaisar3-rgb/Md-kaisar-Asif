import React, { useState } from 'react';
import { KeyRound, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api, setAdminToken } from '../../api/client';

interface AdminSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminSetup: React.FC<AdminSetupProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.setupAdminPassword(password);
      if (res.token) {
        setAdminToken(res.token);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101317] border border-[rgba(237,231,220,0.15)] rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#0A0C0E] border border-[#2E6B72] text-[#E8913C] flex items-center justify-center mx-auto shadow-lg shadow-[#2E6B72]/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[#EDE7DC]">
            Initial Studio CMS Setup
          </h3>
          <p className="text-xs text-[#9EA5A8]">
            Welcome Shoyen Kaiser Asif! Set your master administrator password to initialize your portfolio CMS dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Create Admin Password (min. 6 chars)
            </label>
            <input
              type="password"
              autoFocus
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create strong password"
              className="w-full px-4 py-3 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#9EA5A8] mb-1.5">
              Confirm Admin Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 rounded-lg bg-[#0A0C0E] border border-[rgba(237,231,220,0.15)] focus:border-[#E8913C] focus:outline-none text-[#EDE7DC] text-sm transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-lg bg-transparent hover:bg-white/5 text-[#9EA5A8] hover:text-[#EDE7DC] text-xs font-mono transition-colors cursor-pointer"
            >
              Back to Site
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-lg bg-[#E8913C] hover:bg-[#f39c4a] text-[#0A0C0E] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#E8913C]/20 disabled:opacity-50"
            >
              <span>{loading ? 'Initializing...' : 'Complete Setup'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
