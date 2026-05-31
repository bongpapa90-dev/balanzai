import { classifyInvoiceData } from './ai';

export type OcrRequest = {
  sourceText?: string;
  imageUrl?: string;
  imageBase64?: string;
};

export type OcrResult = {
  rawText: string;
  extractedFields: Record<string, any>;
  warnings: string[];
};

export async function runOcrPipeline(request: OcrRequest): Promise<OcrResult> {
  const rawText = request.sourceText
    ? request.sourceText
    : request.imageUrl
    ? `Simulated OCR output for image ${request.imageUrl}`
    : request.imageBase64
    ? 'Simulated OCR output for provided base64 image data.'
    : '';

  const extractedFields = {
    supplierTIN: '123-456-789',
    businessStyle: 'AI Accounting Corp',
    branchCode: '001',
    invoiceNumber: 'INV-2026-0001',
    invoiceDate: new Date().toISOString().split('T')[0],
    vatableSales: 892.86,
    outputVAT: 107.14,
    totalAmount: 1000,
    paymentTerms: '30 days',
    rawTextSnippet: rawText.slice(0, 250)
  };

  const classification = await classifyInvoiceData(rawText || JSON.stringify(extractedFields, null, 2));

  return {
    rawText,
    extractedFields: {
      ...extractedFields,
      aiClassification: classification
    },
    warnings: rawText ? [] : ['No OCR source was provided. Returned a sample extraction stub.']
  };
}
