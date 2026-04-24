import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Use Cases — GitHub Lead Generation for Every Team | GitLeads',
  description:
    'GitLeads use cases for B2B SaaS founders, DevRel teams, tech recruiters, and growth teams. Capture GitHub buying signals and push to your existing sales or recruiting stack.',
};

const useCases = [
  {
    audience: 'SaaS Founders',
    href: '/use-cases/b2b-saas-founders',
    title: 'Find your first 100 paying customers from GitHub',
    description:
      'Most developer tools start with GitHub. Your future customers are already there — starring repos like yours, filing issues in competitor projects, and looking for better solutions. GitLeads helps you find them before they find someone else.',
    scenarios: [
      {
        title: 'Pre-launch validation',
        body: "Before you build, validate demand. Find developers who've starred similar tools, opened issues about the problem you're solving, and would be ideal beta testers.",
      },
      {
        title: 'Signals push directly to your stack',
        body: "When someone stars your repo, GitLeads captures them and pushes the lead straight into Smartlead, Instantly, HubSpot, or Slack. Turn passive GitHub interest into active pipeline without leaving your existing tools.",
      },
      {
        title: 'Competitor displacement',
        body: "Identify developers filing bug reports or feature requests in competing repos. They're frustrated — reach out with a better offer at exactly the right moment.",
      },
    ],
    cta: 'Start finding customers',
  },
  {
    audience: 'DevRel Teams',
    href: '/use-cases/devrel-teams',
    title: 'Grow your developer community with precision targeting',
    description:
      "Community growth isn't about volume — it's about finding the right developers who'll become advocates, contributors, and champions. GitLeads gives you signal-based targeting instead of spray-and-pray outreach.",
    scenarios: [
      {
        title: 'Contributor recruitment',
        body: "Find developers who've contributed to similar open-source projects, understand your tech stack, and would be valuable first-time contributors.",
      },
      {
        title: 'Advocate identification',
        body: 'Surface developers who consistently engage with your content, share your tools, and have large follower networks — perfect for ambassador programs.',
      },
      {
        title: 'Event and meetup targeting',
        body: 'Build invite lists for virtual events, hackathons, and community sprints from developers who actively engage with your niche on GitHub.',
      },
    ],
    cta: 'Grow your community',
  },
  {
    audience: 'Tech Recruiters',
    href: '/use-cases/tech-recruiters',
    title: 'Find engineering talent with GitHub signals, pushed to your recruiting tools',
    description:
      'Stop sourcing engineers manually. GitLeads captures GitHub signals from developers with the exact stack you need and pushes warm candidates directly into your recruiting stack — Greenhouse, Lever, or any tool via webhook.',
    scenarios: [
      {
        title: 'Stack-matched candidate sourcing',
        body: 'Filter candidates by language, framework, repo activity, and contribution history. Find developers actively working in the exact stack your role requires.',
      },
      {
        title: 'Auto-push to your ATS',
        body: 'GitLeads pushes matched developer profiles directly to your recruiting tools via webhook or Zapier. No copy-paste. Candidates arrive in your pipeline automatically.',
      },
      {
        title: 'Passive candidate identification',
        body: 'Identify actively coding developers who are not on LinkedIn. Reach engineers where they actually spend time — through GitHub signals, not job boards.',
      },
    ],
    cta: 'Start sourcing engineers',
  },
  {
    audience: 'Growth Teams',
    href: '/use-cases/growth-teams',
    title: 'Add GitHub intent data to your developer acquisition pipeline',
    description:
      'GitHub is your highest-intent acquisition channel and it has no ad unit, no analytics, and no native targeting. GitLeads gives growth teams a real-time signal layer on top of GitHub, turning public developer activity into structured, automated acquisition.',
    scenarios: [
      {
        title: 'TOFU to BOFU signal mapping',
        body: 'Every GitHub signal maps to a funnel stage — from broad category awareness (stars on adjacent repos) to high-intent buying signals (competitor migration keywords in issues).',
      },
      {
        title: 'PLG free-trial triggers',
        body: 'When a developer stars your repo but has not signed up, push a trial invite via Smartlead or Instantly automatically. First-touch personalization at scale.',
      },
      {
        title: 'Intent-based sales routing',
        body: "High-intent signals — pricing keyword mentions, competitor migration issues — push to HubSpot or Salesforce instantly. Reps contact prospects the same day with full signal context in hand.",
      },
    ],
    cta: 'Fuel your growth pipeline',
  },
];

export default function UseCasesPage() {
  return (
    <>
      <header className="border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2L17.3 6V14L10 18L2.7 14V6L10 2Z" stroke="#FF5C1F" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 6L13.5 8V12L10 14L6.5 12V8L10 6Z" fill="#FF5C1F" opacity="0.6" />
            </svg>
            GitLeads
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Start free →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#FF7A47' }}>Use Cases</p>
          <h1 className="section-heading mt-3">Capture GitHub signals. Push to your existing stack.</h1>
          <p className="section-subheading">
            GitLeads captures developer buying signals and pushes them directly into the tools you already use.
            No new outreach tool. No lock-in. Just leads arriving in your stack.
          </p>
        </div>

        {/* Use cases */}
        <div className="space-y-20">
          {useCases.map((uc, i) => (
            <section key={uc.audience} className={`grid gap-10 md:grid-cols-2 items-start ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-brand">{uc.audience}</span>
                </div>
                <h2 className="text-2xl font-bold text-white leading-snug">{uc.title}</h2>
                <p className="mt-4 text-sm text-white/50 leading-relaxed">{uc.description}</p>
                <div className="mt-6 flex items-center gap-3 flex-wrap">
                  <Link href="/signup" className="btn-primary">
                    {uc.cta} →
                  </Link>
                  <Link href={uc.href} className="btn-secondary text-sm">
                    Learn more
                  </Link>
                </div>
              </div>

              {/* Scenarios */}
              <div className="space-y-4">
                {uc.scenarios.map((s) => (
                  <div key={s.title} className="card-dark p-5">
                    <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/45 leading-relaxed">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center rounded-2xl border p-10" style={{ borderColor: 'rgba(255,92,31,0.2)', background: 'rgba(255,92,31,0.05)' }}>
          <h2 className="text-2xl font-bold text-white">Start with your use case</h2>
          <p className="mt-3 text-white/50 text-sm">50 free leads to get you started. No credit card required.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary">Get started free →</Link>
            <Link href="/pricing" className="btn-secondary">See pricing</Link>
          </div>
        </div>
      </main>
    </>
  );
}
