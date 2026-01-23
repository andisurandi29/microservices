import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatRupiah } from '../utils/format';
import CheckoutModal from '../components/CheckoutModal';
import BillingModal from '../components/BillingModal';

const PembelianProduk = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    
    // State Transaksi & Billing
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionResult, setTransactionResult] = useState(null);
    const [isBillingOpen, setIsBillingOpen] = useState(false);

    // Load Produk
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Gagal load produk:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Handle Klik "Beli Sekarang"
    const handleBuyClick = (product) => {
        setSelectedProduct(product);
        setIsCheckoutOpen(true);
    };

    // Proses Checkout (Add Cart -> Checkout)
    const handleConfirmCheckout = async () => {
        setIsProcessing(true);
        try {
            // Add to Cart
            await api.post('/cart/add', {
                produk_id: selectedProduct.id
            });

            // Checkout (Generate Billing)
            const response = await api.post('/checkout');
            
            // Sukses
            setTransactionResult(response.data.data);
            setIsCheckoutOpen(false);
            setIsBillingOpen(true);
        } catch (error) {
            console.error(error);
            alert(`Transaksi Gagal: ${error.response?.data?.message || 'Server Error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const getGradient = (index) => {
        const gradients = [
            "from-blue-400 to-blue-600 shadow-blue-200",   
            "from-amber-400 to-orange-500 shadow-orange-200", 
            "from-purple-500 to-fuchsia-600 shadow-fuchsia-200", 
            "from-emerald-400 to-teal-600 shadow-teal-200" 
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <h1 className="text-xl font-bold">Beli Produk</h1>
                </div>
                <div className="flex gap-4 text-gray-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </div>
            </div>

            {/* Grid Produk */}
            {loading ? (
                 <div className="text-center py-10 text-gray-500">Memuat katalog produk...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <div key={product.id} className={`rounded-xl p-6 text-white shadow-lg bg-linear-to-br ${getGradient(index)} flex flex-col justify-between h-64 transform transition hover:-translate-y-1`}>
                            
                            {/* Nama Produk */}
                            <div className="text-center">
                                <h3 className="text-lg font-bold leading-tight mb-2 drop-shadow-md">
                                    {product.name}
                                </h3>
                                <div className="h-1 w-12 bg-white/30 mx-auto rounded-full"></div>
                            </div>

                            {/* Harga */}
                            <div className="text-center">
                                <div className="text-3xl font-extrabold drop-shadow-md">
                                    {formatRupiah(product.harga)}
                                </div>
                            </div>

                            {/* Tombol Beli */}
                            <div className="text-center">
                                <button 
                                    onClick={() => handleBuyClick(product)}
                                    className="bg-white text-gray-800 font-bold py-2 px-6 rounded shadow-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2 text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                    Beli Sekarang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL CHECKOUT */}
            <CheckoutModal 
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleConfirmCheckout}
                product={selectedProduct}
                isLoading={isProcessing}
            />

            {/* MODAL BILLING */}
            <BillingModal 
                isOpen={isBillingOpen}
                onClose={() => setIsBillingOpen(false)}
                transactionData={transactionResult}
            />
        </div>
    );
};

export default PembelianProduk;