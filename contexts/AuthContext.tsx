import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, PERMISSIONS, DASHBOARD_URLS, Permission } from '../types';
import { userService, SignupParams, LoginParams } from '../services/userService';

// ============================================================================
// CONSTANTS
// ============================================================================

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// ============================================================================
// TYPES
// ============================================================================

interface AuthState {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: SignupParams) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getToken: () => string | null;
  getDashboardUrl: () => string;
  openSignIn: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// STORAGE HELPERS
// ============================================================================

function saveAuth(user: User, token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save auth state:', e);
  }
}

function clearAuth(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to clear auth state:', e);
  }
}

function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function loadUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoaded: false,
    isSignedIn: false,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const token = loadToken();
      const storedUser = loadUser();

      if (token && storedUser) {
        // Validate session with backend
        try {
          const freshUser = await userService.getCurrentUser();
          if (freshUser) {
            setState({
              user: freshUser,
              isLoaded: true,
              isSignedIn: true,
            });
            saveAuth(freshUser, token);
            return;
          }
        } catch (e) {
          console.warn('Session validation failed:', e);
        }

        // Session invalid, clear storage
        clearAuth();
      }

      setState({ user: null, isLoaded: true, isSignedIn: false });
    };

    initAuth();
  }, []);

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    const { user, token } = await userService.login({ email, password });
    saveAuth(user, token);
    setState({ user, isLoaded: true, isSignedIn: true });
  }, []);

  // Sign up
  const signUp = useCallback(async (params: SignupParams) => {
    const { user, token } = await userService.signup(params);
    saveAuth(user, token);
    setState({ user, isLoaded: true, isSignedIn: true });
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await userService.logout();
    clearAuth();
    setState({ user: null, isLoaded: true, isSignedIn: false });
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const freshUser = await userService.getCurrentUser();
    if (freshUser) {
      const token = loadToken();
      if (token) {
        saveAuth(freshUser, token);
      }
      setState(prev => ({ ...prev, user: freshUser }));
    }
  }, []);

  // Get token
  const getToken = useCallback(() => loadToken(), []);

  // Get dashboard URL based on role
  const getDashboardUrl = useCallback(() => {
    if (!state.user) return '/';
    return DASHBOARD_URLS[state.user.role] || '/';
  }, [state.user]);

  // Open sign in page
  const openSignIn = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshUser,
    getToken,
    getDashboardUrl,
    openSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// HOOKS
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUser() {
  const { user, isSignedIn, isLoaded } = useAuth();
  return { user, isSignedIn, isLoaded };
}

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return permission === 'view_listings';
    const rolePermissions = PERMISSIONS[user.role] as readonly string[];
    if (rolePermissions.includes('*')) return true;
    return rolePermissions.includes(permission);
  };

  return { hasPermission };
}

// ============================================================================
// COMPONENTS
// ============================================================================

export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
};

export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
};

export const SignInButton: React.FC = () => (
  <button onClick={() => window.location.href = '/login'}>Sign In</button>
);

export const SignUpButton: React.FC = () => (
  <button onClick={() => window.location.href = '/join'}>Sign Up</button>
);

export const RedirectToSignIn: React.FC = () => {
  useEffect(() => { window.location.href = '/login'; }, []);
  return null;
};

// User button with dropdown
import { LogOut, User as UserIcon, Settings } from 'lucide-react';

export const UserButton: React.FC = () => {
  const { user, signOut, getDashboardUrl } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const initials = user.firstName?.[0] || user.email[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm overflow-hidden">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.firstName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <span>{initials.toUpperCase()}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <div className="mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-green/10 text-brand-green uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={() => { window.location.href = getDashboardUrl(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <UserIcon size={16} /> My Dashboard
              </button>
              <button
                onClick={() => { window.location.href = '/settings'; setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Settings size={16} /> Settings
              </button>
            </div>

            <div className="border-t border-gray-50 pt-1">
              <button
                onClick={() => { signOut(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Legacy hook for Layout component - provides sign-in redirect functionality
 */
export function useClerk() {
  const { signOut, user, getDashboardUrl } = useAuth();

  const openSignIn = () => {
    window.location.href = '/login';
  };

  return { signOut, openSignIn, user, getDashboardUrl };
}

// Re-export hooks for compatibility
export { useUserRole, useHasRole } from '../hooks/useUserRole';

