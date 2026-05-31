"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSawtFile = buildSawtFile;
function buildSawtFile(transactions, quarter) {
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
//# sourceMappingURL=sawt.js.map