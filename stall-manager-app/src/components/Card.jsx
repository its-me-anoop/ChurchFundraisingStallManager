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
  // Base classes
  const baseClasses = 'glass-card rounded-2xl border border-vision-border backdrop-blur-md';
  
  // Padding classes
  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-6',
    large: 'p-8'
  };
  
  // Elevation (shadow) classes
  const elevationClasses = {
    none: '',
    low: 'shadow-sm',
    normal: 'shadow-glass',
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
          <h3 className="text-xl font-semibold">{title}</h3>
          {subtitle && <p className="text-vision-text-secondary text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={title ? '' : 'pt-0'}>
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-vision-border">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
