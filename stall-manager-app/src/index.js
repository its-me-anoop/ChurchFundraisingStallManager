import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// Removed AuthProvider import from here as it's now in App.jsx

ReactDOM.render(
  <React.StrictMode>
    {/* AuthProvider is now wrapping the Router inside App.jsx */}
    <App /> 
  </React.StrictMode>,
  document.getElementById('root')
);