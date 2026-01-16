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
            <div key={index} className="flex items-center space-x-2 text-sm font-bold" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}: {entry.value}</span>
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
              <linearGradient id="colorDo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTurb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>
            </defs>

            {/* ✨ Grid lines now visible in both modes */}
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
            
            <YAxis 
              yAxisId="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'currentColor', fontSize: 10}}
              className="text-slate-400 dark:text-slate-500"
            />
            
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: 'currentColor', fontSize: 10}}
              className="text-slate-400 dark:text-slate-500"
            />

            <Tooltip content={<CustomTooltip />} />

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