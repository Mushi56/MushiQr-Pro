// src/services/premiumContext.jsx
// ─── Premium Subscription Context ──────────────────────────────────────────
// Delegates entitlement and gating logic to FeatureAccessManager.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getSubscriptionPlans,
  getUserSubscription,
  saveUserSubscription,
} from './adminDataService';
import { FeatureAccessManager, FEATURE_REGISTRY, REASON } from './FeatureAccessManager';

const PremiumCtx = createContext(null);

export function PremiumProvider({ children }) {
  const [user, setUser]                     = useState(null);
  const [subscription, setSubscription]     = useState(null);
  const [plans, setPlans]                   = useState([]);
  const [paywallOpen, setPaywallOpen]       = useState(false);
  const [paywallFeature, setPaywallFeature] = useState(null);
  const [loading, setLoading]               = useState(true);

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  // Sync state with FeatureAccessManager
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        await FeatureAccessManager.refreshFeatureConfiguration();
        const p = await getSubscriptionPlans();
        if (!cancelled) setPlans(p);
      } catch (e) {
        console.error('[Premium] Failed to load config:', e);
      }

      if (user?.uid) {
        try {
          const sub = await getUserSubscription(user.uid);
          if (!cancelled) setSubscription(sub);
        } catch (e) {
          console.error('[Premium] Failed to load user sub:', e);
        }
      } else {
        if (!cancelled) setSubscription(null);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  // Derived state
  const effectivePlan = FeatureAccessManager.getEffectivePlan();
  const isPremium = effectivePlan === 'pro' || effectivePlan === 'lifetime';
  const currentPlan = plans.find(p => p.id === effectivePlan) || plans.find(p => p.id === 'free') || null;

  const canAccess = useCallback((featureId) => {
    return FeatureAccessManager.isFeatureAllowed(featureId);
  }, []);

  const showPaywall = useCallback((featureId = null) => {
    setPaywallFeature(featureId);
    setPaywallOpen(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setPaywallOpen(false);
    setPaywallFeature(null);
  }, []);

  const requirePremium = useCallback((featureId) => {
    const access = FeatureAccessManager.canAccess(featureId);
    if (access.allowed) return true;
    showPaywall(featureId);
    return false;
  }, [showPaywall]);

  const value = {
    user,
    isPremium,
    currentPlan,
    subscription,
    plans,
    premiumFeatures: FEATURE_REGISTRY,
    canAccess,
    requirePremium,
    showPaywall,
    hidePaywall,
    paywallOpen,
    paywallFeature,
    loading,
  };

  return <PremiumCtx.Provider value={value}>{children}</PremiumCtx.Provider>;
}

export function usePremium() {
  const ctx = useContext(PremiumCtx);
  if (!ctx) {
    return {
      isPremium: true,
      currentPlan: null,
      canAccess: () => true,
      requirePremium: () => true,
      showPaywall: () => {},
      hidePaywall: () => {},
      paywallOpen: false,
      plans: [],
      premiumFeatures: FEATURE_REGISTRY,
      loading: false,
    };
  }
  return ctx;
}

