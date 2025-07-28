export default function GSTInvoice({ ticket, ticketId, bookingType }) {
  return (
    <div id="invoice" className="p-8 bg-white w-[700px] text-black font-sans rounded shadow-lg">
      <p className="text-2xl font-bold text-center mb-6">WahCabs Invoice</p>
      <div className="flex justify-between mb-4">
        <span><strong>Booking ID:</strong> {ticketId}</span>
        <span><strong>Date:</strong> {ticket.date}</span>
      </div>
      <hr className="mb-4" />
      <p><strong>Booking Type:</strong> {bookingType}</p>
      <p><strong>Customer Name:</strong> {ticket.custName}</p>
      <p><strong>Email:</strong> {ticket.custEmail}</p>
      <p><strong>Vehicle:</strong> {ticket.vehicle}</p>
      <p><strong>Guests:</strong> {ticket.passengers || "—"}</p>
      <p><strong>From:</strong> {ticket.fromLoc}</p>
      <p><strong>To:</strong> {ticket.toLoc}</p>
      {["Local Rides", "Outstation Rides"].includes(bookingType) && (
        <p><strong>KMs Slab:</strong> {ticket.kmsSlab || "—"}</p>
      )}
      <p className="mt-4 text-lg font-bold">Total Amount: ₹{ticket.amount}</p>

      <div className="mt-8 text-sm text-gray-600 text-center">
        <p>Thank you for choosing WahCabs!</p>
        <p>For any queries regarding bookings please call on: +91 9209004192 / 9209004196 </p>
      </div>
    </div>
  );
}
