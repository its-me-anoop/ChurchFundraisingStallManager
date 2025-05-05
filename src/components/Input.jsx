import React from 'react';

const Input = ({
  id,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  min,
  max,
  step,
  pattern,
  maxLength,
  inputMode,
  autoComplete,
  helpText,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium mb-1 transition-colors duration-200">
          {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={`w-full bg-light-card dark:bg-dark-card border ${
          error ? 'border-red-500 dark:border-red-400' : 'border-light-border dark:border-dark-border'
        } rounded-lg p-3 text-light-text dark:text-dark-text 
        placeholder-light-text-secondary dark:placeholder-dark-text-secondary 
        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 
        backdrop-blur-sm transition-colors duration-200 ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        {...props}
      />
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary transition-colors duration-200">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400 transition-colors duration-200">{error}</p>
      )}
    </div>
  );
};

export default Input;
