/**
 * Exam definitions and constants for multi-exam system
 */

export interface ExamDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  primaryColor: string;
  accentColor: string;
  lightColor: string;
  borderColor: string;
  totalQuestions: number;
  estimatedHours: number;
  examType: 'college' | 'graduate' | 'high_school';
}

export const EXAMS: Record<string, ExamDefinition> = {
  sat: {
    id: 'sat',
    name: 'SAT',
    displayName: 'SAT',
    description: 'College admissions exam',
    icon: '📚',
    primaryColor: '#4F46E5',
    accentColor: '#F59E0B',
    lightColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    totalQuestions: 2400,
    estimatedHours: 180,
    examType: 'college',
  },
  act: {
    id: 'act',
    name: 'ACT',
    displayName: 'ACT',
    description: 'College admissions exam',
    icon: '🎯',
    primaryColor: '#06B6D4',
    accentColor: '#EC4899',
    lightColor: '#ECFDFD',
    borderColor: '#A5F3FC',
    totalQuestions: 2000,
    estimatedHours: 150,
    examType: 'college',
  },
  gre: {
    id: 'gre',
    name: 'GRE',
    displayName: 'GRE',
    description: 'Graduate school entrance exam',
    icon: '🧠',
    primaryColor: '#8B5CF6',
    accentColor: '#14B8A6',
    lightColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    totalQuestions: 1800,
    estimatedHours: 120,
    examType: 'graduate',
  },
  gmat: {
    id: 'gmat',
    name: 'GMAT',
    displayName: 'GMAT',
    description: 'Business school entrance exam',
    icon: '💼',
    primaryColor: '#10B981',
    accentColor: '#6366F1',
    lightColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    totalQuestions: 1600,
    estimatedHours: 110,
    examType: 'graduate',
  },
  shsat: {
    id: 'shsat',
    name: 'SHSAT',
    displayName: 'SHSAT',
    description: 'NYC specialized high school admission exam',
    icon: '🏆',
    primaryColor: '#F97316',
    accentColor: '#3B82F6',
    lightColor: '#FFEDD5',
    borderColor: '#FDBA74',
    totalQuestions: 1200,
    estimatedHours: 90,
    examType: 'high_school',
  },
  regents: {
    id: 'regents',
    name: 'Regents',
    displayName: 'Regents',
    description: 'New York state high school exams',
    icon: '📖',
    primaryColor: '#DC2626',
    accentColor: '#FBBF24',
    lightColor: '#FEF2F2',
    borderColor: '#FECACA',
    totalQuestions: 1400,
    estimatedHours: 100,
    examType: 'high_school',
  },
};

export const EXAM_IDS = Object.keys(EXAMS) as Array<keyof typeof EXAMS>;

export const getExam = (examId: string): ExamDefinition | null => {
  return EXAMS[examId as keyof typeof EXAMS] || null;
};

export const getDifficultyColor = (difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => {
  switch (difficulty) {
    case 'Beginner':
      return { bg: '#D1FAE5', text: '#065F46' };
    case 'Intermediate':
      return { bg: '#FEF3C7', text: '#92400E' };
    case 'Advanced':
      return { bg: '#FEE2E2', text: '#7F1D1D' };
    default:
      return { bg: '#F3F4F6', text: '#374151' };
  }
};
