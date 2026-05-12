import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error('Supabase not configured. Add env variables to enable auth.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await signUp(email, password);
      toast.success('Account created! Check your email to verify.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
      <p className="text-white/50 mb-8">Join WeatherIQ for personalized weather alerts</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="Email address" className="input-field pl-12" id="register-email" />
        </div>
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            required minLength={6} placeholder="Password (min 6 chars)" className="input-field pl-12 pr-12" id="register-password" />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition-colors">
            {showPass ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        </div>
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            required minLength={6} placeholder="Confirm password" className="input-field pl-12" id="register-confirm" />
        </div>

        <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50" id="register-submit">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-white/50 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
      </p>
    </motion.div>
  );
}
