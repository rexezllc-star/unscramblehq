#!/usr/bin/env bash
set -euo pipefail

PATCH_ID="001-search-exact-word"
ROOT="${1:-$PWD}"

cd "$ROOT"

fail() {
  echo
  echo "ERROR: $*" >&2
  exit 1
}

echo "=================================================="
echo "UnscrambleHQ Patch 001 — Exact Word Search"
echo "Repository: $ROOT"
echo "=================================================="

[[ -f package.json ]] || fail "package.json not found. Run this from the UnscrambleHQ repository."
[[ -f components/Unscrambler.tsx ]] || fail "components/Unscrambler.tsx not found."
[[ -d .git ]] || fail "This does not appear to be a Git repository."

BRANCH="$(git branch --show-current)"
[[ "$BRANCH" == "main" ]] || fail "Expected branch 'main'; current branch is '$BRANCH'."

if [[ -n "$(git status --porcelain)" ]]; then
  echo
  git status --short
  fail "Working tree is not clean. Commit or stash current changes before applying Patch 001."
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR=".patch-backups/${PATCH_ID}-${STAMP}"
mkdir -p "$BACKUP_DIR/components"
cp components/Unscrambler.tsx "$BACKUP_DIR/components/Unscrambler.tsx"
cp package.json "$BACKUP_DIR/package.json"

python3 <<'PY'
from pathlib import Path
import json
import sys

path = Path("components/Unscrambler.tsx")
text = path.read_text()

required = [
    "export function Unscrambler()",
    "const [results, setResults] = useState<SearchResult[]>([])",
    "const matches = engine.searchWords(",
    "setResults(matches)",
    "<BestPlays results={results} />",
]
missing = [item for item in required if item not in text]
if missing:
    print("Patch preflight failed. Missing expected source markers:", file=sys.stderr)
    for item in missing:
        print(f"  - {item}", file=sys.stderr)
    sys.exit(1)

if "ExactDictionaryMatch" in text or "exactNavigationEnabled" in text:
    print("Patch 001 appears to be applied already; refusing to apply twice.", file=sys.stderr)
    sys.exit(1)

text = text.replace(
    "'use client'\n\nimport {",
    "'use client'\n\nimport Link from 'next/link'\nimport { usePathname, useRouter } from 'next/navigation'\n\nimport {",
    1,
)

text = text.replace(
    "export function Unscrambler() {\n  const [letters, setLetters] = useState('')",
    "export function Unscrambler() {\n"
    "  const router = useRouter()\n"
    "  const pathname = usePathname()\n\n"
    "  const [letters, setLetters] = useState('')",
    1,
)

text = text.replace(
    "  const [results, setResults] = useState<SearchResult[]>([])\n",
    "  const [results, setResults] = useState<SearchResult[]>([])\n"
    "  const [exactMatch, setExactMatch] = useState<SearchResult | null>(null)\n",
    1,
)

needle = (
    "  const deferredSubmitted = useDeferredValue(submitted)\n"
    "  const deferredFilters = useDeferredValue(filters)\n"
)
replacement = needle + '''
  /**
   * Exact dictionary navigation belongs to the general Word Finder.
   * Dedicated tools keep their normal anagram/Scrabble/Wordle behavior.
   */
  const exactNavigationEnabled =
    pathname === '/word-finder'

  const hasConstrainedFilters = Boolean(
    deferredFilters.minLength ||
      deferredFilters.maxLength ||
      deferredFilters.exactLength ||
      deferredFilters.startsWith ||
      deferredFilters.endsWith ||
      deferredFilters.contains ||
      deferredFilters.excludes ||
      deferredFilters.minScore
  )
'''
text = text.replace(needle, replacement, 1)

text = text.replace(
    "      setResults([])\n      setEngineLoading(false)",
    "      setResults([])\n      setExactMatch(null)\n      setEngineLoading(false)",
    1,
)

needle = "        setResults(matches)"
replacement = '''        const normalizedInput = deferredSubmitted
          .trim()
          .toLowerCase()

        const isPlainWord = /^[a-z]+$/.test(
          normalizedInput
        )

        const matchingEntry = isPlainWord
          ? matches.find(
              (entry) =>
                entry.word.toLowerCase() ===
                normalizedInput
            ) ?? null
          : null

        setExactMatch(matchingEntry)

        if (
          matchingEntry &&
          exactNavigationEnabled &&
          !hasConstrainedFilters
        ) {
          router.push(
            `/word/${encodeURIComponent(
              matchingEntry.word.toLowerCase()
            )}`
          )
          return
        }

        setResults(matches)'''
text = text.replace(needle, replacement, 1)

text = text.replace(
    "          setResults([])\n          setSearchError(",
    "          setResults([])\n          setExactMatch(null)\n          setSearchError(",
    1,
)

needle = '''    deferredSubmitted,
    deferredFilters,
    loadSearchEngine,
  ])'''
replacement = '''    deferredSubmitted,
    deferredFilters,
    exactNavigationEnabled,
    hasConstrainedFilters,
    loadSearchEngine,
    router,
  ])'''
text = text.replace(needle, replacement, 1)

text = text.replace(
    "    setVisibleLimit(INITIAL_RESULT_LIMIT)\n    setSearchError('')",
    "    setVisibleLimit(INITIAL_RESULT_LIMIT)\n    setExactMatch(null)\n    setSearchError('')",
    1,
)

text = text.replace(
    "    setSubmitted('')\n    setResults([])\n    setEngineLoading(false)",
    "    setSubmitted('')\n    setResults([])\n    setExactMatch(null)\n    setEngineLoading(false)",
    1,
)

text = text.replace(
    "              <BestPlays results={results} />",
    '''              {exactMatch ? (
                <ExactDictionaryMatch
                  result={exactMatch}
                />
              ) : null}

              <BestPlays results={results} />''',
    1,
)

marker = "\nfunction FilterInput({"
component = '''
function ExactDictionaryMatch({
  result,
}: {
  result: SearchResult
}) {
  const normalizedWord =
    result.word.toLowerCase()

  return (
    <section className="rounded-3xl border border-brand/25 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
        Exact Dictionary Match
      </p>

      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-ink">
            {result.word}
          </h3>

          <p className="mt-2 max-w-3xl leading-7 text-gray-600">
            {result.definition ||
              'Open the dictionary page for definitions and complete word details.'}
          </p>

          <p className="mt-3 text-sm font-bold text-gray-500">
            {result.length} letters · Scrabble {result.score} · WWF {result.wwfScore}
          </p>
        </div>

        <Link
          href={`/word/${encodeURIComponent(
            normalizedWord
          )}`}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-brand px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          View Dictionary Entry
        </Link>
      </div>
    </section>
  )
}

'''
if marker not in text:
    print("Could not locate FilterInput insertion marker.", file=sys.stderr)
    sys.exit(1)
text = text.replace(marker, "\n" + component + "function FilterInput({", 1)

path.write_text(text)

package_path = Path("package.json")
package = json.loads(package_path.read_text())
scripts = package.setdefault("scripts", {})
scripts["patch:001"] = "bash patches/patch-001-search.sh"
package_path.write_text(json.dumps(package, indent=2) + "\n")
PY

mkdir -p patches
cp "$0" patches/patch-001-search.sh
chmod +x patches/patch-001-search.sh

echo
echo "Running TypeScript/Next.js production build..."
npm run build

echo
echo "Running ESLint..."
npm run lint

echo
echo "Verifying generated changes..."
grep -q "ExactDictionaryMatch" components/Unscrambler.tsx || fail "ExactDictionaryMatch was not installed."
grep -q "exactNavigationEnabled" components/Unscrambler.tsx || fail "Exact navigation logic was not installed."
node -e '
const p=require("./package.json");
if (p.scripts["patch:001"] !== "bash patches/patch-001-search.sh") process.exit(1);
' || fail "package.json script verification failed."

echo
echo "=================================================="
echo "PATCH 001 COMPLETE"
echo "=================================================="
echo
echo "Behavior installed:"
echo "  • /word-finder + exact word: opens /word/<word>"
echo "  • anagram/Scrabble/Wordle tools: retain result lists"
echo "  • dedicated tools show an Exact Dictionary Match card"
echo "  • wildcard and filtered searches never auto-redirect"
echo
echo "Backup:"
echo "  $BACKUP_DIR"
echo
echo "Changed files:"
git status --short
echo
echo "Review locally:"
echo "  npm run dev"
echo
echo "Recommended commit:"
echo '  git add components/Unscrambler.tsx package.json patches/patch-001-search.sh'
echo '  git commit -m "feat: add exact dictionary search routing"'
