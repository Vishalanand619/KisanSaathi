// KisanSaathi — Admin Learning Management
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminLearning() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    title: '', description: '', category: 'Modern Farming', type: 'Video', contentUrl: '', thumbnailUrl: ''
  });

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/learning/admin/all');
      setResources(data);
    } catch { toast.error('Failed to load resources'); }
    finally { setLoading(false); }
  };

  const handleEdit = (r) => {
    setForm({ title: r.title, description: r.description, category: r.category, type: r.type, contentUrl: r.contentUrl, thumbnailUrl: r.thumbnailUrl || '' });
    setEditingId(r._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/learning/${id}`);
      toast.success('Resource deleted');
      fetchResources();
    } catch { toast.error('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/learning/${editingId}`, form);
        toast.success('Resource updated');
      } else {
        await api.post('/learning', form);
        toast.success('Resource created');
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ title: '', description: '', category: 'Modern Farming', type: 'Video', contentUrl: '', thumbnailUrl: '' });
      fetchResources();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🎓 Manage Learning Hub</h1>
          <p>Add educational videos and articles for farmers</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', category: 'Modern Farming', type: 'Video', contentUrl: '', thumbnailUrl: '' }); }}>
          {showForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent)' }}>
          <h3 style={{ marginBottom: 20 }}>{editingId ? 'Edit Resource' : 'New Resource'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Modern Farming', 'Technology', 'Pest Control', 'Crop Management', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Media Type *</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option>Video</option>
                  <option>Article</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Content URL (Link) *</label>
                <input required type="url" placeholder="https://..." value={form.contentUrl} onChange={e => setForm({ ...form, contentUrl: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Thumbnail Image URL (Optional)</label>
                <input type="url" placeholder="https://..." value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Resource</button>
          </form>
        </div>
      )}

      {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
        <div className="card-table">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>{r.title}</td>
                  <td><span className="badge badge-gray">{r.category}</span></td>
                  <td>{r.type}</td>
                  <td>
                    <span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(r)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>No resources found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
