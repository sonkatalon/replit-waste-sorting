import type { NextApiRequest, NextApiResponse } from 'next';
import { langfuseSpanProcessor } from '../../instrumentation';
import { classifyWaste } from '../../lib/ai';
import { ApiResponse, ClassificationResult } from '../../types';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ClassificationResult>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
             req.socket.remoteAddress || 
             'unknown';
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ 
      success: false, 
      error: 'Too many requests. Please wait a minute before trying again.' 
    });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const mimeMatch = image.match(/^data:(image\/[^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = image.replace(/^data:image\/[^;]+;base64,/, '');
    
    if (base64Data.length < 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image appears to be invalid or too small' 
      });
    }

    const result = await classifyWaste(base64Data, mimeType);

    // https://langfuse.com/integrations/frameworks/vercel-ai-sdk
    // Critical for serverless: flush traces before function terminates
    await langfuseSpanProcessor.forceFlush();

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Classification error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to classify image. Please try again.' 
    });
  }
}
