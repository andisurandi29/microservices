import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await prisma.users.findMany({
            include: { roles: true },
            orderBy: { created_at: 'desc' }
        });

        const cleanUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });

        return res.json(cleanUsers);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const addUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await prisma.users.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email sudah digunakan' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status: true,
                roles: {
                    create: { role: role || 'PEMBELI' }
                }
            },
            include: { roles: true }
        });

        return res.status(201).json({ 
            message: 'User berhasil dibuat', 
            data: { id: newUser.id.toString(), email: newUser.email } 
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, status, role, password } = req.body;
        const userId = BigInt(id as string);

        const dataUpdate: any = {};
        if (name) dataUpdate.name = name;
        if (status !== undefined) dataUpdate.status = status;
        if (password) dataUpdate.password = await bcrypt.hash(password, 10);

        if (Object.keys(dataUpdate).length > 0) {
            await prisma.users.update({ where: { id: userId }, data: dataUpdate });
        }

        if (role) {
            const userRole = await prisma.users_role.findFirst({ where: { user_id: userId } });
            if (userRole) {
                await prisma.users_role.update({ where: { id: userRole.id }, data: { role } });
            } else {
                await prisma.users_role.create({ data: { user_id: userId, role } });
            }
        }

        return res.json({ message: 'User berhasil diupdate' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        await prisma.users.delete({ where: { id: BigInt(id as string) } });
        return res.json({ message: 'User berhasil dihapus' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};