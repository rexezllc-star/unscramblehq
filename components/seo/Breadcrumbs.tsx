import Link from 'next/link'

type BreadcrumbItem = {
  title: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}

            {item.href ? (
              <Link href={item.href} className="font-semibold hover:text-blue-700">
                {item.title}
              </Link>
            ) : (
              <span className="font-semibold text-slate-700">{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}