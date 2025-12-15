import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ImageCapture from '../components/ImageCapture';
import ResultCard from '../components/ResultCard';
import { ClassificationResult, ScanHistoryItem } from '../types';
import { addToHistory } from '../lib/storage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Classification failed');
      }

      const newScanId = `scan_${Date.now()}`;
      setResult(data.data);

      const thumbnail = imageData.length > 50000
        ? imageData.substring(0, 50000) + '...'
        : imageData;

      const historyItem: ScanHistoryItem = {
        id: newScanId,
        timestamp: Date.now(),
        thumbnail,
        result: data.data,
      };
      addToHistory(historyItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Head>
        <title>Sort It - Waste Classification</title>
        <meta name="description" content="Identify how to dispose of waste items correctly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">♻️ Sort It</h1>
            <Link
              href="/history"
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              📋
            </Link>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-8">
          {!result && !isLoading && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                What goes where?
              </h2>
              <p className="text-gray-600">
                Take a photo of any item to find out if it should be recycled, composted, or thrown away.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Analyzing your item...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600">{error}</p>
              <button
                onClick={handleReset}
                className="mt-3 text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {result && (
            <div className="mb-6">
              <ResultCard result={result} />
              <button
                onClick={handleReset}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Scan Another Item
              </button>
            </div>
          )}

          {!result && !isLoading && (
            <ImageCapture onCapture={handleCapture} disabled={isLoading} />
          )}

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Local disposal rules vary by municipality.</p>
            <p>Always check with your local waste management for specific guidelines.</p>
          </div>
        </main>
      </div>
    </>
  );
}
