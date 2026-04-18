import { useEffect, useState } from 'react'
import { Shield, AlertTriangle, Loader2, RotateCcw, Plus, XCircle, DollarSign, CheckCircle } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatCurrency, formatRelative } from '../lib/utils'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import DashboardNav from '../components/Navbar'
import type { WeirAlert } from '../types'

const SEED_ALERTS: WeirAlert[] = [
  { id: '1', user_id: 'seed', platform: 'Instagram', url: 'https://instagram.com/p/abc123', title: '@fitbrand used your photo in a sponsored post', severity: 'high', status: 'pending', detected_at: new Date(Date.now() - 3600000).toISOString(), estimated_value: 1200, created_at: new Date().toISOString(), deleted_at: null },
  { id: '2', user_id: 'seed', platform: 'TikTok', url: 'https://tiktok.com/@brand/video/456', title: 'NutritionCo used your likeness in 14M-view ad', severity: 'high', status: 'pending', detected_at: new Date(Date.now() - 7200000).toISOString(), estimated_value: 4500, created_at: new Date().toISOString(), deleted_at: null },
  { id: '3', user_id: 'seed', platform: 'YouTube', url: 'https://youtube.com/watch?v=xyz', title: 'Sports channel used your interview clip', severity: 'medium', status: 'monetized', detected_at: new Date(Date.now() - 86400000).toISOString(), estimated_value: 800, created_at: new Date().toISOString(), deleted_at: null },
  { id: '4', user_id: 'seed', platform: 'Twitter/X', url: 'https://x.com/user/status/789', title: 'Brand account used your image without credit', severity: 'low', status: 'approved', detected_at: new Date(Date.now() - 172800000).toISOString(), estimated_value: 200, created_at: new Date().toISOString(), deleted_at: null },
  { id: '5', user_id: 'seed', platform: 'LinkedIn', url: 'https://linkedin.com/posts/abc', title: 'Recruitment firm used your profile photo', severity: 'medium', status: 'taken_down', detected_at: new Date(Date.now() - 259200000).toISOString(), estimated_value: 300, created_at: new Date().toISOString(), deleted_at: null },
  { id: '6', user_id: 'seed', platform: 'Facebook', url: 'https://facebook.com/post/999', title: 'Local gym shared your workout video', severity: 'low', status: 'disputed', detected_at: new Date(Date.now() - 345600000).toISOString(), estimated_value: 150, created_at: new Date().toISOString(), deleted_at: null }
]

const SEVERITY_COLORS: Record<string, string> = { high: 'destructive', medium: 'secondary', low: 'outline' }
const STATUS_LABELS: Record<string, string> = { pending: 'Pending', taken_down: 'Taken Down', monetized: 'Monetized', approved: 'Approved', disputed: 'Disputed' }

export default function Dashboard() {
  const [alerts, setAlerts] = useState<WeirAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAlerts() {
    setError('')
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 600))
        setAlerts(SEED_ALERTS)
        return
      }
      const { data, error: dbError } = await (supabase.from('weir_alerts').select('*').is('deleted_at', null).order('detected_at', { ascending: false }) as any)
      if (dbError) throw dbError
      setAlerts((data as WeirAlert[]) ?? [])
    } catch {
      setError('Failed to load alerts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function updateAlertStatus(id: string, status: WeirAlert['status']) {
    try {
      if (!isSupabaseConfigured) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a))
        return
      }
      await (supabase.from('weir_alerts').update({ status } as any).eq('id', id) as any)
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    } catch {
      setError('Action failed. Please try again.')
    }
  }

  async function dismissAlert(id: string) {
    try {
      if (!isSupabaseConfigured) {
        setAlerts(prev => prev.filter(a => a.id !== id))
        return
      }
      await (supabase.from('weir_alerts').update({ deleted_at: new Date().toISOString() } as any).eq('id', id) as any)
      setAlerts(prev => prev.filter(a => a.id !== id))
    } catch {
      setError('Dismiss failed. Please try again.')
    }
  }

  useEffect(() => { loadAlerts() }, [])

  const totalValue = alerts.reduce((s, a) => s + a.estimated_value, 0)
  const pendingCount = alerts.filter(a => a.status === 'pending').length
  const monetizedCount = alerts.filter(a => a.status === 'monetized').length
  const resolvedCount = alerts.filter(a => ['taken_down', 'approved'].includes(a.status)).length

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <DashboardNav />
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-6 py-3 text-center text-sm text-amber-800 dark:text-amber-300">
          Viewing sample data — connect your database to go live.
        </div>
      )}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Monitor and manage your NIL activity</p>
          </div>
          <Button className="bg-[var(--color-primary)] text-white hover:opacity-90 transition-smooth" onClick={() => alert('Scan triggered — results appear within minutes.')}>
            <Plus size={16} className="mr-2" aria-hidden="true" />
            New scan
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Value at Risk', value: formatCurrency(totalValue), icon: DollarSign, color: 'text-[var(--color-primary)]' },
            { label: 'Pending Review', value: String(pendingCount), icon: AlertTriangle, color: 'text-[var(--color-warning)]' },
            { label: 'Monetized', value: String(monetizedCount), icon: CheckCircle, color: 'text-[var(--color-success)]' },
            { label: 'Resolved', value: String(resolvedCount), icon: Shield, color: 'text-[var(--color-info)]' }
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">{label}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <span className="text-2xl font-bold text-[var(--color-text)]">{value}</span>
                <Icon size={20} className={color} aria-hidden="true" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[var(--color-text)]">Detection Feed</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-[var(--color-text-secondary)]">
                <Loader2 size={24} className="animate-spin mr-3" aria-hidden="true" />
                Loading detections...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-16 gap-4">
                <AlertTriangle size={32} className="text-[var(--color-error)]" />
                <p className="text-[var(--color-error)] font-medium">{error}</p>
                <Button variant="outline" onClick={loadAlerts}><RotateCcw size={16} className="mr-2" aria-hidden="true" />Retry</Button>
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-4 text-center">
                <Shield size={48} className="text-[var(--color-text-muted)]" />
                <p className="font-semibold text-[var(--color-text)]">No detections yet</p>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-xs">Run your first scan to start monitoring your name, image, and likeness across platforms.</p>
                <Button className="bg-[var(--color-primary)] text-white hover:opacity-90" onClick={() => alert('Scan triggered!')}>
                  <Plus size={16} className="mr-2" />Run first scan
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {alerts.map(alert => (
                  <div key={alert.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={SEVERITY_COLORS[alert.severity] as 'destructive' | 'secondary' | 'outline'}>{alert.severity.toUpperCase()}</Badge>
                        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-muted)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">{alert.platform}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">{formatRelative(alert.detected_at)}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{alert.title}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        Est. value: <strong className="text-[var(--color-success)]">{formatCurrency(alert.estimated_value)}</strong> &bull; Status: {STATUS_LABELS[alert.status]}
                      </p>
                    </div>
                    {alert.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="destructive" onClick={() => updateAlertStatus(alert.id, 'taken_down')}>Take down</Button>
                        <Button size="sm" variant="outline" className="text-[var(--color-success)] border-green-300 hover:bg-green-50" onClick={() => updateAlertStatus(alert.id, 'monetized')}>Monetize</Button>
                        <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)} aria-label="Dismiss alert">
                          <XCircle size={16} aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
