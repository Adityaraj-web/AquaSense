export default function ParameterCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  description,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h2>
        {Icon && <Icon className="h-6 w-6 text-blue-500" />}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value} {unit}
        </span>
        <span
          className={`text-sm ${
            trend === "up"
              ? "text-green-500"
              : trend === "down"
              ? "text-red-500"
              : "text-gray-400"
          }`}
          title={`Trend: ${trend}`}
        >
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "▬"}
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {description}
      </p>
    </div>
  );
}
