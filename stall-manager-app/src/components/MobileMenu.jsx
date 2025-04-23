import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm">
      <div 
        ref={menuRef}
        className="fixed right-0 top-0 h-full w-64 bg-vision-card backdrop-blur-md border-l border-vision-border shadow-lg p-4 transform transition-transform duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="text-vision-text-secondary hover:text-vision-text focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="block py-2 text-vision-text hover:text-white transition-colors duration-200 no-underline"
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy-policy" 
                className="block py-2 text-vision-text hover:text-white transition-colors duration-200 no-underline"
                onClick={onClose}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms-of-service" 
                className="block py-2 text-vision-text hover:text-white transition-colors duration-200 no-underline"
                onClick={onClose}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link 
                to="/developer-info" 
                className="block py-2 text-vision-text hover:text-white transition-colors duration-200 no-underline"
                onClick={onClose}
              >
                Developer Info
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="flex space-x-4 justify-center">
            <Link 
              to="/admin-login" 
              className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm no-underline"
              onClick={onClose}
            >
              Admin Login
            </Link>
            <Link 
              to="/seller-login" 
              className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm no-underline"
              onClick={onClose}
            >
              Seller Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
