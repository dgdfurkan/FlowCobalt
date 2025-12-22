import VisitorDetailClient from './VisitorDetailClient'

export function generateStaticParams() {
  return []
}

interface PageProps {
  params: { id: string }
}

export default function VisitorDetailPage({ params }: PageProps) {
  return <VisitorDetailClient visitorId={params.id} />
}
