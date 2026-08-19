'use client';

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useContext } from 'react';
import { ExamContext } from '@/context/ExamContext';
import { getExam } from '@/lib/examConstants';
import { useEffect, useState } from 'react';

export default function ExamLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const examId = params.examId as string;
  const context = useContext(ExamContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (examId && context && !context.selectedExam) {
      const exam = getExam(examId);
      if (exam) {
        context.setSelectedExam(examId);
      }
    }
    setMounted(true);
  }, [examId, context]);

  if (!mounted) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div data-exam={examId}>
      {children}
    </div>
  );
}
