import React from 'react'

interface TelegramMessageProps {
  children: React.ReactNode
  icon?: string
}

export const TelegramMessage: React.FC<TelegramMessageProps> = ({ children, icon }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
      {icon && <p className="text-2xl">{icon}</p>}
      <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
        {children}
      </div>
    </div>
  )
}
