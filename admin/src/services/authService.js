// admin/src/services/authService.js
// â”€â”€â”€ Super Admin Dedicated Authorization Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, functions } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

export const SUPER_ADMIN_EMAIL = 'mabuneri143@gmail.com';

/**
 * Check if the given user is the designated Super Admin owner (by email).
 */
export function isDesignatedOwner(user) {
  if (!user) return false;
  if (user.email === SUPER_ADMIN_EMAIL) return true;
  const providerEmails = (user.providerData || []).map(p => p.email).filter(Boolean);
  return providerEmails.includes(SUPER_ADMIN_EMAIL);
}

/**
 * Check if user has super_admin custom claim or matches designated email.
 */
export async function checkIsSuperAdmin(user) {
  if (!user) return { isSuperAdmin: false, method: null, role: 'unauthenticated' };
  
  try {
    const tokenResult = await user.getIdTokenResult(true); // force fresh token
    if (tokenResult.claims.role === 'super_admin' || tokenResult.claims.superAdmin === true) {
      return { isSuperAdmin: true, method: 'custom_claim', role: 'super_admin' };
    }
  } catch (e) {
    console.warn('[authService] Custom claims check error:', e);
  }

  // Fallback: designated owner email
  if (isDesignatedOwner(user)) {
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
      setLoading(true);
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
        setAuthError(e?.message);
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
export async function logoutAdmin() {
  await signOut(auth);
  localStorage.removeItem('mushiqr_admin_session');
}

/**
 * Self-mint custom claim via Cloud Function
 */
export async function bootstrapSuperAdmin() {
  try {
    const fn = httpsCallable(functions, 'bootstrapSuperAdmin');
    const result = await fn({});
    if (auth.currentUser) {
      await auth.currentUser.getIdTokenResult(true);
    }
    return result.data;
  } catch (e) {
    console.error('[authService] bootstrapSuperAdmin error:', e);
    throw e;
  }
}
