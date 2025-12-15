import { useState } from 'react';

interface RegionSelectorProps {
  region: string;
  onRegionChange: (region: string) => void;
}

const REGIONS = [
  'Generic / Unknown',
  'California, USA',
  'New York, USA',
  'Texas, USA',
  'Washington, USA',
  'Oregon, USA',
  'Toronto, Canada',
  'Vancouver, Canada',
  'London, UK',
  'Berlin, Germany',
  'Sydney, Australia',
];

export default function RegionSelector({ region, onRegionChange }: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <span className="text-xl">📍</span>
        <span className="text-sm text-gray-700 max-w-[150px] truncate">{region}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-20 w-64 max-h-72 overflow-y-auto">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onRegionChange(r);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 ${
                  r === region ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
