import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`
      bg-white rounded-lg shadow-sm border border-gray-200
      p-4 transition-shadow hover:shadow-md
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
)

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => (
  <div className={`mb-4 border-b border-gray-200 pb-3 ${className}`} {...props}>
    {children}
  </div>
)

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '', ...props }) => (
  <h2 className={`text-xl font-semibold text-secondary-700 ${className}`} {...props}>
    {children}
  </h2>
)

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...props }) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {children}
  </div>
)

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-3 border-t border-gray-200 flex gap-2 ${className}`} {...props}>
    {children}
  </div>
)
