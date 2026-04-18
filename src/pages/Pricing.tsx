import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'For creators just getting started with NIL protection.',
    features: ['10 detections per month', '2 platform scans', '1 license template', 'Basic earnings tracking', 'Community support'],
    cta: 'Start free',
    highlighted: false
  },
  {
    name: 'Creator',
    price: '$29',
    period: '/month',
    desc: 'For active creators who need real protection and monetization.',
    features: ['500 detections per month', '15 platform scans', 'Unlimited license templates', 'Full earnings dashboard', 'One-tap takedowns', 'Brand-quality matching', 'Email support'],
    cta: 'Start Creator',
    highlighted: true
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    desc: 'For professional athletes and high-value creators at scale.',
    features: ['Unlimited detections', 'All platforms', 'Priority DMCA filing (4hr SLA)', 'Revenue attribution reports', 'Dispute resolution concierge', 'API access', 'Dedicated account manager'],
    cta: 'Start Pro',
    highlighted: false
  }
]

const FAQS = [
  { q: 'How does detection work?', a: 'WEIR uses perceptual hashing and AI image/text matching to scan 50+ platforms for unauthorized uses of your name, image, and likeness. New matches trigger real-time alerts.' },
  { q: 'How fast are takedowns processed?', a: 'One-tap DMCA filing submits your request within seconds. Most platforms resolve within 24-48 hours — compared to the industry average of 7 days.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no cancellation fees. You can downgrade to Free or cancel from your Settings page at any time. Billing is disclosed clearly at checkout.' },
  { q: 'What is the brand-quality matching?', a: 'Instead of matching by follower count, WEIR analyzes audience demographics, engagement quality, and content alignment to surface brand partnerships that convert — not just look impressive.' }
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">No hidden fees. No confusing tiers. Upgrade or cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map(plan => (
            <Card
              key={plan.name}
              className={plan.highlighted ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-40 relative' : ''}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[var(--color-text)]">{plan.price}</span>
                  <span className="text-[var(--color-text-secondary)]">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-text)]">
                      <CheckCircle size={16} className="text-[var(--color-success)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full transition-smooth ${plan.highlighted ? 'bg-[var(--color-primary)] text-white hover:opacity-90' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="border-b border-[var(--color-border)] pb-6">
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{q}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
