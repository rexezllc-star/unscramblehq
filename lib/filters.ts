export type WordFilter = {
  length?: number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  include?: string[];
  exclude?: string[];
  pattern?: string;
};

function normalize(value?: string) {
  return value?.trim().toLowerCase();
}

function matchesPattern(word: string, pattern: string) {
  const regex = new RegExp(
    "^" +
      pattern
        .toLowerCase()
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\?/g, ".")
        .replace(/\*/g, ".*") +
      "$"
  );

  return regex.test(word);
}

export function filterWords(words: string[], filter: WordFilter = {}) {
  const startsWith = normalize(filter.startsWith);
  const endsWith = normalize(filter.endsWith);
  const contains = normalize(filter.contains);
  const pattern = normalize(filter.pattern);

  const include = filter.include?.map((l) => l.toLowerCase()) ?? [];
  const exclude = filter.exclude?.map((l) => l.toLowerCase()) ?? [];

  return words
    .map((word) => word.toLowerCase())
    .filter((word) => {
      if (filter.length && word.length !== filter.length) return false;
      if (startsWith && !word.startsWith(startsWith)) return false;
      if (endsWith && !word.endsWith(endsWith)) return false;
      if (contains && !word.includes(contains)) return false;
      if (pattern && !matchesPattern(word, pattern)) return false;

      for (const letter of include) {
        if (!word.includes(letter)) return false;
      }

      for (const letter of exclude) {
        if (word.includes(letter)) return false;
      }

      return true;
    })
    .sort((a, b) => a.localeCompare(b));
}