import React, { useState } from 'react';
import { formatRupiah } from '../utils/format';

const TransactionDetailModal = ({ isOpen, onClose, transaction, products = [] }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !transaction) return null;

    const handleCopyBilling = () => {
        navigator.clipboard.writeText(transaction.kode_billing);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getProductName = () => {
        // Cek jika ada items
        if (transaction.items && transaction.items.length > 0) {
            const item = transaction.items[0]; 
            
            // 1. Cari di list products
            const foundProduct = products.find(p => p.id == item.produk_id);
            if (foundProduct) return foundProduct.nama_produk || foundProduct.name;

            // 2. Fallback jika tidak ketemu
            return "Produk ID: " + item.produk_id;
        }
        return "Detail Produk tidak tersedia";
    };

    const renderStatusHeader = (status) => {
        let colorClass = "bg-gray-100 text-gray-600";
        let icon = null;
        let label = status;

        switch (status) {
            case 'BELUM_DIBAYAR':
            case 'PENDING':
                colorClass = "bg-yellow-50 text-yellow-700 border border-yellow-200";
                label = "Menunggu Pembayaran";
                icon = <span className="relative flex h-3 w-3 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>;
                break;
            case 'PAID':
            case 'SUDAH_DIBAYAR':
                colorClass = "bg-green-50 text-green-700 border border-green-200";
                label = "Pembayaran Berhasil";
                icon = <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
                break;
            case 'EXPIRED':
                colorClass = "bg-red-50 text-red-700 border border-red-200";
                label = "Kadaluarsa";
                icon = <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
                break;
            default:
                break;
        }

        return (
            <div className={`flex items-center justify-center py-2 px-4 rounded-full mb-4 ${colorClass}`}>
                {icon}
                <span className="font-bold text-sm">{label}</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                
                {/* Header Biru */}
                <div className="bg-[#0d6efd] px-6 py-4 flex justify-between items-center text-white shadow-md">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <h3 className="font-bold text-lg tracking-wide">Detail Transaksi</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-center">
                        {renderStatusHeader(transaction.status)}
                    </div>

                    {/* Kode Billing Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 relative group">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 text-center">Kode Billing</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="font-mono text-2xl font-bold text-[#0d6efd] tracking-widest">
                                {transaction.kode_billing}
                            </span>
                            <button onClick={handleCopyBilling} className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-500" title="Salin">
                                {copied ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
                            </button>
                        </div>
                        {copied && <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] bg-black text-white px-2 py-0.5 rounded">Tersalin!</span>}
                    </div>

                    {/* List Detail */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">ID Transaksi</span>
                            <span className="font-mono font-medium text-gray-800">TRX-{transaction.id.split('-')[0].toUpperCase()}</span>
                        </div>
                        
                        {/* NAMA PRODUK MUNCUL DISINI */}
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Produk</span>
                            <span className="font-bold text-gray-800 text-right max-w-50">
                                {getProductName()}
                            </span>
                        </div>

                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Tanggal Transaksi</span>
                            <span className="font-medium text-gray-800">{formatDate(transaction.created_at)}</span>
                        </div>

                        {transaction.expired_at && (transaction.status === 'PENDING' || transaction.status === 'BELUM_DIBAYAR') && (
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Batas Pembayaran</span>
                                <span className="font-medium text-red-600">{formatDate(transaction.expired_at)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-gray-600 font-bold">Total Pembayaran</span>
                            <span className="text-xl font-bold text-[#0d6efd]">{formatRupiah(transaction.total_harga)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 flex justify-center border-t border-gray-100">
                    <button onClick={onClose} className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;