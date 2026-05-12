import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try { await signOut(); toast.success('Signed out'); navigate('/'); } catch { toast.error('Failed to sign out'); }
  };

  if (!isSupabaseConfigured || !user) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <FiUser className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-white/50">Sign in to view your profile.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

      <div className="glass-card-strong p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{user.email?.[0]?.toUpperCase() || '?'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <FiMail className="w-5 h-5 text-primary-400" />
            <div>
              <p className="text-xs text-white/50">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <FiCalendar className="w-5 h-5 text-primary-400" />
            <div>
              <p className="text-xs text-white/50">Member since</p>
              <p className="text-white font-medium">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <FiUser className="w-5 h-5 text-primary-400" />
            <div>
              <p className="text-xs text-white/50">User ID</p>
              <p className="text-white font-medium text-sm truncate">{user.id}</p>
            </div>
          </div>
        </div>

        <button onClick={handleSignOut}
          className="w-full mt-8 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-medium">
          <FiLogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </motion.div>
  );
}
