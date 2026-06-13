// KisanSaathi — Admin Users (Farmers) Management
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [states, setStates] = useState([]);
  const [toggling, setToggling] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchUsers();
    api.get('/market/states').then(r => setStates(r.data)).catch(() => {});
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id, cur) => {
    setToggling(id);
    try {
      await api.put(`/users/${id}/toggle`);
      toast.success(`User ${cur ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch { toast.error('Failed'); }
    finally { setToggling(null); }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || (u.phone||'').includes(search);
    const matchState = !stateFilter || u.state === stateFilter;
    return matchSearch && matchState;
  });

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  const active = users.filter(u => u.isActive).length;

  return (
    <div>
      <div className="page-header">
        <div><h1>👨‍🌾 Farmers Management</h1><p>Total: {users.length} registered farmers | Active: {active}</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:'7px 16px', fontSize:13 }}>✅ Active: <strong>{active}</strong></div>
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:'7px 16px', fontSize:13 }}>❌ Inactive: <strong>{users.length - active}</strong></div>
        </div>
      </div>

      <div className="filter-row">
        <input className="search-input" placeholder="🔍 Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ padding:'10px 14px', border:'1.5px solid var(--border)', borderRadius:7, fontFamily:'Mukta', fontSize:15, background:'#fff', minWidth:200 }}
          value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
          <option value="">🌍 All States</option>
          {states.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize:14, color:'var(--text-muted)' }}>{filtered.length} shown</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Farmer</th><th>Contact</th><th>Location</th><th>Farm Details</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={8} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No farmers found</td></tr>
              : filtered.map((u, i) => (
                <React.Fragment key={u._id}>
                  <tr style={{ cursor:'pointer' }} onClick={() => setExpanded(expanded===u._id ? null : u._id)}>
                    <td style={{ color:'var(--text-muted)', fontSize:13 }}>{i+1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, flexShrink:0 }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:700 }}>{u.name}</div>
                          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize:13 }}>{u.phone||'—'}</td>
                    <td>
                      <div style={{ fontSize:14 }}>{u.state||'—'}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{u.district||''}{u.village ? ` · ${u.village}` : ''}</div>
                    </td>
                    <td>
                      <div style={{ fontSize:13 }}>{u.landHolding ? `${u.landHolding} Acres` : '—'}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{u.cropType||'—'}</div>
                    </td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><span className={`badge ${u.isActive?'badge-success':'badge-danger'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                    <td>
                      <button className={`btn btn-sm ${u.isActive?'btn-danger':'btn-outline'}`} disabled={toggling===u._id}
                        onClick={e => { e.stopPropagation(); handleToggle(u._id, u.isActive); }}>
                        {toggling===u._id?'⏳':u.isActive?'🚫 Deactivate':'✅ Activate'}
                      </button>
                    </td>
                  </tr>
                  {expanded === u._id && (
                    <tr>
                      <td colSpan={8} style={{ background:'#f8fbf8', padding:'16px 24px' }}>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:12 }}>
                          {[
                            { label:'Full Name', value:u.name },
                            { label:'Email', value:u.email },
                            { label:'Phone', value:u.phone||'—' },
                            { label:'State', value:u.state||'—' },
                            { label:'District', value:u.district||'—' },
                            { label:'Village', value:u.village||'—' },
                            { label:'Land Holding', value:u.landHolding?`${u.landHolding} Acres`:'—' },
                            { label:'Crop Type', value:u.cropType||'—' },
                            { label:'Account Status', value:u.isActive?'Active':'Deactivated' },
                            { label:'Registered', value:new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) },
                          ].map(({ label, value }) => (
                            <div key={label} style={{ background:'#fff', padding:'10px 14px', borderRadius:8, border:'1px solid var(--border)' }}>
                              <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:3 }}>{label}</div>
                              <div style={{ fontSize:14, fontWeight:600 }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
