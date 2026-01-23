import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getProductFromMaster } from '../utils/masterService';
import crypto from 'crypto';

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () { return this.toString() };

// --- ADD TO CART ---
export const addToCart = async (req: Request, res: Response): Promise<any> => {
    try {
        // Ambil ID Pembeli dari Header
        const userId = req.headers['x-user-id']; 
        const { produk_id } = req.body;

        if (!userId) return res.status(400).json({ message: "User ID (Header) tidak ditemukan" });

        // CEK PRODUK
        const product = await getProductFromMaster(produk_id);
        
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan di Data Master" });
        }

        // Masukkan ke Keranjang
        await prisma.keranjang.create({
            data: {
                pembeli_id: BigInt(userId as string),
                produk_id: BigInt(produk_id),
                harga: product.harga,
                transaksi_id: null  
            }
        });

        return res.status(201).json({ message: "Produk berhasil masuk keranjang" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// --- GET CART ---
export const getCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const { pembeli_id } = req.params;

        const items = await prisma.keranjang.findMany({
            where: {
                pembeli_id: BigInt(pembeli_id as string),
                transaksi_id: null
            }
        });

        return res.json(items);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// --- CHECKOUT ---
export const checkout = async (req: Request, res: Response): Promise<any> => {
    try {
        // Gunakan header x-user-id
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(400).json({ message: "User ID missing" });

        // Ambil item keranjang user ini yang aktif
        const cartItems = await prisma.keranjang.findMany({
            where: { 
                pembeli_id: BigInt(userId as string), 
                transaksi_id: null 
            }
        });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Keranjang kosong" });
        }

        // Hitung Total Harga
        const totalHarga = cartItems.reduce((sum, item) => sum + Number(item.harga), 0);

        // Generate Kode Billing & Expired
        const kodeBilling = `BILL-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 24); // Expired 24 jam

        // ATOMIC TRANSACTION (Create Transaksi + Update Keranjang)
        const result = await prisma.$transaction(async (tx) => {
            // Buat Transaksi Baru
            const newTransaction = await tx.transaksi.create({
                data: {
                    kode_billing: kodeBilling,
                    pembeli_id: BigInt(userId as string),
                    total_harga: totalHarga,
                    status: 'BELUM_DIBAYAR',
                    expired_at: expiredAt
                }
            });

            // Link Item Keranjang ke Transaksi ini
            await tx.keranjang.updateMany({
                where: { 
                    pembeli_id: BigInt(userId as string), 
                    transaksi_id: null 
                },
                data: { transaksi_id: newTransaction.id }
            });

            return newTransaction;
        });

        return res.status(201).json({ 
            message: "Checkout berhasil", 
            data: result 
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const GetAllTransaction = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaksi.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        items: true,
      }

    });
    res.json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};

// --- HISTORY TRANSAKSI ---
export const getHistory = async (req: Request, res: Response) => {
  try {
    const pembeli_id = req.headers['x-user-id'] as string;
    const { status, startDate, endDate } = req.query;

    if (!pembeli_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Bangun Query Filter
    const whereClause: any = {
      pembeli_id: pembeli_id
    };

    // Filter Status
    if (status && status !== 'Semua') {
      whereClause.status = status;
    }

    // Filter Tanggal
    if (startDate && endDate) {
      whereClause.created_at = {
        gte: new Date(startDate as string),
        lte: new Date(new Date(endDate as string).setHours(23, 59, 59)) // Sampai akhir hari
      };
    }

    const transactions = await prisma.transaksi.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      },
        include: {
            items: true,
        }
    });

    res.json({ data: transactions });
  } catch (error) {
    console.error("Error get history:", error);
    res.status(500).json({ message: 'Gagal mengambil history transaksi' });
  }
};

// --- UPDATE STATUS PEMBAYARAN (ADMIN) ---
export const updatePaymentStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params; 
        const { status } = req.body;

        if (status !== 'SUDAH_DIBAYAR' && status !== 'BELUM_DIBAYAR') {
            return res.status(400).json({ message: "Status tidak valid. Gunakan SUDAH_DIBAYAR atau BELUM_DIBAYAR" });
        }
        
        await prisma.transaksi.update({
            where: { id: BigInt(id as string) },
            data: { status: status }
        });

        return res.json({ message: "Status pembayaran berhasil diupdate" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};