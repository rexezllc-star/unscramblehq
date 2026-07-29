# Release 007 — Lint and Deployment Completion

## Engineering outcome

- Prevents ESLint from traversing generated dictionary and public assets.
- Allocates a bounded 4 GB heap to ESLint.
- Preserves React effect-based URL restoration and asynchronous search
  synchronization by documenting and disabling the experimental
  `react-hooks/set-state-in-effect` rule.
- Keeps unused code visible as warnings while preventing non-functional cleanup
  from blocking a production deployment.
- Adds an explicit live verifier that distinguishes a stale Coolify deployment
  from an application failure.
- Adds a server repository refresh helper.

## Local release gate

```bash
npm run release:build
```

## Deployment

Push the successful build to `main`, then select **Redeploy** in Coolify. Do not
create a second manually exposed application container while Coolify owns ports
80 and 443 through Traefik.

## Live gate

```bash
bash scripts/verify-live-release-007.sh
```
