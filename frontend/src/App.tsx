import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Compliance from './pages/Compliance';
import Invoices from './pages/Invoices';
import BIRForms from './pages/BIRForms';
import Payroll from './pages/Payroll';
import OCR from './pages/OCR';
import SAWT from './pages/SAWT';
import AuditTrail from './pages/AuditTrail';

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Philippine AI Accounting</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/invoices">Invoices</Link>
          <Link to="/bir-forms">BIR Forms</Link>
          <Link to="/payroll">Payroll</Link>
          <Link to="/ocr">OCR Upload</Link>
          <Link to="/sawt">SAWT</Link>
          <Link to="/audit">Audit Trail</Link>
          <Link to="/compliance">Compliance Center</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/bir-forms" element={<BIRForms />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/sawt" element={<SAWT />} />
          <Route path="/audit" element={<AuditTrail />} />
          <Route path="/compliance" element={<Compliance />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
