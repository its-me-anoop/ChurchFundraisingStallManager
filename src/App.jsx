import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import AdminLogin from './components/AdminLogin';
import SellerLogin from './components/SellerLogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DeveloperInfo from './pages/DeveloperInfo';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import Button from './components/Button';

// PrivateRoute component to protect routes requiring any authenticated user
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/admin-login" />;
      }}
    ></Route>
  );
};

// Home page component
const HomePage = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="text-center bg-light-card dark:bg-dark-card p-10 max-w-2xl rounded-2xl shadow-light dark:shadow-dark border border-light-border dark:border-dark-border transition-colors duration-200">
      <h1 className="text-4xl font-bold mb-6 text-light-text dark:text-dark-text">
        Welcome to the Church Fundraising Stall Manager
      </h1>
      <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8 text-lg">
        A simple and efficient way to manage your church fundraising stalls and track sales.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Button
          variant="primary"
          size="large"
          onClick={() => window.location.href = '/admin-login'}
          className="w-full sm:w-auto"
        >
          Admin Login
        </Button>
        <Button
          variant="outline"
          size="large"
          onClick={() => window.location.href = '/seller-login'}
          className="w-full sm:w-auto"
        >
          Seller Login
        </Button>
      </div>
    </div>
    
    {/* Feature highlights */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow-light dark:shadow-dark border border-light-border dark:border-dark-border transition-colors duration-200">
        <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">Sales Tracking</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Track all sales in real-time with a simple interface designed for quick transactions.
        </p>
      </div>
      
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow-light dark:shadow-dark border border-light-border dark:border-dark-border transition-colors duration-200">
        <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">Inventory Management</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Keep track of your stall's inventory with automatic stock updates as items are sold.
        </p>
      </div>
      
      <div className="bg-light-card dark:bg-dark-card rounded-xl p-6 shadow-light dark:shadow-dark border border-light-border dark:border-dark-border transition-colors duration-200">
        <div className="bg-primary-100 dark:bg-primary-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-light-text dark:text-dark-text">Reporting</h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Generate insightful reports to help analyze fundraising performance and identify top-selling items.
        </p>
      </div>
    </div>
  </div>
);

// Home page with layout
const HomePageWithLayout = () => (
  <Layout>
    <HomePage />
  </Layout>
);

// Not found page with layout
const NotFoundWithLayout = () => (
  <Layout>
    <NotFound />
  </Layout>
);

// These pages already include Layout components internally
// So we don't need to wrap them again

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Switch>
            {/* Auth routes */}
            <Route path="/admin-login" component={AdminLogin} />
            <Route path="/seller-login" component={SellerLogin} />
            
            {/* Protected routes */}
            <PrivateRoute path="/admin" component={AdminPage} />
            <PrivateRoute path="/seller" component={SellerPage} />
            
            {/* Public routes - using direct components since they have Layout inside */}
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/developer-info" component={DeveloperInfo} />
            
            {/* Home page */}
            <Route path="/" exact component={HomePageWithLayout} />
            
            {/* 404 page */}
            <Route path="*" component={NotFoundWithLayout} />
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
