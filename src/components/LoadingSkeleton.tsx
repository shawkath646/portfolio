"use client";
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'video' | 'stats';
  count?: number;
  className?: string;
}

const LoadingSkeleton = ({ type = 'card', count = 1, className = '' }: LoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        );
      
      case 'video':
        return (
          <div className="animate-pulse space-y-4">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        );
      
      default:
        return (
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
