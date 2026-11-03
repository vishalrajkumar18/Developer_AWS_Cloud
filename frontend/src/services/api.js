// ============================================================
// CivicTrack – Frontend API Service
// Bridges React frontend with Flask REST API & MySQL
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Attach token if present
  const token = localStorage.getItem('civictrack_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.warn(`API call failed to ${endpoint}:`, error.message);
    return { ok: false, error: error.message };
  }
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.ok && res.data.token) {
      localStorage.setItem('civictrack_token', res.data.token);
    }
    return res;
  },

  async register(userData) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (res.ok && res.data.token) {
      localStorage.setItem('civictrack_token', res.data.token);
    }
    return res;
  },

  async googleLogin(googleUser) {
    const res = await request('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify(googleUser)
    });
    if (res.ok && res.data.token) {
      localStorage.setItem('civictrack_token', res.data.token);
    }
    return res;
  },

  // Complaints
  async getComplaints(params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    const endpoint = `/complaints${searchParams ? `?${searchParams}` : ''}`;
    return await request(endpoint, { method: 'GET' });
  },

  async getComplaint(id) {
    return await request(`/complaints/${id}`, { method: 'GET' });
  },

  async createComplaint(data) {
    return await request('/complaints', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateComplaint(id, updates) {
    return await request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  // Departments
  async getDepartments() {
    return await request('/departments', { method: 'GET' });
  },

  // Admin
  async getAdminOverview() {
    return await request('/admin/overview', { method: 'GET' });
  },

  // Feedback
  async submitFeedback(data) {
    return await request('/feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default api;
