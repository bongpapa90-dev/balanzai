import { FormEvent, useState } from 'react';

function Invoices() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:4000/api/accounting/invoice/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Unable to parse invoice. Check backend connectivity.');
    }
  };

  return (
    <section>
      <h2>Invoice OCR / Parse</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Paste invoice or receipt text here:
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} />
        </label>
        <button type="submit">Parse Invoice</button>
      </form>

      {error && <div className="help-box">{error}</div>}
      {result && <pre className="summary-block">{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}

export default Invoices;
