import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isSellerPage = location.pathname.includes('/seller');
  const isAdminPage = location.pathname.includes('/admin');
  const isProtectedPage = isSellerPage || isAdminPage;
  
  // Determine if we should show a simplified footer for protected pages
  const showSimplifiedFooter = isProtectedPage && currentUser;
  
  if (showSimplifiedFooter) {
    return (
      <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border py-4 mt-auto text-center">
        <div className="container mx-auto px-4">
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Church Fundraising Stall Manager | <span className="text-primary-600 dark:text-primary-400">{isSellerPage ? 'Seller Portal' : 'Admin Portal'}</span>
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
              Church Fundraising
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
              Helping churches manage fundraising events with easy-to-use stall management tools.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin-login" 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                >
                  Admin Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/seller-login" 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                >
                  Seller Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/developer-info" 
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                >
                  Developer Info
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Church Fundraising Stall Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;