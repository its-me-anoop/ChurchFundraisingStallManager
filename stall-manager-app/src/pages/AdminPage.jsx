import React from 'react';
import { useHistory } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
    const { logout } = useAuth();
    const history = useHistory();

    const handleLogout = async () => {
        try {
            await logout();
            history.push('/'); // Redirect to home page
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-10">
             <div className="w-full flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold">Stall Manager - Admin Panel</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;