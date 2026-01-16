"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DataChart({ history = [] }) {
  const hasData = history && history.length > 0;

  return (
    // ✨ FIX 1: Fixed height (h-[450px]) prevents overlapping with recommendations
    <div className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-800 rounded-3xl p-6 shadow-2xl h-[450px] transition-all duration-500 overflow-hidden">
      
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* ✨ FIX 2: Added gradients for ALL parameters */}
              <linearGradient id="colorDo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTurb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10}} 
            />
            
            {/* Left Axis for low-range values (DO, Turbidity) */}
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
            
            {/* Right Axis for high-range values (EC, TDS) */}
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />

            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />

            {/* ✨ FIX 3: Re-added all 4 parameters with correct Y-Axis IDs */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="do"
              stroke="#38bdf8"
              strokeWidth={3}
              fill="url(#colorDo)"
              name="DO"
              dot={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="ec"
              stroke="#fbbf24"
              strokeWidth={3}
              fill="url(#colorEc)"
              name="EC"
              dot={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#colorTds)"
              name="TDS"
              dot={false}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="turbidity"
              stroke="#f472b6"
              strokeWidth={2}
              fill="url(#colorTurb)"
              name="Turbidity"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500">
          <p>No historical data available.</p>
        </div>
      )}
    </div>
  );
}