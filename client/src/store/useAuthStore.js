import { create } from 'zustand';
import api from '../lib/api-client.js';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await api.get('/v1/auth/me', { skipAuthRefresh: true });
      set({ user: response.data, isAuthenticated: true, error: null });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/v1/auth/login', { email, password });
      set({ user: response.data, isAuthenticated: true, error: null });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      set({ error: errMsg });
      return { success: false, error: errMsg };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/v1/auth/register', { fullName, email, password });
      set({ user: response.data, isAuthenticated: true, error: null });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      set({ error: errMsg });
      return { success: false, error: errMsg };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/v1/auth/logout');
    } catch (err) {
      console.error('Logout error on backend:', err);
    } finally {
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
