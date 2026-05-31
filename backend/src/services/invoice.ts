import { classifyInvoiceData } from './ai';

export type InvoiceParseResult = {
  supplierTIN: string;
  businessStyle: string;
  branchCode: string;
  invoiceDate: string;
  invoiceNumber: string;
  vatableSales: number;
  zeroRatedSales: number;
  vatExemptSales: number;
  inputVAT: number;
  outputVAT: number;
  totalAmount: number;
  atcCodes: string[];
  classificationNotes: string[];
};

export async function parseInvoiceDocument(document: {
  text: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}): Promise<InvoiceParseResult> {
  const aiResponse = await classifyInvoiceData(document.text);

  return {
    supplierTIN: 'N/A',
    businessStyle: 'N/A',
    branchCode: '000',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceNumber: 'AUTO-0001',
    vatableSales: 0,
    zeroRatedSales: 0,
    vatExemptSales: 0,
    inputVAT: 0,
    outputVAT: 0,
    totalAmount: 0,
    atcCodes: ['1601-C'],
    classificationNotes: ['Parsed using AI classification stub.', `AI raw response: ${aiResponse}`]
  };
}
