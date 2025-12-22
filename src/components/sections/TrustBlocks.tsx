import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

const trustBlocks = [
  {
    title: 'Fast delivery',
    description: '1–2 weeks',
    subtitle: 'Fast delivery guarantee',
  },
  {
    title: 'Async-first communication',
    description: 'Works across time zones',
    subtitle: 'No time zone barriers',
  },
  {
    title: 'Documentation + monitoring',
    description: 'Included',
    subtitle: 'Documentation and monitoring included',
  },
]

export default function TrustBlocks() {
  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {trustBlocks.map((block, index) => (
            <Card key={index} hover={false}>
              <CardHeader>
                <CardTitle className="text-lg">{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-purple font-semibold text-lg mb-2">
                  {block.description}
                </p>
                <CardDescription>{block.subtitle}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

