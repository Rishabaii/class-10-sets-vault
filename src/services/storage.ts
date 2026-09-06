import { type QuestionPaper } from '../types/paper';
import { CloudSync } from './cloudSync';

const DB_NAME = 'papervault_storage_db';
const DB_VERSION = 1;
const STORE_NAME = 'question_papers';
const LOCAL_BACKUP_KEY = 'papervault_papers_backup_v2';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported by this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const PaperStorage = {
  // Load papers from IndexedDB & sync with Cloud if configured
  async loadPapers(): Promise<QuestionPaper[]> {
    let localPapers: QuestionPaper[] = [];

    // 1. Load from IndexedDB
    try {
      const db = await openDB();
      localPapers = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          resolve((req.result as QuestionPaper[]) || []);
        };
        req.onerror = () => {
          resolve([]);
        };
      });
    } catch {
      try {
        const local = localStorage.getItem(LOCAL_BACKUP_KEY);
        localPapers = local ? JSON.parse(local) : [];
      } catch {
        localPapers = [];
      }
    }

    // 2. If CloudSync is configured, fetch from cloud & merge
    if (CloudSync.isConfigured()) {
      try {
        const cloudPapers = await CloudSync.fetchPapers();
        if (cloudPapers.length > 0) {
          // Merge by ID (cloud takes priority for collaborative updates)
          const mergedMap = new Map<string, QuestionPaper>();
          localPapers.forEach((p) => mergedMap.set(p.id, p));
          cloudPapers.forEach((p) => mergedMap.set(p.id, p));
          const mergedList = Array.from(mergedMap.values());

          // Save merged back to local IndexedDB
          await this.saveAll(mergedList);
          return mergedList;
        }
      } catch (err) {
        console.warn('Cloud sync background fetch failed, using local papers', err);
      }
    }

    return localPapers;
  },

  // Save all papers to IndexedDB & Cloud
  async saveAll(papers: QuestionPaper[]): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.clear();
      papers.forEach((p) => {
        store.put(p);
      });

      try {
        const metadataOnly = papers.map((p) => ({
          ...p,
          fileData: p.fileData ? '[PERSISTED]' : undefined,
          images: p.images ? p.images.map(() => '[IMAGE]') : undefined,
        }));
        localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(metadataOnly));
      } catch {
        // ignore
      }
    } catch (e) {
      console.error('Failed to save papers to IndexedDB', e);
    }
  },

  // Add or update single paper
  async savePaper(paper: QuestionPaper): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(paper);
    } catch (e) {
      console.error('Failed to save paper to IndexedDB', e);
    }

    // Also push to cloud if configured
    if (CloudSync.isConfigured()) {
      CloudSync.uploadPaper(paper).catch((err) => {
        console.warn('Background cloud upload failed:', err);
      });
    }
  },

  // Delete a paper
  async deletePaper(id: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
    } catch (e) {
      console.error('Failed to delete paper from IndexedDB', e);
    }

    if (CloudSync.isConfigured()) {
      CloudSync.deletePaper(id).catch((err) => {
        console.warn('Background cloud delete failed:', err);
      });
    }
  },

  // Convert uploaded File to persistent Data URL / Base64 string
  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  // Export full archive as JSON backup
  exportArchive(papers: QuestionPaper[]) {
    const jsonStr = JSON.stringify(papers, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `papervault_archive_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Import archive from JSON string
  async importArchive(jsonStr: string): Promise<QuestionPaper[]> {
    const imported = JSON.parse(jsonStr) as QuestionPaper[];
    if (Array.isArray(imported)) {
      await this.saveAll(imported);
      return imported;
    }
    throw new Error('Invalid backup file format');
  },
};
