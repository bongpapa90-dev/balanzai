"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOcrPipeline = runOcrPipeline;
const ai_1 = require("./ai");
async function runOcrPipeline(request) {
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
    const classification = await (0, ai_1.classifyInvoiceData)(rawText || JSON.stringify(extractedFields, null, 2));
    return {
        rawText,
        extractedFields: {
            ...extractedFields,
            aiClassification: classification
        },
        warnings: rawText ? [] : ['No OCR source was provided. Returned a sample extraction stub.']
    };
}
//# sourceMappingURL=ocr.js.map