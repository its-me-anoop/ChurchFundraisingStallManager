import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// Import signInAnonymously instead of signInWithCustomToken
import { getAuth, signInAnonymously } from "firebase/auth";

const SellerLogin = () => {
    // Rename state from token to pin for clarity
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        // Basic PIN validation (e.g., check if it's numeric and 4 digits)
        if (!pin || !/^\d{4}$/.test(pin)) {
            setError('Please enter a valid 4-digit PIN.');
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
        }
    };

    return (
        // Use flex-center utility and apply theme background implicitly
        <div className="flex-center min-h-screen">
            {/* Apply the glass-card style to the form container */}
            <div className="glass-card w-full max-w-sm">
                {/* Update title styling */}
                <h1 className="text-3xl font-semibold mb-6 text-center">Seller Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        {/* Label uses global theme style */}
                        <label htmlFor="pin-input">
                            4-Digit PIN {/* Changed label */}
                        </label>
                        {/* Input uses global theme style */}
                        <input
                            id="pin-input"
                            type="password" // Keep as password to obscure
                            placeholder="Enter your 4-digit PIN" // Changed placeholder
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full" // Global styles handle appearance
                            maxLength="4" // Enforce 4 digits
                            pattern="\d*" // Allow only digits (for mobile keyboards)
                            inputMode="numeric" // Hint for numeric keyboard
                            required
                        />
                    </div>
                    {/* Adjust error message styling */}
                    {error && <p className="text-red-400 text-xs italic mb-4 text-center">{error}</p>}
                    {/* Button uses global theme style */}
                    <button type="submit" className="w-full">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerLogin;