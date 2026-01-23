import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            {/* Sidebar Tetap */}
            <Sidebar />

            {/* Area Konten Utama */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;