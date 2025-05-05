import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuth, signInAnonymously } from "firebase/auth";
import Layout from './Layout';

const SellerLogin = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true);
        
        // Basic PIN validation (e.g., check if it's numeric and 4 digits)
        if (!pin || !/^\d{4}$/.test(pin)) {
            setError('Please enter a valid 4-digit PIN.');
            setLoading(false);
            return;
        }
        
        try {
            // Sign in anonymously first
            await signInAnonymously(auth);

            // Store the entered PIN in session storage to pass it to the SellerPage
            sessionStorage.setItem('sellerPin', pin);

            // On successful anonymous login, redirect to the seller page
            history.push('/seller');
        } catch (err) {
            console.error("Seller Anonymous Login Error:", err);
            setError('Login failed. Please try again.'); // More generic error
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex-center min-h-screen py-10">
                <div className="glass-card w-full max-w-md p-8">
                    <h1 className="text-3xl font-semibold mb-6 text-center">Seller Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label htmlFor="pin-input">
                                4-Digit PIN
                            </label>
                            <input
                                id="pin-input"
                                type="password"
                                placeholder="Enter your 4-digit PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full"
                                maxLength="4"
                                pattern="\d*"
                                inputMode="numeric"
                                required
                                disabled={loading}
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
                        <button 
                            type="submit" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default SellerLogin;
