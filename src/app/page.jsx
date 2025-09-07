"use client";

import { useEffect, useMemo, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import WaterQualityCard from "../components/WaterQualityCard";
import DataChart from "../components/DataChart";
import InfoModal from "../components/InfoModal";
import { parameters } from "../config/parameters";
import { generateReading, seedHistory } from "../utils/generateReading";
import ThemeToggle from "@/components/ThemeToggle";
import { getRecommendations } from "../utils/recommendations";



export default function WaterQualityDashboard() {
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  // Seed initial history on mount (client only)
  useEffect(() => {
    const initial = seedHistory(20);
    setHistory(initial);

    const interval = setInterval(() => {
      setHistory((prev) => {
        const next = generateReading(prev[prev.length - 1]);
        const updated = [...prev.slice(-19), next]; // keep last 20 points
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const latest = history[history.length - 1];
  const prev = history[history.length - 2];

  const getTrend = (key) => {
    if (!prev || latest?.[key] == null || prev?.[key] == null) return "flat";
    if (latest[key] > prev[key]) return "up";
    if (latest[key] < prev[key]) return "down";
    return "flat";
  };

  // Map parameter cards data
  const cards = useMemo(
    () =>
      parameters.map((p) => ({
        title: p.label,
        value:
          latest && latest[p.key] != null
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
      {/* Full-width container */}
      <div className="w-full space-y-8">
        {/* Header */}
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

        {/* Water Quality Summary */}
        <WaterQualityCard reading={latest} onInfo={() => setShowInfo(true)} />
        
        


        {/* Parameter KPI cards */}
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

        {/* Chart */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Real-time Trends
          </h2>
          <div className="w-full h-96">
            <DataChart data={history} />
          </div>
        </section>
        {/* Recommendations Section */}
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
        {/* Footer */}
        <footer className="text-sm text-gray-500 dark:text-gray-400">
          Last update: {latest?.time ?? "—"}
        </footer>
      </div>

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
    </main>
  );
}
