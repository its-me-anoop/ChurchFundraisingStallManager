import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // Check if user has a theme preference saved
  const savedTheme = localStorage.getItem('theme');
  // Check if user prefers dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme based on saved preference or system preference
  const [darkMode, setDarkMode] = useState(
    savedTheme ? savedTheme === 'dark' : prefersDarkMode
  );

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Apply theme class to document
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // Update class on document element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change theme if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    
    // Add event listener with modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}