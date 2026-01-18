import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PERMISSIONS, DASHBOARD_URLS, Permission } from '../types';
import { userService } from '../services/userService';
import { getAuthToken } from '../services/apiConfig';

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (params: any) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  openSignIn: () => void;
  getDashboardUrl: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('encore_session_token');
      const storedUser = localStorage.getItem('encore_user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally verify token with backend
          // const freshUser = await userService.getById(JSON.parse(storedUser).id);
          // if (freshUser) setUser(freshUser);
        } catch (e) {
          console.error("Failed to restore auth state", e);
          localStorage.removeItem('encore_session_token');
          localStorage.removeItem('encore_user');
        }
      }
      setIsLoaded(true);
    };
    initAuth();
  }, []);

  const signIn = async (email: string, password?: string) => {
    const { user, token } = await userService.login({ email, password });
    setUser(user);
    localStorage.setItem('encore_session_token', token);
    localStorage.setItem('encore_user', JSON.stringify(user));
  };

  const signUp = async (params: any) => {
    const { user, token } = await userService.signup(params);
    setUser(user);
    localStorage.setItem('encore_session_token', token);
    localStorage.setItem('encore_user', JSON.stringify(user));
  };

  const signOut = async () => {
    try {
      await userService.logout();
    } catch (e) {
      console.warn("Logout request failed on server", e);
    }
    setUser(null);
    localStorage.removeItem('encore_session_token');
    localStorage.removeItem('encore_user');
  };

  const getToken = async () => {
    return localStorage.getItem('encore_session_token');
  };

  const openSignIn = () => {
    // In this app, we navigate to the sign-in page
    window.location.href = '/login';
  };

  const getDashboardUrl = () => {
    if (!user) return '/';
    return DASHBOARD_URLS[user.role] || '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isSignedIn: !!user,
      isLoaded,
      signIn,
      signUp,
      signOut,
      getToken,
      openSignIn,
      getDashboardUrl
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useUser = () => {
  const { user, isSignedIn, isLoaded } = useAuth();
  return { user, isSignedIn, isLoaded };
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return permission === 'view_listings';

    const rolePermissions = PERMISSIONS[user.role];
    if ((rolePermissions as any).includes('*')) return true;
    return (rolePermissions as any).includes(permission);
  };

  return { hasPermission };
};

export const useClerk = () => {
  const { signOut, openSignIn, user, getDashboardUrl } = useAuth();
  return { signOut, openSignIn, user, getDashboardUrl };
};

export const useSession = () => {
  const { isSignedIn, isLoaded } = useAuth();
  return { session: isSignedIn ? {} : null, isLoaded };
};

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

// Mock components for compatibility
export const SignInButton: React.FC = () => <button onClick={() => window.location.href = '/login'}>Sign In</button>;
export const SignUpButton: React.FC = () => <button onClick={() => window.location.href = '/join'}>Sign Up</button>;
export const RedirectToSignIn: React.FC = () => {
  useEffect(() => { window.location.href = '/login'; }, []);
  return null;
};

// Custom UserButton that matches the existing UI look
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
export const UserButton: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm overflow-hidden">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.firstName} className="w-full h-full object-cover" />
          ) : (
            <span>{(user.firstName?.[0] || user.email[0]).toUpperCase()}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <div className="mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-green/10 text-brand-green uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="py-1">
              <button onClick={() => { window.location.href = getDashboardUrl(); setIsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <UserIcon size={16} /> My Dashboard
              </button>
              <button onClick={() => { window.location.href = '/settings'; setIsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
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

export { useUserRole, useHasRole } from '../hooks/useUserRole';
