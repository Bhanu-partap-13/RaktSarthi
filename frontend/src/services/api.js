import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (googleData) => api.post('/auth/google', googleData),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDonors: (params) => api.get('/users/donors', { params }),
};

// Blood Bank API
export const bloodBankAPI = {
  getAll: (params) => api.get('/bloodbanks', { params }),
  getById: (id) => api.get(`/bloodbanks/${id}`),
  create: (data) => api.post('/bloodbanks', data),
  updateInventory: (id, data) => api.put(`/bloodbanks/${id}/inventory`, data),
};

// Blood Request API
export const requestAPI = {
  getAll: (params) => api.get('/requests', { params }),
  getMyRequests: () => api.get('/requests/my-requests'),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
};

// Event API
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  create: (data) => api.post('/events', data),
  register: (id) => api.post(`/events/${id}/register`),
};

export default api;
