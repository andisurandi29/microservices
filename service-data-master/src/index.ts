import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyGateway } from './middlewares/gatewaySecurity';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(verifyGateway);

app.use('/', productRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Service Data Master Berjalan');
});

app.listen(PORT, () => {
  console.log(`SERVICE DATA MASTER BERJALAN DI PORT ${PORT}`);
});