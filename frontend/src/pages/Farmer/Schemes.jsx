// KisanSaathi — Farmer Schemes Page (Real Govt Schemes)
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CATS = ['All','Financial Aid','Insurance','Credit','Subsidy','Training','Other'];
const catColor = { 'Financial Aid':'badge-success','Insurance':'badge-info','Credit':'badge-warning','Subsidy':'badge-success','Training':'badge-info' };

export default function FarmerSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [msg, setMsg] = useState('');
  const [applying, setApplying] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchAll(); }, [cat]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== 'All') params.set('category', cat);
      if (search) params.set('search', search);
      const [s, a] = await Promise.all([
        api.get(`/schemes?${params}`),
        api.get('/schemes/farmer/my-applications'),
      ]);
      setSchemes(s.data);
      setApplications(a.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const appliedMap = Object.fromEntries(applications.map(a => [a.scheme?._id, a]));

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/schemes/${modal._id}/apply`, { message: msg });
      toast.success('✅ Application submitted successfully!');
      setModal(null); setMsg('');
      fetchAll();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setApplying(false); }
  };

  const filtered = schemes.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📋 Government Schemes</h1>
          <p>Real central government agriculture schemes — browse, check eligibility, and apply online</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <input className="search-input" placeholder="🔍 Search schemes..." value={search}
          onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchAll()} />
        {CATS.map(c => (
          <button key={c} className={`btn btn-sm ${cat===c?'btn-primary':'btn-outline'}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><p>No schemes found</p></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {filtered.map(s => {
            const app = appliedMap[s._id];
            const isExpanded = expanded === s._id;
            return (
              <div key={s._id} className="card" style={{ borderLeft:`4px solid ${s.category==='Financial Aid'?'var(--success)':s.category==='Insurance'?'var(--info)':s.category==='Credit'?'var(--warning)':'var(--primary)'}` }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                      <h3 style={{ fontSize:18, fontWeight:800, color:'var(--primary-dark)' }}>{s.title}</h3>
                      <span className={`badge ${catColor[s.category]||'badge-gray'}`}>{s.category}</span>
                      {s.schemeCode && <span className="badge badge-gray">#{s.schemeCode}</span>}
                    </div>
                    {s.ministry && <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:6 }}>🏛️ {s.ministry}</div>}
                    <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.6 }}>{s.description}</p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', flexShrink:0 }}>
                    {app ? (
                      <span className={`badge ${app.status==='approved'?'badge-success':app.status==='rejected'?'badge-danger':'badge-pending'}`} style={{ fontSize:13 }}>
                        {app.status==='approved'?'✅ Approved':app.status==='rejected'?'❌ Rejected':'⏳ Pending'}
                      </span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => setModal(s)}>📩 Apply Now</button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(isExpanded ? null : s._id)}>
                      {isExpanded ? '▲ Less' : '▼ Details'}
                    </button>
                  </div>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid var(--border)' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:16 }}>
                      <div style={D.box}>
                        <div style={D.boxTitle}>✅ Eligibility</div>
                        <p style={D.boxText}>{s.eligibility}</p>
                      </div>
                      <div style={D.box}>
                        <div style={D.boxTitle}>🎁 Benefits</div>
                        <p style={D.boxText}>{s.benefits}</p>
                      </div>
                      {s.documents?.length > 0 && (
                        <div style={D.box}>
                          <div style={D.boxTitle}>📄 Documents Required</div>
                          <ul style={{ paddingLeft:18, fontSize:14, color:'var(--text)' }}>
                            {s.documents.map(d => <li key={d}>{d}</li>)}
                          </ul>
                        </div>
                      )}
                      <div style={D.box}>
                        <div style={D.boxTitle}>📞 Helpline & Links</div>
                        {s.helpline && <div style={{ fontSize:14 }}>📞 {s.helpline}</div>}
                        {s.website && <a href={s.website} target="_blank" rel="noreferrer" style={{ fontSize:14, color:'var(--primary)', display:'block', marginTop:4 }}>🌐 Official Website ↗</a>}
                        {s.deadline && <div style={{ fontSize:13, color:'var(--warning)', marginTop:6 }}>⏰ Apply before: {new Date(s.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>}
                      </div>
                    </div>
                    {app?.adminRemarks && (
                      <div className="alert alert-success" style={{ marginTop:16 }}>
                        <strong>Admin Response:</strong> {app.adminRemarks}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {modal && (
        <div style={M.overlay} onClick={() => setModal(null)}>
          <div style={M.box} onClick={e => e.stopPropagation()}>
            <h3 style={{ color:'var(--primary-dark)', marginBottom:4 }}>📩 Apply: {modal.title}</h3>
            <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:16 }}>{modal.ministry}</p>

            <div style={{ background:'#f0f7f0', borderRadius:8, padding:'12px 16px', marginBottom:16, fontSize:13 }}>
              <strong>Required Documents:</strong>
              <ul style={{ paddingLeft:18, marginTop:6 }}>
                {(modal.documents||[]).map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>

            <div className="form-group">
              <label>Message / Additional Information (Optional)</label>
              <textarea rows={3} placeholder="e.g. I am a small marginal farmer with 2 acres in Madhya Pradesh..."
                value={msg} onChange={e => setMsg(e.target.value)} />
            </div>

            <div className="alert alert-info" style={{ fontSize:13 }}>
              ℹ️ Ensure you have all required documents ready. Your application will be reviewed by the admin.
            </div>

            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                {applying ? '⏳ Submitting...' : '✅ Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const D = {
  box: { background:'#f8fbf8', borderRadius:8, padding:'14px 16px' },
  boxTitle: { fontWeight:700, fontSize:13, color:'var(--primary-dark)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.04em' },
  boxText: { fontSize:14, color:'var(--text)', lineHeight:1.6 },
};
const M = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  box: { background:'#fff', borderRadius:14, padding:'32px', width:'100%', maxWidth:520, boxShadow:'0 8px 40px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto' },
};
