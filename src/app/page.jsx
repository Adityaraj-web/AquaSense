"use client";

import { useEffect, useMemo, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import WaterQualityCard from "../components/WaterQualityCard";
import DataChart from "../components/DataChart";
import InfoModal from "../components/InfoModal";
import { parameters } from "../config/parameters";
import ThemeToggle from "@/components/ThemeToggle";
import { getRecommendations } from "../utils/recommendations";

export default function WaterQualityDashboard() {
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // 1. Fetch the full history ONCE on initial page load
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/consentium"); // Gets the full history
        if (!res.ok) throw new Error("Failed to fetch historical data");
        const historicalData = await res.json();
        setHistory(historicalData);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    // 2. Fetch only the LATEST data point every 5 seconds to append to the chart
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/consentium?live=true"); // The new "live" endpoint
        if (!res.ok) throw new Error("Failed to fetch live data");
        const newPoint = await res.json();
        
        // Add the new point to the end of the history, keeping the array size limited
        if (newPoint && newPoint.time) {
          setHistory((prev) => {
            // Avoid adding duplicate points if the time is the same as the last one
            if (prev.length > 0 && prev[prev.length - 1].time === newPoint.time) {
              return prev;
            }
            return [...prev.slice(-49), newPoint]; // Keep the last 50 data points for performance
          });
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
      }
    };

    fetchHistory(); // Run history fetch immediately
    const interval = setInterval(fetchLatest, 5000); // Poll for live data every 5s

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const prev = history.length > 1 ? history[history.length - 2] : null;

  const getTrend = (key) => {
    if (!prev || !latest || latest?.[key] == null || prev?.[key] == null || latest?.[key] === "—" || prev?.[key] === "—") return "flat";
    if (Number(latest[key]) > Number(prev[key])) return "up";
    if (Number(latest[key]) < Number(prev[key])) return "down";
    return "flat";
  };

  const cards = useMemo(
    () =>
      parameters.map((p) => ({
        title: p.label,
        value:
          latest && latest[p.key] != null && latest[p.key] !== "—"
            ? Number(latest[p.key]).toFixed(p.precision ?? 2)
            : "—",
        unit: p.unit,
        icon: p.icon,
        trend: getTrend(p.key),
        description: p.description,
      })),
    [latest, prev]
  );

  return (
    <main className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full space-y-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              💧 AquaSense
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time water quality monitoring & insights
            </p>
          </div>
          <ThemeToggle />
        </header>

        <WaterQualityCard reading={latest} onInfo={() => setShowInfo(true)} />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <ParameterCard
              key={c.title}
              title={c.title}
              value={c.value}
              unit={c.unit}
              icon={c.icon}
              trend={c.trend}
              description={c.description}
            />
          ))}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Real-time Trends
          </h2>
          <div className="w-full h-96">
            <DataChart history={history} />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            Smart Recommendations
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            {getRecommendations(latest).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        <footer className="text-sm text-gray-500 dark:text-gray-400">
          Last update: {latest?.time ?? "—"}
        </footer>
      </div>

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
    </main>
  );
}