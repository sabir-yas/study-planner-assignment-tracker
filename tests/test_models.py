"""T01–T04: Assignment model tests."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from models import Assignment


SAMPLE = {
    "id": "abc-123",
    "title": "Homework 1",
    "course": "CS101",
    "due_date": "2026-04-01",
    "priority": "high",
    "completed": False,
    "created_at": "2026-03-19T10:00:00",
}


# T01
def test_from_dict_valid():
    a = Assignment.from_dict(SAMPLE)
    assert a.id == "abc-123"
    assert a.title == "Homework 1"
    assert a.course == "CS101"
    assert a.due_date == "2026-04-01"
    assert a.priority == "high"
    assert a.completed is False
    assert a.created_at == "2026-03-19T10:00:00"


# T02
def test_to_dict_roundtrip():
    a = Assignment.from_dict(SAMPLE)
    d = a.to_dict()
    a2 = Assignment.from_dict(d)
    assert a2.id == a.id
    assert a2.title == a.title
    assert a2.course == a.course
    assert a2.due_date == a.due_date
    assert a2.priority == a.priority
    assert a2.completed == a.completed
    assert a2.created_at == a.created_at


# T03
def test_default_completed_false():
    a = Assignment.from_dict({**SAMPLE, "completed": False})
    assert a.completed is False
    # omitting completed key also defaults to False
    minimal = {k: v for k, v in SAMPLE.items() if k != "completed"}
    a2 = Assignment.from_dict(minimal)
    assert a2.completed is False


# T04
def test_to_dict_contains_all_fields():
    a = Assignment.from_dict(SAMPLE)
    d = a.to_dict()
    expected_keys = {"id", "title", "course", "due_date", "priority", "completed", "created_at"}
    assert set(d.keys()) == expected_keys
