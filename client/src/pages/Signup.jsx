import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ArrowRight, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore.js';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
    clearError();
  }, [isAuthenticated, navigate, clearError]);

  // Real-time password requirement checks
  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!fullName || fullName.trim() === '') {
      errors.fullName = 'Full name is required';
    }

    if (!email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else {
      if (!passwordCriteria.length) {
        errors.password = 'Password must be at least 8 characters long';
      } else if (!passwordCriteria.uppercase) {
        errors.password = 'Password must contain at least one uppercase letter';
      } else if (!passwordCriteria.lowercase) {
        errors.password = 'Password must contain at least one lowercase letter';
      } else if (!passwordCriteria.number) {
        errors.password = 'Password must contain at least one number';
      }
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await register(fullName, email, password);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md p-2">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an account</h1>
          <p className="text-sm text-zinc-400">
            Sign up to collaborate and stream with your team
          </p>
        </div>

        {/* Server Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-semibold text-zinc-300">
              Full name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <User size={16} />
              </span>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (formErrors.fullName) {
                    setFormErrors((prev) => ({ ...prev, fullName: null }));
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition duration-200 disabled:opacity-50"
              />
            </div>
            {formErrors.fullName && (
              <p className="text-xs text-red-400 mt-1">{formErrors.fullName}</p>
            )}
          </div>

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
            <label htmlFor="password" className="text-xs font-semibold text-zinc-300">
              Password
            </label>
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

            {/* Real-time Password Checklist (Only show if password isn't empty) */}
            {password.length > 0 && (
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl text-[11px] space-y-1.5 mt-2">
                <p className="font-semibold text-zinc-400">Password requirements:</p>
                <div className="grid grid-cols-2 gap-2 text-zinc-500">
                  <div className="flex items-center space-x-1.5">
                    {passwordCriteria.length ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <X size={12} className="text-red-400" />
                    )}
                    <span className={passwordCriteria.length ? 'text-zinc-300' : ''}>Min 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {passwordCriteria.uppercase ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <X size={12} className="text-red-400" />
                    )}
                    <span className={passwordCriteria.uppercase ? 'text-zinc-300' : ''}>1 uppercase letter</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {passwordCriteria.lowercase ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <X size={12} className="text-red-400" />
                    )}
                    <span className={passwordCriteria.lowercase ? 'text-zinc-300' : ''}>1 lowercase letter</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {passwordCriteria.number ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <X size={12} className="text-red-400" />
                    )}
                    <span className={passwordCriteria.number ? 'text-zinc-300' : ''}>1 number</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-zinc-300">
              Confirm password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                <Lock size={16} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (formErrors.confirmPassword) {
                    setFormErrors((prev) => ({ ...prev, confirmPassword: null }));
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition duration-200 disabled:opacity-50"
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{formErrors.confirmPassword}</p>
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Sign up</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-zinc-400 mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-violet-400 hover:text-violet-300 font-semibold underline transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
