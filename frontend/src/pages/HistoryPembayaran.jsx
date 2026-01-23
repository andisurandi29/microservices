import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { formatRupiah } from '../utils/format';
import TransactionDetailModal from '../components/TransactionDetailModal';

const HistoryPembayaran = () => {

    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    // State Modal Detail
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // --- FETCH DATA TRANSAKSI ---
    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            // Build Query Params
            const params = {};
            if (statusFilter !== 'Semua') params.status = statusFilter;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get('/transactions', { params });

            setTransactions(response.data.data || []);
        } catch (error) {
            console.error("Gagal load history:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, startDate, endDate]);

    // --- FETCH MASTER PRODUK (Untuk Mapping Nama) ---
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data || []);
        } catch (error) {
            console.error("Gagal load products:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchProducts();
    }, [fetchHistory]);


    // --- HELPER FUNCTIONS ---
    // Cari Nama Produk berdasarkan ID
    const getProductName = (items) => {
        if (!items || items.length === 0) return "Produk Tidak Ditemukan";
        
        // Ambil item pertama
        const firstItem = items[0];
        
        // Cari di state products
        const product = products.find(p => p.id == firstItem.produk_id);
        
        return product ? (product.nama_produk || product.name) : "Produk Tidak Ditemukan";
    };

    // Badge Status Warna-warni
    const renderStatusBadge = (status) => {
        let classes = "px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit";
        let icon = null;
        let label = status;

        switch (status) {
            case 'BELUM_DIBAYAR':
            case 'PENDING':
                classes += " bg-yellow-50 text-yellow-700 border-yellow-200";
                label = "Menunggu Pembayaran";
                icon = <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span></span>;
                break;
            case 'PAID':
            case 'SUDAH_DIBAYAR':
                classes += " bg-green-50 text-green-700 border-green-200";
                label = "Sudah Dibayar";
                icon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
                break;
            default:
                classes += " bg-gray-100 text-gray-600 border-gray-200";
        }

        return <span className={classes}>{icon} {label}</span>;
    };

    // Format Tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Fungsi untuk reset filter
    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setStatusFilter('Semua');
    };

    return (
        <div className="space-y-6 animate-fade-in font-sans">
            {/* Header Title */}
            <div className="flex items-center gap-3 text-blue-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <h1 className="text-2xl font-bold">History Transaksi Pembayaran</h1>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Tanggal Awal */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Tanggal Awal</label>
                        <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    {/* Tanggal Akhir */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Tanggal Akhir</label>
                        <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">Status Pembayaran</label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="Semua">Semua</option>
                            <option value="BELUM_DIBAYAR">Belum Dibayar</option>
                            <option value="SUDAH_DIBAYAR">Sudah Dibayar</option>
                        </select>
                    </div>
                    {/* Tombol Reset Filter */}
                    <div>
                        <button 
                            onClick={resetFilters}
                            className="w-full bg-[#0d6efd] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-blue-200 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            Reset Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabel Transaksi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">Daftar Transaksi Pembayaran</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold w-12 text-center bg-gray-50">#</th>
                                <th className="px-6 py-4 font-bold">ID Transaksi</th>
                                <th className="px-6 py-4 font-bold">Tanggal</th>
                                <th className="px-6 py-4 font-bold">Produk</th>
                                <th className="px-6 py-4 font-bold">Total (Rp)</th>
                                <th className="px-6 py-4 font-bold">Status Pembayaran</th>
                                <th className="px-6 py-4 font-bold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Memuat data transaksi...
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                // --- TAMPILAN DATA KOSONG (EMPTY STATE) YANG BARU ---
                                <tr>
                                    <td colSpan="7" className="p-0 border-none">
                                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white">
                                            {/* Ikon Lingkaran */}
                                            <div className="bg-gray-50 p-4 rounded-full mb-4 shadow-sm border border-gray-100">
                                                <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                                </svg>
                                            </div>
                                            
                                            {/* Teks */}
                                            <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Transaksi</h3>
                                            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                                                Anda belum melakukan pembelian produk apapun. Riwayat transaksi Anda akan muncul di sini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx, index) => (
                                    <tr key={trx.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-center font-medium text-gray-400 bg-gray-50 group-hover:bg-blue-50/30">{index + 1}</td>
                                        <td className="px-6 py-4 font-mono text-gray-600 font-medium">
                                            TRX-{trx.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {formatDate(trx.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 font-semibold">
                                            {/* Logic Mapping Nama Produk */}
                                            {getProductName(trx.items)} 
                                            <div className="text-xs text-gray-400 font-normal mt-0.5">
                                                Kode: {trx.kode_billing}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {formatRupiah(trx.total_harga)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStatusBadge(trx.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => setSelectedTransaction(trx)}
                                                className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail */}
            <TransactionDetailModal 
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                transaction={selectedTransaction}
                products={products}
            />
        </div>
    );
};

export default HistoryPembayaran;