# EcoTracker hardening plan (agreed 2026-11-03)

Goal: resume-ready personal carbon tracker. Live, tested, secure, documented. No deadline; finish ASAP. ~1 hr/day, 6 build days + 1 buffer day per week. Jarvis (separate project) has priority; this project must never depend on it.

## STATUS (update after every day)
| Day | State | Note |
|---|---|---|
| D1 | DONE | Docker up on Mac. API :8000 OK, Celery ready. |
| D2 | DONE except UI pass | `backend/scripts/smoke_api.py` = 24/39 in Docker. Baseline in `docs/bugs.md`. UI table in bugs.md still empty (user fills). |
| D3 | DONE | Commit 510378b. `git ls-files` shows no secrets. |
| D4 | DONE | Purged tokens.txt, db.sqlite3, media/, __pycache__ via git filter-repo; force-pushed main, pushed hardening. Fresh GitHub clone has none. Backup: ~/Projects/Sustainability-traker-backup-2026-11-03 (still holds secrets; delete after D5). Secrets were exposed: rotate on D5. |
| D5 | DONE | Env-only settings; boot refuses without 32+ char DJANGO_SECRET_KEY; DEBUG/CORS/ALLOWED_HOSTS safe defaults; new local key in gitignored backend/.env (old JWTs invalid). Smoke 26/39 (S4 fixed). Prod key must be set on the host at deploy (D24). |
| D6 | DONE | Postgres 16 service + pg_data volume; DATABASE_SSL_REQUIRE env (default False); direct deps pinned to versions in the image. Clean clone: migrate OK, register 201, vendor=postgresql, smoke 26/39. Local sqlite data not migrated. |
| D7 | SKIPPED | Buffer day not used. Week-1 summary written. User's UI pass still empty. Frontend build + lint re-checked: pass. |
| D8 | DONE | IsAuthenticated default, per-view overrides removed, company/co2e_impact/owner read-only, ai_advice never falls back to all users. Smoke 31/39 (S1, S2 fixed; I4 permission part fixed). |
| D9 | NEXT | Single category/unit/factor source, drop 1.0 fallback, recalc on update (C1, C2). Factor sources: user looks up. |
| D10+ | TODO | |

## Decisions
- Audience: individuals. Keep `Company` model internally, no rename.
- Hardening rank: secrets > auth > tests > validation > Postgres+Docker > CI > deploy > docs. No perf work.
- AI: `ai_advice` already exists as rule-based on real data. Recommendation: skip LLM. Decide at D18. Never claim "ML".
- Delete fake features: Community, Notifications, Goals, SetGoals, Settings 2FA/privacy, forgot-password (fake).
- Stack stays: Django/DRF/SimpleJWT, Celery+Redis, React/Vite/TS/Tailwind. No Redux/TanStack Query.

## NOT doing
Community/leaderboards, notifications, goals, 2FA, AI chat, RAG, model training, PDF bill parsing (cut first), perf tuning, mobile, i18n, Company rename.

## Plan
Week 1 Safe and running
- D1 Docker up. DONE.
- D2 Manual end-to-end pass, docs/bugs.md.
- D3 Untrack secrets/db/uploads. DONE.
- D4 Purge from history (git filter-repo or BFG), force-push, fresh-clone check. Done when `git log --all -- backend/tokens.txt` is empty.
- D5 Env-only settings, new SECRET_KEY, .env.example. Done when prod mode refuses to boot without secret. Also DEBUG default False, ALLOWED_HOSTS and CORS from env (bugs S4).
- D6 Postgres in compose + volume, fix `ssl_require`, pin dependencies. Done when a clean clone migrates + registers on Postgres.
- D7 Buffer + checkpoint + 5-line summary.

Week 2 Correct and tested
- D8 IsAuthenticated default + per-user querysets; company/co2e_impact read-only in serializer (S1, S2, I4). Done: smoke anon checks + move-record check pass.
- D9 Single category/unit/factor source of truth (shared with frontend), drop 1.0 fallback, add Food, recalc co2e on update (C1, C2). Factor sources: user verifies. Done: unknown category 400.
- D10 Validation + error format + password validators (S3, C3). Done: bad payloads 400 with field messages.
- D11 Tests 1: calc + auth/isolation. Done: >=10 pass.
- D12 Tests 2: CRUD, KPIs, register. Done: >=20 pass.
- D13 CSV upload: type/size checks, visible failure state (S5, C4). Done: sample CSV makes N records, bad file rejected.
- D14 Buffer + checkpoint + summary.

Week 3 Real frontend
- D15 Delete fake pages/routes, trim Settings (F2, S6). Done: build passes, no dead links.
- D16 Frontend auth: refresh/redirect, logout, real route guard (F1). Done: expired token never blank screen.
- D17 Loading/error/empty states (F3). Done: backend killed -> friendly error.
- D18 DECISION: LLM or not. If not: fix C5, label advice as rule-based.
- D19 (only if LLM) wiring, timeout, daily cache, fallback.
- D20 AIInsights page reads endpoint, no hardcoded data, no fake chat.
- D21 Buffer + deploy go/no-go + summary.

Week 4 Ship
- D22 GitHub Actions: backend tests + frontend lint/build green.
- D23 Prod containers (gunicorn, built frontend).
- D24 Deploy backend + Postgres (verify free tiers first, do not trust memory).
- D25 Deploy frontend, CORS, demo user. Done: live register->log->dashboard.
- D26 README + screenshots/GIF + architecture diagram.
- D27 Repo polish, smoke test, tag v1.0, resume bullets.
- D28 Buffer + final summary.

## Cut rules
- End W1: if D1-5 not done, move Postgres to deploy week.
- End W2: if <20 tests or no isolation, cut D13 upload.
- End W3: if AI not working, ship rule-based advice labeled as such.
- End W4: live URL or nothing. Never cut: secrets, auth, tests, deploy.
- Jarvis rule: skipped day shifts everything; never squeeze. Two missed days in a week triggers that week's cut.

## README outline
Title+demo+GIF; what it does; architecture diagram; stack table; run locally (one compose up); API table; emission factors + sources; AI feature if built; tests+CI badge; security notes; known limits.

## Resume bullets (fill brackets with real numbers only)
- Built full-stack carbon tracker (React, TS, Django REST, PostgreSQL, Docker): JWT auth, per-user isolation, KPI dashboards, CSV/PDF reports. Deployed live.
- Wrote [N] automated tests + GitHub Actions CI. Removed committed secrets from git history, moved config to env vars, replaced open permissions with authenticated access.
- (If LLM built) LLM advice from 30-day emission summaries with rule-based fallback, caching, rate limiting.
