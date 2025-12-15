import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedbackPayload, ApiResponse } from '../../types';
import fs from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), 'data', 'feedback.json');

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadFeedback(): FeedbackPayload[] {
  ensureDataDir();
  if (!fs.existsSync(FEEDBACK_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveFeedback(feedback: FeedbackPayload[]) {
  ensureDataDir();
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ message: string }>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { scanId, isCorrect, correctCategory } = req.body;

    if (!scanId || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const feedbackEntry: FeedbackPayload = {
      scanId,
      isCorrect,
      correctCategory: !isCorrect ? correctCategory : undefined,
      timestamp: Date.now(),
    };

    const allFeedback = loadFeedback();
    allFeedback.push(feedbackEntry);
    saveFeedback(allFeedback);

    return res.status(200).json({ 
      success: true, 
      data: { message: 'Feedback recorded. Thank you!' } 
    });
  } catch (error) {
    console.error('Feedback error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to save feedback' 
    });
  }
}
