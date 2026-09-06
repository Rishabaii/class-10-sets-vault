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
  Trash2,
} from 'lucide-react';
import { type QuestionPaper, type PaperSet } from '../types/paper';
import { GRADE_10_SUBJECTS } from '../data/mockPapers';

interface DailySetsBoardProps {
  papers: QuestionPaper[];
  onViewPaper: (paper: QuestionPaper) => void;
  onDownloadPaper: (paper: QuestionPaper) => void;
  onDeletePaper?: (paper: QuestionPaper) => void;
  onUploadForExamSet: (subject: string, examDate: string, set: PaperSet) => void;
  searchQuery: string;
}

export const DailySetsBoard: React.FC<DailySetsBoardProps> = ({
  papers,
  onViewPaper,
  onDownloadPaper,
  onDeletePaper,
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
      {/* 1. Clean Subject & Date Filter Bar */}
      <div className="glass-panel border border-zinc-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 transition-all">
        {/* Subject Filter Row (No boxed squares, clean line tags) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 flex-shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Subject:
          </span>
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all flex-shrink-0 border-b-2 ${
              selectedSubject === 'All'
                ? 'border-purple-600 dark:border-white text-purple-700 dark:text-white font-black'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            All Subjects
          </button>
          {GRADE_10_SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all flex-shrink-0 border-b-2 ${
                selectedSubject === sub
                  ? 'border-purple-600 dark:border-white text-purple-700 dark:text-white font-black'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Set Filter Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-200/60 dark:border-white/10">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 flex-shrink-0 mr-2">
            Set:
          </span>
          {['All', 'Set A', 'Set B', 'Set C', 'Set D'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSet(s)}
              className={`px-3 py-1 text-xs font-medium cursor-pointer transition-all border-b-2 ${
                selectedSet === s
                  ? 'border-emerald-500 dark:border-white text-emerald-600 dark:text-white font-bold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Date Filter Bar */}
        <div className="pt-2.5 border-t border-zinc-200/60 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-shrink-0 mr-1">
              <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-zinc-400" /> Exam Date:
            </span>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              title="Filter by date"
              className="px-3 py-1 rounded-lg text-xs font-mono bg-white/70 dark:bg-black/40 border border-zinc-300 dark:border-white/15 text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            />

            <button
              onClick={() => setSelectedDate('')}
              className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all border-b-2 ${
                !selectedDate
                  ? 'border-purple-600 dark:border-white text-purple-700 dark:text-white font-bold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              All Dates
            </button>

            {availableDates.slice(0, 4).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-2 py-1 text-xs font-mono transition-all cursor-pointer border-b-2 ${
                  selectedDate === d
                    ? 'border-purple-600 dark:border-white text-purple-700 dark:text-white font-bold'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {formatDateLabel(d)}
              </button>
            ))}
          </div>

          {selectedDate && (
            <div className="flex items-center gap-2 flex-shrink-0 text-xs">
              <span className="font-mono text-zinc-500 dark:text-zinc-400">
                Filtered: <strong className="text-zinc-900 dark:text-white">{selectedDate}</strong>
              </span>
              <button
                onClick={() => setSelectedDate('')}
                className="text-rose-500 hover:underline cursor-pointer ml-1 text-xs font-bold"
              >
                ✕ Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Empty State */}
      {groupedExams.length === 0 && (
        <div className="glass-panel border border-zinc-200 dark:border-white/10 rounded-2xl p-10 text-center max-w-md mx-auto my-8">
          <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">No Exam Papers Found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            {papers.length === 0 ? 'No papers uploaded yet.' : 'No papers match this filter.'}
          </p>
        </div>
      )}

      {/* 3. Clean List View (Line-separated, not square cards) */}
      <div className="space-y-4">
        {groupedExams.map(([key, group]) => {
          const uploadedCount = Object.keys(group.papersBySet).length;
          const missingSets = SETS.filter((s) => !group.papersBySet[s]);
          const isComplete = uploadedCount === 4;

          return (
            <div
              key={key}
              className="glass-panel border border-zinc-200/80 dark:border-white/10 rounded-2xl p-5 transition-all"
            >
              {/* Exam Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white tracking-tight">
                    {group.subject}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-zinc-400" />
                    {group.examDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                      isComplete
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                        : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {uploadedCount} / 4 Sets
                  </span>

                  {!isComplete && (
                    <button
                      onClick={() => handleShare(group.subject, group.examDate, missingSets)}
                      className="text-xs text-purple-600 dark:text-zinc-300 hover:underline flex items-center gap-1 cursor-pointer ml-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Line-Separated Sets Listing (Clean vertical list, separated by thin lines) */}
              <div className="divide-y divide-zinc-200/60 dark:divide-white/10">
                {SETS.map((setName) => {
                  const paper = group.papersBySet[setName];

                  if (paper) {
                    return (
                      <div
                        key={setName}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/40 dark:hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-white/10 dark:text-white border border-purple-200 dark:border-white/10">
                            {setName}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-900 dark:text-white">
                                {paper.fileName}
                              </span>
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-mono">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              Uploaded by {paper.uploadedBy || 'Classmate'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => onViewPaper(paper)}
                            className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-purple-700 dark:hover:bg-zinc-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => onDownloadPaper(paper)}
                            title="Download Paper"
                            className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white cursor-pointer transition-colors rounded-lg hover:bg-white/10"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {onDeletePaper && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${paper.subject} (${paper.set})?`)) {
                                  onDeletePaper(paper);
                                }
                              }}
                              title="Delete Paper"
                              className="p-1.5 text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer transition-colors rounded-lg hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Missing Set Row
                  return (
                    <div
                      key={setName}
                      className="py-2.5 flex items-center justify-between gap-3 px-2 text-zinc-400 dark:text-zinc-500"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded border border-dashed border-zinc-300 dark:border-white/15">
                          {setName}
                        </span>
                        <span className="text-xs italic">Not yet uploaded</span>
                      </div>

                      <button
                        onClick={() => onUploadForExamSet(group.subject, group.examDate, setName)}
                        className="text-xs text-purple-600 dark:text-zinc-400 hover:text-purple-800 dark:hover:text-white hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
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
