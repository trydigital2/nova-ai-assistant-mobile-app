import {
  validatePipelineChaining,
  calculatePipelineMetrics,
  createPromptPipelineSummary,
} from '../src/utils/promptPipelineEngine';
import { PipelineStep } from '../src/types';

describe('NovaAI Prompt Chaining & Pipeline Engine', () => {
  const sampleSteps: PipelineStep[] = [
    {
      id: 'step_1',
      name: 'Extract Key Facts',
      model: 'gemini-1-5-pro',
      promptTemplate: 'Extract key points from {{input}}',
      outputKey: 'facts',
      status: 'completed',
      estimatedTokens: 800,
      latencyMs: 320,
    },
    {
      id: 'step_2',
      name: 'Synthesize Executive Summary',
      model: 'claude-3-5-sonnet',
      promptTemplate: 'Write summary based on facts: {{facts}}',
      outputKey: 'summary',
      status: 'running',
      estimatedTokens: 1200,
      latencyMs: 540,
    },
    {
      id: 'step_3',
      name: 'Generate Social Teasers',
      model: 'gpt-4o',
      promptTemplate: 'Draft 3 tweets from summary: {{summary}}',
      outputKey: 'tweets',
      status: 'pending',
      estimatedTokens: 600,
      latencyMs: 290,
    },
  ];

  it('validates sequential pipeline when all variable dependencies are resolved', () => {
    const validation = validatePipelineChaining(sampleSteps);
    expect(validation.isValid).toBe(true);
    expect(validation.missingDependencies).toHaveLength(0);
  });

  it('detects missing dependencies when a variable is referenced before being produced', () => {
    const brokenSteps: PipelineStep[] = [
      {
        id: 's1',
        name: 'Draft response',
        model: 'gpt-4o',
        promptTemplate: 'Use {{unresolved_var}} to answer',
        outputKey: 'out',
        status: 'pending',
        estimatedTokens: 500,
        latencyMs: 300,
      },
    ];

    const validation = validatePipelineChaining(brokenSteps);
    expect(validation.isValid).toBe(false);
    expect(validation.missingDependencies).toContain('unresolved_var');
  });

  it('computes aggregated tokens, total cost, and total latency', () => {
    const metrics = calculatePipelineMetrics(sampleSteps);
    expect(metrics.totalTokens).toBe(2600); // 800 + 1200 + 600
    expect(metrics.totalLatencyMs).toBe(1150); // 320 + 540 + 290
    expect(metrics.totalCostUSD).toBeGreaterThan(0);
  });

  it('creates complete pipeline summary object', () => {
    const summary = createPromptPipelineSummary(
      'pipe_101',
      'Research-to-Social Pipeline',
      'Automates reading, summarizing, and tweet generation',
      sampleSteps
    );

    expect(summary.pipelineId).toBe('pipe_101');
    expect(summary.totalEstimatedTokens).toBe(2600);
    expect(summary.isReady).toBe(true);
    expect(summary.steps).toHaveLength(3);
    expect(summary.formattedCost).toMatch(/^\$[0-9.]+/);
  });
});

