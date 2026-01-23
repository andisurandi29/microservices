import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import UserModal from '../components/UserModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // null = mode tambah, object = mode edit

    // --- FETCH DATA (READ) ---
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // GET /api/users via Gateway
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Gagal load users:", error);
            alert("Gagal memuat data user. Pastikan Anda login sebagai ADMIN.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- HANDLE SAVE (CREATE & UPDATE) ---
    const handleSaveUser = async (formData) => {
        try {
            if (currentUser) {
                // UPDATE (PUT)
                await api.put(`/users/${currentUser.id}`, formData);
                alert('User berhasil diperbarui!');
            } else {
                // CREATE (POST)
                await api.post('/users', formData);
                alert('User berhasil ditambahkan!');
            }
            setIsModalOpen(false);
            fetchUsers(); 
        } catch (error) {
            console.error("Error saving user:", error);
            alert(`Gagal menyimpan: ${error.response?.data?.message || 'Server Error'}`);
        }
    };

    // --- 3. HANDLE DELETE (DELETE) ---
    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers(); 
                alert('User berhasil dihapus.');
            } catch (error) {
                console.error("Error delete:", error);
                alert('Gagal menghapus user.');
            }
        }
    };

    // --- FILTER PENCARIAN ---
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Title */}
            <div className="flex items-center gap-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h1 className="text-2xl font-bold">Manajemen Users</h1>
            </div>

            {/* Card Container */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                
                {/* Search & Add Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="w-full md:w-1/2">
                        <label className="text-sm text-gray-500 mb-1 block">Cari User</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Ketik nama atau username..." 
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="absolute left-3 top-2.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex items-end">
                        <button 
                            onClick={() => { setCurrentUser(null); setIsModalOpen(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-blue-200 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Tambah User
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">#</th>
                                <th className="px-6 py-4 font-bold">Nama Lengkap</th>
                                <th className="px-6 py-4 font-bold">Username</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="px-6 py-4 font-bold">Role / Group</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Memuat data users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Data tidak ditemukan.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email.split('@')[0]}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300">
                                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => { setCurrentUser(user); setIsModalOpen(true); }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors" title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-100 rounded border border-red-200 transition-colors" title="Hapus">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Render Modal */}
            <UserModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveUser}
                userToEdit={currentUser}
            />
        </div>
    );
};

export default Users;