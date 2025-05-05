import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = '', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-primary-500 dark:border-primary-400 border-t-transparent dark:border-t-transparent rounded-full animate-spin transition-colors duration-200`}></div>
      {message && <p className="mt-3 text-light-text-secondary dark:text-dark-text-secondary text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
