# AdSense production confirmation

Publisher: `ca-pub-3618932262167305`

The AdSense Auto Ads preview recognized `unscramblehq.com`, Auto Ads was enabled, and Google rendered eligible preview placements. Patch 004 makes the production integration independent of a missing Coolify environment variable by retaining `NEXT_PUBLIC_ADSENSE_CLIENT` support while falling back to the confirmed publisher ID.

Implemented:

- AdSense loader mounted globally from `app/layout.tsx`
- Google publisher verification meta tag
- Authorized `/ads.txt` response
- Static verification command: `npm run adsense:verify`

Account-side requirement: publish the configuration with **Apply to site** and confirm the site status is **Ready** in AdSense. Code deployment cannot override an account still under review, disabled Auto Ads, browser ad blocking, or unavailable ad inventory.
