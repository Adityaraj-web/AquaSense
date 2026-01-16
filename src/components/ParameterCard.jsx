export default function ParameterCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  description,
}) {
  // Define colors based on the title to give each card personality
  const getColors = (t) => {
    const titleLower = t.toLowerCase();
    if (titleLower.includes("do")) return "text-cyan-400 border-cyan-500/30 bg-cyan-500/5";
    if (titleLower.includes("ec")) return "text-blue-400 border-blue-500/30 bg-blue-500/5";
    if (titleLower.includes("tds")) return "text-indigo-400 border-indigo-500/30 bg-indigo-500/5";
    return "text-sky-400 border-sky-500/30 bg-sky-500/5";
  };

  const accentClasses = getColors(title);

  return (
    <div className="group relative overflow-hidden bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 shadow-2xl">
      
      {/* ✨ Ambient Background Glow on Hover */}
      <div className={`absolute -right-12 -bottom-12 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${accentClasses.split(' ')[2].replace('bg-', 'bg-')}`} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 max-w-[180px]">
            {description}
          </p>
        </div>
        
        {/* ✨ Glassified Icon Container */}
        <div className={`p-3 rounded-2xl border ${accentClasses}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
            <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          </span>
        </div>

        {/* ✨ Styled Trend Indicator */}
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-500"
              : trend === "down"
              ? "bg-rose-500/10 text-rose-500"
              : "bg-slate-500/10 text-slate-400"
          }`}
        >
          <span>{trend === "up" ? "▲" : trend === "down" ? "▼" : "▬"}</span>
          <span className="uppercase">{trend || "stable"}</span>
        </div>
      </div>
      
      {/* ✨ Decorative line that animates on hover */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-700 opacity-50" />
    </div>
  );
}