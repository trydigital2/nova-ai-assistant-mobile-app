import {
  calculateContextBudget,
  compareContextBudgets,
} from '../src/utils/contextBudgetEngine';
import { ContextBudgetInput } from '../src/types';

describe('NovaAI Context Window & Token Budget Engine', () => {
  const lightBudget: ContextBudgetInput = {
    systemPromptTokens: 1500,
    userPromptTokens: 2500,
    ragContextTokens: 6000,
    reservedOutputTokens: 2000,
  }; // Total: 12,000 tokens

  it('calculates optimal health status for low utilization on GPT-4o (128k window)', () => {
    const result = calculateContextBudget('gpt-4o', lightBudget);

    expect(result.modelId).toBe('gpt-4o');
    expect(result.contextWindowTokens).toBe(128000);
    expect(result.totalAllocatedTokens).toBe(12000);
    expect(result.remainingTokens).toBe(116000);
    expect(result.utilizationPercentage).toBe(9.4);
    expect(result.status).toBe('optimal');
    expect(result.statusBadgeText).toBe('Safe Capacity');
  });

  it('triggers warning status when context utilization reaches 70-89%', () => {
    // 100,000 tokens out of 128,000 = ~78.1%
    const heavyBudget: ContextBudgetInput = {
      systemPromptTokens: 10000,
      userPromptTokens: 20000,
      ragContextTokens: 60000,
      reservedOutputTokens: 10000,
    };

    const result = calculateContextBudget('gpt-4o', heavyBudget);
    expect(result.totalAllocatedTokens).toBe(100000);
    expect(result.utilizationPercentage).toBe(78.1);
    expect(result.status).toBe('warning');
    expect(result.statusBadgeText).toBe('Elevated Usage');
  });

  it('triggers critical overflow status when allocation exceeds 90% or exceeds window', () => {
    // 125,000 tokens on 128,000 = ~97.7%
    const criticalBudget: ContextBudgetInput = {
      systemPromptTokens: 15000,
      userPromptTokens: 30000,
      ragContextTokens: 75000,
      reservedOutputTokens: 5000,
    };

    const result = calculateContextBudget('gpt-4o', criticalBudget);
    expect(result.utilizationPercentage).toBe(97.7);
    expect(result.status).toBe('overflow');
    expect(result.statusBadgeText).toBe('Critical Headroom');
  });

  it('handles absolute overflow when tokens exceed window capacity', () => {
    // 135,000 tokens on 128,000 (>100%)
    const overBudget: ContextBudgetInput = {
      systemPromptTokens: 20000,
      userPromptTokens: 35000,
      ragContextTokens: 75000,
      reservedOutputTokens: 5000,
    };

    const result = calculateContextBudget('gpt-4o', overBudget);
    expect(result.remainingTokens).toBe(0);
    expect(result.status).toBe('overflow');
    expect(result.statusBadgeText).toBe('Context Overflow');
    expect(result.recommendation).toContain('exceed model context limit');
  });

  it('compares budget across multiple models simultaneously', () => {
    const results = compareContextBudgets(['gpt-4o', 'claude-3-5-sonnet', 'gemini-1-5-pro'], lightBudget);

    expect(results).toHaveLength(3);
    expect(results[0].modelId).toBe('gpt-4o');
    expect(results[1].modelId).toBe('claude-3-5-sonnet');
    expect(results[2].modelId).toBe('gemini-1-5-pro');

    // Gemini 1.5 Pro has 2,000,000 window, so 12k tokens is ~0.6%
    expect(results[2].contextWindowTokens).toBe(2000000);
    expect(results[2].utilizationPercentage).toBe(0.6);
  });
});

