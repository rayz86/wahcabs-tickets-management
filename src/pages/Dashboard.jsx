import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar selected={null} onSelect={(type) => navigate(`/dashboard/${type}`)} />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="text-center mt-20">
          <h1 className="text-3xl text-black font-bold mb-4">👋 Welcome to WahCabs Ticket Manager</h1>
          <p className="text-gray-600">Select a booking type from the sidebar to view and manage tickets.</p>
        </div>
      </div>
    </div>
  );
}
