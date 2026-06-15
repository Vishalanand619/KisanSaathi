import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#2d6a2f','#e07b24','#c0392b','#2471a3','#8e44ad','#27ae60'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/stats'),
      api.get('/complaints?limit=5'),
      api.get('/schemes/admin/applications?limit=5'),
      api.get('/complaints/stats'),
      api.get('/schemes/admin/all'),
    ]).then(([st, c, a, cs, sch]) => {
      setStats(st.data);
      setComplaints(c.data.complaints || c.data);
      setApplications(a.data.slice ? a.data.slice(0,5) : []);
      setSchemes(sch.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  const complaintChartData = [
    { name:'Open', value: stats?.openComplaints||0 },
    { name:'In Progress', value: (stats?.totalComplaints||0) - (stats?.openComplaints||0) - 2 },
    { name:'Resolved', value: 2 },
  ].filter(d => d.value > 0);

  const appChartData = [
    { name:'Pending', value: stats?.pendingApplications||0 },
    { name:'Approved', value: (stats?.totalApplications||0) - (stats?.pendingApplications||0) },
  ];

  const schemeBarData = schemes.slice(0,6).map(s => ({
    name: s.title.split(' ').slice(0,2).join(' '),
    active: s.isActive ? 1 : 0,
  }));

  return (
    <div>
      <div className="page-header">
        <div><h1>📊 Admin Dashboard</h1><p>KisanSaathi Agriculture Support Portal — Overview</p></div>
        <div style={{ fontSize:13, color:'var(--text-muted)', background:'#fff', padding:'8px 14px', borderRadius:8, border:'1px solid var(--border)' }}>
          🗓 {new Date().toLocaleDateString('en-IN',{ weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom:28 }}>
        {[
          { label:'Total Farmers', value:stats?.totalFarmers||0, icon:'👨‍🌾', color:'var(--primary)', to:'/admin/users' },
          { label:'Active Farmers', value:stats?.activeFarmers||0, icon:'✅', color:'var(--success)', to:'/admin/users' },
          { label:'Open Complaints', value:stats?.openComplaints||0, icon:'🔴', color:'var(--danger)', to:'/admin/complaints' },
          { label:'Pending Applications', value:stats?.pendingApplications||0, icon:'⏳', color:'var(--warning)', to:'/admin/applications' },
          { label:'Total Applications', value:stats?.totalApplications||0, icon:'📩', color:'var(--accent)', to:'/admin/applications' },
          { label:'Total Complaints', value:stats?.totalComplaints||0, icon:'📝', color:'var(--info)', to:'/admin/complaints' },
          { label:'Active Schemes', value:schemes.filter(s=>s.isActive).length, icon:'📋', color:'#8e44ad', to:'/admin/schemes' },
          { label:'Total Schemes', value:schemes.length, icon:'📄', color:'var(--primary)', to:'/admin/schemes' },
        ].map(({ label, value, icon, color, to }) => (
          <Link key={label} to={to} style={{ textDecoration:'none' }}>
            <div className="stat-card">
              <div className="stat-icon">{icon}</div>
              <div className="stat-value" style={{ color }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20, marginBottom:24 }}>
        <div className="card">
          <h4 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:16 }}>🗂️ Complaint Status</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={complaintChartData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {complaintChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:16 }}>📩 Application Status</h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={appChartData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                {appChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:16 }}>📋 Schemes Overview</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={schemeBarData} margin={{ left:-20 }}>
              <XAxis dataKey="name" fontSize={10} tick={{ fill:'#5a7a5a' }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="active" fill="var(--primary)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="grid-2">
      
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--primary-dark)' }}>🗂️ Recent Complaints</h3>
            <Link to="/admin/complaints" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {complaints.slice(0,5).map(c => (
            <div key={c._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ flex:1 }}>
                {c.ticketId && <div style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{c.ticketId}</div>}
                <div style={{ fontWeight:600, fontSize:14 }}>{c.subject}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{c.farmer?.name} · {c.category}</div>
              </div>
              <span className={`badge ${c.status==='open'?'badge-danger':c.status==='resolved'?'badge-success':'badge-warning'}`}>{c.status}</span>
            </div>
          ))}
          {complaints.length===0 && <div style={{ textAlign:'center', color:'var(--text-muted)', padding:'20px 0' }}>No complaints</div>}
        </div>

        
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--primary-dark)' }}>📩 Recent Applications</h3>
            <Link to="/admin/applications" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {applications.map(a => (
            <div key={a._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.scheme?.title}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.farmer?.name} · {a.farmer?.state}</div>
              </div>
              <span className={`badge ${a.status==='approved'?'badge-success':a.status==='rejected'?'badge-danger':'badge-pending'}`}>{a.status}</span>
            </div>
          ))}
          {applications.length===0 && <div style={{ textAlign:'center', color:'var(--text-muted)', padding:'20px 0' }}>No applications</div>}
        </div>
      </div>

      
      <div className="card" style={{ marginTop:20 }}>
        <h3 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:16, fontSize:15 }}>⚡ Quick Actions</h3>
        <div className="grid-4">
          {[
            { to:'/admin/schemes', label:'Add New Scheme', icon:'➕', bg:'#e8f5e9' },
            { to:'/admin/applications', label:'Review Applications', icon:'📩', bg:'#fff3e0' },
            { to:'/admin/complaints', label:'Respond to Complaints', icon:'🗂️', bg:'#fce4e4' },
            { to:'/admin/market', label:'Update Market Prices', icon:'💹', bg:'#e3f2fd' },
          ].map(({ to, label, icon, bg }) => (
            <Link key={to} to={to} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'20px 12px', borderRadius:12, textDecoration:'none', background:bg }}>
              <span style={{ fontSize:28 }}>{icon}</span>
              <span style={{ fontSize:14, fontWeight:700, color:'var(--text)', textAlign:'center' }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
