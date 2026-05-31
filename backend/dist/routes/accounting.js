"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const compliance_1 = require("../services/compliance");
const invoice_1 = require("../services/invoice");
const bir_1 = require("../services/bir");
const payroll_1 = require("../services/payroll");
const ocr_1 = require("../services/ocr");
const sawt_1 = require("../services/sawt");
const audit_1 = require("../services/audit");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.post('/invoice/parse', async (req, res) => {
    const document = req.body;
    const result = await (0, invoice_1.parseInvoiceDocument)(document);
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'invoice.parse', 'invoice', result.invoiceNumber || 'unknown', {
        source: 'parse endpoint',
        invoiceText: document.text ? document.text.slice(0, 120) : null
    });
    res.json(result);
});
router.post('/invoice', async (req, res) => {
    const invoice = req.body;
    const result = await (0, compliance_1.analyzeInvoice)(invoice);
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'invoice.analyze', 'invoice', result.parsedInvoice.invoiceNumber || 'unknown', {
        status: result.status
    });
    res.json(result);
});
router.post('/ocr', async (req, res) => {
    const ocrRequest = req.body;
    const result = await (0, ocr_1.runOcrPipeline)(ocrRequest);
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'ocr.run', 'ocr', ocrRequest.imageUrl || 'inline-text', {
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
    const result = await (0, ocr_1.runOcrPipeline)({ sourceText: text, imageUrl: file?.originalname });
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'ocr.upload', 'ocr', file?.originalname || 'inline-text', {
        fileName: file?.originalname,
        sourceTextLength: sourceText ? sourceText.length : undefined,
        warnings: result.warnings
    });
    res.json(result);
});
router.post('/sawt', (req, res) => {
    const { transactions, quarter } = req.body;
    const result = (0, sawt_1.buildSawtFile)(transactions || [], quarter || 'Q1');
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'sawt.generate', 'sawt', quarter || 'Q1', {
        recordCount: result.recordCount,
        totalTaxWithheld: result.totalTaxWithheld
    });
    res.json(result);
});
router.post('/sawt/download', (req, res) => {
    const { transactions, quarter } = req.body;
    const result = (0, sawt_1.buildSawtFile)(transactions || [], quarter || 'Q1');
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'sawt.download', 'sawt', quarter || 'Q1', {
        recordCount: result.recordCount,
        totalTaxWithheld: result.totalTaxWithheld
    });
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="sawt-${quarter || 'Q1'}.dat"`);
    res.send(result.datFile);
});
router.get('/compliance', async (_req, res) => {
    const summary = await (0, compliance_1.getComplianceSummary)();
    res.json(summary);
});
router.get('/bir-forms', (_req, res) => {
    res.json({ forms: (0, bir_1.getAvailableBIRForms)() });
});
router.post('/bir-form', async (req, res) => {
    const payload = req.body;
    const result = await (0, compliance_1.generateBIRForm)(payload);
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'bir.form.generate', 'bir-form', payload.formType || 'unknown', {
        fieldsProvided: Object.keys(payload)
    });
    res.json(result);
});
router.post('/payroll/calculate', (req, res) => {
    const payload = req.body;
    const result = (0, payroll_1.calculatePayroll)(payload);
    (0, audit_1.recordAuditEvent)('system', 'anonymous', 'payroll.calculate', 'payroll', payload.employeeName || 'unknown', {
        monthlySalary: payload.monthlySalary,
        employmentType: payload.employmentType
    });
    res.json(result);
});
router.get('/audit/trail', (_req, res) => {
    res.json((0, audit_1.getAuditTrail)());
});
router.post('/audit/event', (req, res) => {
    const { userId, userRole, action, resourceType, resourceId, details } = req.body;
    const event = (0, audit_1.recordAuditEvent)(userId || 'anonymous', userRole || 'guest', action, resourceType, resourceId, details || {});
    res.json(event);
});
exports.default = router;
