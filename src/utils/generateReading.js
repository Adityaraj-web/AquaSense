// Random-walk simulation within realistic bounds
const BOUNDS = {
  ph: { min: 5.0, max: 8.8, step: 0.08, start: 7.2 },
  ec: { min: 339, max: 1500, step: 25, start: 450 }, // μS/cm
  tds: { min: 227, max: 1200, step: 20, start: 300 }, // mg/L
  turbidity: { min: 0.3, max: 1.5, step: 0.2, start: 0.8 }, // NTU
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function stepAround(value, step, min, max) {
  const delta = (Math.random() - 0.5) * 2 * step; // [-step, step]
  return clamp(value + delta, min, max);
}

export function generateReading(prev) {
  const now = new Date();
  if (!prev) {
    return {
      ph: BOUNDS.ph.start,
      ec: BOUNDS.ec.start,
      tds: BOUNDS.tds.start,
      turbidity: BOUNDS.turbidity.start,
      time: now.toLocaleTimeString(),
    };
  }

  return {
    ph: stepAround(prev.ph, BOUNDS.ph.step, BOUNDS.ph.min, BOUNDS.ph.max),
    ec: stepAround(prev.ec, BOUNDS.ec.step, BOUNDS.ec.min, BOUNDS.ec.max),
    tds: stepAround(prev.tds, BOUNDS.tds.step, BOUNDS.tds.min, BOUNDS.tds.max),
    turbidity: stepAround(
      prev.turbidity,
      BOUNDS.turbidity.step,
      BOUNDS.turbidity.min,
      BOUNDS.turbidity.max
    ),
    time: now.toLocaleTimeString(),
  };
}

export function seedHistory(count = 20) {
  const arr = [];
  let cur = generateReading(null);
  arr.push(cur);
  for (let i = 1; i < count; i++) {
    cur = generateReading(cur);
    arr.push(cur);
  }
  return arr;
}
