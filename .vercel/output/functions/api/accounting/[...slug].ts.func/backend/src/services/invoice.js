"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInvoiceDocument = parseInvoiceDocument;
const ai_1 = require("./ai");
async function parseInvoiceDocument(document) {
    const aiResponse = await (0, ai_1.classifyInvoiceData)(document.text);
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
//# sourceMappingURL=invoice.js.map