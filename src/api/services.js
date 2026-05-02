import api from './client';

// ─── Auth APIs ──────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  sendOTP: (email) => api.post('/auth/send-otp', { email }),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Project APIs ───────────────────────────────────────────
export const projectAPI = {
  getAll: (params = {}) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// ─── Task APIs ──────────────────────────────────────────────
export const taskAPI = {
  getAll: (projectId, params = {}) =>
    api.get(`/projects/${projectId}/tasks`, { params }),
  create: (projectId, data) =>
    api.post(`/projects/${projectId}/tasks`, data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  toggle: (id) => api.put(`/tasks/${id}/toggle`),
  delete: (id) => api.delete(`/tasks/${id}`),
};
