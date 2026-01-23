import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () { return this.toString() };

// --- 1. LIST PRODUK (GET /products) ---
export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const products = await prisma.produk.findMany({
            orderBy: { created_at: 'desc' }
        });
        return res.json(products);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// --- 2. TAMBAH PRODUK (POST /products) ---
export const createProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, harga } = req.body;

        // Validasi Input
        if (!name || harga === undefined) {
            return res.status(400).json({ message: "Nama dan Harga wajib diisi" });
        }
        
        // Validasi: Harga tidak boleh negatif 
        if (Number(harga) < 0) {
            return res.status(400).json({ message: "Harga tidak boleh negatif" });
        }

        // Validasi: Name wajib unik 
        const existing = await prisma.produk.findUnique({ where: { name } });
        if (existing) {
            return res.status(400).json({ message: "Nama produk sudah ada" });
        }

        const newProduct = await prisma.produk.create({
            data: {
                name,
                harga: harga 
            }
        });

        return res.status(201).json({ message: "Produk berhasil dibuat", data: newProduct });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// --- 3. UPDATE PRODUK (PUT /products/:id) ---
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, harga } = req.body;

        // Cek produk ada atau tidak
        const product = await prisma.produk.findUnique({ where: { id: BigInt(id as string) } });
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

        const dataUpdate: any = {};
        
        if (name) {
            // Cek unik jika ganti nama
            const existing = await prisma.produk.findUnique({ where: { name } });
            if (existing && existing.id !== BigInt(id as string)) {
                return res.status(400).json({ message: "Nama produk sudah digunakan produk lain" });
            }
            dataUpdate.name = name;
        }

        if (harga !== undefined) {
            if (Number(harga) < 0) return res.status(400).json({ message: "Harga tidak boleh negatif" });
            dataUpdate.harga = harga;
        }

        await prisma.produk.update({
            where: { id: BigInt(id as string) },
            data: dataUpdate
        });

        return res.json({ message: "Produk berhasil diupdate" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// --- 4. HAPUS PRODUK (DELETE /products/:id) ---
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        
        const product = await prisma.produk.findUnique({ where: { id: BigInt(id as string) } });
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

        await prisma.produk.delete({
            where: { id: BigInt(id as string) }
        });

        return res.json({ message: "Produk berhasil dihapus" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};