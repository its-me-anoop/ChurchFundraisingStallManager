import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex-center min-h-screen">
        <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl text-center p-8 max-w-lg transition-colors duration-200">
          <h1 className="text-6xl font-bold mb-6 text-light-text dark:text-dark-text">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Page Not Found</h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/" 
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200 inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
