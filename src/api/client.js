import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auto-detect the correct backend URL based on platform
// For physical device: replace with your computer's IP (e.g., 192.168.x.x)
const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:5000/api';
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api';
  return 'http://localhost:5000/api'; // iOS
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        await AsyncStorage.multiRemove(['token', 'user']);
        // The auth state will be cleared via Redux
      }
      
      const message = error.response.data?.message || 'Something went wrong';
      return Promise.reject({ ...error, message });
    }
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Request timed out. Please try again.' });
    }
    
    return Promise.reject({ message: 'Network error. Please check your connection.' });
  }
);

export default api;
