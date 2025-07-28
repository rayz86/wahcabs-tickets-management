export default function AllTicketsTable({ tickets, onSelect, showBookingType = false }) {
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

  const getBookingTypeColor = (bookingType) => {
    switch (bookingType) {
      case 'Airport Transfers':
        return 'from-emerald-500 to-teal-500';
      case 'Local Rides':
        return 'from-green-500 to-emerald-500';
      case 'Sightseeing':
        return 'from-teal-500 to-cyan-500';
      case 'Outstation Rides':
        return 'from-lime-500 to-green-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBookingTypeIcon = (bookingType) => {
    switch (bookingType) {
      case 'Airport Transfers': return '✈️';
      case 'Local Rides': return '🚗';
      case 'Sightseeing': return '🏛️';
      case 'Outstation Rides': return '🛣️';
      default: return '🚕';
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
            <tr className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Date
              </th>
              {showBookingType && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  Booking Type
                </th>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-purple-400 uppercase tracking-wider">
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
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">
                      {formatDate(ticket.date)}
                    </span>
                  </div>
                </td>
                
                {showBookingType && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getBookingTypeColor(ticket.bookingType)} flex items-center justify-center`}>
                        <span className="text-sm">{getBookingTypeIcon(ticket.bookingType)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{ticket.bookingType}</div>
                        {ticket.tripType && (
                          <div className="text-xs text-gray-400">{ticket.tripType}</div>
                        )}
                      </div>
                    </div>
                  </td>
                )}
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-white bg-white/10 px-3 py-1 rounded-lg inline-block">
                    {ticket.id}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {ticket.custName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {ticket.custName || 'Unknown'}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚗</span>
                    <span className="text-sm font-medium text-white">
                      {ticket.vehicle || 'Not specified'}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="max-w-xs">
                    <div className="text-sm text-white font-medium truncate">
                      {ticket.fromLoc || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>→</span>
                      <span className="truncate">{ticket.toLoc || 'N/A'}</span>
                    </div>
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
          <span>Showing {tickets.length} total bookings</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>All services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
