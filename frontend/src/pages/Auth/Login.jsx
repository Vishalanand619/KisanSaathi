import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      toast.success('Welcome to KisanSaathi! 🌾');
      navigate(res.role === 'admin' ? '/admin' : '/farmer');
    } else toast.error(res.message);
  };

  
  const fillDemo = (role) => {
    setForm({ email: `${role}@kisansaathi.com`, password: 'Admin@123' });
  };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>🌾</div>
          <h1 style={S.heroTitle}>KisanSaathi</h1>
          <p style={S.heroHindi}>किसान साथी — हर कदम पर आपके साथ</p>
          <p style={S.heroDesc}>Complete agriculture support portal with real government schemes, live Agmarknet market prices, weather forecasts, and complaint management.</p>
          <div style={S.features}>
            {['📋 8 Real Govt Schemes (PM-KISAN, PMFBY, KCC…)', '💹 Live Agmarknet Mandi Prices', '🌤️ Farm Weather Forecasts', '📝 End-to-End Complaint Tracking', '📩 Scheme Application System'].map(f => (
              <div key={f} style={S.featureChip}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      
      <div style={S.formSide}>
        <div style={S.formCard}>
          <h2 style={S.formTitle}>Welcome Back</h2>
          <p style={S.formSub}>Sign in to your KisanSaathi account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required placeholder="your@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="Enter your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }} disabled={loading}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          
          <div style={S.demoBox}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 13 }}>🧪 Demo Credentials</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => fillDemo('farmer')}>
                🌾 Fill Farmer
              </button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', border: '1px solid var(--border)' }} onClick={() => fillDemo('admin')}>
                ⚙️ Fill Admin
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Password: Admin@123</div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            New farmer? <Link to="/register" style={{ fontWeight: 700 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  hero: { flex: 1.1, background: 'linear-gradient(145deg, #1b4332 0%, #2d6a2f 55%, #4caf50 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#fff' },
  heroInner: { maxWidth: 440 },
  heroTitle: { fontSize: 52, fontWeight: 800, lineHeight: 1.05, marginBottom: 6 },
  heroHindi: { fontSize: 20, color: '#a5d6a7', marginBottom: 18, fontStyle: 'italic' },
  heroDesc: { fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: 28 },
  features: { display: 'flex', flexDirection: 'column', gap: 9 },
  featureChip: { background: 'rgba(255,255,255,0.11)', padding: '9px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500 },
  formSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--bg)' },
  formCard: { width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, padding: '40px', boxShadow: '0 8px 40px rgba(45,106,47,0.12)' },
  formTitle: { fontSize: 28, fontWeight: 800, color: '#1b4332', marginBottom: 4 },
  formSub: { color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 },
  demoBox: { background: '#f0f7f0', borderRadius: 10, padding: '16px', marginTop: 22 },
};
