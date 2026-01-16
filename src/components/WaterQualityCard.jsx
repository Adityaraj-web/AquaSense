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
    good: "bg-green-200 text-green-800 border-green-300",
    moderate: "bg-yellow-200 text-yellow-800 border-yellow-300",
    poor: "bg-red-300 text-red-800 border-red-300",
    nodata: "bg-blue-500 text-gray-300 border-gray-300",
  };

  const statusIcons = {
    good: CheckCircle,
    moderate: AlertTriangle,
    poor: XCircle,
    nodata: MinusCircle,
  };

  const Icon = statusIcons[status] || MinusCircle;

  return (
    <div
      className={`p-5 border rounded-xl shadow flex items-center justify-between ${statusStyles[status]}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6" />
        <div>
          <h2 className="text-lg font-semibold">
            Water Quality: {status.charAt(0).toUpperCase() + status.slice(1)}
          </h2>
          <p className="text-sm">{description}</p>
          {!noData && (
            <div className="mt-2 text-xs grid grid-cols-2 gap-x-4">
              {/* ✨ FIX: This now correctly reads `reading.do` from state */}
              <p>DO: {reading?.do ?? "—"} mg/L</p>
              <p>EC: {reading?.ec ?? "—"} μS/cm</p>
              <p>Turbidity: {reading?.turbidity ?? "—"} NTU</p>
              <p>TDS: {reading?.tds ?? "—"} ppm</p>
            </div>
          )}
        </div>
      </div>
      {status !== "nodata" && (
        <button
          onClick={onInfo}
          className="ml-4 text-sm underline hover:opacity-80"
        >
          What does this mean?
        </button>
      )}
    </div>
  );
}