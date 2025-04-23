import React from 'react';
import Layout from '../components/Layout';

const DeveloperInfo = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card max-w-4xl mx-auto p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Developer Information</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About the Application</h2>
            <p className="mb-4 text-vision-text-secondary">
              The Church Fundraising Stall Manager is a web application designed to help churches manage their fundraising stalls efficiently. 
              It provides a simple interface for administrators to create stalls, add products, and track sales, while allowing sellers to record transactions in real-time.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-4">
                <h3 className="text-xl font-medium mb-3">Frontend</h3>
                <ul className="list-disc pl-6 text-vision-text-secondary">
                  <li className="mb-2">React.js - A JavaScript library for building user interfaces</li>
                  <li className="mb-2">React Router - For navigation and routing</li>
                  <li className="mb-2">Tailwind CSS - A utility-first CSS framework</li>
                  <li className="mb-2">Context API - For state management</li>
                </ul>
              </div>
              
              <div className="glass-card p-4">
                <h3 className="text-xl font-medium mb-3">Backend</h3>
                <ul className="list-disc pl-6 text-vision-text-secondary">
                  <li className="mb-2">Firebase Authentication - For user authentication</li>
                  <li className="mb-2">Firestore - NoSQL database for storing application data</li>
                  <li className="mb-2">Firebase Hosting - For deploying the application</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="glass-card p-4">
              <ul className="list-disc pl-6 text-vision-text-secondary">
                <li className="mb-2">Admin Dashboard - Create and manage stalls, products, and view sales data</li>
                <li className="mb-2">Seller Interface - Record sales and track inventory in real-time</li>
                <li className="mb-2">Authentication - Secure login for admins and sellers</li>
                <li className="mb-2">Sales Tracking - Monitor sales performance across all stalls</li>
                <li className="mb-2">Data Export - Export sales data to CSV for further analysis</li>
                <li className="mb-2">Responsive Design - Works on desktop and mobile devices</li>
              </ul>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Development Team</h2>
            <div className="glass-card p-4">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="w-32 h-32 rounded-full bg-vision-accent flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <span className="text-4xl font-bold text-white">CF</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Church Fundraising Team</h3>
                  <p className="text-vision-text-secondary mb-4">
                    A dedicated team of developers passionate about creating tools to help churches and non-profit organizations.
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://github.com/example" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-vision-accent hover:text-blue-400 transition-colors duration-200"
                    >
                      GitHub
                    </a>
                    <a 
                      href="https://linkedin.com/in/example" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-vision-accent hover:text-blue-400 transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="mailto:contact@churchfundraising.example.com" 
                      className="text-vision-accent hover:text-blue-400 transition-colors duration-200"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Open Source</h2>
            <p className="mb-4 text-vision-text-secondary">
              This project is open source and available under the MIT License. Contributions are welcome!
            </p>
            <a 
              href="https://github.com/example/church-fundraising-stall-manager" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200"
            >
              View on GitHub
            </a>
          </section>
          
          <div className="mt-8 pt-6 border-t border-vision-border text-sm text-vision-text-secondary">
            Version 1.0.0 - Last Updated: April 23, 2025
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeveloperInfo;
