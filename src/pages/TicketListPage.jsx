import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import Sidebar, { bookingTypes } from "../components/Sidebar";
import TicketTable from "../components/TicketTable";

export default function TicketListPage() {
  const { bookingType } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentType = bookingTypes.find(type => type.name === bookingType);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "tickets", bookingType, "bookings");
        const snap = await getDocs(colRef);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (bookingType) {
      fetchTickets();
    }
  }, [bookingType]);

  if (!currentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <Sidebar selected={bookingType} />
        <div className="ml-80 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-white mb-2">Booking Type Not Found</h1>
            <p className="text-gray-400 mb-6">The requested booking type doesn't exist.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar selected={bookingType} />
      
      <div className="ml-80 relative overflow-hidden min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentType.color} flex items-center justify-center shadow-lg shadow-glow`}>
                  <span className="text-2xl">{currentType.icon}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{bookingType}</h1>
                  <p className="text-gray-400">Manage and track all {bookingType.toLowerCase()} bookings</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Bookings</div>
                  <div className="text-2xl font-bold text-green-400">{tickets.length}</div>
                </div>
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
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <span className="text-gray-400 text-sm">Total</span>
              </div>
              <div className="text-2xl font-bold text-white">{tickets.length}</div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <span className="text-sm">✅</span>
                </div>
                <span className="text-gray-400 text-sm">Confirmed</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {tickets.filter(t => t.status === 'confirmed').length}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-sm">⏳</span>
                </div>
                <span className="text-gray-400 text-sm">Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {tickets.filter(t => t.status === 'pending').length}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-sm">💰</span>
                </div>
                <span className="text-gray-400 text-sm">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                ₹{tickets.reduce((sum, t) => sum + (parseInt(t.amount) || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="card p-8 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="text-green-400">📊</span>
                Booking Details
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Live Data</span>
                </div>
                <button className="btn-secondary text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading tickets...</p>
                </div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
                <p className="text-gray-400">There are no {bookingType.toLowerCase()} bookings yet.</p>
              </div>
            ) : (
              <TicketTable
                tickets={tickets}
                onSelect={(ticket) => navigate(`/dashboard/${bookingType}/${ticket.id}`)}
                bookingType={bookingType}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
