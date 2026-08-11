// src/services/premiumContext.jsx
// ─── Premium Subscription Context ──────────────────────────────────────────
// Provides premium status, plan info, and paywall control throughout the app.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getSubscriptionPlans,
  getPremiumFeatures,
  getUserSubscription,
  saveUserSubscription,
} from './adminDataService';

const PremiumCtx = createContext(null);

// ─── Duration helpers (for auto-expiry) ────────────────────────────────────
const PERIOD_MS = {
  day:     24 * 60 * 60 * 1000,
  week:    7  * 24 * 60 * 60 * 1000,
  month:   30 * 24 * 60 * 60 * 1000,
  year:    365 * 24 * 60 * 60 * 1000,
  forever: Infinity,
};

function isSubscriptionActive(sub) {
  if (!sub || sub.planId === 'free' || !sub.planId) return false;
  if (sub.cancelled) return false;
  if (!sub.startedAt) return false;
  const period = sub.period || 'month';
  const durationMs = PERIOD_MS[period] || PERIOD_MS.month;
  if (durationMs === Infinity) return true;
  const start = new Date(sub.startedAt).getTime();
  return Date.now() < start + durationMs;
}

// ─── Provider ──────────────────────────────────────────────────────────────
export function PremiumProvider({ children }) {
  const [user, setUser]                     = useState(null);
  const [subscription, setSubscription]     = useState(null);
  const [plans, setPlans]                   = useState([]);
  const [premiumFeatures, setPremiumFeatures] = useState([]);
  const [paywallOpen, setPaywallOpen]       = useState(false);
  const [paywallFeature, setPaywallFeature] = useState(null);
  const [loading, setLoading]               = useState(true);

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  // Load global config + user subscription
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, f] = await Promise.all([
          getSubscriptionPlans(),
          getPremiumFeatures(),
        ]);
        if (!cancelled) {
          setPlans(p);
          setPremiumFeatures(f);
        }
      } catch (e) {
        console.error('[Premium] Failed to load config:', e);
      }
      // Load user subscription
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
  const isPremium = isSubscriptionActive(subscription);
  const currentPlan = isPremium
    ? plans.find(p => p.id === subscription?.planId) || null
    : plans.find(p => p.id === 'free') || null;

  const canAccess = useCallback((featureId) => {
    // Super admin always has access
    if (user?.email === 'mabuneri143@gmail.com') return true;
    if (!featureId) return true;
    const feature = premiumFeatures.find(f => f.id === featureId);
    if (!feature) return true; // Feature not gated
    if (!feature.plans || feature.plans.length === 0) return true; // No plan restriction
    if (feature.plans.includes('free')) return true;
    if (!isPremium || !subscription?.planId) return false;
    return feature.plans.includes(subscription.planId);
  }, [isPremium, subscription, premiumFeatures, user]);

  const showPaywall = useCallback((featureId = null) => {
    setPaywallFeature(featureId);
    setPaywallOpen(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setPaywallOpen(false);
    setPaywallFeature(null);
  }, []);

  const subscribe = useCallback(async (planId) => {
    if (!user?.uid) return;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const sub = {
      planId,
      period: plan.period,
      startedAt: new Date().toISOString(),
      cancelled: false,
      userEmail: user.email || '',
      userName: user.displayName || '',
    };
    await saveUserSubscription(user.uid, sub);
    setSubscription(sub);
    setPaywallOpen(false);
    setPaywallFeature(null);
  }, [user, plans]);

  const cancelSubscription = useCallback(async () => {
    if (!user?.uid || !subscription) return;
    const updated = { ...subscription, cancelled: true, cancelledAt: new Date().toISOString() };
    await saveUserSubscription(user.uid, updated);
    setSubscription(updated);
  }, [user, subscription]);

  // Gate helper: returns true if accessible, otherwise opens paywall & returns false
  const requirePremium = useCallback((featureId) => {
    if (canAccess(featureId)) return true;
    showPaywall(featureId);
    return false;
  }, [canAccess, showPaywall]);

  const value = {
    user,
    isPremium,
    currentPlan,
    subscription,
    plans,
    premiumFeatures,
    canAccess,
    requirePremium,
    showPaywall,
    hidePaywall,
    paywallOpen,
    paywallFeature,
    subscribe,
    cancelSubscription,
    loading,
  };

  return <PremiumCtx.Provider value={value}>{children}</PremiumCtx.Provider>;
}

export function usePremium() {
  const ctx = useContext(PremiumCtx);
  if (!ctx) {
    // Return safe fallback when not inside provider (e.g. admin panel)
    return {
      isPremium: true,
      currentPlan: null,
      canAccess: () => true,
      requirePremium: () => true,
      showPaywall: () => {},
      hidePaywall: () => {},
      paywallOpen: false,
      plans: [],
      premiumFeatures: [],
      loading: false,
    };
  }
  return ctx;
}
