'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

// Disable static generation for admin pages
export const dynamic = 'force-dynamic'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isSupabaseAvailable()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-medium">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Service Unavailable
          </h1>
          <p className="text-text-secondary">
            The authentication service is currently unavailable. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!supabase) {
      setError('Authentication service unavailable')
      setLoading(false)
      return
    }

    try {
      // First, get admin by username from admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id, username, email')
        .eq('username', username)
        .single()

      if (adminError || !adminData) {
        throw new Error('Invalid username or password')
      }

      // Supabase Auth requires email, so we use the email from admin record
      if (!adminData.email) {
        throw new Error('Admin account is missing email. Please contact administrator.')
      }

      // Authenticate with email from admin record
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: adminData.email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        // Verify admin status one more time
        const { data: verifyAdmin } = await supabase
          .from('admins')
          .select('id, username')
          .eq('username', username)
          .single()

        if (!verifyAdmin) {
          await supabase.auth.signOut()
          throw new Error('Access denied. Admin privileges required.')
        }

        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-medium">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Admin Login
          </h1>
          <p className="text-text-secondary">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}

