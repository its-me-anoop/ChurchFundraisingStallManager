import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  padding = 'normal',
  elevation = 'normal'
}) => {
  // Base classes - with dark mode support
  const baseClasses = 'rounded-2xl border backdrop-blur-md bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border transition-colors duration-200';
  
  // Padding classes
  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-6',
    large: 'p-8'
  };
  
  // Elevation (shadow) classes - with dark mode support
  const elevationClasses = {
    none: '',
    low: 'shadow-sm',
    normal: 'shadow-light dark:shadow-dark',
    high: 'shadow-xl'
  };
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses} 
    ${paddingClasses[padding]} 
    ${elevationClasses[elevation]}
    ${className}
  `.trim();
  
  return (
    <div className={cardClasses}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">{title}</h3>
          {subtitle && <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={`${title ? '' : 'pt-0'} text-light-text dark:text-dark-text`}>
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
