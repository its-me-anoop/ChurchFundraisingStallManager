import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/admin" component={AdminPage} />
        <Route path="/seller" component={SellerPage} />
        <Route path="/" exact>
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Welcome to the Stall Manager App</h1>
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;