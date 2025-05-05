import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const MobileMenu = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);
  const location = useLocation();

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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        ref={menuRef}
        className="fixed right-0 top-0 h-full w-72 bg-light-card dark:bg-dark-card backdrop-blur-md border-l border-light-border dark:border-dark-border shadow-light dark:shadow-dark p-5 transform transition-transform duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Menu</h2>
          <button
            onClick={onClose}
            className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-6 border-b border-light-border dark:border-dark-border pb-4">
          <span className="text-light-text-secondary dark:text-dark-text-secondary">Theme</span>
          <ThemeToggle />
        </div>
        
        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className={`block py-2 text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy-policy" 
                className={`block py-2 text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/privacy-policy' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                onClick={onClose}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms-of-service" 
                className={`block py-2 text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/terms-of-service' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                onClick={onClose}
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link 
                to="/developer-info" 
                className={`block py-2 text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/developer-info' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                onClick={onClose}
              >
                Developer Info
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-8 left-0 right-0 px-5">
          <div className="flex space-x-4 justify-center">
            <Link 
              to="/admin-login" 
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 text-sm no-underline shadow-sm"
              onClick={onClose}
            >
              Admin Login
            </Link>
            <Link 
              to="/seller-login" 
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-200 text-sm no-underline shadow-sm"
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
