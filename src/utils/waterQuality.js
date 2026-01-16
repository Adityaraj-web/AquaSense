export function getWaterQuality({ do: dissolvedOxygen, ec, tds, turbidity } = {}) {
  // ✨ FIX: The function now expects a `do` property and renames it.
  // The check for `dissolvedOxygen` works because of the renaming above.
  if (dissolvedOxygen == null || ec == null || tds == null || turbidity == null) {
    return {
      status: "moderate",
      description: "Awaiting complete sensor data...",
    };
  }

  const isGood =
    dissolvedOxygen >= 6 &&
    ec < 500 &&
    tds <= 500 &&
    turbidity < 1;

  if (isGood) {
    return { status: "good", description: "Safe and suitable for drinking." };
  }

  const isModerate =
    dissolvedOxygen >= 4 &&
    ec < 1500 &&
    tds <= 1000 &&
    turbidity < 5;

  if (isModerate) {
    return {
      status: "moderate",
      description: "Acceptable for irrigation or general use.",
    };
  }

  return {
    status: "poor",
    description: "Water quality is unsafe; treatment required.",
  };
}