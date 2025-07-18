export default function TicketTable({ tickets, onSelect }) {
  return (
    <div className="overflow-x-auto bg-[#D9D9D9] rounded-xl shadow-md"
    style={{
      scrollbarWidth: "none", // Firefox
      msOverflowStyle: "none", // IE/Edge
  }}
    >
      <table className="min-w-full text-sm text-center">
        <thead className="bg-[#A7A7A7] text-white uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Booking ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className="cursor-pointer text-black transition hover:bg-gray-200 hover:scale-[1.01]"
            >
              <td className="px-4 py-2">{t.id}</td>
              <td className="px-4 py-2">{t.custName}</td>
              <td className="px-4 py-2">{t.vehicle}</td>
              <td className="px-4 py-2">₹{t.amount}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block px-3 py-[2px] rounded-full text-xs font-semibold text-white ${
                    t.status === "Active"
                      ? "bg-green-500"
                      : t.status === "Processed"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-600"
                  }`}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
