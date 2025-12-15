import { useState } from 'react';
import { ClassificationResult } from '../types';
import CategoryBadge from './CategoryBadge';
import ConfidenceMeter from './ConfidenceMeter';

interface ResultCardProps {
  result: ClassificationResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
      <div className="text-center mb-6">
        <CategoryBadge category={result.category} />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {result.itemGuess}
        </h3>
        <ConfidenceMeter confidence={result.confidence} />
      </div>

      <p className="text-gray-600 mb-4">{result.explanation}</p>

      {result.prepSteps.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            {showDetails ? '▼' : '▶'} More info
          </button>
          {showDetails && (
            <div className="mt-2 bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">Preparation steps:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {result.prepSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <p className="text-amber-800 text-sm">{result.localNote}</p>
      </div>

      {result.secondaryCategory && (
        <div className="text-sm text-gray-500">
          Might also be: <CategoryBadge category={result.secondaryCategory} size="sm" />
          {result.secondaryConfidence && ` (${Math.round(result.secondaryConfidence * 100)}%)`}
        </div>
      )}
    </div>
  );
}
