import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  CheckCircle2,
  Bookmark,
  Printer,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface PracticeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  papers: QuestionPaper[];
  initialExamKey?: string;
  isDark: boolean;
}

export const PracticeHubModal: React.FC<PracticeHubModalProps> = ({
  isOpen,
  onClose,
  papers,
  initialExamKey,
  isDark,
}) => {
  const [selectedSetFilter, setSelectedSetFilter] = useState<'All' | 'Set A' | 'Set B' | 'Set C' | 'Set D'>('All');
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, boolean>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Record<string, boolean>>({});

  // Group papers by unique subject code
  const availableSubjects = useMemo(() => {
    const map = new Map<string, { subject: string; subjectCode: string; count: number }>();
    papers.forEach((p) => {
      const existing = map.get(p.subjectCode);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(p.subjectCode, {
          subject: p.subject,
          subjectCode: p.subjectCode,
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [papers]);

  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(() => {
    if (initialExamKey) {
      return initialExamKey.split('_')[0] || '';
    }
    return availableSubjects[0]?.subjectCode || '';
  });

  // Sync when papers or initialExamKey changes
  const activeSubjectCode = selectedSubjectCode || availableSubjects[0]?.subjectCode || '';

  // Papers matching selected subject
  const subjectPapers = useMemo(() => {
    return papers.filter((p) => p.subjectCode === activeSubjectCode);
  }, [papers, activeSubjectCode]);

  // Aggregate questions across Set A, B, C, D
  const allPracticeQuestions = useMemo(() => {
    const list: {
      id: string;
      set: string;
      paperId: string;
      qNum: string;
      section: string;
      text: string;
      marks: number;
      orAlternative?: string;
    }[] = [];

    subjectPapers.forEach((paper) => {
      if (selectedSetFilter === 'All' || paper.set === selectedSetFilter) {
        paper.questions.forEach((q, idx) => {
          list.push({
            id: `${paper.id}_q_${idx}`,
            set: paper.set,
            paperId: paper.id,
            qNum: q.qNum,
            section: q.section,
            text: q.text,
            marks: q.marks,
            orAlternative: q.orAlternative,
          });
        });
      }
    });

    return list;
  }, [subjectPapers, selectedSetFilter]);

  const toggleSolved = (qId: string) => {
    setSolvedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const solvedCount = Object.values(solvedQuestions).filter(Boolean).length;
  const progressPercent = allPracticeQuestions.length > 0
    ? Math.round((solvedCount / allPracticeQuestions.length) * 100)
    : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-5xl h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
            isDark ? 'liquid-glass-panel text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b flex-wrap gap-4 ${
              isDark ? 'liquid-glass-panel border-b border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-gradient-to-tr from-zinc-900 via-black to-zinc-800 text-white rounded-xl shadow-md border border-white/20">
                <Zap className="w-4 h-4 text-amber-300" />
              </span>
              <div>
                <h2 className={`text-xl sm:text-2xl font-black font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Practice All 4 Sets
                </h2>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Consolidated question bank combining Set A, Set B, Set C, and Set D.
                </p>
              </div>
            </div>

            {/* Subject Selector & Actions */}
            <div className="flex items-center gap-3">
              {availableSubjects.length > 0 && (
                <div className="relative">
                  <select
                    value={activeSubjectCode}
                    onChange={(e) => setSelectedSubjectCode(e.target.value)}
                    className={`text-xs font-bold rounded-xl px-4 py-2 pr-8 focus:outline-none appearance-none cursor-pointer border ${
                      isDark
                        ? 'liquid-glass-input text-indigo-300'
                        : 'bg-slate-50 border-slate-300 text-indigo-700'
                    }`}
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub.subjectCode} value={sub.subjectCode} className={isDark ? 'bg-zinc-950 text-white' : ''}>
                        {sub.subjectCode}: {sub.subject}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
                </div>
              )}

              <button
                onClick={() => window.print()}
                title="Print Practice Sheet"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isDark ? 'liquid-glass-btn-subtle text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader: Set Filter Pills & Progress Bar */}
          <div
            className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 text-xs ${
              isDark ? 'liquid-glass-pill border-x-0 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Filter Set:
              </span>
              {(['All', 'Set A', 'Set B', 'Set C', 'Set D'] as const).map((setName) => (
                <button
                  key={setName}
                  onClick={() => setSelectedSetFilter(setName)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                    selectedSetFilter === setName
                      ? isDark ? 'liquid-glass-btn text-white' : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : isDark
                      ? 'liquid-glass-pill text-zinc-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {setName}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {solvedCount} / {allPracticeQuestions.length} Solved ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Practice Questions Content */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 ${isDark ? 'bg-black/60' : 'bg-slate-100'}`}>
            {allPracticeQuestions.length === 0 ? (
              <div
                className={`text-center py-16 max-w-md mx-auto rounded-3xl border p-8 ${
                  isDark ? 'liquid-glass-card' : 'bg-white border-slate-200'
                }`}
              >
                <BookOpen className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <h4 className="font-bold text-base mb-1">No Practice Questions Found</h4>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Upload question papers for this subject to automatically generate practice questions from all 4 sets!
                </p>
              </div>
            ) : (
              allPracticeQuestions.map((q) => {
                const isSolved = !!solvedQuestions[q.id];
                const isBookmarked = !!bookmarkedQuestions[q.id];

                return (
                  <div
                    key={q.id}
                    className={`rounded-3xl p-5 border transition-all ${
                      isSolved
                        ? isDark
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-emerald-50/50 border-emerald-300'
                        : isDark
                        ? 'liquid-glass-card'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${
                            q.set === 'Set A'
                              ? 'bg-amber-500 text-black border-amber-400'
                              : q.set === 'Set B'
                              ? 'bg-cyan-500 text-black border-cyan-400'
                              : q.set === 'Set C'
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : 'bg-zinc-900 text-zinc-100 border-zinc-700'
                          }`}
                        >
                          {q.set}
                        </span>

                        <span className="font-mono font-bold text-xs text-indigo-400">
                          {q.qNum}
                        </span>

                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'}`}>
                          [{q.marks} Marks]
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(q.id)}
                          title="Bookmark for Revision"
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'text-amber-400 bg-amber-500/10'
                              : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          onClick={() => toggleSolved(q.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            isSolved
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : isDark
                              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isSolved ? 'Solved ✓' : 'Mark Solved'}</span>
                        </button>
                      </div>
                    </div>

                    <p className={`text-sm font-serif leading-relaxed mt-2 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                      {q.text}
                    </p>

                    {q.orAlternative && (
                      <div className="mt-3 pt-3 border-t border-dashed border-zinc-700/60">
                        <span className="font-mono text-[11px] font-bold text-zinc-500 block mb-1">
                          — OR ALTERNATIVE CHOICE —
                        </span>
                        <p className={`text-sm font-serif leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          {q.orAlternative}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
