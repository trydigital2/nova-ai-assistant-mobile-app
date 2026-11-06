/**
 * Token Streaming Velocity & Latency Tracker Engine
 * Tracks tokens-per-second (TPS), Time To First Token (TTFT),
 * and dynamic throughput stability across LLM providers.
 */

export interface TokenVelocityMetrics {
  totalTokensGenerated: number;
  timeToFirstTokenMs: number;
  totalDurationMs: number;
  tokensPerSecond: number;
  smoothnessScore: number; // 0-100 rating
  tier: 'Blazing Fast' | 'Standard Throughput' | 'Congested';
  tierColor: string;
}

export function calculateStreamingVelocity(
  tokenCount: number,
  timeToFirstTokenMs: number,
  totalDurationMs: number
): TokenVelocityMetrics {
  const safeTokens = Math.max(0, tokenCount);
  const safeTTFT = Math.max(50, timeToFirstTokenMs);
  const safeDuration = Math.max(safeTTFT + 10, totalDurationMs);

  const generationDurationSeconds = (safeDuration - safeTTFT) / 1000.0;
  const tokensPerSecond =
    generationDurationSeconds > 0
      ? Math.round((safeTokens / generationDurationSeconds) * 10) / 10
      : 0;

  // Throughput rating
  let tier: TokenVelocityMetrics['tier'] = 'Standard Throughput';
  let tierColor = '#3B82F6';
  let smoothnessScore = 80;

  if (tokensPerSecond >= 80) {
    tier = 'Blazing Fast';
    tierColor = '#10B981';
    smoothnessScore = 98;
  } else if (tokensPerSecond >= 35) {
    tier = 'Standard Throughput';
    tierColor = '#3B82F6';
    smoothnessScore = 85;
  } else {
    tier = 'Congested';
    tierColor = '#F59E0B';
    smoothnessScore = 65;
  }

  return {
    totalTokensGenerated: safeTokens,
    timeToFirstTokenMs: safeTTFT,
    totalDurationMs: safeDuration,
    tokensPerSecond,
    smoothnessScore,
    tier,
    tierColor,
  };
}
