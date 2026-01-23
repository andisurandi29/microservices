import React from 'react';
import { formatRupiah } from '../utils/format';

const BillingModal = ({ isOpen, onClose, transactionData }) => {
    if (!isOpen || !transactionData) return null;

    // Helper format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: 'numeric', month: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                
                {/* Header Hijau */}
                <div className="bg-green-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                        Kode Billing SIMPONI
                    </h3>
                    <button onClick={onClose} className="hover:bg-green-700 p-1 rounded transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="p-6">
                    {/* Alert Sukses */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
                        <div className="text-green-600 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-green-800 text-sm">Billing Berhasil Dibuat!</h4>
                            <p className="text-green-700 text-sm">Berikut informasi kode billing dari sistem <span className="font-bold">SIMPONI Kemenkeu</span>.</p>
                        </div>
                    </div>

                    {/* Tabel Informasi */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                        <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 p-3">
                            <div className="font-bold text-gray-700 text-sm">Kode Billing</div>
                            <div className="col-span-2 font-mono font-bold text-gray-800 tracking-wider">
                                {transactionData.kode_billing}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-200 p-3">
                            <div className="font-bold text-gray-700 text-sm">Nominal</div>
                            <div className="col-span-2 font-bold text-gray-800">
                                {formatRupiah(transactionData.total_harga)}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                            <div className="font-bold text-gray-700 text-sm">Tanggal Kadaluarsa</div>
                            <div className="col-span-2 text-red-600 font-medium text-sm">
                                {formatDate(transactionData.expired_at)}
                            </div>
                        </div>
                    </div>

                    {/* Tata Cara */}
                    <div className="text-sm text-gray-600 space-y-2 mb-6">
                        <h5 className="font-bold text-blue-600">Tata Cara Pembayaran:</h5>
                        <ol className="list-decimal list-inside space-y-1 pl-1">
                            <li>Buka aplikasi <b>BRI / BNI / Mandiri / BSI / Bank lain</b> yang mendukung pembayaran PNBP SIMPONI.</li>
                            <li>Pilih menu <b>“Pembayaran → PNBP → SIMPONI”</b>.</li>
                            <li>Masukkan <b>Kode Billing</b> di atas.</li>
                            <li>Periksa rincian transaksi dan lakukan pembayaran.</li>
                            <li>Simpan bukti bayar. Token akan otomatis aktif setelah verifikasi oleh sistem.</li>
                        </ol>
                    </div>

                    {/* Button Selesai */}
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-green-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Selesai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingModal;