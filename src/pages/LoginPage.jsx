import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error('Supabase not configured. Add env variables to enable auth.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
      <p className="text-white/50 mb-8">Sign in to access your weather dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="Email address" className="input-field pl-12" id="login-email" />
        </div>
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            required minLength={6} placeholder="Password" className="input-field pl-12 pr-12" id="login-password" />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors">
            {showPass ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50" id="login-submit">
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-white/50 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign up</Link>
      </p>

      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <Link to="/dashboard" className="text-sm text-white/40 hover:text-white/60 transition-colors">
          Continue without account →
        </Link>
      </div>
    </motion.div>
  );
}
