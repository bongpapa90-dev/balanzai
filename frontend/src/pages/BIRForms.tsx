import { useEffect, useState } from 'react';

function BIRForms() {
  const [forms, setForms] = useState<string[]>([]);
  const [selectedForm, setSelectedForm] = useState('1601-C');
  const [formResult, setFormResult] = useState<any>(null);
  const [payload, setPayload] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/accounting/bir-forms')
      .then((response) => response.json())
      .then((data) => setForms(data.forms || []))
      .catch(() => setForms(['1601-C', '2550Q', '1702Q']));
  }, []);

  const handleGenerate = async () => {
    const body = { formType: selectedForm, ...JSON.parse(payload || '{}') };
    const response = await fetch('http://localhost:4000/api/accounting/bir-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    setFormResult(data);
  };

  return (
    <section>
      <h2>BIR Form Generator</h2>
      <div className="card">
        <label>
          Select form:
          <select value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)}>
            {forms.map((form) => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </label>
        <label>
          JSON payload for template fields:
          <textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={6} />
        </label>
        <button type="button" onClick={handleGenerate}>
          Generate BIR Form
        </button>
      </div>

      {formResult && <pre className="summary-block">{JSON.stringify(formResult, null, 2)}</pre>}
    </section>
  );
}

export default BIRForms;
