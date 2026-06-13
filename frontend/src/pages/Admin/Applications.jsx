// KisanSaathi — Admin Applications Management
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/schemes/admin/applications${params}`);
      setApps(data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!loading) fetchApps(); }, [filter]);

  const handleAction = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/schemes/admin/applications/${id}`, { status, adminRemarks: remarks });
      toast.success(`Application ${status}!`);
      setSelected(null); setRemarks(''); fetchApps();
    } catch { toast.error('Failed'); }
    finally { setUpdating(false); }
  };

  const counts = { all: apps.length, pending: apps.filter(a => a.status==='pending').length, approved: apps.filter(a => a.status==='approved').length, rejected: apps.filter(a => a.status==='rejected').length };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header"><div><h1>📩 Scheme Applications</h1><p>Review and approve/reject farmer scheme applications</p></div></div>

      <div className="filter-row">
        {['all','pending','approved','rejected'].map(s => (
          <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-outline'}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase()+s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Farmer</th><th>Scheme</th><th>Applied On</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {apps.length === 0 ? <tr><td colSpan={5} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No applications found</td></tr>
              : apps.map(a => (
                <tr key={a._id}>
                  <td>
                    <div style={{ fontWeight:700 }}>{a.farmer?.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.farmer?.phone} · {a.farmer?.state}</div>
                    {a.farmer?.landHolding && <div style={{ fontSize:12, color:'var(--text-muted)' }}>🌾 {a.farmer.landHolding} Acres · {a.farmer.cropType}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight:600 }}>{a.scheme?.title}</div>
                    <div style={{ fontSize:12 }}><span className="badge badge-info">{a.scheme?.category}</span> {a.scheme?.schemeCode && <span className="badge badge-gray">{a.scheme.schemeCode}</span>}</div>
                    {a.message && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4, fontStyle:'italic' }}>"{a.message.slice(0,80)}..."</div>}
                  </td>
                  <td style={{ fontSize:13, color:'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><span className={`badge ${a.status==='approved'?'badge-success':a.status==='rejected'?'badge-danger':'badge-pending'}`}>{a.status}</span></td>
                  <td>
                    {a.status === 'pending'
                      ? <button className="btn btn-outline btn-sm" onClick={() => { setSelected(a); setRemarks(''); }}>👁️ Review</button>
                      : <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.adminRemarks||'—'}</div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={() => setSelected(null)}>
          <div style={{ background:'#fff', borderRadius:14, padding:'32px', maxWidth:500, width:'100%', boxShadow:'0 8px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color:'var(--primary-dark)', marginBottom:4 }}>📩 Review Application</h3>
            <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:16 }}>{selected.farmer?.name} → {selected.scheme?.title}</p>
            {selected.message && (
              <div style={{ background:'#f5f5f5', padding:'12px 16px', borderRadius:8, fontSize:14, marginBottom:16 }}>
                <strong>Farmer's Message:</strong><br/>{selected.message}
              </div>
            )}
            <div style={{ marginBottom:16, fontSize:14 }}>
              <div><strong>Farmer:</strong> {selected.farmer?.name}</div>
              <div><strong>State:</strong> {selected.farmer?.state} · {selected.farmer?.district}</div>
              <div><strong>Land:</strong> {selected.farmer?.landHolding} Acres · {selected.farmer?.cropType}</div>
            </div>
            <div className="form-group">
              <label>Admin Remarks *</label>
              <textarea rows={3} placeholder="Reason for approval or rejection. Farmer will see this." value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-danger" disabled={updating || !remarks} onClick={() => handleAction(selected._id, 'rejected')}>{updating?'⏳':'❌ Reject'}</button>
              <button className="btn btn-primary" disabled={updating || !remarks} onClick={() => handleAction(selected._id, 'approved')}>{updating?'⏳':'✅ Approve'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
