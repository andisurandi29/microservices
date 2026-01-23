import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import PembelianProduk from './pages/PembelianProduk';
import HistoryPembayaran from './pages/HistoryPembayaran';
import AdminTransactions from './pages/AdminTransactions';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes dengan Sidebar */}
        <Route element={<MainLayout />}>
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            
            <Route path="/users" element={
                <ProtectedRoute><Users /></ProtectedRoute>
            } />
            
            <Route path="/products" element={
                <ProtectedRoute><Products /></ProtectedRoute>
            } />
            <Route path="/pembelian" element={
                <ProtectedRoute><PembelianProduk /></ProtectedRoute>
            } />
            <Route path="/history" element={
                <ProtectedRoute><HistoryPembayaran /></ProtectedRoute>
            } />
            <Route path="/admin-transactions" element={
                <ProtectedRoute><AdminTransactions /></ProtectedRoute>
            } />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;