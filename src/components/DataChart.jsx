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

  // Custom Tooltip to match the glassmorphism theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 p-4 rounded-2xl shadow-xl">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm font-bold" style={{ color: entry.stroke }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
              <span className="capitalize">{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl h-[450px] transition-all duration-500 overflow-hidden">
      
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* DO: Sky Blue */}
              <linearGradient id="colorDo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              
              {/* EC: Amber */}
              <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              
              {/* TDS: Indigo */}
              <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              
              {/* Turbidity: Pink */}
              <linearGradient id="colorTurb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>

              {/* ✨ NEW: pH Gradient (Purple) */}
              <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="currentColor" 
              className="text-slate-200 dark:text-white/5"
            />
            
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'currentColor', fontSize: 10}}
              className="text-slate-400 dark:text-slate-500" 
            />
            
            {/* Left Axis: Small Values (pH, DO, Turbidity) */}
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'currentColor', fontSize: 10}}
              className="text-slate-400 dark:text-slate-500"
              domain={[0, 'auto']} 
            />
            
            {/* Right Axis: Large Values (EC, TDS) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'currentColor', fontSize: 10}}
              className="text-slate-400 dark:text-slate-500"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* 1. Dissolved Oxygen (Left Axis) */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="do"
              stroke="#0ea5e9"
              strokeWidth={3}
              fill="url(#colorDo)"
              name="DO"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* 2. pH (Left Axis) - ✨ Added */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              stroke="#a855f7" 
              strokeWidth={3}
              fill="url(#colorPh)"
              name="pH"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* 3. Turbidity (Left Axis) */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="turbidity"
              stroke="#ec4899"
              strokeWidth={2}
              fill="url(#colorTurb)"
              name="Turbidity"
              dot={false}
            />

            {/* 4. EC (Right Axis) */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="ec"
              stroke="#f59e0b"
              strokeWidth={3}
              fill="url(#colorEc)"
              name="EC"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* 5. TDS (Right Axis) */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="tds"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorTds)"
              name="TDS"
              dot={false}
            />

          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Loading history...</p>
        </div>
      )}
    </div>
  );
}