import { AIModelId, ModelPricing, TokenCostEstimate } from '../types';
import { AI_MODELS } from '../data/mockData';

/**
 * Heuristic Token Counter
 * Standard industry approximation: 1 token ≈ 4 characters in English (~0.75 words).
 * Clamped to minimum 0.
 */
export function estimateTokenCount(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).length;
  // Blended token heuristic: average of character-based (char/4) and word-based (words*1.3)
  const charEstimate = characterCount / 4.0;
  const wordEstimate = wordCount * 1.33;
  return Math.max(1, Math.round((charEstimate + wordEstimate) / 2));
}

/**
 * Replaces `{{variableName}}` placeholders in prompt templates.
 */
export function interpolatePromptVariables(
  templateString: string,
  variables: Record<string, string>
): string {
  let result = templateString;
  for (const [key, val] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(pattern, val);
  }
  return result;
}

/**
 * Calculates dollar cost of API inference based on exact provider pricing per million tokens.
 */
export function calculateTokenCost(
  modelId: AIModelId,
  inputTokens: number,
  outputTokens: number
): TokenCostEstimate {
  const model = AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];
  const safeIn = Math.max(0, inputTokens);
  const safeOut = Math.max(0, outputTokens);
  const totalTokens = safeIn + safeOut;

  // Rate per token = pricePerMillion / 1,000,000
  const inputCostUSD = (safeIn * model.inputPricePerMillionUSD) / 1000000;
  const outputCostUSD = (safeOut * model.outputPricePerMillionUSD) / 1000000;
  const totalCostUSD = inputCostUSD + outputCostUSD;

  let formattedCost = `$${totalCostUSD.toFixed(5)}`;
  if (totalCostUSD < 0.0001 && totalCostUSD > 0) {
    formattedCost = '< $0.0001';
  } else if (totalCostUSD >= 0.01) {
    formattedCost = `$${totalCostUSD.toFixed(4)}`;
  }

  return {
    modelId: model.id,
    modelName: model.name,
    inputTokens: safeIn,
    outputTokens: safeOut,
    totalTokens,
    inputCostUSD,
    outputCostUSD,
    totalCostUSD,
    formattedCost,
  };
}

/**
 * Multi-Model Cost & Latency Matrix Comparison
 */
export function compareModelCosts(
  inputTokens: number,
  outputTokens: number
): TokenCostEstimate[] {
  return AI_MODELS.map((model) => calculateTokenCost(model.id, inputTokens, outputTokens));
}
