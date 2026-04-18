```typescript
import { useNavigate } from 'react-router-dom'
import { Shield, Zap, DollarSign, FileText, TrendingUp, AlertTriangle } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const FEATURES = [
  { icon: Shield, title: 'Real-Time Detection', desc: 'Scan 50+ platforms continuously. Get alerted within minutes when your identity is used without permission.' },
  { icon: Zap, title: 'One-Tap Actions', desc: 'File a DMCA takedown, send a licensing offer, or approve a use — all from a single tap. No lawyers needed.' },
  { icon: DollarSign, title: 'Earnings Dashboard', desc: 'See exactly how much you earn per platform. Revenue attribution so you know what works.' },
  { icon: FileText, title: 'License Templates', desc: 'Set your rates, define allowed uses, and auto-issue licenses. Your terms, enforced automatically.' },
  { icon: TrendingUp, title: 'Brand-Quality Matching', desc: 'Get partnership offers ranked by audience alignment — not just follower count. Better fits, better results.' },
  { icon: AlertTriangle, title: 'Dispute Resolution', desc: 'Built-in dispute workflow with timeline, evidence collection, and resolution tracking.' }
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1657412235086-c2de1a1176a9?ixid=M3w5MTM0MDN8MHwxfHNlYXJjaHwxfHxBJTIwY29uZmlkZW50JTIwY3JlYXRvciUyMGluJTIwbW9kZXJuJTIwc3R1ZGlvJTIwbGlnaHRpbmclMkMlMjBzdXJyb3VuZGVkJTIwYnl8ZW58MHwwfHx8MTc3NjQ5OTg5NXww&ixlib=rb-4.1.0&w=1920&h=1080&fit=crop&crop=center&q=80&auto=format)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32">
          <Badge className="mb-6 bg-gray-900/10 text-white border-white/20 backdrop-blur-sm">NIL Protection + Monetization</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ letterSpacing: 'var(--tracking-display)' }}>
            Your identity earns.<br />Stop giving it away free.
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
            WEIR detects unauthorized uses of your name, image, and likeness across the internet — then helps you take them down or turn them into revenue. In hours, not days.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-[var(--color-primary)] text-white hover:opacity-90 transition-smooth text-base px-8 h-12" onClick={() => navigate('/signup')}>
              Start free
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-gray-900/10 transition-smooth text-base px-8 h-12 backdrop-blur-sm" onClick={() => navigate('/pricing')}>
              See pricing
            </Button>
          </div>
          <p className="mt-6 text-white/60 text-sm">No credit card required. Free plan includes 10 detections/month.</p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-[var(--color-bg-surface)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">Everything you need to own your NIL</h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">Protection and monetization in one flow — not two separate products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:-translate-y-1 transition-smooth cursor-default">
                <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[var(--color-primary)]" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-[var(--color-bg)]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6">Start protecting your identity today</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10">Join thousands of creators who have reclaimed their NIL rights.</p>
          <Button size="lg" className="bg-[var(--color-primary)] text-white hover:opacity-90 transition-smooth text-base px-10 h-12" onClick={() => navigate('/signup')}>
            Get started free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
```