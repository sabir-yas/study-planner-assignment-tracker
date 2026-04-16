"""T09–T19: Service layer (business logic) tests."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import pytest
from datetime import datetime, timedelta
import repository as repo
import service
from models import Assignment


@pytest.fixture(autouse=True)
def patch_file(tmp_path, monkeypatch):
    tmp_file = tmp_path / "assignments.json"
    monkeypatch.setattr(repo, "ASSIGNMENTS_FILE", tmp_file)


# ── Validation tests ───────────────────────────────────────────────────────

# T09
def test_validate_missing_title():
    with pytest.raises(ValueError, match="title"):
        service.validate_assignment({"course": "CS101", "due_date": "2026-04-01", "priority": "low"})


# T10
def test_validate_blank_title():
    with pytest.raises(ValueError, match="title"):
        service.validate_assignment({"title": "   ", "course": "CS101", "due_date": "2026-04-01", "priority": "low"})


# T11
def test_validate_invalid_priority():
    with pytest.raises(ValueError, match="priority"):
        service.validate_assignment({"title": "HW1", "course": "CS101", "due_date": "2026-04-01", "priority": "urgent"})


# T12
def test_validate_invalid_date_format():
    with pytest.raises(ValueError, match="due_date"):
        service.validate_assignment({"title": "HW1", "course": "CS101", "due_date": "03/21/2026", "priority": "low"})


# T13
def test_validate_impossible_date():
    with pytest.raises(ValueError, match="due_date"):
        service.validate_assignment({"title": "HW1", "course": "CS101", "due_date": "2026-02-30", "priority": "low"})


# ── Create test ────────────────────────────────────────────────────────────

# T14
def test_create_generates_uuid():
    a1 = service.create_assignment({"title": "HW1", "course": "CS101", "due_date": "2026-04-01", "priority": "low"})
    a2 = service.create_assignment({"title": "HW2", "course": "CS101", "due_date": "2026-04-02", "priority": "low"})
    assert a1.id is not None
    assert a2.id is not None
    assert a1.id != a2.id


# ── Filter / Sort tests ────────────────────────────────────────────────────

# T15
def test_get_assignments_filter_by_course():
    service.create_assignment({"title": "A", "course": "CS101", "due_date": "2026-04-01", "priority": "low"})
    service.create_assignment({"title": "B", "course": "MATH201", "due_date": "2026-04-02", "priority": "medium"})
    service.create_assignment({"title": "C", "course": "CS101", "due_date": "2026-04-03", "priority": "high"})
    results = service.get_assignments(course_filter="CS101")
    assert len(results) == 2
    assert all(a.course == "CS101" for a in results)


# T16
def test_get_assignments_sort_by_due_date():
    service.create_assignment({"title": "Late", "course": "CS101", "due_date": "2026-05-01", "priority": "low"})
    service.create_assignment({"title": "Early", "course": "CS101", "due_date": "2026-03-25", "priority": "low"})
    service.create_assignment({"title": "Mid", "course": "CS101", "due_date": "2026-04-10", "priority": "low"})
    results = service.get_assignments(sort_by="due_date")
    dates = [a.due_date for a in results]
    assert dates == sorted(dates)


# ── Upcoming soon tests ────────────────────────────────────────────────────

def _make_assignment_due_in(hours: float, completed=False) -> Assignment:
    due = datetime.now() + timedelta(hours=hours)
    a = service.create_assignment({
        "title": "Test",
        "course": "CS101",
        "due_date": due.strftime("%Y-%m-%d"),
        "priority": "low",
    })
    if completed:
        a = service.toggle_complete(a.id)
    return a


# T17
def test_is_upcoming_soon_within_48h():
    a = _make_assignment_due_in(24)
    assert service.is_upcoming_soon(a) is True


# T18
def test_is_upcoming_soon_beyond_48h():
    a = _make_assignment_due_in(72)
    assert service.is_upcoming_soon(a) is False


# T19
def test_is_upcoming_soon_completed_ignored():
    a = _make_assignment_due_in(1, completed=True)
    assert service.is_upcoming_soon(a) is False
