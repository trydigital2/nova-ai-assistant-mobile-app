import { AIModelId, PipelineStep, PromptPipelineSummary } from '../types';
import { calculateTokenCost } from './aiEngine';

/**
 * Validates whether variable output keys chained between steps are valid.
 */
export function validatePipelineChaining(steps: PipelineStep[]): { isValid: boolean; missingDependencies: string[] } {
  const availableKeys = new Set<string>();
  const missingDependencies: string[] = [];

  for (const step of steps) {
    const requiredMatches = step.promptTemplate.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g) || [];
    for (const match of requiredMatches) {
      const key = match.replace(/[{}]/g, '').trim();
      if (!availableKeys.has(key) && key !== 'input' && key !== 'context') {
        missingDependencies.push(key);
      }
    }
    availableKeys.add(step.outputKey);
  }

  return {
    isValid: missingDependencies.length === 0,
    missingDependencies,
  };
}

/**
 * Calculates aggregate token consumption, latency, and inference cost for a sequential pipeline.
 */
export function calculatePipelineMetrics(steps: PipelineStep[]): {
  totalTokens: number;
  totalCostUSD: number;
  totalLatencyMs: number;
} {
  let totalTokens = 0;
  let totalCostUSD = 0;
  let totalLatencyMs = 0;

  for (const step of steps) {
    totalTokens += step.estimatedTokens;
    totalLatencyMs += step.latencyMs;

    // Approximate 70% input, 30% output split for step tokens
    const inputTokens = Math.round(step.estimatedTokens * 0.7);
    const outputTokens = step.estimatedTokens - inputTokens;
    const cost = calculateTokenCost(step.model, inputTokens, outputTokens);
    totalCostUSD += cost.totalCostUSD;
  }

  return {
    totalTokens,
    totalCostUSD,
    totalLatencyMs,
  };
}

/**
 * Creates a pre-configured multi-step pipeline summary.
 */
export function createPromptPipelineSummary(
  pipelineId: string,
  title: string,
  description: string,
  steps: PipelineStep[]
): PromptPipelineSummary {
  const metrics = calculatePipelineMetrics(steps);
  const validation = validatePipelineChaining(steps);

  return {
    pipelineId,
    title,
    description,
    steps,
    totalEstimatedTokens: metrics.totalTokens,
    totalEstimatedCostUSD: metrics.totalCostUSD,
    formattedCost: `$${metrics.totalCostUSD.toFixed(4)}`,
    totalLatencyMs: metrics.totalLatencyMs,
    isReady: validation.isValid,
  };
}

