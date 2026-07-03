import {
  CONTAINS_COMBINATIONS,
  ENDING_SUFFIXES,
  STARTING_PREFIXES,
} from '@/lib/seoRouteLists'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeoWordPage } from '@/components/seo/SeoWordPage'
import {
  buildRoutePage,
  parseContainsSlug,
  parseEndsWithSlug,
  parseLengthSlug,
  parseStartsWithSlug,
} from '@/lib/routeFactory'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function resolveRoute(slug: string) {
  const length = parseLengthSlug(slug)
  if (length) {
    return {
      type: 'length' as const,
      value: length,
    }
  }

  const startsWith = parseStartsWithSlug(slug)
  if (startsWith) {
    return {
      type: 'startsWith' as const,
      value: startsWith,
    }
  }

  const endsWith = parseEndsWithSlug(slug)
  if (endsWith) {
    return {
      type: 'endsWith' as const,
      value: endsWith,
    }
  }

  const contains = parseContainsSlug(slug)
  if (contains) {
    return {
      type: 'contains' as const,
      value: contains,
    }
  }

  return null
}
export async function generateStaticParams() {
  const lengths = Array.from({ length: 14 }, (_, index) => ({
    slug: `${index + 2}-letter-words`,
  }))

  const startingLetters = STARTING_PREFIXES.map((prefix) => ({
    slug: `words-starting-with-${prefix}`,
  }))

  const commonEndings = ENDING_SUFFIXES.map((ending) => ({
    slug: `words-ending-in-${ending}`,
  }))

  const commonContains = CONTAINS_COMBINATIONS.map((letters) => ({
    slug: `words-containing-${letters}`,
  }))

  return [
    ...lengths,
    ...startingLetters,
    ...commonEndings,
    ...commonContains,
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

  if (!route) {
    notFound()
  }

  const page = buildRoutePage(route.type, route.value)

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