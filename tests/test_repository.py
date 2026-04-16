"""T05–T08: Repository (JSON persistence) tests."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import pytest
import repository as repo
from models import Assignment


@pytest.fixture(autouse=True)
def patch_file(tmp_path, monkeypatch):
    """Redirect all file I/O to a temp file so tests never touch assignments.json."""
    tmp_file = tmp_path / "assignments.json"
    monkeypatch.setattr(repo, "ASSIGNMENTS_FILE", tmp_file)


def make_assignment(**kwargs) -> Assignment:
    defaults = dict(id="id-1", title="Test", course="CS101",
                    due_date="2026-04-01", priority="medium")
    defaults.update(kwargs)
    return Assignment(**defaults)


# T05
def test_save_and_get_all():
    a = make_assignment()
    repo.save(a)
    all_items = repo.get_all()
    assert len(all_items) == 1
    assert all_items[0].id == "id-1"
    assert all_items[0].title == "Test"


# T06
def test_update_existing():
    a = make_assignment()
    repo.save(a)
    a.title = "Updated Title"
    repo.save(a)
    all_items = repo.get_all()
    assert len(all_items) == 1          # still only one record
    assert all_items[0].title == "Updated Title"


# T07
def test_delete_existing():
    a = make_assignment()
    repo.save(a)
    result = repo.delete("id-1")
    assert result is True
    assert repo.get_all() == []


# T08
def test_delete_nonexistent_returns_false():
    a = make_assignment()
    repo.save(a)
    result = repo.delete("does-not-exist")
    assert result is False
    assert len(repo.get_all()) == 1     # original record untouched
