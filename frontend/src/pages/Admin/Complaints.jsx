import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const statusColor = { open:'badge-danger','in-progress':'badge-warning',resolved:'badge-success',closed:'badge-gray' };
const priorityColor = { urgent:'badge-danger',high:'badge-danger',medium:'badge-warning',low:'badge-info' };

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('in-progress');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchComplaints(); }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/complaints${params}`);
      setComplaints(data.complaints || data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const handleRespond = async () => {
    if (!response.trim()) { toast.error('Please write a response'); return; }
    setUpdating(true);
    try {
      await api.put(`/complaints/${selected._id}`, { status: newStatus, adminResponse: response });
      toast.success('Response sent! Farmer will be notified.');
      setSelected(null); setResponse(''); fetchComplaints();
    } catch { toast.error('Failed'); }
    finally { setUpdating(false); }
  };

  const counts = { all: complaints.length, open: complaints.filter(c=>c.status==='open').length, 'in-progress': complaints.filter(c=>c.status==='in-progress').length, resolved: complaints.filter(c=>c.status==='resolved').length };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>🗂️ Complaints Management</h1><p>Review and respond to farmer complaints — each has a Ticket ID for tracking</p></div>
        <div style={{ display:'flex', gap:8 }}>
          {['open','in-progress','resolved'].map(s => (
            <div key={s} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:'6px 14px', fontSize:13 }}>
              <strong>{counts[s]}</strong> {s}
            </div>
          ))}
        </div>
      </div>

      <div className="filter-row">
        {['all','open','in-progress','resolved','closed'].map(s => (
          <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-outline'}`} onClick={() => setFilter(s)}>
            {s==='in-progress'?'In Progress':s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ticket</th><th>Farmer</th><th>Subject</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {complaints.length === 0 ? <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No complaints</td></tr>
              : complaints.map(c => (
                <tr key={c._id}>
                  <td style={{ fontFamily:'monospace', fontSize:12, color:'var(--text-muted)' }}>{c.ticketId||'—'}</td>
                  <td>
                    <div style={{ fontWeight:700 }}>{c.farmer?.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{c.farmer?.state} · {c.farmer?.district}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight:600, fontSize:14 }}>{c.subject}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{c.category} · {c.description?.slice(0,50)}...</div>
                  </td>
                  <td><span className={`badge ${priorityColor[c.priority]}`}>{c.priority}</span></td>
                  <td><span className={`badge ${statusColor[c.status]}`}><span className={`status-dot ${c.status}`}/>{c.status}</span></td>
                  <td style={{ fontSize:13, color:'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => { setSelected(c); setNewStatus(c.status==='open'?'in-progress':c.status); setResponse(c.adminResponse||''); }}>💬 Respond</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={() => setSelected(null)}>
          <div style={{ background:'#fff', borderRadius:14, padding:'32px', maxWidth:560, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 8px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <h3 style={{ color:'var(--primary-dark)' }}>💬 Respond to Complaint</h3>
              {selected.ticketId && <span style={{ fontFamily:'monospace', fontSize:13, background:'#f0f0f0', padding:'3px 10px', borderRadius:6 }}>{selected.ticketId}</span>}
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:14, marginBottom:4 }}><strong>Farmer:</strong> {selected.farmer?.name} · {selected.farmer?.phone}</div>
              <div style={{ fontSize:14, marginBottom:4 }}><strong>Subject:</strong> {selected.subject}</div>
              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                <span className={`badge ${priorityColor[selected.priority]}`}>{selected.priority} priority</span>
                <span className="badge badge-info">{selected.category}</span>
              </div>
              <div style={{ background:'#f5f5f5', padding:'12px 16px', borderRadius:8, fontSize:14, lineHeight:1.7 }}>{selected.description}</div>
            </div>

            {selected.timeline?.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:10 }}>📅 Timeline</div>
                <div className="timeline">
                  {selected.timeline.map((t, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-content">
                        <div style={{ fontWeight:600, fontSize:13 }}>{t.action}</div>
                        {t.note && <div style={{ fontSize:13, color:'var(--text-muted)' }}>{t.note}</div>}
                        <div className="timeline-meta">By {t.by}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Update Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {['open','in-progress','resolved','closed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Your Response to Farmer *</label>
              <textarea rows={4} placeholder="Write a clear, helpful response. This will be shown to the farmer and emailed if email is configured." value={response} onChange={e => setResponse(e.target.value)} />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={updating} onClick={handleRespond}>{updating?'⏳ Sending...':'✅ Send Response'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
