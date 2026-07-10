import { getSeoInventory } from '@/lib/seoInventory'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeoWordPage } from '@/components/seo/SeoWordPage'
import {
  buildRoutePage,
  parseContainsSlug,
  parseEndsWithSlug,
  parseLengthSlug,
  parseScrabbleScoreSlug,
  parseStartsWithSlug,
} from '@/lib/routeFactory'

export const dynamicParams = true
export const revalidate = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function resolveRoute(slug: string) {
  const length = parseLengthSlug(slug)
  if (length) return { type: 'length' as const, value: length }

  const startsWith = parseStartsWithSlug(slug)
  if (startsWith) return { type: 'startsWith' as const, value: startsWith }

  const endsWith = parseEndsWithSlug(slug)
  if (endsWith) return { type: 'endsWith' as const, value: endsWith }

  const contains = parseContainsSlug(slug)
  if (contains) return { type: 'contains' as const, value: contains }

  const scrabbleScore = parseScrabbleScoreSlug(slug)
  if (scrabbleScore) {
    return { type: 'scrabbleScore' as const, value: scrabbleScore }
  }

  return null
}

export async function generateStaticParams() {
  const inventory = getSeoInventory()

  return [
    ...inventory.lengths.map((length) => ({
      slug: `${length}-letter-words`,
    })),

    ...inventory.prefixes.map((prefix) => ({
      slug: `words-starting-with-${prefix}`,
    })),

    ...inventory.suffixes.map((suffix) => ({
      slug: `words-ending-in-${suffix}`,
    })),

    ...inventory.contains.map((letters) => ({
      slug: `words-containing-${letters}`,
    })),

    ...inventory.scrabbleScores.map((score) => ({
      slug: `words-with-${score}-scrabble-points`,
    })),
  ]
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const route = resolveRoute(slug)

  if (!route) return {}

  const page = buildRoutePage(route.type, route.value)

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
  const route = resolveRoute(slug)

  if (!route) notFound()

  const page = buildRoutePage(route.type, route.value)

  if (!page.words.length) notFound()

  return (
    <SeoWordPage
      title={page.h1}
      description={page.description}
      words={page.words.slice(0, 100)}
      relatedLinks={page.relatedLinks}
    />
  )
}