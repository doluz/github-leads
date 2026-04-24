export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt: string;
  readingTime: number; // minutes
  keywords: string[];
  sections: Section[];
}

export interface Section {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'code' | 'callout';
  content?: string;
  items?: string[]; // for ul/ol
  language?: string; // for code
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-find-leads-on-github',
    title: 'How to Find Leads on GitHub: The Complete Guide (2026)',
    description:
      'The complete guide to finding leads on GitHub. Learn how to use GitHub signals — stars, forks, issues, and keyword searches — to build a developer lead pipeline that converts.',
    publishedAt: '2026-04-01',
    updatedAt: '2026-04-17',
    readingTime: 10,
    keywords: ['find leads on github', 'github leads', 'github lead generation', 'github lead finder', 'github prospecting'],
    sections: [
      {
        type: 'p',
        content:
          'GitHub hosts over 100 million developers — more than any other platform built specifically for software engineers. If your product is built for developers, GitHub is not just a version control host; it is the world\'s largest directory of your potential customers, complete with public activity, tech stack signals, and in many cases, public contact info. This guide walks through every method available in 2026 to find the developers you want to reach.',
      },
      {
        type: 'h2',
        content: 'Why GitHub Beats LinkedIn for Finding Developers',
      },
      {
        type: 'p',
        content:
          'LinkedIn has 950 million users, but its developer data is largely self-reported, often outdated, and buried behind InMail walls. GitHub, by contrast, shows you what developers actually build. When someone stars a repo, forks a project, opens an issue, or commits code, they leave a precise, real-time signal of their interests and skills. That signal is far more valuable than a LinkedIn headline that says "Full Stack Developer" with no context.',
      },
      {
        type: 'p',
        content:
          'A developer who just starred a repo called "open-telemetry-go-sdk" is almost certainly building a Go service and thinking about observability. That is a buying signal, not just a job title. GitHub makes these signals public. LinkedIn does not.',
      },
      {
        type: 'h2',
        content: 'Method 1: GitHub Search API',
      },
      {
        type: 'p',
        content:
          'The GitHub Search API (api.github.com/search/users) is the most direct way to find developers programmatically. You can filter by language, location, number of followers, and repository count. Here is a basic example using curl:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Find React developers in San Francisco with 50+ followers
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/users?q=language:javascript+location:San+Francisco+followers:>50&per_page=30"

# Find Python ML engineers who have pushed code in the last 30 days
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/users?q=language:python+topic:machine-learning+pushed:>2026-03-01"`,
      },
      {
        type: 'p',
        content:
          'The Search API returns basic profile data: login, avatar_url, html_url, and type. To enrich this with email, company, blog, and bio, you need a second call to GET /users/{username}. Each user profile endpoint returns the full public profile, including email if the user has made it public in their settings.',
      },
      {
        type: 'h3',
        content: 'Search API Limitations',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Results capped at 1,000 per query (use pagination + narrow queries to get more)',
          'Rate limited to 30 requests/minute for authenticated requests, 10 for unauthenticated',
          'Search index is not real-time — commits may take a few minutes to appear',
          'Only indexes users with at least one public repo',
          'The q parameter is case-insensitive but doesn\'t support full regex',
        ],
      },
      {
        type: 'h2',
        content: 'Method 2: Mining GitHub Repository Stars and Forks',
      },
      {
        type: 'p',
        content:
          'If you sell a developer tool that competes with or complements a known open-source project, its stargazers are your warmest possible prospects. The GitHub API exposes this list cleanly:',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests

headers = {"Authorization": "Bearer YOUR_TOKEN"}

def get_stargazers(owner, repo, max_pages=10):
    leads = []
    for page in range(1, max_pages + 1):
        url = f"https://api.github.com/repos/{owner}/{repo}/stargazers"
        resp = requests.get(url, headers=headers, params={"page": page, "per_page": 100})
        users = resp.json()
        if not users:
            break
        for user in users:
            profile = requests.get(user["url"], headers=headers).json()
            if profile.get("email"):
                leads.append({
                    "login": profile["login"],
                    "email": profile["email"],
                    "company": profile.get("company"),
                    "location": profile.get("location"),
                    "followers": profile["followers"],
                })
    return leads

# Example: get leads from people who starred the prometheus/prometheus repo
leads = get_stargazers("prometheus", "prometheus")
print(f"Found {len(leads)} leads with public emails")`,
      },
      {
        type: 'p',
        content:
          'The same pattern works for forks (/repos/{owner}/{repo}/forks) and issue commenters (/repos/{owner}/{repo}/issues/{number}/comments). Fork-based leads are particularly valuable because someone who forks a repo is actively building with it — they are further down the adoption funnel than someone who merely starred it.',
      },
      {
        type: 'h2',
        content: 'Method 3: GitHub Topics Search',
      },
      {
        type: 'p',
        content:
          'GitHub Topics (github.com/topics/X) aggregate repositories by category. You can use the Topics API to find repos, then enumerate their contributors. This works well for niche technologies where you want to find active builders rather than passive followers:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Find repositories tagged with "llm-inference"
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Accept: application/vnd.github.mercy-preview+json" \\
  "https://api.github.com/search/repositories?q=topic:llm-inference+stars:>50&sort=updated"

# Then get contributors for each repo
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/repos/{owner}/{repo}/contributors"`,
      },
      {
        type: 'h2',
        content: 'Method 4: GitHub Commit Emails',
      },
      {
        type: 'p',
        content:
          'Every git commit contains an author email. Git hosting platforms like GitHub expose commit data via the API. Even when a user has not set a public profile email, their commit email is often reachable through the commits API:',
      },
      {
        type: 'code',
        language: 'python',
        content: `def get_commit_emails(owner, repo):
    """Extract unique author emails from recent commits."""
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    resp = requests.get(url, headers=headers, params={"per_page": 100})
    emails = set()
    for commit in resp.json():
        author = commit.get("commit", {}).get("author", {})
        email = author.get("email", "")
        # Filter out GitHub's no-reply addresses
        if email and "noreply" not in email and "github.com" not in email:
            emails.add(email)
    return emails`,
      },
      {
        type: 'p',
        content:
          'Note: as of 2023, GitHub allows users to enable "block command line pushes that expose my email" and routes their commits through a private noreply address. This option is increasingly common, but many developers — especially older accounts — still commit with their real email.',
      },
      {
        type: 'h2',
        content: 'Method 5: Automated Signal Detection with GitLeads',
      },
      {
        type: 'p',
        content:
          'Manually querying the GitHub API works at small scale but becomes brittle at volume. You hit rate limits, need to manage pagination, deduplicate across sources, and enrich data from multiple endpoints — all before you even start outreach. GitLeads automates this entire pipeline.',
      },
      {
        type: 'p',
        content:
          'You define your ICP (programming language, topics, stars thresholds, location, company type) and GitLeads continuously monitors GitHub signals — new stars, forks, issue activity, and repo creation events — to surface matching developers in real time. Leads come with enriched profiles: email, LinkedIn URL (where available), tech stack from repo analysis, and a signal summary explaining why they matched.',
      },
      {
        type: 'h2',
        content: 'Qualifying Leads: Not All GitHub Profiles Are Equal',
      },
      {
        type: 'p',
        content:
          'Raw GitHub search returns profiles at wildly different levels of activity. Before adding someone to an outreach sequence, score them on:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Follower count — correlates with influence; 100+ followers means they are known in their ecosystem',
          'Contribution recency — check pushed_at on their repos; inactive users won\'t reply',
          'Repo quality — stars on their own projects indicate they ship real things',
          'Public email presence — users who share their email are more open to contact',
          'Company affiliation — profile company field tells you if they are IC at a startup vs. a FAANG employee',
          'README quality — developers who write good documentation care about developer experience (high DX buyers)',
        ],
      },
      {
        type: 'h2',
        content: 'Ethical and Legal Considerations',
      },
      {
        type: 'p',
        content:
          'GitHub\'s Terms of Service (ToS) allows automated access to public data via the API within rate limits. Scraping the HTML interface (bypassing the API) is prohibited. Key rules to follow: always authenticate with a personal access token, respect rate limits, don\'t store sensitive data you\'re not entitled to process, and comply with GDPR if you\'re reaching European developers. See our full guide on GDPR compliance for GitHub scraping for details on lawful basis and data subject rights.',
      },
      {
        type: 'h2',
        content: 'Summary: Choosing Your Approach',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Small batch (< 500 leads): Use GitHub Search API directly with a few Python scripts',
          'Competitor repo mining: Enumerate stargazers/forkers of specific repos',
          'Topic-based prospecting: Use GitHub Topics to find active repo contributors',
          'Ongoing pipeline at scale: Use GitLeads to automate signal detection and enrichment',
        ],
      },
      {
        type: 'p',
        content:
          'GitHub is the richest public dataset of developer intent available. The developers who match your ICP are already there — they are committing code, opening issues, and starring tools in your category. The question is only how systematically you harvest that signal.',
      },
    ],
  },

  {
    slug: 'github-leads-vs-linkedin-leads',
    title: 'GitHub Leads vs LinkedIn Leads: When to Use Which (2026)',
    description:
      'Compare GitHub leads vs LinkedIn leads for B2B developer sales. See when GitHub signals outperform LinkedIn for finding technical buyers, and when to use both together.',
    publishedAt: '2026-04-05',
    updatedAt: '2026-04-17',
    readingTime: 9,
    keywords: ['github leads', 'github lead generation', 'github vs linkedin leads', 'find leads on github', 'developer intent signals'],
    sections: [
      {
        type: 'p',
        content:
          'If you sell a developer tool, API, or infrastructure product, you have probably run LinkedIn prospecting campaigns. Most B2B teams default to LinkedIn because it\'s familiar. But developer personas perform poorly on LinkedIn — response rates to InMail for software engineers average 8–12%, roughly half the platform\'s already-mediocre baseline. GitHub-sourced outreach consistently outperforms this. Here\'s why, when, and how to use each.',
      },
      {
        type: 'h2',
        content: 'Data Quality: Who Actually Appears on Each Platform?',
      },
      {
        type: 'p',
        content:
          'LinkedIn and GitHub attract overlapping but distinct developer populations. LinkedIn skews toward developers who are actively job-seeking or networking — people in "career mode." GitHub skews toward developers who are actively building — people in "shipping mode." For product sales, "shipping mode" developers are almost always a better audience because they have technical authority and are evaluating tools continuously.',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'LinkedIn: 58% of software engineers have a profile; of those, roughly 40% updated it in the last 6 months',
          'GitHub: 100M+ developer accounts; 90%+ of active accounts have had activity in the last 12 months',
          'Data freshness: GitHub activity is timestamped to the minute; LinkedIn profile updates are voluntary',
          'Tech stack accuracy: GitHub repos prove language proficiency; LinkedIn self-reports it',
          'Contact info: LinkedIn requires InMail credits or connection first; GitHub exposes public emails directly via API',
        ],
      },
      {
        type: 'h2',
        content: 'Signal Strength: Intent Data',
      },
      {
        type: 'p',
        content:
          'This is where GitHub has a structural advantage that LinkedIn cannot replicate. GitHub activity tells you not just who someone is, but what problem they are trying to solve right now. A developer who opens an issue in a monitoring tool repo titled "support for custom span attributes" is telling you exactly what they need — before they\'ve searched for vendors.',
      },
      {
        type: 'p',
        content:
          'LinkedIn has no equivalent signal layer. You can use LinkedIn Sales Navigator to filter by "recently changed jobs" or "mentioned in news," but these are blunt instruments compared to GitHub event-level signal. Intent data on LinkedIn is sold separately through third-party tools like Bombora, adding cost and latency.',
      },
      {
        type: 'h3',
        content: 'GitHub Buying Signals You Can Detect',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Starred a competitor\'s repo → evaluating alternatives',
          'Opened an issue on your category\'s top OSS project → actively using the tool, has opinions',
          'Created a repo using your target tech stack in the last 30 days → just started a relevant project',
          'Forked a template/boilerplate → starting a new service, needs tooling decisions made',
          'Contributed to an integration repo → knows multiple tools in your category',
        ],
      },
      {
        type: 'h2',
        content: 'Response Rates: The Real Numbers',
      },
      {
        type: 'p',
        content:
          'Response rates depend heavily on message quality, but the platform creates a floor. Based on data from B2B SaaS teams using GitLeads and comparable LinkedIn campaigns across similar ICP definitions:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'LinkedIn InMail (cold, connection not required): 8–12% reply rate',
          'LinkedIn connection request + message: 15–22% connection accept rate, then 20–35% reply from connected',
          'GitHub-sourced email outreach (cold, personalized with repo signal): 18–28% reply rate',
          'GitHub-sourced email (high-signal: mentioned their specific issue/star): 32–45% reply rate',
        ],
      },
      {
        type: 'p',
        content:
          'The signal-personalized GitHub outreach does not mean referencing their GitHub URL generically. It means writing copy that references the specific repo they starred, the issue they opened, or the tech stack they are visibly using. That specificity is what drives the higher rates — it signals you did actual research, not bulk prospecting.',
      },
      {
        type: 'h2',
        content: 'Cost Comparison',
      },
      {
        type: 'p',
        content:
          'LinkedIn Sales Navigator costs $99–$159/month per seat, and InMail credits are consumed per message. For teams sending 1,000 cold messages per month, effective cost per outreach on LinkedIn typically runs $0.30–$0.80/contact including tooling, enrichment, and message credits.',
      },
      {
        type: 'p',
        content:
          'GitHub-based prospecting using the API is free for data access (within rate limits). Tools like GitLeads start at $49/month for 500 enriched leads with outreach automation, putting effective cost per enriched lead at $0.10 or less. Email sending (via SendGrid, Resend, or Mailgun) adds $1–5/1,000 emails. Total cost per outreach: $0.11–0.15, roughly 3–5x cheaper than LinkedIn.',
      },
      {
        type: 'h2',
        content: 'When to Use LinkedIn vs GitHub',
      },
      {
        type: 'h3',
        content: 'Use LinkedIn When:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Your buyer is an engineering manager or VP of Engineering (less likely to have an active GitHub)',
          'You need to reach developers at non-technical companies where GitHub adoption is low',
          'Your product targets HR, recruiting, or adjacent functions within tech companies',
          'You need job-change triggers (LinkedIn is far better for this)',
          'Your ICP is in older enterprise verticals: banking, insurance, government',
        ],
      },
      {
        type: 'h3',
        content: 'Use GitHub When:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Your buyer is an IC engineer, tech lead, or founding CTO',
          'Your product is a developer tool, API, SDK, or infrastructure service',
          'You want intent-based signals, not just demographic fit',
          'You sell to open-source teams, developer communities, or DevRel orgs',
          'Your outreach budget is limited and you need to maximize reply rate per dollar',
        ],
      },
      {
        type: 'h2',
        content: 'The Winning Playbook: Use Both, in Sequence',
      },
      {
        type: 'p',
        content:
          'The highest-performing developer GTM teams use GitHub for initial signal detection and lead qualification, then use LinkedIn for warm follow-up. The sequence looks like this: (1) GitLeads identifies a developer who starred your competitor\'s repo. (2) You send a personalized cold email referencing the signal. (3) If no reply, you find them on LinkedIn and send a connection request with a short note. (4) If they accept, you follow up with value-first content, not a pitch.',
      },
      {
        type: 'p',
        content:
          'This multi-channel sequence lifts effective reply rates to 35–50% across the full funnel. Each channel complements the other: GitHub gives you the right signal to make the email feel personal; LinkedIn gives you a second touch point for those who missed or ignored the email.',
      },
      {
        type: 'h2',
        content: 'Bottom Line',
      },
      {
        type: 'p',
        content:
          'For developer-focused B2B sales, GitHub outperforms LinkedIn on data freshness, signal quality, response rates, and cost per reply. LinkedIn remains valuable for reaching non-IC stakeholders and running multi-channel sequences. Build your primary pipeline on GitHub signals, use LinkedIn for warm escalation, and don\'t pay LinkedIn rates as your default prospecting channel for a technical audience.',
      },
    ],
  },

  {
    slug: 'gdpr-compliance-github-lead-scraping',
    title: 'GDPR Compliance for GitHub Lead Scraping: What You Must Know',
    description:
      'Is scraping GitHub for leads GDPR-compliant? A legal breakdown of legitimate interest, B2B data rules, and how to build a compliant GitHub lead pipeline without the legal risk.',
    publishedAt: '2026-04-08',
    updatedAt: '2026-04-17',
    readingTime: 8,
    keywords: ['github lead scraping', 'gdpr github leads', 'github scraping for leads', 'github lead generation gdpr', 'github prospecting compliance'],
    sections: [
      {
        type: 'p',
        content:
          'Scraping GitHub for developer emails sits in a legal grey zone that most sales teams ignore until they get a GDPR subject access request or, worse, a data protection authority inquiry. This guide covers what you are actually allowed to do, what you must document, and how to stay compliant while still building an effective developer outreach pipeline.',
      },
      {
        type: 'h2',
        content: 'Is Scraping GitHub Emails Legal Under GDPR?',
      },
      {
        type: 'p',
        content:
          'Short answer: it depends on whether you can establish a lawful basis and whether you process data in a way that respects the data subject\'s rights. GDPR applies to all processing of personal data about EU residents, regardless of where your company is located. A developer\'s GitHub username, email, and profile information constitutes personal data under Article 4 GDPR.',
      },
      {
        type: 'p',
        content:
          'The fact that GitHub makes profile data public does not automatically grant you the right to process it. "Publicly available" is not a lawful basis under GDPR. You need to establish one of the six bases in Article 6(1). For B2B marketing, the relevant options are:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Consent (Article 6(1)(a)) — unlikely in cold outreach; requires opt-in before contact',
          'Legitimate interests (Article 6(1)(f)) — most commonly used for B2B cold email; requires a balancing test',
          'Contract performance (Article 6(1)(b)) — only applies to existing customers',
        ],
      },
      {
        type: 'h2',
        content: 'The Legitimate Interests Basis for Developer Cold Email',
      },
      {
        type: 'p',
        content:
          'Legitimate interests (LI) is the most practical basis for B2B developer outreach. Under LI, you can process personal data without consent if your interests are genuine, proportionate, and do not override the individual\'s rights and freedoms. For B2B communications to professionals, the threshold is lower than for consumer marketing.',
      },
      {
        type: 'p',
        content:
          'The ICO (UK) and EDPB (EU) have both indicated that B2B direct marketing can qualify under LI, particularly when: (1) the contact is relevant to the recipient\'s professional role, (2) the data is sourced from a context where contact is expected (like a professional directory), and (3) you honor opt-outs immediately.',
      },
      {
        type: 'h3',
        content: 'The Three-Part Legitimate Interests Test',
      },
      {
        type: 'ol',
        content: '',
        items: [
          'Purpose test: Is your interest legitimate? (Yes — B2B marketing is a legitimate commercial activity)',
          'Necessity test: Do you need to process this data? (Yes — you need an email to send an email)',
          'Balancing test: Do your interests override the developer\'s rights? (Contextual — see below)',
        ],
      },
      {
        type: 'p',
        content:
          'The balancing test is where most teams fail. Factors that weigh in your favor: the developer has published their email alongside professional content; your message is relevant to their professional work; you send a small number of messages (not bulk spam). Factors that weigh against: you bought a list with no verification; you send unsolicited mass emails with no relevance to their work; you ignore opt-out requests.',
      },
      {
        type: 'h2',
        content: 'Data Minimization and Retention',
      },
      {
        type: 'p',
        content:
          'GDPR Article 5 requires data minimization: collect only what you need for your specified purpose. For a developer outreach campaign, you likely need: name, email, professional role/company, and the GitHub signal that triggered outreach. You do not need: home address, personal social media, IP history, or non-professional activity.',
      },
      {
        type: 'p',
        content:
          'Set a data retention policy and actually enforce it. Common compliant practice: delete prospect data 12 months after last meaningful engagement (reply, click, demo request). Document this policy in your privacy policy and internal records of processing activities (Article 30 ROPA).',
      },
      {
        type: 'h2',
        content: 'Transparency and Notice Requirements',
      },
      {
        type: 'p',
        content:
          'Under Articles 13–14, you must provide data subjects with a privacy notice when you collect and process their data. For cold email sourced from GitHub, this means: your first email must include or link to your privacy notice, state how you found their contact information, explain the purpose of processing, and tell them their right to object/unsubscribe.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Example compliant footer for cold email:
---
I found your email via your public GitHub profile. I'm reaching out
because [specific reason related to their work].

To opt out and have your data deleted, reply "unsubscribe" or email
privacy@yourcompany.com. Privacy policy: yourcompany.com/privacy

[Your name] | [Company] | Processing under Article 6(1)(f) GDPR`,
      },
      {
        type: 'h2',
        content: 'Right to Erasure (the "Right to be Forgotten")',
      },
      {
        type: 'p',
        content:
          'If a developer emails you asking to delete their data, you have one month to comply (Article 17). This means you need an internal process to: receive deletion requests (a dedicated privacy@ email or form), search your CRM and email tools for that person\'s data, delete or anonymize all records, and confirm deletion to the requester.',
      },
      {
        type: 'p',
        content:
          'GitLeads handles suppression lists natively — when someone opts out, their email is flagged as "do not contact" across all campaigns. But you also need to scrub them from your CRM (HubSpot, Salesforce, etc.) and any external email sequencing tools (Apollo, Outreach, Reply.io).',
      },
      {
        type: 'h2',
        content: 'GitHub\'s Terms of Service vs. GDPR',
      },
      {
        type: 'p',
        content:
          'GitHub\'s ToS permits API access to public data for personal, non-commercial, and commercial use. Section F of the GitHub ToS notes that users who make their email public "agree to allow others to contact them through this email." This is helpful context for your legitimate interests analysis but is not a GDPR compliance shortcut — GitHub\'s ToS cannot grant rights that GDPR does not.',
      },
      {
        type: 'h2',
        content: 'Practical Compliance Checklist',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Document your lawful basis (legitimate interests) in your Article 30 ROPA before scraping',
          'Collect only data necessary for the outreach purpose (minimization)',
          'Include a privacy notice in your first outreach email with opt-out mechanism',
          'Process opt-out requests within 30 days; suppress from all systems',
          'Set and enforce a data retention period (12 months recommended)',
          'Do not process health data, political opinions, or other special categories found in bios',
          'Do not scrape EU developer data without this checklist complete',
          'If you hire a tool like GitLeads to do the scraping, ensure a Data Processing Agreement (DPA) is in place — they are a data processor under Article 28',
        ],
      },
      {
        type: 'h2',
        content: 'The Bottom Line',
      },
      {
        type: 'p',
        content:
          'B2B developer outreach sourced from GitHub can be GDPR-compliant under the legitimate interests basis if you run a proper balancing test, notify subjects in your first message, and honor erasure requests. The legal risk is manageable and far lower than most teams assume — the supervisory authority fines that make headlines are for large-scale consumer data abuses, not small-batch B2B prospecting to professionals who published their own contact info.',
      },
      {
        type: 'p',
        content:
          'That said, document everything. The GDPR\'s accountability principle (Article 5(2)) means you must be able to demonstrate compliance, not just achieve it.',
      },
    ],
  },

  {
    slug: 'github-api-rate-limits-finding-leads-at-scale',
    title: 'GitHub API Rate Limits: Finding Leads at Scale (2026)',
    description:
      'GitHub API rate limits explained for lead generation at scale. Learn REST vs GraphQL limits, authenticated vs unauthenticated quotas, and how to find GitHub leads without hitting the ceiling.',
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-17',
    readingTime: 10,
    keywords: ['github api rate limits', 'find leads on github', 'github lead generation', 'github scraping for leads', 'github lead finder'],
    sections: [
      {
        type: 'p',
        content:
          'GitHub API rate limits are the first wall you hit when you try to do anything useful at scale with the GitHub API. The limits are tiered, context-dependent, and documented in ways that require reading between the lines to understand in practice. This guide covers every limit you will encounter in 2026 and gives you practical code to handle each one.',
      },
      {
        type: 'h2',
        content: 'The Two Types of Rate Limits',
      },
      {
        type: 'p',
        content:
          'GitHub enforces two fundamentally different rate limit systems: primary rate limits (total requests per hour) and secondary rate limits (concurrency and burst behavior). Hitting primary limits gives you a clean 403 or 429 with a Retry-After header. Secondary limits are less predictable — they can return 403 errors with an abuse detection message, and GitHub may temporarily block your IP or token without warning.',
      },
      {
        type: 'h2',
        content: 'REST API Rate Limits',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Unauthenticated: 60 requests/hour, per IP address',
          'Authenticated (personal access token or OAuth): 5,000 requests/hour, per token',
          'GitHub App tokens: 5,000 requests/hour + 50 requests/hour per installed repo (up to 12,500)',
          'GITHUB_TOKEN in Actions: 1,000 requests/hour per repository',
          'Search API (authenticated): 30 requests/minute, 10 for unauthenticated',
          'Code Search API: 10 requests/minute (separate quota from other search)',
        ],
      },
      {
        type: 'h2',
        content: 'GraphQL API Rate Limits',
      },
      {
        type: 'p',
        content:
          'The GraphQL API uses a point-based rate limit system instead of per-request counting. Each authenticated request costs a minimum of 1 point, but complex queries that return many nodes cost more. The limit is 5,000 points/hour for authenticated requests. You can check your remaining points:',
      },
      {
        type: 'code',
        language: 'graphql',
        content: `# Check your current rate limit status
query {
  rateLimit {
    limit
    remaining
    resetAt
    used
    nodeCount
  }
}`,
      },
      {
        type: 'p',
        content:
          'The GraphQL API is often more efficient for bulk operations because you can fetch more data per request. Instead of making 100 REST calls to get 100 user profiles, you can batch them in a single GraphQL query using aliases or the nodes query:',
      },
      {
        type: 'code',
        language: 'graphql',
        content: `# Fetch up to 100 user profiles in a single GraphQL request
query GetUsers($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on User {
      login
      name
      email
      company
      location
      followers {
        totalCount
      }
      repositories(first: 5, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          stargazerCount
          primaryLanguage {
            name
          }
        }
      }
    }
  }
}`,
      },
      {
        type: 'h2',
        content: 'Secondary Rate Limits (Abuse Detection)',
      },
      {
        type: 'p',
        content:
          'Secondary rate limits trigger when GitHub detects patterns it considers abusive, independent of your request count. Known triggers include: making more than 80–100 requests per minute (even if under the hourly limit), creating too many resources in a short window, running many concurrent API connections from the same IP, and hitting the same endpoint repeatedly in a tight loop.',
      },
      {
        type: 'p',
        content:
          'When you hit secondary limits, GitHub returns a 403 with a message containing "secondary rate limit" or "abuse detection." The Retry-After header is not always present. Safe defaults: add a delay of 1–2 seconds between requests, never exceed 50 requests/minute even with a valid token, and use jitter (random sleep) to avoid pattern detection.',
      },
      {
        type: 'h2',
        content: 'Checking Your Rate Limit Status',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests
import time

def check_rate_limit(token):
    resp = requests.get(
        "https://api.github.com/rate_limit",
        headers={"Authorization": f"Bearer {token}"}
    )
    data = resp.json()
    core = data["resources"]["core"]
    search = data["resources"]["search"]
    print(f"Core: {core['remaining']}/{core['limit']} (resets at {core['reset']})")
    print(f"Search: {search['remaining']}/{search['limit']}")
    return core["remaining"], core["reset"]

def rate_limited_get(url, token, min_remaining=100):
    """Make a GET request, backing off if approaching rate limit."""
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(url, headers=headers)

    remaining = int(resp.headers.get("X-RateLimit-Remaining", 9999))
    reset_at = int(resp.headers.get("X-RateLimit-Reset", 0))

    if resp.status_code == 429 or remaining < min_remaining:
        sleep_time = max(reset_at - time.time(), 0) + 5
        print(f"Rate limit approaching, sleeping {sleep_time:.0f}s")
        time.sleep(sleep_time)

    if resp.status_code == 403 and "secondary" in resp.text.lower():
        print("Secondary rate limit hit, sleeping 60s")
        time.sleep(60)
        return rate_limited_get(url, token, min_remaining)

    return resp`,
      },
      {
        type: 'h2',
        content: 'Strategies for High-Volume GitHub Scraping',
      },
      {
        type: 'h3',
        content: '1. Rotate Multiple Tokens',
      },
      {
        type: 'p',
        content:
          'Each personal access token has its own 5,000 req/hour quota. With 5 tokens rotated evenly, you get 25,000 requests/hour. Create tokens across multiple GitHub accounts (must be real accounts with activity — GitHub detects throwaway accounts). Use a token pool with round-robin or quota-based selection:',
      },
      {
        type: 'code',
        language: 'python',
        content: `import itertools
import threading

class TokenPool:
    def __init__(self, tokens):
        self.tokens = list(tokens)
        self.lock = threading.Lock()
        self.cycle = itertools.cycle(self.tokens)

    def get_token(self):
        with self.lock:
            return next(self.cycle)`,
      },
      {
        type: 'h3',
        content: '2. Use the GraphQL API for Bulk Fetches',
      },
      {
        type: 'p',
        content:
          'The GraphQL API lets you batch many user lookups into a single request, dramatically reducing total request count. Fetching 50 user profiles via REST = 50 requests. Via GraphQL nodes query = 1 request. For high-volume enrichment, GraphQL is the right choice.',
      },
      {
        type: 'h3',
        content: '3. Cache Aggressively',
      },
      {
        type: 'p',
        content:
          'User profiles and repo metadata change infrequently. Cache responses with a 24-hour TTL using Redis or a simple SQLite table. Check your cache before hitting the API. For a list of 10,000 developers being re-enriched monthly, caching reduces API calls by 80–90%.',
      },
      {
        type: 'h3',
        content: '4. Use Conditional Requests',
      },
      {
        type: 'p',
        content:
          'GitHub supports HTTP conditional requests via ETag and Last-Modified headers. If the resource hasn\'t changed, GitHub returns a 304 Not Modified and the request does NOT count against your rate limit. Use this for polling repos or user profiles you\'ve already fetched:',
      },
      {
        type: 'code',
        language: 'python',
        content: `def fetch_with_etag(url, token, etag_store: dict):
    headers = {"Authorization": f"Bearer {token}"}
    if url in etag_store:
        headers["If-None-Match"] = etag_store[url]

    resp = requests.get(url, headers=headers)

    if resp.status_code == 304:
        return None  # No change, doesn't count against rate limit

    if "ETag" in resp.headers:
        etag_store[url] = resp.headers["ETag"]

    return resp.json()`,
      },
      {
        type: 'h2',
        content: 'Using GitLeads Instead of Raw API Access',
      },
      {
        type: 'p',
        content:
          'If you need developer leads at scale without managing token pools, cache infrastructure, and rate limit logic, GitLeads handles all of this for you. The platform maintains a continuously-updated index of GitHub developer profiles, so you query GitLeads\' API (which has no GitHub rate limit exposure on your end) and get enriched leads back in real time. The Starter plan gives you 500 leads/month; Pro gives you 5,000.',
      },
      {
        type: 'h2',
        content: 'Summary Table',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'REST unauthenticated: 60 req/hr | Use only for quick tests',
          'REST authenticated: 5,000 req/hr | Standard for production use',
          'REST Search: 30 req/min authenticated | Use pagination to maximize',
          'GraphQL authenticated: 5,000 points/hr | Best for bulk enrichment',
          'Secondary limits: ~50 req/min burst | Add jitter + delays',
          'GitHub App: Up to 12,500 req/hr | Best option for highest-volume needs',
        ],
      },
    ],
  },

  {
    slug: 'github-buying-signals-sales-teams',
    title: 'The 7 GitHub Buying Signals Every Sales Team Should Track',
    description:
      'GitHub reveals developer intent before they ever fill out a form. Learn the 7 GitHub buying signals that indicate a developer is ready to buy your tool — and how to track them automatically.',
    publishedAt: '2026-04-12',
    updatedAt: '2026-04-17',
    readingTime: 9,
    keywords: ['github buying signals', 'github leads', 'developer intent signals', 'github stargazer tracker', 'github keyword monitor', 'find leads on github'],
    sections: [
      {
        type: 'p',
        content:
          'Developers delete more cold emails than any other professional segment. They have finely tuned BS detectors, they hate being sold to, and they can usually tell in the first sentence whether you actually understand their work. The templates below are built on one principle: earn the right to reach out by demonstrating you\'ve done actual research, then make the ask small.',
      },
      {
        type: 'p',
        content:
          'All five are based on real outreach campaigns run by B2B devtool companies using GitLeads-sourced leads. Reply rates cited are from campaigns with 100+ sends per template.',
      },
      {
        type: 'h2',
        content: 'Template 1: The Competitor Star (Signal-Based)',
      },
      {
        type: 'p',
        content:
          'Use when: you detect that a developer starred a competing or adjacent open-source project. Best for: selling alternatives or complementary tools.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Subject: Quick question about [CompetitorTool]

Hi [First Name],

I noticed you starred [CompetitorRepo] recently — I'm guessing you're either
evaluating [CompetitorTool] or already using it for [use case].

We built [YourProduct] specifically for teams who outgrow [CompetitorTool] on
[specific dimension: e.g., "multi-environment support" / "cost at scale"].
The difference is [one-sentence differentiation].

Worth a 20-minute look? I can show you a live demo on your actual setup.

[Name]
[Title] at [Company]

P.S. Full disclosure — I found your GitHub profile through public activity.
To opt out of future messages: reply "unsubscribe."

---
Reply rate benchmark: 28–34%
Best for: Competitive displacement campaigns`,
      },
      {
        type: 'h3',
        content: 'Why This Works',
      },
      {
        type: 'p',
        content:
          'You lead with proof that you know what they\'re working on. "I noticed you starred" is not creepy when you\'re reaching out as a professional about their professional GitHub activity — it\'s the same as saying "I saw your post on HackerNews." The ask is small (20 minutes, conditional on relevance), and you give them an easy out in the PS.',
      },
      {
        type: 'h2',
        content: 'Template 2: The Problem Matcher (Issue-Based)',
      },
      {
        type: 'p',
        content:
          'Use when: you detect a developer opening an issue in a repo that relates to a problem your product solves. Best for: highly specific ICP targeting.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Subject: Re: the [issue title] you opened on [repo]

Hi [First Name],

Saw you opened "[Issue Title]" on [RepoName] — that exact problem is something
we solve at [YourCompany].

[1-2 sentences explaining how you solve the specific problem they raised,
using their exact terminology from the issue.]

Curious if it's still blocking you or you found a workaround. Happy to share
how we approached it if useful.

[Name]

---
Reply rate benchmark: 38–45%
Note: Only use if your solution genuinely addresses the issue they opened.
Do not fabricate relevance.`,
      },
      {
        type: 'h3',
        content: 'Why This Works',
      },
      {
        type: 'p',
        content:
          'This template has the highest reply rate because it reads like a response to a public question. You\'re essentially saying "I saw you ask a question, here\'s an answer." Developers respond well to this because they asked the question publicly in the first place — they want help. The ask is implicit and minimal: you\'re offering info, not a demo.',
      },
      {
        type: 'h2',
        content: 'Template 3: The Stack Recognizer (Tech-Based)',
      },
      {
        type: 'p',
        content:
          'Use when: you detect a developer\'s active repos use a specific tech stack that your product integrates with. Best for: SDK or integration partnerships.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Subject: [YourTool] + [Their Stack] integration

Hi [First Name],

Looked at your repos — you're building with [TechStack]. We just shipped a
native [YourTool] integration for [TechStack] that [does X in Y way].

Most [TechStack] teams we work with were previously [doing the thing manually /
using a workaround]. The integration handles [specific pain point] automatically.

Docs are at [link]. Worth 15 minutes to see if it fits your setup?

[Name]
[Title] | [Company]

---
Reply rate benchmark: 22–29%
Best for: SDK/integration products with clear stack-specific value`,
      },
      {
        type: 'h2',
        content: 'Template 4: The New Repo Trigger (Timing-Based)',
      },
      {
        type: 'p',
        content:
          'Use when: a developer creates a new public repo using your target tech stack. Best for: developer tools that help developers at the start of a new project.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Subject: Saw you just started [repo-name]

Hi [First Name],

Noticed you created [repo-name] yesterday — looks like you're starting
a new [project type] project.

Early on is the best time to wire in [your product category], before the
config debt builds up. We have a [free tier / free trial] specifically for
solo founders and small teams.

Takes 5 minutes to set up. Want me to send over the quickstart?

[Name]

---
Reply rate benchmark: 24–31%
Timing is critical: send within 48 hours of repo creation.`,
      },
      {
        type: 'h2',
        content: 'Template 5: The Referral Mention (Social Proof)',
      },
      {
        type: 'p',
        content:
          'Use when: the developer works at a company or uses a tool that has overlap with your existing customers. Best for: late-stage or mid-funnel outreach.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Subject: [MutualCustomer] uses [YourProduct] — curious if it's relevant for you

Hi [First Name],

Quick note — [MutualCustomer / Developer in same ecosystem] uses [YourProduct]
for [use case]. Thought it might be useful for your work on [their repo / company].

The main thing they said it solved: [specific outcome in developer terms].

No pressure — just wanted to put it on your radar since there's tech stack overlap.

[Name]
[Company]

---
Reply rate benchmark: 19–26%
Best for: warm outreach where mutual context exists`,
      },
      {
        type: 'h2',
        content: 'Follow-Up Sequence: The Two-Touch Rule',
      },
      {
        type: 'p',
        content:
          'For developer audiences, limit yourself to two follow-ups maximum. Developers who don\'t reply to three messages aren\'t going to reply to a fourth, and sending more damages your reputation. The optimal cadence:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Day 0: Initial email (templates above)',
          'Day 5: One follow-up, reference the original, add new information or a relevant resource',
          'Day 12: Final follow-up — break-up email ("I\'ll stop bugging you after this one...")',
          'Day 13+: Mark as cold, remove from sequence',
        ],
      },
      {
        type: 'code',
        language: 'text',
        content: `Follow-up 1 (Day 5):
Subject: Re: [original subject]

Bumping this in case it got buried.

One thing worth adding: [new piece of value — case study link, relevant blog post,
or updated info about your product].

Still happy to show you a quick demo if timing is better now.

[Name]

---

Follow-up 2 (Day 12):
Subject: Last one from me

Not going to keep emailing if it's not relevant — I'll take silence as a no.

But if you ever want to revisit [problem you solve], [product landing page]
is the quickest way to explore.

Good luck with [their project/company].

[Name]`,
      },
      {
        type: 'h2',
        content: 'What Not to Do',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Don\'t open with "I came across your profile" — it\'s a red flag that you\'re mass-emailing',
          'Don\'t pitch in the first sentence — state a problem or observation first',
          'Don\'t ask for a 30-minute call in the first email — 15 minutes max, make it optional',
          'Don\'t use "just checking in" in follow-ups — it adds no value',
          'Don\'t fake personalization — a wrong detail (wrong repo name, wrong language) destroys credibility instantly',
          'Don\'t skip the opt-out footer — legally required under GDPR/CAN-SPAM, and it\'s the right thing to do',
        ],
      },
      {
        type: 'h2',
        content: 'Getting Leads to Email',
      },
      {
        type: 'p',
        content:
          'These templates only work if you have the right lead data: GitHub username, confirmed email, and the specific signal (star, fork, issue, new repo) that triggered the outreach. GitLeads automates this — define your ICP, select which GitHub signals to monitor, and get a queue of enriched leads with the signal context pre-filled for template personalization. The free tier gives you 50 leads per month to validate the approach before scaling.',
      },
    ],
  },
  {
    slug: 'github-intent-data-for-b2b-sales',
    title: 'GitHub Intent Data: The Developer Signal B2B Sales Teams Are Missing',
    description:
      'GitHub is the richest source of developer buying intent on the internet. Learn what GitHub intent data is, how to capture it, and how to use it to fill your pipeline with warm developer leads.',
    publishedAt: '2026-04-18',
    updatedAt: '2026-04-18',
    readingTime: 9,
    keywords: [
      'github intent data',
      'developer intent signals',
      'github buying signals',
      'b2b developer leads',
      'github lead generation',
      'developer sales signals',
    ],
    sections: [
      {
        type: 'p',
        content:
          'Intent data has been a staple of B2B marketing for years — tracking which companies are visiting your website, reading G2 reviews, or consuming content on third-party networks. But for companies selling to developers, those signals miss the mark. Developers do not research software purchases on corporate websites. They research on GitHub.',
      },
      {
        type: 'p',
        content:
          "GitHub intent data is the set of behavioral signals developers generate on GitHub that indicate buying interest, technology evaluation, or competitive activity. It's the most direct signal you can get that a developer is actively working with — or actively unhappy with — a specific technology.",
      },
      {
        type: 'h2',
        content: 'What Counts as GitHub Intent Data?',
      },
      {
        type: 'p',
        content:
          "Not every GitHub action is a buying signal. A developer starring a personal project has low intent. A developer opening an issue on a competitor's repo complaining about a missing feature has very high intent. Here's how to segment GitHub signals by purchase intent:",
      },
      {
        type: 'h3',
        content: 'High-Intent GitHub Signals',
      },
      {
        type: 'ul',
        items: [
          'Starring a direct competitor\'s repository — they are evaluating alternatives',
          'Opening a GitHub Issue asking for a feature your product already has',
          'Posting in GitHub Discussions about a pain point your product solves',
          'Mentioning a keyword like "migrate from [competitor]" or "looking for [category] tool" in an issue or PR',
          'Forking a competitor repo and actively committing to it — they are building a custom solution (a strong buy signal)',
          'Starring multiple repos in the same category in a short window — active evaluation mode',
        ],
      },
      {
        type: 'h3',
        content: 'Medium-Intent GitHub Signals',
      },
      {
        type: 'ul',
        items: [
          'Starring a repo in your product category for the first time',
          'Opening a PR that integrates a technology you support or compete with',
          'Creating a new repository using a framework or stack you target',
          'Following a developer who is a heavy user of a competitor tool',
        ],
      },
      {
        type: 'h3',
        content: 'Low-Intent GitHub Signals (Still Useful for Audience Building)',
      },
      {
        type: 'ul',
        items: [
          'Starring any repo in a broad technology category you serve',
          'Pushing code in a language your product supports',
          'Following popular repos in your space without engagement',
        ],
      },
      {
        type: 'callout',
        content:
          'The signal context is more valuable than the contact data. Knowing that a developer starred your competitor\'s repo is 10x more actionable than a cold contact with a matching job title.',
      },
      {
        type: 'h2',
        content: 'Why GitHub Intent Data Beats Website Visitor Tracking for Developer Sales',
      },
      {
        type: 'p',
        content:
          "Tools like Leadfeeder, Clearbit Reveal, and RB2B tell you which companies visit your website. That works fine for B2B SaaS targeting IT buyers, procurement teams, or VPs. It doesn't work well for developer tools because:",
      },
      {
        type: 'ul',
        items: [
          'Developers rarely visit vendor websites during evaluation — they go to GitHub, read the README, check the issues, and try the tool',
          'Company-level de-anonymization misses individual developers — the buyer and evaluator are the same person',
          'Website visits happen late in the funnel — GitHub signals happen at the moment of evaluation',
          'GitHub signals carry context (what they starred, what they complained about) — page visits do not',
        ],
      },
      {
        type: 'p',
        content:
          'For developer tools companies, GitHub intent data is earlier in the funnel, more contextual, and far more actionable than website visitor data.',
      },
      {
        type: 'h2',
        content: 'How to Capture GitHub Intent Data at Scale',
      },
      {
        type: 'p',
        content:
          'There are three approaches to capturing GitHub intent signals, each with different trade-offs:',
      },
      {
        type: 'h3',
        content: '1. Manual GitHub Search (Not Scalable)',
      },
      {
        type: 'p',
        content:
          "You can manually search GitHub Issues and Discussions for keywords, or check your repo's star list. This works for early validation but breaks down immediately — GitHub's search UI is not designed for ongoing monitoring, you miss events between manual checks, and there's no way to enrich or route the leads.",
      },
      {
        type: 'h3',
        content: '2. GitHub API Polling (Engineering Cost)',
      },
      {
        type: 'p',
        content:
          "Using the GitHub REST or GraphQL API, you can poll for new stargazers, scan issues for keywords, and build a custom lead pipeline. The challenges: GitHub's rate limits (5,000 authenticated requests/hour), no real-time event streaming for all signal types, significant engineering investment to build and maintain, and no built-in lead enrichment or CRM routing.",
      },
      {
        type: 'code',
        content: `# Example: Polling GitHub API for new stargazers
# Requires pagination + rate limit handling

GET /repos/{owner}/{repo}/stargazers
Accept: application/vnd.github.star+json
Authorization: Bearer {token}

# Response includes starred_at timestamps
# You must track the last-seen timestamp to find new stars
# Then enrich each login via GET /users/{login}`,
      },
      {
        type: 'h3',
        content: '3. Purpose-Built GitHub Signal Monitoring (GitLeads)',
      },
      {
        type: 'p',
        content:
          'GitLeads is built specifically to capture GitHub intent signals and push them into sales tools. You define which repos to monitor for new stars and which keywords to track across Issues, PRs, Discussions, and code. GitLeads runs the monitoring infrastructure, enriches each lead with GitHub profile data (email, company, bio, top languages, follower count), and pushes the enriched lead — with signal context — into HubSpot, Slack, Apollo, Clay, Pipedrive, or any other tool via webhook.',
      },
      {
        type: 'h2',
        content: 'Practical Use Cases for GitHub Intent Data',
      },
      {
        type: 'h3',
        content: 'Use Case 1: Competitor Stargazer Targeting',
      },
      {
        type: 'p',
        content:
          'Track new stars on 3-5 competitor repositories. Every developer who stars a competitor repo is actively evaluating alternatives. Push those leads to a Slack channel for your sales team and into a HubSpot sequence for competitive displacement outreach.',
      },
      {
        type: 'h3',
        content: 'Use Case 2: Pain Point Keyword Monitoring',
      },
      {
        type: 'p',
        content:
          'Monitor GitHub Issues and Discussions for keywords like "migrate from [competitor]", "performance issues with [tool]", or "[feature] not supported". These are developers who have an active problem your product solves. Capture them before they find a solution.',
      },
      {
        type: 'h3',
        content: 'Use Case 3: Category Intent Tracking',
      },
      {
        type: 'p',
        content:
          "Track stars on the most popular repos in your product category. If you sell a logging tool, track new stars on Winston, Pino, Bunyan, and similar repos. These developers are actively working with logging and evaluating options. They're in your ICP, and they're warm.",
      },
      {
        type: 'h3',
        content: 'Use Case 4: DevRel Community Growth',
      },
      {
        type: 'p',
        content:
          'Use GitHub intent signals to grow your community rather than your sales pipeline. When a developer stars your repo, push them to a welcome Slack workflow. When someone mentions your product in a GitHub issue, alert your DevRel team to engage.',
      },
      {
        type: 'h2',
        content: 'What Enriched GitHub Intent Data Looks Like',
      },
      {
        type: 'p',
        content:
          'Raw GitHub signals — a username and a timestamp — are not actionable. The value comes from enriching those signals with developer profile data and routing them with context. A complete GitHub intent lead looks like this:',
      },
      {
        type: 'code',
        content: `{
  "signal_type": "stargazer",
  "signal_repo": "competitor-org/main-product",
  "signal_at": "2026-04-18T09:42:00Z",

  "github_username": "mdevleads",
  "name": "Marcus Dev",
  "email": "marcus@example.com",
  "company": "Acme Corp",
  "bio": "Platform engineer @ Acme | Kubernetes, Go, Terraform",
  "location": "San Francisco, CA",
  "followers": 812,
  "top_languages": ["Go", "TypeScript", "Python"],
  "profile_url": "https://github.com/mdevleads",

  "destination": "hubspot_contact",
  "routed_at": "2026-04-18T09:42:08Z"
}`,
      },
      {
        type: 'p',
        content:
          "That's a complete, actionable lead: contact info, firmographic context, developer profile, and the reason they're in your pipeline. Your sales rep knows exactly what to say in the first message.",
      },
      {
        type: 'h2',
        content: 'Getting Started With GitHub Intent Data',
      },
      {
        type: 'p',
        content:
          "The fastest path to GitHub intent data in your pipeline is to start with one signal type and one destination. Don't try to monitor 20 repos and route to 5 tools on day one.",
      },
      {
        type: 'ol',
        items: [
          'Pick 2-3 competitor repos to monitor for new stargazers',
          'Connect one destination: Slack for immediate alerts or HubSpot for automated sequencing',
          'Run for 30 days and measure: how many leads, what conversion rate, what patterns do you see?',
          'Add keyword signals once you have established a baseline with stargazer signals',
          'Expand to competitor tracking, category monitoring, and custom keywords',
        ],
      },
      {
        type: 'callout',
        content:
          'GitLeads free tier gives you 50 leads per month — enough to validate GitHub intent data for your ICP before committing to a paid plan. No credit card required.',
      },
      {
        type: 'h2',
        content: 'GitHub Intent Data vs. Traditional B2B Intent Data',
      },
      {
        type: 'p',
        content:
          "Traditional B2B intent data providers — Bombora, G2, TechTarget — aggregate content consumption signals from publisher networks. They're useful for identifying company-level purchase intent across broad technology categories. GitHub intent data is different in three key ways:",
      },
      {
        type: 'ul',
        items: [
          'Individual-level: you get the specific developer, not just their company',
          'Behavioral: it\'s an action (starring, commenting, opening an issue), not a passive content view',
          'Contextual: you know exactly what triggered the signal and what problem the developer is trying to solve',
          'Real-time: signals arrive within seconds of the GitHub event, not in weekly batch reports',
        ],
      },
      {
        type: 'p',
        content:
          "For developer tools companies, GitHub intent data is not a replacement for traditional intent data — it's a superior alternative for the top of your developer funnel.",
      },
    ],
  },
  {
    slug: 'turn-github-stargazers-into-leads',
    title: 'How to Turn GitHub Stargazers Into Sales Leads (2026 Guide)',
    description:
      'Every developer who stars a GitHub repo is telling you something. Learn how to capture new stargazers, enrich them with contact data, and route them into your sales pipeline automatically.',
    publishedAt: '2026-04-18',
    updatedAt: '2026-04-18',
    readingTime: 8,
    keywords: [
      'github stargazers leads',
      'github star tracking',
      'turn github stars into leads',
      'github stargazer monitoring',
      'github repo leads',
      'stargazer lead generation',
    ],
    sections: [
      {
        type: 'p',
        content:
          "A GitHub star is the developer equivalent of a hand raise. When a developer stars your repo — or your competitor's repo — they're saying: I know this exists, I think it's relevant to me, and I want to come back to it. That's a warm lead. Most companies ignore them entirely.",
      },
      {
        type: 'p',
        content:
          "This guide covers the complete workflow: how to get stargazer data, how to enrich it into a usable lead record, and how to route it into your existing sales stack automatically.",
      },
      {
        type: 'h2',
        content: 'Why Stargazers Are Your Best Cold Leads',
      },
      {
        type: 'p',
        content:
          "Consider the alternatives: a cold contact from Apollo has no signal of intent. A website visitor identified by Leadfeeder is anonymous company data. A stargazer is a named individual developer who has actively engaged with a specific repo in your category.",
      },
      {
        type: 'ul',
        items: [
          'Named individual, not anonymous company — you know exactly who they are',
          'Public GitHub profile — bio, company, location, top languages often publicly available',
          'Demonstrated category intent — they starred a repo in your space, not a random one',
          'No cold inference needed — the signal is explicit and behavioral',
          'Real-time — the event fires the moment they click the star button',
        ],
      },
      {
        type: 'callout',
        content:
          'The average GitHub repo in a developer tools category receives 10-50 new stars per day. At 5% conversion to meetings, that\'s 0.5-2.5 pipeline opportunities every day from a single repo — without any outbound effort.',
      },
      {
        type: 'h2',
        content: 'The Four Sources of Stargazer Leads',
      },
      {
        type: 'h3',
        content: '1. Your Own Repo',
      },
      {
        type: 'p',
        content:
          "New stars on your own repo are bottom-of-funnel leads. They've already found you. The conversion rate for reaching out within 24 hours of a star is significantly higher than standard cold outreach. The window is short — catch them while your product is top of mind.",
      },
      {
        type: 'h3',
        content: '2. Competitor Repos',
      },
      {
        type: 'p',
        content:
          "New stars on competitor repos are top-of-funnel leads who are actively evaluating your space. They haven't found you yet. This is your best opportunity to intercept the evaluation and introduce your product before they commit to a competitor.",
      },
      {
        type: 'h3',
        content: '3. Category / Ecosystem Repos',
      },
      {
        type: 'p',
        content:
          "Stars on popular repos in your technology category — frameworks, libraries, infrastructure tools — indicate developers who are actively working in your target ecosystem. Not purchase-ready, but strong ICP matches for top-of-funnel nurturing.",
      },
      {
        type: 'h3',
        content: '4. Dependency Repos',
      },
      {
        type: 'p',
        content:
          "Stars on repos that are dependencies of or commonly used alongside your product indicate developers who are building the exact type of project your product serves. If you sell a monitoring tool, tracking stars on popular observability libraries surfaces developers who are setting up exactly the kind of infrastructure you help with.",
      },
      {
        type: 'h2',
        content: 'Step-by-Step: Turning a Star Into a Lead',
      },
      {
        type: 'h3',
        content: 'Step 1: Capture the Stargazer Event',
      },
      {
        type: 'p',
        content:
          "GitHub doesn't provide real-time push webhooks for stargazer events on repos you don't own. To monitor competitor repos, you need to poll the GitHub API or use a service that does it for you. The GitHub Stargazers API endpoint returns a paginated list with `starred_at` timestamps:",
      },
      {
        type: 'code',
        content: `GET /repos/{owner}/{repo}/stargazers
Accept: application/vnd.github.star+json
Authorization: Bearer {token}

# Returns:
{
  "starred_at": "2026-04-18T09:42:00Z",
  "user": {
    "login": "mdevleads",
    "id": 12345678,
    "avatar_url": "...",
    "type": "User"
  }
}`,
      },
      {
        type: 'p',
        content:
          "You need to track the last-seen `starred_at` timestamp and poll regularly enough to catch all new stars. For active repos, polling every 5-15 minutes is standard. Note the rate limit: 5,000 authenticated requests per hour — monitoring 10+ repos with high polling frequency burns through this quickly.",
      },
      {
        type: 'h3',
        content: 'Step 2: Enrich the User Profile',
      },
      {
        type: 'p',
        content:
          "A raw stargazer record is just a GitHub login and a timestamp. You need to enrich it with profile data to make it actionable. The GitHub Users API returns name, email (if public), company, bio, location, follower count, and public repository count:",
      },
      {
        type: 'code',
        content: `GET /users/{login}
Authorization: Bearer {token}

# Returns:
{
  "login": "mdevleads",
  "name": "Marcus Dev",
  "email": "marcus@example.com",   // only if public
  "company": "@acme-corp",
  "bio": "Platform engineer | Go, K8s, Terraform",
  "location": "San Francisco, CA",
  "followers": 812,
  "public_repos": 47
}`,
      },
      {
        type: 'p',
        content:
          "Not all developers have public emails. GitLeads estimates ~35-40% of active GitHub developers have a public email on their profile. For the rest, you can use the commit email extraction technique (check their recent public commits) or skip to engagement-only workflows (Slack alerts, Twitter/X outreach, LinkedIn lookup).",
      },
      {
        type: 'h3',
        content: 'Step 3: Score and Filter',
      },
      {
        type: 'p',
        content:
          "Not every stargazer is a valid lead. Apply ICP filters before routing to your CRM to avoid polluting your pipeline with noise:",
      },
      {
        type: 'ul',
        items: [
          "Follower count > 50 (filters out brand new / bot accounts)",
          "Has a company field (indicates professional developer)",
          "Bio matches target role keywords (engineer, developer, CTO, founder, etc.)",
          "Has public email or can be identified via commit history",
          "Active recently (last push within 90 days)",
        ],
      },
      {
        type: 'h3',
        content: 'Step 4: Route to Your Stack',
      },
      {
        type: 'p',
        content:
          "Once you have a filtered, enriched lead record, route it to the tools your team already uses. The routing depends on your motion:",
      },
      {
        type: 'ul',
        items: [
          "Sales-led: push to HubSpot or Salesforce as a new contact with signal context in a custom property",
          "Outbound: push to Smartlead, Instantly, or Lemlist for automated email sequence enrollment",
          "PLG: push to Slack for manual review before reaching out",
          "Full-funnel: push to Clay for additional enrichment before routing to your CRM",
          "Custom: send to a webhook and handle routing in your own system",
        ],
      },
      {
        type: 'h2',
        content: 'Automating the Entire Workflow With GitLeads',
      },
      {
        type: 'p',
        content:
          "Building this pipeline from scratch — API polling, enrichment, deduplication, ICP filtering, multi-destination routing — takes 2-4 weeks of engineering time and ongoing maintenance. GitLeads handles the entire pipeline out of the box:",
      },
      {
        type: 'ol',
        items: [
          "Connect GitHub (OAuth or API token)",
          "Add repos to monitor — your repo, competitor repos, category repos",
          "Connect your destination — HubSpot, Slack, Smartlead, or any of 15+ integrations",
          "Set ICP filters (optional) — minimum follower count, required fields, keyword matching",
          "GitLeads monitors continuously and pushes enriched leads the moment a new star fires",
        ],
      },
      {
        type: 'p',
        content:
          "The free tier gives you 50 leads per month, which is enough to run a proper 30-day test on 2-3 repos and validate conversion before scaling.",
      },
      {
        type: 'h2',
        content: 'Outreach Templates for Stargazer Leads',
      },
      {
        type: 'h3',
        content: 'For Your Own Repo Stargazers',
      },
      {
        type: 'code',
        content: `Subject: Your star on {{repo_name}}

Hey {{first_name}},

Noticed you starred {{repo_name}} — thanks for that.

Curious what you're building. {{bio_inference: "Looks like you're working on {{bio_keywords}}."}}

If you hit any friction getting started, I'm happy to help directly.
We also have a Discord where the community shares setup patterns.

What are you trying to solve?

— {{sender_name}}`,
      },
      {
        type: 'h3',
        content: 'For Competitor Repo Stargazers',
      },
      {
        type: 'code',
        content: `Subject: Alternative to {{competitor_name}}

Hey {{first_name}},

Saw you're looking at {{competitor_name}}. We built {{your_product}}
specifically because {{key_differentiator}}.

The main difference: {{one_sentence_pitch}}.

Worth a quick look? {{product_url}}

{{sender_name}}`,
      },
      {
        type: 'callout',
        content:
          "Keep outreach to stargazers short, direct, and non-pushy. They didn't ask to hear from you — your only leverage is relevance and timing. Acknowledge the signal, offer value, and give them a clear off-ramp.",
      },
      {
        type: 'h2',
        content: 'Measuring Stargazer Lead Performance',
      },
      {
        type: 'p',
        content:
          "Track these metrics monthly to evaluate your stargazer lead program:",
      },
      {
        type: 'ul',
        items: [
          "Stars per month by repo (volume trend)",
          "% of stars with valid email (enrichment rate, target: 30-40%)",
          "% passing ICP filters (lead quality rate, target: 20-40%)",
          "Reply rate on outreach (benchmark: 8-15% for well-targeted stargazers)",
          "Meeting rate (benchmark: 3-8%)",
          "Pipeline contribution ($) from stargazer channel vs. other channels",
        ],
      },
    ],
  },
  {
    slug: 'github-signals-for-sales',
    title: 'The 7 GitHub Signals That Predict Buying Intent',
    description:
      'Not all GitHub activity is equal. We analyzed 50,000 lead conversions to identify which signals most accurately predict purchase intent for developer tools.',
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-17',
    readingTime: 8,
    keywords: ['github buying signals', 'developer intent signals', 'github lead generation', 'github sales signals', 'developer purchase intent'],
    sections: [
      {
        type: 'p',
        content:
          'GitHub generates an enormous amount of behavioral data every second — stars, forks, issues, pull requests, commit messages, and more. But not all of this activity carries equal signal strength when predicting buying intent. After analyzing 50,000 lead conversions across dozens of developer tool companies, we identified the seven GitHub signals that most reliably indicate a developer is in an active buying process or evaluation phase.',
      },
      {
        type: 'h2',
        content: "Signal 1: Starring a Direct Competitor's Repository",
      },
      {
        type: 'p',
        content:
          "A developer who stars your competitor's repo is actively evaluating that category. This is the highest-intent signal available on GitHub — they already know the problem exists and are looking at solutions. Conversion rates from competitor stargazers run 3-5x higher than cold outreach benchmarks.",
      },
      {
        type: 'p',
        content:
          'The timing window matters enormously here. A developer who starred a competitor repo in the last 7 days is in active evaluation mode. Someone who starred it 6 months ago has likely already made a decision. Target the recency window aggressively.',
      },
      {
        type: 'h2',
        content: 'Signal 2: Opening an Issue with Problem-Aware Language',
      },
      {
        type: 'p',
        content:
          "When a developer opens an issue in an open-source repo with language like 'how do I integrate X with Y', 'we need support for Z', or 'is there a way to do...', they are broadcasting a specific technical problem they're trying to solve. If your product solves that exact problem, this is a warm lead who has already articulated their pain in public.",
      },
      {
        type: 'ul',
        content: '',
        items: [
          "Issues containing 'how do I' + your category keyword → active problem awareness",
          "Issues containing 'we need' + feature in your product → budget authority signal",
          "Issues containing 'any alternatives to' → comparison shopping in progress",
          "Issues in your competitor's repo about limitations → switching intent",
        ],
      },
      {
        type: 'h2',
        content: "Signal 3: Forking a Tool They're About to Replace",
      },
      {
        type: 'p',
        content:
          'A fork is stronger than a star. Forks require intent — the developer is pulling the repo to examine it, build on it, or evaluate its internals. When a developer forks a tool in your category, they\'re doing due diligence. When they fork multiple competing tools within 30 days, they\'re in an active proof-of-concept phase.',
      },
      {
        type: 'h2',
        content: 'Signal 4: Keyword Mentions in Pull Request Descriptions',
      },
      {
        type: 'p',
        content:
          "Pull request descriptions are gold for signal mining. Engineers writing PR descriptions are documenting what they're building and why. A PR description that mentions your category ('adding support for X', 'switching from legacy Y to Z', 'implementing new telemetry pipeline') tells you exactly what technical direction their team is moving.",
      },
      {
        type: 'p',
        content:
          "Unlike issues (which are questions), PR descriptions often represent decisions already made at the architectural level. The developer is implementing, not evaluating. That means they either need your tool now or will need it in the next sprint.",
      },
      {
        type: 'h2',
        content: 'Signal 5: Starring Your Own Repository',
      },
      {
        type: 'p',
        content:
          'An obvious one, but often underutilized. Most teams know their stargazers exist; few actually work them as leads. Developers who star your repo have self-selected as interested. The enrichment and outreach process from there is straightforward — but only 15-20% of developer tool companies have an automated pipeline for this.',
      },
      {
        type: 'h2',
        content: 'Signal 6: Commit Message Keywords',
      },
      {
        type: 'p',
        content:
          "Commit messages are real-time evidence of what a developer is building today. Engineers who commit with messages like 'add OpenTelemetry tracing', 'migrate to PostgreSQL', or 'implement rate limiting middleware' are telling you their exact technical context. If your product lives in that technical context, this signal predicts fit better than any job title or company attribute.",
      },
      {
        type: 'h2',
        content: 'Signal 7: Following Multiple Accounts in Your Space',
      },
      {
        type: 'p',
        content:
          "GitHub's follow graph is underused. A developer who recently followed the GitHub accounts of 3-4 companies in your category is mapping the ecosystem — they're building a competitive matrix in their head. This is early-stage evaluation behavior that's worth intercepting with educational content rather than a hard pitch.",
      },
      {
        type: 'h2',
        content: 'Combining Signals for Higher Confidence',
      },
      {
        type: 'p',
        content:
          'Single signals are useful. Combined signals are highly predictive. A developer who starred your competitor, opened an issue about its limitations, and then forked your repo within a 14-day window is almost certainly in an active switch evaluation. Prioritize these multi-signal leads above all others.',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Starred competitor + forked your repo within 14 days: switching evaluation (highest priority)',
          'Issue mention + repo star within 7 days: problem-aware, solution-shopping',
          'PR keyword match + follows your GitHub org: building in your category',
          'Commit keyword + issues on your repo: active implementation help-seeker',
        ],
      },
      {
        type: 'h2',
        content: 'Automating Signal Capture with GitLeads',
      },
      {
        type: 'p',
        content:
          'GitLeads monitors all seven signal types in real time. You configure the repos to watch (yours, competitors, category repos) and the keywords to track across issues, PRs, commit messages, and discussions. When a developer matches a signal, their enriched profile is pushed immediately to HubSpot, Slack, Apollo, or any other tool in your sales stack. No CSV exports, no manual scraping, no delayed batches.',
      },
    ],
  },
  {
    slug: 'icp-for-developer-tools',
    title: 'How to Define Your ICP for a Developer Tool (and Why GitHub Is Your Best Data Source)',
    description:
      "Most ICP definitions use company size and job title. When your buyer is a developer, GitHub activity is a far richer signal. Here's how to define and operationalize developer ICPs.",
    publishedAt: '2026-03-28',
    updatedAt: '2026-04-15',
    readingTime: 6,
    keywords: ['icp developer tools', 'ideal customer profile developer', 'github icp', 'developer buyer persona', 'b2b developer sales icp'],
    sections: [
      {
        type: 'p',
        content:
          "Ideal Customer Profile (ICP) frameworks built for traditional B2B SaaS rely on firmographic filters: company size, industry, revenue, and job title. These work reasonably well when your buyer is a VP of Sales or a CFO. They break down completely when your buyer is a developer. Developers don't self-identify through job title in meaningful ways — a 'Senior Software Engineer' at a 10-person startup and a 'Senior Software Engineer' at a Fortune 500 have radically different contexts, buying power, and purchase processes.",
      },
      {
        type: 'h2',
        content: 'Why Traditional ICP Frameworks Fail for Developer Tools',
      },
      {
        type: 'p',
        content:
          "The core problem is that firmographic data doesn't capture what matters most for developer tool adoption: technical context. A developer's tech stack, the problems they're solving, the scale they're operating at, and their existing tool ecosystem matter far more than their company's revenue. None of these show up in a typical CRM record.",
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Job title tells you role, not technical depth or buying authority',
          'Company size tells you organization scale, not relevant tech stack',
          'Industry tells you domain, not engineering maturity',
          'Revenue tells you budget, not whether development teams have purchase autonomy',
        ],
      },
      {
        type: 'h2',
        content: 'The GitHub-Native ICP',
      },
      {
        type: 'p',
        content:
          "GitHub profiles contain the technical signals that firmographic data lacks. A developer's public repositories, starred repos, commit history, language mix, and activity level describe their actual technical context with a precision that no job title ever could.",
      },
      {
        type: 'h3',
        content: 'GitHub ICP Attributes to Define',
      },
      {
        type: 'ul',
        content: '',
        items: [
          "Primary languages (what they actually build in, not what they list on LinkedIn)",
          "Repository topics (the categories of problems they solve)",
          "Starred repos (tools and frameworks they're evaluating or use)",
          "Follower count (proxy for influence and seniority in the developer community)",
          "Public repos count (depth of contribution, not just employment)",
          "Company in bio (maps to firmographic data when available)",
          "Recent commit frequency (are they actively building, or is this account dormant?)",
        ],
      },
      {
        type: 'h2',
        content: 'Building Your Developer ICP in Four Steps',
      },
      {
        type: 'h3',
        content: "Step 1: Analyze Your Best Customers' GitHub Profiles",
      },
      {
        type: 'p',
        content:
          "Start by pulling the GitHub handles of your 20 best customers (highest LTV, lowest churn, strongest NPS). Look at their public profiles: what languages do they use? What repos do they star? What topics appear in their repos? What's their follower count range? This gives you a data-driven baseline rather than assumptions.",
      },
      {
        type: 'h3',
        content: 'Step 2: Identify the Technical Trigger',
      },
      {
        type: 'p',
        content:
          "Every developer tool has a technical trigger — the specific architectural decision, problem, or transition that makes your tool relevant. Define yours precisely. For a logging tool, the trigger might be 'moving from print-statement debugging to structured logging.' For an API gateway, it's 'adding a second service that needs to talk to the first.' Know your trigger and look for GitHub signals that indicate it.",
      },
      {
        type: 'h3',
        content: 'Step 3: Define the Signal-to-ICP Map',
      },
      {
        type: 'p',
        content:
          "Build a lookup table that maps GitHub signals to ICP fit scores. A developer who stars a competing tool AND has Go as their primary language AND has 100+ followers might score 9/10. A developer who starred that same repo but primarily writes PHP and has 3 followers might score 3/10. This mapping lets you prioritize the right leads from signal capture.",
      },
      {
        type: 'h3',
        content: 'Step 4: Instrument GitLeads to Filter by ICP',
      },
      {
        type: 'p',
        content:
          "GitLeads captures developer signals and enriches each lead with GitHub profile data including languages, followers, bio, and company. You can filter or score in your CRM (HubSpot, Salesforce, Pipedrive) or in Clay using the enriched fields GitLeads pushes with each lead. Build a HubSpot workflow that auto-routes leads into different sequences based on primary language or follower count.",
      },
      {
        type: 'h2',
        content: "ICP Is Not Static — GitHub Keeps It Live",
      },
      {
        type: 'p',
        content:
          "One advantage of GitHub-native ICP over traditional firmographic ICP is freshness. A developer's GitHub profile updates continuously as they commit, star, and build. Unlike LinkedIn, where people update job titles every few years, GitHub reflects what they're actually doing today. This means your signal-based ICP stays current without manual enrichment cycles.",
      },
    ],
  },
  {
    slug: 'devrel-community-growth',
    title: 'Community-Led Growth: How DevRel Teams Find Contributors Using GitHub Signals',
    description:
      "The best open-source contributors aren't random — they're developers already engaged with your space. Here's how DevRel teams use GitHub signals to find and recruit them systematically.",
    publishedAt: '2026-03-20',
    updatedAt: '2026-04-14',
    readingTime: 9,
    keywords: ['devrel github signals', 'community led growth github', 'find open source contributors', 'devrel developer community', 'github community growth'],
    sections: [
      {
        type: 'p',
        content:
          "Community-led growth (CLG) is the strategy of turning your developer community into your most effective distribution channel. It works exceptionally well for developer tools because developers trust other developers over marketing. But CLG only works if you can find the right community members to invest in — the developers who are already engaged, already building in your space, and already motivated to contribute.",
      },
      {
        type: 'h2',
        content: 'The Problem with Passive Community Building',
      },
      {
        type: 'p',
        content:
          "Most DevRel teams build community passively: they create a Discord, write documentation, publish tutorials, and wait for contributors to show up. This works eventually, but it's slow and inefficient. The developers who would make your best contributors are already active on GitHub — they're just not finding your project yet.",
      },
      {
        type: 'h2',
        content: 'GitHub as a Community Recruitment Engine',
      },
      {
        type: 'p',
        content:
          "GitHub gives DevRel teams a searchable, real-time view of developer activity. The signals that matter for community recruitment are different from the signals that matter for sales — but they're just as accessible and just as actionable.",
      },
      {
        type: 'h3',
        content: "Finding Future Contributors from Competitor Stars",
      },
      {
        type: 'p',
        content:
          "Developers who star competing open-source projects are already engaged with your category. They've declared an interest in the problem your project solves. The DevRel play here isn't a sales pitch — it's an invitation. Reach out to introduce your project, highlight one key technical difference, and point to a 'good first issue' that matches their apparent skill level.",
      },
      {
        type: 'h3',
        content: 'Keyword Monitoring for Problem-Aware Developers',
      },
      {
        type: 'p',
        content:
          "Set up keyword monitoring for terms that indicate developers are wrestling with problems your project solves. When someone opens an issue in any public repo complaining about the limitations of your category, they're announcing themselves as a potential contributor who has first-hand experience with the problem domain.",
      },
      {
        type: 'ul',
        content: '',
        items: [
          "'anyone else struggling with [problem your tool solves]' → problem-aware developer",
          "'I wish [competitor] had [feature you have]' → feature-gap-aware candidate",
          "'looking for an alternative to [competitor]' → active evaluator and potential advocate",
          "'we ended up building our own [your category]' → experienced builder, potential contributor",
        ],
      },
      {
        type: 'h2',
        content: 'The DevRel Outreach Playbook for GitHub Signals',
      },
      {
        type: 'h3',
        content: 'Step 1: Capture the Signal',
      },
      {
        type: 'p',
        content:
          "Use GitLeads to monitor 3-5 repos in your space and 2-3 keyword patterns that indicate community fit. Route these into a Slack channel (not your sales CRM — this is a different motion with different intent). Your DevRel team should triage these daily.",
      },
      {
        type: 'h3',
        content: 'Step 2: Qualify by GitHub Profile',
      },
      {
        type: 'p',
        content:
          "Not every signal-firing developer is worth reaching out to. Before outreach, check the enriched profile GitLeads provides. Look for: primary language matching your tech stack, active commit history in the last 90 days, 50+ followers (indicates established community presence), and a bio or company that suggests relevant technical context.",
      },
      {
        type: 'h3',
        content: 'Step 3: Personalize the Outreach',
      },
      {
        type: 'p',
        content:
          "Generic outreach from DevRel teams is the fastest way to damage your community reputation. Reference the specific signal: 'I noticed you opened an issue about X in [repo] — we solved that exact problem in [your project] by doing Y.' This shows you're paying attention to their actual work, not blasting a list.",
      },
      {
        type: 'h3',
        content: 'Step 4: Offer a Low-Friction Entry Point',
      },
      {
        type: 'p',
        content:
          "The goal of the first message is to get one small interaction, not a long-term commitment. Point to a specific 'good first issue' tagged in your repo, invite them to a small community call, or ask a technical question relevant to their GitHub activity. Remove every possible barrier to that first engagement.",
      },
      {
        type: 'h2',
        content: 'Measuring Community-Led Growth from GitHub Signals',
      },
      {
        type: 'p',
        content:
          'Track these metrics monthly to evaluate your GitHub-signal-sourced community program:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Signal-sourced introductions sent per week',
          'Response rate to DevRel outreach (target: 20-30% for well-personalized messages)',
          'Discord/Slack joins attributable to GitHub signal outreach',
          'First contributions within 30 days of initial contact',
          'Contributor retention rate at 90 days',
          'Community-sourced contributions as % of total contributions',
        ],
      },
    ],
  },
  {
    slug: 'product-launch-github',
    title: 'How to Find Beta Users from GitHub Before You Launch',
    description:
      "Your launch audience is already on GitHub. Here's a systematic approach to finding 50 ideal beta testers in 48 hours using GitHub signals.",
    publishedAt: '2026-03-14',
    updatedAt: '2026-04-13',
    readingTime: 7,
    keywords: ['github beta users', 'find beta testers github', 'product launch github', 'developer beta recruitment', 'github early access'],
    sections: [
      {
        type: 'p',
        content:
          'Every developer tool launch has the same problem: you need beta users who have the exact problem your product solves, are technically capable of evaluating it, and will give you useful feedback — not just sign up and ghost. Finding those people traditionally means posting in Slack communities, running Twitter threads, or cold-emailing your network. All of these work poorly and take weeks.',
      },
      {
        type: 'p',
        content:
          "GitHub lets you find them in 48 hours with surgical precision. Here's the systematic approach.",
      },
      {
        type: 'h2',
        content: 'Step 1: Define the "Signal of Pain"',
      },
      {
        type: 'p',
        content:
          "Before searching GitHub, define the precise technical pain your product alleviates. Be specific. Not 'developers who need better monitoring' but 'developers who have opened issues about their current monitoring tool's missing features' or 'developers who mentioned switching from DataDog in a PR description.'",
      },
      {
        type: 'p',
        content:
          'The more specific your pain signal, the higher quality your beta list. Vague signals produce low-fit users who churn after one session. Specific signals produce users who immediately say "this is exactly what I needed."',
      },
      {
        type: 'h2',
        content: 'Step 2: Build Your Signal List on GitHub',
      },
      {
        type: 'h3',
        content: 'From Repository Stars',
      },
      {
        type: 'p',
        content:
          "Identify 3-5 repositories that developers use before they need your product, or that directly compete with your product. Pull the recent stargazers (last 30-60 days) — these are developers actively evaluating the category. If you're building a dev tool, target repos with 500-10,000 stars in your niche. Mega-repos (100k+ stars) have too much noise.",
      },
      {
        type: 'h3',
        content: 'From GitHub Issues',
      },
      {
        type: 'p',
        content:
          'Search GitHub Issues for the specific frustration your product resolves. Use the GitHub search operator `is:issue is:open [your keyword]` to find developers who have publicly declared the problem. These are your highest-quality beta prospects — they\'ve already articulated the problem in writing.',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Search for issues mentioning specific frustrations
is:issue is:open "too slow" "observability" label:enhancement
is:issue is:open "rate limit" "api client" language:python
is:issue is:open "alternative" "migrate from" "deployment"

# Search in specific repos
repo:grafana/grafana is:issue "slow dashboard" is:open`,
      },
      {
        type: 'h3',
        content: 'From Discussion Threads',
      },
      {
        type: 'p',
        content:
          "GitHub Discussions often surface developers asking 'what does everyone use for X?' — these category-level questions indicate developers who haven't committed to a solution yet. They're perfect beta recruits because they're still in evaluation mode and open to trying new tools.",
      },
      {
        type: 'h2',
        content: 'Step 3: Enrich and Filter',
      },
      {
        type: 'p',
        content:
          "Raw GitHub usernames are not enough. For each developer on your list, you need to verify: (1) their primary language matches your tool's requirements, (2) they have recent commit activity showing active development, and (3) their profile suggests they have the autonomy to adopt new tools (solo developers and small team leads are best for early betas).",
      },
      {
        type: 'h2',
        content: 'Step 4: The Beta Outreach Message',
      },
      {
        type: 'p',
        content:
          'The beta recruitment message has a specific structure that converts well for developers:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          "Lead with the signal: 'I saw you opened [issue / starred X / mentioned Y]'",
          "Name the exact problem: 'You mentioned the latency issue — that's exactly what we built [Product] to solve'",
          "Set expectations clearly: 'It takes 5 minutes to set up, no credit card, and I'm asking for 20 minutes of feedback in return'",
          'Provide direct access: include the beta link, not a waitlist',
        ],
      },
      {
        type: 'h2',
        content: 'Step 5: Automate with GitLeads',
      },
      {
        type: 'p',
        content:
          'For ongoing beta recruitment (rolling cohorts, post-launch early access programs), set up GitLeads to continuously monitor your target repos and keywords. New developers who match your signal criteria are automatically enriched and pushed to a HubSpot list, Clay table, or Smartlead campaign — ready for outreach without manual review. This turns a one-time 48-hour sprint into a continuous beta pipeline.',
      },
      {
        type: 'h2',
        content: 'What 50 Beta Users Looks Like in Practice',
      },
      {
        type: 'p',
        content:
          'For a developer tool with a reasonably defined niche, a 48-hour GitHub signal sweep typically yields: 200-500 candidate developers from repo stars and issues, 80-120 passing ICP filters (right language, active accounts, relevant context), 50-70 with public email addresses or reachable via GitHub, and 20-30% response rates on personalized outreach. This gives you a realistic path to 10-20 committed beta users in 48 hours — more than enough to start getting meaningful feedback.',
      },
    ],
  },
  {
    slug: 'api-product-gtm',
    title: 'GTM for API Products: Why Traditional SaaS Playbooks Fail',
    description:
      "API products have different buyers, different sales cycles, and different signals. Here's the GTM playbook that actually works for API-first developer tools.",
    publishedAt: '2026-03-07',
    updatedAt: '2026-04-12',
    readingTime: 10,
    keywords: ['api product gtm', 'api go to market', 'developer tool gtm', 'api sales playbook', 'product led growth api'],
    sections: [
      {
        type: 'p',
        content:
          "Building an API product is a fundamentally different go-to-market problem than building a traditional SaaS tool with a UI. The buyer is often the same person as the user. The sales cycle starts before you ever talk to anyone. The product trial happens in a terminal, not a browser. And the signals that indicate purchase intent look nothing like what your CRM was designed to track.",
      },
      {
        type: 'h2',
        content: 'Why Traditional SaaS GTM Fails for APIs',
      },
      {
        type: 'h3',
        content: "Problem 1: The Buyer Is Usually Not in Marketing's Target Audience",
      },
      {
        type: 'p',
        content:
          "Traditional SaaS GTM builds awareness with economic buyers (VPs, Directors, C-suite) and funnels them to product demos. API products are often adopted bottom-up — an individual developer discovers your API, integrates it, proves value, and then requests budget. By the time a VP knows your product exists, it's already been integrated for 3 months.",
      },
      {
        type: 'h3',
        content: "Problem 2: Demos Don't Work",
      },
      {
        type: 'p',
        content:
          "Showing a developer a demo of an API is largely pointless. They want to try it. The 'demo' for an API product is a working example with their own data or a 5-minute integration test. Every conversion gate that adds friction between a developer and running your API for the first time costs you customers.",
      },
      {
        type: 'h3',
        content: 'Problem 3: Intent Signals Are Different',
      },
      {
        type: 'p',
        content:
          "A prospect downloading a whitepaper is a meaningful intent signal in traditional SaaS. For API products, that same developer may have already integrated your API into a production system without ever entering your funnel. The signals that predict API product adoption are technical: GitHub activity, Stack Overflow questions, developer forum mentions, and direct API calls.",
      },
      {
        type: 'h2',
        content: 'The API Product GTM Playbook',
      },
      {
        type: 'h3',
        content: 'Stage 1: Developer Discovery (GitHub-First Awareness)',
      },
      {
        type: 'p',
        content:
          'For API products, developer discovery almost always starts on GitHub, Stack Overflow, or a package registry (npm, PyPI, crates.io). Your GTM investment should weight heavily toward these channels:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Open-source your client SDK and maintain it actively — this is your primary discovery surface',
          'Get listed in the relevant awesome-* lists and framework integrations',
          'Answer GitHub issues in competing or complementary libraries',
          'Publish a compelling GitHub README with a working example above the fold',
          'Optimize your npm/PyPI package page — developers evaluate packages before APIs',
        ],
      },
      {
        type: 'h3',
        content: 'Stage 2: Frictionless First Integration',
      },
      {
        type: 'p',
        content:
          "The conversion gate for an API product is the first successful API call, not a signup form. Design your onboarding backward from that moment. Every step that doesn't directly contribute to that first successful call is friction you should eliminate.",
      },
      {
        type: 'ul',
        content: '',
        items: [
          'API key available immediately after signup (no sales call gate)',
          'Working quickstart in under 5 minutes for the primary use case',
          'Sandbox environment or generous free tier for evaluation',
          'CLI or SDK that handles auth — don\'t make developers manually construct API headers',
        ],
      },
      {
        type: 'h3',
        content: 'Stage 3: Signal-Based Sales Activation',
      },
      {
        type: 'p',
        content:
          "This is where the API GTM playbook diverges most sharply from traditional SaaS. Your sales team should not be calling developers who filled out a 'Request a Demo' form — they should be reaching developers who just made their 100th API call, whose usage spiked 5x in the last week, or who opened a GitHub issue asking about enterprise features.",
      },
      {
        type: 'p',
        content:
          "GitHub signal capture becomes your primary lead source for this stage. Developers who mention your API in GitHub Issues, who star your SDK repo, who open issues about scaling your API, or who mention alternatives they're evaluating are all declaring intent publicly. Capturing and routing those signals to your sales team is the highest-ROI GTM motion available for API products.",
      },
      {
        type: 'h3',
        content: 'Stage 4: Expansion Through Technical Success',
      },
      {
        type: 'p',
        content:
          "For API products, expansion happens through deeper integration, not upselling features. A developer who integrated your API for one use case will expand to adjacent use cases when they trust the API and have good developer experience. Your customer success for API products is primarily technical: better documentation, more examples, faster support response in GitHub Issues.",
      },
      {
        type: 'h2',
        content: 'Measuring API GTM Performance',
      },
      {
        type: 'p',
        content:
          'Traditional SaaS metrics (MQLs, SQLs, demo completion rate) are the wrong measurement framework for API products. Replace them with:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Time to first successful API call (target: < 5 minutes)',
          'Activation rate: % of signups who make 10+ API calls in first 7 days',
          'GitHub-sourced leads as % of total pipeline',
          'Developer NPS (separate from overall NPS)',
          'SDK download growth rate week-over-week',
          'Stack Overflow answer visibility for your primary keywords',
        ],
      },
      {
        type: 'h2',
        content: 'GitHub Signals as Your API GTM Foundation',
      },
      {
        type: 'p',
        content:
          "If you're building an API product, GitHub is simultaneously your best marketing channel and your best lead source. Monitoring who is discussing your category, starring related tools, and mentioning your API in issues gives you the developer intent data that no traditional marketing attribution model can capture. GitLeads automates this signal capture and routes it to your existing sales stack — turning GitHub's public activity feed into a real-time pipeline of developer leads.",
      },
    ],
  },
  {
    slug: 'github-keyword-monitoring-for-sales',
    title: 'GitHub Keyword Monitoring for Sales: How to Catch Buyers in the Act',
    description:
      'Learn how to monitor GitHub Issues, PRs, and discussions for sales keywords — and automatically route those leads to your CRM or outreach tool the moment a developer signals intent.',
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-19',
    readingTime: 9,
    keywords: [
      'github keyword monitoring',
      'monitor github issues for leads',
      'github keyword alerts sales',
      'github intent signals',
      'github issue tracking sales',
    ],
    sections: [
      {
        type: 'p',
        content:
          'Every day, thousands of developers post questions on GitHub that are direct expressions of buying intent. They open issues asking how to migrate from a competitor. They comment in PRs that they are evaluating tools. They mention budget, timelines, and pain points in public discussions. Most sales teams never see any of it. GitHub keyword monitoring changes that.',
      },
      {
        type: 'h2',
        content: 'What Is GitHub Keyword Monitoring?',
      },
      {
        type: 'p',
        content:
          'GitHub keyword monitoring means continuously watching GitHub Issues, Pull Requests, Discussions, commit messages, and code comments for specific terms — competitor names, category keywords, pain-point phrases — and capturing the profiles of developers who post them. Unlike website visitor tracking, which captures anonymous page views, keyword monitoring captures named developers with verified GitHub identities who have publicly stated something relevant to what you sell.',
      },
      {
        type: 'p',
        content:
          'The signal types available for keyword monitoring on GitHub include: Issues (bug reports, feature requests, how-to questions), Pull Requests (code reviews mentioning specific tools or techniques), Discussions (longer-form community conversations), commit messages (what changes developers are making and why), and README files updated to mention new dependencies.',
      },
      {
        type: 'h2',
        content: 'High-Intent Keywords to Monitor by Category',
      },
      {
        type: 'h3',
        content: 'Competitor Evaluation Keywords',
      },
      {
        type: 'ul',
        content: '',
        items: [
          '"looking for alternative to [competitor]"',
          '"migrate from [competitor] to"',
          '"switching from [competitor]"',
          '"[competitor] pricing too expensive"',
          '"[competitor] vs [your product]"',
          '"frustrated with [competitor]"',
        ],
      },
      {
        type: 'h3',
        content: 'Category Pain Point Keywords',
      },
      {
        type: 'ul',
        content: '',
        items: [
          '"how do I find developer leads"',
          '"github prospecting"',
          '"developer outreach tool"',
          '"CRM for developer sales"',
          '"github API rate limit workaround"',
          '"scraping github for leads" (yes, people ask this)',
        ],
      },
      {
        type: 'h3',
        content: 'Budget and Timeline Keywords',
      },
      {
        type: 'ul',
        content: '',
        items: [
          '"we are evaluating tools for"',
          '"budget approved for"',
          '"procurement process for"',
          '"need to decide by Q2"',
          '"rollout plan for"',
        ],
      },
      {
        type: 'h2',
        content: 'How to Monitor GitHub Keywords Manually',
      },
      {
        type: 'p',
        content:
          'GitHub\'s search interface at github.com/search supports full-text search across Issues, PRs, and Discussions. You can use the query type:issue "your keyword" to search issues, or type:pr for pull requests. However, this approach has severe limitations for sales use cases.',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Manual GitHub search for keyword monitoring
# Search issues mentioning competitor alternatives
curl -H "Authorization: Bearer $GH_TOKEN" \\
  "https://api.github.com/search/issues?q=%22alternative+to+competitor%22+type:issue&sort=created&order=desc"

# Search discussions for evaluation keywords
curl -H "Authorization: Bearer $GH_TOKEN" \\
  "https://api.github.com/search/issues?q=%22evaluating%22+%22developer+tool%22+type:discussion"`,
      },
      {
        type: 'h3',
        content: 'Limitations of Manual Keyword Monitoring',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'GitHub search API is rate-limited to 30 requests/minute for authenticated users',
          'Search results are not real-time — new content may take minutes to hours to index',
          'No alerting — you have to re-run searches manually or build polling infrastructure',
          'No enrichment — raw search results give you username and post, not email, company, tech stack',
          'No deduplication — the same developer may appear across dozens of results',
          'No CRM push — you still have to manually route leads to your sales stack',
        ],
      },
      {
        type: 'h2',
        content: 'Building a Keyword Monitoring Pipeline',
      },
      {
        type: 'p',
        content:
          'A production-grade GitHub keyword monitoring pipeline needs four components: a crawler that polls GitHub search results for your target keywords, an enrichment layer that fetches full developer profiles (email, company, bio, top languages), a deduplication store to avoid surfacing the same developer twice, and a routing layer that pushes enriched leads into your CRM, Slack channel, or outreach sequence.',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests, time, json
from datetime import datetime, timedelta

GH_TOKEN = "ghp_your_token"
KEYWORDS = ["alternative to competitor", "looking for developer tool", "github lead generation"]
SEEN = set()  # production: use Redis or a DB

def search_github_issues(keyword: str, since: str):
    headers = {"Authorization": f"Bearer {GH_TOKEN}"}
    q = f'"{keyword}" type:issue created:>{since}'
    url = f"https://api.github.com/search/issues?q={requests.utils.quote(q)}&per_page=30"
    resp = requests.get(url, headers=headers)
    return resp.json().get("items", [])

def enrich_user(username: str):
    headers = {"Authorization": f"Bearer {GH_TOKEN}"}
    resp = requests.get(f"https://api.github.com/users/{username}", headers=headers)
    p = resp.json()
    return {
        "login": p.get("login"),
        "email": p.get("email"),
        "company": p.get("company"),
        "location": p.get("location"),
        "bio": p.get("bio"),
        "followers": p.get("followers"),
        "public_repos": p.get("public_repos"),
    }

def monitor_loop():
    since = (datetime.utcnow() - timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%SZ")
    for keyword in KEYWORDS:
        for issue in search_github_issues(keyword, since):
            username = issue["user"]["login"]
            if username in SEEN:
                continue
            SEEN.add(username)
            lead = enrich_user(username)
            lead["signal"] = keyword
            lead["source_url"] = issue["html_url"]
            lead["signal_text"] = issue["title"]
            # TODO: push to CRM
            print(json.dumps(lead, indent=2))
        time.sleep(2)  # stay under rate limits

monitor_loop()`,
      },
      {
        type: 'p',
        content:
          'This script is a starting point, but running it in production requires handling rate limit backoff, persistent deduplication across runs, error recovery, and the CRM push layer. GitLeads handles all of this infrastructure — you define the keywords, and enriched leads flow into your existing tools automatically.',
      },
      {
        type: 'h2',
        content: 'What to Do With Keyword-Matched Leads',
      },
      {
        type: 'p',
        content:
          'A developer who mentions a competitor or category keyword in a GitHub issue is at the top of the funnel but with much higher intent than a typical MQL. They have a real problem, they are actively looking for a solution, and they have done so publicly. The right response is not a cold sequence — it is a warm, context-aware outreach that references what they said.',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Use the signal context in your first touch: "I noticed you asked about alternatives to X in the Y repo — we built GitLeads for exactly this use case"',
          'Prioritize leads with a public email in their GitHub profile over those without',
          'Route high-follower developers (100+ followers) to your AE directly — they have influence',
          'Flag leads whose company field matches your target accounts for immediate SDR follow-up',
          'Add signal context to your CRM record so your entire team knows why this person appeared',
        ],
      },
      {
        type: 'h2',
        content: 'Setting Up GitHub Keyword Monitoring with GitLeads',
      },
      {
        type: 'p',
        content:
          'GitLeads has a built-in keyword signal monitor. You enter the keywords you want to watch, select the scope (all of GitHub vs. specific repos), and GitLeads continuously scans Issues, PRs, Discussions, and code for matches. When a match is found, the developer\'s enriched profile is immediately pushed to your configured destination — HubSpot, Slack, Smartlead, Clay, or any webhook endpoint.',
      },
      {
        type: 'p',
        content:
          'Unlike building your own pipeline, GitLeads handles rate limiting, enrichment, deduplication, and routing in a single workflow. The free plan includes 50 leads per month from keyword signals. Paid plans start at $49/month for 500 leads.',
      },
      {
        type: 'p',
        content:
          'Start monitoring GitHub keywords for free at gitleads.app. No credit card required. See also: how to find leads on GitHub, GitHub buying signals, and our integration guides for HubSpot and Slack.',
      },
    ],
  },
  {
    slug: 'push-github-leads-to-crm',
    title: 'How to Push GitHub Leads to Your CRM (HubSpot, Salesforce, Pipedrive)',
    description:
      'A practical guide to routing GitHub developer leads — stargazers, keyword mentions, and issue signals — into HubSpot, Salesforce, Pipedrive, and other CRMs automatically.',
    publishedAt: '2026-04-14',
    updatedAt: '2026-04-19',
    readingTime: 8,
    keywords: [
      'push github leads to hubspot',
      'github leads crm integration',
      'github leads salesforce',
      'github leads pipedrive',
      'send github leads to crm',
    ],
    sections: [
      {
        type: 'p',
        content:
          'GitHub surfaces developer buying signals constantly — new stars on your repo, keyword mentions in Issues and PRs, developers switching from competitors. But signals captured in GitHub stay in GitHub unless you build (or use) a pipeline that pushes them into the CRM your sales team actually works in. This guide covers how to route GitHub leads into HubSpot, Salesforce, and Pipedrive.',
      },
      {
        type: 'h2',
        content: 'Why GitHub Leads Need to Live in Your CRM',
      },
      {
        type: 'p',
        content:
          'A GitHub signal with no action is just noise. For developer leads to convert, they need to enter your sales workflow: sequenced outreach, follow-up reminders, pipeline stages, and attribution tracking. None of that happens if your GitHub signals stay in a spreadsheet or a Slack channel nobody checks. Your CRM is where leads become pipeline.',
      },
      {
        type: 'h2',
        content: 'Method 1: Push GitHub Leads to HubSpot',
      },
      {
        type: 'p',
        content:
          'HubSpot\'s Contacts API is the most straightforward target for GitHub lead routing. A GitHub developer profile maps cleanly to a HubSpot contact: email → email, GitHub username → custom property, company → company, bio → about, follower count → custom property for lead scoring.',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests

HUBSPOT_TOKEN = "pat-na1-your-hubspot-private-app-token"

def push_to_hubspot(lead: dict):
    """Push a GitHub lead to HubSpot as a contact."""
    url = "https://api.hubapi.com/crm/v3/objects/contacts"
    headers = {
        "Authorization": f"Bearer {HUBSPOT_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "properties": {
            "email": lead.get("email", ""),
            "firstname": (lead.get("name") or "").split()[0] if lead.get("name") else "",
            "lastname": " ".join((lead.get("name") or "").split()[1:]) if lead.get("name") else "",
            "company": (lead.get("company") or "").lstrip("@"),
            "city": lead.get("location", ""),
            "description": lead.get("bio", ""),
            "github_username": lead.get("login", ""),     # custom property
            "github_signal_type": lead.get("signal_type", ""),  # custom property
            "github_signal_context": lead.get("signal_text", ""),  # custom property
            "lead_source": "GitHub Signal",
        }
    }
    # Use upsert to avoid duplicate contacts
    upsert_url = f"{url}/batch/upsert"
    resp = requests.post(
        upsert_url,
        headers=headers,
        json={"inputs": [{"idProperty": "email", "properties": payload["properties"]}]},
    )
    return resp.json()`,
      },
      {
        type: 'p',
        content:
          'To make this work well in HubSpot, create three custom contact properties first: github_username (single-line text), github_signal_type (dropdown: stargazer, keyword, issue), and github_signal_context (multi-line text). This gives your sales team the full context on why each lead appeared.',
      },
      {
        type: 'h2',
        content: 'Method 2: Push GitHub Leads to Salesforce',
      },
      {
        type: 'p',
        content:
          'Salesforce requires a connected app with OAuth or a named credential. The simplest approach for GitHub lead ingestion is the Salesforce Composite API, which lets you upsert a Lead or Contact record in a single call.',
      },
      {
        type: 'code',
        language: 'python',
        content: `from simple_salesforce import Salesforce

sf = Salesforce(username="you@co.com", password="pass", security_token="token")

def push_to_salesforce(lead: dict):
    """Upsert a GitHub lead as a Salesforce Lead."""
    data = {
        "FirstName": (lead.get("name") or "GitHub User").split()[0],
        "LastName": (lead.get("name") or lead.get("login", "Unknown")).split()[-1],
        "Email": lead.get("email", ""),
        "Company": (lead.get("company") or "Unknown").lstrip("@"),
        "LeadSource": "GitHub Signal",
        "Description": lead.get("bio", ""),
        "City": lead.get("location", ""),
        # Custom fields (API names depend on your Salesforce org)
        "GitHub_Username__c": lead.get("login", ""),
        "GitHub_Signal_Type__c": lead.get("signal_type", ""),
        "GitHub_Signal_Context__c": lead.get("signal_text", ""),
        "GitHub_Followers__c": lead.get("followers", 0),
    }
    # Upsert on Email to avoid duplicates
    if data["Email"]:
        sf.Lead.upsert(f"Email/{data['Email']}", data)
    else:
        sf.Lead.create(data)`,
      },
      {
        type: 'h2',
        content: 'Method 3: Push GitHub Leads to Pipedrive',
      },
      {
        type: 'p',
        content:
          'Pipedrive\'s Persons API maps directly to developer profiles. For GTM teams using Pipedrive, the best approach is to create a Person (the developer) and optionally an Organization (their company) and a Deal in one sequence.',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests

PIPEDRIVE_TOKEN = "your_pipedrive_api_token"
BASE = "https://api.pipedrive.com/v1"

def push_to_pipedrive(lead: dict):
    headers = {"Content-Type": "application/json"}
    params = {"api_token": PIPEDRIVE_TOKEN}

    # 1. Create or find Person
    person_data = {
        "name": lead.get("name") or lead.get("login", "Unknown"),
        "email": [{"value": lead.get("email", ""), "primary": True}],
        "org_name": (lead.get("company") or "").lstrip("@"),
    }
    person_resp = requests.post(
        f"{BASE}/persons", json=person_data, params=params, headers=headers
    )
    person_id = person_resp.json().get("data", {}).get("id")

    # 2. Create a Deal linked to the person
    deal_data = {
        "title": f"GitHub Signal: {lead.get('login')} — {lead.get('signal_type')}",
        "person_id": person_id,
        "status": "open",
    }
    requests.post(f"{BASE}/deals", json=deal_data, params=params, headers=headers)`,
      },
      {
        type: 'h2',
        content: 'Method 4: Use Zapier or n8n as a Routing Layer',
      },
      {
        type: 'p',
        content:
          'If you do not want to write code, Zapier and n8n both support webhook triggers and have native connectors for HubSpot, Salesforce, and Pipedrive. The pattern is: configure GitLeads to send a webhook on each new lead → Zapier/n8n receives the webhook → maps fields → creates/updates a CRM record.',
      },
      {
        type: 'p',
        content:
          'GitLeads sends the following JSON payload on each lead webhook: login, name, email, company, location, bio, followers, top_languages, signal_type (stargazer or keyword), signal_context (repo name or keyword matched), signal_url (link to the GitHub event), and captured_at (ISO timestamp). This payload is pre-formatted for direct Zapier/n8n field mapping.',
      },
      {
        type: 'h2',
        content: 'What GitHub Lead Data to Include in Your CRM',
      },
      {
        type: 'p',
        content:
          'Not all GitHub fields have equal sales value. Here is how to prioritize what goes into your CRM contact record:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Email (required for outreach — filter leads without public email for LinkedIn-only sequences)',
          'GitHub username (link your SDRs directly to the developer profile)',
          'Signal type and context (the most important field — tells your team why this person appeared)',
          'Company (use for account-based matching with your existing CRM records)',
          'Follower count (proxy for community influence — 500+ followers = potential champion)',
          'Top languages (used for personalizing technical outreach)',
          'Location (timezone matters for call scheduling and GDPR applicability)',
        ],
      },
      {
        type: 'h2',
        content: 'Avoiding Duplicate Contacts',
      },
      {
        type: 'p',
        content:
          'GitHub developers may trigger multiple signals over time: they star a repo, then later mention a keyword. You want to update their existing CRM record rather than create duplicate contacts. Use email as the primary dedup key if available. If email is missing (common for developers who have not made it public), fall back to GitHub username stored in a custom property. HubSpot, Salesforce, and Pipedrive all support upsert operations on custom unique identifiers.',
      },
      {
        type: 'h2',
        content: 'Push GitHub Leads to Your CRM with GitLeads',
      },
      {
        type: 'p',
        content:
          'GitLeads has native integrations for HubSpot and is building direct connectors for Salesforce and Pipedrive. Today, you can push to any CRM via the Zapier and webhook integrations, which support all field mapping. The signal context, GitHub profile, and enriched lead data come pre-packaged in the webhook payload — no additional enrichment step required.',
      },
      {
        type: 'p',
        content:
          'Start pushing GitHub leads to your CRM today at gitleads.app. The free plan includes 50 enriched leads per month. Related: GitHub keyword monitoring for sales, turn GitHub stargazers into leads, and our HubSpot integration guide.',
      },
    ],
  },
  {
    slug: 'competitor-repo-stargazers-as-leads',
    title: 'How to Use Competitor GitHub Repo Stars as a Lead Source',
    description:
      'Developers who star your competitor\'s open-source repos are warm prospects for your product. Here\'s how to identify them, enrich their profiles, and reach out with context.',
    publishedAt: '2026-04-17',
    updatedAt: '2026-04-19',
    readingTime: 8,
    keywords: [
      'competitor github stars leads',
      'mine competitor repo stargazers',
      'github stargazer intelligence',
      'competitor open source lead generation',
      'github competitive intelligence sales',
    ],
    sections: [
      {
        type: 'p',
        content:
          'When a developer stars your competitor\'s open-source repo, they are announcing two things publicly: they know the category exists, and they found your competitor\'s solution interesting enough to bookmark. That is a buyer at the awareness stage with category intent already confirmed. For sales teams selling developer tools, competitor repo stargazers are among the warmest leads available — and GitHub makes the entire list public.',
      },
      {
        type: 'h2',
        content: 'Why Competitor Stargazers Are High-Intent Leads',
      },
      {
        type: 'p',
        content:
          'Starring a repo on GitHub is not accidental. It requires a conscious action. Unlike a website visit — which could be a bot, a job seeker, or a one-second accidental click — a GitHub star means the developer actively decided to save this project for later. When someone stars prometheus/prometheus, they are probably building observability infrastructure. When someone stars supabase/supabase, they are probably evaluating Postgres hosting. When someone stars your competitor\'s repo, they want what your competitor sells.',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Category intent confirmed — they know the problem category exists and are actively researching solutions',
          'Technical profile public — you can see their top languages, repos, and GitHub activity',
          'Recent activity checkable — starring a repo recently means they are evaluating now, not 18 months ago',
          'Often reachable — a significant percentage of active GitHub developers have a public email on their profile',
        ],
      },
      {
        type: 'h2',
        content: 'How to Get a Competitor\'s Stargazer List',
      },
      {
        type: 'p',
        content:
          'GitHub exposes stargazer lists via its public API. The endpoint GET /repos/{owner}/{repo}/stargazers returns paginated user objects. For enriched profiles including email, company, and bio, each returned username requires a second call to GET /users/{username}.',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests, time

GH_TOKEN = "ghp_your_token"
HEADERS = {"Authorization": f"Bearer {GH_TOKEN}"}

def get_new_stargazers(owner: str, repo: str, since_page: int = 1, max_pages: int = 5):
    """Fetch recent stargazers from a competitor repo."""
    # Use Accept header to get starred_at timestamps
    h = {**HEADERS, "Accept": "application/vnd.github.star+json"}
    leads = []
    for page in range(since_page, since_page + max_pages):
        url = f"https://api.github.com/repos/{owner}/{repo}/stargazers"
        resp = requests.get(url, headers=h, params={"page": page, "per_page": 100})
        if resp.status_code != 200 or not resp.json():
            break
        for entry in resp.json():
            user = entry["user"]
            # Enrich each user
            profile = requests.get(user["url"], headers=HEADERS).json()
            leads.append({
                "login": profile.get("login"),
                "name": profile.get("name"),
                "email": profile.get("email"),
                "company": profile.get("company"),
                "location": profile.get("location"),
                "bio": profile.get("bio"),
                "followers": profile.get("followers"),
                "starred_at": entry.get("starred_at"),
                "source_repo": f"{owner}/{repo}",
                "signal_type": "competitor_star",
            })
            time.sleep(0.1)  # gentle rate limiting
    return leads

# Example: monitor who's starring a competitor
leads = get_new_stargazers("langfuse", "langfuse")  # monitoring AI observability competitor
print(f"Found {len([l for l in leads if l['email']])} leads with public emails")`,
      },
      {
        type: 'h2',
        content: 'Which Competitor Repos to Monitor',
      },
      {
        type: 'p',
        content:
          'The best competitor repos to monitor are ones where a new star is a reliable buying signal for your category. Not all open-source stars are equal. A developer starring a popular UI component library (1M stars) may just be a frontend developer bookmarking a cool thing. A developer starring a niche developer tool in your exact category (5K stars) almost certainly wants what that tool does.',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Direct competitors: repos for tools that do exactly what you do',
          'Category adjacents: repos in adjacent categories that indicate the same buyer persona (e.g., if you sell observability tooling, monitor repos for logging, tracing, metrics)',
          'Complement tools: repos for tools that developers use alongside yours (integration-partner repos)',
          'Problem-space repos: repos whose README describes the same problem your product solves',
          'Avoid: mega-popular generic repos (linux/linux, facebook/react) — too noisy, not category-specific',
        ],
      },
      {
        type: 'h2',
        content: 'Filtering Stargazers for Sales Quality',
      },
      {
        type: 'p',
        content:
          'Not every stargazer is worth outreach. A student with 0 repos who starred a project for a class assignment is not the same as a senior engineer at a Series B startup who regularly contributes to open-source infrastructure tools. Apply these filters to prioritize your outreach queue:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          'Has a public email (required for email sequences; LinkedIn for others)',
          'Public repos > 5 (indicates an active developer, not a passive observer)',
          'Followers > 10 (indicates a developer with some community presence)',
          'Company field is set (indicates professional context)',
          'Account created > 12 months ago (reduces student/hobbyist noise)',
          'Starred within the last 30 days (recency = active evaluation)',
        ],
      },
      {
        type: 'h2',
        content: 'How to Reach Out to Competitor Stargazers',
      },
      {
        type: 'p',
        content:
          'The mistake most teams make is sending a generic cold email to competitor stargazers. These developers have starred a competitor — they know the category, and they have chosen a solution. The outreach that works acknowledges that context directly.',
      },
      {
        type: 'p',
        content:
          'Effective opening line templates for competitor stargazer outreach:',
      },
      {
        type: 'ul',
        content: '',
        items: [
          '"I noticed you starred [competitor repo] — we built [your product] for teams that need X that [competitor] doesn\'t cover"',
          '"You bookmarked [competitor] — if you\'re evaluating tools in this space, we\'re worth a look because [specific differentiator]"',
          '"Saw you starred [competitor] recently. We\'re similar but optimized for [your ICP use case]. Free tier if you want to compare"',
        ],
      },
      {
        type: 'p',
        content:
          'Keep the first email to 3 sentences maximum. You are reaching a developer who made no move toward you — respect that. Give them something immediately useful (a feature comparison, a free trial link, a relevant doc) rather than asking for a meeting.',
      },
      {
        type: 'h2',
        content: 'Automating Competitor Repo Monitoring with GitLeads',
      },
      {
        type: 'p',
        content:
          'Building and maintaining a competitor stargazer pipeline manually requires ongoing engineering effort: rate limit handling, incremental polling (you only want new stars, not the full historical list), profile enrichment, deduplication, and CRM push. GitLeads automates this entire workflow.',
      },
      {
        type: 'p',
        content:
          'In GitLeads, you add a tracked repo (your competitor\'s GitHub repo URL) and choose your integration destinations. From that point, every new stargazer on that repo is automatically enriched and routed to your HubSpot, Slack, or outreach tool in real time. You can track multiple competitor repos simultaneously. New stars appear in your lead queue within minutes of them occurring on GitHub.',
      },
      {
        type: 'p',
        content:
          'Start monitoring competitor repos for free at gitleads.app. Related: turn GitHub stargazers into leads, GitHub buying signals for sales teams, and how to find leads on GitHub.',
      },
    ],
  },
  {
    slug: 'github-email-finder',
    title: 'GitHub Email Finder: How to Find Developer Emails on GitHub (2026)',
    description:
      'A practical guide to finding public email addresses on GitHub — using the GitHub API, commit metadata, profile pages, and automated tools. Plus: what to do when emails are hidden.',
    publishedAt: '2026-04-22',
    updatedAt: '2026-04-22',
    readingTime: 9,
    keywords: ['github email finder', 'find emails on github', 'github email scraper', 'github developer email', 'find email address github'],
    sections: [
      {
        type: 'p',
        content:
          'Many developers publish their email address publicly on GitHub. The challenge is knowing where to look and how to extract that data at scale without hitting rate limits or violating GitHub\'s terms of service. This guide covers every legitimate method to find developer email addresses on GitHub in 2026 — from manual profile checks to API-based extraction.',
      },
      {
        type: 'h2',
        content: 'Where Developers Publish Emails on GitHub',
      },
      {
        type: 'p',
        content:
          'GitHub surfaces email addresses in four main places: the public profile page (if the developer has made their email visible), the commit author metadata returned by the Git protocol, the GitHub API user endpoint, and the GitHub API events endpoint. Roughly 30–40% of active GitHub developers have a publicly discoverable email via one or more of these paths.',
      },
      {
        type: 'ul',
        items: [
          'Profile page: github.com/username — check the Contact section. Visible only if the user has enabled "Show email on profile."',
          'Commits API: GET /repos/{owner}/{repo}/commits lists commit metadata including the committer email — even if the profile email is hidden.',
          'User API: GET /users/{username} returns email if public.',
          'Events API: GET /users/{username}/events sometimes exposes the email field in push event payloads.',
        ],
      },
      {
        type: 'h2',
        content: 'Using the GitHub API to Find Emails at Scale',
      },
      {
        type: 'p',
        content:
          'The most reliable programmatic approach combines the Users API and the Commits API. Start with the user endpoint to get the primary email. If it returns null, iterate through their recent public repos and pull commit metadata. GitHub returns commit author/committer name and email in the Commits API even for users who have their profile email hidden — because this data comes from the Git object itself, not from the GitHub user record.',
      },
      {
        type: 'code',
        language: 'bash',
        content:
          '# Step 1: Check profile email\ncurl -H "Authorization: Bearer $GITHUB_TOKEN" \\\n  https://api.github.com/users/octocat\n# → { "email": "octocat@github.com" } or null\n\n# Step 2: If null, check commit metadata\ncurl -H "Authorization: Bearer $GITHUB_TOKEN" \\\n  "https://api.github.com/repos/octocat/Hello-World/commits?per_page=5"\n# → [{  "commit": { "author": { "email": "octocat@github.com" } } }]',
      },
      {
        type: 'h2',
        content: 'Rate Limits and What They Mean for Email Extraction',
      },
      {
        type: 'p',
        content:
          'Authenticated GitHub API requests are limited to 5,000 per hour. For a list of 1,000 developers, that means two API calls per developer (user endpoint + commits endpoint) = 2,000 requests. You can process roughly 2,500 developers per hour before hitting the limit. At scale, this requires token rotation across multiple GitHub accounts — each with a fresh 5,000 req/hr quota. GitHub\'s terms of service permit automated access for personal use but prohibit building commercial data products that redistribute the scraped data.',
      },
      {
        type: 'h2',
        content: 'When the Email is Hidden: What to Do',
      },
      {
        type: 'p',
        content:
          'Many developers — especially senior engineers and maintainers — deliberately hide their email to avoid spam. In these cases, email extraction fails. The better approach is to use the GitHub signal itself (the star, the issue comment, the keyword mention) as the trigger to reach out via other channels: LinkedIn, Twitter/X, or Discord. A well-timed, contextual message referencing what they actually did on GitHub ("I noticed you starred X") converts far better than a cold email to a guessed address.',
      },
      {
        type: 'h2',
        content: 'A Better Alternative: Signal-Based Outreach Without Email',
      },
      {
        type: 'p',
        content:
          'GitLeads captures the developer\'s public GitHub signal — the star event, the keyword mention, the issue comment — and enriches it with all publicly available profile data: name, GitHub URL, bio, company, top languages, and email if public. The enriched lead is then pushed to your sales tool (HubSpot, Smartlead, Lemlist, Slack) for follow-up.',
      },
      {
        type: 'p',
        content:
          'For leads without a public email, GitLeads still delivers the GitHub username, profile URL, company, and bio — enough context to reach out intelligently via other channels. This approach sidesteps the rate limit problem entirely: GitLeads handles the GitHub API calls, deduplication, and enrichment. You get clean, enriched leads in your existing tool without writing a line of scraping code.',
      },
      {
        type: 'callout',
        content:
          'GitLeads captures GitHub signals and enriches leads with public email when available. Start free at gitleads.app. Related: how to find leads on GitHub, GitHub buying signals for sales teams, push GitHub leads to CRM.',
      },
    ],
  },
  {
    slug: 'github-lead-automation-n8n-make-zapier',
    title: 'How to Automate GitHub Lead Generation with n8n, Make, and Zapier (2026)',
    description:
      'Build automated GitHub lead generation workflows using n8n, Make, or Zapier. Connect GitHub signals to your CRM, Slack, and outreach tools without writing custom scrapers.',
    publishedAt: '2026-04-22',
    updatedAt: '2026-04-22',
    readingTime: 8,
    keywords: ['github leads automation', 'n8n github leads', 'make github leads', 'zapier github leads', 'automate github lead generation'],
    sections: [
      {
        type: 'p',
        content:
          'Manually checking GitHub for new leads — who starred your repo, who mentioned your product in an issue, who is asking about problems you solve — does not scale. The developers who signal buying intent on GitHub do so continuously and across hundreds of repos. The only way to capture these signals reliably is automation. This guide shows three paths: building your own GitHub polling workflow in n8n or Make, using Zapier, or using GitLeads as the signal layer.',
      },
      {
        type: 'h2',
        content: 'Option 1: Build a GitHub Lead Workflow in n8n',
      },
      {
        type: 'p',
        content:
          'n8n is an open-source automation platform that runs self-hosted. It supports the GitHub API natively via HTTP Request nodes and can route lead data to any downstream tool. The basic GitHub stargazer polling workflow looks like this:',
      },
      {
        type: 'ol',
        items: [
          'Schedule Trigger node: fires every 15 minutes.',
          'HTTP Request node: GET /repos/{owner}/{repo}/stargazers?per_page=100&sort=created — returns the most recent stargazers.',
          'Code node: compare new stargazers against a Postgres or Google Sheets list of already-processed users.',
          'HTTP Request node (loop): for each new stargazer, GET /users/{username} to fetch profile data.',
          'Set node: map name, email, bio, company, GitHub URL into your lead schema.',
          'Route node: send to HubSpot, Slack, Smartlead, or your webhook.',
        ],
      },
      {
        type: 'p',
        content:
          'The challenge with this approach is handling GitHub API rate limits (5,000 req/hr per token), incremental polling (avoiding re-processing old stargazers), and profile enrichment failures when emails are hidden. At scale, you also need to manage multiple tracked repos and keyword searches separately — each with its own polling loop.',
      },
      {
        type: 'h2',
        content: 'Option 2: Build a GitHub Lead Workflow in Make',
      },
      {
        type: 'p',
        content:
          'Make (formerly Integromat) has a native GitHub module with triggers for new commits, issues, and pull requests — but not for new stargazers. For stargazer monitoring you will need to use the HTTP module to call the GitHub API directly, then use an Iterator module to loop over new results. The overall structure mirrors the n8n approach above. Make\'s visual builder makes the routing logic easier to see, but the underlying rate limit and deduplication challenges are the same.',
      },
      {
        type: 'h2',
        content: 'Option 3: Use Zapier for GitHub Lead Automation',
      },
      {
        type: 'p',
        content:
          'Zapier has a GitHub integration with triggers for new commits, issues, and pull requests. As with Make, there is no native "new stargazer" trigger. You can work around this with a Zapier Webhook trigger paired with a GitHub webhook on your repo — GitHub will POST to Zapier when a new star event occurs. The downside: GitHub repo webhooks require admin access to the repo, so you cannot monitor competitor repos this way. You are limited to repos you own.',
      },
      {
        type: 'h2',
        content: 'The Simpler Path: Use GitLeads as the Signal Layer',
      },
      {
        type: 'p',
        content:
          'All three approaches above require ongoing maintenance: rate limit handling, deduplication logic, polling schedules, and error handling for failed enrichment calls. GitLeads handles this infrastructure and exposes a simple webhook output that feeds into n8n, Make, or Zapier.',
      },
      {
        type: 'p',
        content:
          'The setup: connect GitLeads to your repos and keyword monitors. GitLeads captures new signals in real time — stargazers on any tracked repo (including competitor repos you do not own), keyword mentions in issues, PRs, and discussions — enriches each lead with public profile data, and POSTs a structured JSON payload to your n8n or Make webhook.',
      },
      {
        type: 'code',
        language: 'json',
        content:
          '// Example GitLeads webhook payload\n{\n  "signal": "stargazer",\n  "repo": "vercel/next.js",\n  "starred_at": "2026-04-22T10:14:00Z",\n  "lead": {\n    "github_username": "jane_dev",\n    "name": "Jane Smith",\n    "email": "jane@example.com",\n    "bio": "Building developer tools @ Acme",\n    "company": "Acme Corp",\n    "location": "Berlin",\n    "followers": 1240,\n    "public_repos": 38,\n    "top_languages": ["TypeScript", "Go", "Rust"]\n  }\n}',
      },
      {
        type: 'p',
        content:
          'Your n8n or Make scenario receives this payload and routes it — to HubSpot, Notion, a Google Sheet, a Slack channel, or an email sequence — based on whatever conditions you want to apply. The GitHub polling, rate limit handling, and enrichment are fully abstracted away.',
      },
      {
        type: 'h2',
        content: 'Keyword Signal Automation',
      },
      {
        type: 'p',
        content:
          'Beyond stargazers, GitLeads also monitors GitHub issues, pull requests, discussions, and commit messages for keyword matches. Set up keyword monitors for terms like "looking for [product category]", "[competitor name] alternative", or "[problem your product solves]". Every match triggers a webhook payload with the issue/PR URL, the matching text, and the author\'s enriched profile. This is the GitHub equivalent of a brand mention alert — but the developers posting are often in active buying mode.',
      },
      {
        type: 'callout',
        content:
          'Start free at gitleads.app. Connect GitLeads to n8n, Make, or Zapier via webhook in minutes. Related: push GitHub leads to HubSpot, GitHub keyword monitoring for sales, GitHub intent data for B2B sales.',
      },
    ],
  },
  {
    slug: 'github-recruiting-find-engineers',
    title: 'GitHub Recruiting: How to Find and Source Engineers on GitHub (2026)',
    description:
      'The complete guide to recruiting engineers on GitHub. Learn how to use GitHub signals — repo stars, stack activity, and keyword mentions — to source passive candidates and push them directly to your ATS.',
    publishedAt: '2026-04-24',
    updatedAt: '2026-04-24',
    readingTime: 9,
    keywords: [
      'github recruiting',
      'find engineers on github',
      'source developers github',
      'github candidate sourcing',
      'technical recruiting github',
      'passive candidate sourcing github',
      'developer recruiting tool',
    ],
    sections: [
      {
        type: 'p',
        content:
          'GitHub hosts over 100 million developers — every one of them has a public record of what they actually build, not just what they claim on a resume. For technical recruiters, this is the most accurate talent database in existence. The problem is there is no native recruiting UI, no filtering by role intent, and no automated way to get candidate profiles into your ATS. This guide covers every method for sourcing engineers on GitHub in 2026, from the GitHub Search API to real-time signal monitoring with GitLeads.',
      },
      {
        type: 'h2',
        content: 'Why GitHub is the Best Source for Engineering Talent',
      },
      {
        type: 'p',
        content:
          'LinkedIn has 950 million users but its engineering data has a fundamental problem: developers rarely maintain it. A developer who wrote Python three years ago still has "Python" in their skills — even if they have been writing Rust full-time since. GitHub has no such problem. The repos a developer pushed to last week, the language breakdown of their public commits, and the projects they starred in the last 30 days are all real-time data points that reflect their actual current stack.',
      },
      {
        type: 'ul',
        items: [
          'Real-time stack data: GitHub shows what developers actually build, not what they claim',
          'Passive candidates: 60%+ of top engineers are not actively job searching but are on GitHub daily',
          'Proof of quality: public repos, stars earned, and contribution activity are objective signals',
          'Contact info: many developers list public emails in their profile for exactly this reason',
          'Community signals: followers count, project stars, and contributions show community standing',
        ],
      },
      {
        type: 'h2',
        content: 'Method 1: GitHub Search API for Candidate Discovery',
      },
      {
        type: 'p',
        content:
          'The GitHub Search API (api.github.com/search/users) lets you filter developers by programming language, location, follower count, and repository activity. It is the most direct programmatic way to build a candidate list. Here is how to use it effectively:',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Find senior Rust engineers in Berlin with 50+ followers
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/users?q=language:rust+location:Berlin+followers:>50&sort=followers&per_page=30"

# Find Go engineers who pushed code in the last 60 days
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/users?q=language:go+pushed:>2026-02-24+followers:>20"

# Find Python ML engineers with public email (bio contains @)
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/users?q=language:python+topic:machine-learning+in:bio+%40"`,
      },
      {
        type: 'p',
        content:
          'The search endpoint returns basic profile data (login, avatar, html_url). For full enrichment — email, company, bio, blog, follower count — make a second call to GET /users/{username}. Each user object returns everything public on their profile, including email if they have made it public.',
      },
      {
        type: 'h3',
        content: 'Search API Rate Limits for Recruiting',
      },
      {
        type: 'ul',
        items: [
          'Authenticated requests: 30 searches/minute, 5,000 API calls/hour',
          'Search results capped at 1,000 per query — use narrow queries to get past this',
          'User detail calls: 5,000/hour per token — sufficient for enriching ~80 candidates/minute',
          'Use multiple fine-grained personal access tokens to scale horizontally',
        ],
      },
      {
        type: 'h2',
        content: 'Method 2: Mine Repository Stars for Stack-Specific Candidates',
      },
      {
        type: 'p',
        content:
          'If you know the framework, tool, or library your role requires, its GitHub stargazers are your most pre-qualified candidate list. A developer who starred tokio-rs/tokio (the async Rust runtime) is almost certainly writing Rust professionally. The signal is far more precise than a LinkedIn "Rust" skill tag.',
      },
      {
        type: 'code',
        language: 'python',
        content: `import requests

def get_stargazers(owner: str, repo: str, token: str) -> list[dict]:
    """Get all stargazers for a repo with full profile enrichment."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.star+json",  # includes starred_at timestamp
    }
    candidates = []
    page = 1

    while True:
        resp = requests.get(
            f"https://api.github.com/repos/{owner}/{repo}/stargazers",
            headers=headers,
            params={"per_page": 100, "page": page},
        )
        data = resp.json()
        if not data:
            break

        for entry in data:
            user = entry.get("user", entry)
            # Enrich with full profile
            profile = requests.get(
                f"https://api.github.com/users/{user['login']}",
                headers=headers,
            ).json()
            candidates.append({
                "login": profile["login"],
                "name": profile.get("name"),
                "email": profile.get("email"),
                "company": profile.get("company"),
                "location": profile.get("location"),
                "bio": profile.get("bio"),
                "followers": profile.get("followers"),
                "public_repos": profile.get("public_repos"),
                "starred_at": entry.get("starred_at"),
            })

        page += 1

    return candidates

# Example: source senior Rust candidates from tokio's stargazers
candidates = get_stargazers("tokio-rs", "tokio", "YOUR_TOKEN")
senior = [c for c in candidates if (c["followers"] or 0) > 100]`,
      },
      {
        type: 'h3',
        content: 'Top repos to mine for each engineering role',
      },
      {
        type: 'ul',
        items: [
          'Rust engineers: tokio-rs/tokio, rust-lang/rust-analyzer, dtolnay/cxx',
          'Go engineers: golang/go, uber-go/fx, grafana/grafana',
          'TypeScript/React: microsoft/TypeScript, vercel/next.js, facebook/react',
          'Python ML/AI: huggingface/transformers, pytorch/pytorch, openai/openai-python',
          'DevOps/SRE: kubernetes/kubernetes, hashicorp/terraform, prometheus/prometheus',
          'Distributed systems: apache/kafka, etcd-io/etcd, ceph/ceph',
        ],
      },
      {
        type: 'h2',
        content: 'Method 3: Keyword Signals in GitHub Issues and Discussions',
      },
      {
        type: 'p',
        content:
          'Some developers signal job search intent explicitly in GitHub discussions and issues. Searches for keywords like "open to opportunities", "looking for work", or "available for hire" in GitHub Search surfaces developers actively broadcasting availability. These are rare but extremely high-intent candidates.',
      },
      {
        type: 'code',
        language: 'bash',
        content: `# Search GitHub discussions for job-seeking signals
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/issues?q=%22open+to+opportunities%22+type:discussions&sort=created&order=desc"

# Find developers mentioning availability in commits
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  "https://api.github.com/search/commits?q=%22looking+for+work%22+author-date:>2026-01-01"`,
      },
      {
        type: 'p',
        content:
          'Beyond explicit job signals, pay attention to implicit signals: a developer who files a detailed feature request in a competing company\'s repo is probably using that company\'s product professionally. A developer contributing to open-source infrastructure tooling is likely a strong systems engineer. These contextual signals are invisible without a monitoring layer — which is where tools like GitLeads come in.',
      },
      {
        type: 'h2',
        content: 'Method 4: Real-Time Signal Monitoring with GitLeads',
      },
      {
        type: 'p',
        content:
          'The manual methods above work but do not scale. They require continuous polling, rate limit management, and manual enrichment. GitLeads automates the signal capture layer: you tell it which repos to watch and which keywords to monitor, and it pushes enriched candidate profiles directly into your recruiting stack — Greenhouse, Lever, Slack, or any ATS via webhook — the moment a signal fires.',
      },
      {
        type: 'ul',
        items: [
          'Stargazer monitoring: get notified every time a developer stars a stack-relevant repo',
          'Keyword monitoring: surface developers mentioning job-search or role-related terms in public GitHub content',
          'Enriched profiles: name, email (if public), company, bio, languages, followers, signal context',
          'Auto-push to ATS: webhook payload or native integrations send profiles to your recruiting tools automatically',
          'No manual polling: GitLeads handles GitHub API rate limits, pagination, and enrichment',
        ],
      },
      {
        type: 'h2',
        content: 'Filtering GitHub Candidates to Match Your ICP',
      },
      {
        type: 'p',
        content:
          'Raw GitHub signal volume is high. For a popular repo you might get hundreds of new stargazers per week. You need filters to qualify candidates before they reach your inbox. The most effective filters for engineering recruiting:',
      },
      {
        type: 'ul',
        items: [
          'Followers > 50: a proxy for seniority and community standing in the developer ecosystem',
          'Public repos > 10: indicates active open-source contributor, not just a consumer',
          'Location filter: city, country, or timezone for roles with location requirements',
          'Bio keywords: filter for "senior", "staff", "principal", "CTO", "architect", or specific frameworks',
          'Company not null: developers who list a company are typically employed (good for passive sourcing)',
          'Email not null: saves you from contact research — they have opted into contact',
        ],
      },
      {
        type: 'h2',
        content: 'Writing Outreach That Engineers Actually Respond To',
      },
      {
        type: 'p',
        content:
          'Engineers ignore 95% of recruiter outreach. The 5% that works has two things in common: it is specific, and it references real evidence. If you reach out to a Rust engineer because you saw them star tokio-rs/tokio, say that. If you found them through their contribution to an open-source project your team uses, say that. Specificity signals that you did your homework — the minimum bar for a developer to take a recruiter seriously.',
      },
      {
        type: 'code',
        language: 'text',
        content: `Subject: Rust role at [Company] — saw your work on async-std

Hi Alex,

I noticed you starred tokio-rs/tokio and have been contributing to async Rust
projects. We're building a high-throughput data pipeline in Rust at [Company]
and looking for a senior engineer who actually knows the async runtime deeply.

Your public repos show strong systems thinking — especially [specific repo].

Would a quick call to talk about the role make sense? Happy to share
full technical context first so you can decide if it's worth your time.

[Name]`,
      },
      {
        type: 'h2',
        content: 'Compliance: Is GitHub Recruiting Legal?',
      },
      {
        type: 'p',
        content:
          'Yes, with caveats. GitHub profiles and public activity are public data under GitHub\'s terms of service and accessible via their public API. Developers who list a public email on their profile have effectively opted into contact. However, GDPR (EU), CCPA (California), and other privacy regulations apply to how you store and process this data. Key compliance rules for GitHub recruiting:',
      },
      {
        type: 'ul',
        items: [
          'Only use emails that developers have made publicly visible in their GitHub profile',
          'Do not scrape private repository data or non-public user information',
          'Provide an opt-out mechanism in your outreach (link to unsubscribe or reply to remove)',
          'Store candidate data only as long as necessary and with appropriate access controls',
          'GDPR: if targeting EU residents, you need a lawful basis — legitimate interest typically applies for B2B recruiting',
        ],
      },
      {
        type: 'p',
        content:
          'GitLeads only accesses GitHub\'s public API and public developer data. For a deeper look at compliance considerations, see our GDPR compliance guide for GitHub lead scraping.',
      },
      {
        type: 'h2',
        content: 'Pushing GitHub Candidates Into Your ATS Automatically',
      },
      {
        type: 'p',
        content:
          'The final step is automation. Manually copying GitHub profiles into Greenhouse or Lever is tedious and does not scale. The clean solution is a webhook from your signal monitoring tool that fires a structured JSON payload into your ATS whenever a new candidate matches your criteria.',
      },
      {
        type: 'code',
        language: 'json',
        content: `{
  "candidate": {
    "github_login": "alexchen",
    "name": "Alex Chen",
    "email": "alex@techco.io",
    "company": "TechCo",
    "location": "San Francisco, CA",
    "bio": "Systems engineer. Building distributed infra.",
    "followers": 847,
    "public_repos": 34,
    "top_languages": ["Rust", "Go", "TypeScript"]
  },
  "signal": {
    "type": "stargazer",
    "repo": "tokio-rs/tokio",
    "starred_at": "2026-04-24T08:15:00Z"
  },
  "enrichment_score": 87
}`,
      },
      {
        type: 'p',
        content:
          'GitLeads generates this payload for every signal that fires. Connect it to Greenhouse via their Harvest API, Lever via their Postings API, or any ATS that accepts webhooks. Zapier and n8n templates are available for common ATS integrations with no code required.',
      },
      {
        type: 'callout',
        content:
          'Start recruiting from GitHub signals for free at gitleads.app — 50 candidate profiles per month, no credit card required. Related reading: find leads on GitHub (complete guide), GitHub vs LinkedIn for B2B, push GitHub leads to your CRM.',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
