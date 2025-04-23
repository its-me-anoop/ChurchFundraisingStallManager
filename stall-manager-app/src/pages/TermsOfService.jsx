import React from 'react';
import Layout from '../components/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card max-w-4xl mx-auto p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4 text-vision-text-secondary">
              By accessing or using the Church Fundraising Stall Manager application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4 text-vision-text-secondary">
              The Church Fundraising Stall Manager is a web application designed to help churches manage their fundraising stalls, track inventory, and record sales. The Service is provided "as is" and "as available" without any warranties of any kind.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4 text-vision-text-secondary">
              To use certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="mb-4 text-vision-text-secondary">
              You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-vision-text-secondary">
              <li className="mb-2">Provide accurate and complete information when creating your account</li>
              <li className="mb-2">Update your information to keep it accurate and current</li>
              <li className="mb-2">Protect your account credentials and not share them with others</li>
              <li className="mb-2">Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p className="mb-4 text-vision-text-secondary">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-vision-text-secondary">
              <li className="mb-2">Violate any applicable laws or regulations</li>
              <li className="mb-2">Infringe on the rights of others</li>
              <li className="mb-2">Distribute malicious software or engage in harmful activities</li>
              <li className="mb-2">Attempt to gain unauthorized access to the Service or its related systems</li>
              <li className="mb-2">Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data and Privacy</h2>
            <p className="mb-4 text-vision-text-secondary">
              Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="mb-4 text-vision-text-secondary">
              The Service and its original content, features, and functionality are owned by the Church Fundraising Team and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="mb-4 text-vision-text-secondary">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4 text-vision-text-secondary">
              In no event shall the Church Fundraising Team, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="mb-4 text-vision-text-secondary">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="mb-4 text-vision-text-secondary">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-vision-text-secondary">
              Email: terms@churchfundraising.example.com
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

export default TermsOfService;
