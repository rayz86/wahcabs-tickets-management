import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";

export default function TicketDetail() {
  const { bookingType, ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [actions, setActions] = useState("");
  const [payment, setPayment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      const ref = doc(db, "tickets", bookingType, "bookings", ticketId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTicket(data);
        setStatus(data.status);
        setActions(data.actions || "");
        setPayment(data.payment || "0");
      }
    };
    fetchTicket();
  }, [bookingType, ticketId]);

  const handleSave = async () => {
    const ref = doc(db, "tickets", bookingType, "bookings", ticketId);
    await updateDoc(ref, { status, actions, payment });
    alert("✅ Ticket updated!");
    navigate(`/dashboard/${bookingType}`);
  };

  if (!ticket)
    return (
      <div className="flex justify-center items-center w-full h-screen text-lg text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <Sidebar selected={bookingType} />
      <div className="flex-1 p-6 bg-white text-sm text-black">
        <h1 className="text-2xl font-semibold mb-4 text-black">{bookingType}</h1>
        <button
          onClick={() => navigate(`/dashboard/${bookingType}`)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to tickets
        </button>

        <div className="bg-[#d9d9d9] p-4 rounded-md mb-4 flex justify-between items-center">
          <span className="font-semibold">Booking ID: {ticketId}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs text-white ${
              status === "Active"
                ? "bg-green-500"
                : status === "Processed"
                ? "bg-yellow-500 text-black"
                : status === "Cancelled"
                ? "bg-red-600"
                : "bg-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <p><strong>Booking Type:</strong> {bookingType}</p>
          <p><strong>Customer Name:</strong> {ticket.custName}</p>
          <p><strong>Customer Email:</strong> {ticket.custEmail}</p>
          <p><strong>Vehicle:</strong> {ticket.vehicle}</p>
          <p><strong>Amount Payable:</strong> ₹{ticket.amount}</p>
          <p><strong>Guests:</strong> {ticket.passengers || "—"}</p>
          <p><strong>Date:</strong> {ticket.date}</p>
          <p><strong>From:</strong> {ticket.fromLoc}</p>
          <p><strong>To:</strong> {ticket.toLoc}</p>
          {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.tripType && ticket.tripType !== "N/A" && (
          <p><strong>Trip Type:</strong> {ticket.tripType}</p>
          )}
          {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.kmsSlab && (
            <p><strong>KMs Slab:</strong> {ticket.kmsSlab}</p>
          )}
          {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.rideType && (
            <p><strong>Ride Type:</strong> {ticket.rideType}</p>
          )}
        </div>

        {/* Status */}
        <div className="mt-4 md:w-1/2">
          <label className="block font-medium mb-1">Set Current Status:</label>
          <select
            className="w-full border rounded p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Processed">Processed</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment */}
        <div className="mt-4 md:w-1/2">
          <label className="block font-medium mb-1">Pending Payment (₹):</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          <label className="block font-medium mb-1">Actions taken:</label>
          <textarea
            className="w-full border rounded p-3"
            rows="4"
            value={actions}
            onChange={(e) => setActions(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
