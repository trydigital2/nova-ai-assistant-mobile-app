export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export type StreamErrorCategory = 'RATE_LIMIT' | 'TIMEOUT' | 'TRANSIENT_NETWORK' | 'CONTEXT_OVERFLOW';

export interface RetryPolicy {
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  backoffMultiplier: number;
  jitterFactor: number;
}

export interface StreamRetryStatus {
  currentAttempt: number;
  maxRetries: number;
  circuitState: CircuitState;
  nextBackoffDelayMs: number;
  consecutiveFailures: number;
  shouldRetry: boolean;
  category: StreamErrorCategory;
  recommendedAction: string;
}

export const DEFAULT_STREAM_RETRY_POLICY: RetryPolicy = {
  maxRetries: 4,
  initialBackoffMs: 800,
  maxBackoffMs: 8000,
  backoffMultiplier: 2.0,
  jitterFactor: 0.25,
};

/**
 * Calculates exponential backoff with full jitter and circuit breaker state.
 */
export function calculateStreamRetry(
  attempt: number,
  consecutiveFailures: number,
  errorType: StreamErrorCategory = 'TRANSIENT_NETWORK',
  policy: RetryPolicy = DEFAULT_STREAM_RETRY_POLICY
): StreamRetryStatus {
  const shouldRetry = attempt < policy.maxRetries && errorType !== 'CONTEXT_OVERFLOW';

  // Determine circuit breaker state (trips OPEN after 3 consecutive failures)
  let circuitState: CircuitState = 'CLOSED';
  if (consecutiveFailures >= 3) {
    circuitState = 'OPEN';
  } else if (consecutiveFailures > 0 && attempt > 1) {
    circuitState = 'HALF_OPEN';
  }

  // Calculate exponential backoff: min(maxBackoff, initial * (multiplier ^ attempt))
  const rawBackoff = Math.min(
    policy.maxBackoffMs,
    policy.initialBackoffMs * Math.pow(policy.backoffMultiplier, attempt)
  );

  // Apply deterministic pseudo-jitter for UI stability
  const jitterOffset = (attempt * 137) % Math.round(rawBackoff * policy.jitterFactor);
  const nextBackoffDelayMs = Math.round(rawBackoff + jitterOffset);

  let recommendedAction = 'Re-establishing SSE token stream with backoff delay.';
  if (errorType === 'RATE_LIMIT') {
    recommendedAction = 'HTTP 429 received. Backing off to prevent quota lockout.';
  } else if (errorType === 'CONTEXT_OVERFLOW') {
    recommendedAction = 'Context window exceeded. Triggering automated summarization.';
  } else if (circuitState === 'OPEN') {
    recommendedAction = 'Circuit tripped OPEN. Fallback routing to secondary provider.';
  }

  return {
    currentAttempt: attempt,
    maxRetries: policy.maxRetries,
    circuitState,
    nextBackoffDelayMs,
    consecutiveFailures,
    shouldRetry,
    category: errorType,
    recommendedAction,
  };
}
