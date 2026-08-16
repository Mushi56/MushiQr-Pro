// src/services/authService.js
// ─── Centralized Authorization Service ─────────────────────────────────────
// Single source of truth for all Super Admin / role-based authorization.
// Used by AdminPanel, App.jsx, roleService, and all admin data operations.

import { useState, useEffect, useCallback } from 'react';
import { auth, functions } from './firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

// ─── Designated Super Admin Owner Email ────────────────────────────────────
// Must match the value in functions/index.js and firestore.rules.
export const SUPER_ADMIN_EMAIL = 'mabuneri143@gmail.com';

// ─── Pure utility functions (no hooks, safe to call anywhere) ──────────────

/**
 * Check if the given user is the designated Super Admin owner (by email).
 * This is used as a bootstrap fallback before custom claims are minted.
 */
export function isDesignatedOwner(user) {
  if (!user) return false;
  if (user.email === SUPER_ADMIN_EMAIL) return true;
  const providerEmails = (user.providerData || []).map(p => p.email).filter(Boolean);
  return providerEmails.includes(SUPER_ADMIN_EMAIL);
}

/**
 * Check if user has super_admin custom claim.
 */
export async function hasSuperAdminClaim(user) {
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.role === 'super_admin';
  } catch {
    return false;
  }
}

/**
 * Determine if the current Firebase user is a Super Admin.
 * Checks custom claims first, falls back to designated owner email.
 */
export async function checkIsSuperAdmin(user) {
  if (!user) return { isSuperAdmin: false, method: null };
  
  // Check custom claims first (authoritative)
  try {
    const tokenResult = await user.getIdTokenResult();
    if (tokenResult.claims.role === 'super_admin') {
      return { isSuperAdmin: true, method: 'custom_claim' };
    }
  } catch (e) {
    console.warn('[authService] Failed to check custom claims:', e);
  }

  // Fallback: designated owner email (bootstrap only)
  if (isDesignatedOwner(user)) {
    return { isSuperAdmin: true, method: 'owner_email' };
  }

  return { isSuperAdmin: false, method: null };
}

/**
 * Force-refresh the user's ID token to pick up newly minted custom claims.
 */
export async function refreshAuthSession() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const tokenResult = await user.getIdTokenResult(true); // force refresh
    return tokenResult.claims;
  } catch (e) {
    console.error('[authService] refreshAuthSession error:', e);
    return null;
  }
}

/**
 * Call the bootstrapSuperAdmin Cloud Function to self-mint super_admin claim.
 * Only works for the designated SUPER_ADMIN_EMAIL.
 */
export async function bootstrapSuperAdmin() {
  const fn = httpsCallable(functions, 'bootstrapSuperAdmin');
  const result = await fn({});
  return result.data;
}

/**
 * Derive the role string for a user from their ID token claims.
 */
export async function getUserRole(user) {
  if (!user) return 'user';
  try {
    const tokenResult = await user.getIdTokenResult();
    const claimRole = tokenResult.claims.role;
    if (claimRole) return claimRole;
    // Fallback for designated owner
    if (isDesignatedOwner(user)) return 'super_admin';
    return 'user';
  } catch {
    if (isDesignatedOwner(user)) return 'super_admin';
    return 'user';
  }
}

// ─── React Hook: useAuthState ──────────────────────────────────────────────

/**
 * React hook that provides real-time auth state including Super Admin detection.
 * Replaces duplicated onAuthStateChanged + getIdTokenResult patterns.
 *
 * Returns: { user, role, isSuperAdmin, isAdmin, isEditor, isSupport, loading, authMethod, refreshSession, bootstrap }
 */
export function useAuthState() {
  const [state, setState] = useState({
    user: auth.currentUser,
    role: 'user',
    isSuperAdmin: false,
    isAdmin: false,
    isEditor: false,
    isSupport: false,
    loading: true,
    authMethod: null, // 'custom_claim' | 'owner_email' | null
    needsBootstrap: false, // true if owner email but no custom claim
  });

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setState({
          user: null, role: 'user', isSuperAdmin: false, isAdmin: false,
          isEditor: false, isSupport: false, loading: false, authMethod: null,
          needsBootstrap: false,
        });
        return;
      }

      try {
        const { isSuperAdmin, method } = await checkIsSuperAdmin(user);
        const tokenResult = await user.getIdTokenResult();
        const claimRole = tokenResult.claims.role || 'user';
        const effectiveRole = isSuperAdmin ? 'super_admin' : claimRole;
        const effectiveIsAdmin = effectiveRole === 'super_admin' || effectiveRole === 'admin';

        setState({
          user,
          role: effectiveRole,
          isSuperAdmin,
          isAdmin: effectiveIsAdmin,
          isEditor: effectiveRole === 'editor' || effectiveIsAdmin,
          isSupport: effectiveRole === 'support' || effectiveIsAdmin,
          loading: false,
          authMethod: method,
          needsBootstrap: isSuperAdmin && method === 'owner_email',
        });
      } catch (e) {
        console.error('[authService] useAuthState error:', e);
        const fallbackSuperAdmin = isDesignatedOwner(user);
        setState({
          user,
          role: fallbackSuperAdmin ? 'super_admin' : 'user',
          isSuperAdmin: fallbackSuperAdmin,
          isAdmin: fallbackSuperAdmin,
          isEditor: fallbackSuperAdmin,
          isSupport: fallbackSuperAdmin,
          loading: false,
          authMethod: fallbackSuperAdmin ? 'owner_email' : null,
          needsBootstrap: fallbackSuperAdmin,
        });
      }
    });

    return unsub;
  }, []);

  const refreshSession = useCallback(async () => {
    const claims = await refreshAuthSession();
    if (claims) {
      // Trigger a re-check by forcing token refresh
      const user = auth.currentUser;
      if (user) {
        const { isSuperAdmin, method } = await checkIsSuperAdmin(user);
        const effectiveRole = isSuperAdmin ? 'super_admin' : (claims.role || 'user');
        const effectiveIsAdmin = effectiveRole === 'super_admin' || effectiveRole === 'admin';
        setState(prev => ({
          ...prev,
          role: effectiveRole,
          isSuperAdmin,
          isAdmin: effectiveIsAdmin,
          isEditor: effectiveRole === 'editor' || effectiveIsAdmin,
          isSupport: effectiveRole === 'support' || effectiveIsAdmin,
          authMethod: method,
          needsBootstrap: isSuperAdmin && method === 'owner_email',
        }));
      }
    }
    return claims;
  }, []);

  const bootstrap = useCallback(async () => {
    const result = await bootstrapSuperAdmin();
    if (result.success) {
      // Refresh token to pick up the new custom claim
      await refreshSession();
    }
    return result;
  }, [refreshSession]);

  return { ...state, refreshSession, bootstrap };
}
