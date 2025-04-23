import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import AdminLogin from './components/AdminLogin';
import SellerLogin from './components/SellerLogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DeveloperInfo from './pages/DeveloperInfo';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

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
  <div className="flex-center min-h-screen py-10">
    <div className="text-center glass-card p-10 max-w-lg">
      <h1 className="text-4xl font-semibold mb-6">Welcome to the Church Fundraising Stall Manager</h1>
      <p className="text-vision-text-secondary mb-8">
        A simple and efficient way to manage your church fundraising stalls and track sales.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <a href="/admin-login" className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 no-underline text-center">
          Admin Login
        </a>
        <a href="/seller-login" className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 no-underline text-center">
          Seller Login
        </a>
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Auth routes */}
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/seller-login" component={SellerLogin} />
          
          {/* Protected routes */}
          <PrivateRoute path="/admin" component={AdminPage} />
          <PrivateRoute path="/seller" component={SellerPage} />
          
          {/* Public routes */}
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
  );
};

export default App;
