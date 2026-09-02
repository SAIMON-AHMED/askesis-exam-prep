"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useContext, useRef } from "react";
import { ExamContext } from "@/context/ExamContext";
import { EXAMS } from "@/lib/examConstants";
import { useNotification } from "@/context/NotificationContext";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/exams", label: "Exams" },
  { href: "/practice", label: "Practice" },
  { href: "/analytics", label: "Analytics" },
  { href: "/subscription", label: "Subscription" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [examSelectorOpen, setExamSelectorOpen] = useState(false);
  const [pendingExamId, setPendingExamId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { warning, error: showError } = useNotification();
  
  // Safely get context without throwing if not available
  const context = useContext(ExamContext);
  const selectedExam = context?.selectedExam || null;
  const setSelectedExam = context?.setSelectedExam || (() => {});

  const isInsideExam = pathname?.startsWith('/exams/') && selectedExam;

  const handleExamChange = (examId: string) => {
    if (examId === selectedExam?.id) {
      setExamSelectorOpen(false);
      return;
    }
    
    // Show confirmation dialog for exam change (anti-accidental-switch rule)
    setPendingExamId(examId);
    dialogRef.current?.showModal();
  };

  const confirmExamChange = async () => {
    if (!pendingExamId) return;
    
    try {
      setSelectedExam(pendingExamId);
      dialogRef.current?.close();
      setPendingExamId(null);
      setExamSelectorOpen(false);
      warning("Primary exam updated. Dashboard, analytics, and study plan will reflect your new exam.");
    } catch (err) {
      showError("Failed to change exam. Please try again.");
      console.error("Exam change failed:", err);
    }
  };

  const cancelExamChange = () => {
    dialogRef.current?.close();
    setPendingExamId(null);
  };

  const pendingExam = pendingExamId ? EXAMS[pendingExamId] : null;

  return (
    <header className="navbar" data-exam={selectedExam?.id}>
      <Link href="/" className="navbar-brand" aria-label="Askesis home">
        <svg
          className="navbar-logo"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="15" stroke="#3A6EA5" strokeWidth="2" />
          <path d="M9 18L14 22L23 11" stroke="#F9C74F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Askesis
      </Link>

      {/* Show exam selector (always visible if selected, on all pages except when inside exam) */}
      {!isInsideExam && selectedExam && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: '16px',
          paddingLeft: '16px',
          borderLeft: '1px solid #e5e7eb',
          position: 'relative',
        }}>
          <button
            onClick={() => setExamSelectorOpen(!examSelectorOpen)}
            style={{
              fontSize: '14px',
              color: `var(--exam-${selectedExam.id}-primary)`,
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            aria-label="Switch exam"
            aria-expanded={examSelectorOpen}
          >
            {selectedExam.displayName}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Exam selector dropdown */}
          {examSelectorOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '16px',
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              minWidth: '160px',
            }}>
              {Object.values(EXAMS).map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => handleExamChange(exam.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '14px',
                    border: 'none',
                    background: selectedExam.id === exam.id ? '#f3f4f6' : 'white',
                    cursor: 'pointer',
                    color: selectedExam.id === exam.id ? `var(--exam-${exam.id}-primary)` : '#374151',
                    fontWeight: selectedExam.id === exam.id ? '600' : '400',
                  }}
                >
                  {exam.displayName}
                  {selectedExam.id === exam.id && ' ✓'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Show exam context when inside an exam */}
      {isInsideExam && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#6b7280',
          marginLeft: '16px',
          paddingLeft: '16px',
          borderLeft: '1px solid #e5e7eb',
        }}>
          <span style={{ color: `var(--exam-${selectedExam.id}-primary)`, fontWeight: '600' }}>
            {selectedExam.displayName}
          </span>
        </div>
      )}

      <button
        type="button"
        className="navbar-toggle"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2 5H18M2 10H18M2 15H18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <nav className={`navbar-links${open ? " open" : ""}`} aria-label="Main navigation">
        {LINKS.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/exams' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className="navbar-link"
              aria-current={isActive ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Confirmation dialog for exam change */}
      <dialog
        ref={dialogRef}
        style={{
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          padding: '24px',
          maxWidth: '400px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', marginTop: 0 }}>
          Change Primary Exam?
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          This will update your primary exam to <strong>{pendingExam?.displayName}</strong>. Your dashboard, analytics, and study plan will reflect this change.
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
          You can still practice any exam, but your primary exam determines your main study focus.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={cancelExamChange}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
          <button
            onClick={confirmExamChange}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              background: `var(--exam-${pendingExamId}-primary, #3b82f6)`,
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Change to {pendingExam?.displayName}
          </button>
        </div>
      </dialog>
    </header>
  );
}
