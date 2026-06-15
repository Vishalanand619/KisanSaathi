import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function FarmerMarket() {
  const [prices, setPrices] = useState([]);
  const [states, setStates] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ state:'', search:'' });

  useEffect(() => {
    api.get('/market/states').then(r => setStates(r.data)).catch(() => {});
    api.get('/market/crops').then(r => setCrops(r.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchPrices(); }, [filters.state]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filters.state) params.set('state', filters.state);
      if (filters.search) params.set('search', filters.search);
      const { data } = await api.get(`/market?${params}`);
      setPrices(data.data || data);
    } catch { toast.error('Failed to load prices'); }
    finally { setLoading(false); }
  };

  const filtered = filters.search
    ? prices.filter(p => p.crop.toLowerCase().includes(filters.search.toLowerCase()) || p.market.toLowerCase().includes(filters.search.toLowerCase()))
    : prices;

  
  const byState = filtered.reduce((acc, p) => {
    if (!acc[p.state]) acc[p.state] = [];
    acc[p.state].push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>💹 Live Mandi Prices</h1>
          <p>Wholesale prices from Indian Agriculture Marketing Network (Agmarknet) — data.gov.in</p>
        </div>
      </div>



      <div className="filter-row">
        <input className="search-input" placeholder="🔍 Search crop or mandi..."
          value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <select style={{ padding:'10px 14px', border:'1.5px solid var(--border)', borderRadius:7, fontFamily:'Mukta', fontSize:15, background:'#fff', minWidth:200 }}
          value={filters.state} onChange={e => setFilters({ ...filters, state: e.target.value })}>
          <option value="">🌍 All States</option>
          {states.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-outline btn-sm" onClick={fetchPrices}>🔄 Refresh</button>
      </div>

      
      {!loading && filtered.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:'var(--primary-dark)', marginBottom:12 }}>⭐ Featured Prices Today</h3>
          <div className="grid-4">
            {filtered.slice(0,4).map(p => (
              <div key={p._id} style={C.priceCard}>
                <div style={C.cropName}>{p.crop}</div>
                {p.variety && p.variety !== 'Common' && <div style={C.variety}>{p.variety}</div>}
                <div style={C.priceMain}>₹{Number(p.price).toLocaleString('en-IN')}</div>
                <div style={C.priceUnit}>per {p.unit}</div>
                {(p.minPrice || p.maxPrice) && (
                  <div style={C.range}>
                    <span style={{ color:'var(--danger)' }}>↓{p.minPrice?`₹${p.minPrice}`:'-'}</span>
                    {' — '}
                    <span style={{ color:'var(--success)' }}>↑{p.maxPrice?`₹${p.maxPrice}`:'-'}</span>
                  </div>
                )}
                <div style={C.market}>{p.market}, {p.state}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {loading ? <div className="spinner-wrap"><div className="spinner"/></div> : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">💹</div><p>No price data found</p></div>
      ) : filters.state ? (

        <div className="card">
          <PriceTable rows={filtered} />
        </div>
      ) : (
     
        Object.entries(byState).map(([state, rows]) => (
          <div key={state} className="card" style={{ marginBottom:16 }}>
            <h4 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:14, fontSize:15 }}>📍 {state} <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:13 }}>({rows.length} prices)</span></h4>
            <PriceTable rows={rows} />
          </div>
        ))
      )}

      <div style={{ marginTop:16, padding:'12px 16px', background:'#fffde7', borderRadius:8, fontSize:13, color:'#8a6d00', border:'1px solid #ffe082' }}>
        📊 Source: <strong>Agmarknet (data.gov.in)</strong> — Ministry of Agriculture & Farmers Welfare, Govt. of India. Prices are wholesale modal rates in ₹/quintal unless noted.
      </div>
    </div>
  );
}

function PriceTable({ rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Crop</th><th>Variety</th><th>Modal Price</th><th>Min</th><th>Max</th><th>Unit</th><th>Mandi</th><th>District</th><th>Updated</th></tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p._id}>
              <td><strong style={{ color:'var(--primary-dark)' }}>{p.crop}</strong></td>
              <td style={{ fontSize:13, color:'var(--text-muted)' }}>{p.variety||'—'}</td>
              <td><strong style={{ color:'var(--primary)', fontSize:15 }}>₹{Number(p.price).toLocaleString('en-IN')}</strong></td>
              <td style={{ color:'var(--danger)', fontSize:13 }}>{p.minPrice?`₹${Number(p.minPrice).toLocaleString('en-IN')}`:'-'}</td>
              <td style={{ color:'var(--success)', fontSize:13 }}>{p.maxPrice?`₹${Number(p.maxPrice).toLocaleString('en-IN')}`:'-'}</td>
              <td style={{ fontSize:13 }}>{p.unit}</td>
              <td style={{ fontSize:13 }}>{p.market}</td>
              <td style={{ fontSize:13, color:'var(--text-muted)' }}>{p.district||'—'}</td>
              <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(p.updatedAt||p.date).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const C = {
  priceCard: { background:'#fff', border:'1px solid var(--border)', borderRadius:12, padding:'18px 16px', boxShadow:'var(--shadow-sm)', textAlign:'center' },
  cropName: { fontSize:17, fontWeight:800, color:'var(--primary-dark)', marginBottom:3 },
  variety: { fontSize:12, color:'var(--text-muted)', marginBottom:8 },
  priceMain: { fontSize:28, fontWeight:800, color:'var(--primary)' },
  priceUnit: { fontSize:12, color:'var(--text-muted)', marginBottom:6 },
  range: { fontSize:12, marginBottom:8 },
  market: { fontSize:12, color:'var(--text-muted)', fontWeight:500 },
};
