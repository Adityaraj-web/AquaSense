"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
  const [aiAnalysis, setAiAnalysis] = useState(""); 
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // ✨ REF: To track when we last called the AI
  const lastAiCallTime = useRef(0); 

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
    const interval = setInterval(fetchLatest, 5000); // Poll sensors every 5s
    return () => clearInterval(interval);
  }, []);

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const prev = history.length > 1 ? history[history.length - 2] : null;

  // ✨ OPTIMIZED AI LOGIC
  useEffect(() => {
    const getAIInsights = async () => {
      const now = Date.now();
      
      // 1. TIME GATE: Block if 4 minutes haven't passed
      // This makes the effect "cheap" to run every 5 seconds.
      if (now - lastAiCallTime.current < 240000) return; 

      // 2. DATA CHECK
      if (history.length === 0 || isAiLoading) return;

      setIsAiLoading(true);
      lastAiCallTime.current = now; // 🔒 Lock the gate immediately

      try {
        console.log("🤖 Asking AI for future prediction...");
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Now this ALWAYS sends the latest history
          body: JSON.stringify({ history: history }), 
        });
        
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const data = await res.json();
        
        if (data.analysis) {
            setAiAnalysis(data.analysis);
        }

      } catch (err) {
        console.error("AI Insight Error:", err);
      } finally {
        setIsAiLoading(false);
      }
    };

    // Trigger whenever history updates
    getAIInsights();
    
    // No setInterval needed! The [history] dependency acts as the "clock".
  }, [history]); 

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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isAiLoading ? 'bg-indigo-500/20 animate-pulse' : 'bg-indigo-500/10'}`}>
                <span className="text-xl">✨</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Futuristic Forecast & Impact Analysis
              </h2>
            </div>
            {isAiLoading && (
              <span className="text-xs font-mono text-indigo-500 animate-pulse bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/20">
                Generating Prediction...
              </span>
            )}
          </div>

          <div className="relative min-h-[100px]">
            {aiAnalysis ? (
                <div className="prose dark:prose-invert max-w-none">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 shadow-sm">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                            {aiAnalysis}
                        </p>
                    </div>
                </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 animate-ping" />
                 <p className="text-slate-400 text-sm italic">
                  {isLoading ? "Acquiring sensor data..." : "Waiting for sufficient history to generate future prediction..."}
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