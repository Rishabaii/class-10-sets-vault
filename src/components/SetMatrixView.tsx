import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Calendar, Plus, Eye, Download, CheckCircle2, BookOpen, ImageIcon, FileText } from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface SetMatrixViewProps {
  papers: QuestionPaper[];
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  onUploadForExam: (subject: string, code: string, session: string, date: string, set: string) => void;
  isDark: boolean;
}

export const SetMatrixView: React.FC<SetMatrixViewProps> = ({
  papers,
  onViewPaper,
  onDownloadPaper,
  onUploadForExam,
  isDark,
}) => {
  // Filter only standard set papers (Set A, B, C, D)
  const standardPapers = papers.filter((p) =>
    ['Set A', 'Set B', 'Set C', 'Set D'].includes(p.set)
  );

  // Group papers by unique exam: subjectCode + session + examDate
  const examGroups = standardPapers.reduce((groups, paper) => {
    const key = `${paper.subjectCode}_${paper.session}_${paper.examDate}`;
    if (!groups[key]) {
      groups[key] = {
        subject: paper.subject,
        subjectCode: paper.subjectCode,
        department: paper.department,
        session: paper.session,
        examDate: paper.examDate,
        semester: paper.semester,
        sets: {} as Record<string, QuestionPaper>,
      };
    }
    groups[key].sets[paper.set] = paper;
    return groups;
  }, {} as Record<string, {
    subject: string;
    subjectCode: string;
    department: string;
    session: string;
    examDate: string;
    semester: string;
    sets: Record<string, QuestionPaper>;
  }>);

  // Exactly 4 sets: Set A, Set B, Set C, Set D
  const standardSets = ['Set A', 'Set B', 'Set C', 'Set D'];

  const getSetBadgeColor = (setName: string) => {
    switch (setName) {
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

  if (standardPapers.length === 0) {
    return (
      <div
        className={`border rounded-3xl p-12 text-center max-w-lg mx-auto my-12 shadow-sm ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
            isDark
              ? 'bg-zinc-900 text-indigo-400 border-zinc-800'
              : 'bg-indigo-50 text-indigo-600 border-indigo-100'
          }`}
        >
          <Layers className="w-7 h-7" />
        </div>
        <h3
          className={`text-lg font-bold mb-1.5 font-display ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          No Standard Sets (A–D) Uploaded Yet
        </h3>
        <p
          className={`text-xs mb-6 leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}
        >
          Upload question papers assigned to Set A, Set B, Set C, or Set D to view parallel comparisons across exam sessions.
        </p>
        <button
          onClick={() => onUploadForExam('', '', 'End-Term (Finals)', '', 'Set A')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload First Exam Paper</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner Explainer */}
      <div
        className={`p-5 rounded-2xl border flex items-start gap-4 transition-colors ${
          isDark
            ? 'bg-zinc-900/60 border-zinc-800'
            : 'bg-indigo-50/70 border-indigo-200/80'
        }`}
      >
        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm flex-shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <strong
            className={`text-sm font-bold block mb-1 font-display ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Parallel 4-Set Examination Matrix (Set A, Set B, Set C, Set D)
          </strong>
          <span
            className={`leading-relaxed font-sans ${
              isDark ? 'text-zinc-300' : 'text-slate-600'
            }`}
          >
            Papers from the same exam session are grouped side-by-side across all 4 sets: <strong>Set A, Set B, Set C, and Set D</strong>.
          </span>
        </div>
      </div>

      {Object.entries(examGroups).map(([groupKey, group]) => {
        return (
          <div
            key={groupKey}
            className={`p-6 sm:p-7 rounded-2xl border relative overflow-hidden transition-all shadow-sm ${
              isDark
                ? 'bg-zinc-900/80 border-zinc-800'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Top Exam Header */}
            <div
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b ${
                isDark ? 'border-zinc-800' : 'border-slate-100'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`font-mono text-xs font-bold rounded-lg px-2.5 py-1 border ${
                      isDark
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}
                  >
                    {group.subjectCode}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {group.session} • {group.semester}
                  </span>
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold font-display ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {group.subject}
                </h3>
                <div
                  className={`flex items-center gap-1.5 text-xs font-sans mt-1 ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{group.department}</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-xl border ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Exam Date: {group.examDate}</span>
              </div>
            </div>

            {/* Parallel Sets Grid: Exactly Set A, Set B, Set C, Set D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {standardSets.map((setName) => {
                const paper = group.sets[setName];

                if (paper) {
                  return (
                    <motion.div
                      key={setName}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-xl p-5 flex flex-col justify-between transition-all relative overflow-hidden border ${
                        isDark
                          ? 'bg-zinc-950/90 border-zinc-800 hover:border-indigo-500/70 shadow-md shadow-black/20'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-400 shadow-sm'
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-mono uppercase border ${getSetBadgeColor(
                              setName
                            )}`}
                          >
                            {setName}
                          </span>
                          <span
                            className={`text-[11px] font-mono ${
                              isDark ? 'text-zinc-400' : 'text-slate-500'
                            }`}
                          >
                            {paper.fileType === 'image' || (paper.images && paper.images.length > 0) ? (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <ImageIcon className="w-3 h-3" />
                                <span>Image</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>PDF</span>
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="text-xs font-mono mb-3 space-y-1">
                          <div
                            className={`truncate font-bold text-sm ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {paper.fileName}
                          </div>
                          <div
                            className={`text-[11px] ${
                              isDark ? 'text-zinc-400' : 'text-slate-500'
                            }`}
                          >
                            {paper.duration} • {paper.maxMarks} Marks
                          </div>
                        </div>

                        {paper.hasSolution ? (
                          <div
                            className={`flex items-center gap-1.5 text-[11px] font-bold mb-4 px-2 py-1 rounded-lg border ${
                              isDark
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Verified Answer Key</span>
                          </div>
                        ) : (
                          <div
                            className={`text-[11px] mb-4 font-mono ${
                              isDark ? 'text-zinc-500' : 'text-slate-400'
                            }`}
                          >
                            Questions Only
                          </div>
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-2 pt-3 border-t ${
                          isDark ? 'border-zinc-800' : 'border-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => onViewPaper(paper)}
                          className="flex-1 py-2 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onDownloadPaper(paper)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                // Missing Set Slot
                return (
                  <div
                    key={setName}
                    className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition-colors min-h-[180px] ${
                      isDark
                        ? 'bg-zinc-950/40 border-zinc-800 hover:border-indigo-500/50'
                        : 'bg-white border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <div
                      className={`text-xs font-mono font-bold mb-1 ${
                        isDark ? 'text-zinc-500' : 'text-slate-400'
                      }`}
                    >
                      {setName} (Missing)
                    </div>
                    <p
                      className={`text-[11px] mb-4 font-sans max-w-[180px] ${
                        isDark ? 'text-zinc-500' : 'text-slate-500'
                      }`}
                    >
                      Not yet uploaded for this exam session.
                    </p>
                    <button
                      onClick={() =>
                        onUploadForExam(
                          group.subject,
                          group.subjectCode,
                          group.session,
                          group.examDate,
                          setName
                        )
                      }
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isDark
                          ? 'bg-zinc-900 hover:bg-indigo-600 text-zinc-300 hover:text-white border-zinc-800'
                          : 'bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white border-slate-200'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload {setName}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
