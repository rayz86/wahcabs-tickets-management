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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <Sidebar selected={bookingType} />
        <div className="ml-80 flex justify-center items-center min-h-screen text-lg text-gray-400">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p>Loading ticket details...</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar selected={bookingType} />
      <div className="ml-80 p-8 min-h-screen relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">{bookingType} - Ticket Details</h1>
            <button
              onClick={() => navigate(`/dashboard/${bookingType}`)}
              className="btn-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {bookingType}
            </button>
          </div>

          {/* Ticket Info Card */}
          <div className="card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-xl">🎫</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Booking ID: {ticketId}</h2>
                  <p className="text-gray-400">Ticket Management</p>
                </div>
              </div>
              
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  status === "Active"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : status === "Processed"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : status === "Cancelled"
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                }`}
              >
                {status}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="text-sm text-gray-400 font-medium">Customer Name</label>
                <p className="text-white font-semibold">{ticket.custName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Customer Email</label>
                <p className="text-white font-semibold">{ticket.custEmail}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Phone</label>
                <p className="text-white font-semibold">{ticket.custPhone || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Vehicle</label>
                <p className="text-white font-semibold">{ticket.vehicle}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Amount Payable</label>
                <p className="text-green-400 font-bold text-lg">₹{ticket.amount}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Guests</label>
                <p className="text-white font-semibold">{ticket.passengers || "—"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">Date</label>
                <p className="text-white font-semibold">{ticket.date}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">From</label>
                <p className="text-white font-semibold">{ticket.fromLoc}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 font-medium">To</label>
                <p className="text-white font-semibold">{ticket.toLoc}</p>
              </div>
              
              {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.tripType && ticket.tripType !== "N/A" && (
                <div>
                  <label className="text-sm text-gray-400 font-medium">Trip Type</label>
                  <p className="text-white font-semibold">{ticket.tripType}</p>
                </div>
              )}
              
              {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.kmsSlab && (
                <div>
                  <label className="text-sm text-gray-400 font-medium">KMs Slab</label>
                  <p className="text-white font-semibold">{ticket.kmsSlab}</p>
                </div>
              )}
              
              {(bookingType === "Local Rides" || bookingType === "Outstation Rides") && ticket.rideType && (
                <div>
                  <label className="text-sm text-gray-400 font-medium">Ride Type</label>
                  <p className="text-white font-semibold">{ticket.rideType}</p>
                </div>
              )}
            </div>
          </div>

          {/* Management Section */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-blue-400">⚙️</span>
              Ticket Management
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Current Status</label>
                <select
                  className="input-modern w-full"
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
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Payment Received (₹)</label>
                <input
                  type="number"
                  className="input-modern w-full"
                  placeholder="Enter payment amount"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Actions Taken / Notes</label>
              <textarea
                className="input-modern w-full h-32 resize-none"
                placeholder="Enter any actions taken or notes about this ticket..."
                value={actions}
                onChange={(e) => setActions(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button onClick={handleSave} className="btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
