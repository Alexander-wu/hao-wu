import base64
import json
import unittest
from datetime import datetime, timezone
from unittest.mock import Mock

import sync_citations_github as backup

NOW = datetime(2026, 11, 20, 14, 0, tzinfo=timezone.utc)
HTML = '<p>Keep other content</p><a class="citation-counter" title="old"><strong id="scholar-citation-count">1,700</strong></a>'


class FakeAPI:
    def __init__(self, timestamp="2026-11-18T10:00:00+00:00", heads=None, scholar_id=backup.SCHOLAR_ID):
        self.snapshot = {"scholar_id": scholar_id, "citations": 1700, "updated_at": timestamp}
        self.heads = iter(heads or ["old"] * 3)
        self.calls = []

    def __call__(self, path, method="GET", payload=None):
        self.calls.append((path, method, payload))
        if path == "git/ref/heads/main":
            return {"object": {"sha": next(self.heads)}}
        if path.startswith("contents/"):
            if not path.endswith("?ref=old"):
                raise AssertionError("Must read immutable original commit")
            text = json.dumps(self.snapshot) if "citation-data.json" in path else HTML
            return {"type": "file", "encoding": "base64", "content": base64.b64encode(text.encode()).decode()}
        if path == "git/commits/old":
            return {"tree": {"sha": "original-tree"}}
        if path == "git/trees":
            return {"sha": "new-tree"}
        if path == "git/commits":
            return {"sha": "new-commit"}
        if path == "git/refs/heads/main":
            return {}
        raise AssertionError(path)

    def writes(self):
        return [call for call in self.calls if call[1] != "GET"]


class BackupTests(unittest.TestCase):
    def test_recent_snapshot_skips_fetch_and_writes(self):
        api = FakeAPI(timestamp="2026-11-20T13:00:00+00:00")
        fetch = Mock()
        self.assertEqual(backup.sync(api=api, fetch=fetch, now=NOW)["status"], "skipped")
        fetch.assert_not_called()
        self.assertEqual(api.writes(), [])

    def test_only_two_files_update_from_remote_base(self):
        api = FakeAPI()
        result = backup.sync(api=api, fetch=lambda _: 1841, now=NOW)
        self.assertEqual(result["status"], "published")
        tree = next(payload for path, _, payload in api.calls if path == "git/trees")
        self.assertEqual(tree["base_tree"], "original-tree")
        files = {item["path"]: item["content"] for item in tree["tree"]}
        self.assertEqual(set(files), {"citation-data.json", "index.html"})
        self.assertIn("<p>Keep other content</p>", files["index.html"])
        self.assertIn(">1,841</strong>", files["index.html"])
        self.assertEqual(json.loads(files["citation-data.json"])["citations"], 1841)
        self.assertEqual(api.calls[-1], ("git/refs/heads/main", "PATCH", {"sha": "new-commit", "force": False}))

    def test_branch_change_before_or_after_commit_leaves_ref_untouched(self):
        for heads in (["old", "changed"], ["old", "old", "changed"]):
            api = FakeAPI(heads=heads)
            with self.assertRaisesRegex(RuntimeError, "Remote main changed"):
                backup.sync(api=api, fetch=lambda _: 1841, now=NOW)
            self.assertFalse(any(method == "PATCH" for _, method, _ in api.calls))

    def test_fetch_failure_performs_no_remote_writes(self):
        api = FakeAPI()
        with self.assertRaises(ValueError):
            backup.sync(api=api, fetch=Mock(side_effect=ValueError("blocked")), now=NOW)
        self.assertEqual(api.writes(), [])

    def test_dry_run_fetches_even_fresh_snapshot_but_never_writes(self):
        api = FakeAPI(timestamp="2026-11-20T13:00:00+00:00")
        fetch = Mock(return_value=1841)
        self.assertEqual(backup.sync(api=api, fetch=fetch, now=NOW, dry_run=True)["status"], "dry-run")
        fetch.assert_called_once_with(backup.SCHOLAR_ID)
        self.assertEqual(api.writes(), [])

    def test_wrong_profile_is_rejected_without_fetch_or_writes(self):
        api = FakeAPI(scholar_id="other")
        fetch = Mock()
        with self.assertRaisesRegex(ValueError, "different Scholar profile"):
            backup.sync(api=api, fetch=fetch, now=NOW)
        fetch.assert_not_called()
        self.assertEqual(api.writes(), [])


if __name__ == "__main__":
    unittest.main()
