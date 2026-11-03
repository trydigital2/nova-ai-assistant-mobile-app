import { AIModelId, ContextBudgetInput, ContextBudgetBreakdown, ContextHealthStatus } from '../types';
import { AI_MODELS } from '../data/mockData';

export const OPTIMAL_THRESHOLD_PCT = 70;
export const WARNING_THRESHOLD_PCT = 90;

/**
 * Calculates real-time context window usage, allocation breakdown, and overflow diagnostics
 * for a given AI model and prompt configuration.
 */
export function calculateContextBudget(
  modelId: AIModelId,
  budget: ContextBudgetInput
): ContextBudgetBreakdown {
  const model = AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];
  const contextWindowTokens = model.contextWindowTokens;

  const systemPromptTokens = Math.max(0, budget.systemPromptTokens || 0);
  const userPromptTokens = Math.max(0, budget.userPromptTokens || 0);
  const ragContextTokens = Math.max(0, budget.ragContextTokens || 0);
  const reservedOutputTokens = Math.max(0, budget.reservedOutputTokens || 0);

  const totalAllocatedTokens =
    systemPromptTokens + userPromptTokens + ragContextTokens + reservedOutputTokens;

  const remainingTokens = Math.max(0, contextWindowTokens - totalAllocatedTokens);
  const rawUtilization = (totalAllocatedTokens / contextWindowTokens) * 100;
  const utilizationPercentage = Math.round(rawUtilization * 10) / 10;

  let status: ContextHealthStatus = 'optimal';
  let statusBadgeText = 'Safe Capacity';
  let recommendation =
    'Context headroom is abundant. Ideal for complex few-shot examples and chain-of-thought reasoning.';

  if (utilizationPercentage > 100 || totalAllocatedTokens > contextWindowTokens) {
    status = 'overflow';
    statusBadgeText = 'Context Overflow';
    recommendation = `Allocated tokens exceed model context limit by ${(totalAllocatedTokens - contextWindowTokens).toLocaleString()} tokens! Switch to Gemini 1.5 Pro or trim RAG documents.`;
  } else if (utilizationPercentage >= WARNING_THRESHOLD_PCT) {
    status = 'overflow';
    statusBadgeText = 'Critical Headroom';
    recommendation =
      'High risk of context truncation during multi-turn generation. Consider compressing earlier conversation turns.';
  } else if (utilizationPercentage >= OPTIMAL_THRESHOLD_PCT) {
    status = 'warning';
    statusBadgeText = 'Elevated Usage';
    recommendation =
      'Nearing context limits. Monitor generation tokens and prune auxiliary reference snippets.';
  }

  return {
    modelId: model.id,
    modelName: model.name,
    contextWindowTokens,
    systemPromptTokens,
    userPromptTokens,
    ragContextTokens,
    reservedOutputTokens,
    totalAllocatedTokens,
    remainingTokens,
    utilizationPercentage,
    status,
    statusBadgeText,
    recommendation,
  };
}

/**
 * Compares context window allocations across all specified AI models simultaneously.
 */
export function compareContextBudgets(
  modelIds: AIModelId[],
  budget: ContextBudgetInput
): ContextBudgetBreakdown[] {
  return modelIds.map((id) => calculateContextBudget(id, budget));
}

