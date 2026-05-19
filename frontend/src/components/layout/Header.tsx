import React from 'react'
import type { User } from '@types'

interface HeaderProps {
  user?: User
  title: string
  onBack?: () => void
}

export const Header: React.FC<HeaderProps> = ({ user, title, onBack }) => (
  <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
    <div className="flex items-center justify-between px-4 py-3 safe-top">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          ← Back
        </button>
      )}

      {/* Title */}
      <h1 className="text-lg font-bold text-secondary-900 flex-1 text-center">{title}</h1>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600">{user.first_name}</span>
        </div>
      )}
    </div>
  </header>
)

interface NavItem {
  id: string
  label: string
  icon: string
  active?: boolean
  onClick: () => void
}

interface NavigationProps {
  items: NavItem[]
}

export const Navigation: React.FC<NavigationProps> = ({ items }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-bottom">
    <div className="flex justify-around">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={`
            flex-1 py-3 flex flex-col items-center gap-1 transition-colors
            ${item.active ? 'text-primary-600 border-t-2 border-primary-600' : 'text-secondary-600'}
          `}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
)

interface LayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  navigation?: React.ReactNode
  hasNavigation?: boolean
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  navigation,
  hasNavigation = false,
}) => (
  <div className="h-screen bg-gray-50 flex flex-col">
    {/* Header */}
    {header && <>{header}</>}

    {/* Main content */}
    <main className={`flex-1 overflow-y-auto ${hasNavigation ? 'pb-20' : ''}`}>
      {children}
    </main>

    {/* Navigation */}
    {navigation && hasNavigation && <>{navigation}</>}
  </div>
)
