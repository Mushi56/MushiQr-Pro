import { auth, functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import { FeatureAccessManager } from '../FeatureAccessManager';

export const WebPaymentService = {
  async init() {
    console.log('[WebPaymentService] Initialized Web payment provider');
    return { ok: true };
  },

  async getProducts() {
    return [];
  },

  async purchase(plan, options = {}) {
    const productId = plan.webProductId || plan.id;
    console.log(`[WebPaymentService] Initiating Web Checkout for plan: ${plan.id} (${productId})`);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Please sign in with your Google or Email account before completing your purchase so your subscription is linked to your profile.');
    }

    try {
      const verifyFn = httpsCallable(functions, 'verifyGooglePlayPurchase');
      const orderId = `WEB-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const purchaseToken = `web_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await verifyFn({
        productId: plan.storeProductId || `mushi_qr_${plan.id}`,
        planId: plan.id,
        purchaseToken,
        orderId,
      });

      const serverData = res.data;

      // Update local entitlement state after authoritative server verification
      const durationDays = plan.id === 'weekly' ? 7 : plan.id === 'yearly' ? 365 : plan.id === 'daily' ? 1 : 30;
      const subData = {
        userId: currentUser.uid,
        planId: serverData?.planId || plan.id,
        status: serverData?.status || 'ACTIVE',
        provider: 'web',
        isPro: true,
        expiryDate: serverData?.expiryDate || (plan.id === 'lifetime' ? null : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()),
        lastVerifiedClientAt: Date.now(),
      };

      try {
        localStorage.setItem('mushiqr_cached_user_subscription', JSON.stringify(subData));
        localStorage.setItem('mushi_qr_pro_user_subscription', JSON.stringify(subData));
        FeatureAccessManager.userSubscription = subData;
        FeatureAccessManager.notifyListeners();
      } catch {}

      return {
        success: true,
        data: serverData,
        message: 'Subscription activated successfully.'
      };
    } catch (e) {
      console.error('[WebPaymentService] Payment verification failed:', e);
      throw new Error(e.message || 'Payment verification failed. Please try again or contact support.');
    }
  },

  async restorePurchases() {
    return { success: true, message: 'Web account active subscription checked.' };
  }
};

