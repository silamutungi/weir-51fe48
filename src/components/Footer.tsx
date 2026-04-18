import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Intl.DateTimeFormat(undefined, { year: 'numeric' }).format(new Date())

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-lg font-bold text-[var(--color-primary)]">WEIR</span>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Protect your identity. Own your earnings.</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-[var(--color-text-secondary)]" aria-label="Footer navigation">
          <Link to="/pricing" className="hover:text-[var(--color-text)] transition-smooth">Pricing</Link>
          <Link to="/login" className="hover:text-[var(--color-text)] transition-smooth">Sign in</Link>
          <Link to="/signup" className="hover:text-[var(--color-text)] transition-smooth">Sign up</Link>
          <a href="mailto:support@weir.app" className="hover:text-[var(--color-text)] transition-smooth">Support</a>
        </nav>
        <p className="text-xs text-[var(--color-text-muted)]">&copy; {year} WEIR. All rights reserved.</p>
      </div>
    </footer>
  )
}
