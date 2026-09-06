import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type QuestionPaper } from '../types/paper';

const CLOUD_CONFIG_KEY = 'papervault_cloud_config_v1';
const DEFAULT_CLASS_ID = 'default-class';

export interface CloudConfig {
  url: string;
  anonKey: string;
  classId: string;
}

class CloudSyncService {
  private client: SupabaseClient | null = null;
  private config: CloudConfig | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // 1. Try environment variables first
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const envClassId = import.meta.env.VITE_CLASS_ID || DEFAULT_CLASS_ID;

    if (envUrl && envKey) {
      this.config = {
        url: envUrl,
        anonKey: envKey,
        classId: envClassId,
      };
      this.client = createClient(envUrl, envKey);
      return;
    }

    // 2. Try saved user configuration from localStorage
    try {
      const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CloudConfig;
        if (parsed.url && parsed.anonKey) {
          this.config = parsed;
          this.client = createClient(parsed.url, parsed.anonKey);
        }
      }
    } catch {
      // ignore
    }
  }

  public isConfigured(): boolean {
    return !!(this.client && this.config?.url && this.config?.anonKey);
  }

  public getConfig(): CloudConfig {
    return (
      this.config || {
        url: '',
        anonKey: '',
        classId: DEFAULT_CLASS_ID,
      }
    );
  }

  public saveConfig(config: CloudConfig): boolean {
    try {
      if (!config.url || !config.anonKey) {
        this.client = null;
        this.config = null;
        localStorage.removeItem(CLOUD_CONFIG_KEY);
        return false;
      }

      this.config = config;
      this.client = createClient(config.url, config.anonKey);
      localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error('Failed to save cloud config', e);
      return false;
    }
  }

  // Fetch papers from Supabase cloud database
  public async fetchPapers(): Promise<QuestionPaper[]> {
    if (!this.client || !this.config) {
      return [];
    }

    try {
      const { data, error } = await this.client
        .from('question_papers')
        .select('*')
        .order('exam_date', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error:', error.message);
        return [];
      }

      if (!data) return [];

      // Map Supabase snake_case to frontend QuestionPaper type
      return data.map((row: any) => ({
        id: row.id,
        subject: row.subject,
        subjectCode: row.subject_code,
        department: row.department,
        examDate: row.exam_date,
        examYear: row.exam_year || parseInt(row.exam_date?.split('-')[0]) || new Date().getFullYear(),
        session: row.session,
        set: row.set,
        category: row.category || 'standard',
        customLabel: row.custom_label,
        semester: row.semester || 'Semester 4',
        maxMarks: row.max_marks || 100,
        duration: row.duration || '3 Hours',
        hasSolution: !!row.has_solution,
        fileType: row.file_type || 'pdf',
        fileData: row.file_data,
        images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images) : row.images) : undefined,
        fileName: row.file_name || `${row.subject_code}_${row.set}.pdf`,
        fileSize: row.file_size || '1.5 MB',
        pageCount: row.page_count || 1,
        uploadedBy: row.uploaded_by || 'Class Contributor',
        uploadDate: row.upload_date || new Date().toISOString().split('T')[0],
        downloadsCount: row.downloads_count || 1,
        viewsCount: row.views_count || 1,
        tags: row.tags ? (typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags) : [row.subject_code, row.set],
        instructions: row.instructions ? (typeof row.instructions === 'string' ? JSON.parse(row.instructions) : row.instructions) : [],
        questions: row.questions ? (typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions) : [],
        notes: row.notes,
      }));
    } catch (e) {
      console.error('Error fetching cloud papers:', e);
      return [];
    }
  }

  // Upload or update paper in Supabase cloud database
  public async uploadPaper(paper: QuestionPaper): Promise<boolean> {
    if (!this.client || !this.config) {
      return false;
    }

    try {
      const payload = {
        id: paper.id,
        subject: paper.subject,
        subject_code: paper.subjectCode,
        department: paper.department,
        exam_date: paper.examDate,
        exam_year: paper.examYear,
        session: paper.session,
        set: paper.set,
        category: paper.category || 'standard',
        custom_label: paper.customLabel || null,
        semester: paper.semester,
        max_marks: paper.maxMarks,
        duration: paper.duration,
        has_solution: paper.hasSolution,
        file_type: paper.fileType,
        file_data: paper.fileData || null,
        images: paper.images ? JSON.stringify(paper.images) : null,
        file_name: paper.fileName,
        file_size: paper.fileSize,
        page_count: paper.pageCount,
        uploaded_by: paper.uploadedBy,
        upload_date: paper.uploadDate,
        downloads_count: paper.downloadsCount,
        views_count: paper.viewsCount,
        tags: JSON.stringify(paper.tags),
        instructions: JSON.stringify(paper.instructions),
        questions: JSON.stringify(paper.questions),
        notes: paper.notes || null,
      };

      const { error } = await this.client
        .from('question_papers')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Supabase upload error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error saving paper to cloud:', e);
      return false;
    }
  }

  // Delete paper from Supabase cloud
  public async deletePaper(id: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client
        .from('question_papers')
        .delete()
        .eq('id', id);
      return !error;
    } catch (e) {
      console.error('Error deleting cloud paper:', e);
      return false;
    }
  }

  // Upload a binary file / blob / image to Supabase Storage and return its public URL
  public async uploadFile(file: File | Blob, path: string): Promise<string | null> {
    if (!this.client) return null;
    try {
      const bucket = 'paper_files';
      const { error: uploadError } = await this.client.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
        return null;
      }

      const { data } = this.client.storage.from(bucket).getPublicUrl(path);
      return data?.publicUrl || null;
    } catch (e) {
      console.error('Error uploading file to Supabase Storage:', e);
      return null;
    }
  }

  // Sample SQL query to create the table & storage bucket in Supabase in 1 click
  public getSQLSchema(): string {
    return `-- =========================================================================
-- PaperVault Database & Storage Schema for Supabase
-- Paste and run this in Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Create the main question_papers table
CREATE TABLE IF NOT EXISTS public.question_papers (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  department TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_year INT,
  session TEXT NOT NULL,
  set TEXT NOT NULL,
  category TEXT DEFAULT 'standard',
  custom_label TEXT,
  semester TEXT,
  max_marks INT DEFAULT 100,
  duration TEXT DEFAULT '3 Hours',
  has_solution BOOLEAN DEFAULT false,
  file_type TEXT DEFAULT 'pdf',
  file_data TEXT,
  images TEXT,
  file_name TEXT,
  file_size TEXT,
  page_count INT DEFAULT 1,
  uploaded_by TEXT DEFAULT 'Student',
  upload_date DATE DEFAULT CURRENT_DATE,
  downloads_count INT DEFAULT 1,
  views_count INT DEFAULT 1,
  tags TEXT,
  instructions TEXT,
  questions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- 3. Create public access policies for table
DROP POLICY IF EXISTS "Allow public read" ON public.question_papers;
CREATE POLICY "Allow public read" ON public.question_papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.question_papers;
CREATE POLICY "Allow public insert" ON public.question_papers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON public.question_papers;
CREATE POLICY "Allow public update" ON public.question_papers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete" ON public.question_papers;
CREATE POLICY "Allow public delete" ON public.question_papers FOR DELETE USING (true);

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_qp_subject_code ON public.question_papers(subject_code);
CREATE INDEX IF NOT EXISTS idx_qp_exam_date ON public.question_papers(exam_date DESC);
CREATE INDEX IF NOT EXISTS idx_qp_set ON public.question_papers(set);

-- 5. Create Storage Bucket for Exam Paper Images & PDFs (Optional / High-Res)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('paper_files', 'paper_files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage bucket access policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'paper_files');

DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'paper_files');
`;
  }
}

export const CloudSync = new CloudSyncService();
