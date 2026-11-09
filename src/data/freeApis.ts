import { FreeApiProvider } from '../types/index.ts';

export const FREE_API_PROVIDERS: FreeApiProvider[] = [
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio (Gemini)',
    websiteUrl: 'https://aistudio.google.com',
    getKeyUrl: 'https://aistudio.google.com/apikey',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    limitsUrl: 'https://ai.google.dev/pricing',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'GEMINI_API_KEY',
    bestFor: 'Multimodal input (images, video, audio, PDFs) with up to 2M token context and generous free rate limits.',
    freeTierSummary: 'Free tier includes Gemini 2.0 Flash and Gemini 1.5 Pro with 15 RPM (requests per minute) and 1,500 RPD (requests per day). See provider limits page.',
    regionNotes: 'Available in 180+ countries and territories.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign in to Google AI Studio',
        instruction: 'Navigate to Google AI Studio and sign in with any standard Google account. No credit card or billing configuration is required for the free tier.'
      },
      {
        title: 'Generate an API Key',
        instruction: 'Click the "Get API key" button in the left sidebar or visit https://aistudio.google.com/apikey. Create a key in a new Google Cloud project with one click.'
      },
      {
        title: 'Save Environment Variable in .env',
        instruction: 'Save your key locally in your project root `.env` file using the standard environment variable name:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'GEMINI_API_KEY="AIzaSyYourGeneratedSecretKeyHere"'
        }
      },
      {
        title: 'Verify with cURL Test',
        instruction: 'Send a quick test request from your terminal to verify your key and inspect the output latency:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GEMINI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"contents": [{"parts":[{"text": "Explain quantum computing in one sentence."}]}]}\''
        }
      },
      {
        title: 'Copy-Paste Code Snippet',
        instruction: 'Use the official @google/genai SDK or the OpenAI-compatible endpoint in Node.js and Python:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'index.ts',
          code: 'import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\n\nconst response = await ai.models.generateContent({\n  model: "gemini-2.0-flash",\n  contents: "Explain quantum computing in one sentence."\n});\n\nconsole.log(response.text);'
        }
      },
      {
        title: 'Error Handling & Quota Monitoring',
        instruction: 'Common error codes:\n• 401 Unauthorized: Invalid API key or project not linked.\n• 429 Too Many Requests: Exceeded 15 RPM. Implement exponential backoff or batch prompts.\nMonitor your live quota in the Google AI Studio Dashboard.',
        note: 'Never check API keys into git or client-side bundles. Always access through backend proxy routes.'
      }
    ]
  },
  {
    id: 'groq',
    name: 'GroqCloud (LPU Inference)',
    websiteUrl: 'https://groq.com',
    getKeyUrl: 'https://console.groq.com/keys',
    docsUrl: 'https://console.groq.com/docs/quickstart',
    limitsUrl: 'https://console.groq.com/docs/rate-limits',
    baseUrl: 'https://api.groq.com/openai/v1',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'GROQ_API_KEY',
    bestFor: 'Ultra-low latency inference (300-800 tokens/sec) for Llama 3.3 70B, DeepSeek R1 Distill, and Whisper audio.',
    freeTierSummary: 'Free tier with generous per-minute token and request allowances (e.g. 30 RPM / 14,400 RPD for top models). See provider limits page.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign Up for GroqCloud',
        instruction: 'Create an account at https://console.groq.com using your email, Google, or GitHub account. No credit card required.'
      },
      {
        title: 'Generate API Key',
        instruction: 'Navigate to "API Keys" in the left menu and click "Create API Key". Give it a name (e.g., "my-app") and copy the secret token.'
      },
      {
        title: 'Store Secret in .env',
        instruction: 'Add the token to your local environment file:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'GROQ_API_KEY="gsk_YourSecretGroqKeyHere"'
        }
      },
      {
        title: 'Test with cURL',
        instruction: 'Run an OpenAI-compatible completion test directly from your command line:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://api.groq.com/openai/v1/chat/completions \\\n  -H "Authorization: Bearer $GROQ_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "model": "llama-3.3-70b-versatile",\n    "messages": [{"role": "user", "content": "What is 12*12?"}]\n  }\''
        }
      },
      {
        title: 'Integration Code (OpenAI SDK Compatible)',
        instruction: 'Drop in your Groq key with standard OpenAI libraries simply by pointing the baseURL:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'groqClient.ts',
          code: 'import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.GROQ_API_KEY,\n  baseURL: "https://api.groq.com/openai/v1"\n});\n\nconst chat = await client.chat.completions.create({\n  model: "llama-3.3-70b-versatile",\n  messages: [{ role: "user", content: "Write a haiku about high speed." }]\n});\n\nconsole.log(chat.choices[0].message.content);'
        }
      },
      {
        title: 'Error Handling & Monitoring',
        instruction: 'Common status responses:\n• 401 Unauthorized: Invalid `gsk_` format or revoked key.\n• 429 Rate Limit Exceeded: Check `x-ratelimit-remaining-tokens` in response headers.\nView live usage charts at https://console.groq.com/usage.'
      }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Community Free Tier)',
    websiteUrl: 'https://openrouter.ai',
    getKeyUrl: 'https://openrouter.ai/keys',
    docsUrl: 'https://openrouter.ai/docs',
    limitsUrl: 'https://openrouter.ai/docs/limits',
    baseUrl: 'https://openrouter.ai/api/v1',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'OPENROUTER_API_KEY',
    bestFor: 'Accessing 20+ completely free open-weights and reasoning models (DeepSeek R1, Llama 3.3, Gemini Exp, Mistral) through one unified API.',
    freeTierSummary: 'Models suffixed with `:free` have $0 prompt and completion token costs. 20 requests/minute limit on free tier. See provider limits page.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign In to OpenRouter',
        instruction: 'Create an account on https://openrouter.ai via Google, GitHub, or crypto wallet. Zero billing info needed for free models.'
      },
      {
        title: 'Create Free Tier API Key',
        instruction: 'Go to https://openrouter.ai/keys and click "Create Key". Set a credit limit of $0 to guarantee you never incur surprise fees.'
      },
      {
        title: 'Add to .env',
        instruction: 'Save the secret token in your local environment:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'OPENROUTER_API_KEY="sk-or-v1-YourKeyHere"'
        }
      },
      {
        title: 'Test with Free DeepSeek R1',
        instruction: 'Send a cURL request targeting the free variant of DeepSeek R1:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://openrouter.ai/api/v1/chat/completions \\\n  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "model": "deepseek/deepseek-r1:free",\n    "messages": [{"role": "user", "content": "Hello!"}]\n  }\''
        }
      },
      {
        title: 'Node.js & Python Code Snippet',
        instruction: 'Compatible with standard OpenAI client SDKs:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'openRouterClient.ts',
          code: 'import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENROUTER_API_KEY,\n  baseURL: "https://openrouter.ai/api/v1",\n  defaultHeaders: {\n    "HTTP-Referer": "https://yourdomain.com",\n    "X-Title": "AI Finder Tech"\n  }\n});\n\nconst completion = await client.chat.completions.create({\n  model: "deepseek/deepseek-r1:free",\n  messages: [{ role: "user", content: "Write a quick test message." }]\n});\n\nconsole.log(completion.choices[0].message.content);'
        }
      },
      {
        title: 'Limits & Provider Fallback',
        instruction: 'If a free model is temporarily busy (HTTP 429 or 503), route to another free fallback model like `meta-llama/llama-3.3-70b-instruct:free`.'
      }
    ]
  },
  {
    id: 'cerebras',
    name: 'Cerebras Inference',
    websiteUrl: 'https://cerebras.ai',
    getKeyUrl: 'https://cloud.cerebras.ai',
    docsUrl: 'https://inference-docs.cerebras.ai',
    limitsUrl: 'https://inference-docs.cerebras.ai/pricing',
    baseUrl: 'https://api.cerebras.ai/v1',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: 'unknown',
    envVarName: 'CEREBRAS_API_KEY',
    bestFor: 'World-record wafer-scale token generation speeds (1,800+ tokens/sec) for Llama models.',
    freeTierSummary: 'Free developer tier includes 1M tokens/day with up to 30 RPM without requiring a credit card. See provider limits page.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Register on Cerebras Cloud',
        instruction: 'Sign up at https://cloud.cerebras.ai with email or GitHub.'
      },
      {
        title: 'Create Developer Key',
        instruction: 'Navigate to "API Keys" in the dashboard and generate your credential.'
      },
      {
        title: 'Set in .env',
        instruction: 'Store the key safely in `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'CEREBRAS_API_KEY="csk-YourCerebrasTokenHere"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Test wafer-scale throughput with a quick curl command:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://api.cerebras.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $CEREBRAS_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "llama3.1-70b", "messages": [{"role": "user", "content": "Fast test"}]}\''
        }
      },
      {
        title: 'Integration Code',
        instruction: 'Standard OpenAI-compatible client configuration:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'cerebrasClient.ts',
          code: 'import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.CEREBRAS_API_KEY,\n  baseURL: "https://api.cerebras.ai/v1"\n});\n\nconst res = await client.chat.completions.create({\n  model: "llama3.1-70b",\n  messages: [{ role: "user", content: "Explain wafer-scale engine." }]\n});\n\nconsole.log(res.choices[0].message.content);'
        }
      },
      {
        title: 'Rate Limits & Best Practices',
        instruction: 'Free developers receive up to 1M tokens per day. Monitor your counter in Cerebras Cloud usage overview.'
      }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI (Experiment Tier)',
    websiteUrl: 'https://mistral.ai',
    getKeyUrl: 'https://console.mistral.ai',
    docsUrl: 'https://docs.mistral.ai',
    limitsUrl: 'https://docs.mistral.ai/getting-started/pricing',
    baseUrl: 'https://api.mistral.ai/v1',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'MISTRAL_API_KEY',
    bestFor: 'Mistral Large 2, Codestral, Pixtral vision, and multilingual European language tasks.',
    freeTierSummary: 'Free "Experiment" plan provides access to open models with rate limits of 1 RPS (request per second). Phone verification may be requested.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign In to La Plateforme',
        instruction: 'Go to https://console.mistral.ai and sign in with email, Google, or GitHub.'
      },
      {
        title: 'Create API Key',
        instruction: 'Select "API Keys" and create a key under the Experiment plan.'
      },
      {
        title: 'Set in .env',
        instruction: 'Save key in `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'MISTRAL_API_KEY="YourMistralSecretKeyHere"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Test with a curl call:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://api.mistral.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $MISTRAL_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "mistral-small-latest", "messages": [{"role": "user", "content": "Bonjour!"}]}\''
        }
      },
      {
        title: 'JavaScript Integration',
        instruction: 'Call via official @mistralai/mistralai SDK or OpenAI compatibility:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'mistralClient.ts',
          code: 'import { Mistral } from "@mistralai/mistralai";\n\nconst client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });\n\nconst res = await client.chat.complete({\n  model: "mistral-small-latest",\n  messages: [{ role: "user", content: "Bonjour!" }]\n});\n\nconsole.log(res.choices?.[0]?.message?.content);'
        }
      },
      {
        title: 'Error Handling',
        instruction: 'Experiment plan enforces 1 request per second. Use throttled queues for sequential processing.'
      }
    ]
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM Microservices',
    websiteUrl: 'https://build.nvidia.com',
    getKeyUrl: 'https://build.nvidia.com/settings/api-keys',
    docsUrl: 'https://docs.api.nvidia.com',
    limitsUrl: 'https://build.nvidia.com/explore/discover',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: true,
    envVarName: 'NVIDIA_API_KEY',
    bestFor: 'NVIDIA-optimized Llama 3.3, Nemotron reasoning, and multimodal vision models on enterprise H100 clusters.',
    freeTierSummary: 'Free developer account receives 1,000 free inference credits upon registration. Requires mobile phone SMS verification. See provider page.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign In to NVIDIA Build',
        instruction: 'Go to https://build.nvidia.com. Sign in with an NVIDIA developer account (SMS phone verification required).'
      },
      {
        title: 'Generate API Key',
        instruction: 'Under profile settings, navigate to "API Keys" and click "Generate Key". 1,000 complimentary credits are pre-loaded.'
      },
      {
        title: 'Save in .env',
        instruction: 'Save key in `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'NVIDIA_API_KEY="nvapi-YourKeyHere"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Test with cURL:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://integrate.api.nvidia.com/v1/chat/completions \\\n  -H "Authorization: Bearer $NVIDIA_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "meta/llama-3.3-70b-instruct", "messages": [{"role": "user", "content": "Hello NVIDIA"}]}\''
        }
      },
      {
        title: 'Client Code',
        instruction: 'Use with standard OpenAI client SDK:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'nvidiaClient.ts',
          code: 'import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.NVIDIA_API_KEY,\n  baseURL: "https://integrate.api.nvidia.com/v1"\n});\n\nconst res = await client.chat.completions.create({\n  model: "meta/llama-3.3-70b-instruct",\n  messages: [{ role: "user", content: "Summarize GPU acceleration." }]\n});\n\nconsole.log(res.choices[0].message.content);'
        }
      },
      {
        title: 'Credits & Renewal',
        instruction: 'Track remaining free credits in the top-right account dropdown. Credits refresh for active research projects.'
      }
    ]
  },
  {
    id: 'github-models',
    name: 'GitHub Models (Marketplace)',
    websiteUrl: 'https://github.com/marketplace/models',
    getKeyUrl: 'https://github.com/settings/tokens',
    docsUrl: 'https://docs.github.com/en/github-models',
    limitsUrl: 'https://docs.github.com/en/github-models/prototyping-with-ai-models#rate-limits',
    baseUrl: 'https://models.inference.ai.azure.com',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'GITHUB_TOKEN',
    bestFor: 'Prototyping directly with your existing GitHub personal access token across GPT-4o, Claude 3.5, and Llama 3.3.',
    freeTierSummary: 'Free tier for all GitHub users (15 requests/min, 150 requests/day for top tier models; 50 RPM for smaller models). No credit card required.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign In to GitHub',
        instruction: 'No new account needed! Visit https://github.com/marketplace/models while signed in to your standard GitHub profile.'
      },
      {
        title: 'Generate Personal Access Token (PAT)',
        instruction: 'Go to https://github.com/settings/tokens. Create a fine-grained or classic token. No special repository permissions are required for inference.'
      },
      {
        title: 'Save in .env',
        instruction: 'Add token to `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'GITHUB_TOKEN="ghp_YourGitHubTokenHere"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Test endpoint directly:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://models.inference.ai.azure.com/chat/completions \\\n  -H "Authorization: Bearer $GITHUB_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "gpt-4o", "messages": [{"role": "user", "content": "Test GitHub Models"}]}\''
        }
      },
      {
        title: 'Client Code',
        instruction: 'OpenAI client drop-in:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'githubModels.ts',
          code: 'import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.GITHUB_TOKEN,\n  baseURL: "https://models.inference.ai.azure.com"\n});\n\nconst response = await client.chat.completions.create({\n  model: "gpt-4o",\n  messages: [{ role: "user", content: "Explain git rebase in simple terms." }]\n});\n\nconsole.log(response.choices[0].message.content);'
        }
      },
      {
        title: 'Limits & Policy',
        instruction: 'Intended for prototyping and evaluation. Free tier resets every 24 hours. See docs for complete tier limits.'
      }
    ]
  },
  {
    id: 'cloudflare-workers-ai',
    name: 'Cloudflare Workers AI',
    websiteUrl: 'https://cloudflare.com',
    getKeyUrl: 'https://dash.cloudflare.com',
    docsUrl: 'https://developers.cloudflare.com/workers-ai',
    limitsUrl: 'https://developers.cloudflare.com/workers-ai/platform/pricing',
    baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'CLOUDFLARE_API_TOKEN',
    bestFor: 'Serverless edge inference integrated into Cloudflare Workers with 10,000 free Neurons daily.',
    freeTierSummary: 'Free tier includes 10,000 Neurons per day (~approx. 100k-200k tokens depending on model size). See Cloudflare pricing documentation.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign Up for Cloudflare',
        instruction: 'Create an account at https://dash.cloudflare.com. The free plan is completely free and requires no credit card.'
      },
      {
        title: 'Create Workers AI API Token',
        instruction: 'Go to "My Profile" > "API Tokens" > "Create Token" using the "Workers AI" template. Copy your Account ID from the dashboard URL.'
      },
      {
        title: 'Save in .env',
        instruction: 'Store both Account ID and Token:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'CLOUDFLARE_ACCOUNT_ID="your_account_id"\nCLOUDFLARE_API_TOKEN="your_token"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Test endpoint directly:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/ai/run/@cf/meta/llama-3.3-70b-instruct \\\n  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"prompt": "Hello edge AI"}\''
        }
      },
      {
        title: 'JavaScript Snippet',
        instruction: 'Call via fetch or official Cloudflare Workers binding:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'cfAi.ts',
          code: 'const res = await fetch(\n  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct`,\n  {\n    method: "POST",\n    headers: {\n      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,\n      "Content-Type": "application/json"\n    },\n    body: JSON.stringify({ prompt: "What is an edge worker?" })\n  }\n);\nconst data = await res.json();\nconsole.log(data.result.response);'
        }
      },
      {
        title: 'Daily Neuron Reset',
        instruction: 'Free Neurons reset every day at 00:00 UTC. Check usage under Workers & Pages > AI in the dashboard.'
      }
    ]
  },
  {
    id: 'huggingface-inference',
    name: 'Hugging Face Serverless Inference',
    websiteUrl: 'https://huggingface.co',
    getKeyUrl: 'https://huggingface.co/settings/tokens',
    docsUrl: 'https://huggingface.co/docs/api-inference',
    limitsUrl: 'https://huggingface.co/pricing',
    baseUrl: 'https://api-inference.huggingface.co/models',
    openAiCompatible: true,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'HF_TOKEN',
    bestFor: 'Instant serverless inference on 100,000+ open-source transformers, embeddings, and computer vision models.',
    freeTierSummary: 'Free community tier with standard rate limits (10-30 requests per minute depending on community server load). No credit card required.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign In to Hugging Face',
        instruction: 'Register at https://huggingface.co using your email.'
      },
      {
        title: 'Create Access Token',
        instruction: 'Go to Settings > Access Tokens > "New Token" (select "Read" permission).'
      },
      {
        title: 'Set in .env',
        instruction: 'Store in `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'HF_TOKEN="hf_YourSecretTokenHere"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Run test on any supported open model:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct \\\n  -H "Authorization: Bearer $HF_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"inputs": "Tell me a joke."}\''
        }
      },
      {
        title: 'Code Example',
        instruction: 'Using @huggingface/inference SDK:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'hfClient.ts',
          code: 'import { HfInference } from "@huggingface/inference";\n\nconst hf = new HfInference(process.env.HF_TOKEN);\n\nconst out = await hf.chatCompletion({\n  model: "meta-llama/Llama-3.2-3B-Instruct",\n  messages: [{ role: "user", content: "Tell me a joke." }]\n});\n\nconsole.log(out.choices[0].message.content);'
        }
      },
      {
        title: 'Cold Starts & Queues',
        instruction: 'Uncached models may return a 503 "Model loading" state. Check `estimated_time` and retry after a short delay.'
      }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere (Trial Developer Key)',
    websiteUrl: 'https://cohere.com',
    getKeyUrl: 'https://dashboard.cohere.com/api-keys',
    docsUrl: 'https://docs.cohere.com',
    limitsUrl: 'https://cohere.com/pricing',
    baseUrl: 'https://api.cohere.com/v2',
    openAiCompatible: false,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'CO_API_KEY',
    bestFor: 'State-of-the-art multilingual text embeddings, RAG reranking (Rerank 3.5), and Command R+ models.',
    freeTierSummary: 'Free trial key includes 1,000 API calls per month and 100 RPM for prototyping. No credit card required. Commercial deployment requires upgrade.',
    lastVerified: '2026-03-08',
    steps: [
      {
        title: 'Sign Up for Cohere Dashboard',
        instruction: 'Create an account at https://dashboard.cohere.com.'
      },
      {
        title: 'Obtain Trial Key',
        instruction: 'A trial key is created automatically on your dashboard under "API Keys".'
      },
      {
        title: 'Save in .env',
        instruction: 'Add key to `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'CO_API_KEY="YourCohereTrialKey"'
        }
      },
      {
        title: 'cURL Verification',
        instruction: 'Test reranking or chat:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://api.cohere.com/v2/chat \\\n  -H "Authorization: Bearer $CO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model": "command-r-plus-08-2024", "messages": [{"role": "user", "content": {"type": "text", "text": "Hello"}}}\''
        }
      },
      {
        title: 'Client Code',
        instruction: 'Using official cohere-ai SDK:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'cohereClient.ts',
          code: 'import { CohereClientV2 } from "cohere-ai";\n\nconst cohere = new CohereClientV2({ token: process.env.CO_API_KEY });\n\nconst response = await cohere.chat({\n  model: "command-r-plus-08-2024",\n  messages: [{ role: "user", content: "What are embeddings?" }]\n});\n\nconsole.log(response.message?.content?.[0]?.text);'
        }
      },
      {
        title: 'Rate Limits & Upgrades',
        instruction: 'Trial keys are strictly rate limited and cannot be used for commercial production. View quotas at https://dashboard.cohere.com.'
      }
    ]
  },

  // ==========================================
  // DATA APIS (Public & Programmatic)
  // ==========================================
  {
    id: 'openrouter-models-api',
    name: 'OpenRouter Models Public API',
    websiteUrl: 'https://openrouter.ai',
    getKeyUrl: 'https://openrouter.ai',
    docsUrl: 'https://openrouter.ai/docs/overview/models',
    limitsUrl: 'https://openrouter.ai/docs/limits',
    baseUrl: 'https://openrouter.ai/api/v1/models',
    openAiCompatible: false,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'NONE_REQUIRED',
    bestFor: 'Live programmatic retrieval of active pricing, context windows, and availability across 400+ models without requiring any API key.',
    freeTierSummary: '100% public GET endpoint with zero key required. Public rate limit of 100 requests per 10 minutes. See docs.',
    lastVerified: '2026-03-08',
    isDataApi: true,
    attributionNote: 'Public data endpoint provided by OpenRouter.',
    steps: [
      {
        title: 'Zero Registration Needed',
        instruction: 'This is a completely public REST endpoint. You do not need to register, configure keys, or send headers.'
      },
      {
        title: 'Fetch Endpoint via cURL',
        instruction: 'Run directly in your terminal:',
        codeSnippet: {
          lang: 'bash',
          filename: 'fetch.sh',
          code: 'curl https://openrouter.ai/api/v1/models | jq \'.data[0]\''
        }
      },
      {
        title: 'Filter Free Models in JavaScript',
        instruction: 'Query all free-tier models programmatically with fetch:',
        codeSnippet: {
          lang: 'typescript',
          filename: 'fetchFreeModels.ts',
          code: 'const res = await fetch("https://openrouter.ai/api/v1/models");\nconst { data } = await res.json();\n\nconst freeModels = data.filter((m: any) => \n  m.pricing?.prompt === "0" && m.pricing?.completion === "0"\n);\n\nconsole.log(`Found ${freeModels.length} free models:`);\nfreeModels.forEach((m: any) => console.log(`• ${m.name} (${m.id})`));'
        }
      },
      {
        title: 'Monitoring & Caching',
        instruction: 'Cache this response locally or on your server for 1-6 hours to avoid hitting the public IP rate limit.'
      }
    ]
  },
  {
    id: 'artificial-analysis-api',
    name: 'Artificial Analysis Data API',
    websiteUrl: 'https://artificialanalysis.ai',
    getKeyUrl: 'https://artificialanalysis.ai/account',
    docsUrl: 'https://artificialanalysis.ai/api-reference',
    limitsUrl: 'https://artificialanalysis.ai/api-reference',
    baseUrl: 'https://artificialanalysis.ai/api/v2',
    openAiCompatible: false,
    creditCardRequired: 'no',
    phoneVerification: false,
    envVarName: 'ARTIFICIAL_ANALYSIS_API_KEY',
    bestFor: 'Programmatic access to independent LLM intelligence indices, latency speed (tokens/sec), TTFT, and verified host pricing.',
    freeTierSummary: 'Free tier includes 1,000 requests per day with API key via `x-api-key` header. Attribution required in UI ("Data: Artificial Analysis").',
    lastVerified: '2026-03-08',
    isDataApi: true,
    attributionNote: 'Data provided by Artificial Analysis (https://artificialanalysis.ai).',
    steps: [
      {
        title: 'Create Account on Artificial Analysis',
        instruction: 'Sign up at https://artificialanalysis.ai/account to request free developer API access.'
      },
      {
        title: 'Copy API Key',
        instruction: 'Copy your key and configure it in your environment under `ARTIFICIAL_ANALYSIS_API_KEY`.'
      },
      {
        title: 'Save in .env',
        instruction: 'Add to `.env`:',
        codeSnippet: {
          lang: 'bash',
          filename: '.env',
          code: 'ARTIFICIAL_ANALYSIS_API_KEY="YourAAKeyHere"'
        }
      },
      {
        title: 'Fetch Model Evaluations with cURL',
        instruction: 'Pass your key in the `x-api-key` header:',
        codeSnippet: {
          lang: 'bash',
          filename: 'test.sh',
          code: 'curl https://artificialanalysis.ai/api/v2/language/models \\\n  -H "x-api-key: $ARTIFICIAL_ANALYSIS_API_KEY"'
        }
      },
      {
        title: 'Attribution Requirement',
        instruction: 'Attribution is mandatory under the free tier terms: ensure your UI links to Artificial Analysis in footer or chart cards.'
      }
    ]
  }
];

export const FREE_API_BY_ID = new Map<string, FreeApiProvider>(
  FREE_API_PROVIDERS.map((p) => [p.id, p])
);
