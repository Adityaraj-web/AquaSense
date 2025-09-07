"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DataChart({ data = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ph" stroke="#2563eb" dot={false} name="pH" />
            <Line type="monotone" dataKey="ec" stroke="#10b981" dot={false} name="EC (μS/cm)" />
            <Line type="monotone" dataKey="tds" stroke="#f59e0b" dot={false} name="TDS (ppm)" />
            <Line type="monotone" dataKey="turbidity" stroke="#8b5cf6" dot={false} name="Turbidity (NTU)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
