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
          className={`text-white w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            !selected
              ? "bg-yellow-400 text-yellow-400 font-semibold"
              : "hover:bg-white"
          }`}
        >
          <span>Home</span>
        </button>

        {/* Booking Type Buttons */}
        {bookingTypes.map((type) => (
          <button
            key={type}
            onClick={() => navigate(`/dashboard/${type}`)}
            className={`text-white w-full text-left px-4 py-2 rounded-lg transition-all ${
              selected === type
                ? "bg-yellow-400 text-yellow-400 font-semibold"
                : "hover:bg-white"
            }`}
          >
            {type}
          </button>
        ))}
      </nav>
    </div>
  );
}
