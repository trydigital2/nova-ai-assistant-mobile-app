export type PromptCategory = 'Engineering' | 'Writing' | 'Product' | 'Data & SQL' | 'Marketing' | 'Idea Spark';

export type AIModelId = 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro';

export interface ModelPricing {
  id: AIModelId;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google';
  inputPricePerMillionUSD: number; // e.g. $2.50 per 1M input tokens
  outputPricePerMillionUSD: number; // e.g. $10.00 per 1M output tokens
  contextWindowTokens: number;
  maxOutputTokens: number;
  averageLatencyMs: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  templateString: string; // e.g. "Review this {{language}} code for performance: {{code}}"
  variables: string[]; // ['language', 'code']
  defaultModel: AIModelId;
  estimatedTokens: number;
  tags: string[];
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokenCount: number;
  status: 'sent' | 'streaming' | 'completed' | 'error';
  modelUsed?: AIModelId;
}

export interface TokenCostEstimate {
  modelId: AIModelId;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCostUSD: number;
  outputCostUSD: number;
  totalCostUSD: number;
  formattedCost: string; // e.g. "$0.0042"
}
