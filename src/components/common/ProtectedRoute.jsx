import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  // If Supabase isn't configured, allow access (dev mode)
  if (!isSupabaseConfigured) return children;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
