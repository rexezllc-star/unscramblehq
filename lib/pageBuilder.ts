import { filterWords } from "@/lib/filters"
import { getDictionary } from "@/lib/dictionary"
import { createSeoPageDefinition } from "@/lib/seo"
import { buildRelatedLinks } from "@/lib/relatedLinks"

export type PageBuilderOptions = {
  type: "length" | "startsWith" | "endsWith" | "contains"
  value: string | number
}

export function buildSeoPage(options: PageBuilderOptions) {
  const words = getDictionary()

  let filtered: string[] = []

  switch (options.type) {
    case "length":
      filtered = filterWords(words, {
        length: Number(options.value),
      })
      break

    case "startsWith":
      filtered = filterWords(words, {
        startsWith: String(options.value),
      })
      break

    case "endsWith":
      filtered = filterWords(words, {
        endsWith: String(options.value),
      })
      break

    case "contains":
      filtered = filterWords(words, {
        contains: String(options.value),
      })
      break
  }

  const seo = createSeoPageDefinition(options.type, options.value)

  return {
    ...seo,
    words: filtered,
    total: filtered.length,
    relatedLinks: buildRelatedLinks(options),
  }
}