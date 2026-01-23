import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken, authorizeRole } from './middlewares/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// URL Service Backend
const AUTH_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const MASTER_URL = process.env.MASTER_SERVICE_URL || 'http://localhost:3002';
const TRANSACTION_URL = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003';

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(morgan('dev')); 

// =========================================================================
//  HELPER: PROXY CREATOR DENGAN SECURITY & MANUAL REWRITE
// =========================================================================
const createProxy = (target: string, pathRewriteMap: Record<string, string>) => {
    return createProxyMiddleware({
        target: target,
        changeOrigin: true,
        pathRewrite: pathRewriteMap,
        on: { 
            proxyReq: (proxyReq, req: any, res) => {

                const secret = process.env.GATEWAY_SECRET || '';
                
                // 1. Injeksi Security Header
                proxyReq.setHeader('X-INTERNAL-KEY', secret);

                // 2. Teruskan User ID jika ada (untuk request yg butuh login)
                if (req.user) {
                    proxyReq.setHeader('X-USER-ID', req.user.user_id);
                    proxyReq.setHeader('X-USER-ROLE', req.user.role);
                }
                // 3. Jika ada body, teruskan juga (untuk POST/PUT)
                if (req.body && Object.keys(req.body).length > 0) {
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            }
        }
    });
};

// =========================================================================
//  1. MODUL AUTHENTICATION (Service Auth - Port 3001)
// =========================================================================

// [POST] Login
app.post('/api/login', createProxy(AUTH_URL, { 
    '^/api/login': '/login' 
}));

// [POST] Refresh Token
app.post('/api/refresh-token', createProxy(AUTH_URL, { 
    '^/api/refresh-token': '/refresh-token' 
}));

// [GET] Me (Profile) - Butuh Login
app.get('/api/me', verifyToken, createProxy(AUTH_URL, { 
    '^/api/me': '/me' 
}));


// =========================================================================
//  2. MODUL RBAC / USER MANAGEMENT (Service Auth/RBAC - Port 3001)
// =========================================================================

// [GET] List Users
app.get('/api/users', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(AUTH_URL, { '^/api/users': '/users' })
);

// [POST] Add User
app.post('/api/users', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(AUTH_URL, { '^/api/users': '/add_users' })
);

// [PUT] Update User
app.put('/api/users/:id', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(AUTH_URL, { '^/api/users': '/update_users' })
);

// [DELETE] Delete User
app.delete('/api/users/:id', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(AUTH_URL, { '^/api/users': '/delete_users' })
);


// =========================================================================
//  3. MODUL DATA MASTER / PRODUK (Service Master - Port 3002)
// =========================================================================

// [GET] List Products (ADMIN & PEMBELI)
app.get('/api/products', 
    verifyToken, 
    authorizeRole(['ADMIN', 'PEMBELI']), 
    createProxy(MASTER_URL, { '^/api/products': '/products' })
);

// [POST] Create Product (ADMIN Only)
app.post('/api/products', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(MASTER_URL, { '^/api/products': '/products' })
);

// [PUT] Update Product (ADMIN Only)
app.put('/api/products/:id', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(MASTER_URL, { '^/api/products': '/products' })
);

// [DELETE] Delete Product (ADMIN Only)
app.delete('/api/products/:id', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(MASTER_URL, { '^/api/products': '/products' })
);


// =========================================================================
//  4. MODUL TRANSAKSI (Service Transaction - Port 3003)
// =========================================================================

// [POST] Add to Cart (PEMBELI ONLY)
app.post('/api/cart/add', 
    verifyToken, 
    authorizeRole(['PEMBELI']), 
    createProxy(TRANSACTION_URL, { '^/api/cart/add': '/cart/add' })
);

// [GET] View Cart (PEMBELI ONLY)
app.get('/api/cart', 
    verifyToken, 
    authorizeRole(['PEMBELI']),
    createProxyMiddleware({
        target: TRANSACTION_URL,
        changeOrigin: true,
        pathRewrite: async (path, req: any) => {
            return `/cart/${req.user.user_id}`;
        },
        on: {
            proxyReq: (proxyReq, req: any) => {
                proxyReq.setHeader('X-INTERNAL-KEY', process.env.GATEWAY_SECRET || '');
            }
        }
    })
);

// [POST] Checkout (PEMBELI ONLY)
app.post('/api/checkout', 
    verifyToken, 
    authorizeRole(['PEMBELI']), 
    createProxy(TRANSACTION_URL, { '^/api/checkout': '/checkout' })
);

// [GET] History (PEMBELI ONLY)
app.get('/api/transactions', 
    verifyToken, 
    authorizeRole(['PEMBELI']),
    createProxy(TRANSACTION_URL, { '^/api/transactions': '/transactions' }) 
);

// [PATCH] Update Status (ADMIN ONLY)
app.patch('/api/transactions/:id', 
    verifyToken, 
    authorizeRole(['ADMIN']), 
    createProxy(TRANSACTION_URL, { '^/api/transactions': '/transactions' })
);

// [GET] All Transactions (ADMIN ONLY)
app.get('/api/admin/transactions', 
    verifyToken, 
    authorizeRole(['ADMIN']),
    createProxy(TRANSACTION_URL, { '^/api/admin/transactions': '/admin/transactions' }) 
);

// =========================================================================
//  ROOT & START SERVER
// =========================================================================
app.get('/', (req, res) => {
    res.json({ 
        message: 'API GATEWAY BERJALAN', 
        services: {
            auth: 'Terhubung',
            master: 'Terhubung',
            transaction: 'Terhubung'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API Gateway berjalan di http://localhost:${PORT}`);
    console.log(`   👉 Auth Service arah ke: ${AUTH_URL}`);
    console.log(`   👉 Master Service arah ke: ${MASTER_URL}`);
    console.log(`   👉 Transaction Service arah ke: ${TRANSACTION_URL}`);
});