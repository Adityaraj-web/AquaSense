import { Beaker, Waves, Wind, Zap, Activity } from "lucide-react";

export const parameters = [
  {
    key: "do",
    label: "DO",
    unit: "mg/L",
    icon: Wind,
    precision: 2,
    description: "The amount of gaseous oxygen dissolved in water.",
  },
  {
    key: "ec",
    label: "EC",
    unit: "μS/cm",
    icon: Zap,
    precision: 0,
    description: "Electrical conductivity—proxy for dissolved salts.",
  },
  {
    key: "tds",
    label: "TDS",
    unit: "ppm",
    icon: Beaker,
    precision: 0,
    description: "Total dissolved solids (minerals, salts, organic matter).",
  },
  {
    key: "turbidity",
    label: "Turbidity",
    unit: "NTU",
    icon: Waves,
    precision: 2,
    description: "Water clarity—lower is better (<5 NTU ideal).",
  },
  {
    key: "ph",
    label: "pH",
    unit: "pH",
    icon: Activity,
    precision: 1,
    description: "Scale of acidity/alkalinity (0-14). 7 is neutral.",
  },
];
