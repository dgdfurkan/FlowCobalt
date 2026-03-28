import { getTranslations } from 'next-intl/server'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export default async function TrustBlocks() {
  const t = await getTranslations('trustBlocks')

  const blocks = [
    { title: t('item1Title'), description: t('item1Description'), subtitle: t('item1Subtitle') },
    { title: t('item2Title'), description: t('item2Description'), subtitle: t('item2Subtitle') },
    { title: t('item3Title'), description: t('item3Description'), subtitle: t('item3Subtitle') },
  ]

  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {blocks.map((block, index) => (
            <Card key={index} hover={false}>
              <CardHeader>
                <CardTitle className="text-lg">{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-purple font-semibold text-lg mb-2">{block.description}</p>
                <CardDescription>{block.subtitle}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
