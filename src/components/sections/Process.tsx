const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We understand your process',
  },
  {
    number: '02',
    title: 'Build',
    description: 'We develop the automation',
  },
  {
    number: '03',
    title: 'Deploy',
    description: 'We deploy to production',
  },
  {
    number: '04',
    title: 'Support',
    description: 'We provide ongoing support',
  },
]

export default function Process() {
  return (
    <section className="section-padding bg-background-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            How We Work
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A simple, proven process to automate your workflows
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-brand text-white text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

