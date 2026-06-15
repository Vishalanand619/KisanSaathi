import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function WeatherCard({ state }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/weather?state=${encodeURIComponent(state || 'Madhya Pradesh')}`)
      .then(r => setWeather(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [state]);

  if (loading) return <div style={W.card}><div className="spinner" style={{ margin:'20px auto' }} /></div>;
  if (!weather) return null;
  const { current, forecast, advisory } = weather;

  return (
    <div style={W.card}>
      <div style={W.header}>
        <div>
          <div style={W.emoji}>{current.emoji}</div>
          <div style={W.temp}>{current.temp}°C</div>
          <div style={W.cond}>{current.condition}</div>
          <div style={W.meta}>💧 {current.humidity}% &nbsp; 💨 {current.windSpeed} km/h</div>
        </div>
        <div style={{ flex:1 }}>
          <div style={W.forecastRow}>
            {forecast.slice(1, 6).map((d, i) => (
              <div key={i} style={W.forecastDay}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>
                  {new Date(d.date).toLocaleDateString('en-IN', { weekday:'short' })}
                </div>
                <div style={{ fontSize:18 }}>{d.emoji}</div>
                <div style={{ fontSize:13, fontWeight:700 }}>{d.maxTemp}°</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>{d.minTemp}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {advisory?.length > 0 && (
        <div style={W.advisory}>
          <div style={{ fontWeight:700, marginBottom:6, fontSize:13 }}>🌾 Farm Advisory</div>
          {advisory.map((a, i) => <div key={i} style={{ fontSize:13, marginBottom:3 }}>{a}</div>)}
        </div>
      )}
    </div>
  );
}

const W = {
  card: { background:'linear-gradient(135deg, #1565c0, #0d47a1)', borderRadius:14, padding:'20px 24px', color:'#fff', gridColumn:'span 2' },
  header: { display:'flex', gap:24, marginBottom:14, alignItems:'flex-start' },
  emoji: { fontSize:40, lineHeight:1 },
  temp: { fontSize:36, fontWeight:800, lineHeight:1.1 },
  cond: { fontSize:15, opacity:0.85, marginTop:2 },
  meta: { fontSize:13, opacity:0.7, marginTop:6 },
  forecastRow: { display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap' },
  forecastDay: { textAlign:'center', padding:'8px 10px', background:'rgba(255,255,255,0.12)', borderRadius:8, minWidth:52 },
  advisory: { background:'rgba(0,0,0,0.2)', borderRadius:8, padding:'12px 16px', marginTop:8 },
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ schemes:[], complaints:[], market:[], applications:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/schemes'),
      api.get('/complaints/mine'),
      api.get('/market?limit=6'),
      api.get('/schemes/farmer/my-applications'),
    ]).then(([s, c, m, a]) => {
      setData({ schemes: s.data.slice(0,3), complaints: c.data, market: m.data.data || m.data, applications: a.data });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const openComplaints = data.complaints.filter(c => c.status === 'open').length;
  const pendingApps = data.applications.filter(a => a.status === 'pending').length;

  return (
    <div>
  
      <div style={S.banner}>
        <div>
          <h1 style={S.bannerTitle}>नमस्ते, {user?.name?.split(' ')[0]}! 🙏</h1>
          <p style={S.bannerSub}>Welcome to KisanSaathi — your complete agriculture support portal</p>
          <div style={{ display:'flex', gap:12, marginTop:10, flexWrap:'wrap' }}>
            {user?.state && <span style={S.bannerChip}>📍 {user.state}</span>}
            {user?.cropType && <span style={S.bannerChip}>🌱 {user.cropType}</span>}
            {user?.landHolding && <span style={S.bannerChip}>🌾 {user.landHolding} Acres</span>}
          </div>
        </div>
        <div style={{ fontSize:88, opacity:0.35 }}>🌾</div>
      </div>

     
      <div className="grid-4" style={{ marginBottom:24 }}>
        {[
          { label:'Active Schemes', value:data.schemes.length, icon:'📋', color:'var(--primary)' },
          { label:'My Applications', value:data.applications.length, icon:'📩', color:'var(--info)' },
          { label:'Pending Approval', value:pendingApps, icon:'⏳', color:'var(--warning)' },
          { label:'Open Complaints', value:openComplaints, icon:'🔴', color:'var(--danger)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, marginBottom:24 }}>
        <WeatherCard state={user?.state} />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { to:'/farmer/schemes', label:'Browse & Apply Schemes', icon:'📋', bg:'#e8f5e9', color:'#1b5e20' },
            { to:'/farmer/complaints', label:'File a Complaint', icon:'📝', bg:'#fff3e0', color:'#e65100' },
            { to:'/farmer/market', label:'Check Mandi Prices', icon:'💹', bg:'#e3f2fd', color:'#0d47a1' },
            { to:'/farmer/profile', label:'Update My Profile', icon:'👤', bg:'#f3e5f5', color:'#4a148c' },
          ].map(({ to, label, icon, bg, color }) => (
            <Link key={to} to={to} style={{ ...S.quickBtn, background:bg }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <span style={{ fontSize:14, fontWeight:700, color }}>{label}</span>
              <span style={{ marginLeft:'auto', color:'#bbb' }}>›</span>
            </Link>
          ))}
        </div>
      </div>

      
      <div className="grid-2">
    
        <div className="card">
          <div style={S.secHead}>
            <h3 style={S.secTitle}>📋 Latest Government Schemes</h3>
            <Link to="/farmer/schemes" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {data.schemes.map(s => (
            <div key={s._id} style={S.schemeItem}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:5 }}>
                <div style={{ fontWeight:700, fontSize:15, color:'var(--primary-dark)', flex:1 }}>{s.title}</div>
                <span className="badge badge-info" style={{ flexShrink:0 }}>{s.category}</span>
              </div>
              {s.ministry && <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>🏛️ {s.ministry}</div>}
              {s.helpline && <div style={{ fontSize:12, color:'var(--primary)' }}>📞 Helpline: {s.helpline}</div>}
            </div>
          ))}
          {data.schemes.length === 0 && <div className="empty-state" style={{ padding:'30px 0' }}><p>No schemes available</p></div>}
        </div>

       
        <div className="card">
          <div style={S.secHead}>
            <h3 style={S.secTitle}>💹 Live Mandi Prices</h3>
            <Link to="/farmer/market" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Crop</th><th>Price (₹)</th><th>Market</th></tr></thead>
              <tbody>
                {(data.market.slice ? data.market.slice(0,6) : []).map(m => (
                  <tr key={m._id}>
                    <td><strong>{m.crop}</strong><br/><span style={{ fontSize:11, color:'var(--text-muted)' }}>{m.variety}</span></td>
                    <td><strong style={{ color:'var(--primary)', fontSize:15 }}>₹{Number(m.price).toLocaleString('en-IN')}</strong><br/><span style={{ fontSize:11, color:'var(--text-muted)' }}>/{m.unit}</span></td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{m.market}<br/><span style={{ fontSize:11 }}>{m.state}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.market.length === 0 && <div className="empty-state" style={{ padding:'30px 0' }}><p>No price data</p></div>}
        </div>
      </div>

      
      {data.applications.length > 0 && (
        <div className="card" style={{ marginTop:24 }}>
          <div style={S.secHead}>
            <h3 style={S.secTitle}>📩 My Scheme Applications</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Scheme</th><th>Applied On</th><th>Status</th><th>Remarks</th></tr></thead>
              <tbody>
                {data.applications.map(a => (
                  <tr key={a._id}>
                    <td>
                      <strong>{a.scheme?.title}</strong>
                      {a.scheme?.schemeCode && <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.scheme.schemeCode}</div>}
                    </td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className={`badge ${a.status==='approved'?'badge-success':a.status==='rejected'?'badge-danger':'badge-pending'}`}>
                        {a.status==='approved'?'✅ Approved':a.status==='rejected'?'❌ Rejected':'⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{a.adminRemarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  banner: { background:'linear-gradient(135deg, #1b4332, #2d6a2f)', borderRadius:14, padding:'28px 32px', color:'#fff', marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'center' },
  bannerTitle: { fontSize:30, fontWeight:800, marginBottom:4 },
  bannerSub: { color:'rgba(255,255,255,0.8)', fontSize:15 },
  bannerChip: { background:'rgba(255,255,255,0.15)', padding:'5px 12px', borderRadius:20, fontSize:13, fontWeight:600 },
  quickBtn: { display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderRadius:10, textDecoration:'none', fontWeight:500 },
  secHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  secTitle: { fontSize:16, fontWeight:700, color:'var(--primary-dark)' },
  schemeItem: { borderBottom:'1px solid var(--border)', paddingBottom:14, marginBottom:14 },
};
