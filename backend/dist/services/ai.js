"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyInvoiceData = classifyInvoiceData;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
async function classifyInvoiceData(invoiceText) {
    const prompt = `Extract relevant Philippine accounting fields from the invoice text for BIR compliance and CAS bookkeeping. Return JSON including supplierTIN, businessStyle, branchCode, vatableSales, zeroRatedSales, vatExemptSales, inputVAT, outputVAT, and recommended ATC codes.`;
    const completion = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt + '\n\nInvoice text:\n' + invoiceText,
        max_output_tokens: 500
    });
    return completion.output_text || '';
}
