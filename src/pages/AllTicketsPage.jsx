import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import AllTicketsTable from "../components/AllTicketsTable";
import { useNavigate } from "react-router-dom";
import ExportXlsx from "../components/ExportXlsx"; // Correctly imported

export const bookingTypes = [
  "Airport Transfers",
  "Local Rides",
  "Sightseeing",
  "Outstation Rides",
];

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTickets = async () => {
      setLoading(true); // Set loading to true
      let all = [];

      for (let type of bookingTypes) {
        const colRef = collection(db, "tickets", type, "bookings");
        const snap = await getDocs(colRef);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          bookingType: type,
          ...doc.data(),
        }));
        all.push(...data);
      }
      
      // ✅ Sort tickets by date robustly to prevent crashes from invalid data
      all.sort((a, b) => {
        const dateB = new Date(b.date);
        const dateA = new Date(a.date);

        // Check if dates are valid. Invalid dates are sorted to the bottom.
        const isDateAInvalid = isNaN(dateA.getTime());
        const isDateBInvalid = isNaN(dateB.getTime());

        if (isDateAInvalid) return 1;
        if (isDateBInvalid) return -1;

        return dateB - dateA; // Both dates are valid, sort descending (most recent first)
      });

      setTickets(all);
      setLoading(false); // Set loading to false
    };

    fetchAllTickets();
  }, []);

  const handleTicketClick = (ticket) => {
    navigate(`/dashboard/${ticket.bookingType}/${ticket.id}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar selected="all" />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">📋 All Tickets</h1>
          
          <ExportXlsx 
            tickets={tickets} 
            fileName="All_Tickets_Export"
            disabled={loading}
          />
        </div>

        {/* Show a loading message or the table */}
        {loading ? (
          <div className="text-center py-10">Loading all tickets...</div>
        ) : (
          <AllTicketsTable tickets={tickets} onSelect={handleTicketClick} showBookingType />
        )}
      </div>
    </div>
  );
}
