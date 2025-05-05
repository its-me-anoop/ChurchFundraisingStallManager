import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import MobileMenu from './MobileMenu';

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/admin-login' || location.pathname === '/seller-login';
  const isProtectedPage = !isHomePage && !isLoginPage;

  const publicPages = [
    '/privacy-policy',
    '/terms-of-service',
    '/developer-info',
    '/'
  ];

  // Don't show header/footer on protected pages (admin/seller dashboards)
  const isPublicPage = publicPages.includes(location.pathname);
  
  if (!isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg">
        {children}
        <CookieConsent />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
      <Header />

      <main className="flex-grow px-4 py-6 container mx-auto">
        {children}
      </main>

      <Footer />
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CookieConsent />
    </div>
  );
};

export default Layout;
