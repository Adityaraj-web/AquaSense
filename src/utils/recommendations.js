// utils/recommendations.js

export function getRecommendations(reading) {
  if (!reading || Object.values(reading).every(v => v === "—")) {
    return ["⚠️ No live data available. Connect to Consentium to start monitoring."];
  }

  const recs = [];


  // DO range
  if (reading.do !== "—") {
    if (reading.do < 1) {
      recs.push("🐠 Dissolved Oxygen is at a healthy level for aquatic life.");
    }
    else {
      recs.push("⚠️ Unhealthy Dissolved Oxygen. May stress aquatic life.");
    }
  }

  // EC range
  if (reading.ec !== "—") {
    if (reading.ec > 1500) {
      recs.push("🌊 High EC detected. Possible salinity risk, not suitable for irrigation.");
    } else if (reading.ec > 750) {
      recs.push("⚡ EC is moderately high. Monitor regularly for irrigation safety.");
    } else {
      recs.push("👌 EC is within safe limits.");
    }
  }

  // TDS range
  if (reading.tds !== "—") {
    if (reading.tds > 1000) {
      recs.push("🚫 High TDS. Not recommended for drinking.");
    } else if (reading.tds > 500) {
      recs.push("😐 Moderate TDS. May affect taste but acceptable for irrigation.");
    } else {
      recs.push("💧 TDS is within WHO recommended drinking water standards.");
    }
  }

  // Turbidity range
  if (reading.turbidity !== "—") {
    if (reading.turbidity > 5) {
      recs.push("👀 High turbidity. Filtration required before usage.");
    } else if (reading.turbidity > 1) {
      recs.push("🔍 Turbidity is slightly elevated. Monitor water clarity.");
    } else {
      recs.push("✨ Turbidity is very low. Water appears clear.");
    }
  }

  // If somehow no checks were triggered
  if (recs.length === 0) {
    recs.push("ℹ️ No recommendations available.");
  }

  return recs;
}
