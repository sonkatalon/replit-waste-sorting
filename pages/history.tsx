import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ScanHistoryItem } from '../types';
import { getHistory, clearHistory } from '../lib/storage';
import CategoryBadge from '../components/CategoryBadge';

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Clear all scan history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Head>
        <title>Scan History - Sort It</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl">←</Link>
              <h1 className="text-xl font-bold text-gray-800">Scan History</h1>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="text-red-600 text-sm hover:text-red-700"
              >
                Clear All
              </button>
            )}
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📭</p>
              <p className="text-gray-600">No scans yet</p>
              <Link 
                href="/"
                className="inline-block mt-4 text-blue-600 font-medium"
              >
                Scan your first item
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail && !item.thumbnail.endsWith('...') ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.result.itemGuess}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📷
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {item.result.itemGuess}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(item.timestamp)}
                    </p>
                    <div className="mt-1">
                      <CategoryBadge category={item.result.category} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
