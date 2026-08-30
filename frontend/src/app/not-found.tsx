import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          padding: '40px 32px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          maxWidth: '480px',
          width: '100%',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
