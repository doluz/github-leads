export interface Topic {
  slug: string;
  label: string;       // e.g. "React"
  role: string;        // e.g. "React Developers"
  keyword: string;     // e.g. "find react developers on github"
  count: number;       // estimated developer count shown on page
  description: string; // one-line description for meta
}

function topic(slug: string, label: string, role: string, count: number): Topic {
  return {
    slug,
    label,
    role,
    keyword: `github leads for ${label.toLowerCase()}`,
    count,
    description: `Find ${count.toLocaleString()}+ ${label} leads on GitHub. GitLeads monitors GitHub stars, forks, and keyword signals to build your ${label} developer pipeline.`,
  };
}

export const TOPICS: Topic[] = [
  // JavaScript ecosystem
  topic('react-developers', 'React', 'React Developers', 284000),
  topic('nodejs-developers', 'Node.js', 'Node.js Developers', 341000),
  topic('typescript-developers', 'TypeScript', 'TypeScript Developers', 198000),
  topic('vue-developers', 'Vue.js', 'Vue.js Developers', 127000),
  topic('nextjs-developers', 'Next.js', 'Next.js Developers', 89000),
  topic('svelte-developers', 'Svelte', 'Svelte Developers', 42000),
  topic('angular-developers', 'Angular', 'Angular Developers', 115000),
  topic('nuxtjs-developers', 'Nuxt.js', 'Nuxt.js Developers', 38000),
  topic('remix-developers', 'Remix', 'Remix Developers', 21000),
  topic('electron-developers', 'Electron', 'Electron Developers', 54000),

  // Python ecosystem
  topic('python-developers', 'Python', 'Python Developers', 512000),
  topic('django-developers', 'Django', 'Django Developers', 143000),
  topic('fastapi-developers', 'FastAPI', 'FastAPI Developers', 67000),
  topic('flask-developers', 'Flask', 'Flask Developers', 119000),
  topic('pytorch-developers', 'PyTorch', 'PyTorch Developers', 88000),
  topic('tensorflow-developers', 'TensorFlow', 'TensorFlow Developers', 104000),
  topic('ml-engineers', 'Machine Learning', 'ML Engineers', 192000),
  topic('data-scientists', 'Data Science', 'Data Scientists', 231000),

  // Go
  topic('golang-engineers', 'Go', 'Go Engineers', 178000),
  topic('go-developers', 'Go', 'Go Developers', 178000),

  // Rust
  topic('rust-developers', 'Rust', 'Rust Developers', 94000),
  topic('rust-engineers', 'Rust', 'Rust Engineers', 94000),

  // Java / JVM
  topic('java-developers', 'Java', 'Java Developers', 387000),
  topic('kotlin-developers', 'Kotlin', 'Kotlin Developers', 112000),
  topic('spring-boot-developers', 'Spring Boot', 'Spring Boot Developers', 134000),
  topic('scala-developers', 'Scala', 'Scala Developers', 61000),
  topic('clojure-developers', 'Clojure', 'Clojure Developers', 24000),
  topic('groovy-developers', 'Groovy', 'Groovy Developers', 31000),

  // .NET / C#
  topic('csharp-developers', 'C#', 'C# Developers', 219000),
  topic('dotnet-developers', '.NET', '.NET Developers', 201000),
  topic('fsharp-developers', 'F#', 'F# Developers', 18000),
  topic('blazor-developers', 'Blazor', 'Blazor Developers', 29000),

  // PHP
  topic('php-developers', 'PHP', 'PHP Developers', 276000),
  topic('laravel-developers', 'Laravel', 'Laravel Developers', 98000),
  topic('wordpress-developers', 'WordPress', 'WordPress Developers', 143000),
  topic('symfony-developers', 'Symfony', 'Symfony Developers', 47000),

  // Ruby
  topic('ruby-developers', 'Ruby', 'Ruby Developers', 134000),
  topic('rails-developers', 'Ruby on Rails', 'Rails Developers', 87000),

  // Mobile
  topic('ios-developers', 'iOS', 'iOS Developers', 163000),
  topic('android-developers', 'Android', 'Android Developers', 198000),
  topic('swift-developers', 'Swift', 'Swift Developers', 121000),
  topic('flutter-developers', 'Flutter', 'Flutter Developers', 89000),
  topic('react-native-developers', 'React Native', 'React Native Developers', 76000),

  // Systems / Low-level
  topic('cpp-developers', 'C++', 'C++ Developers', 312000),
  topic('c-developers', 'C', 'C Developers', 289000),
  topic('embedded-engineers', 'Embedded Systems', 'Embedded Engineers', 72000),
  topic('webassembly-developers', 'WebAssembly', 'WebAssembly Developers', 31000),
  topic('zig-developers', 'Zig', 'Zig Developers', 14000),

  // DevOps / Cloud
  topic('devops-engineers', 'DevOps', 'DevOps Engineers', 167000),
  topic('kubernetes-engineers', 'Kubernetes', 'Kubernetes Engineers', 124000),
  topic('terraform-engineers', 'Terraform', 'Terraform Engineers', 98000),
  topic('aws-developers', 'AWS', 'AWS Developers', 187000),
  topic('gcp-engineers', 'Google Cloud', 'GCP Engineers', 89000),
  topic('azure-developers', 'Azure', 'Azure Developers', 112000),
  topic('docker-engineers', 'Docker', 'Docker Engineers', 198000),
  topic('helm-engineers', 'Helm', 'Helm Engineers', 42000),
  topic('ansible-engineers', 'Ansible', 'Ansible Engineers', 67000),
  topic('github-actions-engineers', 'GitHub Actions', 'GitHub Actions Engineers', 54000),

  // Data / Analytics
  topic('sql-developers', 'SQL', 'SQL Developers', 243000),
  topic('postgresql-developers', 'PostgreSQL', 'PostgreSQL Developers', 118000),
  topic('mongodb-developers', 'MongoDB', 'MongoDB Developers', 134000),
  topic('redis-developers', 'Redis', 'Redis Developers', 89000),
  topic('elasticsearch-engineers', 'Elasticsearch', 'Elasticsearch Engineers', 67000),
  topic('spark-engineers', 'Apache Spark', 'Spark Engineers', 54000),
  topic('kafka-engineers', 'Apache Kafka', 'Kafka Engineers', 61000),
  topic('dbt-developers', 'dbt', 'dbt Developers', 38000),

  // AI / ML specialty
  topic('llm-engineers', 'LLM', 'LLM Engineers', 47000),
  topic('ai-startup-founders', 'AI', 'AI Startup Founders', 28000),
  topic('langchain-developers', 'LangChain', 'LangChain Developers', 34000),
  topic('huggingface-developers', 'Hugging Face', 'Hugging Face Developers', 29000),
  topic('openai-developers', 'OpenAI API', 'OpenAI API Developers', 52000),

  // Web / APIs
  topic('graphql-developers', 'GraphQL', 'GraphQL Developers', 87000),
  topic('rest-api-developers', 'REST API', 'REST API Developers', 198000),
  topic('grpc-engineers', 'gRPC', 'gRPC Engineers', 44000),
  topic('webrtc-developers', 'WebRTC', 'WebRTC Developers', 31000),

  // Frontend specialty
  topic('tailwindcss-developers', 'Tailwind CSS', 'Tailwind CSS Developers', 89000),
  topic('threejs-developers', 'Three.js', 'Three.js Developers', 34000),
  topic('d3js-developers', 'D3.js', 'D3.js Developers', 42000),
  topic('storybook-developers', 'Storybook', 'Storybook Developers', 56000),

  // Security
  topic('security-engineers', 'Security', 'Security Engineers', 94000),
  topic('devsecops-engineers', 'DevSecOps', 'DevSecOps Engineers', 43000),
  topic('penetration-testers', 'Penetration Testing', 'Penetration Testers', 27000),

  // Other languages
  topic('elixir-developers', 'Elixir', 'Elixir Developers', 38000),
  topic('haskell-developers', 'Haskell', 'Haskell Developers', 22000),
  topic('ocaml-developers', 'OCaml', 'OCaml Developers', 14000),
  topic('lua-developers', 'Lua', 'Lua Developers', 41000),
  topic('r-developers', 'R', 'R Developers', 87000),
  topic('julia-developers', 'Julia', 'Julia Developers', 31000),
  topic('dart-developers', 'Dart', 'Dart Developers', 54000),
  topic('solidity-developers', 'Solidity', 'Solidity Developers', 42000),
  topic('web3-developers', 'Web3', 'Web3 Developers', 58000),
  topic('solana-developers', 'Solana', 'Solana Developers', 23000),
  topic('nix-developers', 'Nix', 'Nix Developers', 29000),

  // Frameworks / Tools
  topic('supabase-developers', 'Supabase', 'Supabase Developers', 44000),
  topic('prisma-developers', 'Prisma', 'Prisma Developers', 51000),
  topic('trpc-developers', 'tRPC', 'tRPC Developers', 29000),
  topic('tauri-developers', 'Tauri', 'Tauri Developers', 21000),
  topic('bun-developers', 'Bun', 'Bun Developers', 18000),
  topic('deno-developers', 'Deno', 'Deno Developers', 33000),
  topic('wasm-developers', 'Wasm', 'Wasm Developers', 27000),

  // Role-based topics
  topic('technical-founders', 'Technical Founders', 'Technical Founders', 48000),
  topic('startup-ctos', 'Startup CTOs', 'Startup CTOs', 31000),
  topic('vp-engineering', 'VP Engineering', 'VPs of Engineering', 22000),
  topic('devrel-engineers', 'DevRel', 'DevRel Engineers', 18000),
  topic('platform-engineers', 'Platform Engineering', 'Platform Engineers', 67000),
  topic('staff-engineers', 'Staff Engineers', 'Staff Engineers', 29000),
  topic('open-source-maintainers', 'Open Source Maintainers', 'Open Source Maintainers', 84000),
  topic('indie-hackers', 'Indie Hackers', 'Indie Hackers', 39000),
  topic('freelance-developers', 'Freelance Developers', 'Freelance Developers', 112000),

  // Industry verticals
  topic('fintech-developers', 'Fintech', 'Fintech Developers', 73000),
  topic('healthtech-developers', 'Healthtech', 'Healthtech Developers', 41000),
  topic('edtech-developers', 'Edtech', 'Edtech Developers', 34000),
  topic('gamedev-developers', 'Game Development', 'Game Developers', 91000),
  topic('blockchain-developers', 'Blockchain', 'Blockchain Developers', 64000),
  topic('climate-tech-developers', 'Climate Tech', 'Climate Tech Developers', 19000),
  topic('cybersecurity-engineers', 'Cybersecurity', 'Cybersecurity Engineers', 57000),
  topic('robotics-engineers', 'Robotics', 'Robotics Engineers', 28000),
  topic('iot-developers', 'IoT', 'IoT Developers', 52000),
  topic('arvr-developers', 'AR/VR', 'AR/VR Developers', 23000),

  // High-value platforms & ecosystems
  topic('shopify-developers', 'Shopify', 'Shopify Developers', 118000),
  topic('stripe-developers', 'Stripe', 'Stripe Developers', 89000),
  topic('vercel-developers', 'Vercel', 'Vercel Developers', 52000),
  topic('netlify-developers', 'Netlify', 'Netlify Developers', 34000),
  topic('firebase-developers', 'Firebase', 'Firebase Developers', 97000),
  topic('expo-developers', 'Expo', 'Expo Developers', 44000),
  topic('astro-developers', 'Astro', 'Astro Developers', 31000),
  topic('htmx-developers', 'HTMX', 'HTMX Developers', 21000),

  // Roles with high search volume
  topic('full-stack-developers', 'Full-Stack', 'Full-Stack Developers', 421000),
  topic('sre-engineers', 'Site Reliability', 'SRE Engineers', 74000),
  topic('backend-developers', 'Backend', 'Backend Developers', 312000),
  topic('frontend-developers', 'Frontend', 'Frontend Developers', 287000),
  topic('ai-engineers', 'AI Engineering', 'AI Engineers', 63000),
  topic('vibe-coders', 'Vibe Coding', 'Vibe Coders', 14000),

  // Infrastructure & observability
  topic('prometheus-engineers', 'Prometheus', 'Prometheus Engineers', 48000),
  topic('grafana-engineers', 'Grafana', 'Grafana Engineers', 54000),
  topic('opentelemetry-engineers', 'OpenTelemetry', 'OpenTelemetry Engineers', 31000),
  topic('datadog-engineers', 'Datadog', 'Datadog Engineers', 27000),
  topic('cilium-engineers', 'Cilium', 'Cilium Engineers', 12000),
  topic('istio-engineers', 'Istio', 'Istio Engineers', 23000),

  // Roles (gaps)
  topic('engineering-managers', 'Engineering Managers', 'Engineering Managers', 71000),
  topic('developer-advocates', 'Developer Advocates', 'Developer Advocates', 18000),
  topic('growth-engineers', 'Growth Engineering', 'Growth Engineers', 22000),
  topic('solutions-engineers', 'Solutions Engineering', 'Solutions Engineers', 34000),

  // Cloud / Serverless (gaps)
  topic('serverless-developers', 'Serverless', 'Serverless Developers', 67000),
  topic('aws-lambda-developers', 'AWS Lambda', 'AWS Lambda Developers', 48000),
  topic('cloudflare-workers-developers', 'Cloudflare Workers', 'Cloudflare Workers Developers', 24000),

  // Scripting / systems (gaps)
  topic('powershell-developers', 'PowerShell', 'PowerShell Developers', 41000),
  topic('bash-shell-developers', 'Bash/Shell', 'Bash/Shell Developers', 54000),

  // Industry verticals (gaps)
  topic('legaltech-developers', 'Legaltech', 'Legaltech Developers', 12000),
  topic('proptech-developers', 'Proptech', 'Proptech Developers', 14000),
  topic('insurtech-developers', 'Insurtech', 'Insurtech Developers', 11000),
  topic('adtech-developers', 'AdTech', 'AdTech Developers', 19000),

  // Editor / tooling niche
  topic('neovim-developers', 'Neovim', 'Neovim Developers', 21000),
  topic('vscode-extension-developers', 'VS Code Extensions', 'VS Code Extension Developers', 23000),

  // Infrastructure tools (gaps)
  topic('pulumi-engineers', 'Pulumi', 'Pulumi Engineers', 18000),
  topic('nats-engineers', 'NATS', 'NATS Engineers', 14000),
  topic('temporal-developers', 'Temporal', 'Temporal Developers', 16000),

  // AI / Agentic ecosystem (2026 growth areas)
  topic('mcp-developers', 'MCP (Model Context Protocol)', 'MCP Developers', 38000),
  topic('ai-agent-developers', 'AI Agents', 'AI Agent Developers', 54000),
  topic('cursor-developers', 'Cursor', 'Cursor Developers', 29000),
  topic('windsurf-developers', 'Windsurf', 'Windsurf Developers', 17000),
  topic('claude-api-developers', 'Claude API', 'Claude API Developers', 22000),
  topic('pydantic-developers', 'Pydantic', 'Pydantic Developers', 61000),
  topic('pydantic-ai-developers', 'Pydantic AI', 'Pydantic AI Developers', 19000),
  topic('uv-developers', 'uv (Python)', 'uv Python Developers', 31000),
  topic('agentic-ai-developers', 'Agentic AI', 'Agentic AI Developers', 28000),
  topic('llm-ops-engineers', 'LLMOps', 'LLMOps Engineers', 24000),
  topic('rag-developers', 'RAG (Retrieval-Augmented Generation)', 'RAG Developers', 33000),
  topic('vllm-engineers', 'vLLM', 'vLLM Engineers', 21000),
  topic('ollama-developers', 'Ollama', 'Ollama Developers', 34000),

  // UI component libraries
  topic('shadcn-ui-developers', 'shadcn/ui', 'shadcn/ui Developers', 67000),

  // AI agent frameworks (2026 growth)
  topic('crewai-developers', 'CrewAI', 'CrewAI Developers', 31000),
  topic('autogen-developers', 'AutoGen', 'AutoGen Developers', 24000),
  topic('langgraph-developers', 'LangGraph', 'LangGraph Developers', 22000),
  topic('dify-developers', 'Dify', 'Dify Developers', 28000),
  topic('langfuse-developers', 'Langfuse', 'Langfuse Developers', 19000),

  // Workflow automation
  topic('n8n-developers', 'n8n', 'n8n Developers', 44000),
  topic('airflow-developers', 'Apache Airflow', 'Apache Airflow Developers', 81000),
  topic('prefect-developers', 'Prefect', 'Prefect Developers', 22000),

  // Serverless / deployment platforms
  topic('modal-developers', 'Modal', 'Modal Developers', 18000),
  topic('railway-developers', 'Railway', 'Railway Developers', 23000),
  topic('flyio-developers', 'Fly.io', 'Fly.io Developers', 26000),

  // Databases / data layer
  topic('drizzle-orm-developers', 'Drizzle ORM', 'Drizzle ORM Developers', 34000),
  topic('convex-developers', 'Convex', 'Convex Developers', 21000),
  topic('neon-developers', 'Neon (Serverless Postgres)', 'Neon Developers', 19000),
  topic('turso-developers', 'Turso', 'Turso Developers', 14000),
  topic('electric-sql-developers', 'ElectricSQL', 'ElectricSQL Developers', 11000),

  // State management / frontend
  topic('zustand-developers', 'Zustand', 'Zustand Developers', 42000),
  topic('rxjs-developers', 'RxJS', 'RxJS Developers', 51000),

  // HTTP / web server frameworks (2026 growth)
  topic('hono-developers', 'Hono', 'Hono Developers', 31000),
  topic('fastify-developers', 'Fastify', 'Fastify Developers', 54000),
  topic('elysia-developers', 'Elysia', 'Elysia Developers', 14000),
  topic('phoenix-developers', 'Phoenix (Elixir)', 'Phoenix Developers', 44000),

  // Testing
  topic('playwright-developers', 'Playwright', 'Playwright Developers', 78000),
  topic('vitest-developers', 'Vitest', 'Vitest Developers', 42000),
  topic('cypress-developers', 'Cypress', 'Cypress Developers', 61000),
  topic('jest-developers', 'Jest', 'Jest Developers', 89000),

  // Databases (gaps)
  topic('cockroachdb-developers', 'CockroachDB', 'CockroachDB Developers', 28000),
  topic('planetscale-developers', 'PlanetScale', 'PlanetScale Developers', 19000),
  topic('singlestore-developers', 'SingleStore', 'SingleStore Developers', 12000),

  // AI / API providers (2026 growth)
  topic('anthropic-api-developers', 'Anthropic API', 'Anthropic API Developers', 31000),
  topic('gemini-api-developers', 'Gemini API', 'Gemini API Developers', 28000),
  topic('vercel-ai-sdk-developers', 'Vercel AI SDK', 'Vercel AI SDK Developers', 24000),
  topic('mistral-developers', 'Mistral AI', 'Mistral AI Developers', 19000),

  // CMS / content
  topic('sanity-developers', 'Sanity', 'Sanity Developers', 34000),
  topic('contentful-developers', 'Contentful', 'Contentful Developers', 28000),
  topic('headless-cms-developers', 'Headless CMS', 'Headless CMS Developers', 41000),
  topic('strapi-developers', 'Strapi', 'Strapi Developers', 31000),

  // GitOps / CD
  topic('argocd-engineers', 'Argo CD', 'Argo CD Engineers', 44000),
  topic('fluxcd-engineers', 'Flux CD', 'Flux CD Engineers', 28000),
  topic('crossplane-engineers', 'Crossplane', 'Crossplane Engineers', 18000),

  // Design / tooling
  topic('figma-plugin-developers', 'Figma Plugin', 'Figma Plugin Developers', 23000),

  // Emerging languages
  topic('gleam-developers', 'Gleam', 'Gleam Developers', 12000),
  topic('nim-developers', 'Nim', 'Nim Developers', 17000),

  // Infrastructure & architecture patterns
  topic('mlops-engineers', 'MLOps', 'MLOps Engineers', 58000),
  topic('vector-database-developers', 'Vector Databases', 'Vector Database Developers', 34000),
  topic('cloud-native-developers', 'Cloud Native', 'Cloud Native Developers', 91000),
  topic('observability-engineers', 'Observability', 'Observability Engineers', 67000),
  topic('microservices-developers', 'Microservices', 'Microservices Developers', 112000),
  topic('event-driven-developers', 'Event-Driven Architecture', 'Event-Driven Developers', 44000),
  topic('service-mesh-engineers', 'Service Mesh', 'Service Mesh Engineers', 28000),
  topic('distributed-systems-engineers', 'Distributed Systems', 'Distributed Systems Engineers', 54000),
  topic('api-gateway-developers', 'API Gateway', 'API Gateway Developers', 41000),

  // Developer tooling
  topic('cli-tool-developers', 'CLI Tools', 'CLI Tool Developers', 63000),
  topic('developer-experience-engineers', 'Developer Experience', 'Developer Experience Engineers', 29000),
  topic('gpu-developers', 'GPU Computing', 'GPU Developers', 38000),
  topic('real-time-developers', 'Real-Time Systems', 'Real-Time Developers', 47000),
  topic('low-code-developers', 'Low-Code', 'Low-Code Developers', 73000),
];

export const TOPICS_MAP: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t])
);

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS_MAP[slug];
}
