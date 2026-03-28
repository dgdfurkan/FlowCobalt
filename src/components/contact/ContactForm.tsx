'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import Form, { FormField, Input, Textarea } from '@/components/ui/Form'
import Button from '@/components/ui/Button'

export default function ContactForm() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = t('formNameRequired')
    if (!formData.email.trim()) newErrors.email = t('formEmailRequired')
    else if (!validateEmail(formData.email)) newErrors.email = t('formEmailInvalid')
    if (!formData.message.trim()) newErrors.message = t('formMessageRequired')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Failed to submit form')
      setSubmitStatus('success')
      setFormData({ name: '', email: '', company: '', message: '' })
      setErrors({})
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-8 md:p-12">
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{t('formSuccess')}</p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{t('formError')}</p>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <FormField label={t('formName')} error={errors.name} required>
          <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={!!errors.name} placeholder={t('formNamePlaceholder')} disabled={isSubmitting} />
        </FormField>

        <FormField label={t('formEmail')} error={errors.email} required>
          <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={!!errors.email} placeholder={t('formEmailPlaceholder')} disabled={isSubmitting} />
        </FormField>

        <FormField label={t('formCompany')} error={errors.company}>
          <Input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} error={!!errors.company} placeholder={t('formCompanyPlaceholder')} disabled={isSubmitting} />
        </FormField>

        <FormField label={t('formMessage')} error={errors.message} required>
          <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} error={!!errors.message} placeholder={t('formMessagePlaceholder')} disabled={isSubmitting} />
        </FormField>

        <div className="mt-8">
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? t('formSending') : t('formSend')}
          </Button>
        </div>
      </Form>
    </div>
  )
}
