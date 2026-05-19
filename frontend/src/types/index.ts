// User Types
export type UserRole = 'admin' | 'developer' | 'sales_manager'

export interface User {
  id: number
  telegram_id: number
  role: UserRole
  username?: string
  first_name?: string
  last_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Developer {
  id: number
  user_id: number
  name: string
  bio?: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Call {
  id: number
  developer_id: number
  sales_manager_id: number
  title: string
  start_time: string
  end_time: string
  notes?: string
  call_link?: string
  salary_fork?: string
  job_post_link?: string
  created_at: string
  updated_at: string
}

export interface Access {
  id: number
  user_id: number
  granted_by: number
  created_at: string
}

export interface NotificationSettings {
  id: number
  sales_manager_id: number
  developer_id: number
  is_enabled: boolean
  created_at: string
  updated_at: string
}

// API Response Types
export interface ListResponse<T> {
  total: number
  items: T[]
}

export interface ApiError {
  detail: string
}

// Telegram Mini App Types
export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    auth_date: number
    hash: string
  }
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (callback: () => void) => void
  }
}

// App State
export interface AppState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface ModalState {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}
