import React from 'react';
import Layout from '../components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card max-w-4xl mx-auto p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4 text-vision-text-secondary">
              This Privacy Policy explains how the Church Fundraising Stall Manager ("we", "our", or "us") collects, uses, and shares your information when you use our application.
            </p>
            <p className="mb-4 text-vision-text-secondary">
              We respect your privacy and are committed to protecting your personal data. Please read this Privacy Policy carefully to understand our practices regarding your personal data.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4 text-vision-text-secondary">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-vision-text-secondary">
              <li className="mb-2">Account information: When you register as an admin, we collect your email address and password.</li>
              <li className="mb-2">Stall information: Information about stalls, products, and sales that you input into the application.</li>
              <li className="mb-2">Usage data: Information about how you use our application, including log data and analytics.</li>
              <li className="mb-2">Cookies: We use cookies to enhance your experience and analyze our traffic.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4 text-vision-text-secondary">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-vision-text-secondary">
              <li className="mb-2">To provide and maintain our service</li>
              <li className="mb-2">To notify you about changes to our service</li>
              <li className="mb-2">To allow you to participate in interactive features of our service</li>
              <li className="mb-2">To provide customer support</li>
              <li className="mb-2">To gather analysis or valuable information so that we can improve our service</li>
              <li className="mb-2">To monitor the usage of our service</li>
              <li className="mb-2">To detect, prevent and address technical issues</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4 text-vision-text-secondary">
              We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights</h2>
            <p className="mb-4 text-vision-text-secondary">
              You have the following data protection rights:
            </p>
            <ul className="list-disc pl-6 mb-4 text-vision-text-secondary">
              <li className="mb-2">The right to access, update or delete the information we have on you</li>
              <li className="mb-2">The right of rectification</li>
              <li className="mb-2">The right to object</li>
              <li className="mb-2">The right of restriction</li>
              <li className="mb-2">The right to data portability</li>
              <li className="mb-2">The right to withdraw consent</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4 text-vision-text-secondary">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="mb-4 text-vision-text-secondary">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4 text-vision-text-secondary">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-vision-text-secondary">
              Email: privacy@churchfundraising.example.com
            </p>
          </section>
          
          <div className="mt-8 pt-6 border-t border-vision-border text-sm text-vision-text-secondary">
            Last Updated: April 23, 2025
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
