import { getTranslations } from 'next-intl/server'

export default async function Process() {
  const t = await getTranslations('process')

  const steps = [
    { number: t('step1Number'), title: t('step1Title'), description: t('step1Description') },
    { number: t('step2Number'), title: t('step2Title'), description: t('step2Description') },
    { number: t('step3Number'), title: t('step3Title'), description: t('step3Description') },
    { number: t('step4Number'), title: t('step4Title'), description: t('step4Description') },
  ]

  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{t('title')}</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-brand text-white text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
