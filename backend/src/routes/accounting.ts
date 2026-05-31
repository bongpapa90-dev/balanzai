import { Router } from 'express';
import multer from 'multer';
import { analyzeInvoice, generateBIRForm, getComplianceSummary } from '../services/compliance';
import { parseInvoiceDocument } from '../services/invoice';
import { getAvailableBIRForms } from '../services/bir';
import { calculatePayroll } from '../services/payroll';
import { runOcrPipeline } from '../services/ocr';
import { buildSawtFile } from '../services/sawt';
import { getAuditTrail, recordAuditEvent } from '../services/audit';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/invoice/parse', async (req, res) => {
  const document = req.body;
  const result = await parseInvoiceDocument(document);
  recordAuditEvent('system', 'anonymous', 'invoice.parse', 'invoice', result.invoiceNumber || 'unknown', {
    source: 'parse endpoint',
    invoiceText: document.text ? document.text.slice(0, 120) : null
  });
  res.json(result);
});

router.post('/invoice', async (req, res) => {
  const invoice = req.body;
  const result = await analyzeInvoice(invoice);
  recordAuditEvent('system', 'anonymous', 'invoice.analyze', 'invoice', result.parsedInvoice.invoiceNumber || 'unknown', {
    status: result.status
  });
  res.json(result);
});

router.post('/ocr', async (req, res) => {
  const ocrRequest = req.body;
  const result = await runOcrPipeline(ocrRequest);
  recordAuditEvent('system', 'anonymous', 'ocr.run', 'ocr', ocrRequest.imageUrl || 'inline-text', {
    warnings: result.warnings
  });
  res.json(result);
});

router.post('/ocr/upload', upload.single('document'), async (req, res) => {
  const file = req.file;
  const sourceText = req.body.sourceText;
  if (!file && !sourceText) {
    return res.status(400).json({ error: 'No file uploaded and no text provided.' });
  }

  const text = file ? file.buffer.toString('utf-8') : sourceText;
  const result = await runOcrPipeline({ sourceText: text, imageUrl: file?.originalname });
  recordAuditEvent('system', 'anonymous', 'ocr.upload', 'ocr', file?.originalname || 'inline-text', {
    fileName: file?.originalname,
    sourceTextLength: sourceText ? sourceText.length : undefined,
    warnings: result.warnings
  });
  res.json(result);
});

router.post('/sawt', (req, res) => {
  const { transactions, quarter } = req.body;
  const result = buildSawtFile(transactions || [], quarter || 'Q1');
  recordAuditEvent('system', 'anonymous', 'sawt.generate', 'sawt', quarter || 'Q1', {
    recordCount: result.recordCount,
    totalTaxWithheld: result.totalTaxWithheld
  });
  res.json(result);
});

router.post('/sawt/download', (req, res) => {
  const { transactions, quarter } = req.body;
  const result = buildSawtFile(transactions || [], quarter || 'Q1');
  recordAuditEvent('system', 'anonymous', 'sawt.download', 'sawt', quarter || 'Q1', {
    recordCount: result.recordCount,
    totalTaxWithheld: result.totalTaxWithheld
  });
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="sawt-${quarter || 'Q1'}.dat"`);
  res.send(result.datFile);
});

router.get('/compliance', async (_req, res) => {
  const summary = await getComplianceSummary();
  res.json(summary);
});

router.get('/bir-forms', (_req, res) => {
  res.json({ forms: getAvailableBIRForms() });
});

router.post('/bir-form', async (req, res) => {
  const payload = req.body;
  const result = await generateBIRForm(payload);
  recordAuditEvent('system', 'anonymous', 'bir.form.generate', 'bir-form', payload.formType || 'unknown', {
    fieldsProvided: Object.keys(payload)
  });
  res.json(result);
});

router.post('/payroll/calculate', (req, res) => {
  const payload = req.body;
  const result = calculatePayroll(payload);
  recordAuditEvent('system', 'anonymous', 'payroll.calculate', 'payroll', payload.employeeName || 'unknown', {
    monthlySalary: payload.monthlySalary,
    employmentType: payload.employmentType
  });
  res.json(result);
});

router.get('/audit/trail', (_req, res) => {
  res.json(getAuditTrail());
});

router.post('/audit/event', (req, res) => {
  const { userId, userRole, action, resourceType, resourceId, details } = req.body;
  const event = recordAuditEvent(userId || 'anonymous', userRole || 'guest', action, resourceType, resourceId, details || {});
  res.json(event);
});

export default router;
