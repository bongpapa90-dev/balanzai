import { useState } from 'react';
import { apiFetch } from '../api';

const sampleTransactions = [
  {
    supplierTIN: '123-456-789',
    supplierName: 'ABC Supplies',
    atcCode: '1601-C',
    amountPaid: 10000,
    taxWithheld: 200,
    paymentDate: '2026-03-15'
  }
];

function SAWT() {
  const [quarter, setQuarter] = useState('Q1');
  const [transactions, setTransactions] = useState(JSON.stringify(sampleTransactions, null, 2));
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await apiFetch('/api/accounting/sawt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quarter, transactions: JSON.parse(transactions) })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Unable to generate SAWT file. Check backend connectivity and JSON structure.');
    }
  };

  const handleDownload = async () => {
    if (!result) {
      return;
    }

    try {
      const response = await apiFetch('/api/accounting/sawt/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quarter, transactions: JSON.parse(transactions) })
      });
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sawt-${quarter}.dat`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Unable to download SAWT file.');
    }
  };

  return (
    <section>
      <h2>SAWT Export</h2>
      <div className="card">
        <label>
          Quarter:
          <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </label>
        <label>
          Transactions JSON:
          <textarea value={transactions} onChange={(e) => setTransactions(e.target.value)} rows={10} />
        </label>
        <button type="button" onClick={handleGenerate}>
          Generate SAWT .dat
        </button>
      </div>
      {error && <div className="help-box">{error}</div>}
      {result && (
        <>
          <div className="card">
            <h3>SAWT .dat Output</h3>
            <pre className="summary-block">{result.datFile}</pre>
          </div>
          <div className="card">
            <h3>Summary</h3>
            <p>Records: {result.recordCount}</p>
            <p>Total Tax Withheld: {result.totalTaxWithheld}</p>
            <button type="button" onClick={() => handleDownload()}>
              Download .dat File
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default SAWT;
