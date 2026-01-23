import React from 'react';
import { formatRupiah } from '../utils/format';

const CheckoutModal = ({ isOpen, onClose, onConfirm, product, isLoading }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden animate-fade-in-up">
                
                {/* Header Biru */}
                <div className="bg-blue-600 px-5 py-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Checkout Pembelian
                    </h3>
                    <button onClick={onClose} disabled={isLoading} className="hover:bg-blue-700 p-1 rounded transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Input Nama Paket (Read Only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Token / Hit</label>
                        <input 
                            type="text" 
                            readOnly
                            value={product.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                        />
                    </div>

                    {/* Input Harga (Read Only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                        <input 
                            type="text" 
                            readOnly
                            value={formatRupiah(product.harga)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 font-bold focus:outline-none cursor-not-allowed"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-4 pt-2">
                        <button 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-bold transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={onConfirm} 
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 transition-colors disabled:bg-blue-400"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Memproses...
                                </span>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                    Lanjutkan Pembayaran
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;