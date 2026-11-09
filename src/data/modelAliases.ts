/**
 * Manual alias mapping between Artificial Analysis model slugs and OpenRouter model IDs.
 * Strict, non-fuzzy mapping to ensure verified benchmarking data accuracy.
 */
export interface ModelAliasMapping {
  aaSlug: string;
  openRouterId: string;
  displayName: string;
  creator: string;
  toolSlug?: string; // Direct link to tool review in directory
}

export const MODEL_ALIASES: ModelAliasMapping[] = [
  {
    aaSlug: 'claude-3-7-sonnet',
    openRouterId: 'anthropic/claude-3.7-sonnet',
    displayName: 'Claude 3.7 Sonnet (Hybrid)',
    creator: 'Anthropic',
    toolSlug: 'claude'
  },
  {
    aaSlug: 'claude-3-5-sonnet',
    openRouterId: 'anthropic/claude-3.5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    creator: 'Anthropic',
    toolSlug: 'claude'
  },
  {
    aaSlug: 'claude-3-5-haiku',
    openRouterId: 'anthropic/claude-3.5-haiku',
    displayName: 'Claude 3.5 Haiku',
    creator: 'Anthropic',
    toolSlug: 'claude'
  },
  {
    aaSlug: 'deepseek-r1',
    openRouterId: 'deepseek/deepseek-r1',
    displayName: 'DeepSeek R1',
    creator: 'DeepSeek',
    toolSlug: 'deepseek-r1'
  },
  {
    aaSlug: 'deepseek-v3',
    openRouterId: 'deepseek/deepseek-chat',
    displayName: 'DeepSeek V3',
    creator: 'DeepSeek',
    toolSlug: 'deepseek-r1'
  },
  {
    aaSlug: 'o3-mini',
    openRouterId: 'openai/o3-mini',
    displayName: 'OpenAI o3-mini',
    creator: 'OpenAI',
    toolSlug: 'chatgpt'
  },
  {
    aaSlug: 'o1',
    openRouterId: 'openai/o1',
    displayName: 'OpenAI o1',
    creator: 'OpenAI',
    toolSlug: 'chatgpt'
  },
  {
    aaSlug: 'gpt-4o',
    openRouterId: 'openai/gpt-4o',
    displayName: 'GPT-4o (Omni)',
    creator: 'OpenAI',
    toolSlug: 'chatgpt'
  },
  {
    aaSlug: 'gpt-4o-mini',
    openRouterId: 'openai/gpt-4o-mini',
    displayName: 'GPT-4o mini',
    creator: 'OpenAI',
    toolSlug: 'chatgpt'
  },
  {
    aaSlug: 'gemini-2-0-flash',
    openRouterId: 'google/gemini-2.0-flash-001',
    displayName: 'Gemini 2.0 Flash',
    creator: 'Google',
    toolSlug: 'gemini-advanced'
  },
  {
    aaSlug: 'gemini-2-0-pro',
    openRouterId: 'google/gemini-2.0-pro-exp-02-05:free',
    displayName: 'Gemini 2.0 Pro Exp',
    creator: 'Google',
    toolSlug: 'gemini-advanced'
  },
  {
    aaSlug: 'llama-3-3-70b-instruct',
    openRouterId: 'meta-llama/llama-3.3-70b-instruct',
    displayName: 'Llama 3.3 70B Instruct',
    creator: 'Meta',
    toolSlug: 'meta-ai'
  },
  {
    aaSlug: 'llama-3-1-405b-instruct',
    openRouterId: 'meta-llama/llama-3.1-405b-instruct',
    displayName: 'Llama 3.1 405B Instruct',
    creator: 'Meta',
    toolSlug: 'meta-ai'
  },
  {
    aaSlug: 'qwen-2-5-72b-instruct',
    openRouterId: 'qwen/qwen-2.5-72b-instruct',
    displayName: 'Qwen 2.5 72B Instruct',
    creator: 'Alibaba Qwen'
  },
  {
    aaSlug: 'mistral-large-2',
    openRouterId: 'mistralai/mistral-large-2411',
    displayName: 'Mistral Large 2',
    creator: 'Mistral AI',
    toolSlug: 'le-chat'
  },
  {
    aaSlug: 'codestral',
    openRouterId: 'mistralai/codestral-2501',
    displayName: 'Codestral 2501',
    creator: 'Mistral AI'
  },
  {
    aaSlug: 'grok-2',
    openRouterId: 'x-ai/grok-2-1212',
    displayName: 'Grok 2',
    creator: 'xAI',
    toolSlug: 'grok'
  }
];

export const AA_SLUG_TO_ALIAS = new Map<string, ModelAliasMapping>(
  MODEL_ALIASES.map((m) => [m.aaSlug, m])
);

export const OPENROUTER_ID_TO_ALIAS = new Map<string, ModelAliasMapping>(
  MODEL_ALIASES.map((m) => [m.openRouterId, m])
);
