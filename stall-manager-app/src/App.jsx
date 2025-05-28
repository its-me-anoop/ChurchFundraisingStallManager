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
  <div className="w-full">
    {/* Hero Section */}
    <div className="relative w-full min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-bg dark:to-primary-950"></div>
      
      {/* Decorative circles - responsive sizing */}
      <div className="absolute top-10 sm:top-20 -left-20 sm:left-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary-200 dark:bg-primary-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 sm:bottom-20 -right-20 sm:right-10 w-64 sm:w-96 md:w-[32rem] h-64 sm:h-96 md:h-[32rem] bg-primary-300 dark:bg-primary-700 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 dark:bg-primary-900 rounded-full mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm font-medium text-primary-700 dark:text-primary-300">
            🎉 Making fundraising simple and effective
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 text-light-text dark:text-dark-text">
          Church Fundraising
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
            Stall Manager
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-light-text-secondary dark:text-dark-text-secondary mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
          Streamline your church fundraising events with our powerful, easy-to-use management system for tracking sales and inventory.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
          <button
            onClick={() => window.location.href = '/admin-login'}
            className="group relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto rounded-xl font-semibold"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => window.location.href = '/seller-login'}
            className="group relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto rounded-xl font-semibold text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 dark:from-primary-600 dark:to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Seller Portal
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
    
    {/* Features Section */}
    <div className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-dark-card">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-light-text dark:text-dark-text">
            Everything You Need to Succeed
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
            Powerful features designed specifically for church fundraising events
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Sales Tracking Card */}
          <div className="group bg-white dark:bg-dark-bg rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-dark-border">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 sm:h-8 w-7 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-light-text dark:text-dark-text">Real-time Sales Tracking</h3>
            <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
              Track every transaction instantly with our intuitive interface. Perfect for busy fundraising events where speed matters.
            </p>
          </div>
          
          {/* Inventory Management Card */}
          <div className="group bg-white dark:bg-dark-bg rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-dark-border">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 sm:h-8 w-7 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-light-text dark:text-dark-text">Smart Inventory Control</h3>
            <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
              Automatic stock updates ensure you never oversell. Know exactly what's available at every stall in real-time.
            </p>
          </div>
          
          {/* Reporting Card */}
          <div className="group bg-white dark:bg-dark-bg rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-dark-border sm:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 sm:h-8 w-7 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-light-text dark:text-dark-text">Detailed Analytics</h3>
            <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
              Comprehensive reports help you understand what sells best and optimize future fundraising strategies.
            </p>
          </div>
        </div>
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
        <Router basename={process.env.PUBLIC_URL || ''}>
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
