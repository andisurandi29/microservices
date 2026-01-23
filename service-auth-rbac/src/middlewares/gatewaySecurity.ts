import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const verifyGateway = (req: Request, res: Response, next: NextFunction): any => {
    // 1. Ambil header x-internal-key
    const internalKey = req.headers['x-internal-key'];
    const secret = process.env.GATEWAY_SECRET;

    // 2. Cek Validasi
    if (!internalKey || internalKey !== secret) {
        console.warn(`[SECURITY] Percobaan akses ilegal dari IP: ${req.ip}`);
        return res.status(403).json({ 
            message: 'Forbidden: Direct access is not allowed. Please use API Gateway.' 
        });
    }
    
    next();
};