import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATES = ['Madhya Pradesh','Uttar Pradesh','Maharashtra','Punjab','Haryana','Gujarat','Rajasthan','Karnataka','Andhra Pradesh','Tamil Nadu','Bihar','West Bengal','Odisha','Jharkhand','Chhattisgarh','Other'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', state:'', district:'', village:'', landHolding:'', cropType:'' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.success) { toast.success('Registration successful! Welcome to KisanSaathi 🌾'); navigate('/farmer'); }
    else toast.error(res.message);
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:28 }}>🌾</span>
          <div>
            <div style={{ fontWeight:800, fontSize:18, color:'#a5d6a7' }}>KisanSaathi</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Farmer Registration</div>
          </div>
        </div>
        <Link to="/login" className="btn btn-outline btn-sm" style={{ color:'#fff', borderColor:'rgba(255,255,255,0.4)' }}>← Back to Login</Link>
      </div>

      <div style={S.body}>
        <div style={S.card}>
          <h2 style={S.title}>Create Farmer Account</h2>
          <p style={S.sub}>Join KisanSaathi to access government schemes, live market prices and farmer support</p>

          <form onSubmit={handleSubmit}>
            <div style={{ background:'#f0f7f0', borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
              <div style={{ fontWeight:700, color:'#1b4332', marginBottom:12 }}>👤 Personal Information</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input required placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" required placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input type="password" required placeholder="Min. 6 characters" minLength={6} value={form.password} onChange={e => set('password', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input placeholder="10-digit mobile" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ background:'#fff8f0', borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
              <div style={{ fontWeight:700, color:'#8a4000', marginBottom:12 }}>📍 Location Details</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>State</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)}>
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>District</label>
                  <input placeholder="Your district" value={form.district} onChange={e => set('district', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Village / Town</label>
                  <input placeholder="Village or town name" value={form.village} onChange={e => set('village', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ background:'#e8f5e9', borderRadius:10, padding:'16px 20px', marginBottom:24 }}>
              <div style={{ fontWeight:700, color:'#1b5e20', marginBottom:12 }}>🌱 Farm Details</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Land Holding (Acres)</label>
                  <input type="number" step="0.5" min="0" placeholder="e.g. 5" value={form.landHolding} onChange={e => set('landHolding', e.target.value)} />
                  <div className="form-hint">Total cultivable land you own or operate</div>
                </div>
                <div className="form-group">
                  <label>Primary Crop</label>
                  <input placeholder="e.g. Wheat, Rice, Cotton, Soybean" value={form.cropType} onChange={e => set('cropType', e.target.value)} />
                  <div className="form-hint">Main crop you grow this season</div>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:16 }}>
              {loading ? '⏳ Creating Account...' : '✅ Register as Farmer'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ fontWeight:700 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', background:'var(--bg)' },
  header: { background:'linear-gradient(135deg, #1b4332, #2d6a2f)', color:'#fff', padding:'16px 36px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  body: { display:'flex', justifyContent:'center', padding:'36px 20px' },
  card: { background:'#fff', borderRadius:16, padding:'40px', width:'100%', maxWidth:760, boxShadow:'0 4px 28px rgba(45,106,47,0.10)' },
  title: { fontSize:26, fontWeight:800, color:'#1b4332', marginBottom:6 },
  sub: { color:'var(--text-muted)', marginBottom:28, fontSize:14, lineHeight:1.6 },
};
