import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function TicketDetailModal({ ticket, bookingType, onBack }) {
  const [status, setStatus] = useState(ticket.status);
  const [actions, setActions] = useState(ticket.actions || "");

  const handleSave = async () => {
    const ref = doc(db, "tickets", bookingType, "bookings", ticket.id);
    await updateDoc(ref, { status, actions });
    alert("✅ Ticket updated!");
    onBack(); // go back to table
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md text-sm text-black">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 underline hover:text-blue-800"
      >
        ← Back to tickets
      </button>

      <div className="bg-[#d9d9d9] p-4 rounded-md mb-4 flex justify-between items-center">
        <span className="font-semibold">Booking ID: {ticket.id}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs text-white ${
            status === "Active"
              ? "bg-green-500"
              : status === "Processed"
              ? "bg-yellow-500 text-black"
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
        <p><strong>Guests:</strong> {ticket.guests || "—"}</p>
        <p><strong>Date:</strong> {ticket.date}</p>
        <p><strong>From:</strong> {ticket.fromLoc}</p>
        <p><strong>To:</strong> {ticket.toLoc}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label className="block font-medium mb-1">Set Current Status:</label>
          <select
            className="w-full border rounded p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option disabled>select status</option>
            <option value="Active">Active</option>
            <option value="Processed">Processed</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
      </div>

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
  );
}
