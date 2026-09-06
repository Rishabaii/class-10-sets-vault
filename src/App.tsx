import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DailySetsBoard } from './components/DailySetsBoard';
import { CloudSyncModal } from './components/CloudSyncModal';
import { UploadModal } from './components/UploadModal';
import { DocumentReaderModal } from './components/DocumentReaderModal';
import { PaperStorage } from './services/storage';
import { CloudSync } from './services/cloudSync';
import { type QuestionPaper, type PaperSet } from './types/paper';
import { CheckCircle2, ShieldCheck, Upload, BookOpen } from 'lucide-react';

export function App() {
  // Theme: dark (default) or light, persisted in localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('papervault-theme');
    return (stored === 'light' ? 'light' : 'dark') as 'dark' | 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('papervault-theme', theme);
  }, [theme]);

  const handleToggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from IndexedDB & Cloud
  const refreshPapers = useCallback(() => {
    PaperStorage.loadPapers().then((loadedPapers) => {
      setPapers(loadedPapers);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    refreshPapers();

    // Auto-refresh from cloud periodically if cloud sync is active
    const interval = setInterval(() => {
      if (CloudSync.isConfigured()) {
        PaperStorage.loadPapers().then((updated) => {
          setPapers(updated);
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [refreshPapers]);

  // Save to IndexedDB whenever papers state changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      PaperStorage.saveAll(papers);
    }
  }, [papers, isLoaded]);

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadInitialValues, setUploadInitialValues] = useState<{
    subject?: string;
    examDate?: string;
    set?: string;
  } | undefined>(undefined);

  const [readerModalOpen, setReaderModalOpen] = useState(false);
  const [selectedPaperForReader, setSelectedPaperForReader] = useState<QuestionPaper | null>(null);
  const [cloudSyncModalOpen, setCloudSyncModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handlePaperUploaded = (newPaper: QuestionPaper) => {
    setPapers((prev) => [newPaper, ...prev]);
    showToast(`Paper "${newPaper.subject} (${newPaper.set})" uploaded & saved!`);
  };

  const handleViewPaper = (paper: QuestionPaper) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paper.id ? { ...p, viewsCount: p.viewsCount + 1 } : p))
    );
    setSelectedPaperForReader(paper);
    setReaderModalOpen(true);
  };

  const handleDownloadPaper = (paper: QuestionPaper) => {
    setPapers((prev) =>
      prev.map((p) =>
        p.id === paper.id ? { ...p, downloadsCount: p.downloadsCount + 1 } : p
      )
    );

    if (paper.fileData) {
      const link = document.createElement('a');
      link.href = paper.fileData;
      link.download = paper.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloading "${paper.fileName}"`);
      return;
    }

    if (paper.images && paper.images.length > 0) {
      const link = document.createElement('a');
      link.href = paper.images[0];
      link.download = `${paper.subject}_${paper.set}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloading "${paper.subject} (${paper.set})"`);
      return;
    }

    showToast('Viewing paper document');
  };

  const handleOpenUploadForExam = (
    subject: string,
    examDate: string,
    set: PaperSet
  ) => {
    setUploadInitialValues({
      subject,
      examDate,
      set,
    });
    setUploadModalOpen(true);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isDark ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-900'} selection:bg-zinc-800 selection:text-white`}>
      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => {
          setUploadInitialValues(undefined);
          setUploadModalOpen(true);
        }}
        onOpenCloudSync={() => setCloudSyncModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalPapersCount={papers.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Simple Top Banner for Class 10 */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/90 dark:bg-zinc-950/75 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                Grade 10 Practice Hub
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Sets A, B, C, &amp; D
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-zinc-900 dark:text-white">
              Class 10 Exam Sets Archive
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Upload your daily set papers so everyone in class can revise and prepare together.
            </p>
          </div>

          <button
            onClick={() => {
              setUploadInitialValues(undefined);
              setUploadModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold text-xs hover:bg-black dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Question Paper</span>
          </button>
        </div>

        {/* Daily Sets Board (Single-Area Central Feed) */}
        <DailySetsBoard
          papers={papers}
          onViewPaper={handleViewPaper}
          onDownloadPaper={handleDownloadPaper}
          onUploadForExamSet={handleOpenUploadForExam}
          searchQuery={searchQuery}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-black/80 backdrop-blur-xl text-zinc-500 dark:text-zinc-400 py-6 px-4 text-center text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-900 dark:text-white" />
            <span className="text-zinc-900 dark:text-white font-bold">Class 10 Sets Vault</span>
            <span className="text-zinc-400">|</span>
            <span>Maths • Physics • Chemistry • Biology • Social • Hindi • English</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Supabase Cloud Sync Active</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onPaperUploaded={handlePaperUploaded}
        initialValues={uploadInitialValues}
      />

      {selectedPaperForReader && (
        <DocumentReaderModal
          isOpen={readerModalOpen}
          onClose={() => setReaderModalOpen(false)}
          paper={selectedPaperForReader}
          onDownload={handleDownloadPaper}
          isDark={isDark}
        />
      )}

      <CloudSyncModal
        isOpen={cloudSyncModalOpen}
        onClose={() => setCloudSyncModalOpen(false)}
        onConfigSaved={refreshPapers}
        isDark={isDark}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 dark:bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
