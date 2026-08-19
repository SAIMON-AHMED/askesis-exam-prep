'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExamDefinition, getExam } from '@/lib/examConstants';

export interface ExamProgress {
  overallPercent: number;
  sectionProgress: { [key: string]: number };
  lastTopic?: string;
  lastStudiedDate?: Date;
  topicsCompleted: number;
  questionsAttempted: number;
}

interface ExamContextType {
  selectedExam: ExamDefinition | null;
  setSelectedExam: (examId: string | null) => void;
  userProgress: { [examId: string]: ExamProgress };
  updateProgress: (examId: string, progress: Partial<ExamProgress>) => void;
  clearSelectedExam: () => void;
}

export const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedExam, setSelectedExamState] = useState<ExamDefinition | null>(null);
  const [userProgress, setUserProgress] = useState<{ [key: string]: ExamProgress }>({});
  const [mounted, setMounted] = useState(false);

  // Load selected exam from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('selectedExamId');
    if (stored) {
      const exam = getExam(stored);
      if (exam) {
        setSelectedExamState(exam);
      }
    }
    setMounted(true);
  }, []);

  const setSelectedExam = (examId: string | null) => {
    if (examId) {
      const exam = getExam(examId);
      if (exam) {
        setSelectedExamState(exam);
        localStorage.setItem('selectedExamId', examId);
        // Apply exam theme to document
        document.documentElement.setAttribute('data-exam', exam.id);
      }
    } else {
      setSelectedExamState(null);
      localStorage.removeItem('selectedExamId');
      document.documentElement.removeAttribute('data-exam');
    }
  };

  const clearSelectedExam = () => {
    setSelectedExamState(null);
    localStorage.removeItem('selectedExamId');
    document.documentElement.removeAttribute('data-exam');
  };

  const updateProgress = (examId: string, progress: Partial<ExamProgress>) => {
    setUserProgress((prev) => {
      const currentProgress = prev[examId] ?? {
        overallPercent: 0,
        sectionProgress: {},
        topicsCompleted: 0,
        questionsAttempted: 0,
      };

      return {
        ...prev,
        [examId]: {
          ...currentProgress,
          ...progress,
        },
      };
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ExamContext.Provider
      value={{
        selectedExam,
        setSelectedExam,
        userProgress,
        updateProgress,
        clearSelectedExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    // Return a default context if not available (for SSR/hydration compatibility)
    return {
      selectedExam: null,
      setSelectedExam: () => {},
      userProgress: {},
      updateProgress: () => {},
      clearSelectedExam: () => {},
    };
  }
  return context;
};
