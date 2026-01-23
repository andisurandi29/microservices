import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/login', {
                email: email, 
                password: password
            });

            // Simpan token
            const token = response.data.token;
            localStorage.setItem('token', token);
        
            navigate('/dashboard'); 

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal terhubung ke server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-400 to-blue-600 font-sans">
            
            {/* Card Putih */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
                
                {/* Logo & Judul */}
                <div className="flex flex-col items-center mb-8">
                    {/* Icon Dompet */}
                    <div className="mb-4 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-blue-600 tracking-wide uppercase">
                        Dompet PNBP
                    </h1>
                    <p className="text-[10px] text-gray-500 text-center mt-1 font-medium px-4 leading-tight">
                        Digital Online Management & Payment Electronic Transaction
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-200 text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* Input Email */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1">Email</label>
                        <input 
                            type="text" 
                            placeholder="Masukkan email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="Masukkan password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Button Login */}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:bg-blue-400"
                    >
                        {isLoading ? 'Memproses...' : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                                    <polyline points="10 17 15 12 10 7"/>
                                    <line x1="15" x2="3" y1="12" y2="12"/>
                                </svg>
                                Masuk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;