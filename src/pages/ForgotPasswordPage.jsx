import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { toast.error('Supabase not configured.'); return; }
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    } finally { setSubmitting(false); }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-white/50 mb-6">We sent a password reset link to <span className="text-white font-medium">{email}</span></p>
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Back to sign in</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Reset password</h2>
      <p className="text-white/50 mb-8">Enter your email to receive a reset link</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="Email address" className="input-field pl-12" id="forgot-email" />
        </div>
        <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-center text-sm text-white/50 mt-6">
        <Link to="/login" className="text-primary-400 hover:text-primary-300">Back to sign in</Link>
      </p>
    </motion.div>
  );
}
