"use client";

import { useState, useEffect } from "react";
import { getWaterQuality } from "../utils/waterQuality";
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react";

export default function WaterQualityCard({ onInfo }) {
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch live data (returns a single object with latest values)
        const res = await fetch("/api/consentium?live=true"); 
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        // Helper to safely parse numbers and handle "—" or empty strings
        const parseValue = (val) => {
          if (val == null || val === "" || val === "—") return null;
          const num = parseFloat(val);
          return isNaN(num) ? null : num;
        };

        // Normalize data to match the keys expected by 'getWaterQuality'
        const normalized = {
          ec: parseValue(data.ec), 
          turbidity: parseValue(data.turbidity),
          tds: parseValue(data.tds), 
          do: parseValue(data.do),
          ph: parseValue(data.ph), // ✨ NEW: Added pH here
        };

        setReading(normalized);
        setError(null);
      } catch (err) {
        console.error("Error fetching live data:", err);
        setError("Unable to fetch live readings");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Loading State
  if (!reading && !error) {
    return (
      <div className="p-5 border rounded-xl shadow bg-blue-800 dark:bg-blue-500 animate-pulse">
        <p className="text-white font-medium">Loading live water analysis...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-5 border rounded-xl shadow bg-red-100 text-red-800 border-red-300">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 mr-2" />
          <span className="font-semibold">{error}</span>
        </div>
      </div>
    );
  }

  // Check if we have valid data (at least one sensor is not null)
  const noData = !reading || Object.values(reading).every((v) => v === null);

  let status = "nodata";
  let description = "No live readings available right now.";

  if (!noData) {
    // ✨ This now passes { do, ec, tds, turbidity, ph } to your updated utility
    const result = getWaterQuality(reading);
    status = result.status;
    description = result.description;
  }

  // Dynamic Styles based on Status
  const statusStyles = {
    good: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    moderate: "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    poor: "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
    nodata: "border-slate-700 bg-slate-800/50 text-slate-400",
  };

  const statusIcons = {
    good: CheckCircle,
    moderate: AlertTriangle,
    poor: XCircle,
    nodata: MinusCircle,
  };

  const Icon = statusIcons[status] || MinusCircle;

  return (
    <div className={`relative overflow-hidden p-6 border-2 rounded-2xl transition-all duration-500 backdrop-blur-md ${statusStyles[status]}`}>
      
      {/* ✨ Ambient Background Glow */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20 ${
        status === 'good' ? 'bg-emerald-500' : status === 'poor' ? 'bg-rose-500' : 'bg-amber-500'
      }`} />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Main Status Section */}
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Water Quality: {status === 'nodata' ? 'Offline' : status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            <p className="text-sm opacity-80 font-medium max-w-md">{description}</p>
            
            {/* ✨ Live Readings Badge Row */}
            {!noData && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  DO: {reading.do ?? '--'}
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  EC: {reading.ec ?? '--'}
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  TDS: {reading.tds ?? '--'}
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                  Turb: {reading.turbidity ?? '--'}
                </span>
                {/* ✨ New pH Badge */}
                <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  pH: {reading.ph ?? '--'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        {status !== "nodata" && (
          <button 
            onClick={onInfo} 
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm font-semibold shadow-lg hover:shadow-xl active:scale-95"
          >
            Detailed Analysis
          </button>
        )}
      </div>
    </div>
  );
}