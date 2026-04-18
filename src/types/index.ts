export type AlertSeverity = 'high' | 'medium' | 'low'
export type AlertStatus = 'pending' | 'taken_down' | 'monetized' | 'approved' | 'disputed'
export type LicenseType = 'commercial' | 'editorial' | 'social' | 'broadcast'

export interface WeirAlert {
  id: string
  user_id: string
  platform: string
  url: string
  title: string
  severity: AlertSeverity
  status: AlertStatus
  detected_at: string
  estimated_value: number
  created_at: string
  deleted_at: string | null
}

export interface WeirLicense {
  id: string
  user_id: string
  name: string
  type: LicenseType
  allowed_uses: string
  rate: number
  active: boolean
  created_at: string
  deleted_at: string | null
}

export interface WeirEarning {
  id: string
  user_id: string
  platform: string
  amount: number
  source: string
  earned_at: string
  created_at: string
  deleted_at: string | null
}

export interface WeirProfile {
  id: string
  user_id: string
  display_name: string
  email: string
  bio: string
  social_handles: Record<string, string>
  plan: 'free' | 'creator' | 'pro'
  created_at: string
  deleted_at: string | null
}
