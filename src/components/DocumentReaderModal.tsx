import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  CheckCircle2,
  Copy,
  Award,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: QuestionPaper | null;
  onDownload: (paper: QuestionPaper) => void;
  onCompareSet?: (paper: QuestionPaper) => void;
  isDark: boolean;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  isOpen,
  onClose,
  paper,
  onDownload,
  onCompareSet,
  isDark,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeTab, setActiveTab] = useState<'paper' | 'solution' | 'metadata'>('paper');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !paper) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedDate = new Date(paper.examDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const allImages = paper.images && paper.images.length > 0
    ? paper.images
    : paper.fileData && paper.fileData.startsWith('data:image/')
    ? [paper.fileData]
    : [];

  const hasImages = allImages.length > 0;
  // Clamp currentPageIndex to valid range to prevent out-of-bounds
  const safePageIndex = Math.min(currentPageIndex, Math.max(0, allImages.length - 1));
  const currentImage = hasImages ? allImages[safePageIndex] || allImages[0] : null;

  const getSetBadgeColor = (set: string) => {
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-5xl h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
            isDark
              ? 'liquid-glass-panel text-white'
              : 'bg-slate-100 border-slate-300 text-slate-900'
          }`}
        >
          {/* Top Reader Header & Toolbar */}
          <div
            className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b gap-3 flex-wrap ${
              isDark ? 'liquid-glass-panel border-b border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Paper Title & Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs uppercase shadow-sm border ${getSetBadgeColor(
                  paper.set
                )}`}
              >
                {paper.customLabel || paper.set}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-sm sm:text-base font-display ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {paper.subject}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    {paper.subjectCode}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-mono ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}
                >
                  {paper.session} • {paper.examDate} • {paper.department}
                </div>
              </div>
            </div>

            {/* View Mode Tabs (Question Paper vs Solution vs Metadata) */}
            <div
              className={`flex items-center p-1 rounded-xl text-xs font-semibold ${
                isDark ? 'liquid-glass-pill' : 'bg-slate-100 border border-slate-200'
              }`}
            >
              <button
                onClick={() => setActiveTab('paper')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'paper'
                    ? isDark ? 'liquid-glass-btn text-white font-bold' : 'bg-indigo-600 text-white shadow-sm'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Question Paper
              </button>

              {paper.hasSolution && (
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'solution'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Answer Key</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'metadata'
                    ? isDark ? 'liquid-glass-btn text-white font-bold' : 'bg-white text-slate-900 shadow-sm'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Metadata
              </button>
            </div>

            {/* Control Actions (Zoom, Rotate, Print, Download, Close) */}
            <div className="flex items-center gap-2">
              <div
                className={`hidden sm:flex items-center rounded-xl p-1 text-xs ${
                  isDark ? 'liquid-glass-pill' : 'bg-slate-100 border border-slate-200'
                }`}
              >
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                  title="Zoom Out"
                  className={`p-1.5 rounded hover:opacity-80 cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600'}`}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className={`font-mono px-2 text-[11px] font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                  title="Zoom In"
                  className={`p-1.5 rounded hover:opacity-80 cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600'}`}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  title="Reset Zoom"
                  className={`p-1.5 border-l pl-2 rounded hover:opacity-80 cursor-pointer ${
                    isDark ? 'border-white/10 text-zinc-400 hover:text-white' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  title="Rotate Document"
                  className={`p-1.5 border-l pl-2 rounded hover:opacity-80 cursor-pointer ${
                    isDark ? 'border-white/10 text-zinc-400 hover:text-white' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handlePrint}
                title="Print Paper"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isDark
                    ? 'liquid-glass-btn-subtle text-zinc-300 hover:text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Printer className="w-4 h-4" />
              </button>

              {onCompareSet && paper.category !== 'other' && paper.set !== 'Other' && (
                <button
                  onClick={() => {
                    onClose();
                    onCompareSet(paper);
                  }}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isDark
                      ? 'liquid-glass-pill text-cyan-300 hover:text-cyan-200 hover:border-cyan-400/50'
                      : 'bg-white hover:bg-slate-100 text-cyan-700 border border-slate-200'
                  }`}
                >
                  <span>Compare Sets</span>
                </button>
              )}

              <button
                onClick={() => onDownload(paper)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-white rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'liquid-glass-btn' : 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all ml-1 cursor-pointer ${
                  isDark
                    ? 'liquid-glass-btn-subtle text-zinc-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reader Content Area */}
          <div
            className={`flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center ${
              isDark ? 'bg-black/60' : 'bg-slate-200/60'
            }`}
          >
            {activeTab === 'paper' && (
              <div className="w-full flex flex-col items-center">
                {/* If paper has uploaded image scans */}
                {hasImages && currentImage ? (
                  <div className="w-full max-w-4xl flex flex-col items-center">
                    {/* Multi-page controls if more than 1 image */}
                    {allImages.length > 1 && (
                      <div
                        className={`flex items-center gap-3 mb-4 px-4 py-2 rounded-2xl border ${
                          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        <button
                          disabled={safePageIndex === 0}
                          onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                          className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-mono font-bold">
                          Page {safePageIndex + 1} of {allImages.length}
                        </span>
                        <button
                          disabled={safePageIndex === allImages.length - 1}
                          onClick={() => setCurrentPageIndex((p) => Math.min(allImages.length - 1, p + 1))}
                          className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Image Viewer Container */}
                    <div
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease-out',
                      }}
                      className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/60 bg-black max-w-full relative"
                    >
                      <img
                        src={currentImage}
                        alt={`Question Paper Page ${currentPageIndex + 1}`}
                        className="w-full h-auto object-contain max-h-[85vh]"
                      />
                    </div>
                  </div>
                ) : (
                  /* Standard Formatted Clean Paper View */
                  <div
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.2s ease-out',
                    }}
                    className="w-full max-w-3xl bg-white text-zinc-900 rounded-2xl shadow-xl p-8 sm:p-12 my-2 min-h-[800px] border border-zinc-300 font-sans select-text relative"
                  >
                    {/* University Paper Header */}
                    <div className="text-center border-b-2 border-zinc-900 pb-6 mb-6">
                      <div className="font-mono text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        EXAMINATION ARCHIVE
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 uppercase font-display">
                        {paper.department}
                      </h2>
                      <div className="font-bold text-sm text-zinc-800 mt-1">
                        {paper.session} Examination • {paper.semester}
                      </div>

                      <div className="mt-4 pt-4 border-t border-zinc-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-zinc-700 text-left">
                        <div>
                          <span className="text-zinc-400 block">Course Code:</span>
                          <strong className="text-zinc-950">{paper.subjectCode}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block">Paper Set:</span>
                          <strong className="text-indigo-700 text-sm font-black">{paper.customLabel || paper.set}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block">Time Allowed:</span>
                          <strong>{paper.duration}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-400 block">Max. Marks:</span>
                          <strong>{paper.maxMarks}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Candidate Instructions Box */}
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-8 text-xs text-zinc-700 space-y-1 font-sans">
                      <div className="font-bold text-zinc-900 uppercase font-mono text-[11px] mb-1.5 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Instructions to Candidates:</span>
                      </div>
                      {paper.instructions.map((inst, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-mono text-zinc-400 font-bold">{i + 1}.</span>
                          <span>{inst}</span>
                        </div>
                      ))}
                    </div>

                    {/* Formatted Exam Questions */}
                    <div className="space-y-6">
                      {paper.questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="border-b border-zinc-200 pb-5 last:border-b-0"
                        >
                          <div className="flex items-baseline justify-between gap-4 mb-1.5">
                            <span className="font-mono font-bold text-indigo-900 text-sm">
                              {q.qNum}
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-200">
                              [{q.marks} Marks]
                            </span>
                          </div>
                          <p className="text-sm font-serif leading-relaxed text-zinc-800">
                            {q.text}
                          </p>
                          {q.orAlternative && (
                            <div className="mt-3 pt-3 border-t border-dashed border-zinc-300">
                              <span className="font-mono text-[11px] font-bold text-zinc-400 uppercase block mb-1">
                                — OR —
                              </span>
                              <p className="text-sm font-serif leading-relaxed text-zinc-800">
                                {q.orAlternative}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Paper Footer */}
                    <div className="mt-12 pt-6 border-t border-zinc-300 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>PaperVault ID: {paper.id}</span>
                      <span>--- END OF QUESTION PAPER ({paper.customLabel || paper.set}) ---</span>
                      <span>Page 1 of {paper.pageCount}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'solution' && (
              <div
                className={`w-full max-w-3xl rounded-2xl p-8 my-4 border shadow-xl ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-4 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border w-fit ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-emerald-800 bg-emerald-50 border-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Answer Key Included</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-4 font-display">
                  Solutions &amp; Marking Rubric for {paper.subjectCode} ({paper.customLabel || paper.set})
                </h3>

                <div className="space-y-6 text-sm font-sans leading-relaxed">
                  <div
                    className={`p-5 rounded-xl border ${
                      isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <h4 className="font-mono text-xs text-amber-500 font-bold mb-2">
                      Model Solution Key &amp; Concept Rubric
                    </h4>
                    <p
                      className={`text-xs leading-relaxed mb-3 ${
                        isDark ? 'text-zinc-300' : 'text-slate-600'
                      }`}
                    >
                      {paper.notes || 'Verified solutions and step-by-step marking breakdown attached.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metadata' && (
              <div
                className={`w-full max-w-2xl rounded-2xl p-6 sm:p-8 my-4 border shadow-xl ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <h3 className="text-xl font-bold mb-5 font-display">
                  Document Metadata
                </h3>

                <div
                  className={`space-y-3 font-mono text-xs ${
                    isDark ? 'text-zinc-300' : 'text-slate-700'
                  }`}
                >
                  <div className={`flex justify-between py-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Document ID:</span>
                    <span>{paper.id}</span>
                  </div>
                  <div className={`flex justify-between py-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Original File Name:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{paper.fileName}</span>
                  </div>
                  <div className={`flex justify-between py-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>File Size &amp; Format:</span>
                    <span>{paper.fileSize} • {paper.fileType.toUpperCase()}</span>
                  </div>
                  <div className={`flex justify-between py-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Exam Date:</span>
                    <span>{formattedDate}</span>
                  </div>
                  <div className={`flex justify-between py-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Uploaded By:</span>
                    <span>{paper.uploadedBy}</span>
                  </div>
                  <div className={`flex justify-between py-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Ingested On:</span>
                    <span>{paper.uploadDate}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className={isDark ? 'text-zinc-500' : 'text-slate-400'}>Saved in Storage:</span>
                    <span className="text-emerald-500 font-bold">Permanent IndexedDB</span>
                  </div>
                </div>

                <div className={`mt-8 pt-5 border-t flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-sm cursor-pointer ${
                      isDark
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
