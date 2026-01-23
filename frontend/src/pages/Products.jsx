import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductModal from '../components/ProductModal';
import { formatRupiah } from '../utils/format';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // --- FETCH DATA ---
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // GET /api/products via Gateway
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Gagal load produk:", error);
            alert("Gagal memuat data produk.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- HANDLE SAVE (CREATE & UPDATE) ---
    const handleSaveProduct = async (formData) => {
        try {
            if (currentProduct) {
                // UPDATE (PUT) - Role Admin
                await api.put(`/products/${currentProduct.id}`, formData);
                alert('Produk berhasil diperbarui!');
            } else {
                // CREATE (POST) - Role Admin
                await api.post('/products', formData);
                alert('Produk berhasil ditambahkan!');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            if (error.response?.status === 403) {
                alert('Akses Ditolak: Hanya ADMIN yang boleh mengelola produk.');
            } else {
                alert(`Gagal menyimpan: ${error.response?.data?.message || 'Server Error'}`);
            }
        }
    };

    // --- HANDLE DELETE (DELETE) ---
    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
                alert('Produk berhasil dihapus.');
            } catch (error) {
                console.error("Error delete:", error);
                if (error.response?.status === 403) {
                    alert('Akses Ditolak: Hanya ADMIN yang boleh menghapus produk.');
                } else {
                    alert('Gagal menghapus produk.');
                }
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Title & Icon */}
            <div className="flex items-center gap-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <h1 className="text-2xl font-bold">Data Master Produk</h1>
            </div>

            {/* Card Container */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                
                <div className="bg-blue-500 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><list /><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
                        <h2 className="font-bold text-lg">Daftar Produk API</h2>
                    </div>
                    
                    {/* Tombol Tambah Produk */}
                    <button 
                        onClick={() => { setCurrentProduct(null); setIsModalOpen(true); }}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        Tambah Produk
                    </button>
                </div>

                {/* Table Content */}
                <div className="p-6">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold w-16 text-center">#</th>
                                    <th className="px-6 py-4 font-bold">Nama Produk</th>
                                    <th className="px-6 py-4 font-bold text-center">Harga per Token/Hit</th>
                                    <th className="px-6 py-4 font-bold text-center w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Memuat data produk...</td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Belum ada data produk.</td>
                                    </tr>
                                ) : (
                                    products.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-500 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                                            <td className="px-6 py-4 text-center font-medium text-gray-600">
                                                {formatRupiah(item.harga)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => { setCurrentProduct(item); setIsModalOpen(true); }}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors" title="Edit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors" title="Hapus">
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
            </div>

            {/* Render Modal */}
            <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveProduct}
                productToEdit={currentProduct}
            />
        </div>
    );
};

export default Products;