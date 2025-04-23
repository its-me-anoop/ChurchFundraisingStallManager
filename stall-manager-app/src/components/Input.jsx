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
        <label htmlFor={id} className="block text-vision-text-secondary text-sm font-medium mb-1">
          {label} {required && <span className="text-red-400">*</span>}
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
        className={`w-full bg-vision-card border ${error ? 'border-red-400' : 'border-vision-border'} rounded-lg p-3 text-vision-text placeholder-vision-text-secondary focus:outline-none focus:ring-2 focus:ring-vision-accent backdrop-blur-sm ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
      />
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-vision-text-secondary">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
