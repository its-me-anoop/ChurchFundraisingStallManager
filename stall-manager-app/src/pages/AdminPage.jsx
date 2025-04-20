import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

const AdminPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Stall Manager - Admin Panel</h1>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;