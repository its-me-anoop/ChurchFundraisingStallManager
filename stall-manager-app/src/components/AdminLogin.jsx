import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../services/firebase';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/admin'); // Redirect to admin dashboard on successful login
        } catch (err) {
            console.error("Admin Login Error:", err);
            setError('Failed to log in. Please check your email and password.');
        }
    };

    return (
        <div className="flex-center min-h-screen">
            <div className="glass-card w-full max-w-sm">
                <h1 className="text-3xl font-semibold mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-xs italic mb-4 text-center">{error}</p>}
                    <button type="submit" className="w-full">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
