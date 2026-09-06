-- =========================================================================
-- PaperVault Database & Storage Schema for Supabase (PostgreSQL)
-- Run this in your Supabase Project SQL Editor (Dashboard -> SQL Editor)
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

-- 3. Create public access policies so all classmates can read, upload, and update
DROP POLICY IF EXISTS "Allow public read" ON public.question_papers;
CREATE POLICY "Allow public read" ON public.question_papers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.question_papers;
CREATE POLICY "Allow public insert" ON public.question_papers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON public.question_papers;
CREATE POLICY "Allow public update" ON public.question_papers
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete" ON public.question_papers;
CREATE POLICY "Allow public delete" ON public.question_papers
  FOR DELETE USING (true);

-- 4. Create performance indexes for fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_qp_subject_code ON public.question_papers(subject_code);
CREATE INDEX IF NOT EXISTS idx_qp_exam_date ON public.question_papers(exam_date DESC);
CREATE INDEX IF NOT EXISTS idx_qp_set ON public.question_papers(set);

-- 5. Create Storage Bucket for Exam Paper Images & PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('paper_files', 'paper_files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage bucket access policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'paper_files');

DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'paper_files');
