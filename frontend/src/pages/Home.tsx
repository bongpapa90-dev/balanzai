import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const features = [
  'Automated BIR tax categorization',
  'OCR-ready invoice processing',
  'SAWT export generation for BIR submission',
  'CAS audit trail for every accounting action',
  'Payroll deduction and 13th-month pay hooks'
];

function Home() {
  const [status, setStatus] = useState({ connected: false, message: 'Testing backend connection...' });

  useEffect(() => {
    // Test backend connectivity
    apiFetch('/api/accounting/compliance')
      .then((response) => {
        if (response.ok) {
          setStatus({ connected: true, message: '✅ Backend connected successfully!' });
        } else {
          setStatus({ connected: false, message: '⚠️ Backend response error. Check server logs.' });
        }
      })
      .catch(() => {
        setStatus({ 
          connected: false, 
          message: '❌ Backend not connected. Make sure the backend server is running on port 4000 or deployed on Vercel.' 
        });
      });
  }, []);

  return (
    <section>
      <h2>AI Accounting Dashboard</h2>
      <div className={`card ${status.connected ? 'success' : 'warning'}`}>
        <p><strong>Backend Status:</strong> {status.message}</p>
      </div>
      <div className="card-grid">
        {features.map((feature) => (
          <article key={feature} className="card">
            <h3>{feature}</h3>
          </article>
        ))}
      </div>
      <div className="callout">
        <h3>Getting Started</h3>
        <ul>
          <li><strong>Local Development:</strong> Run `npm run dev` in the backend folder (port 4000)</li>
          <li><strong>Configure API Keys:</strong> Set `OPENAI_API_KEY` in `backend/.env` for AI features</li>
          <li><strong>Try it out:</strong> Navigate to Invoices, Payroll, or OCR pages to test backend features</li>
          <li><strong>Production:</strong> Backend is deployed as Vercel Serverless Functions at `/api/accounting`</li>
        </ul>
      </div>
    </section>
  );
}

export default Home;
