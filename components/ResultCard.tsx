import { useState } from 'react';
import { ClassificationResult, Category } from '../types';
import CategoryBadge from './CategoryBadge';
import ConfidenceMeter from './ConfidenceMeter';

interface ResultCardProps {
  result: ClassificationResult;
  scanId: string;
  onFeedback: (scanId: string, isCorrect: boolean, correctCategory?: Category) => void;
}

export default function ResultCard({ result, scanId, onFeedback }: ResultCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedback = (isCorrect: boolean, correctCategory?: Category) => {
    onFeedback(scanId, isCorrect, correctCategory);
    setFeedbackSent(true);
    setShowFeedback(false);
  };

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
        <div className="text-sm text-gray-500 mb-4">
          Might also be: <CategoryBadge category={result.secondaryCategory} size="sm" />
          {result.secondaryConfidence && ` (${Math.round(result.secondaryConfidence * 100)}%)`}
        </div>
      )}

      {!feedbackSent ? (
        <div className="border-t pt-4">
          {!showFeedback ? (
            <button
              onClick={() => setShowFeedback(true)}
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              Report wrong result
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Was this result correct?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedback(true)}
                  className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  Correct
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Wrong
                </button>
              </div>
              {showFeedback && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Select correct category:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Recycle', 'Landfill', 'Compost', 'Special'] as Category[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleFeedback(false, cat)}
                        className="py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-green-600 text-sm border-t pt-4">
          Thank you for your feedback!
        </p>
      )}
    </div>
  );
}
