import { Router } from 'express';
import { getAllUsers, addUser, updateUser, deleteUser } from '../controllers/rbacController';

const router = Router();

router.get('/users', getAllUsers);
router.post('/add_users', addUser);
router.put('/update_users/:id', updateUser);
router.delete('/delete_users/:id', deleteUser);

export default router;