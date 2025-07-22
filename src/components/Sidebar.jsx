import { useNavigate } from "react-router-dom";

export const bookingTypes = [
  "Airport Transfers",
  "Local Rides",
  "Sightseeing",
  "Outstation Rides",
];

export default function Sidebar({ selected }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 min-h-screen bg-white/10 backdrop-blur-md text-white p-6 shadow-2xl border-r border-white/10">
      <h2 className="text-xl font-bold mb-8 text-yellow-400 tracking-wide">
        WahCabs Manager
      </h2>

      <nav className="space-y-3">
        {/* Home Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            !selected
              ? "bg-yellow-400 text-black font-semibold"
              : "hover:bg-white/10"
          }`}
        >
          🏠 <span>Home</span>
        </button>

        {/* Booking Type Buttons */}
        {bookingTypes.map((type) => (
          <button
            key={type}
            onClick={() => navigate(`/dashboard/${type}`)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
              selected === type
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:bg-white/10"
            }`}
          >
            {type}
          </button>
        ))}

        {/* All Tickets Button */}
        <button
          onClick={() => navigate("/all-tickets")}
          className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
            selected === "all"
              ? "bg-yellow-400 text-black font-semibold"
              : "hover:bg-white/10"
          }`}
        >
          🧾 All Tickets
        </button>
      </nav>
    </div>
  );
}
