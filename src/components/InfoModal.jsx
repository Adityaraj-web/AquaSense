export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          How We Classify Water Quality
        </h2>
        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300 list-disc pl-5">
          <li>
            <strong>pH (6.5–8.5):</strong> Ideal range for drinking.
          </li>
          <li>
            <strong>EC &lt; 500 μS/cm:</strong> Lower dissolved salts → better taste & potability.
          </li>
          <li>
            <strong>Turbidity (500-1000ppm):</strong> Good: Within 500 ppm, Moderate: Within 1000 ppm, Poor: Greater than 1000 ppm
          </li>
          <li>
            <strong>Turbidity &lt; 1 NTU:</strong> Clear water; low suspended particles.
          </li>
        </ul>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
