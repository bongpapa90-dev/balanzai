import { FormEvent, useState } from 'react';
import { apiFetch } from '../api';

function Payroll() {
  const [employeeName, setEmployeeName] = useState('Juan dela Cruz');
  const [monthlySalary, setMonthlySalary] = useState('30000');
  const [employmentType, setEmploymentType] = useState('regular');
  const [dependents, setDependents] = useState('0');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await apiFetch('/api/accounting/payroll/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName,
          monthlySalary: Number(monthlySalary),
          employmentType,
          dependents: Number(dependents)
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Unable to calculate payroll. Check backend connectivity.');
    }
  };

  return (
    <section>
      <h2>Payroll & Statutory Deductions</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Employee Name:
          <input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
        </label>
        <label>
          Monthly Salary:
          <input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
        </label>
        <label>
          Employment Type:
          <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
            <option value="regular">Regular</option>
            <option value="casual">Casual</option>
            <option value="contractual">Contractual</option>
          </select>
        </label>
        <label>
          Dependents:
          <input type="number" value={dependents} onChange={(e) => setDependents(e.target.value)} />
        </label>
        <button type="submit">Calculate Payroll</button>
      </form>

      {error && <div className="help-box">{error}</div>}
      {result && <pre className="summary-block">{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}

export default Payroll;
