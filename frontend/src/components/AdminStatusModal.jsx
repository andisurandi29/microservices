import React, { useState } from 'react';

const AdminStatusModal = ({ isOpen, onClose, transaction, onUpdate }) => {
    const [status, setStatus] = useState(transaction?.status || 'PENDING');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !transaction) return null;

    const handleSubmit = async () => {
        setLoading(true);
        await onUpdate(transaction.id, status);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
                <div className="bg-blue-600 px-4 py-3 text-white flex justify-between items-center">
                    <h3 className="font-bold">Update Status Transaksi</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">ID Transaksi</label>
                        <input type="text" disabled value={transaction.id} className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Status Baru</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="BELUM_DIBAYAR"> Belum Bayar</option>
                            <option value="SUDAH_DIBAYAR">Sudah Bayar</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold">Batal</button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold flex items-center gap-2"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatusModal;