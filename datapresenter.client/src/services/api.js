import axios from 'axios';

const API_BASE_URL = 'https://localhost:7054/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    changePassword: (passwords) => api.post('/auth/change-password', passwords),
    getCurrentUser: () => api.get('/auth/me'),
};

export const seriesAPI = {
    getAll: () => api.get('/series'),
    getById: (id) => api.get(`/series/${id}`), 
    create: (data) => api.post('/series', data),
    update: (id, data) => api.put(`/series/${id}`, data),  
    delete: (id) => api.delete(`/series/${id}`), 
};

export const measurementsAPI = {
    getAll: (params) => api.get('/measurements', { params }),
    getById: (id) => api.get(`/measurements/${id}`),  
    create: (data) => api.post('/measurements', data),
    update: (id, data) => api.put(`/measurements/${id}`, data),  
    delete: (id) => api.delete(`/measurements/${id}`),  
};
export default api;