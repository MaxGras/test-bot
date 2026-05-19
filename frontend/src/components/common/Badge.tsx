import React from 'react'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-success-100 text-success-800',
  danger: 'bg-danger-100 text-danger-800',
  warning: 'bg-warning-100 text-warning-800',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    {...props}
  >
    {children}
  </span>
)

interface EmptyStateProps {
  icon?: string
  title: string
  message: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-secondary-700 mb-2">{title}</h3>
    <p className="text-secondary-600 text-center mb-6 max-w-sm">{message}</p>
    {action}
  </div>
)

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8'

  return (
    <svg className={`animate-spin text-primary-600 ${sizeClass}`} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export const Skeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 1,
  className = '',
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`bg-gray-200 animate-pulse rounded ${className}`} />
    ))}
  </>
)
