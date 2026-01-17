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
    
    // Existing Colors
    if (titleLower.includes("do")) return "text-cyan-400 border-cyan-500/30 bg-cyan-500/5";
    if (titleLower.includes("ec")) return "text-blue-400 border-blue-500/30 bg-blue-500/5";
    if (titleLower.includes("tds")) return "text-indigo-400 border-indigo-500/30 bg-indigo-500/5";
    if (titleLower.includes("turbidity")) return "text-sky-400 border-sky-500/30 bg-sky-500/5";
    
    // NEW: pH Color (Purple)
    if (titleLower.includes("ph")) return "text-purple-400 border-purple-500/30 bg-purple-500/5";

    // Fallback
    return "text-slate-400 border-slate-500/30 bg-slate-500/5";
  };

  const accentClasses = getColors(title);

  return (
    // Added 'h-full' to ensure all cards stretch to the same height in the grid
    <div className="h-full group relative overflow-hidden bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 shadow-sm dark:shadow-none flex flex-col justify-between">
      
      {/* ✨ Light mode specific accent: A soft side-border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity ${accentClasses.split(' ')[0].replace('text-', 'bg-')}`} />

      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            {title}
          </h2>
          {/* min-h-[2.5rem] ensures description area is consistent even if text is short */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-[180px] min-h-[2.5rem]">
            {description}
          </p>
        </div>
        
        {/* Icon container */}
        <div className={`p-3 rounded-2xl border shadow-sm ${accentClasses}`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}
            <span className="ml-1 text-sm font-bold text-slate-400">
              {unit}
            </span>
          </span>
        </div>

        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold ${
          trend === "up" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
          : trend === "down" ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500"
          : "bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400"
        }`}>
          <span>{trend === "up" ? "▲" : trend === "down" ? "▼" : "▬"}</span>
          <span className="uppercase">{trend || "stable"}</span>
        </div>
      </div>
    </div>
  );
}