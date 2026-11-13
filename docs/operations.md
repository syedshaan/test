# Pleadlaw operations guide

## Environment variables (set in Vercel → Settings → Environment Variables)

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Drafting (Google AI Studio key) |
| `GEMINI_MODEL` | Yes | Model ID your key can use, for example `gemini-3.1-flash-lite` |
| `DRAFT_VERIFY` | No | Set to `on` to run the unsupported-facts check (adds about 10–20 s) |
| `OWNER_EMAIL` | Yes | Address that receives consultation requests |
| `RESEND_API_KEY` | Yes | Email sending |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address (see `docs/email-setup.md`) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Recommended | Shared rate limits across servers |
| `TURNSTILE_SECRET_KEY` | Recommended | Server-side bot check (Cloudflare Turnstile) |
| `VITE_TURNSTILE_SITE_KEY` | Recommended | Browser widget key for the same Turnstile site. Set in build-time env |

Turn Turnstile on only after both Turnstile keys are set. With only the secret set, every form submission will fail verification.

## Deploying and rolling back
- Every push to `main` triggers a Vercel deployment. CI (`.github/workflows/ci.yml`) builds the site first.
- To roll back: Vercel → Deployments → choose the last good deployment → **⋯ → Promote to Production**.
- Environment variable changes need **Redeploy** before they take effect.

## Alerts and who gets them
- **Feed failures:** the scheduled job (`update-feeds.yml`) opens a GitHub issue when a run fails. Watch the repository's Issues tab.
- **Drafting and consultation errors:** check Vercel → project → Logs, filter `/api/draft-petition` or `/api/consultation`.
- **Rate limit warning:** a log line `Upstash is not configured` in production means limits are per server only. Set the Upstash variables.

## Routine checks
- Weekly: open the Logs for errors, and check that the most recent feed run succeeded.
- Monthly: check the Gemini and Resend usage dashboards and the remaining quota.
- After any change to legal text, have an advocate review the affected section before publishing.
