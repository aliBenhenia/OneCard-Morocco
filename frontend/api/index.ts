const axios = require('axios');

// Create an Axios instance with baseURL + config
const api = axios.create({
  baseURL: 'http://localhost:3001', // your API base
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies if needed
});

// ==================== INTERCEPTORS ====================
// Add a request interceptor (e.g., attach tokens)
api.interceptors.request.use(
  (config) => {
    // Example: attach auth token if you have one
    // const token = "yourAuthToken";
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor (handle global errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
