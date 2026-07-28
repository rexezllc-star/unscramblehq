# Patch 005 — Production hardening

This patch resolves the issues observed after the AdSense integration commit:

- prevents `.patch-backups/` and TypeScript build-info files from being committed;
- makes TypeScript 6's `baseUrl` deprecation non-blocking;
- migrates linting to the ESLint 9 flat configuration used by the current Next.js toolchain;
- permanently serves the authorized AdSense publisher record from `/ads.txt`;
- adds `/deployment-status` so production can be distinguished from a stale deployment;
- adds repeatable repository verification commands.

Expected production responses after Coolify redeploys the latest `main` commit:

```text
GET /ads.txt
google.com, pub-3618932262167305, DIRECT, f08c47fec0942fa0
```

```json
GET /deployment-status
{
  "application": "unscramblehq",
  "patch": "patch-005-production-hardening",
  "adsensePublisher": "ca-pub-3618932262167305",
  "adsTxtReady": true
}
```
