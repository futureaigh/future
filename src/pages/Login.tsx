import React, { useState } from 'react';
import { auth, loginWithPassword } from '../firebase';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, User, Lock } from 'lucide-react';

export const Login: React.FC<{ user: any; isAdmin: boolean }> = ({ user, isAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginWithPassword(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user && isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-navy/20">
          <LogIn className="text-brand-gold" size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4 text-brand-navy tracking-tighter text-center">Admin Portal</h1>
        <p className="text-gray-500 mb-8 text-center">
          Sign in with your admin credentials to manage the Future platform.
        </p>

        {user && !isAdmin && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center gap-3 text-sm text-left">
            <ShieldAlert size={20} className="shrink-0" />
            <p>This account does not have admin privileges. Please contact Palmer.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold outline-none transition-all text-brand-navy font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-gold outline-none transition-all text-brand-navy font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full btn-primary py-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
