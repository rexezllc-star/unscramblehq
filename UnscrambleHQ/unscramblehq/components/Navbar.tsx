import Link from 'next/link'

const links = [
  ['Word Unscrambler', '/'],
  ['Anagram Solver', '/anagram-solver'],
  ['Word Finder', '/word-finder'],
  ['Wordle Helper', '/wordle-helper']
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand text-white">U</span>
          <span>UnscrambleHQ</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-brand">{label}</Link>)}
        </nav>
      </div>
    </header>
  )
}
