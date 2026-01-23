import { Router } from 'express';
import { login, me, refreshToken } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/me', me);
router.post('/refresh-token', refreshToken);

export default router;