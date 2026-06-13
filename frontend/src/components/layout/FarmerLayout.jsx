// KisanSaathi — Farmer Layout
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/farmer', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/farmer/schemes', label: 'Govt Schemes', icon: '📋' },
  { to: '/farmer/complaints', label: 'My Complaints', icon: '📝' },
  { to: '/farmer/market', label: 'Market Prices', icon: '💹' },
  { to: '/farmer/learning', label: 'Learning Hub', icon: '🎓' },
  { to: '/farmer/profile', label: 'My Profile', icon: '👤' },
];

export default function FarmerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }} />}

      {/* Sidebar */}
      <aside style={{ ...S.sidebar, transform: open ? 'translateX(0)' : undefined }}>
        <div style={S.brand}>
          <span style={{ fontSize: 30 }}>🌾</span>
          <div>
            <div style={S.brandName}>KisanSaathi</div>
            <div style={S.brandSub}>Agriculture Portal</div>
          </div>
        </div>

        <div style={S.userChip}>
          <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={S.userName}>{user?.name}</div>
            <div style={S.userMeta}>{user?.state || 'Farmer'}</div>
          </div>
        </div>

        <nav style={S.nav}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              style={({ isActive }) => ({ ...S.navItem, ...(isActive ? S.navActive : {}) })}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} style={S.logoutBtn}>🚪 Logout</button>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 245, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={S.topbar}>
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', display: 'none' }}>☰</button>
          <span style={S.topbarTitle}>🌾 KisanSaathi</span>
          <span style={S.topbarUser}>👤 {user?.name}</span>
        </header>
        <main style={{ padding: '28px 32px', flex: 1 }}><Outlet /></main>
      </div>
    </div>
  );
}

const S = {
  sidebar: { width: 245, background: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, transition: 'transform 0.3s' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  brandName: { fontSize: 17, fontWeight: 800, color: '#a5d6a7' },
  brandSub: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 },
  userChip: { display: 'flex', alignItems: 'center', gap: 10, margin: '12px', padding: '10px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: 9 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: '#e07b24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 },
  userName: { fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userMeta: { fontSize: 11, color: '#a5d6a7' },
  nav: { flex: 1, padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 3 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 8, color: 'rgba(255,255,255,0.72)', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'all 0.17s' },
  navActive: { background: '#4caf50', color: '#fff', fontWeight: 700 },
  logoutBtn: { margin: '12px', padding: '10px', background: 'rgba(255,255,255,0.07)', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', fontFamily: 'Mukta', fontSize: 15 },
  topbar: { background: '#fff', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 50 },
  topbarTitle: { fontWeight: 800, color: '#1b4332', fontSize: 18 },
  topbarUser: { fontSize: 14, color: '#5a7a5a', fontWeight: 600 },
};
