import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TicketListPage from "./pages/TicketListPage";
import TicketDetail from "./pages/TicketDetail";
import AllTicketsPage from "./pages/AllTicketsPage";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/:bookingType"
              element={
                <RequireAuth>
                  <TicketListPage />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard/:bookingType/:ticketId"
              element={
                <RequireAuth>
                  <TicketDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/all-tickets"
              element={
                <RequireAuth>
                  <AllTicketsPage />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}
