import { useNavigate, useLocation } from "react-router-dom";

export const bookingTypes = [
  { name: "Airport Transfers", icon: "✈️", color: "from-emerald-500 to-teal-500" },
  { name: "Local Rides", icon: "🚗", color: "from-green-500 to-emerald-500" },
  { name: "Sightseeing", icon: "🏛️", color: "from-teal-500 to-cyan-500" },
  { name: "Outstation Rides", icon: "🛣️", color: "from-lime-500 to-green-500" },
];

export default function Sidebar({ selected }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  const isTypeActive = (type) => selected === type;

  return (
    <div className="w-80 min-h-screen relative">
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-black/40 backdrop-blur-xl border-r border-white/10"></div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <span className="text-white font-bold text-lg">🚕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WahCabs</h1>
              <p className="text-sm text-gray-400 font-medium">Admin Panel</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {/* Dashboard/Home Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className={`group w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/dashboard")
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 transform scale-[1.02]"
                : "text-gray-300 hover:text-white hover:bg-white/5 hover:transform hover:scale-[1.01]"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isActive("/dashboard") 
                ? "bg-white/20 shadow-lg" 
                : "bg-white/5 group-hover:bg-white/10"
            }`}>
              <span className="text-xl">🏠</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">Dashboard</div>
              <div className={`text-xs ${isActive("/dashboard") ? "text-green-100" : "text-gray-500 group-hover:text-gray-400"}`}>
                Overview & Analytics
              </div>
            </div>
            {isActive("/dashboard") && (
              <div className="w-1 h-8 bg-white/30 rounded-full"></div>
            )}
          </button>

          {/* Divider */}
          <div className="my-6">
            <div className="flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
              <span className="text-xs text-gray-500 font-medium">BOOKING TYPES</span>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
            </div>
          </div>

          {/* Booking Type Buttons */}
          {bookingTypes.map((type, index) => (
            <button
              key={type.name}
              onClick={() => navigate(`/dashboard/${type.name}`)}
              className={`group w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 animate-slideIn ${
                isTypeActive(type.name)
                  ? `bg-gradient-to-r ${type.color} text-white shadow-lg shadow-green-500/20 transform scale-[1.02]`
                  : "text-gray-300 hover:text-white hover:bg-white/5 hover:transform hover:scale-[1.01]"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isTypeActive(type.name) 
                  ? "bg-white/20 shadow-lg" 
                  : "bg-white/5 group-hover:bg-white/10"
              }`}>
                <span className="text-lg">{type.icon}</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{type.name}</div>
                <div className={`text-xs ${isTypeActive(type.name) ? "text-white/70" : "text-gray-500 group-hover:text-gray-400"}`}>
                  Manage bookings
                </div>
              </div>
              {isTypeActive(type.name) && (
                <div className="w-1 h-8 bg-white/30 rounded-full"></div>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* All Tickets Button */}
          <button
            onClick={() => navigate("/all-tickets")}
            className={`group w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/all-tickets")
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 transform scale-[1.02]"
                : "text-gray-300 hover:text-white hover:bg-white/5 hover:transform hover:scale-[1.01]"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isActive("/all-tickets") 
                ? "bg-white/20 shadow-lg" 
                : "bg-white/5 group-hover:bg-white/10"
            }`}>
              <span className="text-xl">📊</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">All Tickets</div>
              <div className={`text-xs ${isActive("/all-tickets") ? "text-purple-100" : "text-gray-500 group-hover:text-gray-400"}`}>
                Complete overview
              </div>
            </div>
            {isActive("/all-tickets") && (
              <div className="w-1 h-8 bg-white/30 rounded-full"></div>
            )}
          </button>
        </nav>

        {/* Bottom section with stats or additional info */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-sm">💡</span>
              </div>
              <div>
                <div className="text-sm font-medium text-green-400">Pro Tip</div>
                <div className="text-xs text-gray-400">Use keyboard shortcuts for faster navigation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
