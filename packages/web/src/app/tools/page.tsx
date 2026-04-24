import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free GitHub Developer Tools — GitLeads',
  description:
    'Free tools for GitHub lead generation, developer analysis, and signal monitoring. Analyze GitHub profiles, find developer leads, and understand GitHub activity patterns.',
  keywords: [
    'free github tools',
    'github developer tools',
    'github profile analyzer',
    'github lead generation tools',
    'free github lead finder',
    'github stats tool',
  ],
  openGraph: {
    title: 'Free GitHub Developer Tools — GitLeads',
    description: 'Free tools for GitHub lead generation and developer analysis. No signup required.',
    url: 'https://gitleads.app/tools',
    siteName: 'GitLeads',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free GitHub Developer Tools — GitLeads',
    description: 'Free tools for GitHub lead generation and developer analysis.',
    creator: '@gitleads',
  },
  alternates: { canonical: 'https://gitleads.app/tools' },
};

const GITLEADS_PURPLE = '#7C3AED';
const DARK_BG = '#0A0A0A';

const TOOLS = [
  {
    slug: 'profile-analyzer',
    name: 'GitHub Profile Analyzer',
    description:
      'Analyze any GitHub profile instantly. Get contribution heatmap, top languages, activity score, top repositories, and similar developer suggestions. No signup required.',
    useCases: ['Research a lead before outreach', 'Evaluate a developer candidate', 'Understand a prospect\'s tech stack'],
    badge: 'Free',
    badgeColor: '#10b981',
  },
];

const COMING_SOON = [
  {
    name: 'GitHub Repo Star Counter',
    description: 'Track stargazer growth for any public GitHub repo. See daily, weekly, and monthly star velocity.',
    useCases: ['Monitor competitor repo traction', 'Track your own repo growth', 'Identify trending repos in your category'],
  },
  {
    name: 'GitHub Keyword Signal Tester',
    description: 'Test a keyword against live GitHub Issues and PRs to see how many relevant mentions exist before setting up automated monitoring.',
    useCases: ['Validate a keyword before tracking', 'Estimate signal volume', 'Find the best keyword variants'],
  },
  {
    name: 'Developer ICP Scorer',
    description: 'Paste a GitHub username and get an ICP match score based on languages, follower count, activity, and repo types.',
    useCases: ['Qualify a GitHub lead before outreach', 'Score a developer prospect', 'Filter low-quality leads'],
  },
];

export default function ToolsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free GitHub Developer Tools by GitLeads',
    url: 'https://gitleads.app/tools',
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: `https://gitleads.app/tools/${t.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <nav
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L17.3 6V14L10 18L2.7 14V6L10 2Z" stroke={GITLEADS_PURPLE} strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 6L13.5 8V12L10 14L6.5 12V8L10 6Z" fill={GITLEADS_PURPLE} opacity="0.6" />
            </svg>
            GitLeads
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textDecoration: 'none' }}>Blog</Link>
            <Link href="/pricing" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, textDecoration: 'none' }}>Pricing</Link>
            <Link
              href="/signup"
              style={{
                background: `linear-gradient(135deg, ${GITLEADS_PURPLE} 0%, #8B5CF6 100%)`,
                color: '#fff',
                padding: '8px 18px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Start free →
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ background: DARK_BG, color: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {/* HERO */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#a78bfa',
              marginBottom: 20,
            }}
          >
            Free Tools
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 16,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Free GitHub Developer Tools
          </h1>
          <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 580, margin: '0 auto 16px', lineHeight: 1.65 }}>
            Tools for analyzing GitHub profiles, tracking developer signals, and building better developer lead pipelines. No signup required.
          </p>
        </section>

        {/* LIVE TOOLS */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#10b981',
              marginBottom: 24,
            }}
          >
            Live now
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {TOOLS.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: 28,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{tool.name}</h3>
                    <span
                      style={{
                        flexShrink: 0,
                        background: 'rgba(16,185,129,0.12)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        color: tool.badgeColor,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: 6,
                      }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{tool.description}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tool.useCases.map((uc, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                          <circle cx="7" cy="7" r="7" fill={GITLEADS_PURPLE} opacity="0.2" />
                          <path d="M4 7l2 2 4-4" stroke={GITLEADS_PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.5 }}>{uc}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', color: GITLEADS_PURPLE, fontSize: 13, fontWeight: 600 }}>
                    Open tool →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* COMING SOON */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: 24,
            }}
          >
            Coming soon
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {COMING_SOON.map((tool, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 16,
                  padding: 24,
                  opacity: 0.65,
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#9ca3af', marginBottom: 8 }}>{tool.name}</h3>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{tool.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '64px 24px 80px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Want automated GitHub lead generation?
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
            These free tools are great for one-off analysis. GitLeads monitors GitHub 24/7 and pushes enriched leads into your CRM or Slack automatically.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/signup"
              style={{
                background: `linear-gradient(135deg, ${GITLEADS_PURPLE} 0%, #8B5CF6 100%)`,
                color: '#fff',
                padding: '14px 32px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(124,58,237,0.35)',
              }}
            >
              Start free — 50 leads/month →
            </Link>
            <Link
              href="/pricing"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#d1d5db',
                padding: '14px 32px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View pricing
            </Link>
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/blog/how-to-find-leads-on-github" style={{ color: '#7c3aed', fontSize: 14, textDecoration: 'none' }}>GitHub lead generation guide →</Link>
            <Link href="/integrations" style={{ color: '#7c3aed', fontSize: 14, textDecoration: 'none' }}>All integrations →</Link>
            <Link href="/blog/free-github-lead-generation-tools" style={{ color: '#7c3aed', fontSize: 14, textDecoration: 'none' }}>Free methods comparison →</Link>
          </div>
        </section>
      </main>
    </>
  );
}
