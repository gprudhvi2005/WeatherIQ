import { motion } from 'framer-motion';

const skeletonVariants = {
  shimmer: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <motion.div
        className="h-4 w-1/3 rounded-lg bg-surface-200 dark:bg-surface-700 mb-4"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={skeletonVariants.shimmer}
      />
      <motion.div
        className="h-12 w-2/3 rounded-lg bg-surface-200 dark:bg-surface-700 mb-3"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={skeletonVariants.shimmer}
      />
      <motion.div
        className="h-4 w-1/2 rounded-lg bg-surface-200 dark:bg-surface-700"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={skeletonVariants.shimmer}
      />
    </div>
  );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <motion.div
      className={`${width} ${height} rounded-lg bg-surface-200 dark:bg-surface-700 ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(148,163,184,0.3) 0%, rgba(148,163,184,0.1) 50%, rgba(148,163,184,0.3) 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={skeletonVariants.shimmer}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      {/* Main weather card */}
      <div className="lg:col-span-2">
        <SkeletonCard className="h-64" />
      </div>
      {/* Side cards */}
      <div className="space-y-6">
        <SkeletonCard className="h-28" />
        <SkeletonCard className="h-28" />
      </div>
      {/* Hourly */}
      <div className="lg:col-span-3">
        <SkeletonCard className="h-48" />
      </div>
      {/* Grid */}
      <SkeletonCard className="h-36" />
      <SkeletonCard className="h-36" />
      <SkeletonCard className="h-36" />
    </div>
  );
}
