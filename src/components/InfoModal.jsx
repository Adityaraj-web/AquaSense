export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          How We Classify Water Quality
        </h2>
        
        {/* The list of parameters has been updated and corrected */}
        <ul className="text-sm space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li>
            <strong>DO &gt; 5 mg/L:</strong> Dissolved Oxygen is essential for healthy aquatic ecosystems and fish survival.
          </li>
          <li>
            <strong>EC &lt; 750 μS/cm:</strong> Lower Electrical Conductivity indicates fewer dissolved salts, which is ideal for drinking and irrigation.
          </li>
          <li>
            <strong>TDS &lt; 500 ppm:</strong> Lower Total Dissolved Solids is the recommended standard for safe and pleasant-tasting drinking water (IS 10500).
          </li>
          <li>
            <strong>Turbidity &lt; 1 NTU:</strong> Very clear water. Low turbidity is a critical standard for safe drinking water.
          </li>
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}