'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  created_at: string
}

export default function ContactSubmissionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      router.push('/admin/login')
      return
    }

    // Check auth
    if (typeof window === 'undefined') {
      router.push('/admin/login')
      return
    }

    const storedUser = sessionStorage.getItem('admin_user')
    if (!storedUser) {
      router.push('/admin/login')
      return
    }

    loadSubmissions()
  }, [router])

  const loadSubmissions = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error loading submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-brand-purple hover:text-brand-purple-light mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Contact Submissions
            </h1>
            <p className="text-text-secondary">
              View messages from the contact form
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              <p className="text-text-secondary">No submissions yet</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      {submission.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {submission.email}
                      {submission.company && ` • ${submission.company}`}
                    </p>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {new Date(submission.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-text-secondary whitespace-pre-wrap">
                  {submission.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

