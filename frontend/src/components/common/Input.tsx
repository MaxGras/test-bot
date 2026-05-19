import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => (
  <div className={`${fullWidth ? 'w-full' : ''}`}>
    {label && <label className="block text-sm font-medium text-secondary-700 mb-1">{label}</label>}
    <input
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
        transition-colors
        disabled:bg-gray-100 disabled:text-gray-500
        ${error ? 'border-danger-500' : ''}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
  </div>
)

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => (
  <div className={`${fullWidth ? 'w-full' : ''}`}>
    {label && <label className="block text-sm font-medium text-secondary-700 mb-1">{label}</label>}
    <textarea
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
        transition-colors resize-none
        disabled:bg-gray-100 disabled:text-gray-500
        ${error ? 'border-danger-500' : ''}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
  </div>
)
