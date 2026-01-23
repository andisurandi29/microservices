import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getProductFromMaster = async (productId: string) => {
    try {
        // Ambil data produk dari Service Master melalui API Gateway
        const response = await axios.get(`${process.env.API_GATEWAY_URL}/products`, {
            headers: {
                'X-INTERNAL-KEY': process.env.GATEWAY_SECRET
            }
        });

        const products = response.data;
        const product = products.find((p: any) => p.id == productId);

        return product || null;
    } catch (error) {
        console.error("Gagal koneksi ke API Gateway", error);
        return null;
    }
};