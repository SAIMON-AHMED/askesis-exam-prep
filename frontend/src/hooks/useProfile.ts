import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  total_study_hours: number;
  exams_completed: number;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  email: string;
  email_notifications: boolean;
  difficulty_preference: string;
  theme: string;
  language: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if token exists
        const token = typeof window !== 'undefined' && window.localStorage.getItem('access_token');
        if (!token) {
          setIsLoggedIn(false);
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }

        const response = await api.get('/profile/me');
        setProfile(response.data);
        setError(null);
        setIsLoggedIn(true);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setIsLoggedIn(false);
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load profile');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error, isLoggedIn };
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Check if token exists
        const token = typeof window !== 'undefined' && window.localStorage.getItem('access_token');
        if (!token) {
          setError('Please log in to load settings');
          setLoading(false);
          return;
        }

        const response = await api.get('/profile/settings');
        setSettings(response.data);
        setError(null);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load settings');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

export async function updateProfile(data: { full_name: string }): Promise<UserProfile> {
  const response = await api.patch('/profile/me', data);
  return response.data;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await api.post('/profile/change-password', {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return response.data;
}

export async function updateSettings(preferences: Record<string, any>): Promise<void> {
  await api.post('/profile/preferences', preferences);
}

export async function deactivateAccount(): Promise<void> {
  await api.post('/profile/deactivate');
}
