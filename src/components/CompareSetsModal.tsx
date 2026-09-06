import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, Download, ChevronDown } from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface CompareSetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePaper: QuestionPaper | null;
  allPapers: QuestionPaper[];
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  isDark: boolean;
}

export const CompareSetsModal: React.FC<CompareSetsModalProps> = ({
  isOpen,
  onClose,
  basePaper,
  allPapers,
  onViewPaper,
  onDownloadPaper,
  isDark,
}) => {
  const [compareTargetId, setCompareTargetId] = useState<string>('');

  if (!isOpen || !basePaper) return null;

  const relatedSets = allPapers.filter(
    (p) =>
      p.subjectCode === basePaper.subjectCode &&
      p.session === basePaper.session &&
      p.id !== basePaper.id
  );

  const targetPaper = allPapers.find((p) => p.id === compareTargetId) || relatedSets[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-5xl rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto border ${
            isDark ? 'liquid-glass-panel text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-xl transition-all cursor-pointer ${
              isDark ? 'liquid-glass-btn-subtle text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <span className={`p-2 rounded-xl border ${isDark ? 'bg-cyan-500/15 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              Parallel Exam Set Comparison
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-black mb-2 font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Compare Sets: {basePaper.subject} ({basePaper.subjectCode})
          </h2>
          <p className={`text-xs mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Compare questions, topics covered, and difficulty between parallel sets (Set A, Set B, Set C, Set D).
          </p>

          {/* Target Set Selector */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl border ${
              isDark ? 'liquid-glass-pill border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Comparing Base Set <strong>({basePaper.set})</strong> against:
              </span>
              {relatedSets.length > 0 ? (
                <div className="relative">
                  <select
                    value={targetPaper?.id || ''}
                    onChange={(e) => setCompareTargetId(e.target.value)}
                    className={`text-xs font-bold rounded-xl px-4 py-2 pr-8 focus:outline-none appearance-none cursor-pointer border ${
                      isDark
                        ? 'liquid-glass-input text-cyan-300'
                        : 'bg-white border-slate-300 text-cyan-700'
                    }`}
                  >
                    {relatedSets.map((rp) => (
                      <option key={rp.id} value={rp.id} className={isDark ? 'bg-zinc-950 text-white' : ''}>
                        {rp.set} ({rp.examDate})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
                </div>
              ) : (
                <span className={`text-xs font-mono ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  No other sets uploaded yet
                </span>
              )}
            </div>

            <div className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Session: {basePaper.session}
            </div>
          </div>

          {/* Side-by-Side Set Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Base Set */}
            <div
              className={`rounded-3xl p-6 relative border shadow-sm transition-all ${
                isDark
                  ? 'liquid-glass-card border-amber-400/30'
                  : 'bg-amber-50/40 border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 bg-amber-500 text-black font-mono font-bold text-xs uppercase rounded-xl shadow-sm">
                  {basePaper.set}
                </span>
                <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {basePaper.examDate}
                </span>
              </div>

              <h3 className={`font-bold text-base mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {basePaper.fileName}
              </h3>
              <div className={`text-xs font-mono mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {basePaper.maxMarks} Marks • {basePaper.duration} • {basePaper.pageCount} Pages
              </div>

              {/* Thumbnail or Question Breakdown */}
              {basePaper.fileData && basePaper.fileData.startsWith('data:image/') ? (
                <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black max-h-48 flex justify-center">
                  <img
                    src={basePaper.fileData}
                    alt={basePaper.fileName}
                    className="max-h-48 object-contain"
                  />
                </div>
              ) : (
                <div className={`space-y-3 pt-4 border-t mb-6 ${isDark ? 'border-white/10' : 'border-amber-200'}`}>
                  <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    Questions Breakdown:
                  </div>
                  {basePaper.questions.map((q, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border text-xs ${
                        isDark
                          ? 'liquid-glass-input text-zinc-200 border-white/5'
                          : 'bg-white border-amber-200 text-slate-700'
                      }`}
                    >
                      <span className="font-mono text-amber-400 font-bold mr-2">{q.qNum}</span>
                      <span className="leading-relaxed font-sans">{q.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onViewPaper(basePaper)}
                  className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isDark ? 'liquid-glass-btn' : 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
                  }`}
                >
                  Open {basePaper.set} Reader
                </button>
                <button
                  onClick={() => onDownloadPaper(basePaper)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Target Compared Set */}
            {targetPaper ? (
              <div
                className={`rounded-3xl p-6 relative border shadow-sm transition-all ${
                  isDark
                    ? 'liquid-glass-card border-cyan-400/30'
                    : 'bg-cyan-50/40 border-cyan-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 bg-cyan-500 text-black font-mono font-bold text-xs uppercase rounded-xl shadow-sm">
                    {targetPaper.set}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {targetPaper.examDate}
                  </span>
                </div>

                <h3 className={`font-bold text-base mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {targetPaper.fileName}
                </h3>
                <div className={`text-xs font-mono mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {targetPaper.maxMarks} Marks • {targetPaper.duration} • {targetPaper.pageCount} Pages
                </div>

                {targetPaper.fileData && targetPaper.fileData.startsWith('data:image/') ? (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black max-h-48 flex justify-center">
                    <img
                      src={targetPaper.fileData}
                      alt={targetPaper.fileName}
                      className="max-h-48 object-contain"
                    />
                  </div>
                ) : (
                  <div className={`space-y-3 pt-4 border-t mb-6 ${isDark ? 'border-white/10' : 'border-cyan-200'}`}>
                    <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Questions Breakdown:
                    </div>
                    {targetPaper.questions.map((q, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-2xl border text-xs ${
                          isDark
                            ? 'liquid-glass-input text-zinc-200 border-white/5'
                            : 'bg-white border-cyan-200 text-slate-700'
                        }`}
                      >
                        <span className="font-mono text-cyan-400 font-bold mr-2">{q.qNum}</span>
                        <span className="leading-relaxed font-sans">{q.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onViewPaper(targetPaper)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Open {targetPaper.set} Reader
                  </button>
                  <button
                    onClick={() => onDownloadPaper(targetPaper)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center ${
                  isDark ? 'liquid-glass-card border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className={`text-xs mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  No other parallel set available for this exam session yet.
                </p>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  Upload Set B, C, or D to enable side-by-side comparison!
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
