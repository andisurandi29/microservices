import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatRupiah } from '../utils/format';
import AdminStatusModal from '../components/AdminStatusModal';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    // Modal State
    const [selectedTrx, setSelectedTrx] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            // Panggil API Admin
            const [trxRes, prodRes] = await Promise.all([
                api.get('/admin/transactions'),
                api.get('/products')
            ]);
            setTransactions(trxRes.data.data);
            setProducts(prodRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            alert("Gagal memuat data. Pastikan Anda ADMIN.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Handle Update
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/transactions/${id}`, { status: newStatus });
            alert("Status berhasil diupdate!");
            fetchData(); // Refresh table
        } catch (error) {
            console.error("Update failed:", error);
            alert("Gagal update status.");
        }
    };

    // Helper: Nama Produk
    const getProductName = (items) => {
        if (!items || items.length === 0) return "-";
        const prodId = items[0].product_id;
        const prod = products.find(p => p.id == prodId);
        return prod ? prod.name : `ID: ${prodId}`;
    };

    // Helper: Status Color
    const getStatusBadge = (status) => {
        let color = "bg-gray-100 text-gray-600";
        if (status === 'SUDAH_DIBAYAR') color = "bg-green-100 text-green-700 border-green-200";
        if (status === 'BELUM_DIBAYAR') color = "bg-yellow-100 text-yellow-700 border-yellow-200";
        
        return <span className={`px-2 py-1 rounded text-xs font-bold border ${color}`}>{status}</span>;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                <h1 className="text-2xl font-bold">Kelola Transaksi</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Semua Transaksi Masuk</h3>
                    <button onClick={fetchData} className="text-sm text-blue-600 hover:underline">Refresh Data</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-bold">ID / Tanggal</th>
                                <th className="px-6 py-4 font-bold">Pembeli ID</th>
                                <th className="px-6 py-4 font-bold">Produk</th>
                                <th className="px-6 py-4 font-bold">Total</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center">Memuat...</td></tr>
                            ) : transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-gray-600">{trx.id.substring(0,8)}...</div>
                                        <div className="text-xs text-gray-400">{new Date(trx.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">{trx.pembeli_id}</td>
                                    <td className="px-6 py-4">{getProductName(trx.items)}</td>
                                    <td className="px-6 py-4 font-bold">{formatRupiah(trx.total_harga)}</td>
                                    <td className="px-6 py-4">{getStatusBadge(trx.status)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => setSelectedTrx(trx)}
                                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                                        >
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminStatusModal 
                isOpen={!!selectedTrx} 
                onClose={() => setSelectedTrx(null)}
                transaction={selectedTrx}
                onUpdate={handleUpdateStatus}
            />
        </div>
    );
};

export default AdminTransactions;