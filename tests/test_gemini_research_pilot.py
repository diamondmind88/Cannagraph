import contextlib
import importlib.util
import io
import json
import os
import pathlib
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("pilot", pathlib.Path(__file__).parent.parent / "scripts" / "gemini_research_pilot.py")
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)

class PilotTests(unittest.TestCase):
    def run_pilot(self, args, response=None):
        with tempfile.TemporaryDirectory() as folder:
            with patch("sys.argv", ["pilot", "--output", folder] + args), patch.dict(os.environ, {"GEMINI_API_KEY":"fake-test-key"}), patch.object(pilot, "request", return_value=response) as request, contextlib.redirect_stdout(io.StringIO()):
                code = 0
                try:
                    pilot.main()
                except SystemExit as exc:
                    code = exc.code
                manifest = json.loads((pathlib.Path(folder)/"manifest.json").read_text())
                reports = list(pathlib.Path(folder).glob("*.md"))
                return code, request.call_count, manifest, len(reports)
    def test_dryrun_never_calls_api(self):
        code, calls, manifest, reports = self.run_pilot([])
        self.assertEqual((code,calls,reports),(0,0,0))
        self.assertEqual(sum(len(j["cultivars"]) for j in manifest["jobs"]),10)
    def test_failed_job_is_failure(self):
        code, _, _, _ = self.run_pilot(["--live"], {"id":"test","status":"failed"})
        self.assertEqual(code,1)
    def test_empty_completed_job_is_failure(self):
        code, _, _, _ = self.run_pilot(["--live"], {"id":"test","status":"completed","steps":[]})
        self.assertEqual(code,1)
    def test_report_saved(self):
        code, _, _, reports = self.run_pilot(["--live"], {"id":"test","status":"completed","steps":[{"content":[{"type":"text","text":"Research report"}]}]})
        self.assertEqual((code,reports),(0,2))
    def test_missing_id_is_failure(self):
        code, _, _, _ = self.run_pilot(["--live"], {"status":"completed"})
        self.assertEqual(code,1)

if __name__ == "__main__":
    unittest.main()
