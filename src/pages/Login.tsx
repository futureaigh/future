import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert } from 'lucide-react';

export const Login: React.FC<{ user: any; isAdmin: boolean }> = ({ user, isAdmin }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      setError(e.message);
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
        className="max-w-md w-full bg-white border border-gray-100 p-10 rounded-[2.5rem] text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-navy/20">
          <LogIn className="text-brand-gold" size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4 text-brand-navy tracking-tighter">Admin Portal</h1>
        <p className="text-gray-500 mb-8">
          Sign in with your authorized Google account to manage the Future platform.
        </p>

        {user && !isAdmin && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center gap-3 text-sm text-left">
            <ShieldAlert size={20} className="shrink-0" />
            <p>Your account does not have admin privileges. If you are a team member, please contact Palmer.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full btn-primary py-4"
        >
          {loading ? 'Connecting...' : (
            <>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
              Sign in with Google
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
