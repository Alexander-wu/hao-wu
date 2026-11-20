"""Local fallback: refresh only the published citation snapshot via GitHub.

Uses the existing gh login without reading or exposing its credentials. Does not
checkout, edit, or publish the user's working copy. The normal Pages push
workflow deploys the resulting two-file commit.
"""
import argparse
import base64
import json
import subprocess
import sys
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path

from update_citations import fetch_citations, save_citations

GH = "/Users/wuhao/.local/bin/gh"
REPO = "repos/Alexander-wu/hao-wu"
SCHOLAR_ID = "HdXMhfcAAAAJ"
MAX_AGE = timedelta(hours=20)


def github_api(path, method="GET", payload=None):
    command = [GH, "api", f"{REPO}/{path}", "--method", method]
    if payload is not None:
        command += ["--input", "-"]
    result = subprocess.run(
        command, input=json.dumps(payload) if payload is not None else None,
        text=True, capture_output=True, timeout=60,
    )
    if result.returncode:
        # Do not include credential-bearing command/environment details in logs.
        raise RuntimeError(f"GitHub API {method} {path} failed (exit {result.returncode})")
    return json.loads(result.stdout)


def read_remote_file(api, name, commit):
    result = api(f"contents/{name}?ref={commit}")
    if result.get("type") != "file" or result.get("encoding") != "base64":
        raise ValueError(f"Unexpected GitHub file response for {name}")
    encoded = "".join(result["content"].split())
    return base64.b64decode(encoded, validate=True).decode("utf-8")


def snapshot_is_fresh(snapshot, now):
    if snapshot.get("scholar_id") != SCHOLAR_ID:
        raise ValueError("Remote snapshot belongs to a different Scholar profile")
    count = snapshot.get("citations")
    if type(count) is not int or count < 0:
        raise ValueError("Remote snapshot has an invalid citation count")
    try:
        timestamp = datetime.fromisoformat(snapshot["updated_at"].replace("Z", "+00:00"))
        if timestamp.tzinfo is None:
            return False
        age = now - timestamp
        return timedelta(0) <= age < MAX_AGE
    except (KeyError, TypeError, ValueError, AttributeError):
        return False


def sync(*, dry_run=False, api=None, fetch=None, now=None):
    api = api or github_api
    fetch = fetch or fetch_citations
    now = now or datetime.now(timezone.utc)
    head = api("git/ref/heads/main")["object"]["sha"]
    previous = json.loads(read_remote_file(api, "citation-data.json", head))
    fresh = snapshot_is_fresh(previous, now)
    if fresh and not dry_run:
        return {"status": "skipped", "reason": "snapshot is less than 20 hours old",
                "citations": previous["citations"], "updated_at": previous["updated_at"]}

    # Both input files come from one immutable commit; never use a local HTML copy.
    html = read_remote_file(api, "index.html", head)
    count = fetch(SCHOLAR_ID)
    with tempfile.TemporaryDirectory(prefix="hao-wu-citations-") as directory:
        root = Path(directory)
        (root / "index.html").write_text(html, encoding="utf-8")
        save_citations(root, SCHOLAR_ID, count)
        files = {name: (root / name).read_text(encoding="utf-8")
                 for name in ("index.html", "citation-data.json")}

    if dry_run:
        return {"status": "dry-run", "citations": count,
                "previous_citations": previous["citations"], "remote_writes": False}

    if api("git/ref/heads/main")["object"]["sha"] != head:
        raise RuntimeError("Remote main changed during refresh; nothing was published. Retry later.")
    parent = api(f"git/commits/{head}")
    tree = api("git/trees", "POST", {
        "base_tree": parent["tree"]["sha"],
        "tree": [{"path": name, "mode": "100644", "type": "blob", "content": content}
                 for name, content in files.items()],
    })
    commit = api("git/commits", "POST", {
        "message": "Refresh Google Scholar citations from local backup",
        "tree": tree["sha"], "parents": [head],
    })
    if api("git/ref/heads/main")["object"]["sha"] != head:
        raise RuntimeError("Remote main changed before publication; branch left untouched. Retry later.")
    # force=False also rejects a concurrent non-fast-forward change after the check.
    api("git/refs/heads/main", "PATCH", {"sha": commit["sha"], "force": False})
    return {"status": "published", "citations": count,
            "previous_citations": previous["citations"], "commit": commit["sha"],
            "url": commit.get("html_url", f"https://github.com/Alexander-wu/hao-wu/commit/{commit['sha']}")}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true",
                        help="Fetch and validate Scholar data even if fresh, without writing to GitHub")
    args = parser.parse_args()
    try:
        result = sync(dry_run=args.dry_run)
    except Exception as error:
        print(f"Citation backup failed: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
