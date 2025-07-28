export default function TicketTable({ tickets, onSelect, bookingType }) {
  const showRideType = bookingType === "Local Rides" || bookingType === "Outstation Rides";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'processed':
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'cancelled':
      case 'canceled':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
        <p className="text-gray-400">There are no bookings to display.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Customer
              </th>
              {showRideType && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                  Ride Type
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-green-400 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.map((ticket, index) => (
              <tr
                key={ticket.id}
                onClick={() => onSelect(ticket)}
                className="group cursor-pointer transition-all duration-300 hover:bg-white/5 hover:scale-[1.01] animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">
                      {formatDate(ticket.date)}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-white bg-white/10 px-3 py-1 rounded-lg inline-block">
                    {ticket.id}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                      {ticket.custName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {ticket.custName || 'Unknown'}
                    </span>
                  </div>
                </td>
                
                {showRideType && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {ticket.tripType || '—'}
                    </span>
                  </td>
                )}
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚗</span>
                    <span className="text-sm font-medium text-white">
                      {ticket.vehicle || 'Not specified'}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-bold text-green-400">
                    ₹{ticket.amount?.toLocaleString() || '0'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                    {ticket.status || 'Unknown'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span className="font-semibold text-white">
                      ₹{ticket.payment?.toLocaleString() || '0'}
                    </span>
                    <div className="text-xs text-gray-400">
                      {ticket.payment ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with pagination info */}
      <div className="bg-white/5 border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Showing {tickets.length} bookings</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Live data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
