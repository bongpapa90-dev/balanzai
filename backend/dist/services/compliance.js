"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeInvoice = analyzeInvoice;
exports.generateBIRForm = generateBIRForm;
exports.getComplianceSummary = getComplianceSummary;
const invoice_1 = require("./invoice");
const bir_1 = require("./bir");
async function analyzeInvoice(invoice) {
    const document = {
        text: invoice.text || JSON.stringify(invoice, null, 2),
        metadata: invoice.metadata || {}
    };
    const parsed = await (0, invoice_1.parseInvoiceDocument)(document);
    return {
        invoice,
        parsedInvoice: parsed,
        status: 'parsed',
        recommendedActions: [
            'Verify ATC assignments',
            'Map journal entries to CAS books',
            'Prepare draft BIR forms for review'
        ]
    };
}
async function generateBIRForm(payload) {
    const formType = payload.formType || '1601-C';
    return (0, bir_1.buildBIRForm)(formType, payload);
}
async function getComplianceSummary() {
    return {
        birCasReady: true,
        auditTrail: 'active',
        ewtCategorization: 'pending',
        payrollCompliance: 'available',
        sawtSupport: true,
        ocrPipeline: true,
        supportedBIRForms: (0, bir_1.getAvailableBIRForms)(),
        notes: [
            'Real OCR pipeline stub added for receipt and invoice text extraction.',
            'SAWT export generator produces draft .dat file content for BIR submission.',
            'CAS audit trail stores events for invoice parsing, form generation, payroll, and SAWT exports.'
        ]
    };
}
