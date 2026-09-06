import React, { useState } from 'react';
import {
  Calendar,
  Eye,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Share2,
  FileText,
  Filter,
} from 'lucide-react';
import { type QuestionPaper, type PaperSet } from '../types/paper';
import { GRADE_10_SUBJECTS } from '../data/mockPapers';

interface DailySetsBoardProps {
  papers: QuestionPaper[];
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  onUploadForExamSet: (subject: string, examDate: string, set: PaperSet) => void;
  searchQuery: string;
}

export const DailySetsBoard: React.FC<DailySetsBoardProps> = ({
  papers,
  onViewPaper,
  onDownloadPaper,
  onUploadForExamSet,
  searchQuery,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedSet, setSelectedSet] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract unique available exam dates sorted latest first
  const availableDates = React.useMemo(() => {
    const dates = Array.from(new Set(papers.map((p) => p.examDate).filter(Boolean)));
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [papers]);

  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      // ignore
    }
    return dateStr;
  };

  // Group papers by Exam Date + Subject (e.g., "2026-09-02_Mathematics")
  const groupedExams = React.useMemo(() => {
    const groups: {
      [key: string]: {
        examDate: string;
        subject: string;
        papersBySet: { [set in 'Set A' | 'Set B' | 'Set C' | 'Set D']?: QuestionPaper };
      };
    } = {};

    papers.forEach((paper) => {
      // Filter by search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          paper.subject.toLowerCase().includes(q) ||
          paper.subjectCode.toLowerCase().includes(q) ||
          paper.set.toLowerCase().includes(q) ||
          paper.examDate.includes(q);
        if (!matches) return;
      }

      // Filter by subject
      if (selectedSubject !== 'All' && paper.subject !== selectedSubject) {
        return;
      }

      // Filter by date
      if (selectedDate && paper.examDate !== selectedDate) {
        return;
      }

      const key = `${paper.examDate}_${paper.subject}`;
      if (!groups[key]) {
        groups[key] = {
          examDate: paper.examDate,
          subject: paper.subject,
          papersBySet: {},
        };
      }

      if (
        paper.set === 'Set A' ||
        paper.set === 'Set B' ||
        paper.set === 'Set C' ||
        paper.set === 'Set D'
      ) {
        groups[key].papersBySet[paper.set] = paper;
      }
    });

    // If a specific set was selected, prioritize or filter to groups that have that set or are for that exam
    let entries = Object.entries(groups);

    // Sort by exam date descending (latest first)
    return entries.sort(
      ([, a], [, b]) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
    );
  }, [papers, searchQuery, selectedSubject, selectedDate]);

  const handleShare = (subject: string, examDate: string, missing: string[]) => {
    const text = `📚 Class 10 PaperVault: Missing ${missing.join(
      ', '
    )} for ${subject} (${examDate}). Please upload your set: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const SETS: ('Set A' | 'Set B' | 'Set C' | 'Set D')[] = ['Set A', 'Set B', 'Set C', 'Set D'];

  return (
    <div className="space-y-6">
      {/* 1. Quick Filters: Subject Pills, Set Pills, & Date Search Bar */}
      <div className="glass-panel border border-zinc-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md transition-all">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 flex-shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Subject:
          </span>
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex-shrink-0 ${
              selectedSubject === 'All'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            All Subjects
          </button>
          {GRADE_10_SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex-shrink-0 ${
                selectedSubject === sub
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Set Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 flex-shrink-0 mr-1">
            Set:
          </span>
          {['All', 'Set A', 'Set B', 'Set C', 'Set D'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSet(s)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                selectedSet === s
                  ? 'bg-zinc-900 dark:bg-zinc-800 text-white border border-zinc-700 dark:border-zinc-600 font-bold shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Date Filter & Search Bar */}
        <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-shrink-0 mr-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Exam Date:
            </span>

            {/* Date Picker Input */}
            <div className="relative flex items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                title="Select a specific date to filter"
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-500 cursor-pointer shadow-inner"
              />
            </div>

            {/* Quick All Dates Button */}
            <button
              onClick={() => setSelectedDate('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                !selectedDate
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              All Dates (List All)
            </button>

            {/* Quick chips for existing exam dates */}
            {availableDates.slice(0, 4).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedDate === d
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black font-bold shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {formatDateLabel(d)}
              </button>
            ))}
          </div>

          {/* Active Filter Badge */}
          {selectedDate && (
            <div className="flex items-center gap-2 flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-xl">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                Date: <strong className="text-zinc-900 dark:text-white font-bold">{selectedDate}</strong>
                {selectedSet !== 'All' && <span> • <strong>{selectedSet}</strong></span>}
              </span>
              <button
                onClick={() => setSelectedDate('')}
                className="text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold ml-1 cursor-pointer transition-colors"
              >
                ✕ Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Empty State if no papers */}
      {groupedExams.length === 0 && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center max-w-md mx-auto my-8 shadow-sm transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-zinc-900 dark:text-white mb-1">No Exam Papers Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
            {papers.length === 0
              ? 'Be the first student to upload today’s question paper!'
              : 'No papers match your selected subject or search filter.'}
          </p>
          <button
            onClick={() =>
              onUploadForExamSet(
                selectedSubject !== 'All' ? selectedSubject : 'Mathematics',
                new Date().toISOString().split('T')[0],
                'Set A'
              )
            }
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold text-xs rounded-xl hover:bg-black dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Question Paper</span>
          </button>
        </div>
      )}

      {/* 3. Feed of Daily Exam Paper Slots */}
      <div className="space-y-4">
        {groupedExams.map(([key, group]) => {
          const uploadedCount = Object.keys(group.papersBySet).length;
          const missingSets = SETS.filter((s) => !group.papersBySet[s]);
          const isComplete = uploadedCount === 4;

          return (
            <div
              key={key}
              className="glass-panel border border-zinc-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl dark:shadow-2xl transition-all"
            >
              {/* Exam Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-100 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      {group.examDate}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300">
                      Class 10
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white font-display">
                    {group.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      isComplete
                        ? 'bg-zinc-50/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-zinc-50/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{uploadedCount} / 4 Sets Uploaded</span>
                  </span>

                  {!isComplete && (
                    <button
                      onClick={() => handleShare(group.subject, group.examDate, missingSets)}
                      title="Share link with classmates"
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700/60 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer transition-all backdrop-blur-md"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {copiedLink ? 'Copied!' : 'Request Missing'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Sets Grid (Set A, Set B, Set C, Set D) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SETS.map((setName) => {
                  const paper = group.papersBySet[setName];

                  if (paper) {
                    return (
                      <div
                        key={setName}
                        className="glass-card border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-extrabold font-mono text-xs">
                              {setName}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          </div>

                          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate mb-0.5">
                            {paper.subject}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            By {paper.uploadedBy || 'Classmate'}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                          <button
                            onClick={() => onViewPaper(paper)}
                            className="flex-1 py-1.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-black dark:hover:bg-zinc-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => onDownloadPaper(paper)}
                            title="Download Paper"
                            className="p-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Missing Set Card
                  return (
                    <div
                      key={setName}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-2xl p-4 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold font-mono text-xs">
                            {setName}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">Missing</span>
                        </div>
                        <p className="text-xs text-zinc-500 mb-1">
                          No {setName} paper yet
                        </p>
                      </div>

                      <button
                        onClick={() => onUploadForExamSet(group.subject, group.examDate, setName)}
                        className="w-full py-1.5 mt-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
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
    </div>
  );
};
