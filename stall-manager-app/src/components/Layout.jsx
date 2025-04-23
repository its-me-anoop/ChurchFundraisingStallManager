import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CookieConsent from './CookieConsent';
import MobileMenu from './MobileMenu';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/admin-login' || location.pathname === '/seller-login';
  const isProtectedPage = !isHomePage && !isLoginPage;

  // Don't show header/footer on protected pages (admin/seller dashboards)
  if (isProtectedPage && location.pathname !== '/privacy-policy' && 
      location.pathname !== '/terms-of-service' && location.pathname !== '/developer-info') {
    return (
      <>
        {children}
        <CookieConsent />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-vision-card backdrop-blur-md border-b border-vision-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-vision-text no-underline"
          >
            Church Fundraising
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className="text-vision-text hover:text-white transition-colors duration-200 no-underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-vision-text hover:text-white transition-colors duration-200 no-underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-vision-text hover:text-white transition-colors duration-200 no-underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/developer-info" 
                  className="text-vision-text hover:text-white transition-colors duration-200 no-underline"
                >
                  Developer Info
                </Link>
              </li>
            </ul>
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-vision-text hover:text-white transition-colors duration-200 focus:outline-none"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-vision-card backdrop-blur-md border-t border-vision-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-vision-text-secondary text-sm">
                &copy; {new Date().getFullYear()} Church Fundraising Stall Manager. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center space-x-4">
              <Link 
                to="/privacy-policy" 
                className="text-vision-text-secondary hover:text-white text-sm transition-colors duration-200 no-underline"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-service" 
                className="text-vision-text-secondary hover:text-white text-sm transition-colors duration-200 no-underline"
              >
                Terms of Service
              </Link>
              <Link 
                to="/developer-info" 
                className="text-vision-text-secondary hover:text-white text-sm transition-colors duration-200 no-underline"
              >
                Developer Info
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CookieConsent />
    </div>
  );
};

export default Layout;
