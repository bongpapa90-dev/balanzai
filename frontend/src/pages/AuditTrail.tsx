import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

function AuditTrail() {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/accounting/audit/trail')
      .then((response) => response.json())
      .then(setEvents)
      .catch(() => setError('Unable to load audit trail. Check backend connectivity.'));
  }, []);

  return (
    <section>
      <h2>CAS Audit Trail</h2>
      {error && <div className="help-box">{error}</div>}
      {events.length === 0 ? (
        <p>No audit events have been recorded yet.</p>
      ) : (
        <div className="card">
          <pre className="summary-block">{JSON.stringify(events, null, 2)}</pre>
        </div>
      )}
      <div className="help-box">
        <p>
          The audit trail captures every major accounting action to support CAS compliance and tamper-proof bookkeeping.
        </p>
      </div>
    </section>
  );
}

export default AuditTrail;
