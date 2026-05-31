# Backend Setup Guide

## Architecture

The AI Powered Accounting System uses a full-stack architecture:

- **Frontend**: React + TypeScript (Vite) - Deployed on Vercel as static site
- **Backend**: Express.js + TypeScript - Deployed on Vercel as Serverless Functions (`/api/accounting/[...slug].ts`)
- **API Communication**: 
  - Local Dev: Frontend proxies `/api` to `http://localhost:4000`
  - Production: Frontend calls `/api` â†’ Vercel routes to serverless functions

## Local Development Setup

### Prerequisites
- Node.js 16+ and npm
- OpenAI API key (optional, for AI features)

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
NODE_ENV=development
```

### 3. Run Backend

```bash
npm run dev
```

Backend will start on `http://localhost:4000`

Test the connection:
```bash
curl http://localhost:4000/
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

### 5. Run Frontend

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

The frontend's Vite dev server will automatically proxy `/api` requests to the backend on `http://localhost:4000`.

## Testing Backend Connection

### Test via Frontend
1. Open `http://localhost:5173` in your browser
2. Go to Dashboard (Home) page - should show "âœ… Backend connected successfully!"
3. Test individual features:
   - **Invoices**: Parse invoice text
   - **OCR**: Upload documents
   - **Payroll**: Calculate deductions
   - **BIR Forms**: Generate compliance forms
   - **SAWT**: Export withholding reports
   - **Audit Trail**: View system events

### Test via cURL

```bash
# Test compliance endpoint
curl http://localhost:4000/api/accounting/compliance

# Test payroll calculation
curl -X POST http://localhost:4000/api/accounting/payroll/calculate \
  -H "Content-Type: application/json" \
  -d '{"employeeName":"Juan Dela Cruz","monthlySalary":30000,"employmentType":"regular","dependents":0}'

# Test BIR forms list
curl http://localhost:4000/api/accounting/bir-forms

# Test audit trail
curl http://localhost:4000/api/accounting/audit/trail
```

## API Endpoints

### Invoice Processing
- `POST /api/accounting/invoice/parse` - Parse invoice text
- `POST /api/accounting/invoice` - Analyze invoice with AI

### OCR & Document Processing
- `POST /api/accounting/ocr` - Run OCR on text/image
- `POST /api/accounting/ocr/upload` - Upload file for OCR processing

### SAWT (Simplified Withholding Tax) Export
- `POST /api/accounting/sawt` - Generate SAWT data
- `POST /api/accounting/sawt/download` - Download SAWT .dat file

### Compliance & BIR
- `GET /api/accounting/compliance` - Get compliance summary
- `GET /api/accounting/bir-forms` - List available BIR forms
- `POST /api/accounting/bir-form` - Generate BIR form

### Payroll
- `POST /api/accounting/payroll/calculate` - Calculate payroll with statutory deductions

### Audit Trail
- `GET /api/accounting/audit/trail` - Get audit trail
- `POST /api/accounting/audit/event` - Record audit event

## Production Deployment (Vercel)

The backend is automatically deployed as Vercel Serverless Functions:

1. **Deployment**: Push to GitHub â†’ Vercel auto-deploys
2. **API URL**: `https://balanzai.vercel.app/api/accounting/*`
3. **Environment Variables**: Set in Vercel Project Settings:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NODE_ENV` - Set to `production`

### Vercel Configuration

The `vercel.json` file defines:
- Frontend build: `frontend/` with dist output
- Backend functions: `api/accounting/[...slug].ts` routes all requests to Express app
- Routing: `/api/*` requests route to serverless functions

### Set Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Settings â†’ Environment Variables
3. Add:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`

## Frontend Environment Variables

Frontend environment variables are set in `frontend/.env`:

```env
VITE_API_BASE_URL=
```

- **Local**: Leave empty (Vite proxy handles it)
- **Production**: Leave empty (Vercel routes `/api` to serverless functions)
- **Custom**: Can be set to specific backend URL if needed

## Troubleshooting

### Backend Not Connected
1. Check backend is running: `curl http://localhost:4000`
2. Check port 4000 is available
3. Check for errors in backend console

### API Calls Failing
1. Check frontend console for network errors
2. Check backend logs for request errors
3. Verify `OPENAI_API_KEY` is set if using AI features
4. Check CORS settings (enabled in app.ts)

### Frontend Not Proxying to Backend
1. Verify Vite dev server is running on `http://localhost:5173`
2. Check vite.config.ts has proxy setup
3. Restart Vite dev server

### Deployment Issues
1. Check Vercel build logs
2. Verify `vercel.json` is correct
3. Ensure `api/` directory has correct files
4. Check environment variables on Vercel

## Development Notes

### Adding New API Endpoints

1. Add handler to `backend/src/routes/accounting.ts`:
```typescript
router.post('/new-endpoint', async (req, res) => {
  const result = await someService(req.body);
  recordAuditEvent('system', 'anonymous', 'action', 'resource', 'resourceId', {});
  res.json(result);
});
```

2. Call from frontend using `apiFetch`:
```typescript
const response = await apiFetch('/api/accounting/new-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
const result = await response.json();
```

### Services

All backend logic is modularized in `backend/src/services/`:
- `compliance.ts` - BIR compliance logic
- `invoice.ts` - Invoice processing
- `ocr.ts` - OCR pipeline
- `bir.ts` - BIR form generation
- `payroll.ts` - Payroll calculations
- `sawt.ts` - SAWT file generation
- `audit.ts` - Audit trail management
- `ai.ts` - AI/OpenAI integration

## Next Steps

1. Add your `OPENAI_API_KEY` to `backend/.env`
2. Test each feature via the frontend UI
3. Customize business logic in `backend/src/services/`
4. Deploy to Vercel for production use
