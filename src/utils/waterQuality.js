export function getWaterQuality({ ph, ec, tds, turbidity } = {}) {
  if (ph == null || ec == null || tds == null || turbidity == null) {
    return { status: "moderate", description: "Awaiting sensor data..." };
  }

  // Good thresholds (WHO drinking water guidelines)
  const isGood =
    ph >= 6.5 &&
    ph <= 8.5 &&
    ec < 500 &&
    tds <= 500 && // ppm
    turbidity < 1;

  if (isGood) {
    return { status: "good", description: "Safe and suitable for drinking." };
  }

  // Moderate thresholds (usable for irrigation/utility)
  const isModerate =
    ph >= 6 &&
    ph <= 9 &&
    ec < 1500 &&
    tds <= 1000 &&
    turbidity < 5;

  if (isModerate) {
    return {
      status: "moderate",
      description: "Acceptable for irrigation or general use.",
    };
  }

  // Otherwise poor
  return {
    status: "poor",
    description: "Water quality is unsafe; treatment required.",
  };
}
