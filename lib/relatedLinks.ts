import { SeoRelatedLink } from "@/components/seo/SeoWordPage"

export type RelatedLinkOptions = {
  type: "length" | "startsWith" | "endsWith" | "contains"
  value: string | number
}

export function buildRelatedLinks(
  options: RelatedLinkOptions
): SeoRelatedLink[] {
  const links: SeoRelatedLink[] = []

  switch (options.type) {
    case "length": {
      const length = Number(options.value)

      if (length > 2) {
        links.push({
          title: `${length - 1} Letter Words`,
          href: `/${length - 1}-letter-words`,
        })
      }

      if (length < 15) {
        links.push({
          title: `${length + 1} Letter Words`,
          href: `/${length + 1}-letter-words`,
        })
      }

      links.push({
        title: "Words Starting With A",
        href: "/words-starting-with-a",
      })

      links.push({
        title: "Words Ending In ING",
        href: "/words-ending-in-ing",
      })

      break
    }

    case "startsWith": {
      const prefix = String(options.value).toLowerCase()

      links.push({
        title: "5 Letter Words",
        href: "/5-letter-words",
      })

      links.push({
        title: `Words Containing ${prefix.toUpperCase()}`,
        href: `/words-containing-${prefix}`,
      })

      links.push({
        title: `Words Ending In ${prefix.toUpperCase()}`,
        href: `/words-ending-in-${prefix}`,
      })

      break
    }

    case "endsWith": {
      const suffix = String(options.value).toLowerCase()

      links.push({
        title: "5 Letter Words",
        href: "/5-letter-words",
      })

      links.push({
        title: `Words Containing ${suffix.toUpperCase()}`,
        href: `/words-containing-${suffix}`,
      })

      links.push({
        title: `Words Starting With ${suffix[0]?.toUpperCase() ?? ""}`,
        href: `/words-starting-with-${suffix[0] ?? ""}`,
      })

      break
    }

    case "contains": {
      const value = String(options.value).toLowerCase()

      links.push({
        title: "5 Letter Words",
        href: "/5-letter-words",
      })

      links.push({
        title: `Words Starting With ${value[0]?.toUpperCase() ?? ""}`,
        href: `/words-starting-with-${value[0] ?? ""}`,
      })

      links.push({
        title: `Words Ending In ${value.toUpperCase()}`,
        href: `/words-ending-in-${value}`,
      })

      break
    }
  }

  return links
}