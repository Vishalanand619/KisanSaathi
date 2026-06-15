import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const statusColor = { open:'badge-danger','in-progress':'badge-warning',resolved:'badge-success',closed:'badge-gray' };
const priorityColor = { urgent:'badge-danger',high:'badge-danger',medium:'badge-warning',low:'badge-info' };

export default function FarmerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ subject:'', description:'', category:'Scheme Issue', priority:'medium' });

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/mine');
      setComplaints(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.description.length < 20) return toast.error('Please describe your issue in more detail (min 20 chars)');
    setSubmitting(true);
    try {
      await api.post('/complaints', form);
      toast.success('✅ Complaint filed! Ticket ID will be generated. Admin will respond soon.');
      setShowForm(false);
      setForm({ subject:'', description:'', category:'Scheme Issue', priority:'medium' });
      fetchComplaints();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📝 My Complaints</h1>
          <p>File and track complaints — each complaint gets a unique Ticket ID</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Complaint'}
        </button>
      </div>

      
      {showForm && (
        <div className="card" style={{ marginBottom:24, borderLeft:'4px solid var(--accent)' }}>
          <h3 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:20 }}>📝 File New Complaint</h3>

          <div className="alert alert-info" style={{ marginBottom:20 }}>
            💡 Your complaint will get a unique Ticket ID. Admin will respond within 48 hours. You will receive an email notification if email is configured.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn:'span 2' }}>
                <label>Subject *</label>
                <input required placeholder="Brief description of your issue..." value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Scheme Issue','Market Price','Payment Issue','Documentation','Technical Issue','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low — Minor issue</option>
                  <option value="medium">Medium — Affecting my work</option>
                  <option value="high">High — Urgent assistance needed</option>
                  <option value="urgent">Urgent — Critical issue</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Detailed Description *</label>
              <textarea required rows={5} placeholder="Describe your issue in detail. Include relevant scheme names, dates, reference numbers, amounts etc. The more detail you provide, the faster we can resolve it."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="form-hint">{form.description.length} characters (minimum 20)</div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Filing Complaint...' : '✅ Submit Complaint'}
            </button>
          </form>
        </div>
      )}

      
      {complaints.length > 0 && (
        <div className="grid-4" style={{ marginBottom:20 }}>
          {[
            { label:'Total', value:complaints.length, color:'var(--primary)' },
            { label:'Open', value:complaints.filter(c=>c.status==='open').length, color:'var(--danger)' },
            { label:'In Progress', value:complaints.filter(c=>c.status==='in-progress').length, color:'var(--warning)' },
            { label:'Resolved', value:complaints.filter(c=>c.status==='resolved').length, color:'var(--success)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card card-compact" style={{ borderLeftColor:color }}>
              <div className="stat-value" style={{ color, fontSize:28 }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      )}

      
      {complaints.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📝</div><p>No complaints filed yet</p><button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => setShowForm(true)}>+ File First Complaint</button></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {complaints.map(c => (
            <div key={c._id} className="card" style={{ borderLeft:`4px solid ${c.status==='resolved'?'var(--success)':c.status==='in-progress'?'var(--warning)':'var(--danger)'}`, cursor:'pointer' }}
              onClick={() => setSelected(selected?._id === c._id ? null : c)}>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                    {c.ticketId && <span style={{ fontFamily:'monospace', background:'#f0f0f0', padding:'2px 8px', borderRadius:4, fontSize:12, fontWeight:700 }}>{c.ticketId}</span>}
                    <span className={`badge ${priorityColor[c.priority]}`}>{c.priority}</span>
                    <span className={`badge ${statusColor[c.status]}`}>
                      <span className={`status-dot ${c.status}`}/>
                      {c.status}
                    </span>
                    <span className="badge badge-gray">{c.category}</span>
                  </div>
                  <h4 style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>{c.subject}</h4>
                  <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{c.description.slice(0,120)}{c.description.length>120?'...':''}</p>
                </div>
                <div style={{ fontSize:12, color:'var(--text-muted)', textAlign:'right' }}>
                  <div>Filed: {new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
                  {c.resolvedAt && <div style={{ color:'var(--success)' }}>Resolved: {new Date(c.resolvedAt).toLocaleDateString('en-IN')}</div>}
                </div>
              </div>

              
              {selected?._id === c._id && (
                <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
                  <div className="form-group">
                    <label style={{ fontSize:13, textTransform:'uppercase', letterSpacing:'0.05em' }}>Full Description</label>
                    <div style={{ background:'var(--bg)', padding:'12px 16px', borderRadius:8, fontSize:14, lineHeight:1.7 }}>{c.description}</div>
                  </div>

                  
                  {c.timeline?.length > 0 && (
                    <div style={{ marginTop:16 }}>
                      <div style={{ fontWeight:700, fontSize:13, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.05em' }}>📅 Activity Timeline</div>
                      <div className="timeline">
                        {c.timeline.map((t, i) => (
                          <div key={i} className="timeline-item">
                            <div className="timeline-content">
                              <div style={{ fontWeight:600, fontSize:14 }}>{t.action}</div>
                              {t.note && <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:3 }}>{t.note}</div>}
                              <div className="timeline-meta">By {t.by} · {new Date(t.at).toLocaleString('en-IN')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                  {c.adminResponse && (
                    <div className="alert alert-success" style={{ marginTop:16 }}>
                      <strong>👨‍💼 Admin Response:</strong><br/>
                      <span style={{ fontSize:14 }}>{c.adminResponse}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
