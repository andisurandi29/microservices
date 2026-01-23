import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend tipe Request agar bisa menyimpan user data
export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
    // 1. Ambil token dari Header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    try {
        // 2. Verifikasi Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        
        // 3. Simpan data user ke request object agar bisa dibaca middleware selanjutnya
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
    }
};

// Middleware untuk Cek Role (RBAC)
// Menerima array role yang diizinkan. Contoh: ['ADMIN', 'PEMBELI']
export const authorizeRole = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): any => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        // Cek apakah role user ada di daftar yang diizinkan
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Forbidden: Role '${req.user.role}' tidak memiliki akses ke endpoint ini.` 
            });
        }

        next();
    };
};