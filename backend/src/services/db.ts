import fs from 'fs';
import path from 'path';

export type AuditEventRow = {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
};

const dataDir = path.join(__dirname, '..', '..', 'data');
const dbPath = path.join(dataDir, 'audit.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadData(): { audit_events: AuditEventRow[] } {
  if (!fs.existsSync(dbPath)) {
    const initial = { audit_events: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  try {
    return JSON.parse(raw) as { audit_events: AuditEventRow[] };
  } catch (error) {
    const initial = { audit_events: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function saveData(data: { audit_events: AuditEventRow[] }) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export function persistAuditEvent(event: AuditEventRow) {
  const data = loadData();
  data.audit_events.unshift(event);
  saveData(data);
}

export function fetchAuditEvents(): AuditEventRow[] {
  return loadData().audit_events;
}
