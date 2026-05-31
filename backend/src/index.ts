import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accountingRouter from './routes/accounting';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/accounting', accountingRouter);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'Philippine AI Accounting API is running' });
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
