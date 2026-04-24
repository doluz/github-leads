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
];

export const TOPICS_MAP: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.slug, t])
);

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS_MAP[slug];
}
