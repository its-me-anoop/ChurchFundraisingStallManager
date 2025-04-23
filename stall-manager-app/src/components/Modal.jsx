import React, { useEffect, useRef } from 'react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = ''
}) => {
  const modalRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle outside click
  const handleOutsideClick = (event) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const modalSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className={`glass-card w-full ${modalSize} max-h-[90vh] overflow-hidden flex flex-col ${className}`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-vision-border">
          <h3 className="text-xl font-semibold">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-vision-text-secondary hover:text-vision-text focus:outline-none"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-grow">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 border-t border-vision-border">
            {footer}
          </div>
        )}

        {/* Default Footer if no custom footer is provided */}
        {!footer && (
          <div className="p-4 border-t border-vision-border flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
