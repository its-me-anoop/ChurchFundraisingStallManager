import React from 'react';
import Layout from '../components/Layout';

const DeveloperInfo = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl max-w-4xl mx-auto p-6 md:p-8 transition-colors duration-200">
          <h1 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">Developer Information</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">About the Application</h2>
            <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
              The Church Fundraising Stall Manager is a web application designed to help churches manage their fundraising stalls efficiently. 
              It provides a simple interface for administrators to create stalls, add products, and track sales, while allowing sellers to record transactions in real-time.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl p-4">
                <h3 className="text-xl font-medium mb-3 text-light-text dark:text-dark-text">Frontend</h3>
                <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary">
                  <li className="mb-2">React.js - A JavaScript library for building user interfaces</li>
                  <li className="mb-2">React Router - For navigation and routing</li>
                  <li className="mb-2">Tailwind CSS - A utility-first CSS framework</li>
                  <li className="mb-2">Context API - For state management</li>
                </ul>
              </div>
              
              <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl p-4">
                <h3 className="text-xl font-medium mb-3 text-light-text dark:text-dark-text">Backend</h3>
                <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary">
                  <li className="mb-2">Firebase Authentication - For user authentication</li>
                  <li className="mb-2">Firestore - NoSQL database for storing application data</li>
                  <li className="mb-2">Firebase Hosting - For deploying the application</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Features</h2>
            <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl p-4">
              <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary">
                <li className="mb-2">Admin Dashboard - Create and manage stalls, products, and view sales data</li>
                <li className="mb-2">Seller Interface - Record sales and track inventory in real-time</li>
                <li className="mb-2">Authentication - Secure login for admins and sellers</li>
                <li className="mb-2">Sales Tracking - Monitor sales performance across all stalls</li>
                <li className="mb-2">Data Export - Export sales data to CSV for further analysis</li>
                <li className="mb-2">Responsive Design - Works on desktop and mobile devices</li>
                <li className="mb-2">Light/Dark Theme - Supports both light and dark mode for better user experience</li>
              </ul>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Development Team</h2>
            <div className="bg-light-card dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border shadow-light dark:shadow-dark rounded-xl p-4">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="w-32 h-32 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <span className="text-4xl font-bold text-white">AJ</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-light-text dark:text-dark-text">Anoop Jose</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    Flutterly Ltd.
                  </p>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                    Full-stack developer passionate about creating elegant, user-friendly web applications.
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://github.com/its-me-anoop" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      GitHub
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/anoop-jose-0b308a296/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="mailto:anoop@flutterly.co.uk" 
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-light-text dark:text-dark-text">Open Source</h2>
            <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
              This project is open source and available under the MIT License. Contributions are welcome!
            </p>
            <a 
              href="https://github.com/its-me-anoop/church-fundraising-stall-manager" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200"
            >
              View on GitHub
            </a>
          </section>
          
          <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Version 1.0.0 - Last Updated: May 5, 2025
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeveloperInfo;
