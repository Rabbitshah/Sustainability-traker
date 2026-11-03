# Baseline bug list (Day 2)

Source: `backend/scripts/smoke_api.py` (24/39 checks pass on the untouched code) plus a code read.
Frontend: `npm run build` and `npm run lint` both pass.
Re-run the script after every fix. Goal: 39/39.

## Security
| ID | Sev | Problem | Evidence | Fix |
|---|---|---|---|---|
| S1 | Critical | A user can PATCH `company` to another user's company id. Records move into, or are planted in, the victim's data. | smoke: "cannot move record" FAIL. Serializer uses `fields = '__all__'`. | D8 (FIXED, 31/39) |
| S2 | High | Every endpoint is open to anonymous users (`IsAuthenticatedOrReadOnly`). `ai_advice` with no company aggregates **all users'** records. | smoke: 3 anon checks FAIL. `utils.py`: `EmissionRecord.objects.all()` when company is None. | D8 (FIXED, 31/39) |
| S3 | High | Weak passwords accepted (`"1"`). Django validators are not called in `RegisterSerializer`. | smoke FAIL | D10 |
| S4 | High | `DEBUG=True` by default (404 page leaks URLconf). CORS allows any origin. `ALLOWED_HOSTS=*`. `SECRET_KEY` has a fallback. | smoke: DEBUG and CORS FAIL | D5 (FIXED, 26/39) |
| S5 | Med | Upload accepts any file. `file_type` is chosen by the client. | smoke: `.exe` accepted | D13 |
| S6 | Med | `forgot-password` sends nothing. Fake feature. | code read | D15 |
| S7 | Low | Two login routes (`/auth/login/`, `/accounts/login/`). Register reveals which emails exist. | code read | D8/D10 |

## Data correctness
| ID | Sev | Problem | Evidence | Fix |
|---|---|---|---|---|
| C1 | High | UI sends `Energy` and `Food`. Backend has no factor for them, so the fallback is **1.0 kg per unit**. The UI preview shows 0.82 and 0.6. Saved numbers differ from what the user saw. Energy is also saved with unit `kg`. | `Logs.tsx` `categoryToBackend` vs `conversions.py` FACTORS. Verify in the UI pass. | D9 |
| C2 | High | Editing a record does not recalculate `co2e_impact`. Client can set `co2e_impact` directly. | smoke: 2 FAIL | D9/D10 |
| C3 | Med | No validation: negative values, future dates, unknown categories, unit not matching category. | smoke: 4 FAIL | D10 |
| C4 | Med | Bad CSV returns 201 and fails silently (exception caught, printed, `return False`). No status field. No per-row validation. | smoke FAIL; `tasks.py` | D13 |
| C5 | Low | `ai_advice` divides last month by 30 for every month. | `utils.py` | D18 |

## Infra
| ID | Sev | Problem | Fix |
|---|---|---|---|
| I1 | Med | `ssl_require=True` forces SSL for any `DATABASE_URL`. Breaks local Postgres. | D6 |
| I2 | Med | Docker runs `runserver` with code mounted as a volume. No Postgres, no healthchecks. | D6/D23 |
| I3 | Low | Dependencies unpinned except Django. Builds are not reproducible. | D6 |
| I4 | Low | No default permission class, no pagination, no throttling in DRF settings. | D8 (permission part FIXED; pagination and throttling still open, not planned) |

## Frontend
| ID | Sev | Problem | Fix |
|---|---|---|---|
| F1 | Med | Route guard checks a `localStorage` flag (`isAuthenticated`), not token validity. | D16 |
| F2 | Med | Fake pages: Community, Notifications, Goals, SetGoals (saves to localStorage only). | D15 |
| F3 | Low | Login failure uses `alert()`. | D17 |

## Docs
- `Commands` says `cd frontend`. The folder is `sustainability-frontend`.
- The `.docx` files and `project_overview.md` describe features that do not exist.

## UI pass (manual, to fill in)
| Flow | Result |
|---|---|
| Signup | |
| Login / logout | |
| Log Travel / Energy / Food / Waste (compare saved value with preview) | |
| Dashboard numbers update after logging | |
| Reports: filters, CSV export, PDF download | |
| Settings loads | |
| Expired token behaviour | |
