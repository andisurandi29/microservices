import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({
            where: { email },
            include: { roles: true }
        });

        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
        if (!user.status) return res.status(403).json({ message: 'Akun dinonaktifkan' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(401).json({ message: 'Password salah' });

        const role = user.roles.length > 0 ? user.roles[0].role : 'PEMBELI';
        const token = jwt.sign(
            { user_id: user.id.toString(), email: user.email, role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return res.json({ message: 'Login berhasil', token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const me = async (req: Request, res: Response): Promise<any> => {
    try {
        const { user_id } = req.body;
        if(!user_id) return res.status(400).json({message: "User ID required"});

        const user = await prisma.users.findUnique({
            where: { id: BigInt(user_id) },
            include: { roles: true }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password, ...userData } = user;
        return res.json(userData);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Token required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        const newToken = jwt.sign(
            { user_id: decoded.user_id, email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return res.json({ token: newToken });
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};