import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyGateway } from './middlewares/gatewaySecurity';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(verifyGateway);

app.use('/', transactionRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Service Data Master Berjalan');
});

app.listen(PORT, () => {
  console.log(`SERVICE TRANSAKSI BERJALAN DI PORT ${PORT}`);
});