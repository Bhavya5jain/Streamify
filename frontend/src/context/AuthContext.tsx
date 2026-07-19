import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';

interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avtar: string;
  coverImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Rehydrate from localStorage on first load
    try {
      const stored = localStorage.getItem('streamify_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify the session is still valid on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/getCurrentUser`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const fetchedUser = data?.data;
          setUser(fetchedUser);
          localStorage.setItem('streamify_user', JSON.stringify(fetchedUser));
        } else {
          // Session expired or invalid
          setUser(null);
          localStorage.removeItem('streamify_user');
          localStorage.removeItem('accessToken');
        }
      } catch {
        // Backend unreachable — keep existing localStorage user if any
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = useCallback(async (email: string, password: string, username?: string) => {
    const body: Record<string, string> = { password };
    if (email) body.email = email;
    if (username) body.username = username;

    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Login failed');

    const loggedInUser = data?.data?.user;
    const accessToken = data?.data?.accessToken;
    setUser(loggedInUser);
    localStorage.setItem('streamify_user', JSON.stringify(loggedInUser));
    if (accessToken) localStorage.setItem('accessToken', accessToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch { /* ignore network errors on logout */ }
    setUser(null);
    localStorage.removeItem('streamify_user');
    localStorage.removeItem('accessToken');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
