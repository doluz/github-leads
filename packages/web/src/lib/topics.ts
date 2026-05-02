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

  // Build tools & bundlers
  topic('vite-developers', 'Vite', 'Vite Developers', 89000),
  topic('turborepo-developers', 'Turborepo', 'Turborepo Developers', 34000),
  topic('nx-developers', 'Nx', 'Nx Developers', 41000),
  topic('esbuild-developers', 'esbuild', 'esbuild Developers', 28000),
  topic('webpack-developers', 'Webpack', 'Webpack Developers', 143000),
  topic('biome-developers', 'Biome', 'Biome Developers', 22000),
  topic('ruff-developers', 'Ruff', 'Ruff Developers', 31000),

  // Frontend frameworks (gaps)
  topic('solidjs-developers', 'SolidJS', 'SolidJS Developers', 27000),
  topic('qwik-developers', 'Qwik', 'Qwik Developers', 18000),
  topic('sveltekit-developers', 'SvelteKit', 'SvelteKit Developers', 51000),
  topic('alpine-js-developers', 'Alpine.js', 'Alpine.js Developers', 33000),

  // State management / data fetching
  topic('tanstack-developers', 'TanStack', 'TanStack Developers', 44000),
  topic('react-query-developers', 'React Query', 'React Query Developers', 67000),
  topic('jotai-developers', 'Jotai', 'Jotai Developers', 21000),
  topic('xstate-developers', 'XState', 'XState Developers', 24000),
  topic('zod-developers', 'Zod', 'Zod Developers', 38000),

  // Web3 / blockchain (gaps)
  topic('hardhat-developers', 'Hardhat', 'Hardhat Developers', 31000),
  topic('foundry-eth-developers', 'Foundry (Ethereum)', 'Foundry Developers', 23000),
  topic('ethers-developers', 'ethers.js', 'ethers.js Developers', 44000),
  topic('wagmi-developers', 'Wagmi', 'Wagmi Developers', 19000),
  topic('anchor-developers', 'Anchor (Solana)', 'Anchor Developers', 17000),

  // Security / vulnerability research
  topic('security-researchers', 'Security Research', 'Security Researchers', 38000),
  topic('bug-bounty-hunters', 'Bug Bounty', 'Bug Bounty Hunters', 22000),
  topic('ctf-developers', 'CTF (Capture the Flag)', 'CTF Developers', 16000),

  // Buyer personas (high-value for GTM)
  topic('api-product-managers', 'API Product', 'API Product Managers', 19000),
  topic('head-of-engineering', 'Head of Engineering', 'Heads of Engineering', 31000),
  topic('principal-engineers', 'Principal Engineers', 'Principal Engineers', 24000),
  topic('developer-tool-founders', 'Developer Tool Founders', 'Developer Tool Founders', 21000),

  // Cloud-native patterns (gaps)
  topic('wasm-runtime-developers', 'Wasm Runtime', 'Wasm Runtime Developers', 14000),
  topic('ebpf-engineers', 'eBPF', 'eBPF Engineers', 18000),
  topic('linux-kernel-developers', 'Linux Kernel', 'Linux Kernel Developers', 29000),

  // AI inference & hardware
  topic('triton-developers', 'Triton (GPU)', 'Triton Developers', 16000),
  topic('cuda-developers', 'CUDA', 'CUDA Developers', 34000),
  topic('tinyml-developers', 'TinyML', 'TinyML Developers', 14000),

  // Data engineering (gaps)
  topic('polars-developers', 'Polars', 'Polars Developers', 29000),
  topic('duckdb-developers', 'DuckDB', 'DuckDB Developers', 27000),
  topic('trino-engineers', 'Trino', 'Trino Engineers', 19000),
  topic('iceberg-engineers', 'Apache Iceberg', 'Apache Iceberg Engineers', 22000),
  topic('delta-lake-engineers', 'Delta Lake', 'Delta Lake Engineers', 18000),

  // Vector databases (high 2026 growth)
  topic('weaviate-developers', 'Weaviate', 'Weaviate Developers', 24000),
  topic('qdrant-developers', 'Qdrant', 'Qdrant Developers', 21000),
  topic('pinecone-developers', 'Pinecone', 'Pinecone Developers', 31000),
  topic('chroma-developers', 'Chroma', 'Chroma Developers', 19000),
  topic('milvus-developers', 'Milvus', 'Milvus Developers', 28000),
  topic('pgvector-developers', 'pgvector', 'pgvector Developers', 34000),

  // Observability & monitoring
  topic('sentry-developers', 'Sentry', 'Sentry Developers', 89000),
  topic('posthog-developers', 'PostHog', 'PostHog Developers', 44000),
  topic('newrelic-developers', 'New Relic', 'New Relic Developers', 41000),
  topic('honeycomb-developers', 'Honeycomb', 'Honeycomb Developers', 18000),
  topic('axiom-developers', 'Axiom', 'Axiom Developers', 14000),

  // AI LLM frameworks (gaps)
  topic('llamaindex-developers', 'LlamaIndex', 'LlamaIndex Developers', 54000),
  topic('dspy-developers', 'DSPy', 'DSPy Developers', 22000),
  topic('litellm-developers', 'LiteLLM', 'LiteLLM Developers', 34000),
  topic('instructor-developers', 'Instructor (Python)', 'Instructor Developers', 24000),
  topic('openwebui-developers', 'Open WebUI', 'Open WebUI Developers', 29000),

  // AI coding tools (2026 growth)
  topic('cursor-ai-developers', 'Cursor AI', 'Cursor AI Developers', 38000),
  topic('windsurf-ai-developers', 'Windsurf AI', 'Windsurf AI Developers', 19000),
  topic('cline-developers', 'Cline', 'Cline Developers', 16000),
  topic('aider-developers', 'Aider', 'Aider Developers', 21000),

  // Communications & payments
  topic('twilio-developers', 'Twilio', 'Twilio Developers', 127000),
  topic('sendgrid-developers', 'SendGrid', 'SendGrid Developers', 84000),
  topic('plaid-developers', 'Plaid', 'Plaid Developers', 38000),
  topic('braintree-developers', 'Braintree', 'Braintree Developers', 31000),

  // API testing tools
  topic('postman-developers', 'Postman', 'Postman Developers', 124000),
  topic('bruno-api-developers', 'Bruno', 'Bruno API Developers', 21000),
  topic('hoppscotch-developers', 'Hoppscotch', 'Hoppscotch Developers', 18000),
  topic('insomnia-developers', 'Insomnia', 'Insomnia Developers', 34000),

  // Authentication & identity
  topic('auth0-developers', 'Auth0', 'Auth0 Developers', 67000),
  topic('clerk-developers', 'Clerk', 'Clerk Developers', 44000),
  topic('keycloak-developers', 'Keycloak', 'Keycloak Developers', 52000),
  topic('ory-developers', 'Ory', 'Ory Developers', 19000),
  topic('supertokens-developers', 'SuperTokens', 'SuperTokens Developers', 16000),

  // Search engines
  topic('meilisearch-developers', 'Meilisearch', 'Meilisearch Developers', 38000),
  topic('typesense-developers', 'Typesense', 'Typesense Developers', 24000),
  topic('algolia-developers', 'Algolia', 'Algolia Developers', 61000),
  topic('opensearch-developers', 'OpenSearch', 'OpenSearch Developers', 34000),

  // Feature flags
  topic('launchdarkly-developers', 'LaunchDarkly', 'LaunchDarkly Developers', 41000),
  topic('unleash-developers', 'Unleash', 'Unleash Developers', 18000),
  topic('openfeature-developers', 'OpenFeature', 'OpenFeature Developers', 14000),
  topic('growthbook-developers', 'GrowthBook', 'GrowthBook Developers', 17000),

  // AI inference platforms (2026 growth)
  topic('replicate-developers', 'Replicate', 'Replicate Developers', 31000),
  topic('groq-api-developers', 'Groq API', 'Groq API Developers', 24000),
  topic('together-ai-developers', 'Together AI', 'Together AI Developers', 19000),
  topic('fireworks-ai-developers', 'Fireworks AI', 'Fireworks AI Developers', 14000),

  // Voice AI
  topic('elevenlabs-developers', 'ElevenLabs', 'ElevenLabs Developers', 28000),
  topic('whisper-developers', 'Whisper (OpenAI)', 'Whisper Developers', 44000),
  topic('deepgram-developers', 'Deepgram', 'Deepgram Developers', 21000),

  // Mobile / cross-platform
  topic('capacitor-developers', 'Capacitor', 'Capacitor Developers', 34000),
  topic('ionic-developers', 'Ionic', 'Ionic Developers', 71000),

  // API management & gateways
  topic('kong-developers', 'Kong', 'Kong Developers', 47000),
  topic('tyk-developers', 'Tyk', 'Tyk Developers', 18000),
  topic('traefik-developers', 'Traefik', 'Traefik Developers', 38000),

  // Payments (modern)
  topic('paddle-developers', 'Paddle', 'Paddle Developers', 24000),
  topic('lemonsqueezy-developers', 'Lemon Squeezy', 'Lemon Squeezy Developers', 19000),

  // Notifications & email infra
  topic('resend-developers', 'Resend', 'Resend Developers', 34000),
  topic('novu-developers', 'Novu', 'Novu Developers', 21000),

  // Logging & observability (gaps)
  topic('loki-engineers', 'Grafana Loki', 'Loki Engineers', 34000),
  topic('fluentbit-engineers', 'Fluent Bit', 'Fluent Bit Engineers', 22000),
  topic('vector-dev-engineers', 'Vector (observability)', 'Vector Engineers', 18000),

  // Scheduling & productivity APIs
  topic('cal-com-developers', 'Cal.com', 'Cal.com Developers', 18000),

  // Real-time & analytics databases (2026 growth)
  topic('clickhouse-developers', 'ClickHouse', 'ClickHouse Developers', 58000),
  topic('questdb-developers', 'QuestDB', 'QuestDB Developers', 21000),
  topic('tinybird-developers', 'Tinybird', 'Tinybird Developers', 17000),
  topic('timescale-developers', 'Timescale', 'Timescale Developers', 29000),

  // Background jobs & workflow (2026 growth)
  topic('trigger-dev-developers', 'Trigger.dev', 'Trigger.dev Developers', 24000),
  topic('inngest-developers', 'Inngest', 'Inngest Developers', 19000),
  topic('temporal-workflow-developers', 'Temporal Workflow', 'Temporal Workflow Developers', 21000),
  topic('bullmq-developers', 'BullMQ', 'BullMQ Developers', 31000),

  // Serverless Redis & edge data
  topic('upstash-developers', 'Upstash', 'Upstash Developers', 28000),
  topic('vercel-kv-developers', 'Vercel KV', 'Vercel KV Developers', 14000),

  // Authentication (new)
  topic('better-auth-developers', 'Better Auth', 'Better Auth Developers', 18000),
  topic('logto-developers', 'Logto', 'Logto Developers', 21000),
  topic('zitadel-developers', 'ZITADEL', 'ZITADEL Developers', 16000),

  // Self-hosted & homelab
  topic('self-hosted-developers', 'Self-Hosted Software', 'Self-Hosted Developers', 94000),
  topic('homelab-developers', 'Homelab', 'Homelab Developers', 67000),
  topic('coolify-developers', 'Coolify', 'Coolify Developers', 32000),
  topic('dokku-developers', 'Dokku', 'Dokku Developers', 24000),
  topic('kamal-developers', 'Kamal', 'Kamal Developers', 18000),

  // Self-hostable SaaS replacements
  topic('pocketbase-developers', 'PocketBase', 'PocketBase Developers', 44000),
  topic('appwrite-developers', 'Appwrite', 'Appwrite Developers', 38000),
  topic('directus-developers', 'Directus', 'Directus Developers', 31000),
  topic('medusajs-developers', 'Medusa.js', 'Medusa.js Developers', 24000),
  topic('plane-developers', 'Plane', 'Plane Developers', 21000),

  // Go web frameworks (gaps)
  topic('gin-developers', 'Gin (Go)', 'Gin Developers', 78000),
  topic('fiber-go-developers', 'Fiber (Go)', 'Fiber Developers', 54000),
  topic('echo-go-developers', 'Echo (Go)', 'Echo Developers', 42000),
  topic('chi-router-developers', 'chi (Go router)', 'chi Developers', 31000),

  // Go tooling
  topic('sqlc-developers', 'sqlc', 'sqlc Developers', 34000),
  topic('buf-developers', 'Buf (Protocol Buffers)', 'Buf Developers', 22000),
  topic('connect-rpc-developers', 'ConnectRPC', 'ConnectRPC Developers', 16000),

  // TypeScript tooling
  topic('effect-ts-developers', 'Effect.ts', 'Effect.ts Developers', 22000),
  topic('zod-effect-developers', 'Zod + Effect', 'Zod/Effect Developers', 18000),

  // Feature flags (gaps)
  topic('statsig-developers', 'Statsig', 'Statsig Developers', 24000),
  topic('split-io-developers', 'Split.io', 'Split.io Developers', 19000),
  topic('flagsmith-developers', 'Flagsmith', 'Flagsmith Developers', 17000),

  // Analytics & product (gaps)
  topic('amplitude-developers', 'Amplitude', 'Amplitude Developers', 54000),
  topic('mixpanel-developers', 'Mixpanel', 'Mixpanel Developers', 61000),
  topic('june-so-developers', 'June.so', 'June.so Developers', 14000),

  // Developer productivity
  topic('raycast-developers', 'Raycast', 'Raycast Developers', 38000),
  topic('warp-terminal-developers', 'Warp Terminal', 'Warp Terminal Developers', 24000),
  topic('ghostty-developers', 'Ghostty', 'Ghostty Developers', 18000),
  topic('zed-editor-developers', 'Zed Editor', 'Zed Editor Developers', 29000),

  // API management (gaps)
  topic('hurl-developers', 'Hurl', 'Hurl Developers', 21000),
  topic('scalar-api-developers', 'Scalar', 'Scalar Developers', 17000),

  // Developer personas (high-value GTM)
  topic('founding-engineers', 'Founding Engineers', 'Founding Engineers', 31000),
  topic('technical-writers', 'Developer Technical Writers', 'Developer Technical Writers', 44000),
  topic('open-source-founders', 'Open Source Founders', 'Open Source Founders', 24000),
  topic('ai-product-managers', 'AI Product Managers', 'AI Product Managers', 18000),
  topic('prompt-engineers', 'Prompt Engineers', 'Prompt Engineers', 42000),

  // SDK / API tooling
  topic('sdk-developers', 'SDK Developers', 'SDK Developers', 67000),
  topic('openapi-spec-developers', 'OpenAPI', 'OpenAPI Developers', 78000),
  topic('swagger-developers', 'Swagger', 'Swagger Developers', 89000),
  topic('speakeasy-sdk-developers', 'Speakeasy SDK', 'Speakeasy SDK Developers', 17000),
  topic('api-design-developers', 'API Design', 'API Design Developers', 38000),

  // Cloud IDEs / online editors
  topic('replit-developers', 'Replit', 'Replit Developers', 38000),
  topic('stackblitz-developers', 'StackBlitz', 'StackBlitz Developers', 29000),
  topic('codesandbox-developers', 'CodeSandbox', 'CodeSandbox Developers', 24000),
  topic('gitpod-developers', 'Gitpod', 'Gitpod Developers', 21000),

  // AI coding assistants
  topic('github-copilot-developers', 'GitHub Copilot', 'GitHub Copilot Developers', 54000),
  topic('sourcegraph-developers', 'Sourcegraph', 'Sourcegraph Developers', 34000),
  topic('tabnine-developers', 'Tabnine', 'Tabnine Developers', 28000),

  // MCP / agentic (2026 growth)
  topic('mcp-server-developers', 'MCP Servers', 'MCP Server Developers', 41000),

  // JS build tooling (gaps)
  topic('swc-developers', 'SWC (Speedy Web Compiler)', 'SWC Developers', 38000),
  topic('rspack-developers', 'Rspack', 'Rspack Developers', 24000),
  topic('monorepo-developers', 'Monorepo', 'Monorepo Developers', 54000),

  // Static site generators
  topic('hugo-developers', 'Hugo', 'Hugo Developers', 61000),
  topic('gatsby-developers', 'Gatsby', 'Gatsby Developers', 48000),
  topic('jekyll-developers', 'Jekyll', 'Jekyll Developers', 34000),
  topic('eleventy-developers', 'Eleventy (11ty)', 'Eleventy Developers', 21000),

  // CMS (new)
  topic('payload-cms-developers', 'Payload CMS', 'Payload CMS Developers', 19000),
  topic('storyblok-developers', 'Storyblok', 'Storyblok Developers', 21000),

  // Editor tooling
  topic('codemirror-developers', 'CodeMirror', 'CodeMirror Developers', 28000),
  topic('tiptap-developers', 'Tiptap', 'Tiptap Developers', 24000),
  topic('obsidian-plugin-developers', 'Obsidian Plugins', 'Obsidian Plugin Developers', 19000),

  // CI / build systems
  topic('dagger-ci-developers', 'Dagger CI', 'Dagger CI Developers', 23000),
  topic('bazel-developers', 'Bazel', 'Bazel Developers', 29000),

  // Game development
  topic('godot-developers', 'Godot', 'Godot Developers', 54000),
  topic('bevy-developers', 'Bevy', 'Bevy Developers', 21000),
  topic('three-js-developers', 'Three.js', 'Three.js Developers', 67000),
  topic('babylon-js-developers', 'Babylon.js', 'Babylon.js Developers', 28000),
  topic('phaser-developers', 'Phaser.js', 'Phaser.js Developers', 34000),
  topic('pygame-developers', 'Pygame', 'Pygame Developers', 44000),
  topic('libgdx-developers', 'LibGDX', 'LibGDX Developers', 21000),

  // Web scraping / browser automation
  topic('puppeteer-developers', 'Puppeteer', 'Puppeteer Developers', 61000),
  topic('scrapy-developers', 'Scrapy', 'Scrapy Developers', 48000),
  topic('beautiful-soup-developers', 'Beautiful Soup', 'Beautiful Soup Developers', 34000),
  topic('mechanize-developers', 'Mechanize', 'Mechanize Developers', 14000),

  // Embedded / IoT / hardware
  topic('arduino-developers', 'Arduino', 'Arduino Developers', 78000),
  topic('esp32-developers', 'ESP32', 'ESP32 Developers', 42000),
  topic('raspberry-pi-developers', 'Raspberry Pi', 'Raspberry Pi Developers', 89000),
  topic('micropython-developers', 'MicroPython', 'MicroPython Developers', 34000),
  topic('zephyr-rtos-developers', 'Zephyr RTOS', 'Zephyr RTOS Developers', 19000),
  topic('freertos-developers', 'FreeRTOS', 'FreeRTOS Developers', 41000),
  topic('platformio-developers', 'PlatformIO', 'PlatformIO Developers', 22000),
  topic('risc-v-developers', 'RISC-V', 'RISC-V Developers', 28000),

  // Cloud PaaS (gaps)
  topic('fly-io-developers', 'Fly.io', 'Fly.io Developers', 31000),
  topic('render-developers', 'Render', 'Render Developers', 24000),
  topic('koyeb-developers', 'Koyeb', 'Koyeb Developers', 14000),

  // AI / LLM tooling (new entrants)
  topic('openrouter-developers', 'OpenRouter', 'OpenRouter Developers', 19000),
  topic('cohere-developers', 'Cohere', 'Cohere Developers', 21000),
  topic('phidata-developers', 'Phidata', 'Phidata Developers', 14000),
  topic('haystack-ai-developers', 'Haystack AI', 'Haystack AI Developers', 17000),
  topic('pydantic-ai-developers', 'PydanticAI', 'PydanticAI Developers', 19000),
  topic('instructor-developers', 'Instructor (LLM)', 'Instructor Developers', 21000),

  // Data visualization & notebooks
  topic('jupyter-developers', 'Jupyter', 'Jupyter Notebook Developers', 147000),
  topic('streamlit-developers', 'Streamlit', 'Streamlit Developers', 89000),
  topic('gradio-developers', 'Gradio', 'Gradio Developers', 54000),
  topic('dash-plotly-developers', 'Dash (Plotly)', 'Dash Plotly Developers', 41000),
  topic('metabase-developers', 'Metabase', 'Metabase Developers', 48000),
  topic('superset-developers', 'Apache Superset', 'Apache Superset Developers', 37000),
  topic('observable-developers', 'Observable', 'Observable Developers', 24000),

  // Mapping & geospatial
  topic('leaflet-developers', 'Leaflet.js', 'Leaflet.js Developers', 61000),
  topic('mapbox-developers', 'Mapbox', 'Mapbox Developers', 54000),
  topic('deck-gl-developers', 'deck.gl', 'deck.gl Developers', 21000),
  topic('openstreetmap-developers', 'OpenStreetMap', 'OpenStreetMap Developers', 38000),

  // Low-code / no-code platforms
  topic('retool-developers', 'Retool', 'Retool Developers', 67000),
  topic('appsmith-developers', 'Appsmith', 'Appsmith Developers', 41000),
  topic('tooljet-developers', 'ToolJet', 'ToolJet Developers', 28000),
  topic('budibase-developers', 'Budibase', 'Budibase Developers', 24000),

  // Messaging / bot platforms
  topic('discord-bot-developers', 'Discord Bots', 'Discord Bot Developers', 89000),
  topic('telegram-bot-developers', 'Telegram Bots', 'Telegram Bot Developers', 73000),
  topic('slack-app-developers', 'Slack Apps', 'Slack App Developers', 54000),
  topic('github-app-developers', 'GitHub Apps', 'GitHub App Developers', 31000),

  // Project management integrations
  topic('linear-developers', 'Linear', 'Linear Developers', 38000),
  topic('notion-api-developers', 'Notion API', 'Notion API Developers', 47000),

  // AI execution / sandbox
  topic('e2b-developers', 'E2B (Code Execution)', 'E2B Developers', 19000),
  topic('composio-developers', 'Composio', 'Composio Developers', 16000),
  topic('daytona-developers', 'Daytona', 'Daytona Developers', 14000),

  // Deployment & hosting
  topic('sst-developers', 'SST (Ion)', 'SST Developers', 34000),
  topic('encore-developers', 'Encore.dev', 'Encore.dev Developers', 18000),

  // NixOS ecosystem
  topic('nixos-developers', 'NixOS', 'NixOS Developers', 44000),

  // SST / Wasp
  topic('wasp-lang-developers', 'Wasp', 'Wasp Developers', 16000),

  // Mobile UI frameworks (2026 growth)
  topic('jetpack-compose-developers', 'Jetpack Compose', 'Jetpack Compose Developers', 61000),
  topic('swiftui-developers', 'SwiftUI', 'SwiftUI Developers', 54000),

  // Infrastructure / networking
  topic('opentofu-developers', 'OpenTofu', 'OpenTofu Developers', 28000),
  topic('podman-developers', 'Podman', 'Podman Developers', 38000),
  topic('tailscale-developers', 'Tailscale', 'Tailscale Developers', 61000),
  topic('headscale-developers', 'Headscale', 'Headscale Developers', 18000),
  topic('netbird-developers', 'NetBird', 'NetBird Developers', 22000),

  // Databases (new entrants)
  topic('surrealdb-developers', 'SurrealDB', 'SurrealDB Developers', 29000),

  // Animation / UI motion
  topic('framer-motion-developers', 'Framer Motion', 'Framer Motion Developers', 44000),
  topic('gsap-developers', 'GSAP', 'GSAP Developers', 48000),

  // Load testing / QA
  topic('k6-load-testing-developers', 'k6', 'k6 Developers', 31000),
  topic('locust-developers', 'Locust', 'Locust Developers', 24000),

  // Data orchestration (gaps)
  topic('dagster-developers', 'Dagster', 'Dagster Developers', 34000),
  topic('mage-ai-developers', 'Mage AI', 'Mage AI Developers', 21000),
  topic('mlflow-developers', 'MLflow', 'MLflow Developers', 54000),

  // Observability (new entrants)
  topic('signoz-developers', 'SigNoz', 'SigNoz Developers', 19000),
  topic('grafana-alloy-developers', 'Grafana Alloy', 'Grafana Alloy Developers', 16000),

  // Billing / monetization infrastructure
  topic('lago-developers', 'Lago (Billing)', 'Lago Developers', 14000),

  // AI small models / agent frameworks
  topic('smolagents-developers', 'smolagents', 'smolagents Developers', 16000),
  topic('mem0-developers', 'Mem0', 'Mem0 Developers', 22000),
  topic('continue-dev-developers', 'Continue.dev', 'Continue.dev Developers', 28000),

  // Python web frameworks (gaps)
  topic('litestar-developers', 'Litestar', 'Litestar Developers', 21000),
  topic('starlette-developers', 'Starlette', 'Starlette Developers', 48000),

  // Developer docs tools
  topic('mintlify-developers', 'Mintlify', 'Mintlify Developers', 19000),

  // API tooling (gaps)
  topic('openapi-generator-developers', 'OpenAPI Generator', 'OpenAPI Generator Developers', 38000),

  // Rust web frameworks
  topic('leptos-developers', 'Leptos', 'Leptos Developers', 18000),

  // Cloudflare AI ecosystem (2026 growth)
  topic('cloudflare-ai-developers', 'Cloudflare AI', 'Cloudflare AI Developers', 24000),

  // Frontend frameworks (new)
  topic('svelte-5-developers', 'Svelte 5', 'Svelte 5 Developers', 31000),

  // Evidence BI
  topic('evidence-dev-developers', 'Evidence (BI)', 'Evidence BI Developers', 14000),
];

export const TOPICS_MAP: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t])
);

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS_MAP[slug];
}
