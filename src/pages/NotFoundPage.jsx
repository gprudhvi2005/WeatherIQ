import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-950 via-primary-950 to-surface-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div className="text-9xl font-bold gradient-text mb-4"
          animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          404
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <Link to="/" className="btn-secondary !bg-white/10 !text-white !border-white/20">Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
