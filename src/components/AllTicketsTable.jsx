export default function AllTicketsTable({ tickets, onSelect, bookingType }) {
  const showRideType = bookingType === "Local Rides" || bookingType === "Outstation Rides";

  return (
    <div
      className="overflow-x-auto bg-[#D9D9D9] rounded-xl shadow-md"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      <table className="min-w-full text-sm text-center">
        <thead className="bg-[#A7A7A7] text-white uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Booking Type</th>
            <th className="px-4 py-3">Booking ID</th>
            <th className="px-4 py-3">Customer</th>
            {showRideType && <th className="px-4 py-3">Ride Type</th>}
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">To</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Payment</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className="cursor-pointer text-black transition hover:bg-gray-200 hover:scale-[1.01]"
            >
              <td classname="px-4 py-2">{t.date}</td>
              <td classname="px-4 py-2">{t.bookingType || bookingType}-{t.tripType}</td>
              <td className="px-4 py-2">{t.id}</td>
              <td className="px-4 py-2">{t.custName}</td>
              {showRideType && <td className="px-4 py-2">{t.tripType || "—"}</td>}
              <td className="px-4 py-2">{t.vehicle}</td>
              <td className="px-4 py-2">{t.fromLoc}</td>
              <td className="px-4 py-2">{t.toLoc}</td>
              <td className="px-4 py-2">₹{t.amount}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block px-3 py-[2px] rounded-full text-xs font-semibold text-white ${
                    t.status === "Active"
                      ? "bg-green-500"
                      : t.status === "Processed"
                      ? "bg-yellow-500 text-black"
                      : t.status === "Cancelled"
                      ? "bg-red-600"
                      : "bg-gray-600"
                  }`}
                >
                  {t.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <span className="text-xs font-semibold">
                  ₹{t.payment || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
