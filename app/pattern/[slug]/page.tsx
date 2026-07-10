import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeoWordPage } from '@/components/seo/SeoWordPage'
import {
  filterPatternWords,
  parsePatternSlug,
} from '@/lib/patternGenerator'

export const dynamicParams = true
export const revalidate = false

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function getPageText(
  type:
    | 'length-starts-with'
    | 'length-ends-with'
    | 'length-contains',
  length: number,
  letters: string
) {
  const displayLetters = letters.toUpperCase()

  switch (type) {
    case 'length-starts-with':
      return {
        title: `${length}-Letter Words Starting With ${displayLetters}`,
        description: `Find ${length}-letter words starting with ${displayLetters}. Browse playable words for Scrabble, word games, crosswords, and vocabulary research.`,
      }

    case 'length-ends-with':
      return {
        title: `${length}-Letter Words Ending In ${displayLetters}`,
        description: `Find ${length}-letter words ending in ${displayLetters}. Browse playable words for Scrabble, word games, crosswords, and vocabulary research.`,
      }

    case 'length-contains':
      return {
        title: `${length}-Letter Words Containing ${displayLetters}`,
        description: `Find ${length}-letter words containing ${displayLetters}. Browse playable words for Scrabble, word games, crosswords, and vocabulary research.`,
      }
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const route = parsePatternSlug(slug)

  if (!route) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const words = filterPatternWords(route, 3)

  if (words.length < 2) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const text = getPageText(
    route.type,
    route.length,
    route.letters
  )

  const canonical =
    `https://unscramblehq.com/pattern/${slug}`

  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: text.title,
      description: text.description,
      url: canonical,
      type: 'website',
    },
  }
}

export default async function PatternPage({
  params,
}: PageProps) {
  const { slug } = await params
  const route = parsePatternSlug(slug)

  if (!route) notFound()

  const words = filterPatternWords(route, 100)

  if (words.length < 2) notFound()

  const text = getPageText(
    route.type,
    route.length,
    route.letters
  )

  return (
    <SeoWordPage
      title={text.title}
      description={text.description}
      words={words}
      relatedLinks={[
        {
          href: `/${route.length}-letter-words`,
          label: `${route.length}-letter words`,
        },
        {
          href: '/word-finder',
          label: 'Word Finder',
        },
        {
          href: '/scrabble-word-finder',
          label: 'Scrabble Word Finder',
        },
      ]}
    />
  )
}