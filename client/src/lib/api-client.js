import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors globally and rotate tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Standardized API error extraction
    const message = error.response?.data?.message || 'Something went wrong';

    // Check if error is 401 and request has not been retried yet
    // Avoid infinite loop if the request is already the refresh-token endpoint
    const noRefreshPaths = ['/refresh-token', '/login', '/register', '/logout'];
    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      originalRequest.url &&
      !noRefreshPaths.some((path) => originalRequest.url.includes(path));

    if (shouldAttemptRefresh) {
      originalRequest._retry = true;
      try {
        // Attempt silent refresh
        await api.post('/v1/auth/refresh-token');
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or invalid, log out the user
        console.warn('Session expired, logging out...');
        try {
          const { default: useAuthStore } = await import('../store/useAuthStore.js');
          useAuthStore.getState().logout();
        } catch (storeError) {
          console.error('Failed to import useAuthStore for logout:', storeError);
        }
        return Promise.reject(refreshError);
      }
    }

    console.error(`API Error: ${message}`);
    return Promise.reject(error);
  }
);

export default api;
