# Install UnscrambleHQ v0.4.1

1. Copy the folders in this package into the project root:

/Users/afolabiaromiwura/Documents/GitHub/unscramblehq

2. Merge folders when macOS asks.

3. Update components/Unscrambler.tsx import line:

from:
import { groupByLength, searchWords, type SearchFilters } from '@/lib/dictionary'

to:
import { groupByLength, searchWords, type SearchFilters } from '@/lib/engine'

4. Run:

npm run dev -- --webpack

5. Test search on localhost.

6. Commit:

git add .
git commit -m "feat: add modular word engine"
git push origin homepage-v021
