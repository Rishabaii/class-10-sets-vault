import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FilePlus,
  Plus,
  Search,
  Calendar,
  Clock,
  Eye,
  Download,
  CheckCircle2,
  FileText,
  ImageIcon,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface OtherPapersSectionProps {
  papers: QuestionPaper[];
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  onOpenUploadOther: () => void;
  isDark: boolean;
}

export const OtherPapersSection: React.FC<OtherPapersSectionProps> = ({
  papers,
  onViewPaper,
  onDownloadPaper,
  onOpenUploadOther,
  isDark,
}) => {
  const [subCategory, setSubCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Filter papers that are 'Other' or non-standard set (or have category === 'other')
  const otherPapers = useMemo(() => {
    return papers.filter(
      (p) =>
        p.category === 'other' ||
        p.set === 'Other' ||
        !['Set A', 'Set B', 'Set C', 'Set D'].includes(p.set)
    );
  }, [papers]);

  const categories = [
    'All',
    'Model Exam',
    'Supplementary',
    'Unit Test 1',
    'Unit Test 2',
    'Lab / Practical',
    'Class Test',
    'Special Exam',
  ];

  const filteredOtherPapers = useMemo(() => {
    return otherPapers.filter((p) => {
      // Sub-category check
      if (subCategory !== 'All') {
        const matchSession = p.session === subCategory;
        const matchLabel = p.customLabel?.toLowerCase().includes(subCategory.toLowerCase());
        if (!matchSession && !matchLabel) {
          return false;
        }
      }
      // Search query check
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchSubject = p.subject.toLowerCase().includes(q);
        const matchCode = p.subjectCode.toLowerCase().includes(q);
        const matchDept = p.department.toLowerCase().includes(q);
        const matchLabel = p.customLabel?.toLowerCase().includes(q);
        const matchSession = p.session.toLowerCase().includes(q);
        if (!matchSubject && !matchCode && !matchDept && !matchLabel && !matchSession) {
          return false;
        }
      }
      return true;
    });
  }, [otherPapers, subCategory, search]);

  const getCategoryBadge = (session: string, customLabel?: string) => {
    const label = customLabel || session;
    if (label.includes('Model')) {
      return isDark
        ? 'bg-zinc-900/90 border-zinc-700/80 text-zinc-200'
        : 'bg-zinc-100 border-zinc-300 text-zinc-800';
    }
    if (label.includes('Supplementary')) {
      return isDark
        ? 'bg-amber-950/70 border-amber-800/80 text-amber-300'
        : 'bg-amber-50 border-amber-200 text-amber-800';
    }
    if (label.includes('Lab') || label.includes('Practical')) {
      return isDark
        ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300'
        : 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
    if (label.includes('Unit')) {
      return isDark
        ? 'bg-cyan-950/70 border-cyan-800/80 text-cyan-300'
        : 'bg-cyan-50 border-cyan-200 text-cyan-700';
    }
    return isDark
      ? 'bg-indigo-950/70 border-indigo-800/80 text-indigo-300'
      : 'bg-indigo-50 border-indigo-200 text-indigo-700';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
          isDark
            ? 'liquid-glass-panel shadow-2xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-gradient-to-tr from-zinc-900 via-black to-zinc-800 text-white rounded-xl shadow-md border border-white/20">
                <FilePlus className="w-4 h-4 text-indigo-400" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-bold">
                Supplemental & Custom Repository
              </span>
            </div>

            <h2
              className={`text-2xl sm:text-3xl font-black font-display tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Other Question Papers
            </h2>
            <p
              className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-slate-600'
              }`}
            >
              Add and access question papers that are outside standard Sets A–D, including{' '}
              <strong>Model Question Papers, Unit Tests, Supplementary Backlog Papers, Lab Practicals, and Custom Class Tests</strong>.
            </p>
          </div>

          <button
            onClick={onOpenUploadOther}
            className={`px-5 py-3 rounded-2xl text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer ${
              isDark ? 'liquid-glass-btn' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Other Question Paper</span>
          </button>
        </div>

        {/* Sub-Filters & Quick Search */}
        <div
          className={`mt-6 pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}
        >
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = subCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSubCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? isDark ? 'liquid-glass-btn text-white font-bold' : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : isDark
                      ? 'liquid-glass-pill text-zinc-400 hover:text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-zinc-400' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              placeholder="Filter other papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full text-xs rounded-xl pl-9 pr-3 py-1.5 border focus:outline-none transition-all ${
                isDark
                  ? 'liquid-glass-input text-white placeholder-zinc-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Cards Grid or Empty State */}
      {filteredOtherPapers.length === 0 ? (
        <div
          className={`rounded-3xl p-12 text-center max-w-lg mx-auto my-8 transition-all ${
            isDark ? 'liquid-glass-panel shadow-2xl' : 'bg-white border border-slate-200 shadow-sm'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
              isDark
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-indigo-50 text-indigo-600 border-indigo-100'
            }`}
          >
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3
            className={`text-lg font-bold mb-1.5 font-display ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {otherPapers.length === 0
              ? 'No Other Question Papers Yet'
              : 'No Papers Match Filter'}
          </h3>
          <p
            className={`text-xs mb-6 leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            {otherPapers.length === 0
              ? 'Upload supplementary exams, unit tests, model questions, or lab practical papers directly.'
              : 'Try selecting "All" or clearing the search box.'}
          </p>
          <button
            onClick={onOpenUploadOther}
            className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 mx-auto cursor-pointer ${
              isDark ? 'liquid-glass-btn' : 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Upload Question Paper</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredOtherPapers.map((paper) => (
              <motion.div
                key={paper.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all relative overflow-hidden border ${
                  isDark
                    ? 'liquid-glass-card'
                    : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Subtle Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-zinc-700" />

                <div>
                  {/* Category Badge & Subject Code */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border uppercase ${getCategoryBadge(
                          paper.session,
                          paper.customLabel
                        )}`}
                      >
                        {paper.customLabel || paper.session}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-xl text-xs font-mono font-bold border ${
                          isDark
                            ? 'liquid-glass-pill text-indigo-300'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        }`}
                      >
                        {paper.subjectCode}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-xl border ${
                        isDark
                          ? 'liquid-glass-pill text-zinc-400'
                          : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {paper.fileType === 'image' || (paper.images && paper.images.length > 0) ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <ImageIcon className="w-3 h-3" />
                          <span>Image / Scan</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span>PDF</span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <h3
                    onClick={() => onViewPaper(paper)}
                    className={`text-base sm:text-lg font-bold transition-colors cursor-pointer mb-1 leading-snug font-display ${
                      isDark
                        ? 'text-white hover:text-indigo-300'
                        : 'text-slate-900 hover:text-indigo-600'
                    }`}
                  >
                    {paper.subject}
                  </h3>

                  {/* Department */}
                  <div
                    className={`text-xs font-sans mb-4 truncate ${
                      isDark ? 'text-zinc-400' : 'text-slate-500'
                    }`}
                  >
                    {paper.department} • {paper.semester}
                  </div>

                  {/* Metadata Row */}
                  <div
                    className={`grid grid-cols-2 gap-2 rounded-2xl p-3 text-xs font-mono mb-4 border ${
                      isDark
                        ? 'liquid-glass-input text-zinc-200 border-white/5'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{paper.examDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{paper.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{paper.maxMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{paper.fileSize}</span>
                    </div>
                  </div>

                  {/* Solution Status */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    {paper.hasSolution ? (
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-xl text-[11px] border ${
                          isDark
                            ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                            : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Answer Key Included</span>
                      </span>
                    ) : (
                      <span
                        className={`text-[11px] font-mono ${
                          isDark ? 'text-zinc-400' : 'text-slate-400'
                        }`}
                      >
                        Questions Only
                      </span>
                    )}

                    <span
                      className={`text-[11px] font-mono ${
                        isDark ? 'text-zinc-400' : 'text-slate-400'
                      }`}
                    >
                      By {paper.uploadedBy.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`pt-3 border-t flex items-center gap-2 ${
                    isDark ? 'border-white/10' : 'border-slate-100'
                  }`}
                >
                  <button
                    onClick={() => onViewPaper(paper)}
                    className={`flex-1 py-2.5 px-3 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isDark ? 'liquid-glass-btn' : 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Paper</span>
                  </button>

                  <button
                    onClick={() => onDownloadPaper(paper)}
                    title="Download Paper"
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
