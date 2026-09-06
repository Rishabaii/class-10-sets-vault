import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Download, Eye, CheckCircle2, User, BookOpen, ImageIcon } from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface PaperCardProps {
  paper: QuestionPaper;
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  isDark: boolean;
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  onViewPaper,
  onDownloadPaper,
  isDark,
}) => {
  const getSetStyling = (set: string) => {
    switch (set) {
      case 'Set A':
        return {
          badge: 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm',
          accent: 'from-amber-500 to-amber-400',
        };
      case 'Set B':
        return {
          badge: 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-sm',
          accent: 'from-cyan-500 to-cyan-400',
        };
      case 'Set C':
        return {
          badge: 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-sm',
          accent: 'from-emerald-500 to-emerald-400',
        };
      case 'Set D':
        return {
          badge: 'bg-zinc-900 text-zinc-100 border-zinc-700 font-bold shadow-sm',
          accent: 'from-zinc-800 to-zinc-900',
        };
      default:
        return {
          badge: 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-sm',
          accent: 'from-indigo-600 to-indigo-500',
        };
    }
  };

  const setStyle = getSetStyling(paper.set);

  const formattedDate = new Date(paper.examDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hasImage = paper.fileType === 'image' || (paper.images && paper.images.length > 0);

  return (
    <motion.div
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
      {/* Top Set Accent Ribbon */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${setStyle.accent}`} />

      <div>
        {/* Badges Row: SET BADGE + SUBJECT CODE + SESSION */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-mono uppercase border ${setStyle.badge}`}
            >
              {paper.customLabel || paper.set}
            </span>

            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                isDark
                  ? 'liquid-glass-pill text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}
            >
              {paper.subjectCode}
            </span>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isDark
                ? 'liquid-glass-pill text-zinc-300'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {paper.session}
          </span>
        </div>

        {/* Subject Title */}
        <h3
          onClick={() => onViewPaper(paper)}
          className={`text-lg sm:text-xl font-bold transition-colors cursor-pointer mb-1.5 leading-snug font-display ${
            isDark
              ? 'text-white hover:text-indigo-300'
              : 'text-slate-900 hover:text-indigo-600'
          }`}
        >
          {paper.subject}
        </h3>

        {/* Department Name */}
        <div
          className={`flex items-center gap-1.5 text-xs font-sans mb-4 ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span className="truncate">{paper.department}</span>
        </div>

        {/* Examination Metadata Grid */}
        <div
          className={`grid grid-cols-2 gap-2.5 rounded-2xl p-3.5 text-xs font-mono mb-4 border ${
            isDark
              ? 'liquid-glass-input text-zinc-200 border-white/5'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>{paper.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{paper.maxMarks} Marks ({paper.pageCount}p)</span>
          </div>
          <div className="flex items-center gap-2">
            {hasImage ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{paper.fileSize}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{paper.fileSize}</span>
              </span>
            )}
          </div>
        </div>

        {/* Answer Key Badge & Contributor */}
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
              className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border ${
                isDark
                  ? 'text-zinc-400 liquid-glass-pill'
                  : 'text-slate-400 bg-slate-100 border-slate-200'
              }`}
            >
              Questions Only
            </span>
          )}

          <div
            className={`flex items-center gap-1.5 text-[11px] truncate max-w-[150px] ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
            title={`Uploaded by: ${paper.uploadedBy}`}
          >
            <User className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            <span className="truncate">{paper.uploadedBy.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Clean 2-Button Action Row */}
      <div
        className={`pt-3.5 border-t flex items-center gap-2 ${
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
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            isDark
              ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
