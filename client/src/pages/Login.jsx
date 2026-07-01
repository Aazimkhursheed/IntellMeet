import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back to IntellMeet!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Authentication failed');
    }
  };

  return (
    <div className="w-full max-w-md p-2">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-400">
            Enter your credentials to access your meeting space
          </p>
        </div>

        {/* Server Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-zinc-300">
              Email address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) {
                    setFormErrors((prev) => ({ ...prev, email: null }));
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition duration-200 disabled:opacity-50"
              />
            </div>
            {formErrors.email && (
              <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-semibold text-zinc-300">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) {
                    setFormErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition duration-200 disabled:opacity-50"
              />
            </div>
            {formErrors.password && (
              <p className="text-xs text-red-400 mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 mt-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-semibold rounded-xl transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-zinc-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="text-violet-400 hover:text-violet-300 font-semibold underline transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
