import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../services/firebase';

const SellerLogin = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Validate the pin (this should be replaced with actual validation logic)
            const seller = await auth.signInWithCustomToken(pin);
            if (seller) {
                history.push('/seller');
            }
        } catch (err) {
            setError('Invalid PIN. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Seller Login</h1>
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <input
                    type="text"
                    placeholder="Enter your unique PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    required
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default SellerLogin;