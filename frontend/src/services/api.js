import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
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

// Authentication
export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Jobs
export const getJobs = async () => {
    const response = await api.get('/jobs');
    return response.data;
};

// Email Configuration
export const getEmailConfigs = async () => {
    const response = await api.get('/email-config');
    return response.data;
};

export const addEmailConfig = async (email) => {
    const response = await api.post('/email-config', { sender_email: email });
    return response.data;
};

export const deleteEmailConfig = async (id) => {
    const response = await api.delete(`/email-config/${id}`);
    return response.data;
};

export const sendReport = async () => {
    const response = await api.post('/email-config/send-report');
    return response.data;
};

export default api;
