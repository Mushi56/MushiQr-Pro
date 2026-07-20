/**
 * adminService.js
 * Asynchronous data access layer for SaaS-grade Super Admin Panel.
 * Designed to be local-first (localStorage) and drop-in compatible with Firebase/Firestore.
 */

// Helper to simulate network latency if needed, or immediately resolve
const delay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

// Keys
const KEYS = {
  SETTINGS: 'qrgen_app_settings',
  FLAGS: 'qrgen_feature_flags',
  TEMPLATES: 'qrgen_cloud_templates',
  ANNOUNCEMENT: 'qrgen_announcement',
  USERS: 'qrgen_admin_users_list',
  ADMINS: 'qrgen_admin_admins_list',
  PLANS: 'qrgen_admin_plans',
  PAYMENTS: 'qrgen_admin_payments',
  TICKETS: 'qrgen_admin_tickets',
  AUDIT_LOGS: 'qrgen_admin_audit_logs',
  INTEGRATIONS: 'qrgen_admin_integrations',
  API_KEYS: 'qrgen_admin_api_keys'
};

// Initial/Seed Data generators if storage is empty
const getOrSeed = (key, defaultVal) => {
  const val = localStorage.getItem(key);
  if (val) {
    try { return JSON.parse(val); } catch { return defaultVal; }
  }
  localStorage.setItem(key, JSON.stringify(defaultVal));
  return defaultVal;
};

// Core Local Service
export const adminService = {
  // --- Dashboard Statistics & Overview ---
  async getDashboardStats() {
    await delay();
    const users = await this.getUsers();
    const premiumUsers = users.filter(u => u.type === 'Premium').length;
    const payments = await this.getPayments();
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Read real QRs generated count from app history
    let realQRsCount = 0;
    try {
      const history = JSON.parse(localStorage.getItem('qrgen_history') || '[]');
      const saved = JSON.parse(localStorage.getItem('qrgen_saved') || '[]');
      realQRsCount = history.length + saved.length;
    } catch {}

    return {
      totalUsers: users.length,
      usersGrowth: '+12.5%',
      premiumUsers: premiumUsers,
      premiumGrowth: '+8.3%',
      revenue: totalRevenue,
      revenueGrowth: '+15.7%',
      qrsCreated: realQRsCount || 98765, // Real count or reference default if app is clean
      qrsGrowth: '+10.2%'
    };
  },

  // --- Users Module ---
  async getUsers() {
    await delay();
    const defaults = [
      { id: 'u1', name: 'John Doe', email: 'john.doe@email.com', type: 'Premium', status: 'Active', joined: 'May 18, 2025' },
      { id: 'u2', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', type: 'Free', status: 'Active', joined: 'May 18, 2025' },
      { id: 'u3', name: 'Michael Brown', email: 'michael.brown@email.com', type: 'Trial', status: 'Active', joined: 'May 17, 2025' },
      { id: 'u4', name: 'Emily Johnson', email: 'emily.j@email.com', type: 'Premium', status: 'Active', joined: 'May 17, 2025' },
      { id: 'u5', name: 'David Lee', email: 'david.lee@email.com', type: 'Free', status: 'Inactive', joined: 'May 16, 2025' }
    ];
    return getOrSeed(KEYS.USERS, defaults);
  },

  async saveUser(user) {
    await delay();
    const users = await this.getUsers();
    if (user.id) {
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) users[idx] = user;
    } else {
      user.id = 'usr_' + Date.now().toString(36);
      user.joined = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      users.unshift(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    await this.logActivity('Users', `Saved user: ${user.name} (${user.email})`);
    return user;
  },

  async deleteUser(id) {
    await delay();
    const users = await this.getUsers();
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    await this.logActivity('Users', `Deleted user ID: ${id}`);
    return true;
  },

  // --- Admin Users & Permissions ---
  async getAdmins() {
    await delay();
    const defaults = [
      { id: 'a1', name: 'Mushtaq Ahmed', email: 'mabuneri143@gmail.com', role: 'Super Admin', status: 'Active' },
      { id: 'a2', name: 'Admin Assistant', email: 'assistant@mushiqr.pro', role: 'Moderator', status: 'Active' }
    ];
    return getOrSeed(KEYS.ADMINS, defaults);
  },

  async saveAdmin(admin) {
    await delay();
    const admins = await this.getAdmins();
    if (admin.id) {
      const idx = admins.findIndex(a => a.id === admin.id);
      if (idx !== -1) admins[idx] = admin;
    } else {
      admin.id = 'adm_' + Date.now().toString(36);
      admins.unshift(admin);
    }
    localStorage.setItem(KEYS.ADMINS, JSON.stringify(admins));
    await this.logActivity('Security', `Saved admin user: ${admin.email}`);
    return admin;
  },

  async deleteAdmin(id) {
    await delay();
    const admins = await this.getAdmins();
    const updated = admins.filter(a => a.id !== id);
    localStorage.setItem(KEYS.ADMINS, JSON.stringify(updated));
    await this.logActivity('Security', `Revoked admin access for ID: ${id}`);
    return true;
  },

  // --- Subscriptions & Pricing Plans ---
  async getPlans() {
    await delay();
    const defaults = [
      { id: 'p1', name: 'Free Basic', price: 0, interval: 'month', features: ['Scan Limits', 'Basic QR Generation'] },
      { id: 'p2', name: 'Pro Premium', price: 9.99, interval: 'month', features: ['Unlimited Scans', 'Premium Vector Templates', 'No Ads', 'Batch Generation'] },
      { id: 'p3', name: 'SaaS Developer', price: 49.99, interval: 'month', features: ['Unlimited Scans', 'Developer APIs', 'Custom Webhooks', 'Team Roles'] }
    ];
    return getOrSeed(KEYS.PLANS, defaults);
  },

  async savePlan(plan) {
    await delay();
    const plans = await this.getPlans();
    if (plan.id) {
      const idx = plans.findIndex(p => p.id === plan.id);
      if (idx !== -1) plans[idx] = plan;
    } else {
      plan.id = 'pln_' + Date.now().toString(36);
      plans.push(plan);
    }
    localStorage.setItem(KEYS.PLANS, JSON.stringify(plans));
    await this.logActivity('Billing', `Updated billing plan: ${plan.name}`);
    return plan;
  },

  // --- Payments & Revenue ---
  async getPayments() {
    await delay();
    const defaults = [
      { id: 'tx1', user: 'John Doe', plan: 'Pro Premium', amount: 9.99, status: 'Completed', date: 'May 18, 2025' },
      { id: 'tx2', user: 'Emily Johnson', plan: 'SaaS Developer', amount: 49.99, status: 'Completed', date: 'May 17, 2025' },
      { id: 'tx3', user: 'Jane Smith', plan: 'Pro Premium', amount: 9.99, status: 'Refunded', date: 'May 15, 2025' }
    ];
    return getOrSeed(KEYS.PAYMENTS, defaults);
  },

  // --- Support Tickets ---
  async getTickets() {
    await delay();
    const defaults = [
      { id: 't1', user: 'John Doe', subject: 'Vector Export Quality', message: 'Hi, SVG download cuts off the custom logos sometimes.', status: 'Open', date: 'May 19, 2025', replies: [] },
      { id: 't2', user: 'Sarah Wilson', subject: 'Billing Issue', message: 'I was charged twice on my monthly renewal.', status: 'Closed', date: 'May 18, 2025', replies: [{ sender: 'Admin', message: 'Refund processed successfully.' }] }
    ];
    return getOrSeed(KEYS.TICKETS, defaults);
  },

  async addTicketReply(id, reply) {
    await delay();
    const tickets = await this.getTickets();
    const idx = tickets.findIndex(t => t.id === id);
    if (idx !== -1) {
      tickets[idx].replies.push(reply);
      tickets[idx].status = 'Answered';
      localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
    }
    return tickets;
  },

  // --- System Configuration (App Settings, Flags, Remote Config) ---
  async getAppSettings() {
    await delay();
    const defaults = {
      appName: 'Mushi QR Pro',
      brandColor: '#D60036',
      welcomeText: 'Create and scan QR codes instantly!',
      maintenanceMode: false
    };
    return getOrSeed(KEYS.SETTINGS, defaults);
  },

  async saveAppSettings(settings) {
    await delay();
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    await this.logActivity('Settings', 'App configurations updated');
    return settings;
  },

  async getFeatureFlags() {
    await delay();
    const defaults = {
      qr_generator: true,
      barcode_generator: true,
      scanner: true,
      bulk_generation: true,
      templates: true
    };
    return getOrSeed(KEYS.FLAGS, defaults);
  },

  async saveFeatureFlags(flags) {
    await delay();
    localStorage.setItem(KEYS.FLAGS, JSON.stringify(flags));
    await this.logActivity('Settings', 'Feature flags toggled');
    return flags;
  },

  async getAnnouncements() {
    await delay();
    const defaults = {
      title: 'Welcome to Version 1.2!',
      message: 'Explore beautiful background QR vector templates now live.',
      active: true
    };
    return getOrSeed(KEYS.ANNOUNCEMENT, defaults);
  },

  async saveAnnouncements(announcement) {
    await delay();
    localStorage.setItem(KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
    await this.logActivity('Settings', 'Updated system announcements');
    return announcement;
  },

  // --- Integrations & Developer Options ---
  async getIntegrations() {
    await delay();
    const defaults = [
      { id: 'i1', name: 'Slack Webhook', url: 'https://hooks.slack.com/services/...', active: true },
      { id: 'i2', name: 'Zapier Connector', url: 'https://hooks.zapier.com/...', active: false }
    ];
    return getOrSeed(KEYS.INTEGRATIONS, defaults);
  },

  async saveIntegration(item) {
    await delay();
    const items = await this.getIntegrations();
    if (item.id) {
      const idx = items.findIndex(i => i.id === item.id);
      if (idx !== -1) items[idx] = item;
    } else {
      item.id = 'int_' + Date.now().toString(36);
      items.push(item);
    }
    localStorage.setItem(KEYS.INTEGRATIONS, JSON.stringify(items));
    return item;
  },

  async getApiKeys() {
    await delay();
    const defaults = [
      { id: 'k1', name: 'Production Client Key', key: 'mqp_live_5893a7df8b12f689ce9f0a2', created: 'May 10, 2025' }
    ];
    return getOrSeed(KEYS.API_KEYS, defaults);
  },

  async generateApiKey(name) {
    await delay();
    const keys = await this.getApiKeys();
    const hex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: 'key_' + Date.now().toString(36),
      name: name,
      key: `mqp_live_${hex}`,
      created: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    keys.push(newKey);
    localStorage.setItem(KEYS.API_KEYS, JSON.stringify(keys));
    await this.logActivity('Developer', `Generated API Key: ${name}`);
    return newKey;
  },

  // --- Audit & Activity Logs ---
  async getAuditLogs() {
    await delay();
    const defaults = [
      { id: 'l1', module: 'Security', action: 'Authorized root admin login', date: 'May 19, 2025 21:04:12' },
      { id: 'l2', module: 'Settings', action: 'Disabled Vector Templates preview debug flags', date: 'May 18, 2025 10:20:45' }
    ];
    return getOrSeed(KEYS.AUDIT_LOGS, defaults);
  },

  async logActivity(module, action) {
    const logs = await this.getAuditLogs();
    logs.unshift({
      id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
      module,
      action,
      date: new Date().toLocaleString()
    });
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  // --- Backup & Restore (Local) ---
  async createBackup() {
    await delay();
    const payload = {};
    for (const key of Object.values(KEYS)) {
      payload[key] = localStorage.getItem(key);
    }
    // Also include general app data
    payload['qrgen_app_settings'] = localStorage.getItem('qrgen_app_settings');
    payload['qrgen_feature_flags'] = localStorage.getItem('qrgen_feature_flags');
    payload['qrgen_cloud_templates'] = localStorage.getItem('qrgen_cloud_templates');
    payload['qrgen_announcement'] = localStorage.getItem('qrgen_announcement');

    const dataStr = JSON.stringify(payload);
    return dataStr;
  },

  async restoreBackup(jsonStr) {
    await delay();
    try {
      const payload = JSON.parse(jsonStr);
      for (const [key, value] of Object.entries(payload)) {
        if (value !== null) {
          localStorage.setItem(key, value);
        }
      }
      await this.logActivity('System', 'Restored system database backup');
      return true;
    } catch {
      throw new Error('Invalid backup file formatting');
    }
  }
};
