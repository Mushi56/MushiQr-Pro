// src/services/roleService.js
// ─── Firebase Custom Claim Role Authorization System ──────────────────────
// Provides real-time custom claim role checking, ID token token refresh,
// and React custom claim role hooks.

import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onIdTokenChanged } from 'firebase/auth';

/**
 * Custom React Hook: Listens to auth state and returns user custom claim role
 */
export function useUserRole() {
  const [roleState, setRoleState] = useState({
    user: auth.currentUser,
    role: 'user',
    isSuperAdmin: false,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (u) => {
      if (!u) {
        setRoleState({
          user: null,
          role: 'user',
          isSuperAdmin: false,
          isAdmin: false,
          loading: false,
        });
        return;
      }
      try {
        const tokenResult = await u.getIdTokenResult();
        const role = tokenResult.claims.role || 'user';
        const isSuperAdmin = role === 'super_admin';
        const isAdmin = role === 'admin' || isSuperAdmin;
        setRoleState({
          user: u,
          role,
          isSuperAdmin,
          isAdmin,
          loading: false,
        });
      } catch (e) {
        console.error('[roleService] Error inspecting ID token claims:', e);
        setRoleState({
          user: u,
          role: 'user',
          isSuperAdmin: false,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return unsub;
  }, []);

  return roleState;
}

/**
 * Utility: Fetch current custom claim role for a user
 */
export async function getUserRole(user) {
  if (!user) return 'user';
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.role || 'user';
  } catch (e) {
    console.error('[roleService] getUserRole error:', e);
    return 'user';
  }
}

/**
 * Utility: Force refresh ID token to get latest custom claims from Firebase Auth
 */
export async function refreshUserToken() {
  if (!auth.currentUser) return null;
  try {
    const tokenResult = await auth.currentUser.getIdTokenResult(true);
    return tokenResult.claims;
  } catch (e) {
    console.error('[roleService] refreshUserToken error:', e);
    return null;
  }
}
