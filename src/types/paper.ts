export type ExamSession =
  | 'Daily Practice Exam'
  | 'End-Term (Finals)'
  | 'Mid-Term'
  | 'Unit Test 1'
  | 'Unit Test 2'
  | 'Supplementary'
  | 'Model Exam'
  | 'Lab / Practical'
  | 'Class Test'
  | 'Special Exam';

// Only 4 standard sets plus Other
export type PaperSet = 'Set A' | 'Set B' | 'Set C' | 'Set D' | 'Other';

export type PaperCategory = 'standard' | 'other';

export type Department =
  | 'Computer Science & Engineering'
  | 'Electronics & Communication'
  | 'Electrical & Electronics'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Mathematics & Basic Sciences'
  | 'Management Studies'
  | 'General & Other';

export interface ExamQuestion {
  qNum: string;
  section: string;
  text: string;
  marks: number;
  orAlternative?: string;
  hasDiagram?: boolean;
}

export interface QuestionPaper {
  id: string;
  subject: string;
  subjectCode: string;
  department: Department;
  examDate: string; // YYYY-MM-DD
  examYear: number;
  session: ExamSession;
  set: PaperSet;
  category?: PaperCategory; // 'standard' (Set A-D) or 'other'
  customLabel?: string; // e.g. "Model Paper 1", "Lab Exam 2026", etc.
  semester: string;
  maxMarks: number;
  duration: string;
  hasSolution: boolean;
  fileType: 'pdf' | 'image';
  fileUrl?: string;
  fileData?: string; // Persistent Base64 / Data URL for the uploaded paper
  images?: string[]; // Array of image page Data URLs
  solutionData?: string; // Optional solution file Data URL
  fileName: string;
  fileSize: string;
  pageCount: number;
  uploadedBy: string;
  uploadDate: string;
  downloadsCount: number;
  viewsCount: number;
  tags: string[];
  instructions: string[];
  questions: ExamQuestion[];
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  department: string;
  session: string;
  set: string;
  year: string;
  category?: 'all' | 'standard' | 'other';
  hasSolutionOnly: boolean;
  sortBy: 'date-desc' | 'date-asc' | 'subject' | 'downloads' | 'views';
}
