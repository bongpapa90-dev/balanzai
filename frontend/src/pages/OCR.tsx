import { FormEvent, useState } from 'react';
import { apiFetch } from '../api';

function OCR() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (file) {
      formData.append('document', file);
    }
    if (sourceText) {
      formData.append('sourceText', sourceText);
    }

    try {
      const response = await apiFetch('/api/accounting/ocr/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Unable to upload OCR document. Check backend connectivity.');
    }
  };

  return (
    <section>
      <h2>OCR File Upload</h2>
      <form onSubmit={handleUpload} className="card">
        <label>
          Upload invoice or receipt file:
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <label>
          Or paste invoice text directly:
          <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} rows={6} />
        </label>
        <button type="submit">Run OCR</button>
      </form>

      {error && <div className="help-box">{error}</div>}
      {result && <pre className="summary-block">{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}

export default OCR;
