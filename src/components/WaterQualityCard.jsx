import { getWaterQuality } from "../utils/waterQuality";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function WaterQualityCard({ reading, onInfo }) {
  const { status, description } = getWaterQuality(reading || {});

  const statusStyles = {
    good: "bg-green-100 text-green-800 border-green-300",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    poor: "bg-red-100 text-red-800 border-red-300",
  };

  const statusIcons = {
    good: CheckCircle,
    moderate: AlertTriangle,
    poor: XCircle,
  };

  const Icon = statusIcons[status] || AlertTriangle;

  return (
    <div
      className={`p-5 border rounded-xl shadow flex items-center justify-between ${statusStyles[status]}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6" />
        <div>
          <h2 className="text-lg font-semibold">Water Quality: {status}</h2>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      <button
        onClick={onInfo}
        className="ml-4 text-sm underline hover:opacity-80"
      >
        What does this mean?
      </button>
    </div>
  );
}
