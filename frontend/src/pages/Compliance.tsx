import { useEffect, useState } from 'react';

function Compliance() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/accounting/compliance')
      .then((response) => response.json())
      .then(setSummary)
      .catch(() => setSummary({ error: 'Unable to connect to backend' }));
  }, []);

  return (
    <section>
      <h2>Compliance Center</h2>
      {summary ? (
        <pre className="summary-block">{JSON.stringify(summary, null, 2)}</pre>
      ) : (
        <p>Loading compliance summary...</p>
      )}
      <div className="help-box">
        <p>
          This summary page shows the backend compliance engine status. Use the Invoices page to parse receipts,
          BIR Forms to build draft returns, and Payroll to compute statutory deductions.
        </p>
      </div>
    </section>
  );
}

export default Compliance;
