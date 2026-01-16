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

export default function DataChart({ history = [] }) {
  // Check if there is any data to prevent rendering an empty chart
  const hasData = history && history.length > 0;

  return (
    <div className="p-5 border rounded-xl shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-3">Water Quality Trends</h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            
            {/* Define the left Y-axis */}
            <YAxis yAxisId="left" stroke="#82ca9d" />
            
            {/* Define the right Y-axis */}
            <YAxis yAxisId="right" orientation="right" stroke="#ffc658" />

            <Tooltip />
            <Legend />

            {/* Your API isn't sending pH yet, but this line is ready. */}
            {/* <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8884d8" name="pH" dot={false} /> */}
            <Line
              yAxisId="left" // Use left axis for low values like DO
              type="monotone"
              dataKey="do" // formerly "ph"
              stroke="#ff7300" // A new color
              name="DO (mg/L)" // formerly "pH"
              dot={false}
              strokeWidth={3}
            />
            
            <Line
              yAxisId="right" // Use the right axis for high values
              type="monotone"
              dataKey="ec"
              stroke="yellow"
              name="EC (μS/cm)"
              dot={false}
              strokeWidth={3}
            />
            <Line
              yAxisId="left" // Use the left axis for lower values
              type="monotone"
              dataKey="turbidity"
              stroke="#ffffff"
              name="Turbidity (NTU)"
              dot={false}
              strokeWidth={3}
            />
            <Line
              yAxisId="left" // Use the left axis for lower values
              type="monotone"
              dataKey="tds"
              stroke="red"
              name="TDS (ppm)"
              dot={false}
              strokeWidth={3}
            />
            
            {/* Your API isn't sending TDS yet, but this line is ready. */}
            {/* <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#ffc658" name="TDS (ppm)" dot={false} /> */}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <p>No historical data available to display.</p>
        </div>
      )}
    </div>
  );
}