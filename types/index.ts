export type Category = 'Recycle' | 'Landfill' | 'Compost' | 'Special';

export interface ClassificationResult {
  category: Category;
  confidence: number;
  itemGuess: string;
  explanation: string;
  prepSteps: string[];
  localNote: string;
  secondaryCategory?: Category;
  secondaryConfidence?: number;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string;
  result: ClassificationResult;
}

export interface FeedbackPayload {
  scanId: string;
  isCorrect: boolean;
  correctCategory?: Category;
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
