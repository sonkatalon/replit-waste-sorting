import { useRef, useState, useCallback } from 'react';

interface ImageCaptureProps {
  onCapture: (imageData: string) => void;
  disabled?: boolean;
}

export default function ImageCapture({ onCapture, disabled }: ImageCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onCapture(result);
    };
    reader.readAsDataURL(file);
  }, [onCapture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleReset = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-md">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Captured item" 
            className="w-full rounded-2xl shadow-lg"
          />
          <button
            onClick={handleReset}
            disabled={disabled}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 disabled:opacity-50"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled}
            className="w-full py-6 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <span className="text-3xl">📷</span>
            Take Photo
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📁</span>
            Upload Image
          </button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
