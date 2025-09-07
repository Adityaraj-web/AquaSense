import { Droplets, Activity, Beaker, Waves } from "lucide-react";

export const parameters = [
  {
    key: "ph",
    label: "pH",
    unit: "",
    icon: Droplets,
    precision: 2,
    description: "Acidity/alkalinity of water (6.5–8.5 ideal).",
  },
  {
    key: "ec",
    label: "EC",
    unit: "μS/cm",
    icon: Activity,
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
    description: "Water clarity—lower is better (<1 NTU ideal).",
  },
];
