import json
import os
from pathlib import Path

from models import Assignment

ASSIGNMENTS_FILE = Path(__file__).parent / "assignments.json"


def _read_all() -> list[dict]:
    if not ASSIGNMENTS_FILE.exists():
        _write_all([])
        return []
    with open(ASSIGNMENTS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("assignments", [])


def _write_all(assignments: list[dict]) -> None:
    tmp = ASSIGNMENTS_FILE.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"assignments": assignments}, f, indent=2)
    os.replace(tmp, ASSIGNMENTS_FILE)


def get_all() -> list[Assignment]:
    return [Assignment.from_dict(d) for d in _read_all()]


def get_by_id(assignment_id: str) -> Assignment | None:
    for d in _read_all():
        if d["id"] == assignment_id:
            return Assignment.from_dict(d)
    return None


def save(assignment: Assignment) -> Assignment:
    records = _read_all()
    for i, d in enumerate(records):
        if d["id"] == assignment.id:
            records[i] = assignment.to_dict()
            _write_all(records)
            return assignment
    records.append(assignment.to_dict())
    _write_all(records)
    return assignment


def delete(assignment_id: str) -> bool:
    records = _read_all()
    new_records = [d for d in records if d["id"] != assignment_id]
    if len(new_records) == len(records):
        return False
    _write_all(new_records)
    return True
