import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Cloud,
  CheckCircle2,
  Copy,
  Users,
} from 'lucide-react';
import { CloudSync } from '../services/cloudSync';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
  isDark: boolean;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
  isDark,
}) => {
  const currentConfig = CloudSync.getConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [classId, setClassId] = useState(currentConfig.classId || 'default-class');
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isConnected = CloudSync.isConfigured();

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = CloudSync.saveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      classId: classId.trim(),
    });

    if (success) {
      setStatusMessage('Cloud connection configured successfully!');
      onConfigSaved();
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    } else {
      setStatusMessage('Cloud sync disabled. Using local storage.');
      onConfigSaved();
      setTimeout(() => setStatusMessage(null), 1200);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(CloudSync.getSQLSchema());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const handleCopyInvite = () => {
    const inviteText = `🎓 Join our Class Question Paper Vault!\nAccess and upload Set A, B, C, D daily question papers:\n${window.location.origin}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto border ${
            isDark ? 'liquid-glass-panel text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'liquid-glass-btn-subtle text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-gradient-to-tr from-zinc-900 via-black to-zinc-800 text-white rounded-xl shadow-md border border-white/20">
              <Cloud className="w-4 h-4 text-indigo-400" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-bold">
              Class-Wide Cloud Synchronization
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-black mb-1 font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Connect Class Cloud Vault
          </h2>
          <p className={`text-xs mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Connect a shared cloud database so when students in Set A, B, C, or D upload their papers, they appear instantly for all classmates.
          </p>

          {/* Connection Status Banner */}
          <div
            className={`p-4 rounded-2xl border mb-6 flex items-center justify-between ${
              isConnected
                ? isDark
                  ? 'liquid-glass-card border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isDark
                ? 'liquid-glass-card border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>
                {isConnected
                  ? 'Cloud Sync Active: All classmates share the same live database'
                  : 'Local Storage Only: Papers saved locally in your browser'}
              </span>
            </div>

            <button
              onClick={handleCopyInvite}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark
                  ? 'bg-zinc-950 border-zinc-700 text-zinc-200 hover:text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{copiedInvite ? 'Invite Copied!' : 'Invite Class'}</span>
            </button>
          </div>

          {/* Setup Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Supabase Public Anon Key
              </label>
              <input
                type="text"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors ${
                  isDark
                    ? 'liquid-glass-input text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Class / Batch Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. CSE-2026-Section-A"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors ${
                  isDark
                    ? 'liquid-glass-input text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            {/* Quick 30-second Setup Box */}
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 mt-4 ${
                isDark ? 'liquid-glass-card border-white/10 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="font-display text-sm">30-Second Free Setup for Your Class:</strong>
                <button
                  type="button"
                  onClick={handleCopySQL}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    isDark
                      ? 'liquid-glass-btn-subtle text-indigo-300 hover:text-white'
                      : 'bg-white border-slate-300 text-indigo-700 hover:bg-slate-100'
                  }`}
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSQL ? 'SQL Copied!' : 'Copy SQL Table Script'}</span>
                </button>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Create a free account on <strong>Supabase.com</strong> and click "New Project".</li>
                <li>Click <strong>SQL Editor</strong> in Supabase, click <strong>"Copy SQL Table Script"</strong> above, paste &amp; run.</li>
                <li>Copy the <strong>Project URL &amp; Anon Key</strong> from Supabase Project Settings and paste them above!</li>
              </ol>
            </div>

            {statusMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div
              className={`pt-4 flex items-center justify-end gap-3 border-t ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                  isDark
                    ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-6 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  isDark ? 'liquid-glass-btn' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md'
                }`}
              >
                <Cloud className="w-4 h-4" />
                <span>Save &amp; Connect Vault</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
