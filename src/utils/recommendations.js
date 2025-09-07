export function getRecommendations(reading) {
  if (!reading) return [];

  const recs = [];

  if (reading.pH < 6.5 || reading.pH > 8.5) {
    recs.push("⚠️ pH is out of safe range. Water may be unsafe for drinking.");
  }

  if (reading.EC > 1500) {
    recs.push("⚡ High EC detected. Water may be unsuitable for irrigation.");
  }

  if (reading.TDS > 500) {
    recs.push("🚰 TDS exceeds 500 ppm. Recommend RO filtration before drinking.");
  }

  if (reading.turbidity > 1) {
    recs.push("🌫 High turbidity. Consider sediment filtration.");
  }

  return recs.length ? recs : ["✅ Water quality is within safe limits."];
}
