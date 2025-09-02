import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { bookingTypes } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
              const { logout, user } = useAuth();


  const stats = [
    { label: "Total Bookings", value: "2,847", change: "+12.5%", icon: "📊", color: "from-emerald-500 to-teal-500" },
    { label: "Active Rides", value: "127", change: "+8.2%", icon: "🚗", color: "from-green-500 to-emerald-500" },
    { label: "Revenue Today", value: "₹45,678", change: "+15.3%", icon: "💰", color: "from-teal-500 to-cyan-500" },
    { label: "Customer Rating", value: "4.8", change: "+0.2", icon: "⭐", color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Sidebar selected={null} />
      
      <div className="ml-80 relative overflow-hidden min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  Welcome to WahCabs Admin
                </h1>
                <p className="text-gray-400 text-lg">
                  Manage your transportation business with ease
                </p>
              </div>

<button
  onClick={logout}
  className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
>
  Sign Out
</button>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Today</div>
                  <div className="text-lg font-semibold text-white">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg animate-glow">
                  <span className="text-xl">🚕</span>
                </div>
              </div>
            </div>
            
            {/* Decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group card card-hover p-6 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-green-400 text-sm font-medium">{stat.change}</div>
                  </div>
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
                <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full animate-pulse`} style={{ width: '70%' }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-12 animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-green-400">⚡</span>
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bookingTypes.map((type, index) => (
                <button
                  key={type.name}
                  onClick={() => navigate(`/dashboard/${type.name}`)}
                  className="group card card-hover p-6 text-left transition-all duration-300 hover:scale-105 animate-slideIn"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{type.name}</h3>
                  <p className="text-gray-400 text-sm">Manage {type.name.toLowerCase()} bookings and track performance</p>
                  <div className="mt-4 flex items-center text-green-400 text-sm font-medium">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-8 animate-fadeIn" style={{ animationDelay: '800ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-green-400">📈</span>
                Recent Activity
              </h2>
              <button 
                onClick={() => navigate('/all-tickets')}
                className="btn-primary text-sm"
              >
                View All Tickets
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { time: "2 minutes ago", action: "New Airport Transfer booking", user: "John Doe", status: "confirmed" },
                { time: "15 minutes ago", action: "Local Ride completed", user: "Sarah Wilson", status: "completed" },
                { time: "1 hour ago", action: "Sightseeing tour booked", user: "Mike Johnson", status: "pending" },
                { time: "2 hours ago", action: "Outstation ride canceled", user: "Emma Davis", status: "canceled" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'confirmed' ? 'bg-green-500' :
                    activity.status === 'completed' ? 'bg-blue-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.action}</div>
                    <div className="text-gray-400 text-sm">{activity.user} • {activity.time}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
