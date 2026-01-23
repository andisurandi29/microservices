import React, { useEffect, useState } from 'react';
import { getUserData } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user] = useState(getUserData());
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login'); 
        }
    }, [user, navigate]);

    // Format tanggal hari ini
    const today = new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    if (!user) return null;

    return (
        <div className="space-y-6">
            
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">{today}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">{user.email}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {user.role}
                        </span>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Halo, Selamat Datang! 👋</h2>
                    <p className="text-blue-100 max-w-2xl text-lg">
                        Selamat datang di panel <b>DOMPET PNBP</b>. Anda login sebagai <span className="font-semibold underline decoration-yellow-400">{user.role}</span>.
                        Silahkan gunakan menu di sebelah kiri untuk mengelola aplikasi sesuai dengan peran Anda.
                    </p>
                </div>
                
                {/* Dekorasi Background */}
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                    <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" /></svg>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;