import { getDictionary } from '@/lib/dictionary'

export type WordFamilyRelation =
  | 'inflection'
  | 'derived'
  | 'prefixed'
  | 'extended'

export type WordFamilyMember = {
  word: string
  relation: WordFamilyRelation
  label: string
  score: number
}

export type WordFamilyGroups = {
  inflections: WordFamilyMember[]
  derived: WordFamilyMember[]
  prefixed: WordFamilyMember[]
  extended: WordFamilyMember[]
}

const PREFIXES = [
  'anti',
  'auto',
  'counter',
  'de',
  'dis',
  'en',
  'ex',
  'fore',
  'hyper',
  'il',
  'im',
  'in',
  'inter',
  'ir',
  'mega',
  'micro',
  'mid',
  'mis',
  'non',
  'out',
  'over',
  'post',
  'pre',
  'pro',
  're',
  'semi',
  'sub',
  'super',
  'trans',
  'ultra',
  'un',
  'under',
]

const DERIVATIONAL_SUFFIXES = [
  'ability',
  'ibility',
  'ation',
  'ition',
  'ement',
  'ically',
  'ingly',
  'ously',
  'fulness',
  'lessness',
  'able',
  'ible',
  'ance',
  'ence',
  'ancy',
  'ency',
  'hood',
  'ical',
  'ically',
  'icity',
  'ism',
  'ist',
  'ity',
  'ive',
  'less',
  'ment',
  'ness',
  'ology',
  'ous',
  'ship',
  'tion',
  'sion',
  'al',
  'ary',
  'ful',
  'ic',
  'ish',
  'ize',
  'ise',
  'ly',
]

const INFLECTIONAL_SUFFIXES = [
  'ingly',
  'edly',
  'ing',
  'ied',
  'ies',
  'est',
  'ers',
  'ed',
  'er',
  'es',
  's',
]

let dictionaryCache: string[] | null = null
let dictionarySetCache: Set<string> | null = null

const familyCache = new Map<string, WordFamilyMember[]>()

function clean(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

function getCleanDictionary() {
  if (dictionaryCache) return dictionaryCache

  dictionaryCache = Array.from(
    new Set(getDictionary().map(clean).filter(Boolean))
  )

  return dictionaryCache
}

function getDictionarySet() {
  if (dictionarySetCache) return dictionarySetCache

  dictionarySetCache = new Set(getCleanDictionary())
  return dictionarySetCache
}

function removeDoubledFinalLetter(value: string) {
  if (value.length < 3) return value

  const last = value.at(-1)
  const previous = value.at(-2)

  if (last && last === previous) {
    return value.slice(0, -1)
  }

  return value
}

function addRoot(roots: Set<string>, value: string) {
  const normalized = clean(value)

  if (normalized.length >= 2) {
    roots.add(normalized)
  }
}

function getInflectionRoots(word: string) {
  const roots = new Set<string>()
  addRoot(roots, word)

  if (word.endsWith('ies') && word.length > 4) {
    addRoot(roots, `${word.slice(0, -3)}y`)
  }

  if (word.endsWith('ied') && word.length > 4) {
    addRoot(roots, `${word.slice(0, -3)}y`)
  }

  if (word.endsWith('ing') && word.length > 5) {
    const stem = word.slice(0, -3)

    addRoot(roots, stem)
    addRoot(roots, `${stem}e`)
    addRoot(roots, removeDoubledFinalLetter(stem))
  }

  if (word.endsWith('ed') && word.length > 4) {
    const stem = word.slice(0, -2)

    addRoot(roots, stem)
    addRoot(roots, `${stem}e`)
    addRoot(roots, removeDoubledFinalLetter(stem))
  }

  if (word.endsWith('es') && word.length > 4) {
    addRoot(roots, word.slice(0, -2))
    addRoot(roots, word.slice(0, -1))
  }

  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) {
    addRoot(roots, word.slice(0, -1))
  }

  if (word.endsWith('er') && word.length > 4) {
    const stem = word.slice(0, -2)

    addRoot(roots, stem)
    addRoot(roots, `${stem}e`)
    addRoot(roots, removeDoubledFinalLetter(stem))
  }

  if (word.endsWith('est') && word.length > 5) {
    const stem = word.slice(0, -3)

    addRoot(roots, stem)
    addRoot(roots, `${stem}e`)
    addRoot(roots, removeDoubledFinalLetter(stem))
  }

  return roots
}

function getWordRoots(word: string) {
  const roots = getInflectionRoots(word)

  for (const prefix of PREFIXES) {
    if (word.startsWith(prefix) && word.length - prefix.length >= 3) {
      const withoutPrefix = word.slice(prefix.length)

      addRoot(roots, withoutPrefix)

      for (const root of getInflectionRoots(withoutPrefix)) {
        addRoot(roots, root)
      }
    }
  }

  for (const suffix of DERIVATIONAL_SUFFIXES) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      const withoutSuffix = word.slice(0, -suffix.length)

      addRoot(roots, withoutSuffix)
      addRoot(roots, `${withoutSuffix}e`)
      addRoot(roots, `${withoutSuffix}y`)
    }
  }

  return roots
}

function sharedRootLength(sourceRoots: Set<string>, candidateRoots: Set<string>) {
  let longest = 0

  for (const root of sourceRoots) {
    if (candidateRoots.has(root)) {
      longest = Math.max(longest, root.length)
    }
  }

  return longest
}

function hasPrefixRelationship(source: string, candidate: string) {
  return PREFIXES.some((prefix) => {
    return (
      candidate === `${prefix}${source}` ||
      source === `${prefix}${candidate}`
    )
  })
}

function isLikelyInflection(source: string, candidate: string) {
  const shorter = source.length <= candidate.length ? source : candidate
  const longer = source.length > candidate.length ? source : candidate

  if (longer === `${shorter}s`) return true
  if (longer === `${shorter}es`) return true
  if (longer === `${shorter}ed`) return true
  if (longer === `${shorter}er`) return true
  if (longer === `${shorter}est`) return true
  if (longer === `${shorter}ing`) return true

  if (
    shorter.endsWith('y') &&
    longer === `${shorter.slice(0, -1)}ies`
  ) {
    return true
  }

  if (
    shorter.endsWith('y') &&
    longer === `${shorter.slice(0, -1)}ied`
  ) {
    return true
  }

  if (
    shorter.endsWith('e') &&
    longer === `${shorter.slice(0, -1)}ing`
  ) {
    return true
  }

  if (
    shorter.endsWith('e') &&
    longer === `${shorter}d`
  ) {
    return true
  }

  const doubledForms = INFLECTIONAL_SUFFIXES.some((suffix) => {
    if (!longer.endsWith(suffix)) return false

    const stem = longer.slice(0, -suffix.length)
    return removeDoubledFinalLetter(stem) === shorter
  })

  return doubledForms
}

function getRelation(
  source: string,
  candidate: string,
  sharedRoot: number
): {
  relation: WordFamilyRelation
  label: string
} {
  if (isLikelyInflection(source, candidate)) {
    return {
      relation: 'inflection',
      label: 'Inflected form',
    }
  }

  if (hasPrefixRelationship(source, candidate)) {
    return {
      relation: 'prefixed',
      label: 'Prefixed form',
    }
  }

  const hasDerivationalEnding = DERIVATIONAL_SUFFIXES.some(
    (suffix) =>
      source.endsWith(suffix) || candidate.endsWith(suffix)
  )

  if (hasDerivationalEnding && sharedRoot >= 3) {
    return {
      relation: 'derived',
      label: 'Derived form',
    }
  }

  return {
    relation: 'extended',
    label: 'Extended family',
  }
}

function getFamilyScore({
  source,
  candidate,
  sharedRoot,
  relation,
}: {
  source: string
  candidate: string
  sharedRoot: number
  relation: WordFamilyRelation
}) {
  let score = sharedRoot * 12

  if (relation === 'inflection') score += 45
  if (relation === 'prefixed') score += 35
  if (relation === 'derived') score += 28
  if (relation === 'extended') score += 10

  if (source[0] === candidate[0]) score += 4
  if (source.at(-1) === candidate.at(-1)) score += 4

  score -= Math.abs(source.length - candidate.length) * 2

  return score
}

export function getWordFamily(
  word: string,
  limit = 32
): WordFamilyMember[] {
  const current = clean(word)

  if (!current) return []

  const cacheKey = `${current}:${limit}`
  const cached = familyCache.get(cacheKey)

  if (cached) return cached

  const dictionary = getCleanDictionary()
  const dictionarySet = getDictionarySet()
  const sourceRoots = getWordRoots(current)

  const directCandidates = new Set<string>()

  for (const prefix of PREFIXES) {
    const prefixed = `${prefix}${current}`

    if (dictionarySet.has(prefixed)) {
      directCandidates.add(prefixed)
    }
  }

  const possibleForms = [
    `${current}s`,
    `${current}es`,
    `${current}ed`,
    `${current}er`,
    `${current}est`,
    `${current}ing`,
    `${current}ly`,
    `${current}ness`,
    `${current}ment`,
    `${current}ful`,
    `${current}less`,
  ]

  if (current.endsWith('e')) {
    possibleForms.push(`${current}d`)
    possibleForms.push(`${current.slice(0, -1)}ing`)
  }

  if (current.endsWith('y') && current.length > 2) {
    possibleForms.push(`${current.slice(0, -1)}ies`)
    possibleForms.push(`${current.slice(0, -1)}ied`)
  }

  for (const form of possibleForms) {
    if (dictionarySet.has(form)) {
      directCandidates.add(form)
    }
  }

  const members = dictionary
    .filter((candidate) => candidate !== current)
    .map((candidate) => {
      const candidateRoots = getWordRoots(candidate)
      const sharedRoot = sharedRootLength(sourceRoots, candidateRoots)

      const isDirect = directCandidates.has(candidate)
      const prefixRelated = hasPrefixRelationship(current, candidate)
      const inflectionRelated = isLikelyInflection(current, candidate)

      if (
        !isDirect &&
        !prefixRelated &&
        !inflectionRelated &&
        sharedRoot < Math.min(4, current.length)
      ) {
        return null
      }

      const { relation, label } = getRelation(
        current,
        candidate,
        sharedRoot
      )

      return {
        word: candidate,
        relation,
        label,
        score: getFamilyScore({
          source: current,
          candidate,
          sharedRoot,
          relation,
        }),
      }
    })
    .filter((item): item is WordFamilyMember => item !== null)
    .sort(
      (a, b) =>
        b.score - a.score || a.word.localeCompare(b.word)
    )
    .slice(0, limit)

  familyCache.set(cacheKey, members)

  return members
}

export function getWordFamilyGroups(
  word: string,
  limitPerGroup = 12
): WordFamilyGroups {
  const family = getWordFamily(word, limitPerGroup * 4)

  return {
    inflections: family
      .filter((item) => item.relation === 'inflection')
      .slice(0, limitPerGroup),

    derived: family
      .filter((item) => item.relation === 'derived')
      .slice(0, limitPerGroup),

    prefixed: family
      .filter((item) => item.relation === 'prefixed')
      .slice(0, limitPerGroup),

    extended: family
      .filter((item) => item.relation === 'extended')
      .slice(0, limitPerGroup),
  }
}