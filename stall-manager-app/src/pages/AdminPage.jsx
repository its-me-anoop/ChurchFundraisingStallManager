import React from 'react';
import { useHistory } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg transition-colors duration-200">
            <Header />
            <div className="flex-grow p-4 md:p-8">
                <AdminDashboard handleLogout={handleLogout} />
            </div>
            <Footer />
        </div>
    );
};

export default AdminPage;