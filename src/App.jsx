import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TicketListPage from "./pages/TicketListPage";
import TicketDetail from "./pages/TicketDetail";
import AllTicketsPage from "./pages/AllTicketsPage";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:bookingType" element={<TicketListPage />} />
          <Route path="/dashboard/:bookingType/:ticketId" element={<TicketDetail />} />
          <Route path="/all-tickets" element={<AllTicketsPage />} />
        </Routes>
      </Router>
    </div>
  );
}
