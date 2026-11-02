import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Send, CheckCircle2, AlertCircle, X, Image } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { categories } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function RegisterComplaint() {
  const { submitComplaint } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState({ title: '', category: '', description: '', location: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) { setError('Please upload a valid image file.'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.title.trim())   { setError('Complaint title is required.'); return; }
    if (!form.category)       { setError('Please select a category.'); return; }
    if (!form.description.trim() || form.description.length < 20) { setError('Description must be at least 20 characters.'); return; }
    if (!form.location.trim()) { setError('Location is required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const id = submitComplaint({ ...form, image: imagePreview });
    setLoading(false);
    setSubmitted(id);
  };

  if (submitted) {
    return (
      <DashboardLayout title="Register Complaint">
        <div style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={40} color="#10B981" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 10 }}>Complaint Registered!</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 20 }}>Your complaint has been successfully submitted.</p>
          <div style={{ background: 'var(--sky-50)', border: '1px solid var(--sky-100)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 6 }}>Your Complaint ID</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sky-600)' }}>{submitted}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 6 }}>Save this ID to track your complaint status</p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/track')}>Track Complaint</button>
            <button className="btn btn-outline" onClick={() => { setSubmitted(null); setForm({ title:'', category:'', description:'', location:'' }); setImagePreview(null); }}>
              Submit Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Register Complaint">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--navy-900), var(--sky-600))', color: 'white' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={24} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Register New Complaint</h2>
              <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '0.875rem' }}>Fill the form below to submit your civic complaint</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-group">
                <label className="form-label">Complaint Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input id="comp-title" type="text" className="form-control" placeholder="Brief title of your complaint (e.g., Deep pothole on MG Road)"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select id="comp-category" className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select complaint category</option>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Problem Description <span style={{ color: 'var(--danger)' }}>*</span></label>
                <textarea id="comp-desc" className="form-control" rows={5} placeholder="Describe the problem in detail. Include severity, how long it's been present, and impact on residents (min. 20 characters)."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 4 }}>{form.description.length} characters</span>
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input id="comp-location" type="text" className="form-control" placeholder="Enter complete address (street, area, city, pincode)"
                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={{ paddingLeft: 42 }} />
                  <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Photo Evidence (Optional)</label>
                {imagePreview ? (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '2px solid var(--sky-200)' }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 280, objectFit: 'cover' }} />
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                      style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.6)', color: 'white', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`upload-area${drag ? ' drag-over' : ''}`}
                    onClick={() => fileRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                  >
                    <div className="upload-icon"><Image size={40} /></div>
                    <p style={{ fontWeight: 600, color: 'var(--gray-600)', marginBottom: 4 }}>Click to upload or drag & drop</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>PNG, JPG, WEBP up to 5MB</p>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                  </div>
                )}
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setForm({ title:'', category:'', description:'', location:'' })}>Reset</button>
                <button id="submit-complaint-btn" type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160, justifyContent: 'center' }}>
                  {loading ? 'Submitting…' : <><Send size={16} /> Submit Complaint</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
