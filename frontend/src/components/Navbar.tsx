"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useContext } from "react";
import { ExamContext } from "@/context/ExamContext";

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
  
  // Safely get context without throwing if not available
  const context = useContext(ExamContext);
  const selectedExam = context?.selectedExam || null;

  const isInsideExam = pathname?.startsWith('/exams/') && selectedExam;

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
    </header>
  );
}
