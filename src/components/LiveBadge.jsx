"use client";
import { useEffect, useState } from "react";

export default function LiveBadge({ loading }) {
  // ✨ FIX: Start with null or an empty string to avoid server/client mismatch
  const [time, setTime] = useState(null);

  useEffect(() => {
    // Only set the time once the component is mounted in the browser
    setTime(new Date().toLocaleTimeString());

    if (!loading) {
      setTime(new Date().toLocaleTimeString());
    }
  }, [loading]);

  return (
    <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md transition-all duration-500">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-500 leading-none">
          Live System Active
        </span>
        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 leading-none mt-0.5 min-h-[9px]">
          {/* ✨ Only render the time if it exists (client-side only) */}
          {time ? `Last Sync: ${time}` : "Syncing..."}
        </span>
      </div>
    </div>
  );
}