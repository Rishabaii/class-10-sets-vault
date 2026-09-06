import React from 'react';
import { Calendar, Eye, Download, CheckCircle2, ImageIcon, FileText } from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface PaperTableProps {
  papers: QuestionPaper[];
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  isDark: boolean;
}

export const PaperTable: React.FC<PaperTableProps> = ({
  papers,
  onViewPaper,
  onDownloadPaper,
  isDark,
}) => {
  const getSetBadge = (set: string) => {
    switch (set) {
      case 'Set A':
        return 'bg-amber-500 text-black border-amber-400 font-bold';
      case 'Set B':
        return 'bg-cyan-500 text-black border-cyan-400 font-bold';
      case 'Set C':
        return 'bg-emerald-500 text-black border-emerald-400 font-bold';
      case 'Set D':
        return 'bg-zinc-900 text-zinc-100 border-zinc-700 font-bold';
      default:
        return 'bg-indigo-600 text-white border-indigo-500 font-bold';
    }
  };

  return (
    <div
      className={`w-full overflow-x-auto rounded-2xl border shadow-sm transition-colors ${
        isDark
          ? 'bg-zinc-900/80 border-zinc-800'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <table className="w-full text-left text-xs font-sans">
        <thead
          className={`font-mono uppercase tracking-wider border-b ${
            isDark
              ? 'bg-zinc-950/90 text-zinc-400 border-zinc-800'
              : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          <tr>
            <th className="py-4 px-5 font-bold">Set / Type</th>
            <th className="py-4 px-5 font-bold">Subject &amp; Code</th>
            <th className="py-4 px-5 font-bold">Exam Date</th>
            <th className="py-4 px-5 font-bold">Session</th>
            <th className="py-4 px-5 font-bold">Department</th>
            <th className="py-4 px-5 font-bold">Format</th>
            <th className="py-4 px-5 font-bold text-center">Solution</th>
            <th className="py-4 px-5 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody
          className={`divide-y ${
            isDark
              ? 'divide-zinc-800 text-zinc-200'
              : 'divide-slate-200 text-slate-800'
          }`}
        >
          {papers.map((paper) => (
            <tr
              key={paper.id}
              onClick={() => onViewPaper(paper)}
              className={`transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-zinc-800/60'
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* SET BADGE */}
              <td className="py-4 px-5 whitespace-nowrap">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-mono uppercase border ${getSetBadge(
                    paper.set
                  )}`}
                >
                  {paper.customLabel || paper.set}
                </span>
              </td>

              {/* SUBJECT & CODE */}
              <td className="py-4 px-5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
                      isDark
                        ? 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    {paper.subjectCode}
                  </span>
                  <span
                    className={`font-bold text-sm transition-colors ${
                      isDark
                        ? 'text-white hover:text-indigo-300'
                        : 'text-slate-900 hover:text-indigo-600'
                    }`}
                  >
                    {paper.subject}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-sans block mt-0.5 ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}
                >
                  {paper.fileName} ({paper.fileSize})
                </span>
              </td>

              {/* EXAM DATE */}
              <td
                className={`py-4 px-5 whitespace-nowrap font-mono ${
                  isDark ? 'text-zinc-300' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{paper.examDate}</span>
                </div>
              </td>

              {/* SESSION */}
              <td className="py-4 px-5 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {paper.session}
                </span>
              </td>

              {/* DEPARTMENT */}
              <td
                className={`py-4 px-5 max-w-xs truncate font-sans ${
                  isDark ? 'text-zinc-300' : 'text-slate-600'
                }`}
              >
                {paper.department}
              </td>

              {/* FORMAT */}
              <td
                className={`py-4 px-5 whitespace-nowrap font-mono ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                {paper.fileType === 'image' || (paper.images && paper.images.length > 0) ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </span>
                )}
              </td>

              {/* SOLUTION */}
              <td className="py-4 px-5 text-center whitespace-nowrap">
                {paper.hasSolution ? (
                  <span
                    className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg text-[11px] border ${
                      isDark
                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                        : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Included</span>
                  </span>
                ) : (
                  <span
                    className={`text-[11px] font-mono ${
                      isDark ? 'text-zinc-600' : 'text-slate-400'
                    }`}
                  >
                    —
                  </span>
                )}
              </td>

              {/* ACTIONS */}
              <td className="py-4 px-5 text-right whitespace-nowrap">
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onViewPaper(paper)}
                    title="Read Paper"
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDownloadPaper(paper)}
                    title="Download"
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
