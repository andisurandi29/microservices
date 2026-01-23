import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyGateway } from './middlewares/gatewaySecurity';
import authRoutes from './routes/authRoutes';
import rbacRoutes from './routes/rbacRoutes';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(verifyGateway);

app.use('/', authRoutes);
app.use('/', rbacRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Service Auth-RBAC Berjalan');
});

app.listen(PORT, () => {
  console.log(`SERVICE AUTH-RBAC BERJALAN DI PORT ${PORT}`);
});