export type EmploymentType = 'regular' | 'casual' | 'contractual';

export type PayrollInput = {
  employeeName: string;
  monthlySalary: number;
  employmentType: EmploymentType;
  dependents?: number;
};

export type PayrollOutput = {
  employeeName: string;
  monthlySalary: number;
  sss: { employee: number; employer: number; total: number; bracket: string };
  philHealth: { employee: number; employer: number; total: number };
  pagibig: { employee: number; employer: number; total: number };
  withholdingTax: number;
  grossPay: number;
  netPay: number;
  thirteenthMonthEstimate: { gross: number; nonTaxable: number; taxable: number };
};

function calculateSSS(monthlySalary: number) {
  const bracket = monthlySalary <= 3000 ? 'S1' : monthlySalary <= 24750 ? 'S2' : 'S3';
  const employee = Math.min(monthlySalary * 0.045, 900);
  const employer = Math.min(monthlySalary * 0.09, 1800);
  return { employee: Math.round(employee), employer: Math.round(employer), total: Math.round(employee + employer), bracket };
}

function calculatePhilHealth(monthlySalary: number) {
  const contribution = Math.max(Math.min(monthlySalary * 0.045, 1800), 300);
  const employee = Math.round(contribution / 2);
  const employer = contribution - employee;
  return { employee, employer, total: contribution };
}

function calculatePagIbig() {
  return { employee: 100, employer: 100, total: 200 };
}

function calculateWithholdingTax(monthlySalary: number, dependents = 0) {
  const nonTaxableAllowance = 50000 + dependents * 2500;
  const taxableIncome = Math.max(0, monthlySalary - nonTaxableAllowance);

  if (taxableIncome <= 20833) {
    return 0;
  }
  if (taxableIncome <= 33333) {
    return Math.round((taxableIncome - 20833) * 0.20);
  }
  if (taxableIncome <= 66667) {
    return Math.round(2500 + (taxableIncome - 33333) * 0.25);
  }
  if (taxableIncome <= 166667) {
    return Math.round(10833 + (taxableIncome - 66667) * 0.30);
  }
  return Math.round(40833 + (taxableIncome - 166667) * 0.32);
}

export function calculatePayroll(payload: PayrollInput): PayrollOutput {
  const sss = calculateSSS(payload.monthlySalary);
  const philHealth = calculatePhilHealth(payload.monthlySalary);
  const pagibig = calculatePagIbig();
  const withholdingTax = calculateWithholdingTax(payload.monthlySalary, payload.dependents || 0);
  const grossPay = payload.monthlySalary;
  const totalDeductions = sss.employee + philHealth.employee + pagibig.employee + withholdingTax;
  const netPay = Math.round(grossPay - totalDeductions);

  const thirteenthMonthGross = payload.monthlySalary;
  const nonTaxable = Math.min(thirteenthMonthGross, 90000 / 12);
  const taxable = Math.max(0, thirteenthMonthGross - nonTaxable);

  return {
    employeeName: payload.employeeName,
    monthlySalary: payload.monthlySalary,
    sss,
    philHealth,
    pagibig,
    withholdingTax,
    grossPay,
    netPay,
    thirteenthMonthEstimate: {
      gross: thirteenthMonthGross,
      nonTaxable: Math.round(nonTaxable),
      taxable: Math.round(taxable)
    }
  };
}
