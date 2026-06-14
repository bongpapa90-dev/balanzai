"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const accounting_1 = __importDefault(require("./routes/accounting"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/accounting', accounting_1.default);
if (process.env.NODE_ENV === 'production') {
    const frontendDist = path_1.default.join(process.cwd(), 'frontend', 'dist');
    app.use(express_1.default.static(frontendDist));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(frontendDist, 'index.html'));
    });
}
else {
    app.get('/', (_req, res) => {
        res.json({ message: 'AI powered Accounting System API is running', version: '0.1.0', endpoints: [
                'POST /api/accounting/invoice/parse - Parse invoice text',
                'POST /api/accounting/invoice - Analyze invoice',
                'POST /api/accounting/ocr - Run OCR on image',
                'POST /api/accounting/ocr/upload - Upload document for OCR',
                'POST /api/accounting/sawt - Generate SAWT data',
                'POST /api/accounting/sawt/download - Download SAWT .dat file',
                'GET /api/accounting/compliance - Get compliance summary',
                'GET /api/accounting/bir-forms - List available BIR forms',
                'POST /api/accounting/bir-form - Generate BIR form',
                'POST /api/accounting/payroll/calculate - Calculate payroll',
                'GET /api/accounting/audit/trail - Get audit trail',
                'POST /api/accounting/audit/event - Record audit event'
            ] });
    });
}
exports.default = app;
