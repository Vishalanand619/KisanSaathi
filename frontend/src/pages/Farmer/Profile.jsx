import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATES = ['Madhya Pradesh','Uttar Pradesh','Maharashtra','Punjab','Haryana','Gujarat','Rajasthan','Karnataka','Andhra Pradesh','Tamil Nadu','Bihar','West Bengal','Odisha','Jharkhand','Chhattisgarh','Other'];
const CROPS = ['Wheat','Rice','Maize','Soybean','Cotton','Mustard','Gram (Chana)','Sugarcane','Potato','Onion','Tomato','Groundnut','Bajra','Jowar','Tur (Arhar)','Moong','Urad','Other'];

export default function FarmerProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name||'', phone: user?.phone||'', state: user?.state||'',
    district: user?.district||'', village: user?.village||'',
    landHolding: user?.landHolding||'', cropType: user?.cropType||'',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const profileItems = [
    { label:'Email', value:user?.email, icon:'📧' },
    { label:'Mobile', value:user?.phone||'Not set', icon:'📞' },
    { label:'State', value:user?.state||'Not set', icon:'📍' },
    { label:'District', value:user?.district||'Not set', icon:'🏘️' },
    { label:'Village', value:user?.village||'Not set', icon:'🏡' },
    { label:'Land Holding', value:user?.landHolding?`${user.landHolding} Acres`:'Not set', icon:'🌾' },
    { label:'Primary Crop', value:user?.cropType||'Not set', icon:'🌱' },
    { label:'Member Since', value:new Date(user?.createdAt||Date.now()).toLocaleDateString('en-IN',{month:'long',year:'numeric'}), icon:'📅' },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1>👤 My Profile</h1><p>Manage your farmer account and details</p></div>
        {!editing && <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:24, alignItems:'start' }}>
        
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:800, margin:'0 auto 14px' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--primary-dark)', marginBottom:6 }}>{user?.name}</h2>
          <span className="badge badge-success" style={{ fontSize:13 }}>🌾 Verified Farmer</span>
          <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:10 }}>
            {profileItems.map(({ label, value, icon }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--bg)', borderRadius:8, textAlign:'left' }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
        {editing ? (
          <div className="card">
            <h3 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:20 }}>✏️ Edit Your Details</h3>
            <form onSubmit={handleSave}>
              <div style={{ background:'#f0f7f0', borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
                <div style={{ fontWeight:700, marginBottom:12, color:'#1b4332' }}>👤 Personal</div>
                <div className="form-grid">
                  <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
                  <div className="form-group"><label>Mobile Number</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit" maxLength={10} /></div>
                </div>
              </div>
              <div style={{ background:'#fff8f0', borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
                <div style={{ fontWeight:700, marginBottom:12, color:'#8a4000' }}>📍 Location</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>State</label>
                    <select value={form.state} onChange={e => set('state', e.target.value)}>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>District</label><input value={form.district} onChange={e => set('district', e.target.value)} placeholder="District name" /></div>
                  <div className="form-group"><label>Village / Town</label><input value={form.village} onChange={e => set('village', e.target.value)} placeholder="Village name" /></div>
                </div>
              </div>
              <div style={{ background:'#e8f5e9', borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
                <div style={{ fontWeight:700, marginBottom:12, color:'#1b5e20' }}>🌱 Farm Details</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Land Holding (Acres)</label>
                    <input type="number" step="0.5" min="0" value={form.landHolding} onChange={e => set('landHolding', e.target.value)} placeholder="e.g. 5" />
                  </div>
                  <div className="form-group">
                    <label>Primary Crop</label>
                    <select value={form.cropType} onChange={e => set('cropType', e.target.value)}>
                      <option value="">Select Crop</option>
                      {CROPS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'⏳ Saving...':'✅ Save Changes'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          
            <div className="card" style={{ background:'linear-gradient(135deg, #1b4332, #2d6a2f)', color:'#fff' }}>
              <h3 style={{ marginBottom:16, fontSize:17 }}>🌾 KisanSaathi Tips for You</h3>
              {[
                { icon:'💡', tip:'Update your land holding details to get scheme recommendations matching your farm size.' },
                { icon:'⚡', tip:'File complaints with as much detail as possible — ticket ID helps track resolution.' },
                { icon:'📊', tip:'Check market prices every morning before selling to nearby mandis.' },
                { icon:'⏰', tip:'Apply for PM-KISAN and PMFBY before their deadlines to avoid missing benefits.' },
                { icon:'📞', tip:'Call scheme helplines directly for faster resolution of scheme-related issues.' },
              ].map(({ icon, tip }) => (
                <div key={tip} style={{ display:'flex', gap:10, marginBottom:12, fontSize:14 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
                  <p style={{ color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>{tip}</p>
                </div>
              ))}
            </div>

            
            <div className="card">
              <h3 style={{ fontWeight:700, color:'var(--primary-dark)', marginBottom:14, fontSize:15 }}>📞 Important Helplines</h3>
              {[
                { name:'PM-KISAN', number:'155261 / 1800115526' },
                { name:'PMFBY (Crop Insurance)', number:'1800-180-1551' },
                { name:'Kisan Call Center', number:'1800-180-1551' },
                { name:'Soil Health Card', number:'1800-180-1551' },
                { name:'National Agriculture Market (eNAM)', number:'1800-270-0224' },
              ].map(({ name, number }) => (
                <div key={name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <span style={{ fontSize:14, fontWeight:600 }}>{name}</span>
                  <a href={`tel:${number.split(' ')[0]}`} style={{ fontFamily:'monospace', fontSize:14, color:'var(--primary)', fontWeight:700 }}>{number}</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
