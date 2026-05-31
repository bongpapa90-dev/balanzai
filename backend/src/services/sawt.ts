export type SawtTransaction = {
  supplierTIN: string;
  supplierName: string;
  atcCode: string;
  amountPaid: number;
  taxWithheld: number;
  paymentDate: string;
};

export type SawtResult = {
  quarter: string;
  recordCount: number;
  totalTaxWithheld: number;
  datFile: string;
  records: Array<SawtTransaction & { sequence: number; datLine: string }>;
};

export function buildSawtFile(
  transactions: SawtTransaction[],
  quarter: string
): SawtResult {
  const records = transactions.map((transaction, index) => {
    const datLine = `${transaction.supplierTIN}|${transaction.paymentDate}|${transaction.atcCode}|${transaction.amountPaid.toFixed(2)}|${transaction.taxWithheld.toFixed(2)}`;
    return {
      ...transaction,
      sequence: index + 1,
      datLine
    };
  });

  const totalTaxWithheld = records.reduce((sum, record) => sum + record.taxWithheld, 0);
  const header = `SAWT|${quarter}|${records.length}|${totalTaxWithheld.toFixed(2)}`;
  const datFile = [header, ...records.map((record) => record.datLine)].join('\n');

  return {
    quarter,
    recordCount: records.length,
    totalTaxWithheld,
    datFile,
    records
  };
}
