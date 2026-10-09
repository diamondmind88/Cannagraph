#!/usr/bin/env python3
"""CannaGraph Gemini Deep Research pilot. Standard library only; no DB writes."""
import argparse
import json
import os
import pathlib
import time
import urllib.error
import urllib.request
import uuid
import sys

BASE = "https://generativelanguage.googleapis.com/v1beta/interactions"
AGENT = os.getenv("GEMINI_RESEARCH_AGENT", "deep-research-preview-04-2026")
CULTIVARS = [
    "Original Diesel", "East Coast Sour Diesel", "Albany Sour Diesel",
    "Giesel", "Superdawg", "Snowdog", "Chem 91", "Chem D", "Chem 4",
    "56 Day Headband",
]
PROMPT = """Research the following CannaGraph cultivars: {names}.
For each: investigate aliases, provenance, parentage, earliest dated references,
breeders/keepers, timeline, phenotype, cultural and commercial influence.
Preserve competing identity and lineage hypotheses; never silently merge names.
Distinguish contemporary primary evidence, attributed participant testimony,
secondary reporting, anecdote and unsupported assertions.
Cite every substantive claim with source title, URL, date if known, and claim ID.
Do not invent citations. Explicitly label inaccessible sources and unresolved
claims. Return a complete research report with source bibliography and a
machine-readable JSON section with top-level keys: schema_version, cultivars,
sources, claims, unresolved_questions. Each claim includes source_ids and
verification_status. Mark incomplete work instead of claiming completion."""

def request(method, url, key, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method=method, headers={
        "x-goog-api-key": key, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.load(resp)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--live", action="store_true", help="Make potentially billable API calls")
    p.add_argument("--poll", action="store_true", help="Poll until completed")
    p.add_argument("--max-polls", type=int, default=40)
    p.add_argument("--interval", type=int, default=30)
    p.add_argument("--output", default="research-output")
    args = p.parse_args()
    if args.max_polls < 1 or args.interval < 1:
        p.error("max-polls and interval must be positive")
    out = pathlib.Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    batches = [CULTIVARS[:5], CULTIVARS[5:]]
    manifest = {"schema_version": "1.0", "mode": "live" if args.live else "dry_run",
                "agent": AGENT, "jobs": []}
    key = os.getenv("GEMINI_API_KEY") if args.live else None
    if args.live and not key:
        p.error("GEMINI_API_KEY must be set for live calls")
    had_error = False
    for names in batches:
        job = {"local_id": str(uuid.uuid4()), "cultivars": names,
               "status": "planned", "prompt": PROMPT.format(names=", ".join(names))}
        manifest["jobs"].append(job)
        if not args.live:
            continue
        try:
            response = request("POST", BASE, key, {
                "agent": AGENT, "input": job["prompt"], "background": True})
            job["interaction_id"] = response.get("id")
            job["status"] = response.get("status", "submitted")
            if not job["interaction_id"]:
                had_error = True
                job["error"] = "No interaction ID returned"
                job["response"] = response
                continue
            if args.poll:
                for _ in range(args.max_polls):
                    response = request("GET", BASE + "/" + job["interaction_id"], key)
                    job["status"] = response.get("status", "unknown")
                    if job["status"] in ("completed", "failed", "cancelled"):
                        break
                    time.sleep(args.interval)
                else:
                    job["status"] = "poll_timeout"
            if job["status"] in ("failed", "cancelled", "poll_timeout"):
                had_error = True
            if job["status"] == "completed":
                steps = response.get("steps", [])
                text = "\n\n".join(c.get("text", "") for step in steps[-1:] for c in step.get("content", []) if c.get("type") == "text")
                if not text.strip():
                    job["error"] = "Completed job has no report text"
                    had_error = True
                else:
                    (out / (job["local_id"] + ".md")).write_text(text, encoding="utf-8")
            (out / (job["local_id"] + ".json")).write_text(
                json.dumps(response, indent=2), encoding="utf-8")
        except (urllib.error.URLError, ValueError, OSError) as exc:
            had_error = True
            job["status"] = "error"
            job["error"] = str(exc)
        finally:
            (out / "manifest.json").write_text(
                json.dumps(manifest, indent=2), encoding="utf-8")
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({"mode": manifest["mode"],
                      "jobs": [{k: v for k, v in j.items() if k in
                                ("local_id", "cultivars", "status", "interaction_id", "error")}
                               for j in manifest["jobs"]]}, indent=2))
    if had_error:
        sys.exit(1)

if __name__ == "__main__":
    main()
