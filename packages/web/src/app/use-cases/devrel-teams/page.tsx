import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DevRel Lead Generation with GitHub Signals | GitLeads',
  description:
    'DevRel teams use GitLeads to find contributors, advocates, and community members from GitHub activity. Monitor stars, keyword mentions, and engagement signals to grow your developer community with precision.',
  keywords: [
    'devrel lead generation',
    'github community growth',
    'developer relations github signals',
    'find developers github devrel',
    'developer advocate recruitment',
    'github contributor sourcing',
    'devrel tools',
  ],
  openGraph: {
    title: 'DevRel Lead Generation with GitHub Signals | GitLeads',
    description:
      'Find contributors, advocates, and community members from GitHub signals. GitLeads helps DevRel teams grow developer communities with precision targeting.',
    url: 'https://gitleads.app/use-cases/devrel-teams',
    siteName: 'GitLeads',
    type: 'website',
    images: [
      {
        url: '/api/og?title=DevRel+Lead+Generation+with+GitHub+Signals&subtitle=Grow+your+developer+community+with+precision+targeting&type=use-case',
        width: 1200,
        height: 630,
        alt: 'DevRel Lead Generation with GitHub Signals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevRel Lead Generation with GitHub Signals | GitLeads',
    description: 'Find contributors and advocates from GitHub signals. Push to Slack, HubSpot, or any tool.',
    creator: '@gitleads',
  },
  alternates: { canonical: 'https://gitleads.app/use-cases/devrel-teams' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'DevRel Lead Generation with GitHub Signals',
  description:
    'How DevRel teams use GitLeads to find contributors, advocates, and community members from GitHub activity signals.',
  url: 'https://gitleads.app/use-cases/devrel-teams',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gitleads.app' },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://gitleads.app/use-cases' },
      { '@type': 'ListItem', position: 3, name: 'DevRel Teams', item: 'https://gitleads.app/use-cases/devrel-teams' },
    ],
  },
};

const BRAND = '#FF5C1F';

function TargetCard({ title, signals, outcome }: { title: string; signals: string[]; outcome: string }) {
  return (
    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>{title}</h3>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>GitHub signals to watch</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {signals.map((s) => (
            <li key={s} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: BRAND, flexShrink: 0 }}>•</span> {s}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Outcome</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{outcome}</p>
      </div>
    </div>
  );
}

export default function DevRelTeamsPage() {
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
            For DevRel Teams
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: 0 }}>
            DevRel lead generation<br />from GitHub signals
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', marginTop: 24, lineHeight: 1.6, maxWidth: 620, margin: '24px auto 0' }}>
            Community growth is not about volume — it is about finding the right developers. GitLeads monitors GitHub for stars, keyword mentions, and engagement signals, then pushes warm developer profiles into the tools your DevRel team already uses.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary">Get 50 free leads →</Link>
            <Link href="/blog/devrel-community-growth" className="btn-secondary">Read DevRel guide</Link>
          </div>
        </section>

        {/* The DevRel challenge */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 0 }}>The DevRel targeting problem</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24 }}>
              Spray-and-pray DevRel does not work. Sending cold invites to 10,000 developers produces noise, not community. The developers who will actually contribute, advocate, and stick around are the ones already engaging with your niche on GitHub — you just cannot see them without a signal layer.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#EF4444', marginBottom: 10 }}>Without GitLeads</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Manual GitHub searches with no signal context',
                    'Cold outreach to developers with no intent',
                    'Guessing who might become an advocate',
                    'No automated pipeline from GitHub to your tools',
                  ].map((item) => (
                    <li key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#EF4444', flexShrink: 0 }}>✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#22c55e', marginBottom: 10 }}>With GitLeads</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    'Real-time signals from developers engaging with your niche',
                    'Warm outreach with signal context ("I saw you starred...")',
                    'Identify advocates before they know they are advocates',
                    'Leads auto-pushed to Slack, HubSpot, or CRM instantly',
                  ].map((item) => (
                    <li key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* DevRel use cases */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 40 }}>
            Four ways DevRel teams use GitLeads
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <TargetCard
              title="Contributor recruitment"
              signals={[
                'Stars on repos in your technical ecosystem',
                'PRs or issues in adjacent open-source projects',
                'Keyword: "looking for projects to contribute to"',
              ]}
              outcome="Find developers already working in your stack who are primed to contribute to your open-source project."
            />
            <TargetCard
              title="Advocate identification"
              signals={[
                'High-follower developers starring your repo',
                'Developers who fork AND star (active evaluators)',
                'Keyword mentions of your brand in discussions',
              ]}
              outcome="Surface developers with reach who are already engaging with your product — perfect for ambassador programs."
            />
            <TargetCard
              title="Event and meetup targeting"
              signals={[
                'Stars from developers in a specific city or region',
                'Keyword: conference names, local meetup terms',
                'Recent activity in your repo discussions',
              ]}
              outcome="Build invite lists for virtual events, hackathons, and community sprints from developers actively engaged in your niche."
            />
            <TargetCard
              title="Beta program recruitment"
              signals={[
                'Developers filing feature requests or issues in your repo',
                'Stars on repos of tools you are about to compete with',
                'Keyword: "beta", "early access", "feedback"',
              ]}
              outcome="Find the developers most likely to provide high-quality product feedback and champion your new features."
            />
          </div>
        </section>

        {/* Signal flow */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 16 }}>
            Signals land where your team works
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: 40 }}>
            GitLeads does not replace your tools. It feeds signal-qualified leads into them.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                tool: 'Slack',
                desc: 'Get a Slack alert the moment a high-follower developer stars your repo. Include their bio, company, and top languages in the message.',
              },
              {
                tool: 'HubSpot',
                desc: 'Enriched developer profiles land in HubSpot contacts with GitHub signal as a custom property. Tag for nurture sequences automatically.',
              },
              {
                tool: 'Webhooks / n8n / Zapier',
                desc: 'Full JSON payload for every signal — build any custom workflow. Route different signal types to different Notion databases, Airtable, or your own CRM.',
              },
            ].map((item) => (
              <div key={item.tool} style={{ display: 'flex', gap: 20, background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, background: 'rgba(255,92,31,0.12)', border: '1px solid rgba(255,92,31,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: BRAND }}>
                  {item.tool}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
            <Link href="/integrations" style={{ color: BRAND, textDecoration: 'none' }}>See all 15+ integrations →</Link>
          </p>
        </section>

        {/* Related resources */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Related resources</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { href: '/blog/devrel-community-growth', label: 'DevRel Community Growth with GitHub Signals' },
              { href: '/blog/github-buying-signals-sales-teams', label: 'GitHub Buying Signals Every Team Should Track' },
              { href: '/blog/how-to-find-leads-on-github', label: 'How to Find Leads on GitHub: The Complete Guide' },
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
              Grow your developer community with signal
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.6 }}>
              50 free leads per month. No credit card required. Works with the tools you already use.
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
