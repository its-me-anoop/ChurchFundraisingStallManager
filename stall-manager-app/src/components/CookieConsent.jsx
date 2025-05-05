import React, { useState, useEffect } from 'react';
import Button from './Button';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    // Still record that they've made a choice, but mark as declined
    localStorage.setItem('cookieConsent', 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl max-w-4xl mx-auto p-4 md:p-6 flex flex-col md:flex-row items-center justify-between transition-colors duration-200">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h3 className="text-lg font-semibold mb-2 text-light-text dark:text-dark-text">Cookie Consent</h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleDecline}
            variant="secondary"
            size="small"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            variant="primary"
            size="small"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
