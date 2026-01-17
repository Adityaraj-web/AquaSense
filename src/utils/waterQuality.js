export function getWaterQuality({ do: dissolvedOxygen, ec, tds, turbidity, ph } = {}) {
  // 1. Added 'ph' to the check. If any sensor is missing, we wait.
  if (dissolvedOxygen == null || ec == null || tds == null || turbidity == null || ph == null) {
    return {
      status: "moderate",
      description: "Awaiting complete sensor data...",
    };
  }

  // 2. Updated "Good" Criteria (Safe for Drinking)
  // Standard pH range for drinking water is often 6.5 - 8.5
  const isGood =
    dissolvedOxygen >= 6 &&
    ec < 500 &&
    tds <= 500 &&
    turbidity < 1 &&
    (ph >= 6.5 && ph <= 8.5);

  if (isGood) {
    return { status: "good", description: "Safe and suitable for drinking." };
  }

  // 3. Updated "Moderate" Criteria (Irrigation / General Use)
  // Slightly wider pH range allowed (e.g., 6.0 - 9.0)
  const isModerate =
    dissolvedOxygen >= 4 &&
    ec < 1500 &&
    tds <= 1000 &&
    turbidity < 5 &&
    (ph >= 6.0 && ph <= 9.0);

  if (isModerate) {
    return {
      status: "moderate",
      description: "Acceptable for irrigation or general use.",
    };
  }

  // 4. Fallback (Poor)
  return {
    status: "poor",
    description: "Water quality is unsafe; treatment required.",
  };
}