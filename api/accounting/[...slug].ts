import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import the compiled accounting routes
const accountingRouter = require('../../backend/dist/routes/accounting').default;
app.use('/api/accounting', accountingRouter);

// For any other path, return 404
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
