# Multi-Modal Navigation Assistant

This repository contains a Next.js web app and a companion browser extension that provides an AI-powered assistant for navigating web pages using visual cues, form help, and voice commands.

## Quickstart (local)

1. Copy environment example:

```bash
cp .env.example .env
# Fill in the required keys in .env
```

2. Install and run the dev server:

```bash
npm install
npm run dev
```

3. Open http://localhost:3000 to view the web app.

## Environment Variables

Required variables are listed in `.env.example`. At minimum provide:

- `GOOGLE_AI_API_KEY` — server-side key for the AI provider.
- `SERVICE_API_KEY` — secure API key for authenticating requests to your API endpoints. Generate a strong random string.
- Optional: `NEXT_PUBLIC_GOOGLE_AI_API_KEY` (avoid exposing secrets to client when possible).

For production deployments, also configure:

- `REDIS_URL` — Redis connection URL for rate limiting (default: redis://localhost:6379)
- `REDIS_PASSWORD` — Redis auth password (if required)
- `REDIS_TLS_ENABLED` — Enable TLS for Redis connection (default: false)

Metrics and monitoring configuration:

- `DD_ENABLED` — Enable Datadog metrics integration (default: false)
- `DD_ENV` — Datadog environment tag (e.g., production, staging)
- `DD_SERVICE` — Datadog service name tag
- `COST_ALERT_THRESHOLD` — Daily cost alert threshold in USD (default: $50.00)

Prometheus metrics are automatically exposed at the `/metrics` endpoint. Common metrics include:
- `api_requests_total` - Request count by endpoint and status
- `api_request_duration_seconds` - Request latency histograms
- `ai_request_cost_dollars` - AI API cost tracking by model

## Project layout

- `src/app` - Next.js App Router + API routes
- `src/components` - React UI components
- `src/lib` - helper libraries (AI client, translation, voice, analyzer)
- `extension` - browser extension manifest, content script, and background script

## CI

A basic GitHub Actions workflow is included to run TypeScript checks on PRs and pushes (see `.github/workflows/tsc-check.yml`).

## Audit

An automated code audit was generated at `codebase_audit_report.md` — review it for findings and recommended fixes.
