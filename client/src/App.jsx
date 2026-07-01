import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from './store/useAuthStore.js';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Meetings from './pages/Meetings.jsx';
import MeetingDetails from './pages/MeetingDetails.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import MeetingLobby from './pages/MeetingLobby.jsx';
import MeetingRoom from './pages/MeetingRoom.jsx';

function WelcomeScreen() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-semibold text-violet-400 animate-pulse">
          <Sparkles size={12} />
          <span>Authentication Module Complete</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight">
          IntellMeet
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
          Enterprise Meeting & Collaboration Platform. Technical foundation with secure JWT tokens and role management is live.
        </p>
      </div>

      {/* Access Dashboard Actions */}
      <div className="max-w-md w-full mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-4 shadow-lg">
        <h2 className="text-md font-bold text-white">System Status</h2>
        <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/40 text-sm space-y-3">
          <p className="text-zinc-300">
            Session status:{' '}
            {isAuthenticated ? (
              <span className="text-emerald-400 font-bold">Active User Session</span>
            ) : (
              <span className="text-amber-500 font-bold">Anonymous Access</span>
            )}
          </p>
          {isAuthenticated && (
            <p className="text-zinc-400 text-xs font-mono">
              User: {user?.fullName} | Role: {user?.role}
            </p>
          )}
        </div>
        <div className="pt-2">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full block py-2.5 px-4 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm rounded-xl transition duration-200 text-center"
            >
              Enter Dashboard
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-white border border-zinc-700 font-semibold text-sm rounded-xl transition duration-200 text-center flex items-center justify-center space-x-1.5"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-sm rounded-xl transition duration-200 text-center flex items-center justify-center space-x-1.5"
              >
                <UserPlus size={14} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { checkAuth, isCheckingAuth, isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  // Run session check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
        <p className="text-zinc-400 text-sm font-medium animate-pulse">Initializing app security...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-white text-lg">
            <span className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-xs font-black shadow-md shadow-violet-500/20">
              I
            </span>
            <span className="tracking-tight">IntellMeet</span>
          </Link>
          <nav className="flex items-center space-x-5 text-sm font-medium text-zinc-400">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-white transition flex items-center space-x-1">
                  <span>Dashboard</span>
                </Link>
                <div className="h-4 w-px bg-zinc-800"></div>
                <div className="flex items-center space-x-3">
                  <span className="text-zinc-300 text-xs bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-lg">
                    {user?.fullName} ({user?.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition text-xs font-semibold cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-grow flex items-center justify-center py-10">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Protected Routes Group with AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/meetings/:id" element={<MeetingDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/meeting/:meetingCode" element={<MeetingLobby />} />
              <Route path="/meeting-room/:meetingCode" element={<MeetingRoom />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <div>IntellMeet - MERN Full-Stack Foundation System. Zidio Development March 2026.</div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
