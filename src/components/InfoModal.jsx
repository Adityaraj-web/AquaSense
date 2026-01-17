export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    // Updated overlay with backdrop blur for a more modern feel
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
          <span>ℹ️</span> How We Classify Water Quality
        </h2>
        
        <div className="text-sm space-y-4 text-slate-600 dark:text-slate-300">
          <p className="italic opacity-80 mb-2">We use standard benchmarks (e.g., WHO/IS 10500) to determine safety:</p>
          
          <ul className="space-y-3 list-disc pl-5 marker:text-blue-500">
            <li>
              <strong>pH 6.5 – 8.5:</strong> The standard safe range for drinking water. Values below 6.5 are acidic (corrosive), while above 8.5 are alkaline (bitter taste).
            </li>
            <li>
              <strong>DO &gt; 6 mg/L:</strong> Dissolved Oxygen is vital for aquatic life. Levels below 4 mg/L stress fish and ecosystems.
            </li>
            <li>
              <strong>EC &lt; 750 μS/cm:</strong> Lower Electrical Conductivity indicates fewer dissolved salts, ideal for drinking and irrigation.
            </li>
            <li>
              <strong>TDS &lt; 500 ppm:</strong> Recommended limit for excellent drinking water. High TDS can affect taste and kidney health.
            </li>
            <li>
              <strong>Turbidity &lt; 1 NTU:</strong> Very clear water. Low turbidity is critical for ensuring disinfection works effectively.
            </li>
          </ul>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}