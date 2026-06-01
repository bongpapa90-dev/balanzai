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
        res.json({ message: 'Philippine AI Accounting API is running' });
    });
}
exports.default = app;
