import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://127.0.0.1:5050/api';
export const SOCKET_URL = 'http://127.0.0.1:5050';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true
});

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hospital_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
