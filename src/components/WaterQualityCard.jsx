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
        // ✨ FIX 1: Add ?live=true so the API returns the latest object, not an array
        const res = await fetch("/api/consentium?live=true"); 
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        const parseValue = (val) => {
          // ✨ FIX 2: Handle the dash "—" specifically so it doesn't cause NaN
          if (val == null || val === "" || val === "—") return null;
          const num = parseFloat(val);
          return isNaN(num) ? null : num;
        };

        const normalized = {
          // ✨ FIX 3: Match the keys exactly to what route.js sends (ec and tds)
          ec: parseValue(data.ec), 
          turbidity: parseValue(data.turbidity),
          tds: parseValue(data.tds), 
          do: parseValue(data.do),
        };

        setReading(normalized);
        setError(null);
      } catch (err) {
        console.error("Error fetching live data:", err);
        setError("Unable to fetch live readings");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ... no changes to the loading/error states ...

  if (!reading && !error) {
    return (
      <div className="p-5 border rounded-xl shadow bg-blue-800 dark:bg-blue-500">
        <p>Loading live water data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border rounded-xl shadow bg-red-100 text-red-800 border-red-300">
        <XCircle className="h-6 w-6 inline mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  const noData = !reading || Object.values(reading).every((v) => v === null);

  let status = "nodata";
  let description = "No live readings available right now.";

  if (!noData) {
    const result = getWaterQuality(reading);
    status = result.status;
    description = result.description;
  }

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
    {/* ✨ Subtle Background Glow */}
    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20 ${
      status === 'good' ? 'bg-emerald-500' : status === 'poor' ? 'bg-rose-500' : 'bg-amber-500'
    }`} />

    <div className="relative flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Water Quality: {status.charAt(0).toUpperCase() + status.slice(1)}
          </h2>
          <p className="text-sm opacity-80 font-medium">{description}</p>
          
          {!noData && (
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider">
              <span className="px-2 py-1 rounded bg-white/5">DO: {reading.do}</span>
              <span className="px-2 py-1 rounded bg-white/5">EC: {reading.ec}</span>
              <span className="px-2 py-1 rounded bg-white/5">TDS: {reading.tds}</span>
              <span className="px-2 py-1 rounded bg-white/5">Turb: {reading.turbidity}</span>
            </div>
          )}
        </div>
      </div>
      
      {status !== "nodata" && (
        <button onClick={onInfo} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
          Detailed Analysis
        </button>
      )}
    </div>
  </div>
);
}