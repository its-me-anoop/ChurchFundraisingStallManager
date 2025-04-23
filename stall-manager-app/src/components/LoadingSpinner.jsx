import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} border-4 border-vision-accent border-t-transparent rounded-full animate-spin`}></div>
      {message && <p className="mt-3 text-vision-text-secondary">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
