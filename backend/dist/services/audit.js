"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAuditEvent = recordAuditEvent;
exports.getAuditTrail = getAuditTrail;
const db_1 = require("./db");
function recordAuditEvent(userId, userRole, action, resourceType, resourceId, details) {
    const event = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        timestamp: new Date().toISOString(),
        userId,
        userRole,
        action,
        resourceType,
        resourceId,
        details
    };
    (0, db_1.persistAuditEvent)({
        ...event,
        details: JSON.stringify(details || {})
    });
    return event;
}
function getAuditTrail() {
    return (0, db_1.fetchAuditEvents)().map((row) => ({
        ...row,
        details: JSON.parse(row.details)
    }));
}
