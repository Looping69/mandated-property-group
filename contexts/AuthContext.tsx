/**
 * AuthContext.tsx
 * 
 * Re-exports Clerk's React SDK components and hooks.
 * This file exists to maintain backward compatibility with existing imports
 * throughout the codebase while using real Clerk authentication.
 * 
 * See: https://clerk.com/docs/react/getting-started/quickstart
 */

// Re-export Clerk hooks
export { useUser, useClerk, useAuth, useSession } from '@clerk/clerk-react';

// Re-export Clerk components
export {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  RedirectToSignIn,
} from '@clerk/clerk-react';

// Backward-compatible AuthProvider that's now a no-op since ClerkProvider
// is already wrapping the app in index.tsx
import React from 'react';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Re-export useUserRole hook for role-based access control
export { useUserRole, useHasRole } from '../hooks/useUserRole';
