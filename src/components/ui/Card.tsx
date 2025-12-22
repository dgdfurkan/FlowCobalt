import { ReactNode } from 'react'
import Link from 'next/link'

interface CardProps {
  children: ReactNode
  className?: string
  href?: string
  hover?: boolean
}

export default function Card({ children, className = '', href, hover = true }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-soft p-6 transition-all duration-300'
  const hoverStyles = hover ? 'hover:shadow-medium hover:-translate-y-1' : ''
  const classes = `${baseStyles} ${hoverStyles} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-bold text-text-primary ${className}`}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-text-secondary mt-2 ${className}`}>
      {children}
    </p>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

