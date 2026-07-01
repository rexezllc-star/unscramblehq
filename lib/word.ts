cat > lib/word.ts <<'EOF'
import { DICTIONARY } from '@/lib/dictionary'
import { scrabbleScore, wordsWithFriendsScore } from '@/lib/engine'

export function getWordEntry(word: string) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  const entry = DICTIONARY.find((item) => item.word.toLowerCase() === cleaned)
  if (!entry) return null

  return {
    ...entry,
    word: entry.word.toLowerCase(),
    length: entry.word.length,
    score: scrabbleScore(entry.word),
    wwfScore: wordsWithFriendsScore(entry.word),
    startsWith: entry.word.slice(0, 2),
    endsWith: entry.word.slice(-3),
    difficulty: entry.word.length <= 4 ? 'Easy' : entry.word.length <= 7 ? 'Medium' : 'Hard'
  }
}

export function getRelatedWords(word: string) {
  const cleaned = word.toLowerCase()
  const first = cleaned[0]
  const last = cleaned[cleaned.length - 1]

  return DICTIONARY
    .filter((entry) => entry.word !== cleaned)
    .filter((entry) => entry.word.startsWith(first) || entry.word.endsWith(last) || entry.word.length === cleaned.length)
    .slice(0, 9)
}
EOF
