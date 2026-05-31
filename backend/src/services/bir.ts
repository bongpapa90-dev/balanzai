export type BirFormType = '1601-EQ' | '1601-C' | '2550Q' | '1702Q' | '1702RT';

const formTemplates: Record<BirFormType, string[]> = {
  '1601-EQ': ['Taxpayer TIN', 'Quarter', 'Tax Withheld', 'Payee Details', 'ATC'],
  '1601-C': ['Taxpayer TIN', 'Creditable Withholding Tax', 'Payee Name', 'Tax Period', 'ATC'],
  '2550Q': ['Taxpayer TIN', 'Quarter', 'Sales', 'Purchases', 'VAT Payable', 'Exempt Sales', 'Zero-Rated Sales'],
  '1702Q': ['Taxpayer TIN', 'Taxable Income', 'Income Tax Due', 'Quarter', 'Deductions'],
  '1702RT': ['Taxpayer TIN', 'Taxable Income', 'Final Tax Withheld', 'Related Party Transactions']
};

export function getAvailableBIRForms() {
  return Object.keys(formTemplates) as BirFormType[];
}

export function buildBIRForm(formType: BirFormType, payload: Record<string, any>) {
  const templateFields = formTemplates[formType] || [];

  const details = templateFields.reduce((acc, field) => {
    acc[field] = payload[field] ?? `TBD (${field})`;
    return acc;
  }, {} as Record<string, any>);

  return {
    formType,
    createdAt: new Date().toISOString(),
    status: 'draft',
    fields: details,
    submissionHint: `Use this document to complete the BIR ${formType} filing. Replace TBD values with verified entries before export.`
  };
}
