const StatCard = ({ label, value, icon: Icon, gradient, accentColor, trend }) => (
  <div
    className={`group relative rounded-2xl p-5 text-white overflow-hidden shadow-lg cursor-pointer
      transition-all duration-300 ease-out
      hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/20
      active:translate-y-0 active:shadow-md`}
    style={{ minWidth: 180, background: gradient }}
  >
    {/* Subtle animated shimmer on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)" }} />

    {/* Glowing circle behind icon */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-20 group-hover:opacity-30 transition-all duration-300 group-hover:scale-110"
      style={{ background: "rgba(255,255,255,0.4)" }} />

    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-1">{label}</p>
        <p className="text-3xl font-bold leading-none tracking-tight">{value}</p>
        {trend && (
          <p className="text-xs mt-2 opacity-80 font-medium">{trend}</p>
        )}
      </div>
      <div className="bg-white/20 group-hover:bg-white/30 transition-colors duration-300 rounded-xl p-2.5 backdrop-blur-sm">
        <Icon size={22} strokeWidth={1.8} className="opacity-95" />
      </div>
    </div>
  </div>
);

export default StatCard