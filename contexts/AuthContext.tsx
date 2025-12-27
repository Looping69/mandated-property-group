
import React, { createContext, useContext, useState } from 'react';

// Mock User Type
interface User {
  id: string;
  fullName: string;
  primaryEmailAddress: { emailAddress: string };
  imageUrl: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  openSignIn: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = () => {
    setUser({
      id: 'mock_user_123',
      fullName: 'Victoria St. Clair',
      primaryEmailAddress: { emailAddress: 'victoria@mandated.co.za' },
      imageUrl: 'https://picsum.photos/id/64/300/300'
    });
  };

  const signOut = () => setUser(null);
  const openSignIn = signIn; // Auto sign in for demo purposes

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, openSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useUser must be used within AuthProvider");
  return { 
    user: context.user, 
    isSignedIn: !!context.user, 
    isLoaded: true 
  };
};

export const useClerk = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useClerk must be used within AuthProvider");
  return { 
    openSignIn: context.openSignIn, 
    signOut: context.signOut 
  };
};

export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useUser();
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useUser();
  return !isSignedIn ? <>{children}</> : null;
};

export const UserButton: React.FC<{ afterSignOutUrl?: string }> = () => {
  const { user, signOut } = useContext(AuthContext)!;
  if (!user) return null;
  return (
    <button onClick={signOut} className="w-8 h-8 rounded-full overflow-hidden border-2 border-brand-green hover:opacity-80 transition-opacity" title="Sign Out">
      <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
    </button>
  );
};

export const RedirectToSignIn: React.FC = () => {
    const { openSignIn } = useClerk();
    React.useEffect(() => { openSignIn() }, [openSignIn]);
    return <div className="p-4 text-center">Redirecting to login...</div>;
};
