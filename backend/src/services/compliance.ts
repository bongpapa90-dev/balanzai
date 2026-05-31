import { parseInvoiceDocument } from './invoice';
import { buildBIRForm, getAvailableBIRForms } from './bir';

export async function analyzeInvoice(invoice: any) {
  const document = {
    text: invoice.text || JSON.stringify(invoice, null, 2),
    metadata: invoice.metadata || {}
  };
  const parsed = await parseInvoiceDocument(document);

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

export async function generateBIRForm(payload: any) {
  const formType = payload.formType || '1601-C';
  return buildBIRForm(formType, payload);
}

export async function getComplianceSummary() {
  return {
    birCasReady: true,
    auditTrail: 'active',
    ewtCategorization: 'pending',
    payrollCompliance: 'available',
    sawtSupport: true,
    ocrPipeline: true,
    supportedBIRForms: getAvailableBIRForms(),
    notes: [
      'Real OCR pipeline stub added for receipt and invoice text extraction.',
      'SAWT export generator produces draft .dat file content for BIR submission.',
      'CAS audit trail stores events for invoice parsing, form generation, payroll, and SAWT exports.'
    ]
  };
}
