'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useNotification } from '@/context/NotificationContext';

export default function SystemSettings() {
  const { success, error } = useNotification();
  const [clearing, setClearing] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleClearCache = async () => {
    if (!window.confirm('This will clear all cached data. Continue?')) return;

    try {
      setClearing(true);
      await axios.post('/api/admin/system/cache/clear');
      success('Cache cleared successfully');
    } catch (err) {
      console.error(err);
      error('Failed to clear cache');
    } finally {
      setClearing(false);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      setToggling(true);
      const newState = !maintenanceMode;
      await axios.post('/api/admin/system/maintenance-mode', {
        enabled: newState,
      });
      setMaintenanceMode(newState);
      success(`Maintenance mode ${newState ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error(err);
      error('Failed to toggle maintenance mode');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>
        System Settings
      </h1>

      {/* Cache Management */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Cache Management
        </h2>

        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Clear all cached data to free up memory. Users will experience slower loading times
          until the cache is repopulated.
        </p>

        <button
          onClick={handleClearCache}
          disabled={clearing}
          style={{
            padding: '12px 24px',
            borderRadius: '6px',
            backgroundColor: clearing ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            cursor: clearing ? 'not-allowed' : 'pointer',
            opacity: clearing ? 0.6 : 1,
          }}
        >
          {clearing ? 'Clearing...' : '🗑️ Clear Cache'}
        </button>
      </div>

      {/* Maintenance Mode */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Maintenance Mode
        </h2>

        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Enable maintenance mode to temporarily take the application offline for updates or
          emergency maintenance. Users will see a maintenance page.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <button
            onClick={handleToggleMaintenance}
            disabled={toggling}
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              backgroundColor: maintenanceMode ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              cursor: toggling ? 'not-allowed' : 'pointer',
              opacity: toggling ? 0.6 : 1,
            }}
          >
            {toggling
              ? 'Toggling...'
              : maintenanceMode
                ? '🔴 Disable Maintenance'
                : '⚙️ Enable Maintenance'}
          </button>

          <div
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: maintenanceMode ? '#fee2e2' : '#dcfce7',
              color: maintenanceMode ? '#991b1b' : '#166534',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {maintenanceMode ? 'Maintenance Mode ON' : 'Maintenance Mode OFF'}
          </div>
        </div>
      </div>

      {/* Database Backups */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Database Backups
        </h2>

        <div style={{ color: '#6b7280', marginBottom: '16px' }}>
          <p>Automated backups are configured to run daily at 2:00 AM UTC.</p>
          <p>Last backup: <strong>Today at 02:15 UTC</strong></p>
          <p>Next scheduled backup: <strong>Tomorrow at 02:00 UTC</strong></p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <button
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📥 Create Backup Now
          </button>

          <button
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📋 View Backup History
          </button>
        </div>
      </div>
    </div>
  );
}
