'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile, useUserSettings, updateProfile, updateSettings, changePassword, deactivateAccount, logout } from '@/hooks/useProfile';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, loading: profileLoading, error: profileError, isLoggedIn } = useUserProfile();
  const { settings, loading: settingsLoading } = useUserSettings();

  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'password' | 'danger'>('profile');
  const [fullName, setFullName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  React.useEffect(() => {
    if (!isLoggedIn && !profileLoading) {
      router.push('/login');
    }
  }, [isLoggedIn, profileLoading, router]);

  React.useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  React.useEffect(() => {
    if (settings) {
      setTheme(settings.theme || 'light');
      setLanguage(settings.language || 'en');
      setEmailNotifications(settings.email_notifications);
    }
  }, [settings]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
  }, [theme]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      await updateProfile({ full_name: fullName });
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (err) {
      setUpdateMessage('Failed to update profile');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err: any) {
      setPasswordMessage(err.response?.data?.detail || 'Failed to change password');
      console.error(err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeactivate = async () => {
    setIsDeactivating(true);

    try {
      await deactivateAccount();
      // Redirect to login or home
      window.localStorage.removeItem('access_token');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setIsDeactivating(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      window.location.href = '/login';
    }
  };

  const handleSaveSettings = async () => {
    await updateSettings({ theme, language, email_notifications: emailNotifications });
  };

  return (
    <main style={{ padding: 'var(--space-6)', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>Profile & Settings</h1>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '16px', color: 'var(--text-secondary)' }}>
          Manage your account
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {(['profile', 'settings', 'password', 'danger'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
            style={{
              border: 'none',
              padding: '12px 16px',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : 'none',
              textTransform: 'capitalize',
            }}
          >
            {tab === 'danger' ? 'Danger Zone' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <section className="card" style={{ padding: '24px', maxWidth: '500px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
            Profile Information
          </h2>

          {profileError && (
            <div
              className="alert alert-error"
              style={{ marginBottom: 'var(--space-4)' }}
              role="alert"
            >
              {profileError}
            </div>
          )}

          {profileLoading ? (
            <p>Loading profile...</p>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Email (Read-only)
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-secondary)',
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label htmlFor="fullname" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
                <div>
                  <strong>Joined:</strong> {profile && new Date(profile.created_at).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total Study Hours:</strong> {profile?.total_study_hours.toFixed(1)}
                </div>
              </div>

              {updateMessage && (
                <div
                  className={updateMessage.includes('successfully') ? 'alert alert-success' : 'alert alert-error'}
                  style={{ marginBottom: 'var(--space-4)' }}
                >
                  {updateMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}
        </section>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <section className="card" style={{ padding: '24px', maxWidth: '500px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
            Preferences
          </h2>

          {settingsLoading ? (
            <p>Loading settings...</p>
          ) : (
            <>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label
                  htmlFor="theme"
                  style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
                >
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label
                  htmlFor="language"
                  style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
                >
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span>Email notifications</span>
                </label>
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={handleSaveSettings}>
                Save Settings
              </button>
            </>
          )}
        </section>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <section className="card" style={{ padding: '24px', maxWidth: '500px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
            Change Password
          </h2>

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="oldpass" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Current Password
              </label>
              <input
                id="oldpass"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="newpass" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                New Password (min. 8 characters)
              </label>
              <input
                id="newpass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="confirm" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Confirm New Password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                }}
              />
            </div>

            {passwordMessage && (
              <div
                className={
                  passwordMessage.includes('successfully') ? 'alert alert-success' : 'alert alert-error'
                }
                style={{ marginBottom: 'var(--space-4)' }}
              >
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isChangingPassword}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </section>
      )}

      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <section className="card" style={{ padding: '24px', maxWidth: '500px', borderColor: '#dc2626' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600', color: '#dc2626' }}>
            Danger Zone
          </h2>

          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            These actions cannot be undone.
          </p>

          {!showDeactivateConfirm ? (
            <button
              onClick={() => setShowDeactivateConfirm(true)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Deactivate Account
            </button>
          ) : (
            <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#991b1b' }}>
                Are you sure? This will permanently delete your account and all data.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isDeactivating ? 'not-allowed' : 'pointer',
                    opacity: isDeactivating ? 0.6 : 1,
                  }}
                >
                  {isDeactivating ? 'Deactivating...' : 'Yes, Deactivate'}
                </button>
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  disabled={isDeactivating}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
