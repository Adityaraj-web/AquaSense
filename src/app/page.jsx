"use client";

import { useEffect, useMemo, useState } from "react";
import ParameterCard from "../components/ParameterCard";
import WaterQualityCard from "../components/WaterQualityCard";
import DataChart from "../components/DataChart";
import InfoModal from "../components/InfoModal";
import LiveBadge from "../components/LiveBadge"; 
import { parameters } from "../config/parameters";
import ThemeToggle from "@/components/ThemeToggle";

export default function WaterQualityDashboard() {
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✨ AI States
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // 1. Initial History Fetch
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/consentium");
        if (!res.ok) throw new Error("Failed to fetch historical data");
        const historicalData = await res.json();
        setHistory(historicalData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching history:", err);
        setIsLoading(false);
      }
    };

    // 2. Continuous Polling for Live Data
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/consentium?live=true");
        if (!res.ok) throw new Error("Failed to fetch live data");
        const newPoint = await res.json();
        
        if (newPoint && newPoint.time) {
          setHistory((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].time === newPoint.time) {
              return prev;
            }
            return [...prev.slice(-49), newPoint];
          });
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchLatest, 5000);
    return () => clearInterval(interval);
  }, []);

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const prev = history.length > 1 ? history[history.length - 2] : null;

  // ✨ AI Fetching Logic: Runs whenever 'latest' data changes
  useEffect(() => {
    const getAIInsights = async () => {
      if (!latest || isAiLoading) return;

      setIsAiLoading(true);
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reading: latest }),
        });
        
        if (!res.ok) throw new Error("AI Route failed");
        const data = await res.json();
        setAiRecommendations(data);
      } catch (err) {
        console.error("AI Insight Error:", err);
        // Fallback if AI fails
        setAiRecommendations(["Check sensor alignment", "Manual sampling recommended"]);
      } finally {
        setIsAiLoading(false);
      }
    };

    // Small delay to ensure state has settled
    const timeout = setTimeout(getAIInsights, 1500);
    return () => clearTimeout(timeout);
  }, [latest?.time]); 

  const getTrend = (key) => {
    if (!prev || !latest || latest?.[key] == null || prev?.[key] == null) return "flat";
    const cur = Number(latest[key]);
    const old = Number(prev[key]);
    if (cur > old) return "up";
    if (cur < old) return "down";
    return "flat";
  };

  const cards = useMemo(
    () =>
      parameters.map((p) => ({
        title: p.label,
        value: latest && latest[p.key] != null && latest[p.key] !== "—"
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
    <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Aqua<span className="text-blue-500">Sense</span>
              </h1>
              <LiveBadge loading={isLoading} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Intelligence for sustainable water management
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* SUMMARY CARD */}
        <WaterQualityCard reading={latest} onInfo={() => setShowInfo(true)} />

        {/* PARAMETERS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <ParameterCard key={c.title} {...c} />
          ))}
        </section>

        {/* CHART SECTION */}
        <section className="space-y-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Environmental Trends</h2>
            <span className="text-sm text-slate-500 font-mono">/ Live Data Stream</span>
          </div>
          <DataChart history={history} />
        </section>

        {/* AI RECOMMENDATIONS */}
        <section className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isAiLoading ? 'bg-blue-500/20 animate-pulse' : 'bg-blue-500/10'}`}>
                <span className="text-xl">✨</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Smart Analysis
              </h2>
            </div>
            {isAiLoading && (
              <span className="text-xs font-mono text-blue-500 animate-pulse bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/20">
                AI is analyzing data...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((r, i) => (
                <div key={i} className="group flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all shadow-sm">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                    {r}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center">
                 <p className="text-slate-400 text-sm italic animate-pulse">
                  {isLoading ? "Connecting to sensor network..." : "Awaiting data to generate insights..."}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-white/5 text-xs font-medium text-slate-400">
          <span>&copy; 2026 AquaSense IoT</span>
          <span className="font-mono">Reference: {latest?.time ?? "Establishing Connection..."}</span>
        </footer>
      </div>

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
    </main>
  );
}