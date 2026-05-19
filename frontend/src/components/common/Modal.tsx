import React from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  actions?: React.ReactNode
}

const typeStyles: Record<string, { icon: string; bg: string; border: string }> = {
  success: {
    icon: '✓',
    bg: 'bg-success-50',
    border: 'border-success-200',
  },
  error: {
    icon: '✕',
    bg: 'bg-danger-50',
    border: 'border-danger-200',
  },
  warning: {
    icon: '⚠',
    bg: 'bg-warning-50',
    border: 'border-warning-200',
  },
  info: {
    icon: 'ℹ',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
  },
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  actions,
}) => {
  if (!isOpen) return null

  const style = typeStyles[type]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-lg max-w-sm w-full border ${style.border} ${style.bg}`}>
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`
              w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
              ${type === 'success' && 'bg-success-100 text-success-600'}
              ${type === 'error' && 'bg-danger-100 text-danger-600'}
              ${type === 'warning' && 'bg-warning-100 text-warning-600'}
              ${type === 'info' && 'bg-primary-100 text-primary-600'}
            `}
            >
              {style.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-center text-lg font-semibold text-secondary-700 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-center text-secondary-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-2">
            {actions || (
              <button
                onClick={onClose}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
