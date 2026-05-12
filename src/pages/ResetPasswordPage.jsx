import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setReady(true);
        setHasSession(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error(error.message);
        setReady(true);
        setHasSession(false);
        return;
      }

      setHasSession(Boolean(data.session));
      setReady(true);
    };

    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Supabase not configured.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated. You can sign in now.');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
        <p className="text-white/60">Loading reset link...</p>
      </motion.div>
    );
  }

  if (!hasSession) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Reset link required</h2>
        <p className="text-white/50 mb-6">Open the reset link from your email to continue.</p>
        <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 font-medium">
          Send another reset link
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Set a new password</h2>
      <p className="text-white/50 mb-8">Choose a strong password for your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="New password"
            className="input-field pl-12"
          />
        </div>
        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            placeholder="Confirm new password"
            className="input-field pl-12"
          />
        </div>

        <button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
          {submitting ? 'Updating...' : 'Update password'}
        </button>
      </form>

      <p className="text-center text-sm text-white/50 mt-6">
        <Link to="/login" className="text-primary-400 hover:text-primary-300">Back to sign in</Link>
      </p>
    </motion.div>
  );
}
