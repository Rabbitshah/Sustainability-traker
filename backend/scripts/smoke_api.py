"""API smoke test (stdlib only).

Run from the repo root while `docker compose up` is running:
    docker compose exec backend python scripts/smoke_api.py

Each check prints PASS or FAIL. A FAIL means a bug or security hole.
It creates throwaway users/records (smoke_*@example.com) in the dev DB.
"""
import json
import sys
import time
import urllib.error
import urllib.request
import uuid
from datetime import date

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
results = []


def call(method, path, body=None, token=None, headers=None, raw=None):
    h = dict(headers or {})
    data = None
    if raw is not None:
        data = raw
    elif body is not None:
        data = json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    if token:
        h["Authorization"] = "Bearer " + token
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read(), r.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read(), e.headers
    except Exception as e:  # connection problems etc.
        return 0, str(e).encode(), {}


def jget(text):
    try:
        return json.loads(text)
    except Exception:
        return None


def check(name, ok, detail=""):
    results.append(bool(ok))
    print(("PASS  " if ok else "FAIL  ") + name + ("" if ok or detail == "" else f"   -> {detail}"))


def note(msg):
    print("NOTE  " + msg)


def multipart(fields, fname, content, ctype="text/csv"):
    b = "----smoke" + uuid.uuid4().hex
    out = []
    for k, v in fields.items():
        out.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    out.append(
        f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="{fname}"\r\n'
        f"Content-Type: {ctype}\r\n\r\n".encode() + content + b"\r\n"
    )
    out.append(f"--{b}--\r\n".encode())
    return b"".join(out), {"Content-Type": "multipart/form-data; boundary=" + b}


def count(token):
    s, t, _ = call("GET", "/api/emissions/", token=token)
    data = jget(t)
    if isinstance(data, dict):
        data = data.get("results", [])
    return len(data) if isinstance(data, list) else -1


run = uuid.uuid4().hex[:8]
pw = "Smoke-Test-pass-123"
ea, eb, ew = (f"smoke_{x}_{run}@example.com" for x in ("a", "b", "weak"))
today = date.today().isoformat()

# ---------- basics + auth ----------
s, t, _ = call("GET", "/api/health/")
check("health returns 200", s == 200, s)
if s == 0:
    print("Cannot reach API:", t.decode())
    sys.exit(1)

s, t, _ = call("POST", "/api/accounts/register/", {"email": ea, "password": pw})
A = jget(t) or {}
check("register user A -> 201 + tokens", s == 201 and "access" in A, f"{s} {t[:150]!r}")
s, t, _ = call("POST", "/api/accounts/register/", {"email": eb, "password": pw})
B = jget(t) or {}
check("register user B -> 201 + tokens", s == 201 and "access" in B, f"{s} {t[:150]!r}")
tokA, tokB = A.get("access"), B.get("access")
if not tokA or not tokB:
    print("Cannot continue without both users.")
    sys.exit(1)

s, _, _ = call("POST", "/api/accounts/register/", {"email": ea, "password": pw})
check("duplicate email rejected (400)", s == 400, s)
s, t, _ = call("POST", "/api/accounts/register/", {"email": ew, "password": "1"})
check("weak password '1' rejected (400)", s == 400, f"got {s}: password validators not applied")
s, t, _ = call("POST", "/api/auth/login/", {"username": ea, "password": pw})
L = jget(t) or {}
check("login (username=email) -> 200 + tokens", s == 200 and "refresh" in L, f"{s} {t[:150]!r}")
s, _, _ = call("POST", "/api/auth/login/", {"username": ea, "password": "wrong"})
check("wrong password -> 401", s == 401, s)
s, t, _ = call("POST", "/api/auth/refresh/", {"refresh": L.get("refresh", "")})
check("token refresh -> 200", s == 200 and "access" in (jget(t) or {}), s)

# ---------- unauthenticated access ----------
s, _, _ = call("GET", "/api/emissions/")
check("anon GET /emissions/ -> 401", s == 401, f"got {s}")
s, _, _ = call("GET", "/api/kpis/total/")
check("anon GET /kpis/total/ -> 401", s == 401, f"got {s}")
s, t, _ = call("GET", "/api/kpis/ai_advice/")
check("anon GET /kpis/ai_advice/ -> 401", s == 401, f"got {s}; body={t[:120]!r}")

# ---------- emissions CRUD + validation ----------
s, t, _ = call("POST", "/api/emissions/", {"date": today, "category": "energy", "value": "100", "unit": "kWh"}, tokA)
rec = jget(t) or {}
check("create energy 100 kWh -> 201", s == 201, f"{s} {t[:200]!r}")
try:
    check("co2e for 100 kWh == 82", float(rec.get("co2e_impact", -1)) == 82.0, rec.get("co2e_impact"))
except Exception:
    check("co2e for 100 kWh == 82", False, rec)
rid = rec.get("id")

bad = [
    ("unknown category rejected", {"date": today, "category": "banana", "value": "5", "unit": "x"}),
    ("negative value rejected", {"date": today, "category": "energy", "value": "-5", "unit": "kWh"}),
    ("future date rejected", {"date": "2099-01-01", "category": "energy", "value": "5", "unit": "kWh"}),
    ("unit must match category (energy in L)", {"date": today, "category": "energy", "value": "5", "unit": "L"}),
    ("empty body rejected", {}),
]
for name, payload in bad:
    s, t, _ = call("POST", "/api/emissions/", payload, tokA)
    check(name + " (400)", s == 400, f"got {s}")

n = count(tokA)
check("A can list own records", n >= 1, n)

# ---------- isolation between users ----------
check("B sees none of A's records", count(tokB) == 0, f"B sees {count(tokB)}")
if rid:
    s, _, _ = call("GET", f"/api/emissions/{rid}/", token=tokB)
    check("B GET A's record -> 404", s == 404, s)
    s, _, _ = call("PATCH", f"/api/emissions/{rid}/", {"value": "1"}, tokB)
    check("B PATCH A's record -> 404", s == 404, s)
    s, _, _ = call("DELETE", f"/api/emissions/{rid}/", token=tokB)
    check("B DELETE A's record -> 404", s == 404, s)

    # ---------- update behaviour ----------
    s, t, _ = call("PATCH", f"/api/emissions/{rid}/", {"value": "200"}, tokA)
    r2 = jget(t) or {}
    try:
        ok = float(r2.get("co2e_impact", -1)) == 164.0
    except Exception:
        ok = False
    check("PATCH value=200 recalculates co2e (164)", ok, f"co2e={r2.get('co2e_impact')}")
    s, t, _ = call("PATCH", f"/api/emissions/{rid}/", {"co2e_impact": "0"}, tokA)
    s2, t2, _ = call("GET", f"/api/emissions/{rid}/", token=tokA)
    try:
        ok = float((jget(t2) or {}).get("co2e_impact", 0)) != 0.0
    except Exception:
        ok = False
    check("client cannot overwrite co2e_impact", ok, f"co2e now {(jget(t2) or {}).get('co2e_impact')}")
    b_company = (B.get("user") or {}).get("company_id")
    s, t, _ = call("PATCH", f"/api/emissions/{rid}/", {"company": b_company}, tokA)
    check("client cannot move record to another user's company", count(tokB) == 0, f"B now sees {count(tokB)}")

# ---------- KPIs + report ----------
for p in ("total", "category", "monthly", "ai_advice"):
    s, t, _ = call("GET", f"/api/kpis/{p}/", token=tokA)
    check(f"A GET /kpis/{p}/ -> 200", s == 200, f"{s} {t[:120]!r}")
s, t, _ = call("GET", "/api/kpis/download_report/", token=tokA)
check("PDF report -> 200 + %PDF", s == 200 and t[:4] == b"%PDF", f"{s} {t[:60]!r}")

# ---------- CSV upload ----------
before = count(tokA)
good = f"date,category,value,unit\n{today},energy,10,kWh\n{today},fuel,2,L\n".encode()
body, hd = multipart({"file_type": "csv"}, "good.csv", good)
s, t, _ = call("POST", "/api/files/", token=tokA, headers=hd, raw=body)
check("upload good CSV -> 201", s == 201, f"{s} {t[:200]!r}")
added = 0
for _ in range(15):
    added = count(tokA) - before
    if added >= 2:
        break
    time.sleep(1)
check("good CSV creates 2 records (worker ran)", added == 2, f"added {added}")

before = count(tokA)
badcsv = b"foo,bar\n1,2\n"
body, hd = multipart({"file_type": "csv"}, "bad.csv", badcsv)
s, t, _ = call("POST", "/api/files/", token=tokA, headers=hd, raw=body)
resp = jget(t) or {}
visible = s in (400, 422) or any(k in resp for k in ("status", "error", "processing_status"))
check("bad CSV rejected or failure visible to user", visible, f"{s} keys={list(resp)[:8]}")
time.sleep(2)
check("bad CSV adds no records", count(tokA) == before, f"added {count(tokA) - before}")

body, hd = multipart({"file_type": "csv"}, "evil.exe", b"MZ\x90\x00", "application/octet-stream")
s, t, _ = call("POST", "/api/files/", token=tokA, headers=hd, raw=body)
check("non-csv/pdf extension rejected (400)", s == 400, f"got {s}")

# ---------- misc config / security ----------
s, t, _ = call("POST", "/api/accounts/forgot-password/", {"email": ea})
check("forgot-password responds 200", s == 200, s)
note("forgot-password only checks the email exists; it sends nothing. Fake feature.")
s, t, _ = call("GET", "/api/this-route-does-not-exist/")
check("DEBUG off (404 page does not leak URLconf)", b"URLconf" not in t, "debug 404 page is visible")
s, t, h = call("GET", "/api/health/", headers={"Origin": "http://evil.example"})
allow = h.get("Access-Control-Allow-Origin") if h else None
check("CORS blocks unknown origin", allow in (None, ""), f"Access-Control-Allow-Origin={allow}")

ok = sum(results)
print(f"\n{ok}/{len(results)} checks passed, {len(results) - ok} failed")
