"use client";

import { useState, useEffect } from "react";
import { getWaterQuality } from "../utils/waterQuality";
import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react";

export default function WaterQualityCard({ onInfo }) {
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);

  // Fetch live data from our Next.js API route
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/consentium");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        // 🔥 Normalize field names so frontend + API always align
        const normalized = {
          ph: data.ph ?? data.pH ?? null,
          ec: data.ec ?? data.conductivity ?? null,
          turbidity: data.turbidity ?? data.turb ?? null,
          tds: data.tds ?? data.temperature ?? null,
        };

        setReading(normalized);
        setError(null);
        console.log("Normalized sensor data:", normalized); // debug
      } catch (err) {
        console.error("Error fetching live data:", err);
        setError("Unable to fetch live readings");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // If still loading
  if (!reading && !error) {
    return (
      <div className="p-5 border rounded-xl shadow bg-gray-100 dark:bg-gray-700">
        <p>Loading live water data...</p>
      </div>
    );
  }

  // If there was an error
  if (error) {
    return (
      <div className="p-5 border rounded-xl shadow bg-red-100 text-red-800 border-red-300">
        <XCircle className="h-6 w-6 inline mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  // Detect "No Data"
  const noData =
    !reading ||
    Object.values(reading).every((v) => v == null || v === "—");

  let status = "nodata";
  let description = "No live readings available right now.";

  if (!noData) {
    const result = getWaterQuality(reading);
    status = result.status;
    description = result.description;
  }

  const statusStyles = {
    good: "bg-green-100 text-green-800 border-green-300",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    poor: "bg-red-100 text-red-800 border-red-300",
    nodata: "bg-gray-100 text-gray-800 border-gray-300",
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
            Water Quality: {status === "nodata" ? "No Data" : status}
          </h2>
          <p className="text-sm">{description}</p>

          {/* Only show sensor values if real data is available */}
          {!noData && (
            <div className="mt-2 text-xs">
              <p>DO: {reading?.do ?? "—"} mg/L</p>
              <p>EC: {reading?.ec ?? "—"} μS/cm</p>
              <p>Turbidity: {reading?.turbidity ?? "—"} NTU</p>
              <p>TDS: {reading?.tds ?? "—"} ppm</p>
            </div>
          )}
        </div>
      </div>

      {/* Hide "What does this mean?" when no data */}
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
