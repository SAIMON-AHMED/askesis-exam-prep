"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#f9fafb',
          color: '#111827',
          padding: '24px',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          borderRight: '1px solid #e5e7eb',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', color: '#111827' }}>
          Admin Panel
        </h1>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            href="/admin"
            style={{
              padding: '12px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              backgroundColor: '#e5e7eb',
              transition: 'background-color 0.2s',
            }}
          >
            📊 Dashboard
          </Link>

          <Link
            href="/admin/users"
            style={{
              padding: '12px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              backgroundColor: '#e5e7eb',
              transition: 'background-color 0.2s',
            }}
          >
            👥 User Management
          </Link>

          <Link
            href="/admin/content"
            style={{
              padding: '12px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              backgroundColor: '#e5e7eb',
              transition: 'background-color 0.2s',
            }}
          >
            📚 Content Management
          </Link>

          <Link
            href="/admin/analytics"
            style={{
              padding: '12px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              backgroundColor: '#e5e7eb',
              transition: 'background-color 0.2s',
            }}
          >
            📈 Analytics
          </Link>

          <Link
            href="/admin/system"
            style={{
              padding: '12px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              backgroundColor: '#e5e7eb',
              transition: 'background-color 0.2s',
            }}
          >
            ⚙️ System Settings
          </Link>

          <hr style={{ borderColor: '#e5e7eb', margin: '16px 0' }} />

          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#374151',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            ← Back to App
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: '250px',
          padding: '24px',
          width: 'calc(100% - 250px)',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
