import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import AdminLogin from './components/AdminLogin';
import SellerLogin from './components/SellerLogin'; // Import SellerLogin

// PrivateRoute component to protect routes requiring any authenticated user
const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        // Redirect to admin login if no user, could be changed later
        // if separate login destinations are needed.
        return currentUser ? <Component {...props} /> : <Redirect to="/admin-login" />;
      }}
    ></Route>
  );
};

// TODO: Add specific AdminPrivateRoute if needed later to check for admin claims

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/seller-login" component={SellerLogin} /> {/* Add route for SellerLogin */}
          <PrivateRoute path="/admin" component={AdminPage} />
          {/* Protect the SellerPage, route changed from /seller/:pin */}
          <PrivateRoute path="/seller" component={SellerPage} /> 
          <Route path="/" exact>
            {/* Apply flex-center and adjust text styling */}
            <div className="flex-center min-h-screen">
              <div className="text-center glass-card p-10">
                <h1 className="text-4xl font-semibold mb-6">Welcome to the Stall Manager</h1>
                <div className="flex justify-center space-x-6">
                  {/* Use button styles for links */}
                  <a href="/admin-login" className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200 no-underline">
                    Admin Login
                  </a>
                  <a href="/seller-login" className="bg-vision-accent hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200 no-underline">
                    Seller Login
                  </a>
                </div>
              </div>
            </div>
          </Route>
          {/* Add a fallback or 404 route if needed */}
          {/* <Route path="*" component={NotFoundPage} /> */}
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;