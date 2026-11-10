import { AIModelId } from '../types';

export type TaskComplexity = 'simple' | 'moderate' | 'complex' | 'reasoning';
export type RoutingStrategy = 'cost_first' | 'latency_first' | 'quality_first' | 'balanced';

export interface ModelProfile {
  id: AIModelId | 'fast-flash';
  displayName: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  avgLatencyMs: number;
  qualityScore: number; // 0 - 100
}

export const AVAILABLE_MODELS: Record<string, ModelProfile> = {
  'gemini-1-5-pro': {
    id: 'gemini-1-5-pro',
    displayName: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputPer1M: 1.25,
    outputPer1M: 5.0,
    avgLatencyMs: 850,
    qualityScore: 92,
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPer1M: 3.0,
    outputPer1M: 15.0,
    avgLatencyMs: 950,
    qualityScore: 96,
  },
  'gpt-4o': {
    id: 'gpt-4o',
    displayName: 'GPT-4o',
    provider: 'OpenAI',
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    avgLatencyMs: 700,
    qualityScore: 94,
  },
};

export interface RoutingDecision {
  selectedModel: ModelProfile;
  strategy: RoutingStrategy;
  estimatedCostUSD: number;
  estimatedLatencyMs: number;
  costSavingsPercent: number; // vs most expensive model
  recommendationReason: string;
}

/**
 * Calculates estimated inference cost for a specific token payload.
 */
export function estimateInferenceCost(
  model: ModelProfile,
  inputTokens: number,
  outputTokens: number
): number {
  const inputCost = (Math.max(0, inputTokens) / 1000000) * model.inputPer1M;
  const outputCost = (Math.max(0, outputTokens) / 1000000) * model.outputPer1M;
  return Math.round((inputCost + outputCost) * 100000) / 100000;
}

/**
 * Intelligent Model Router that selects the optimal LLM based on task criteria.
 */
export function routeLLMTask(
  complexity: TaskComplexity,
  strategy: RoutingStrategy,
  estimatedInputTokens: number = 1500,
  estimatedOutputTokens: number = 400
): RoutingDecision {
  const models = Object.values(AVAILABLE_MODELS);

  let selected: ModelProfile = models[0];

  if (strategy === 'cost_first') {
    selected = [...models].sort(
      (a, b) =>
        estimateInferenceCost(a, estimatedInputTokens, estimatedOutputTokens) -
        estimateInferenceCost(b, estimatedInputTokens, estimatedOutputTokens)
    )[0];
  } else if (strategy === 'latency_first') {
    selected = [...models].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)[0];
  } else if (strategy === 'quality_first') {
    selected = [...models].sort((a, b) => b.qualityScore - a.qualityScore)[0];
  } else {
    // Balanced: weighs quality against complexity
    if (complexity === 'reasoning' || complexity === 'complex') {
      selected = AVAILABLE_MODELS['claude-3-5-sonnet'];
    } else if (complexity === 'moderate') {
      selected = AVAILABLE_MODELS['gpt-4o'];
    } else {
      selected = AVAILABLE_MODELS['gemini-1-5-pro'];
    }
  }

  const selectedCost = estimateInferenceCost(selected, estimatedInputTokens, estimatedOutputTokens);
  const highestCost = Math.max(
    ...models.map(m => estimateInferenceCost(m, estimatedInputTokens, estimatedOutputTokens))
  );

  const costSavingsPercent =
    highestCost > 0
      ? Math.round(((highestCost - selectedCost) / highestCost) * 100)
      : 0;

  let recommendationReason = '';
  switch (strategy) {
    case 'cost_first':
      recommendationReason = `Selected ${selected.displayName} for lowest unit inference cost ($${selected.inputPer1M}/1M input).`;
      break;
    case 'latency_first':
      recommendationReason = `Selected ${selected.displayName} for fastest response latency (~${selected.avgLatencyMs}ms).`;
      break;
    case 'quality_first':
      recommendationReason = `Selected ${selected.displayName} for benchmark-leading reasoning quality (${selected.qualityScore}/100).`;
      break;
    default:
      recommendationReason = `Optimal multi-attribute balance for ${complexity} prompt complexity.`;
  }

  return {
    selectedModel: selected,
    strategy,
    estimatedCostUSD: selectedCost,
    estimatedLatencyMs: selected.avgLatencyMs,
    costSavingsPercent,
    recommendationReason,
  };
}
