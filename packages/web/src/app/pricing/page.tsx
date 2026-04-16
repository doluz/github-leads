export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      leads: '50 leads/mo',
      campaigns: '1 campaign',
      features: ['Basic GitHub signal detection', 'Email extraction', 'CSV export'],
      cta: null,
      plan: null,
    },
    {
      name: 'Starter',
      price: '$9',
      period: '/mo',
      leads: '500 leads/mo',
      campaigns: '5 campaigns',
      features: ['All Free features', 'Keyword search pipeline', 'Priority support'],
      cta: 'Get Started',
      plan: 'starter',
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/mo',
      leads: '5,000 leads/mo',
      campaigns: 'Unlimited',
      features: ['All Starter features', 'API access', 'Advanced filters', 'Webhook integrations'],
      cta: 'Go Pro',
      plan: 'pro',
      highlight: true,
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/mo',
      leads: '25,000 leads/mo',
      campaigns: 'Unlimited',
      features: ['All Pro features', 'White-label reports', 'Custom integrations', 'Dedicated support'],
      cta: 'Contact Sales',
      plan: 'agency',
    },
  ];

  async function checkout(plan: string) {
    'use server';
    // Server action — call billing API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
      credentials: 'include',
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ textAlign: 'center', fontSize: 36, marginBottom: 8 }}>Simple, transparent pricing</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 48 }}>
        Start free. Upgrade as you grow.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              border: tier.highlight ? '2px solid #2563eb' : '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 28,
              position: 'relative',
              background: tier.highlight ? '#eff6ff' : '#fff',
            }}
          >
            {tier.highlight && (
              <span
                style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '2px 12px',
                  borderRadius: 99,
                }}
              >
                Most Popular
              </span>
            )}

            <h2 style={{ fontSize: 20, margin: '0 0 4px' }}>{tier.name}</h2>
            <div style={{ fontSize: 36, fontWeight: 700 }}>
              {tier.price}
              <span style={{ fontSize: 16, fontWeight: 400, color: '#666' }}>{tier.period}</span>
            </div>

            <div style={{ margin: '12px 0', color: '#444', fontSize: 14 }}>
              <div>{tier.leads}</div>
              <div>{tier.campaigns}</div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', fontSize: 14 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ padding: '4px 0' }}>
                  ✓ {f}
                </li>
              ))}
            </ul>

            {tier.cta && tier.plan ? (
              <a
                href={`/api/billing/checkout?plan=${tier.plan}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 0',
                  background: tier.highlight ? '#2563eb' : '#1f2937',
                  color: '#fff',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {tier.cta}
              </a>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '10px 0',
                  color: '#9ca3af',
                  fontSize: 14,
                }}
              >
                Current plan
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
