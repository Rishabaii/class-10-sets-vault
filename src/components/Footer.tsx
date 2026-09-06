import React from 'react';
import { BookOpen, ShieldCheck, FileText, CheckCircle2, FilePlus } from 'lucide-react';

interface FooterProps {
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark }) => {
  return (
    <footer
      className={`w-full border-t pt-12 pb-10 px-4 sm:px-6 lg:px-8 font-sans text-xs transition-colors ${
        isDark
          ? 'liquid-canvas border-t border-white/10 text-zinc-400'
          : 'bg-white border-slate-200 text-slate-500'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-900 via-black to-zinc-800 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <span className={`font-extrabold text-base font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Paper<span className="text-indigo-400 font-black">Vault</span>
              </span>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Centralized academic question paper and examination document vault. Upload, organize, and access examination papers with permanent storage.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Persistent browser storage active</span>
            </div>
          </div>

          {/* Supported Sets */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Standard Exam Sets
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <span className={`px-2.5 py-1 rounded-xl border font-bold ${isDark ? 'liquid-glass-pill text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                • Set A
              </span>
              <span className={`px-2.5 py-1 rounded-xl border font-bold ${isDark ? 'liquid-glass-pill text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-800'}`}>
                • Set B
              </span>
              <span className={`px-2.5 py-1 rounded-xl border font-bold ${isDark ? 'liquid-glass-pill text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                • Set C
              </span>
              <span className={`px-2.5 py-1 rounded-xl border font-bold ${isDark ? 'liquid-glass-pill text-zinc-300' : 'bg-zinc-100 border-zinc-300 text-zinc-800'}`}>
                • Set D
              </span>
            </div>
          </div>

          {/* Other Papers Section */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Other Question Papers
            </h4>
            <ul className={`space-y-1.5 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <li>• Model Exam Papers</li>
              <li>• Unit Tests 1 &amp; 2 Papers</li>
              <li>• Supplementary / Backlog Papers</li>
              <li>• Lab &amp; Practical Exam Papers</li>
              <li>• Custom &amp; Class Test Papers</li>
            </ul>
          </div>

          {/* Storage & Privacy */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Features &amp; Storage
            </h4>
            <div className={`space-y-2 text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>IndexedDB Persistent Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Scanned Images &amp; PDF Support</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>In-App High-Res Document Reader</span>
              </div>
              <div className="flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span>One-Click Backup Export / Import</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`pt-5 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono gap-2 ${
            isDark ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'
          }`}
        >
          <div>
            © {new Date().getFullYear()} PAPERVAULT
          </div>
          <div>
            SETS A, B, C, D &amp; OTHER QUESTION PAPERS
          </div>
        </div>
      </div>
    </footer>
  );
};
