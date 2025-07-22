import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import TicketTable from "../components/TicketTable";

export default function TicketListPage() {
  const { bookingType } = useParams();
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const colRef = collection(db, "tickets", bookingType, "bookings");
      const snap = await getDocs(colRef);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(data);
    };
    fetchTickets();
  }, [bookingType]);

  return (
    <div className="flex">
      <Sidebar selected={bookingType} onSelect={(type) => navigate(`/dashboard/${type}`)} />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-semibold mb-10 text-black px-10">{bookingType}</h1>
        <TicketTable
          tickets={tickets}
          onSelect={(ticket) => navigate(`/dashboard/${bookingType}/${ticket.id}`)}
          bookingType={bookingType}
        />
      </div>
    </div>
  );
}
