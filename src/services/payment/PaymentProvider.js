// src/services/payment/PaymentProvider.js
// ─── Platform-Agnostic Payment Provider Interface ──────────────────────────
// Routes purchase flows to GooglePlayBillingService on Android and WebPaymentService on Web.

import { GooglePlayBillingService } from './GooglePlayBillingService';
import { WebPaymentService } from './WebPaymentService';

export const PaymentProvider = {
  isNativeAndroid() {
    return typeof window !== 'undefined' && 
           Boolean(window.Capacitor?.isNativePlatform && window.Capacitor.getPlatform() === 'android');
  },

  async init() {
    if (this.isNativeAndroid()) {
      return GooglePlayBillingService.init();
    }
    return WebPaymentService.init();
  },

  async getProducts() {
    if (this.isNativeAndroid()) {
      return GooglePlayBillingService.getProducts();
    }
    return WebPaymentService.getProducts();
  },

  async purchase(plan, options = {}) {
    if (this.isNativeAndroid()) {
      return GooglePlayBillingService.purchase(plan, options);
    }
    return WebPaymentService.purchase(plan, options);
  },

  async restorePurchases() {
    if (this.isNativeAndroid()) {
      return GooglePlayBillingService.restorePurchases();
    }
    return WebPaymentService.restorePurchases();
  }
};
