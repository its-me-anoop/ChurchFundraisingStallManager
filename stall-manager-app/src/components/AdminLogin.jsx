import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../services/firebase';
import Layout from './Layout';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/admin'); // Redirect to admin dashboard on successful login
        } catch (err) {
            console.error("Admin Login Error:", err);
            setError('Failed to log in. Please check your email and password.');
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="relative w-full min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">
                {/* Background gradient similar to home page */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-bg dark:to-primary-950"></div>
                
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 dark:bg-primary-800 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-300 dark:bg-primary-700 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                
                <div className="relative w-full max-w-md mx-auto animate-fade-in-up">
                    {/* Icon and title section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full mb-6 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-2 text-light-text dark:text-dark-text">
                            Admin Dashboard
                        </h1>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Sign in to manage your fundraising event
                        </p>
                    </div>
                    
                    {/* Login card */}
                    <div className="bg-white dark:bg-dark-card backdrop-blur-md border border-light-border dark:border-dark-border rounded-2xl p-8 shadow-2xl">
                        <form onSubmit={handleLogin}>
                            <div className="mb-5">
                                <label htmlFor="email" className="block text-sm font-medium mb-2 text-light-text-secondary dark:text-dark-text-secondary">
                                    Admin Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                                    required
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium mb-2 text-light-text-secondary dark:text-dark-text-secondary">
                                    Admin Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                            
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-red-600 dark:text-red-400 text-sm text-center flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </p>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="relative w-full overflow-hidden group bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={loading}
                            >
                                <span className="relative flex items-center justify-center">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Access Dashboard
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <a href="/seller-login" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                Seller? Login here →
                            </a>
                        </div>
                    </div>
                    
                    {/* Security notice */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Secure login protected by encryption</span>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminLogin;
