import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuizPage from './pages/QuizPage';
import Leaderboard from './pages/Leaderboard';
import MyResults from './pages/MyResults';

/* ── Guards ─────────────────────────────────────────── */
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <AccessDenied />;
  return children;
};

const AppLoader = () => (
  <div style={{
    minHeight: '100dvh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16,
    background: 'linear-gradient(145deg,#f0f4ff 0%,#e8eeff 40%,#f5f0ff 100%)',
  }}>
    <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color: '#6366f1' }}>SVHEC</div>
    <div style={{ display: 'flex', gap: 6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: '#6366f1',
          animation: `dot 1.2s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
    </div>
    <style>{`@keyframes dot{0%,100%{opacity:.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
  </div>
);

const AccessDenied = () => {
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '80dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 360, width: '100%', padding: '44px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 18 }}>🚫</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: 14 }}>You don't have permission to view this page.</p>
        <button className="btn btn-primary btn-full" onClick={() => nav('/')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

const BlockedScreen = () => {
  const { logout } = useAuth();
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--color-bg)' }}>
      <div className="card" style={{ maxWidth: 380, width: '100%', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,59,48,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="36" height="36" fill="none" stroke="#ff3b30" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 12 }}>Account Blocked</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
          Your account has been blocked by the administrator. Contact admin for assistance.
        </p>
        <button className="btn btn-danger btn-full" onClick={logout} style={{ fontSize: 15 }}>Sign Out</button>
      </div>
    </div>
  );
};

/* ── Header ─────────────────────────────────────────── */
const Header = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <button onClick={() => nav('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#6c63ff,#a29bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(108,99,255,0.28)', flexShrink: 0 }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 12 }}>SV</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div className="brand-logo" style={{ fontSize: 16 }}>SVHEC</div>
            <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Quiz Portal</div>
          </div>
        </button>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAdmin && <span className="badge badge-purple" style={{ display: 'none' }} id="admin-badge">Admin</span>}
          
          {/* User chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 6px', borderRadius: 100, background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#a29bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name?.split(' ')[0]}
            </span>
            {isAdmin && <span style={{ fontSize: 10, background: 'var(--brand-accent-glow)', color: 'var(--brand-accent)', padding: '1px 6px', borderRadius: 100, fontWeight: 700 }}>Admin</span>}
          </div>

          {/* Logout */}
          <button onClick={logout} className="btn btn-ghost btn-sm btn-pill" style={{ fontSize: 13, padding: '7px 14px' }}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

/* ── Routes ─────────────────────────────────────────── */
const AppRoutes = () => {
  const { user, isBlocked } = useAuth();
  if (user && isBlocked && user.role !== 'admin') return <BlockedScreen />;
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={
        <PrivateRoute roles={['user','admin']}>
          {user?.role === 'admin' ? <Navigate to="/admin" replace /> : <UserDashboard />}
        </PrivateRoute>
      } />
      <Route path="/quiz/:id" element={<PrivateRoute roles={['user']}><QuizPage /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute roles={['user','admin']}><Leaderboard /></PrivateRoute>} />
      <Route path="/my-results"  element={<PrivateRoute roles={['user']}><MyResults /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
    </Routes>
  );
};

/* ── App Shell (inside AuthProvider context) ───────────── */
const AppShell = () => {
  const { user } = useAuth();
  if (!user) {
    // Auth pages: true full-screen, no header wrapper
    return (
      <div style={{ minHeight: '100dvh', background: 'linear-gradient(145deg,#f0f4ff 0%,#e8eeff 40%,#f5f0ff 100%)' }}>
        <AppRoutes />
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#f0f4ff 0%,#eef0ff 50%,#f5f0ff 100%)' }}>
      <Header />
      <main className="page-wrap page-in">
        <AppRoutes />
      </main>
    </div>
  );
};

/* ── App ────────────────────────────────────────────── */
const App = () => (
  <Router>
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  </Router>
);

export default App;
