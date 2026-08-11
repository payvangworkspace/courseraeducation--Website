import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Building2,
  Share2,
  Sliders,
  UserCheck,
  CreditCard,
  CheckCircle2,
  Send,
  AlertOctagon,
  Link as LinkIcon,
  ArrowUpRight,
  Code2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ExternalLink,
  Percent,
  Layers,
  Coins,
  Wallet,
  ShieldAlert,
  Mail,
  Activity
} from 'lucide-react';
import { authApi, clearAuthToken, getSessionUser } from '../../api';

function roleLabel(role) {
  const r = String(role || '').toUpperCase();
  if (r.includes('SUPER')) return 'Super Administrator';
  if (r.includes('ADMIN')) return 'Administrator';
  if (r.includes('MERCHANT')) return 'Merchant';
  return r || 'User';
}

function initialsFrom(name, email) {
  const source = (name || email || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function PayVangLayout({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const session = getSessionUser();

  const handleLogout = () => {
    authApi.logout({}).catch(() => {});
    clearAuthToken();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const navSections = [
    {
      title: 'DASHBOARD',
      items: [
        { label: 'Dashboard', href: '/home', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Super-Admin Dashboard', href: '/home/dashboard/super-admin-dashboard', icon: <ShieldCheck className="w-5 h-5" /> }
      ]
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { label: 'Merchants', href: '/home/user-management/merchants', icon: <Users className="w-5 h-5" /> },
        { label: 'Acquirers', href: '/home/user-management/acquirers', icon: <Building2 className="w-5 h-5" /> },
        { label: 'Fee & Limit Rules', href: '/home/user-management/fee-rules', icon: <Percent className="w-5 h-5" /> },
        { label: 'Aggregator Mappings', href: '/home/user-management/aggregator-mappings', icon: <Layers className="w-5 h-5" /> },
        { label: 'Crypto Config', href: '/home/user-management/crypto-config', icon: <Coins className="w-5 h-5" /> },
        { label: 'Resellers', href: '/home/user-management/resellers', icon: <Share2 className="w-5 h-5" /> },
        { label: 'Configurations', href: '/home/user-management/configurations', icon: <Sliders className="w-5 h-5" /> }
      ]
    },
    {
      title: 'WALLETS & ESCROW',
      items: [
        { label: 'Wallets & Escrow', href: '/home/wallets', icon: <Wallet className="w-5 h-5" /> }
      ]
    },
    {
      title: 'TEAMS',
      items: [
        { label: 'Teams', href: '/home/teams', icon: <UserCheck className="w-5 h-5" /> }
      ]
    },
    {
      title: 'PAYIN',
      items: [
        { label: 'Transactions', href: '/home/payin/transactions', icon: <CreditCard className="w-5 h-5" /> },
        { label: 'Settlements', href: '/home/payin/settlements', icon: <CheckCircle2 className="w-5 h-5" /> },
        { label: 'Remittance', href: '/home/payin/remittance', icon: <Send className="w-5 h-5" /> },
        { label: 'Chargeback', href: '/home/payin/chargeback', icon: <AlertOctagon className="w-5 h-5" /> }
      ]
    },
    {
      title: 'PAYMENTS LINKS & PAYOUT',
      items: [
        { label: 'Get Payment Link', href: '/home/payments-links', icon: <LinkIcon className="w-5 h-5" /> },
        { label: 'Payout', href: '/home/payout', icon: <ArrowUpRight className="w-5 h-5" /> }
      ]
    },
    {
      title: 'SECURITY & METRICS',
      items: [
        { label: 'IP Whitelist', href: '/home/security/ip-whitelist', icon: <ShieldAlert className="w-5 h-5" /> },
        { label: 'System Metrics', href: '/home/system-metrics', icon: <Activity className="w-5 h-5" /> }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Settings', href: '/home/settings', icon: <Settings className="w-5 h-5" /> },
        { label: 'Email Master', href: '/home/settings/email-master', icon: <Mail className="w-5 h-5" /> },
        { label: 'API Documentation', href: '/home/api-docs', icon: <Code2 className="w-5 h-5" /> }
      ]
    }
  ];

  const checkIsActive = (href) => {
    if (href === '/home') {
      return location.pathname === '/home';
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDF6EE', color: '#241417' }}>
      {/* PERSISTENT SIDEBAR */}
      <aside
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: '#FBF3E7',
          borderRight: '1px solid rgba(122, 31, 43, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          zIndex: 30,
          flexShrink: 0,
          width: collapsed ? '80px' : '260px',
          padding: collapsed ? '12px' : '20px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Logo & Toggle Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#7A1F2B' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#7A1F2B',
                  color: '#FDF6EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                  boxShadow: '0 4px 10px rgba(122,31,43,0.2)',
                  flexShrink: 0
                }}
              >
                C
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '15px', color: '#7A1F2B', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Coursera Education
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(122,31,43,0.15)',
                color: '#7A1F2B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* ADMIN PORTAL Role Badge */}
          {!collapsed && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(122, 31, 43, 0.1)', color: '#7A1F2B', border: '1px solid rgba(122, 31, 43, 0.2)', borderRadius: '9999px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <Sparkles style={{ width: '12px', height: '12px', color: '#7A1F2B' }} />
                ADMIN PORTAL
              </div>
            </div>
          )}

          {/* Navigation Items Scrollable */}
          <nav style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="scrollbar-none">
            {navSections.map((section, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                {!collapsed && section.title && (
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#9E8984', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '4px 12px', marginBottom: '4px' }}>
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  const isActive = checkIsActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      title={collapsed ? item.label : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        marginBottom: '3px',
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        color: isActive ? '#7A1F2B' : '#6b5a56',
                        boxShadow: isActive ? '0 2px 8px rgba(122, 31, 43, 0.05)' : 'none',
                        border: isActive ? '1px solid rgba(122, 31, 43, 0.12)' : '1px solid transparent',
                        justifyContent: collapsed ? 'center' : 'flex-start'
                      }}
                    >
                      <span style={{ color: isActive ? '#7A1F2B' : '#6b5a56', display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer User Info & Logout */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(122,31,43,0.12)', marginTop: '8px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                {initialsFrom(session.fullName, session.email)}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#241417', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={session.email}>
                    {session.fullName || session.email || 'User'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9E8984', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {roleLabel(session.user_role)}
                  </span>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              title="Log out of Admin Portal"
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(122,31,43,0.2)',
                color: '#7A1F2B',
                fontWeight: 700,
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOPBAR */}
        <header
          style={{
            backgroundColor: 'rgba(253, 246, 238, 0.95)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 20,
            borderBottom: '1px solid rgba(122, 31, 43, 0.12)',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: 0, letterSpacing: '-0.01em' }}>
              {title || 'Dashboard'}
            </h1>
            <p style={{ fontSize: '13px', color: '#6b5a56', fontWeight: 500, margin: '2px 0 0 0' }}>
              {subtitle || 'Overview of daily volume, payout settlements, and gateway velocity.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.25)', color: '#15803d', fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
              Live Admin Mode
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid rgba(122, 31, 43, 0.2)',
                fontSize: '12px',
                fontWeight: 700,
                color: '#7A1F2B',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Coursera Site
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: '1px solid rgba(122, 31, 43, 0.3)',
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#7A1F2B',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(122, 31, 43, 0.25)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT AREA WITH 28PX PADDING */}
        <main style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
