import Link from 'next/link'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alternate'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'gradient-brand text-white hover:opacity-90 focus:ring-brand-purple',
    secondary: 'bg-white text-text-primary border-2 border-brand-purple hover:bg-brand-purple hover:text-white focus:ring-brand-purple',
    alternate: 'bg-background-secondary text-text-primary hover:bg-gray-200 focus:ring-gray-400',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  if (href) {
    return (
      <Link 
        href={href} 
        className={`${classes} hover:scale-105`}
        style={{ transition: 'transform 0.2s ease' }}
      >
        {children}
      </Link>
    )
  }
  
  return (
    <button 
      className={`${classes} hover:scale-105`}
      style={{ transition: 'transform 0.2s ease' }}
      {...props}
    >
      {children}
    </button>
  )
}

