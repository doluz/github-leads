import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GitHub Lead Generation for B2B SaaS Founders | GitLeads',
  description:
    'Find your first 100 developer customers on GitHub. GitLeads captures buying signals — repo stars, keyword mentions, competitor activity — and pushes leads into your sales stack automatically.',
  keywords: [
    'github lead generation for saas founders',
    'find developer customers on github',
    'b2b saas github leads',
    'developer lead generation tool',
    'github signals for startups',
    'find early customers github',
  ],
  openGraph: {
    title: 'GitHub Lead Generation for B2B SaaS Founders | GitLeads',
    description:
      'Your first 100 developer customers are on GitHub right now. GitLeads captures their buying signals and pushes them into your sales tools automatically.',
    url: 'https://gitleads.app/use-cases/b2b-saas-founders',
    siteName: 'GitLeads',
    type: 'website',
    images: [
      {
        url: '/api/og?title=GitHub+Lead+Generation+for+B2B+SaaS+Founders&subtitle=Capture+buying+signals+and+push+to+your+sales+stack&type=use-case',
        width: 1200,
        height: 630,
        alt: 'GitHub Lead Generation for B2B SaaS Founders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Lead Generation for B2B SaaS Founders | GitLeads',
    description: 'Find developer customers on GitHub. Buying signals pushed to HubSpot, Slack, Smartlead, and 10+ more.',
    creator: '@gitleads',
  },
  alternates: { canonical: 'https://gitleads.app/use-cases/b2b-saas-founders' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'GitHub Lead Generation for B2B SaaS Founders',
  description:
    'How B2B SaaS founders use GitLeads to find developer leads on GitHub — capturing repo stars, keyword signals, and competitor activity.',
  url: 'https://gitleads.app/use-cases/b2b-saas-founders',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gitleads.app' },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://gitleads.app/use-cases' },
      { '@type': 'ListItem', position: 3, name: 'B2B SaaS Founders', item: 'https://gitleads.app/use-cases/b2b-saas-founders' },
    ],
  },
};

const BRAND = '#FF5C1F';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ background: 'rgba(255,92,31,0.07)', border: '1px solid rgba(255,92,31,0.2)', borderRadius: 12, padding: '20px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: BRAND }}>{value}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff' }}>{n}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8, lineHeight: 1.65 }}>{body}</p>
      </div>
    </div>
  );
}

function SignalCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}

export default function B2BSaaSFoundersPage() {
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
            For B2B SaaS Founders
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: 0 }}>
            GitHub lead generation<br />for B2B SaaS founders
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginTop: 24, lineHeight: 1.6, maxWidth: 600, margin: '24px auto 0' }}>
            Your ideal customers are on GitHub right now — starring repos like yours, filing issues in competitor projects, searching for the exact problem you solve. GitLeads captures those signals and pushes leads into your sales stack before they find someone else.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary">Get 50 free leads →</Link>
            <Link href="/integrations" className="btn-secondary">See integrations</Link>
          </div>
        </section>

        {/* Stats */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <StatCard value="100M+" label="Developers on GitHub" />
            <StatCard value="50" label="Free leads to start" />
            <StatCard value="15+" label="Integrations in your existing stack" />
          </div>
        </section>

        {/* The problem */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 20 }}>
            You&apos;re missing 90% of developer intent
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, textAlign: 'center', marginBottom: 32 }}>
            When a developer stars your competitor&apos;s repo, opens a GitHub Issue titled &ldquo;looking for alternatives to X,&rdquo; or mentions your category keyword in a pull request comment — that is a real-time buying signal. Most founders never see it.
          </p>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              What you&apos;re missing without GitLeads
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Developers who starred competing repos in the last 24 hours',
                'GitHub Issues mentioning your category keywords',
                'Engineers asking "is there a tool that does X?" in public discussions',
                'Developers who forked a competitor repo (testing alternatives)',
                'Commit messages referencing the pain point your product solves',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#EF4444', flexShrink: 0, marginTop: 2 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Signals */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            Two types of GitHub buying signals
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            <SignalCard
              icon="★"
              title="Stargazer signals"
              body="Every new star on your repo — or a competitor's repo — is a warm lead. GitLeads captures them in real time with full profile enrichment: name, email (if public), company, tech stack, location, and follower count."
            />
            <SignalCard
              icon="◎"
              title="Keyword signals"
              body="Track keywords in GitHub Issues, PRs, Discussions, code, and commit messages. When someone mentions your category, competitor, or pain-point keyword, GitLeads surfaces the lead automatically."
            />
          </div>
        </section>

        {/* How it works */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 48 }}>
            Set up in 10 minutes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            <Step
              n={1}
              title="Tell GitLeads what to watch"
              body="Add competitor repo URLs and keywords that describe your category. Examples: repos like 'supabase/supabase' or 'vercel/next.js', keywords like 'looking for a firebase alternative' or 'self-hosted database'."
            />
            <Step
              n={2}
              title="GitLeads monitors GitHub 24/7"
              body="Our scanners watch for new stars, keyword mentions in issues/PRs/discussions, and code comments matching your targets. New signals surface within 6 hours."
            />
            <Step
              n={3}
              title="Enriched leads arrive in your stack"
              body="Every lead is enriched — GitHub username, email, bio, company, top languages, follower count, and the exact signal context that triggered the alert. Pushed directly into HubSpot, Slack, Smartlead, Instantly, Apollo, or any tool via webhook."
            />
          </div>
        </section>

        {/* Use case scenarios */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            How founders use GitLeads
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              {
                title: 'Pre-launch validation',
                body: "Track who's starring similar tools before you launch. Build a waitlist from developers already interested in your category — before writing a single line of copy.",
              },
              {
                title: 'Competitor displacement',
                body: "Find developers filing bug reports or feature requests in competing repos. They're frustrated and looking for alternatives — reach out at exactly the right moment.",
              },
              {
                title: 'ICP-matched outbound',
                body: 'Filter GitHub leads by language, company size, follower count, and bio keywords to match your ICP. Only reach out to developers who actually fit.',
              },
            ].map((item) => (
              <div key={item.title} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 10, lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Integration logos */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
            Leads push directly into
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['HubSpot', 'Slack', 'Smartlead', 'Instantly', 'Apollo', 'Clay', 'Pipedrive', 'Salesforce', 'Zapier', 'n8n', 'Make', 'Webhooks'].map((tool) => (
              <span key={tool} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {tool}
              </span>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            We do not send emails. We find the leads. Your existing stack handles outreach.{' '}
            <Link href="/integrations" style={{ color: BRAND, textDecoration: 'none' }}>See all integrations →</Link>
          </p>
        </section>

        {/* Internal links / related content */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Related resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { href: '/blog/how-to-find-leads-on-github', label: 'How to Find Leads on GitHub: The Complete Guide' },
              { href: '/blog/github-buying-signals-sales-teams', label: 'The 7 GitHub Buying Signals Every Sales Team Should Track' },
              { href: '/blog/competitor-repo-stargazers-as-leads', label: 'How to Turn Competitor Repo Stargazers into Leads' },
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
              Start finding customers on GitHub
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.6 }}>
              50 free leads per month. No credit card required. Connects to your existing stack in minutes.
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
