"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistAuditEvent = persistAuditEvent;
exports.fetchAuditEvents = fetchAuditEvents;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.join(__dirname, '..', '..', 'data');
const dbPath = path_1.default.join(dataDir, 'audit.json');
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
function loadData() {
    if (!fs_1.default.existsSync(dbPath)) {
        const initial = { audit_events: [] };
        fs_1.default.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf8');
        return initial;
    }
    const raw = fs_1.default.readFileSync(dbPath, 'utf8');
    try {
        return JSON.parse(raw);
    }
    catch (error) {
        const initial = { audit_events: [] };
        fs_1.default.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf8');
        return initial;
    }
}
function saveData(data) {
    fs_1.default.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}
function persistAuditEvent(event) {
    const data = loadData();
    data.audit_events.unshift(event);
    saveData(data);
}
function fetchAuditEvents() {
    return loadData().audit_events;
}
