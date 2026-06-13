// KisanSaathi — Farmer Learning Page
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CATS = ['All', 'Modern Farming', 'Technology', 'Pest Control', 'Crop Management', 'Other'];

export default function FarmerLearning() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [type, setType] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchResources(); }, [cat, type]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== 'All') params.set('category', cat);
      if (type !== 'All') params.set('type', type);
      if (search) params.set('search', search);

      const { data } = await api.get(`/learning?${params}`);
      setResources(data);
    } catch {
      toast.error('Failed to load learning resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchResources();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🎓 Learning Hub</h1>
          <p>Learn new farming techniques, modern technology, and best practices.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <input 
          className="search-input" 
          placeholder="🔍 Search topics..." 
          value={search}
          onChange={e => setSearch(e.target.value)} 
          onKeyDown={handleSearch} 
        />
        <select className="btn btn-outline" value={type} onChange={e => setType(e.target.value)} style={{ padding: '8px 16px', borderRadius: 8 }}>
          <option value="All">🎥 Media: All</option>
          <option value="Video">Videos</option>
          <option value="Article">Articles</option>
        </select>
        {CATS.map(c => (
          <button key={c} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner"/></div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No learning resources found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {resources.map(r => (
            <div key={r._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 180, background: '#e0e0e0', position: 'relative' }}>
                {r.thumbnailUrl ? (
                  <img src={r.thumbnailUrl} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: '#1b4332', color: 'white' }}>
                    {r.type === 'Video' ? '▶️' : '📄'}
                  </div>
                )}
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 'bold' }}>
                  {r.type}
                </div>
              </div>
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="badge badge-gray" style={{ alignSelf: 'flex-start', marginBottom: 12 }}>{r.category}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 8, lineHeight: 1.3 }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>{r.description}</p>
                <a 
                  href={r.contentUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-primary" 
                  style={{ display: 'block', textAlign: 'center', marginTop: 16, textDecoration: 'none' }}
                >
                  {r.type === 'Video' ? '🎥 Watch Video' : '📖 Read Article'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
