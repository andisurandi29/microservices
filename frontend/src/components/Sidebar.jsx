import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout, getUserData } from '../utils/auth';

const Sidebar = () => {

    const user = getUserData();
    const role = user?.role;

    // Class untuk menu aktif vs non-aktif
    const baseClass = "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200";
    const activeClass = "bg-blue-700 text-white border-l-4 border-white";
    const inactiveClass = "text-blue-100 hover:bg-blue-500 hover:text-white";

    return (
        <aside className="w-64 bg-blue-600 h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
            {/* Header / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-blue-500/30">
                <div className="flex items-center gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                    </svg>
                    <span className="font-bold text-lg tracking-wide">DOMPET PNBP</span>
                </div>
            </div>

            {/* Menu Navigasi */}
            <nav className="flex-1 mt-6 space-y-1">
                
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                    Dashboard
                </NavLink>

                {/* MENU KHUSUS ADMIN */}
                {role === 'ADMIN' && (
                    <>
                        <NavLink to="/users" className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/><path d="M2 22c0-4 4-7 10-7s10 3 10 7"/></svg>
                           Users
                        </NavLink>
                        <NavLink to="/products" className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 3 16.3"/><path d="M16.24 7.76a5 5 0 0 0-6.32 6.32"/></svg>
                           Master Produk
                        </NavLink>
                        <NavLink to="/admin-transactions" className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            Kelola Transaksi
                        </NavLink>
                    </>
                )}

                {/* MENU KHUSUS PEMBELI */}
                {role === 'PEMBELI' && (
                    <>
                    <NavLink to="/pembelian" className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        Pembelian Produk
                    </NavLink>

                    <NavLink to="/history" className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        History Pembayaran
                    </NavLink>
                    </>
                )}

                {/* Logout Button */}
                <button 
                    onClick={logout}
                    className={`${baseClass} ${inactiveClass} w-full text-left mt-8 border-t border-blue-500/30 pt-4`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Logout
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;