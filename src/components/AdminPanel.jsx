import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  QrCode, 
  FolderGit2, 
  Activity, 
  Settings, 
  Globe, 
  ToggleLeft, 
  AlertTriangle, 
  Megaphone, 
  UserCheck, 
  ShieldAlert, 
  FileClock, 
  Lock, 
  Database, 
  ActivitySquare, 
  Network, 
  Key, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  MoreVertical, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  AlertCircle, 
  Loader2, 
  HelpCircle, 
  LogOut, 
  RefreshCw, 
  Download, 
  Upload,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { adminService } from '../utils/adminService';
import { QR_TEMPLATES } from '../utils/qrTemplates';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [stats, setStats] = useState({
    totalUsers: 24812,
    usersGrowth: '+12.5%',
    premiumUsers: 6853,
    premiumGrowth: '+8.3%',
    revenue: 18765,
    revenueGrowth: '+15.7%',
    qrsCreated: 98765,
    qrsGrowth: '+10.2%'
  });
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [appSettings, setAppSettings] = useState({
    appName: 'Mushi QR Pro',
    brandColor: '#D60036',
    welcomeText: 'Create and scan QR codes instantly!',
    maintenanceMode: false
  });
  const [featureFlags, setFeatureFlags] = useState({
    qr_generator: true,
    barcode_generator: true,
    scanner: true,
    bulk_generation: true,
    templates: true
  });
  const [announcements, setAnnouncements] = useState({
    title: '',
    message: '',
    active: false
  });
  const [cloudTemplates, setCloudTemplates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  
  // Modal & Form States
  const [userModal, setUserModal] = useState({ open: false, mode: 'add', data: null });
  const [adminModal, setAdminModal] = useState({ open: false, data: null });
  const [planModal, setPlanModal] = useState({ open: false, data: null });
  const [keyModal, setKeyModal] = useState({ open: false, name: '' });
  const [integrationModal, setIntegrationModal] = useState({ open: false, name: '', url: '', active: true });
  
  // File Import Ref
  const fileInputRef = useRef(null);

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load All Data
  const loadData = async () => {
    setLoading(true);
    try {
      const s = await adminService.getDashboardStats();
      setStats(s);
      
      const u = await adminService.getUsers();
      setUsers(u);
      
      const a = await adminService.getAdmins();
      setAdmins(a);
      
      const p = await adminService.getPlans();
      setPlans(p);
      
      const pay = await adminService.getPayments();
      setPayments(pay);
      
      const t = await adminService.getTickets();
      setTickets(t);
      
      const settings = await adminService.getAppSettings();
      setAppSettings(settings);
      
      const flags = await adminService.getFeatureFlags();
      setFeatureFlags(flags);
      
      const announce = await adminService.getAnnouncements();
      setAnnouncements(announce);
      
      const templates = await adminService.getAppSettings(); // Just reference cloud templates from localStorage
      const savedTemplates = JSON.parse(localStorage.getItem('qrgen_cloud_templates') || '[]');
      setCloudTemplates(savedTemplates);

      const logs = await adminService.getAuditLogs();
      setAuditLogs(logs);

      const keys = await adminService.getApiKeys();
      setApiKeys(keys);

      const ints = await adminService.getIntegrations();
      setIntegrations(ints);

    } catch (err) {
      showToast('Error loading system data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Actions ---
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      id: userModal.data?.id,
      name: formData.get('name'),
      email: formData.get('email'),
      type: formData.get('type'),
      status: formData.get('status')
    };
    try {
      await adminService.saveUser(userData);
      showToast('User saved successfully');
      setUserModal({ open: false, mode: 'add', data: null });
      loadData();
    } catch {
      showToast('Error saving user', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await adminService.deleteUser(id);
      showToast('User account deleted');
      loadData();
    }
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const adminData = {
      id: adminModal.data?.id,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status')
    };
    try {
      await adminService.saveAdmin(adminData);
      showToast('Administrator updated');
      setAdminModal({ open: false, data: null });
      loadData();
    } catch {
      showToast('Error saving administrator', 'error');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (confirm('Revoke access for this administrator?')) {
      await adminService.deleteAdmin(id);
      showToast('Administrator privileges revoked');
      loadData();
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const planData = {
      id: planModal.data?.id,
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      interval: formData.get('interval'),
      features: formData.get('features').split(',').map(f => f.trim())
    };
    await adminService.savePlan(planData);
    showToast('Pricing plan updated');
    setPlanModal({ open: false, data: null });
    loadData();
  };

  const handleSaveSettings = async () => {
    await adminService.saveAppSettings(appSettings);
    showToast('Global application configurations saved');
  };

  const handleToggleFlag = async (key) => {
    const updated = { ...featureFlags, [key]: !featureFlags[key] };
    setFeatureFlags(updated);
    await adminService.saveFeatureFlags(updated);
    showToast(`Feature flag '${key}' updated`);
  };

  const handleSaveAnnouncement = async () => {
    await adminService.saveAnnouncements(announcements);
    showToast('Broadcast banner updated');
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    await adminService.generateApiKey(keyModal.name);
    showToast('New developer API Key generated');
    setKeyModal({ open: false, name: '' });
    loadData();
  };

  const handleCreateIntegration = async (e) => {
    e.preventDefault();
    await adminService.saveIntegration({
      name: integrationModal.name,
      url: integrationModal.url,
      active: integrationModal.active
    });
    showToast('Integration webhook configured');
    setIntegrationModal({ open: false, name: '', url: '', active: true });
    loadData();
  };

  const handleCreateBackup = async () => {
    try {
      const dataStr = await adminService.createBackup();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mushi_qr_backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      showToast('System configuration backup downloaded');
    } catch {
      showToast('Backup creation failed', 'error');
    }
  };

  const handleRestoreBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        await adminService.restoreBackup(evt.target.result);
        showToast('System backup restored successfully');
        loadData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  // Sidebar links definition
  const navigationItems = [
    {
      group: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'reports', label: 'Reports', icon: BarChart3 }
      ]
    },
    {
      group: 'CONTENT',
      items: [
        { id: 'templates', label: 'Templates', icon: Layers },
        { id: 'qr_barcode', label: 'QR & Barcode', icon: QrCode },
        { id: 'categories', label: 'Categories', icon: FolderGit2 },
        { id: 'bulk_ops', label: 'Bulk Operations', icon: Activity }
      ]
    },
    {
      group: 'APP MANAGEMENT',
      items: [
        { id: 'app_settings', label: 'App Settings', icon: Settings },
        { id: 'remote_config', label: 'Remote Config', icon: Globe },
        { id: 'feature_flags', label: 'Feature Flags', icon: ToggleLeft },
        { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
        { id: 'announcements', label: 'Announcements', icon: Megaphone }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'admin_users', label: 'Admin Users', icon: UserCheck },
        { id: 'roles_permissions', label: 'Roles & Permissions', icon: ShieldAlert },
        { id: 'activity_logs', label: 'Activity Logs', icon: FileClock },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'backups', label: 'Backups', icon: Database }
      ]
    }
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#030305',
      color: '#F3F4F6',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative'
    }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          zIndex: 11000,
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <Check size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0B0C10',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 5000,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '@media (min-width: 1024px)': {
          transform: 'none'
        }
      }} className="admin-sidebar">
        
        {/* Sidebar Header Brand */}
        <div style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D60036 0%, #FF007F 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(214, 0, 54, 0.3)'
          }}>
            <QrCode size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>Mushi QR Pro</h2>
            <span style={{ fontSize: '11px', color: '#D60036', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Super Admin</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }} className="custom-scrollbar">
          {navigationItems.map((group, gIdx) => (
            <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.3)',
                paddingLeft: '12px',
                marginBottom: '4px',
                letterSpacing: '1px'
              }}>{group.group}</span>
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={iIdx}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: isActive ? 'rgba(214, 0, 54, 0.1)' : 'transparent',
                      color: isActive ? '#FF3B30' : 'rgba(255, 255, 255, 0.65)',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      width: '100%'
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? '#D60036' : 'inherit' }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Badge */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(214, 0, 54, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#FF3B30',
                fontSize: '13px'
              }}>MA</div>
              <div style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '2px solid #0B0C10'
              }} />
            </div>
            <div>
              <h4 style={{ fontSize: '13px', margin: 0, fontWeight: 700 }}>Mushtaq Ahmed</h4>
              <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>Super Admin</span>
            </div>
          </div>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer'
          }}>
            <MoreVertical size={16} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div style={{
        flex: 1,
        marginLeft: '260px',
        padding: '32px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        minWidth: 0 // Prevents grid overflow issues
      }} className="admin-main-viewport">
        
        {/* Header Control Bar */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'none'
            }} className="admin-menu-toggle">
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px'
          }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.35)'
            }} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'white',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10.5px',
              color: 'rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontWeight: 700
            }}>⌘ K</span>
          </div>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#D60036'
              }} />
            </button>
            
            <button style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer'
            }}>
              <Moon size={20} />
            </button>

            <div style={{
              width: '1px',
              height: '20px',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#D60036',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12.5px'
              }}>MA</div>
              <span style={{ fontSize: '13px', fontWeight: 600 }} className="admin-header-username">Mushtaq Ahmed</span>
            </div>
          </div>
        </header>

        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(3,3,5,0.7)',
            zIndex: 4000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)'
          }}>
            <Loader2 className="spinner" size={40} style={{ color: '#D60036' }} />
          </div>
        )}

        {/* Render Tab Contents */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome banner */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>Welcome back, Super Admin 👋</h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '14.5px', fontWeight: 500 }}>Here's what's happening with Mushi QR Pro today.</p>
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>May 12 – May 18, 2025</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Metric Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {[
                { title: 'Total Users', val: stats.totalUsers.toLocaleString(), growth: stats.usersGrowth, color: '#8884d8', icon: Users },
                { title: 'Premium Users', val: stats.premiumUsers.toLocaleString(), growth: stats.premiumGrowth, color: '#38bdf8', icon: UserCheck },
                { title: 'Revenue', val: `$${stats.revenue.toLocaleString()}`, growth: stats.revenueGrowth, color: '#10b981', icon: CreditCard },
                { title: 'QR Codes Created', val: stats.qrsCreated.toLocaleString(), growth: stats.qrsGrowth, color: '#f59e0b', icon: QrCode }
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div key={idx} style={{
                    backgroundColor: '#0B0C10',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '24px',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 700 }}>{card.title}</span>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CardIcon size={18} />
                      </div>
                    </div>
                    <div>
                      <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{card.val}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px' }}>
                        <span style={{ color: '#10B981', fontWeight: 800 }}>{card.growth}</span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontWeight: 600 }}>vs last 7 days</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
              '@media (max-width: 1024px)': {
                gridTemplateColumns: '1fr'
              }
            }} className="admin-charts-row">
              
              {/* Line Chart Container */}
              <div style={{
                backgroundColor: '#0B0C10',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>User & Revenue Overview</h3>
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>7 Days</span>
                    <ChevronDown size={12} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8884d8' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Users</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Premium Users</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Revenue (USD)</span>
                  </div>
                </div>

                {/* SVG Graph Drawing */}
                <div style={{ width: '100%', height: '240px', position: 'relative', marginTop: '10px' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Grids */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Path 1: Users */}
                    <path d="M 0 110 L 83 95 L 166 100 L 250 85 L 333 90 L 416 98 L 500 70" fill="none" stroke="#8884d8" strokeWidth="2.5" />
                    {/* Path 2: Premium Users */}
                    <path d="M 0 160 L 83 150 L 166 142 L 250 148 L 333 140 L 416 143 L 500 130" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    {/* Path 3: Revenue */}
                    <path d="M 0 130 L 83 125 L 166 115 L 250 110 L 333 118 L 416 122 L 500 100" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  </svg>
                  
                  {/* Labels */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                    <span>May 12</span>
                    <span>May 13</span>
                    <span>May 14</span>
                    <span>May 15</span>
                    <span>May 16</span>
                    <span>May 17</span>
                    <span>May 18</span>
                  </div>
                </div>
              </div>

              {/* Donut User Distribution */}
              <div style={{
                backgroundColor: '#0B0C10',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>User Distribution</h3>
                
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px', position: 'relative' }}>
                  <svg width="150" height="150" viewBox="0 0 36 36">
                    {/* Circular Rings */}
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                    
                    {/* Free Users: 72.4% */}
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#8884d8" strokeWidth="3" 
                      strokeDasharray="72.4 27.6" strokeDashoffset="25" />
                    
                    {/* Premium Users: 27.6% */}
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="#38bdf8" strokeWidth="3.5" 
                      strokeDasharray="27.6 72.4" strokeDashoffset="-47.4" />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <span style={{ fontSize: '20px', fontWeight: 800 }}>24,812</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Total Users</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  {[
                    { label: 'Free Users', count: '17,959', pct: '72.4%', color: '#8884d8' },
                    { label: 'Premium Users', count: '6,853', pct: '27.6%', color: '#38bdf8' },
                    { label: 'Trial Users', count: '1,234', pct: '4.9%', color: '#10b981' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                        <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{item.label}</span>
                      </div>
                      <span style={{ fontWeight: 700 }}>{item.count} <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10.5px' }}>({item.pct})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details Table & Health Check */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
              '@media (max-width: 1024px)': {
                gridTemplateColumns: '1fr'
              }
            }} className="admin-details-row">
              
              {/* Recent Users list */}
              <div style={{
                backgroundColor: '#0B0C10',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Recent Users</h3>
                  <button onClick={() => setActiveTab('users')} style={{
                    background: 'none', border: 'none', color: '#D60036', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                  }}>View All</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: 700 }}>User</th>
                        <th style={{ padding: '12px 8px', fontWeight: 700 }}>Email</th>
                        <th style={{ padding: '12px 8px', fontWeight: 700 }}>Type</th>
                        <th style={{ padding: '12px 8px', fontWeight: 700 }}>Status</th>
                        <th style={{ padding: '12px 8px', fontWeight: 700 }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map((u, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)',
                              display: 'flex', alignItems: 'center', justifyContext: 'center', fontSize: '11px', fontWeight: 700
                            }}>
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              backgroundColor: u.type === 'Premium' ? 'rgba(56, 189, 248, 0.15)' : u.type === 'Trial' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)',
                              color: u.type === 'Premium' ? '#38bdf8' : u.type === 'Trial' ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                              padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700
                            }}>{u.type}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              color: u.status === 'Active' ? '#10B981' : '#EF4444',
                              fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: u.status === 'Active' ? '#10B981' : '#EF4444' }} />
                              {u.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{u.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System status checks */}
              <div style={{
                backgroundColor: '#0B0C10',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>System Status</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'Firestore Database', status: 'Operational' },
                    { name: 'Firebase Authentication', status: 'Operational' },
                    { name: 'Firebase Storage', status: 'Operational' },
                    { name: 'Cloud Functions', status: 'Operational' },
                    { name: 'Remote Config', status: 'Operational' },
                    { name: 'App Check', status: 'Operational' }
                  ].map((service, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          display: 'flex', alignItems: 'center', justifyContext: 'center', color: '#10B981'
                        }}>
                          <Check size={12} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{service.name}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 800 }}>{service.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Navigation links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {[
                { title: 'Manage Templates', desc: 'Create, edit and manage QR code templates', tab: 'templates', color: '#a855f7' },
                { title: 'App Configuration', desc: 'Manage app settings and remote configuration', tab: 'app_settings', color: '#3b82f6' },
                { title: 'User Management', desc: 'View and manage all registered users', tab: 'users', color: '#10b981' },
                { title: 'View Reports', desc: 'Detailed analytics and usage reports', tab: 'reports', color: '#f97316' }
              ].map((action, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveTab(action.tab)}
                  style={{
                    backgroundColor: '#0B0C10',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = action.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: action.color }}>{action.title}</h4>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{action.desc}</p>
                  <ChevronRight size={16} style={{
                    position: 'absolute', right: '16px', bottom: '16px', color: 'rgba(255,255,255,0.2)'
                  }} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Registered Users</h1>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Overview of client accounts, tiers, and login status.</p>
              </div>
              <button 
                onClick={() => setUserModal({ open: true, mode: 'add', data: null })}
                style={{
                  backgroundColor: '#D60036', color: 'white', border: 'none', borderRadius: '10px',
                  padding: '10px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(214, 0, 54, 0.25)'
                }}
              >
                <Plus size={16} />
                <span>Create User</span>
              </button>
            </div>

            <div style={{ backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 700 }}>Name</th>
                    <th style={{ padding: '12px 8px', fontWeight: 700 }}>Email</th>
                    <th style={{ padding: '12px 8px', fontWeight: 700 }}>Tier</th>
                    <th style={{ padding: '12px 8px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 8px', fontWeight: 700 }}>Joined</th>
                    <th style={{ padding: '12px 8px', fontWeight: 700, textOrigin: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          backgroundColor: u.type === 'Premium' ? 'rgba(56, 189, 248, 0.15)' : u.type === 'Trial' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.05)',
                          color: u.type === 'Premium' ? '#38bdf8' : u.type === 'Trial' ? '#f59e0b' : 'rgba(255,255,255,0.6)',
                          padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700
                        }}>{u.type}</span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ color: u.status === 'Active' ? '#10B981' : '#EF4444', fontWeight: 700 }}>{u.status}</span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.45)' }}>{u.joined}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => setUserModal({ open: true, mode: 'edit', data: u })}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Vector Layout Templates</h1>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>System-wide templates accessible to all users.</p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {QR_TEMPLATES.map((tpl) => (
                <div key={tpl.id} style={{
                  backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{
                    height: '180px', backgroundColor: 'rgba(255,255,255,0.02)', position: 'relative',
                    backgroundImage: tpl.bgImage ? `url(${tpl.bgImage})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}>
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '6px',
                      fontSize: '11px', fontWeight: 700
                    }}>{tpl.category}</div>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>{tpl.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                      <span>Size: {Math.round(tpl.qrSize * 100)}%</span>
                      <span>Pos: ({Math.round(tpl.qrX * 100)}%, {Math.round(tpl.qrY * 100)}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Settings Tab */}
        {activeTab === 'app_settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Application Settings</h1>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Customize branding colors, titles, and global states.</p>
            </div>

            <div style={{
              backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px'
            }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>App Name</label>
                <input 
                  type="text" 
                  value={appSettings.appName} 
                  onChange={(e) => setAppSettings({ ...appSettings, appName: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Brand Accent Color</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="color" 
                    value={appSettings.brandColor} 
                    onChange={(e) => setAppSettings({ ...appSettings, brandColor: e.target.value })}
                    style={{
                      width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none'
                    }}
                  />
                  <input 
                    type="text" 
                    value={appSettings.brandColor} 
                    onChange={(e) => setAppSettings({ ...appSettings, brandColor: e.target.value })}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '14px', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Homepage Welcome Banner Text</label>
                <textarea 
                  value={appSettings.welcomeText} 
                  onChange={(e) => setAppSettings({ ...appSettings, welcomeText: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>Maintenance Outage Mode</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Lock all front-end services and display system notice.</p>
                </div>
                <button 
                  onClick={() => setAppSettings({ ...appSettings, maintenanceMode: !appSettings.maintenanceMode })}
                  style={{
                    backgroundColor: appSettings.maintenanceMode ? '#D60036' : 'rgba(255,255,255,0.05)',
                    color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {appSettings.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              <button 
                onClick={handleSaveSettings}
                style={{
                  backgroundColor: '#D60036', color: 'white', border: 'none', borderRadius: '10px',
                  padding: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%',
                  boxShadow: '0 4px 15px rgba(214, 0, 54, 0.25)'
                }}
              >
                Save Configurations
              </button>
            </div>
          </div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'feature_flags' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>System Feature Toggles</h1>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Toggle feature accessibility live without redeploying code.</p>
            </div>

            <div style={{
              backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
              padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px'
            }}>
              {Object.entries(featureFlags).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '13.5px', textTransform: 'capitalize', fontWeight: 700 }}>{key.replace('_', ' ')}</h4>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>ID: {key}</span>
                  </div>
                  <button 
                    onClick={() => handleToggleFlag(key)}
                    style={{
                      backgroundColor: value ? '#10B981' : 'rgba(255,255,255,0.05)',
                      color: value ? 'white' : 'rgba(255,255,255,0.3)',
                      border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 800, fontSize: '11px', cursor: 'pointer'
                    }}
                  >
                    {value ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backups Tab */}
        {activeTab === 'backups' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Backups & System Restoration</h1>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Export or restore all database records, templates, configurations, and user logs.</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '800px'
            }}>
              {/* Export Panel */}
              <div style={{
                backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                    <Download size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Database Export</h3>
                    <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)' }}>Download state as JSON</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>Create a complete backup snapshot of settings, feature flags, announcements, admin accounts, integration webhooks, and analytics metrics.</p>
                <button 
                  onClick={handleCreateBackup}
                  style={{
                    backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
                    padding: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: 'auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <Download size={14} />
                  <span>Download JSON Backup</span>
                </button>
              </div>

              {/* Import Panel */}
              <div style={{
                backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <Upload size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>Database Restoration</h3>
                    <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)' }}>Restore settings from JSON</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>Select a previously exported Mushi QR backup file to restore system configurations. Existing local variables will be overwritten.</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleRestoreBackup} 
                  accept=".json" 
                  style={{ display: 'none' }}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px',
                    padding: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: 'auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  <Upload size={14} />
                  <span>Upload & Restore Backup</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>System Broadcast Announcements</h1>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Configure notification alerts displayed on user dashboard banners.</p>
            </div>

            <div style={{
              backgroundColor: '#0B0C10', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px'
            }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Broadcast Title</label>
                <input 
                  type="text" 
                  value={announcements.title} 
                  onChange={(e) => setAnnouncements({ ...announcements, title: e.target.value })}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Alert Description Message</label>
                <textarea 
                  value={announcements.message} 
                  onChange={(e) => setAnnouncements({ ...announcements, message: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '13.5px', fontWeight: 700 }}>Show Broadcast Banner</h4>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(255,255,255,0.4)' }}>Toggle displaying this banner live on client interfaces.</p>
                </div>
                <button 
                  onClick={() => setAnnouncements({ ...announcements, active: !announcements.active })}
                  style={{
                    backgroundColor: announcements.active ? '#10B981' : 'rgba(255,255,255,0.05)',
                    color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 800, fontSize: '11px', cursor: 'pointer'
                  }}
                >
                  {announcements.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              <button 
                onClick={handleSaveAnnouncement}
                style={{
                  backgroundColor: '#D60036', color: 'white', border: 'none', borderRadius: '10px',
                  padding: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', width: '100%',
                  boxShadow: '0 4px 15px rgba(214, 0, 54, 0.25)'
                }}
              >
                Publish Announcement
              </button>
            </div>
          </div>
        )}

        {/* Fallback View for Non-Implemented Tabs */}
        {!['dashboard', 'users', 'templates', 'app_settings', 'feature_flags', 'backups', 'announcements'].includes(activeTab) && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '60vh', textAlign: 'center', gap: '16px'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.02)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.2)'
            }}>
              <HelpCircle size={40} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>{activeTab.replace('_', ' ').toUpperCase()} Module Empty State</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '13.5px', maxWidth: '380px', lineHeight: 1.4 }}>
                This section is configured to be local-first. Seed sample data or restore from a backup to display records.
              </p>
            </div>
            <button 
              onClick={loadData}
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <RefreshCw size={14} />
              <span>Retry Reloading Data</span>
            </button>
          </div>
        )}

      </div>

      {/* Add/Edit User Modal */}
      {userModal.open && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#0B0C10', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px',
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                {userModal.mode === 'add' ? 'Create User' : 'Edit User'}
              </h3>
              <button 
                onClick={() => setUserModal({ open: false, mode: 'add', data: null })}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  defaultValue={userModal.data?.name || ''}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  defaultValue={userModal.data?.email || ''}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Membership Tier</label>
                <select 
                  name="type"
                  defaultValue={userModal.data?.type || 'Free'}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Account Status</label>
                <select 
                  name="status"
                  defaultValue={userModal.data?.status || 'Active'}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button 
                type="submit"
                style={{
                  backgroundColor: '#D60036', color: 'white', border: 'none', borderRadius: '8px',
                  padding: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: '10px'
                }}
              >
                Confirm Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
