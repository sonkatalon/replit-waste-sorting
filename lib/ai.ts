import { generateObject } from "ai";
import { z } from "zod";
import { ClassificationResult, Category } from "../types";

const ALLOWED_CATEGORIES: Category[] = [
  "Recycle",
  "Landfill",
  "Compost",
  "Special",
];

const classificationSchema = z.object({
  category: z.enum(["Recycle", "Landfill", "Compost", "Special"]),
  confidence: z.number().min(0).max(1),
  itemGuess: z.string(),
  explanation: z.string(),
  prepSteps: z.array(z.string()),
  localNote: z.string(),
  secondaryCategory: z
    .enum(["Recycle", "Landfill", "Compost", "Special"])
    .optional(),
  secondaryConfidence: z.number().min(0).max(1).optional(),
});

function validateAndClampResult(
  raw: z.infer<typeof classificationSchema>
): ClassificationResult {
  let category: Category = ALLOWED_CATEGORIES.includes(raw.category)
    ? raw.category
    : "Special";

  let confidence =
    typeof raw.confidence === "number"
      ? Math.max(0, Math.min(1, raw.confidence))
      : 0.5;

  if (confidence < 0.55) {
    category = "Special";
  }

  const explanation =
    confidence < 0.55
      ? "Not sure about this item. The image may be unclear, or this item has rules that vary significantly by location. Try retaking the photo with better lighting, showing any labels, or including a size reference."
      : raw.explanation || "Unable to determine explanation.";

  return {
    category,
    confidence,
    itemGuess: raw.itemGuess || "Unknown item",
    explanation,
    prepSteps: Array.isArray(raw.prepSteps) ? raw.prepSteps : [],
    localNote:
      raw.localNote || "Local rules may vary. Check with your municipality.",
    secondaryCategory:
      raw.secondaryCategory &&
      ALLOWED_CATEGORIES.includes(raw.secondaryCategory)
        ? raw.secondaryCategory
        : undefined,
    secondaryConfidence:
      typeof raw.secondaryConfidence === "number"
        ? Math.max(0, Math.min(1, raw.secondaryConfidence))
        : undefined,
  };
}

export async function classifyWaste(
  base64Image: string,
  mimeType: string = "image/jpeg"
): Promise<ClassificationResult> {
  const systemPrompt = `You are a waste classification expert. Analyze the image and determine the correct disposal category.

RULES:
- Be CONSERVATIVE with recycling claims. When in doubt, prefer "Special" or "Landfill"
- Food-contaminated items (grease, food residue) should go to "Landfill" or "Compost"
- If you cannot identify the item or are uncertain, return "Special" with guidance

CATEGORIES:
- Recycle: Clean paper, cardboard, metal cans, glass bottles, plastic bottles (#1, #2)
- Landfill: Contaminated items, mixed materials, plastic bags, styrofoam, broken glass
- Compost: Food scraps, yard waste, coffee grounds, paper towels
- Special: Electronics, batteries, light bulbs, medications, paint, hazardous materials, or when uncertain`;

  try {
    const { object } = await generateObject({
      model: "google/gemini-3-pro-preview",
      schema: classificationSchema,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Classify this waste item.",
            },
            {
              type: "image",
              image: `data:${mimeType};base64,${base64Image}`,
            },
          ],
        },
      ],
      experimental_telemetry: {
        // https://langfuse.com/integrations/frameworks/vercel-ai-sdk
        isEnabled: true,
      },
    });

    return validateAndClampResult(object);
  } catch (error: any) {
    console.error("AI SDK error:", error?.message || error);
    if (
      error?.message?.includes("401") ||
      error?.message?.includes("API key")
    ) {
      throw new Error("Invalid API key. Please check your Google API key.");
    }
    if (
      error?.message?.includes("429") ||
      error?.message?.includes("rate limit")
    ) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    throw error;
  }
}
