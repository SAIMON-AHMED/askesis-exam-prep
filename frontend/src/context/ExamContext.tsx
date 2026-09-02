'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExamDefinition, getExam } from '@/lib/examConstants';
import { api } from '@/lib/api';

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
  loading: boolean;
}

export const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedExam, setSelectedExamState] = useState<ExamDefinition | null>(null);
  const [userProgress, setUserProgress] = useState<{ [key: string]: ExamProgress }>({});
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load selected exam from server (canonical source), with fallback to localStorage
  useEffect(() => {
    const loadExamFromServer = async () => {
      try {
        const response = await api.get('/onboarding');
        const serverExamId = response.data?.primary_exam_id;
        if (serverExamId) {
          const exam = getExam(serverExamId);
          if (exam) {
            setSelectedExamState(exam);
            // Update localStorage cache with server value
            localStorage.setItem('selectedExamId', serverExamId);
            document.documentElement.setAttribute('data-exam', exam.id);
            setMounted(true);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        // Server not available or user not authenticated; fall back to localStorage
        console.debug('Failed to load exam from server, falling back to localStorage', err);
      }

      // Fallback: load from localStorage cache
      const stored = localStorage.getItem('selectedExamId');
      if (stored) {
        const exam = getExam(stored);
        if (exam) {
          setSelectedExamState(exam);
          document.documentElement.setAttribute('data-exam', exam.id);
        }
      }
      setMounted(true);
      setLoading(false);
    };

    loadExamFromServer();
  }, []);

  const setSelectedExam = (examId: string | null) => {
    if (examId) {
      const exam = getExam(examId);
      if (exam) {
        setSelectedExamState(exam);
        // Update localStorage cache
        localStorage.setItem('selectedExamId', examId);
        // Apply exam theme to document
        document.documentElement.setAttribute('data-exam', exam.id);
        
        // Persist to server (fire-and-forget; optional - don't block UI on server call)
        // This ensures the server state stays in sync with the UI
        api.put('/onboarding', { primary_exam_id: examId })
          .catch(err => console.debug('Failed to persist exam selection to server', err));
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

  return (
    <ExamContext.Provider
      value={{
        selectedExam,
        setSelectedExam,
        userProgress,
        updateProgress,
        clearSelectedExam,
        loading,
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
      loading: true,
    };
  }
  return context;
};
