import {
  estimateTokenCount,
  interpolatePromptVariables,
  calculateTokenCost,
  compareModelCosts,
} from '../src/utils/aiEngine';
import { MOCK_PROMPT_TEMPLATES, AI_MODELS } from '../src/data/mockData';

describe('NovaAI Inference Engine & Token Utilities', () => {
  describe('estimateTokenCount', () => {
    it('returns zero for empty or whitespace-only input', () => {
      expect(estimateTokenCount('')).toBe(0);
      expect(estimateTokenCount('    ')).toBe(0);
    });

    it('estimates token count reasonably for typical English sentences', () => {
      const sentence = 'Optimize this PostgreSQL index strategy for high volume inserts.';
      const tokens = estimateTokenCount(sentence);
      // ~65 characters, 9 words -> ~14-16 tokens
      expect(tokens).toBeGreaterThanOrEqual(10);
      expect(tokens).toBeLessThanOrEqual(25);
    });

    it('handles code blocks and special characters smoothly', () => {
      const code = 'const double = (x: number): number => x * 2;';
      const tokens = estimateTokenCount(code);
      expect(tokens).toBeGreaterThan(5);
    });
  });

  describe('interpolatePromptVariables', () => {
    it('substitutes single and multiple template variables', () => {
      const template = 'Review {{language}} code:\n{{code}}';
      const output = interpolatePromptVariables(template, {
        language: 'TypeScript',
        code: 'const a = 10;',
      });

      expect(output).toBe('Review TypeScript code:\nconst a = 10;');
    });

    it('replaces all occurrences of the same variable', () => {
      const template = '{{name}} is building {{name}}OS';
      const output = interpolatePromptVariables(template, { name: 'Nova' });
      expect(output).toBe('Nova is building NovaOS');
    });

    it('preserves template parts if variable is not provided', () => {
      const template = 'Hello {{role}} at {{company}}';
      const output = interpolatePromptVariables(template, { role: 'Architect' });
      expect(output).toBe('Hello Architect at {{company}}');
    });
  });

  describe('calculateTokenCost & compareModelCosts', () => {
    it('computes exact API pricing for GPT-4o input and output tokens', () => {
      // 1,000 input tokens @ $2.50/M = $0.0025
      // 500 output tokens @ $10.00/M = $0.0050
      // Total = $0.00750
      const cost = calculateTokenCost('gpt-4o', 1000, 500);

      expect(cost.modelId).toBe('gpt-4o');
      expect(cost.inputCostUSD).toBeCloseTo(0.0025, 5);
      expect(cost.outputCostUSD).toBeCloseTo(0.0050, 5);
      expect(cost.totalCostUSD).toBeCloseTo(0.0075, 5);
      expect(cost.formattedCost).toBe('$0.00750');
    });

    it('computes exact API pricing for Gemini 1.5 Pro with low cost rates', () => {
      // 10,000 input tokens @ $1.25/M = $0.0125
      // 2,000 output tokens @ $5.00/M = $0.0100
      // Total = $0.0225
      const cost = calculateTokenCost('gemini-1-5-pro', 10000, 2000);

      expect(cost.totalCostUSD).toBeCloseTo(0.0225, 5);
      expect(cost.formattedCost).toBe('$0.0225');
    });

    it('generates multi-model cost comparison across all configured models', () => {
      const comparison = compareModelCosts(2000, 800);
      expect(comparison).toHaveLength(AI_MODELS.length);

      // Verify each model has positive total cost
      for (const item of comparison) {
        expect(item.totalCostUSD).toBeGreaterThan(0);
        expect(item.totalTokens).toBe(2800);
      }
    });
  });
});
