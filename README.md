# AI powered Accounting System

This repository is a starter scaffold for an AI-enabled accounting system designed for Philippine compliance. It includes a backend API, frontend dashboard, and AI/compliance service placeholders.

## Features

- BIR-compliant tax automation and CAS awareness
- AI-assisted invoice extraction, tax categorization, and reporting skeletons
- Frontend dashboard for bookkeeping workflows and compliance status
- Localized Philippine accounting structure with payroll and tax module hooks

## Workspace Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app for development
   ```bash
   npm run dev
   ```
3. Build and run the app as a web-based production server
   ```bash
   npm run start:web
   ```
4. Build and run with Docker Compose
   ```bash
   docker compose up --build
   ```

> If you need OpenAI integration, set `OPENAI_API_KEY` in your host environment before starting the container.

## Notes

- The backend includes stub services for AI, invoice parsing, BIR form templates, and payroll computation.
- Configure API keys in `backend/.env.example` and move to `backend/.env`.
- `backend/data/accounting.db` stores CAS audit trail events in SQLite for persistence.
- Extend the system with real OCR, BIR form mapping, EIS reporting, and payroll deduction workfloow ws.

## Deployment Status

Last build triggered: 2026-06-01 02:45 UTC - Vercel GitHub integration active, frontend title updated

## New Features

- `POST /api/accounting/invoice/parse` for AI-assisted invoice parsing
- `POST /api/accounting/ocr` for OCR pipeline stubs and extraction
- `POST /api/accounting/ocr/upload` for file upload OCR workflow
- `POST /api/accounting/sawt` to build SAWT .dat export content
- `POST /api/accounting/sawt/download` to download generated SAWT files
- `GET /api/accounting/audit/trail` to review CAS audit events stored in SQLite
- `POST /api/accounting/payroll/calculate` to compute SSS, PhilHealth, Pag-IBIG, withholding tax, and 13th-month estimates

## Frontend Pages

- `/invoices` for invoice parsing
- `/bir-forms` for generating BIR form templates
- `/payroll` for statutory deduction calculators
- `/ocr` for OCR file upload and extraction
- `/sawt` for generating and downloading SAWT export files
- `/audit` for viewing CAS audit trail events
- `/compliance` for overall compliance status
