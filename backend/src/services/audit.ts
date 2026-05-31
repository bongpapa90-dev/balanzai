import { fetchAuditEvents, persistAuditEvent } from './db';

export type AuditEvent = {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
};

export function recordAuditEvent(
  userId: string,
  userRole: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details: Record<string, any>
): AuditEvent {
  const event: AuditEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    details
  };
  persistAuditEvent({
    ...event,
    details: JSON.stringify(details || {})
  });
  return event;
}

export function getAuditTrail(): AuditEvent[] {
  return fetchAuditEvents().map((row) => ({
    ...row,
    details: JSON.parse(row.details)
  }));
}
