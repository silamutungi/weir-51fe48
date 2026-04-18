import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Settings } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from './ui/button'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isAuthed = isSupabaseConfigured ? Boolean(user) : location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/settings')

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    navigate('/')
  }

  const navLinks = isAuthed
    ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/settings', label: 'Settings' }, { to: '/pricing', label: 'Pricing' }]
    : [{ to: '/pricing', label: 'Pricing' }, { to: '/login', label: 'Sign in' }]

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={isAuthed ? '/dashboard' : '/'} className="text-xl font-bold text-[var(--color-primary)] tracking-tight">
          WEIR
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-smooth ${
                location.pathname === link.to
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
              aria-current={location.pathname === link.to ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          {isAuthed ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)]">
              <LogOut size={16} className="mr-1" aria-hidden="true" />
              Logout
            </Button>
          ) : (
            <Button size="sm" className="bg-[var(--color-primary)] text-white hover:opacity-90" onClick={() => navigate('/signup')}>
              Start free
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] min-w-[44px] min-h-[44px] flex items-center justify-center transition-smooth"
          onClick={() => setMenuOpen(m => !m)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] transition-smooth"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuthed && (
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-muted)] transition-smooth"
              onClick={() => setMenuOpen(false)}
            >
              <Settings size={16} aria-hidden="true" />
              Settings
            </Link>
          )}
          {isAuthed && (
            <button
              onClick={() => { setMenuOpen(false); handleLogout() }}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-smooth"
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}