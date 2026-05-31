import { useEffect, useState } from 'react';

const features = [
  'Automated BIR tax categorization',
  'OCR-ready invoice processing',
  'SAWT export generation for BIR submission',
  'CAS audit trail for every accounting action',
  'Payroll deduction and 13th-month pay hooks'
];

function Home() {
  const [message, setMessage] = useState('Loading AI accounting status...');

  useEffect(() => {
    setMessage('Ready to connect to backend and Philippine compliance modules.');
  }, []);

  return (
    <section>
      <h2>AI Accounting Dashboard</h2>
      <p>{message}</p>
      <div className="card-grid">
        {features.map((feature) => (
          <article key={feature} className="card">
            <h3>{feature}</h3>
          </article>
        ))}
      </div>
      <div className="callout">
        <h3>Next Steps</h3>
        <ul>
          <li>Configure `backend/.env` with your OpenAI API key.</li>
          <li>Extend invoice scanning for BIR ATC and SAWT generation.</li>
          <li>Implement payroll calculator for SSS, PhilHealth, and Pag-IBIG.</li>
        </ul>
      </div>
    </section>
  );
}

export default Home;
