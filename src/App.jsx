import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TicketListPage from "./pages/TicketListPage";
import TicketDetail from "./pages/TicketDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:bookingType" element={<TicketListPage />} />
        <Route path="/dashboard/:bookingType/:ticketId" element={<TicketDetail />} />
      </Routes>
    </Router>
  );
}
