"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableBIRForms = getAvailableBIRForms;
exports.buildBIRForm = buildBIRForm;
const formTemplates = {
    '1601-EQ': ['Taxpayer TIN', 'Quarter', 'Tax Withheld', 'Payee Details', 'ATC'],
    '1601-C': ['Taxpayer TIN', 'Creditable Withholding Tax', 'Payee Name', 'Tax Period', 'ATC'],
    '2550Q': ['Taxpayer TIN', 'Quarter', 'Sales', 'Purchases', 'VAT Payable', 'Exempt Sales', 'Zero-Rated Sales'],
    '1702Q': ['Taxpayer TIN', 'Taxable Income', 'Income Tax Due', 'Quarter', 'Deductions'],
    '1702RT': ['Taxpayer TIN', 'Taxable Income', 'Final Tax Withheld', 'Related Party Transactions']
};
function getAvailableBIRForms() {
    return Object.keys(formTemplates);
}
function buildBIRForm(formType, payload) {
    const templateFields = formTemplates[formType] || [];
    const details = templateFields.reduce((acc, field) => {
        acc[field] = payload[field] ?? `TBD (${field})`;
        return acc;
    }, {});
    return {
        formType,
        createdAt: new Date().toISOString(),
        status: 'draft',
        fields: details,
        submissionHint: `Use this document to complete the BIR ${formType} filing. Replace TBD values with verified entries before export.`
    };
}
