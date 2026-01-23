import { Router } from 'express';
import { addToCart, getCart, checkout, getHistory, updatePaymentStatus, GetAllTransaction } from '../controllers/transactionController';

const router = Router();

router.post('/cart/add', addToCart);
router.get('/cart/:pembeli_id', getCart);
router.post('/checkout', checkout);
router.get('/transactions', getHistory);
router.patch('/transactions/:id', updatePaymentStatus);
router.get('/admin/transactions', GetAllTransaction);

export default router;