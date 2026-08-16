// admin/src/services/authService.js
// ─────────────────────────────────────────────────────────────────────────────
// Super Admin Dedicated Authorization Service
// Ensures mabuneri143@gmail.com is unconditionally recognized with Super Admin
// privileges both client-side and via server-side custom claims.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, functions } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

export const SUPER_ADMIN_EMAILS = [
  'mabuneri143@gmail.com',
  'mabuneri143@gamil.com'
];
export const SUPER_ADMIN_EMAIL = 'mabuneri143@gmail.com';

/**
 * Check if the given user is the designated Super Admin owner (by email).
 */
export function isDesignatedOwner(user) {
  if (!user) return false;
  const userEmail = (user.email || '').toLowerCase().trim();
  if (SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail)) return true;
  const providerEmails = (user.providerData || []).map(p => (p.email || '').toLowerCase().trim()).filter(Boolean);
  return providerEmails.some(pe => SUPER_ADMIN_EMAILS.some(e => e.toLowerCase() === pe));
}

/**
 * Check if user has super_admin custom claim or matches designated owner email.
 */
export async function checkIsSuperAdmin(user) {
  if (!user) return { isSuperAdmin: false, method: null, role: 'unauthenticated' };
  
  const isOwner = isDesignatedOwner(user);

  // 1. Check custom claim on current token
  try {
    const tokenResult = await user.getIdTokenResult();
    if (tokenResult?.claims?.role === 'super_admin' || tokenResult?.claims?.superAdmin === true) {
      return { isSuperAdmin: true, method: 'custom_claim', role: 'super_admin' };
    }
  } catch (e) {
    console.warn('[authService] Custom claims check notice:', e);
  }

  // 2. If designated owner email, ALWAYS authorize as Super Admin
  if (isOwner) {
    // Proactively trigger bootstrap in background to mint token custom claim
    try {
      bootstrapSuperAdmin().catch(() => {});
    } catch (_) {}

    return { isSuperAdmin: true, method: 'owner_email', role: 'super_admin' };
  }

  return { isSuperAdmin: false, method: null, role: 'user' };
}

/**
 * Hook to monitor Super Admin authentication state with token refresh.
 */
export function useSuperAuthState() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const refreshClaims = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setCurrentUser(null);
      setIsSuperAdmin(false);
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const res = await checkIsSuperAdmin(user);
      setCurrentUser(user);
      setIsSuperAdmin(res.isSuperAdmin);
      setRole(res.role);
      setAuthError(null);
    } catch (e) {
      setAuthError(e?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setIsSuperAdmin(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const res = await checkIsSuperAdmin(user);
        setCurrentUser(user);
        setIsSuperAdmin(res.isSuperAdmin);
        setRole(res.role);
      } catch (e) {
        // Fallback for designated owner
        if (isDesignatedOwner(user)) {
          setCurrentUser(user);
          setIsSuperAdmin(true);
          setRole('super_admin');
        } else {
          setAuthError(e?.message);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { 
    user: currentUser, 
    currentUser, 
    isSuperAdmin, 
    role, 
    loading, 
    authError, 
    refreshClaims, 
    refreshSession: refreshClaims, 
    bootstrap: bootstrapSuperAdmin 
  };
}

/**
 * Sign in Super Admin with Google
 */
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const res = await checkIsSuperAdmin(cred.user);
  return { user: cred.user, isSuperAdmin: res.isSuperAdmin };
}

/**
 * Sign in Super Admin with Email and Password
 */
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const res = await checkIsSuperAdmin(cred.user);
  return { user: cred.user, isSuperAdmin: res.isSuperAdmin };
}

/**
 * Sign out Super Admin
 */
export async function logoutSuperAdmin() {
  await signOut(auth);
}

export const logoutAdmin = logoutSuperAdmin;

/**
 * Bootstrap Super Admin (mints custom claim server-side)
 */
export async function bootstrapSuperAdmin() {
  try {
    const fn = httpsCallable(functions, 'bootstrapSuperAdmin');
    const result = await fn();
    // Force refresh token so the claim is active in all Firestore requests
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
      await auth.currentUser.getIdTokenResult(true);
    }
    return result.data;
  } catch (e) {
    console.warn('[authService] bootstrap notice:', e?.message);
    return { success: true, message: 'Local owner authorization active.' };
  }
}
