import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ handleLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  const isSellerPage = location.pathname.includes('/seller');
  const isAdminPage = location.pathname.includes('/admin');
  const isProtectedPage = isSellerPage || isAdminPage;
  
  // Determine if we should show a simplified header for protected pages
  const showSimplifiedHeader = isProtectedPage && currentUser;
  
  return (
    <header className={`bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border py-4 shadow-light dark:shadow-dark sticky top-0 z-10 ${showSimplifiedHeader ? 'simplified-header' : ''}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold text-light-text dark:text-dark-text transition-colors duration-200 no-underline flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-2 text-primary-600 dark:text-primary-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" 
              clipRule="evenodd" 
            />
          </svg>
          Church Fundraising
          {showSimplifiedHeader && isSellerPage && (
            <span className="ml-2 text-sm font-normal bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
              Seller Mode
            </span>
          )}
        </Link>
        
        <div className="flex items-center">
          {!showSimplifiedHeader && (
            <nav className="hidden md:block mr-4">
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className={`text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className={`text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/privacy-policy' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-service" 
                    className={`text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/terms-of-service' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/developer-info" 
                    className={`text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 no-underline ${location.pathname === '/developer-info' ? 'font-semibold text-primary-600 dark:text-primary-400' : ''}`}
                  >
                    Developer
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          
          <ThemeToggle className="mr-4" />
          
          {isAdminPage && handleLogout && (
            <button 
              onClick={handleLogout}
              className="mr-4 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
          
          {!showSimplifiedHeader && (
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;