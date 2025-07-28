import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import AllTicketsTable from "../components/AllTicketsTable";
import { useNavigate } from "react-router-dom";
import ExportXlsx from "../components/ExportXlsx";

export const bookingTypes = [
  "Airport Transfers",
  "Local Rides", 
  "Sightseeing",
  "Outstation Rides",
];

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTickets = async () => {
      setLoading(true);
      let all = [];

      for (let type of bookingTypes) {
        try {
          const colRef = collection(db, "tickets", type, "bookings");
          const snap = await getDocs(colRef);
          const data = snap.docs.map((doc) => ({
            id: doc.id,
            bookingType: type,
            ...doc.data(),
          }));
          all.push(...data);
        } catch (error) {
          console.error(`Error fetching ${type} tickets:`, error);
        }
      }
      
      // Sort tickets by date robustly to prevent crashes from invalid data
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
      setLoading(false);
    };

    fetchAllTickets();
  }, []);

  const handleTicketClick = (ticket) => {
    navigate(`/dashboard/${ticket.bookingType}/${ticket.id}`);
  };

  const getBookingTypeStats = () => {
    const stats = {};
    bookingTypes.forEach(type => {
      stats[type] = tickets.filter(ticket => ticket.bookingType === type).length;
    });
    return stats;
  };

  const stats = getBookingTypeStats();
  const totalRevenue = tickets.reduce((sum, ticket) => sum + (parseInt(ticket.amount) || 0), 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar selected="all" />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-glow">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">All Tickets Overview</h1>
                  <p className="text-gray-400">Complete view of all bookings across all services</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <ExportXlsx 
                  tickets={tickets} 
                  fileName="All_Tickets_Export"
                  disabled={loading}
                />
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
            
            {/* Decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            {/* Total tickets card */}
            <div className="lg:col-span-2 card card-hover p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl">📋</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{tickets.length}</div>
                  <div className="text-blue-400 text-sm font-medium">Total Tickets</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">All booking types combined</div>
            </div>

            {/* Revenue card */}
            <div className="lg:col-span-2 card card-hover p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl">💰</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-green-400 text-sm font-medium">Total Revenue</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">Across all services</div>
            </div>

            {/* Status summary */}
            <div className="lg:col-span-2 card card-hover p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl">📈</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {Math.round((tickets.filter(t => t.status === 'confirmed' || t.status === 'Active').length / tickets.length) * 100) || 0}%
                  </div>
                  <div className="text-yellow-400 text-sm font-medium">Success Rate</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">Confirmed bookings</div>
            </div>
          </div>

          {/* Booking Type Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {bookingTypes.map((type, index) => (
              <div key={type} className="card p-4 animate-slideIn" style={{ animationDelay: `${300 + index * 100}ms` }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <span className="text-sm">
                      {type === 'Airport Transfers' ? '✈️' : 
                       type === 'Local Rides' ? '🚗' : 
                       type === 'Sightseeing' ? '🏛️' : '🛣️'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm font-medium">{type}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats[type] || 0}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {tickets.length > 0 ? Math.round((stats[type] / tickets.length) * 100) : 0}% of total
                </div>
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="card p-8 animate-fadeIn" style={{ animationDelay: '700ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-purple-400">📋</span>
                All Booking Details
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="text-sm">Live Data</span>
                </div>
                <div className="text-sm text-gray-400">
                  {tickets.length} total bookings
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading all tickets...</p>
                </div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
                <p className="text-gray-400">There are no bookings in the system yet.</p>
              </div>
            ) : (
              <AllTicketsTable 
                tickets={tickets} 
                onSelect={handleTicketClick} 
                showBookingType 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
