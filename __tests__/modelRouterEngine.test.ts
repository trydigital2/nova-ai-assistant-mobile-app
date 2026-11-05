import {
  estimateInferenceCost,
  routeLLMTask,
  AVAILABLE_MODELS,
} from '../src/utils/modelRouterEngine';

describe('NovaAI Model Benchmark & Latency-Cost Router Engine', () => {
  describe('estimateInferenceCost', () => {
    it('calculates exact cost per million tokens', () => {
      // Gemini 1.5 Pro: $1.25/1M input, $5.00/1M output
      // 10,000 input = $0.0125, 2,000 output = $0.010 -> total $0.0225
      const model = AVAILABLE_MODELS['gemini-1-5-pro'];
      const cost = estimateInferenceCost(model, 10000, 2000);
      expect(cost).toBe(0.0225);
    });

    it('returns zero for non-positive token counts', () => {
      const model = AVAILABLE_MODELS['gpt-4o'];
      const cost = estimateInferenceCost(model, 0, 0);
      expect(cost).toBe(0);
    });
  });

  describe('routeLLMTask', () => {
    it('selects lowest cost model when cost_first strategy is requested', () => {
      const decision = routeLLMTask('simple', 'cost_first', 2000, 500);
      expect(decision.selectedModel.id).toBe('gemini-1-5-pro');
      expect(decision.strategy).toBe('cost_first');
      expect(decision.costSavingsPercent).toBeGreaterThan(0);
    });

    it('selects fastest model when latency_first strategy is requested', () => {
      const decision = routeLLMTask('simple', 'latency_first', 2000, 500);
      expect(decision.selectedModel.id).toBe('gpt-4o');
      expect(decision.estimatedLatencyMs).toBe(700);
    });

    it('selects highest benchmark model when quality_first strategy is requested', () => {
      const decision = routeLLMTask('reasoning', 'quality_first', 2000, 500);
      expect(decision.selectedModel.id).toBe('claude-3-5-sonnet');
      expect(decision.selectedModel.qualityScore).toBe(96);
    });

    it('routes complex reasoning tasks to top model under balanced strategy', () => {
      const decision = routeLLMTask('reasoning', 'balanced', 2000, 500);
      expect(decision.selectedModel.id).toBe('claude-3-5-sonnet');
    });
  });
});
