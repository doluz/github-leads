import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Find Engineers on GitHub for Technical Recruiting | GitLeads',
  description:
    'Source engineering candidates directly from GitHub activity. GitLeads captures signals from developers matching your tech stack and pushes profiles to your ATS, Slack, or recruiting tools automatically.',
  keywords: [
    'github recruiting',
    'find engineers on github',
    'source developers github',
    'technical recruiting github signals',
    'github candidate sourcing',
    'find software engineers github',
    'developer recruiting tool',
    'passive candidate sourcing github',
  ],
  openGraph: {
    title: 'Find Engineers on GitHub for Technical Recruiting | GitLeads',
    description:
      'Source engineering candidates from GitHub signals. Stack-matched profiles pushed automatically to your ATS or recruiting stack.',
    url: 'https://gitleads.app/use-cases/tech-recruiters',
    siteName: 'GitLeads',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Find+Engineers+on+GitHub+for+Recruiting&subtitle=Stack-matched+candidates+pushed+to+your+ATS+automatically&type=use-case',
        width: 1200,
        height: 630,
        alt: 'Find Engineers on GitHub for Technical Recruiting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Engineers on GitHub for Technical Recruiting | GitLeads',
    description: 'Source developers from GitHub signals. Pushed to your recruiting tools automatically.',
    creator: '@gitleads',
  },
  alternates: { canonical: 'https://gitleads.app/use-cases/tech-recruiters' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Find Engineers on GitHub for Technical Recruiting',
  description:
    'How tech recruiters use GitLeads to source engineering candidates from GitHub signals — capturing stack-specific activity and pushing profiles to recruiting tools automatically.',
  url: 'https://gitleads.app/use-cases/tech-recruiters',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gitleads.app' },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://gitleads.app/use-cases' },
      { '@type': 'ListItem', position: 3, name: 'Tech Recruiters', item: 'https://gitleads.app/use-cases/tech-recruiters' },
    ],
  },
};

const BRAND = '#FF5C1F';

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
      <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, width: 100 }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</span>
    </div>
  );
}

export default function TechRecruitersPage() {
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
            For Tech Recruiters
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: 0 }}>
            Find engineers on GitHub<br />before they find you
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginTop: 24, lineHeight: 1.6, maxWidth: 620, margin: '24px auto 0' }}>
            Stop sourcing engineers manually. GitLeads captures GitHub signals from developers matching your exact tech stack and pushes warm candidate profiles directly into your recruiting tools — Greenhouse, Lever, Slack, or any system via webhook.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary">Get 50 free leads →</Link>
            <Link href="/find/rust-developers" className="btn-secondary">See sample profiles</Link>
          </div>
        </section>

        {/* Sample profile card */}
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 20 }}>
            Example enriched candidate profile
          </p>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,92,31,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                ◎
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Alex Chen</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>github.com/alexchen · 847 followers</div>
              </div>
              <div style={{ marginLeft: 'auto', background: 'rgba(255,92,31,0.15)', border: '1px solid rgba(255,92,31,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: BRAND }}>
                Signal: Starred rust-lang/rust-analyzer
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ProfileField label="Email" value="alex@techco.io (public)" />
              <ProfileField label="Company" value="TechCo (Series A)" />
              <ProfileField label="Location" value="San Francisco, CA" />
              <ProfileField label="Top languages" value="Rust, Go, TypeScript" />
              <ProfileField label="Bio" value="Systems engineer. Building distributed infra. Open to roles." />
              <ProfileField label="Public repos" value="34 repos · 2,100+ stars earned" />
            </div>
          </div>
        </section>

        {/* Why GitHub vs LinkedIn */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            Why GitHub beats LinkedIn for engineering hires
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                platform: 'LinkedIn',
                points: [
                  'Self-reported skills — often outdated',
                  'Developers rarely update LinkedIn',
                  'InMail gets ignored by engineers',
                  'No signal of what they actually build',
                  'Job title says "Full Stack" — means nothing',
                ],
                positive: false,
              },
              {
                platform: 'GitHub via GitLeads',
                points: [
                  'Real-time proof of what they actually build',
                  'Developers live on GitHub every day',
                  'Reach them via email with signal context',
                  'Exact stack visible from repo languages',
                  '847 followers and 34 repos says everything',
                ],
                positive: true,
              },
            ].map((item) => (
              <div key={item.platform} style={{ background: '#111', border: `1px solid ${item.positive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: item.positive ? '#22c55e' : '#ef4444', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {item.platform}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {item.points.map((p) => (
                    <li key={p} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 8 }}>
                      <span style={{ color: item.positive ? '#22c55e' : '#ef4444', flexShrink: 0 }}>{item.positive ? '✓' : '✕'}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How to use it */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            Three recruiting workflows with GitLeads
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                title: 'Stack-specific passive sourcing',
                detail: 'Track stars on repos in your required tech stack. A developer who stars a Rust async runtime repo is almost certainly a senior Rust engineer. GitLeads surfaces them with their email, company, follower count, and public repo stats — no manual searching.',
              },
              {
                title: 'Keyword signals for intent',
                detail: 'Monitor GitHub Issues and Discussions for keywords like "open to work", "looking for roles", "considering switching jobs". These developers are actively signaling intent — a rare find. Leads push to your ATS automatically when the keyword fires.',
              },
              {
                title: 'Auto-push to your recruiting stack',
                detail: 'GitLeads pushes matched profiles directly to Greenhouse, Lever, or any ATS via webhook or Zapier integration. Each profile includes the exact GitHub signal that triggered it, so your outreach can reference what you saw and stand out in the inbox.',
              },
            ].map((item, i) => (
              <div key={item.title} style={{ display: 'flex', gap: 20, background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff' }}>
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 10, lineHeight: 1.65 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter options */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 32 }}>
            Filter to match any engineering role
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {[
              'Rust engineers',
              'Go developers',
              'Python ML engineers',
              'React developers',
              'TypeScript engineers',
              'Distributed systems',
              'DevOps / SRE',
              'iOS / Swift',
              'Android / Kotlin',
              'Blockchain / Web3',
              'LLM / AI engineers',
              'Embedded C / C++',
              'Ruby on Rails',
              'Java backend',
              'Database engineers',
            ].map((tag) => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {tag}
              </span>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Filter by language, framework, follower count, location, bio keywords, and more.{' '}
            <Link href="/find/golang-engineers" style={{ color: BRAND, textDecoration: 'none' }}>Browse Go engineers →</Link>
          </p>
        </section>

        {/* Related resources */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Related resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { href: '/blog/how-to-find-leads-on-github', label: 'How to Find Leads on GitHub: The Complete Guide' },
              { href: '/blog/github-leads-vs-linkedin-leads', label: 'GitHub Leads vs LinkedIn Leads: When to Use Which' },
              { href: '/find/rust-developers', label: 'Find Rust Developers on GitHub' },
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
              Start sourcing engineers from GitHub
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.6 }}>
              50 free candidate profiles per month. No credit card required. Connects to Greenhouse, Lever, or any ATS via webhook.
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
