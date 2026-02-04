import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token/params if needed
api.interceptors.request.use((config) => {
    // We can add logic here to handle tokens if the backend uses headers
    // However, the backend seems to use query params for 'action'
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle errors globally
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        // Handle unauthorized
    }
    return Promise.reject(error);
});

export default api;

export const apiRequest = async (action: string, data: any = {}, method: 'GET' | 'POST' = 'POST') => {
    const url = `?action=${action}`;
    try {
        const response = await api({
            url,
            method,
            data: method === 'POST' ? data : undefined,
            params: method === 'GET' ? data : undefined,
        });
        return response.data;
    } catch (error: any) {
        return {
            status: 'error',
            message: error.response?.data?.message || error.message || 'Something went wrong',
            data: []
        };
    }
};
