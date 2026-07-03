import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildSeoPage } from '@/lib/pageBuilder'
import { SeoWordPage } from '@/components/seo/SeoWordPage'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function parseLengthSlug(slug: string) {
  const match = slug.match(/^([2-9]|1[0-5])-letter-words$/)

  if (!match) return null

  return Number(match[1])
}

export async function generateStaticParams() {
  return Array.from({ length: 14 }, (_, index) => ({
    slug: `${index + 2}-letter-words`,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const length = parseLengthSlug(slug)

  if (!length) {
    return {}
  }

  const page = buildSeoPage({
    type: 'length',
    value: length,
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

export default async function SeoSlugPage({ params }: PageProps) {
  const { slug } = await params
  const length = parseLengthSlug(slug)

  if (!length) {
    notFound()
  }

  const page = buildSeoPage({
    type: 'length',
    value: length,
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