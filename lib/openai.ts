import OpenAI from "openai";
import { ClassificationResult, Category } from "../types";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ALLOWED_CATEGORIES: Category[] = ['Recycle', 'Landfill', 'Compost', 'Special'];

function validateAndClampResult(raw: any): ClassificationResult {
  let category: Category = ALLOWED_CATEGORIES.includes(raw.category) 
    ? raw.category 
    : 'Special';
  
  let confidence = typeof raw.confidence === 'number' 
    ? Math.max(0, Math.min(1, raw.confidence)) 
    : 0.5;
  
  if (confidence < 0.55) {
    category = 'Special';
  }
  
  const explanation = confidence < 0.55
    ? "Not sure about this item. The image may be unclear, or this item has rules that vary significantly by location. Try retaking the photo with better lighting, showing any labels, or including a size reference."
    : (raw.explanation || "Unable to determine explanation.");

  return {
    category,
    confidence,
    itemGuess: raw.itemGuess || "Unknown item",
    explanation,
    prepSteps: Array.isArray(raw.prepSteps) ? raw.prepSteps : [],
    localNote: raw.localNote || "Local rules may vary. Check with your municipality.",
    secondaryCategory: raw.secondaryCategory && ALLOWED_CATEGORIES.includes(raw.secondaryCategory) 
      ? raw.secondaryCategory 
      : undefined,
    secondaryConfidence: typeof raw.secondaryConfidence === 'number'
      ? Math.max(0, Math.min(1, raw.secondaryConfidence))
      : undefined,
  };
}

export async function classifyWaste(
  base64Image: string, 
  mimeType: string = "image/jpeg",
  region: string = "Generic / Unknown"
): Promise<ClassificationResult> {
  const systemPrompt = `You are a waste classification expert. Analyze the image and determine the correct disposal category.

RULES:
- Be CONSERVATIVE with recycling claims. When in doubt, prefer "Special" or "Landfill"
- Food-contaminated items (grease, food residue) should go to "Landfill" or "Compost"
- If you cannot identify the item or are uncertain, return "Special" with guidance
- Consider the user's region when making recommendations: ${region}

CATEGORIES:
- Recycle: Clean paper, cardboard, metal cans, glass bottles, plastic bottles (#1, #2)
- Landfill: Contaminated items, mixed materials, plastic bags, styrofoam, broken glass
- Compost: Food scraps, yard waste, coffee grounds, paper towels
- Special: Electronics, batteries, light bulbs, medications, paint, hazardous materials, or when uncertain

You MUST respond with valid JSON only, matching this exact schema:
{
  "category": "Recycle" | "Landfill" | "Compost" | "Special",
  "confidence": 0.0-1.0,
  "itemGuess": "what you think the item is",
  "explanation": "brief explanation for the classification",
  "prepSteps": ["step1", "step2"],
  "localNote": "any regional considerations",
  "secondaryCategory": "optional alternative category",
  "secondaryConfidence": 0.0-1.0
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Classify this waste item and return JSON only."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 1024,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI model");
  }

  const parsed = JSON.parse(content);
  return validateAndClampResult(parsed);
}
