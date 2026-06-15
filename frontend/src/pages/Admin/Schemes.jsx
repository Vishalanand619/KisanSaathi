import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CATS = ['Financial Aid','Insurance','Credit','Subsidy','Training','Other'];
const EMPTY = { title:'', description:'', eligibility:'', benefits:'', deadline:'', category:'Financial Aid', ministry:'', schemeCode:'', website:'', helpline:'', documents:'', isActive:true };

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try { const { data } = await api.get('/schemes/admin/all'); setSchemes(data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleEdit = (s) => {
    setForm({ ...s, deadline: s.deadline ? s.deadline.slice(0,10) : '', documents: (s.documents||[]).join(', ') });
    setEditId(s._id); setShowForm(true);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, documents: form.documents ? form.documents.split(',').map(d => d.trim()).filter(Boolean) : [] };
    try {
      if (editId) { await api.put(`/schemes/${editId}`, payload); toast.success('Scheme updated!'); }
      else { await api.post('/schemes', payload); toast.success('Scheme created!'); }
      setShowForm(false); setEditId(null); setForm(EMPTY); fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scheme?')) return;
    try { await api.delete(`/schemes/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  const handleToggle = async (s) => {
    try { await api.put(`/schemes/${s._id}`, { isActive: !s.isActive }); fetch(); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>📋 Manage Schemes</h1><p>Create and manage real government schemes for farmers</p></div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY); }}>
          {showForm ? '✕ Cancel' : '+ Add Scheme'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:24, borderLeft:'4px solid var(--primary)' }}>
          <h3 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:20 }}>{editId ? '✏️ Edit Scheme' : '➕ New Scheme'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn:'span 2' }}>
                <label>Scheme Title *</label>
                <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Full official scheme name" />
              </div>
              <div className="form-group"><label>Category *</label><select value={form.category} onChange={e => set('category', e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Scheme Code</label><input value={form.schemeCode} onChange={e => set('schemeCode', e.target.value)} placeholder="e.g. PM-KISAN" /></div>
              <div className="form-group"><label>Ministry</label><input value={form.ministry} onChange={e => set('ministry', e.target.value)} placeholder="Ministry name" /></div>
              <div className="form-group"><label>Helpline</label><input value={form.helpline} onChange={e => set('helpline', e.target.value)} placeholder="Toll-free number" /></div>
              <div className="form-group"><label>Official Website</label><input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://" /></div>
              <div className="form-group"><label>Application Deadline</label><input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Description *</label><textarea required rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the scheme..." /></div>
            <div className="form-grid">
              <div className="form-group"><label>Eligibility *</label><textarea required rows={3} value={form.eligibility} onChange={e => set('eligibility', e.target.value)} placeholder="Who can apply?" /></div>
              <div className="form-group"><label>Benefits *</label><textarea required rows={3} value={form.benefits} onChange={e => set('benefits', e.target.value)} placeholder="What does the farmer get?" /></div>
            </div>
            <div className="form-group">
              <label>Required Documents <span style={{ color:'var(--text-muted)', fontWeight:400 }}>(comma-separated)</span></label>
              <input value={form.documents} onChange={e => set('documents', e.target.value)} placeholder="Aadhaar Card, Land Records, Bank Account, Passport Photo" />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ width:18, height:18 }} />
              <label htmlFor="isActive" style={{ cursor:'pointer', fontWeight:600 }}>Active (visible to farmers)</label>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'⏳ Saving...':editId?'✅ Update Scheme':'✅ Create Scheme'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Scheme</th><th>Code</th><th>Category</th><th>Ministry</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {schemes.map(s => (
                <tr key={s._id}>
                  <td><div style={{ fontWeight:700 }}>{s.title}</div><div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{s.description?.slice(0,60)}...</div></td>
                  <td style={{ fontFamily:'monospace', fontSize:13 }}>{s.schemeCode||'—'}</td>
                  <td><span className="badge badge-info">{s.category}</span></td>
                  <td style={{ fontSize:13, color:'var(--text-muted)', maxWidth:180 }}>{s.ministry||'—'}</td>
                  <td style={{ fontSize:13, color:'var(--text-muted)' }}>{s.deadline ? new Date(s.deadline).toLocaleDateString('en-IN') : '—'}</td>
                  <td><span className={`badge ${s.isActive?'badge-success':'badge-danger'}`}>{s.isActive?'✅ Active':'❌ Inactive'}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEdit(s)}>✏️</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(s)} title={s.isActive?'Deactivate':'Activate'}>{s.isActive?'🔇':'🔔'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
