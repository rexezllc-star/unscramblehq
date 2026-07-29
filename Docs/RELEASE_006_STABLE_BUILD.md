# Release 006 — Stable Build Pipeline

This release fixes the ESLint heap exhaustion seen when `eslint .` traversed the
entire repository, including large generated dictionary and runtime data.

## Changes

- Linting is restricted to application source directories.
- ESLint runs with a 4 GB Node heap.
- Generated data, build output, caches, and public assets are ignored.
- `/api/health` provides a non-cached deployment marker.
- `release:build` performs verification, type checking, strict linting, and the
  production Next.js build.
- `verify-live-release-006.sh` confirms the deployed release, AdSense loader,
  and `ads.txt`.

## Coolify build command

Use the normal Dockerfile build. Optionally define:

`NEXT_PUBLIC_BUILD_SHA=${SOURCE_COMMIT}`

or set an equivalent Git commit environment variable supported by the
deployment environment.

## Production verification

```bash
bash scripts/verify-live-release-006.sh
```
