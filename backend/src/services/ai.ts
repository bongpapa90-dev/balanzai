import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function classifyInvoiceData(invoiceText: string) {
  const prompt = `Extract relevant Philippine accounting fields from the invoice text for BIR compliance and CAS bookkeeping. Return JSON including supplierTIN, businessStyle, branchCode, vatableSales, zeroRatedSales, vatExemptSales, inputVAT, outputVAT, and recommended ATC codes.`;

  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt + '\n\nInvoice text:\n' + invoiceText,
    max_output_tokens: 500
  });

  return completion.output_text || '';
}
