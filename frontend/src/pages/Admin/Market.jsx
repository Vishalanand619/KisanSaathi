// KisanSaathi — Admin Market Price Management
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATES = ['Madhya Pradesh','Uttar Pradesh','Maharashtra','Punjab','Haryana','Gujarat','Rajasthan','Karnataka','Andhra Pradesh','Tamil Nadu','Bihar','West Bengal'];
const EMPTY = { crop:'', variety:'Common', price:'', minPrice:'', maxPrice:'', unit:'quintal', market:'', district:'', state:'Madhya Pradesh' };

export default function AdminMarket() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { fetchPrices(); }, []);

  const fetchPrices = async () => {
    try { const { data } = await api.get('/market?limit=200'); setPrices(data.data || data); }
    catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post('/market/sync');
      toast.success('🔄 Market price sync triggered! Prices will update from data.gov.in Agmarknet API in background.');
    } catch (e) { toast.error(e.response?.data?.message || 'Sync failed'); }
    finally { setSyncing(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.post('/market', form);
      toast.success('Price saved!'); setForm(EMPTY); setShowForm(false); fetchPrices();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete entry?')) return;
    try { await api.delete(`/market/${id}`); toast.success('Deleted'); fetchPrices(); }
    catch { toast.error('Failed'); }
  };

  const filtered = search
    ? prices.filter(p => p.crop.toLowerCase().includes(search.toLowerCase()) || p.market.toLowerCase().includes(search.toLowerCase()))
    : prices;

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>💹 Market Price Management</h1><p>Manage Agmarknet mandi prices. Sync live from data.gov.in.</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-accent" onClick={handleSync} disabled={syncing}>{syncing?'⏳ Syncing...':'🔄 Live Sync (data.gov.in)'}</button>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm?'✕ Cancel':'+ Add Price'}</button>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom:20 }}>
        <strong>📡 Live Sync:</strong> Click "Live Sync" to fetch real-time prices from <strong>Agmarknet API (data.gov.in)</strong>. Requires <code>DATA_GOV_API_KEY</code> in <code>.env</code>. Get free key at <a href="https://data.gov.in/user/register" target="_blank" rel="noreferrer">data.gov.in</a>.
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:24, borderLeft:'4px solid var(--accent)' }}>
          <h3 style={{ fontWeight:700, marginBottom:20 }}>➕ Add / Update Price</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label>Crop Name *</label><input required value={form.crop} onChange={e => set('crop', e.target.value)} placeholder="e.g. Wheat" /></div>
              <div className="form-group"><label>Variety</label><input value={form.variety} onChange={e => set('variety', e.target.value)} placeholder="e.g. Lokwan, Dara" /></div>
              <div className="form-group"><label>Modal Price (₹) *</label><input type="number" required min={0} value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 2275" /></div>
              <div className="form-group"><label>Min Price (₹)</label><input type="number" min={0} value={form.minPrice} onChange={e => set('minPrice', e.target.value)} /></div>
              <div className="form-group"><label>Max Price (₹)</label><input type="number" min={0} value={form.maxPrice} onChange={e => set('maxPrice', e.target.value)} /></div>
              <div className="form-group"><label>Unit</label><select value={form.unit} onChange={e => set('unit', e.target.value)}>{['quintal','kg','ton'].map(u => <option key={u}>{u}</option>)}</select></div>
              <div className="form-group"><label>Mandi / Market *</label><input required value={form.market} onChange={e => set('market', e.target.value)} placeholder="e.g. Indore Mandi" /></div>
              <div className="form-group"><label>District</label><input value={form.district} onChange={e => set('district', e.target.value)} /></div>
              <div className="form-group"><label>State *</label><select value={form.state} onChange={e => set('state', e.target.value)}>{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'⏳':'✅ Save Price'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-row">
        <input className="search-input" placeholder="🔍 Search crop or market..." value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{ fontSize:14, color:'var(--text-muted)' }}>{filtered.length} entries</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Crop</th><th>Variety</th><th>Modal</th><th>Min</th><th>Max</th><th>Unit</th><th>Market</th><th>State</th><th>Source</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={11} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No prices</td></tr>
              : filtered.map(p => (
                <tr key={p._id}>
                  <td><strong>{p.crop}</strong></td>
                  <td style={{ fontSize:13, color:'var(--text-muted)' }}>{p.variety||'—'}</td>
                  <td><strong style={{ color:'var(--primary)', fontSize:15 }}>₹{Number(p.price).toLocaleString('en-IN')}</strong></td>
                  <td style={{ color:'var(--danger)', fontSize:13 }}>{p.minPrice?`₹${p.minPrice}`:'-'}</td>
                  <td style={{ color:'var(--success)', fontSize:13 }}>{p.maxPrice?`₹${p.maxPrice}`:'-'}</td>
                  <td style={{ fontSize:13 }}>{p.unit}</td>
                  <td style={{ fontSize:13 }}>{p.market}</td>
                  <td><span className="badge badge-info" style={{ fontSize:11 }}>{p.state}</span></td>
                  <td style={{ fontSize:11, color:'var(--text-muted)' }}>{p.source||'Manual'}</td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(p.updatedAt||p.date).toLocaleDateString('en-IN')}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
