'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ApiRequestError } from './api-types';
import { apiAuthenticatedRequest } from './api-client';
import type { User } from '@/features/auth/types';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface LoginResponseData {
  user: User;
  accessToken: string;
  expiresIn: number;
}

interface AuthContextValue {
  user: User | null;
  status: SessionStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  /** Authenticated request to the backend, retrying once after a silent refresh on 401. */
  fetchWithAuth: <T>(path: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function callAuthRoute(path: string, body?: unknown): Promise<LoginResponseData> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json();
  if (!res.ok || !payload.success) {
    throw new ApiRequestError(payload.message || 'Request failed', res.status, payload.errors, payload.meta);
  }
  return payload.data as LoginResponseData;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');
  const accessTokenRef = useRef<string | null>(null);

  // The backend rotates the refresh token on every /auth/refresh call and treats reuse of
  // an already-rotated token as theft (revoking the whole session as a precaution — see
  // AuthService.refresh in the backend). If two refresh calls ever raced using the same
  // cookie — React Strict Mode's dev-only double-invoke of this mount effect being the most
  // common trigger, but concurrent fetchWithAuth() 401s from two components would do it too
  // — the second call would look like theft and log the user straight back out. Deduping
  // concurrent callers onto a single in-flight promise fixes it for every case, not just the
  // Strict Mode one.
  const refreshPromiseRef = useRef<Promise<LoginResponseData> | null>(null);
  const performRefresh = useCallback((): Promise<LoginResponseData> => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = callAuthRoute('/api/auth/refresh').finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    return refreshPromiseRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;
    performRefresh()
      .then((data) => {
        if (cancelled) return;
        accessTokenRef.current = data.accessToken;
        setUserState(data.user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        accessTokenRef.current = null;
        setUserState(null);
        setStatus('unauthenticated');
      });
    return () => {
      cancelled = true;
    };
  }, [performRefresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await callAuthRoute('/api/auth/login', { email, password });
    accessTokenRef.current = data.accessToken;
    setUserState(data.user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {
      // Clear local state regardless of network failure.
    });
    accessTokenRef.current = null;
    setUserState(null);
    setStatus('unauthenticated');
  }, []);

  const refreshSession = useCallback(async (): Promise<string | null> => {
    try {
      const data = await performRefresh();
      accessTokenRef.current = data.accessToken;
      setUserState(data.user);
      setStatus('authenticated');
      return data.accessToken;
    } catch {
      accessTokenRef.current = null;
      setUserState(null);
      setStatus('unauthenticated');
      return null;
    }
  }, [performRefresh]);

  const fetchWithAuth = useCallback(
    async <T,>(path: string, options?: RequestInit): Promise<T> => {
      if (!accessTokenRef.current) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          throw new ApiRequestError('Not authenticated', 401);
        }
      }
      try {
        return await apiAuthenticatedRequest<T>(path, accessTokenRef.current!, options);
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 401) {
          const refreshed = await refreshSession();
          if (refreshed) {
            return apiAuthenticatedRequest<T>(path, refreshed, options);
          }
        }
        throw error;
      }
    },
    [refreshSession],
  );

  const setUser = useCallback((nextUser: User) => setUserState(nextUser), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, logout, setUser, fetchWithAuth }),
    [user, status, login, logout, setUser, fetchWithAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
