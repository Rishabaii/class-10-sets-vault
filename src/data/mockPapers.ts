import { type QuestionPaper } from '../types/paper';

// Clean initial state
export const INITIAL_PAPERS: QuestionPaper[] = [];

// Grade 10 Standard Subjects (As requested by user: Physics, Chemistry, Biology separate, plus Maths, Social Studies, Hindi, English)
export const GRADE_10_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Social Studies',
  'Hindi',
  'English',
];

export const SUBJECT_CODES: Record<string, string> = {
  'Mathematics': 'MATH10',
  'Physics': 'PHYS10',
  'Chemistry': 'CHEM10',
  'Biology': 'BIO10',
  'Social Studies': 'SST10',
  'Hindi': 'HIN10',
  'English': 'ENG10',
};

// 4 Sets
export const SETS_LIST = [
  'All Sets',
  'Set A',
  'Set B',
  'Set C',
  'Set D',
];

export const EXAM_TYPES = [
  'Daily Practice Exam',
  'Pre-Board Exam',
  'Unit Test',
  'Mid-Term Exam',
  'Annual Board Exam',
];

export const DEPARTMENTS: { name: string; icon: string }[] = [
  { name: 'General & Other', icon: 'BookOpen' },
];

export const SESSIONS_LIST = [
  'All Sessions',
  'Daily Practice Exam',
  'Pre-Board Exam',
  'Unit Test',
];

export const YEARS_LIST = [
  'All Years',
  '2026',
  '2025',
];
