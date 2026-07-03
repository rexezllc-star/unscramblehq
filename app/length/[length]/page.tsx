import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildSeoPage } from '@/lib/pageBuilder'
import { SeoWordPage } from '@/components/seo/SeoWordPage'

type PageProps = {
  params: Promise<{
    length: string
  }>
}

export async function generateStaticParams() {
  return Array.from({ length: 14 }, (_, index) => ({
    length: String(index + 2),
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { length } = await params
  const page = buildSeoPage({
    type: 'length',
    value: Number(length),
  })

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonical,
      type: 'website',
    },
  }
}

export default async function LengthWordPage({ params }: PageProps) {
  const { length } = await params
  const numericLength = Number(length)

  if (!Number.isInteger(numericLength) || numericLength < 2 || numericLength > 15) {
    notFound()
  }

  const page = buildSeoPage({
    type: 'length',
    value: numericLength,
  })

  if (!page.words.length) {
    notFound()
  }

  return (
    <SeoWordPage
      title={page.h1}
      description={page.description}
      words={page.words}
      relatedLinks={page.relatedLinks}
    />
  )
}