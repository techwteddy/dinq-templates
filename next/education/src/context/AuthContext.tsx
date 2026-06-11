'use client';

import * as React from 'react';
import { User, AuthState } from '@/types';
import { authService } from '@/lib/auth-service';

interface AuthContextType extends AuthState {
  /** Logs in a user with the given credentials */
  login: (
    email: string,
    password?: string,
    rememberMe?: boolean
  ) => Promise<void>;
  /** Signs up a new user */
  signup: (data: Partial<User> & { password?: string }) => Promise<void>;
  /** Logs out the current user */
  logout: () => Promise<void>;
  /** Updates the current user's profile */
  updateProfile: (data: Partial<User>) => Promise<void>;
  /** Logs in via social provider */
  loginWithSocial: (provider: 'google' | 'apple') => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 *
 * Provides authentication state and methods to the application.
 * Manages user session and persistence.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from storage on mount
  React.useEffect(() => {
    const initAuth = () => {
      try {
        const user = authService.getCurrentUser();
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        console.error('Auth initialization failed', error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = React.useCallback(
    async (email: string, password?: string, rememberMe: boolean = false) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const user = await authService.login(email, password);

        // Handle persistence preference
        if (typeof window !== 'undefined') {
          const AUTH_STORAGE_KEY = 'eduplatform_auth_user';
          if (rememberMe) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
          } else {
            sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    []
  );

  const signup = React.useCallback(
    async (data: Partial<User> & { password?: string }) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const user = await authService.signup(data);

        // Default to sessionStorage for signup unless specified otherwise
        if (typeof window !== 'undefined') {
          const AUTH_STORAGE_KEY = 'eduplatform_auth_user';
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        }

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    []
  );

  const logout = React.useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const updateProfile = React.useCallback(async (data: Partial<User>) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.updateProfile(data);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const loginWithSocial = React.useCallback(
    async (provider: 'google' | 'apple') => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const user = await authService.socialLogin(provider);

        // Persist session
        if (typeof window !== 'undefined') {
          const AUTH_STORAGE_KEY = 'eduplatform_auth_user';
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        }

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
        loginWithSocial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the auth context
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
