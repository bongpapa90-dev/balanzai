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
  const frontendDist = path.join(process.cwd(), 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'AI powered Accounting System API is running', version: '0.1.0', endpoints: [
      'POST /api/accounting/invoice/parse - Parse invoice text',
      'POST /api/accounting/invoice - Analyze invoice',
      'POST /api/accounting/ocr - Run OCR on image',
      'POST /api/accounting/ocr/upload - Upload document for OCR',
      'POST /api/accounting/sawt - Generate SAWT data',
      'POST /api/accounting/sawt/download - Download SAWT .dat file',
      'GET /api/accounting/compliance - Get compliance summary',
      'GET /api/accounting/bir-forms - List available BIR forms',
      'POST /api/accounting/bir-form - Generate BIR form',
      'POST /api/accounting/payroll/calculate - Calculate payroll',
      'GET /api/accounting/audit/trail - Get audit trail',
      'POST /api/accounting/audit/event - Record audit event'
    ]});
  });
}

export default app;
