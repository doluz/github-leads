import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GitHub Intent Data for Growth Teams | GitLeads',
  description:
    'Growth teams use GitLeads to capture GitHub intent signals and build developer pipelines that convert. Monitor competitor repos, keyword mentions, and star activity to fuel top-of-funnel with high-intent developer leads.',
  keywords: [
    'github intent data growth teams',
    'developer growth hacking github',
    'github pipeline for growth',
    'github lead generation growth',
    'developer acquisition github signals',
    'growth hacking developer tools',
    'github top of funnel leads',
  ],
  openGraph: {
    title: 'GitHub Intent Data for Growth Teams | GitLeads',
    description:
      'Capture GitHub intent signals to fuel developer acquisition. GitLeads gives growth teams a real-time signal layer on top of GitHub.',
    url: 'https://gitleads.app/use-cases/growth-teams',
    siteName: 'GitLeads',
    type: 'website',
    images: [
      {
        url: '/api/og?title=GitHub+Intent+Data+for+Growth+Teams&subtitle=Fuel+developer+acquisition+with+real-time+GitHub+signals&type=use-case',
        width: 1200,
        height: 630,
        alt: 'GitHub Intent Data for Growth Teams',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Intent Data for Growth Teams | GitLeads',
    description: 'Real-time GitHub intent signals to fuel developer acquisition pipelines.',
    creator: '@gitleads',
  },
  alternates: { canonical: 'https://gitleads.app/use-cases/growth-teams' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'GitHub Intent Data for Growth Teams',
  description:
    'How growth teams use GitLeads to capture GitHub intent signals and build high-converting developer acquisition pipelines.',
  url: 'https://gitleads.app/use-cases/growth-teams',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gitleads.app' },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://gitleads.app/use-cases' },
      { '@type': 'ListItem', position: 3, name: 'Growth Teams', item: 'https://gitleads.app/use-cases/growth-teams' },
    ],
  },
};

const BRAND = '#FF5C1F';

function FunnelStage({ stage, label, description, signals }: { stage: string; label: string; description: string; signals: string[] }) {
  return (
    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'rgba(255,92,31,0.12)', border: '1px solid rgba(255,92,31,0.25)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: BRAND }}>
          {stage}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{label}</h3>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 16 }}>{description}</p>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>GitHub signals</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {signals.map((s) => (
            <li key={s} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 8 }}>
              <span style={{ color: BRAND, flexShrink: 0 }}>•</span> {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function GrowthTeamsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L17.3 6V14L10 18L2.7 14V6L10 2Z" stroke={BRAND} strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 6L13.5 8V12L10 14L6.5 12V8L10 6Z" fill={BRAND} opacity="0.6" />
            </svg>
            GitLeads
          </Link>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 14 }}>
            Start free →
          </Link>
        </div>
      </header>

      <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        {/* Hero */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND, marginBottom: 16 }}>
            For Growth Teams
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: 0 }}>
            GitHub intent data<br />for developer acquisition
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginTop: 24, lineHeight: 1.6, maxWidth: 620, margin: '24px auto 0' }}>
            GitHub is the highest-intent channel in developer marketing — and it has no ad unit, no targeting UI, and no native analytics. GitLeads gives growth teams a real-time signal layer on top of GitHub, turning public activity into a structured, automated acquisition pipeline.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary">Get 50 free leads →</Link>
            <Link href="/blog/github-intent-data-for-b2b-sales" className="btn-secondary">Read intent data guide</Link>
          </div>
        </section>

        {/* The growth problem */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 20 }}>
            GitHub is your best channel. You just can&apos;t see it.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, textAlign: 'center', maxWidth: 600, margin: '0 auto 40px' }}>
            Developers do not click banner ads. They do not respond to LinkedIn spam. But they do star repos, open issues, and discuss tools openly on GitHub every day. That activity is your highest-signal acquisition channel — and it has been invisible until now.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { stat: '100M+', label: 'Developers on GitHub' },
              { stat: '~6hr', label: 'Signal detection latency' },
              { stat: '15+', label: 'Destination integrations' },
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(255,92,31,0.07)', border: '1px solid rgba(255,92,31,0.2)', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: BRAND }}>{item.stat}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Funnel stages */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            GitHub signals map to every funnel stage
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <FunnelStage
              stage="TOFU"
              label="Awareness signals"
              description="Find developers discovering your category. High volume, needs further qualification — but shows your TAM in real-time."
              signals={[
                'Stars on a broad category repo (e.g. open-source CRM)',
                'Issues mentioning a problem keyword',
                'First-time contributors to related projects',
              ]}
            />
            <FunnelStage
              stage="MOFU"
              label="Consideration signals"
              description="Developers actively evaluating tools. They have identified the problem and are researching solutions — this is warm intent."
              signals={[
                'Stars on competitor repos',
                'Issues titled "alternatives to X"',
                'Fork + star combination (actively testing)',
              ]}
            />
            <FunnelStage
              stage="BOFU"
              label="Decision signals"
              description="Developers ready to commit. High-intent signals that indicate purchase readiness or active migration planning."
              signals={[
                'Issues in competitor repos: "migration", "moving away from"',
                'Keywords: "pricing", "enterprise plan", "API limits hit"',
                'Multiple signals from same developer within 7 days',
              ]}
            />
            <FunnelStage
              stage="EXPANSION"
              label="Expansion signals"
              description="Signals from existing customer accounts indicating growth opportunities or churn risk."
              signals={[
                'Team members from customer company starring competitor repos',
                'Customer employees exploring alternatives in issues',
                'Keywords from known customer domains in discussions',
              ]}
            />
          </div>
        </section>

        {/* PLG workflows */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            Plug into your PLG or sales-led motion
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                label: 'PLG: Trigger free trial nudges',
                body: 'When GitLeads detects a developer who starred your repo and has not signed up yet, push to a Slack alert or Smartlead sequence with a free trial invite. First-touch personalization at scale.',
              },
              {
                label: 'Sales-led: Route intent signals to reps',
                body: 'High-intent signals (competitor migration mentions, pricing keyword hits) push to HubSpot or Salesforce immediately with the signal context. Reps contact them same day with relevant context already in hand.',
              },
              {
                label: 'Content: Build SEO from your own signal data',
                body: 'Aggregate your GitLeads signal data to identify trending topics in your category. Which repos are getting starred? What keywords appear in Issues? That is your content calendar.',
              },
            ].map((item) => (
              <div key={item.label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>{item.label}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Works with your stack */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Works with your growth stack</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
            GitLeads is a signal source, not an outreach tool. Leads push into the tools your team already uses.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['HubSpot', 'Salesforce', 'Slack', 'Smartlead', 'Instantly', 'Apollo', 'Clay', 'Zapier', 'n8n', 'Make', 'Webhooks', 'CSV Export'].map((tool) => (
              <span key={tool} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {tool}
              </span>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            <Link href="/integrations" style={{ color: BRAND, textDecoration: 'none' }}>See all integrations →</Link>
          </p>
        </section>

        {/* Related resources */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Related resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { href: '/blog/github-intent-data-for-b2b-sales', label: 'GitHub Intent Data for B2B Sales' },
              { href: '/blog/github-keyword-monitoring-for-sales', label: 'GitHub Keyword Monitoring for Sales Teams' },
              { href: '/blog/turn-github-stargazers-into-leads', label: 'How to Turn GitHub Stargazers into Leads' },
              { href: '/use-cases', label: 'All use cases →' },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ color: BRAND, textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ opacity: 0.5 }}>→</span> {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,92,31,0.07)', border: '1px solid rgba(255,92,31,0.2)', borderRadius: 20, padding: '56px 32px' }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0 }}>
              Add GitHub intent signals to your growth stack
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.6 }}>
              50 free leads per month. No credit card required. Works with your existing acquisition tools.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn-primary">Get started free →</Link>
              <Link href="/pricing" className="btn-secondary">View pricing</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
