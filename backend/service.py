import uuid
from datetime import datetime, timedelta, timezone

import repository as repo
from models import Assignment

VALID_PRIORITIES = {"low", "medium", "high"}


def validate_assignment(data: dict) -> dict:
    title = data.get("title", "")
    if not isinstance(title, str) or not title.strip():
        raise ValueError("title is required and must be a non-empty string")

    course = data.get("course", "")
    if not isinstance(course, str) or not course.strip():
        raise ValueError("course is required and must be a non-empty string")

    due_date = data.get("due_date", "")
    if not isinstance(due_date, str) or not due_date.strip():
        raise ValueError("due_date is required")
    try:
        datetime.strptime(due_date.strip(), "%Y-%m-%d")
    except ValueError:
        raise ValueError("due_date must be a valid date in YYYY-MM-DD format")

    priority = data.get("priority", "")
    if priority not in VALID_PRIORITIES:
        raise ValueError(f"priority must be one of: {', '.join(sorted(VALID_PRIORITIES))}")

    return {
        "title": title.strip(),
        "course": course.strip(),
        "due_date": due_date.strip(),
        "priority": priority,
    }


def create_assignment(data: dict) -> Assignment:
    cleaned = validate_assignment(data)
    assignment = Assignment(
        id=str(uuid.uuid4()),
        title=cleaned["title"],
        course=cleaned["course"],
        due_date=cleaned["due_date"],
        priority=cleaned["priority"],
    )
    return repo.save(assignment)


def update_assignment(assignment_id: str, data: dict) -> Assignment:
    existing = repo.get_by_id(assignment_id)
    if existing is None:
        raise KeyError(f"Assignment {assignment_id} not found")

    merged = {
        "title": data.get("title", existing.title),
        "course": data.get("course", existing.course),
        "due_date": data.get("due_date", existing.due_date),
        "priority": data.get("priority", existing.priority),
    }
    cleaned = validate_assignment(merged)

    existing.title = cleaned["title"]
    existing.course = cleaned["course"]
    existing.due_date = cleaned["due_date"]
    existing.priority = cleaned["priority"]
    if "completed" in data:
        existing.completed = bool(data["completed"])

    return repo.save(existing)


def toggle_complete(assignment_id: str) -> Assignment:
    existing = repo.get_by_id(assignment_id)
    if existing is None:
        raise KeyError(f"Assignment {assignment_id} not found")
    existing.completed = not existing.completed
    return repo.save(existing)


def delete_assignment(assignment_id: str) -> bool:
    existing = repo.get_by_id(assignment_id)
    if existing is None:
        raise KeyError(f"Assignment {assignment_id} not found")
    return repo.delete(assignment_id)


def is_upcoming_soon(assignment: Assignment) -> bool:
    if assignment.completed:
        return False
    now = datetime.now()
    try:
        due = datetime.strptime(assignment.due_date, "%Y-%m-%d")
    except ValueError:
        return False
    delta = due - now
    return timedelta(0) <= delta <= timedelta(hours=48)


def get_assignments(course_filter: str | None = None, sort_by: str | None = None) -> list[Assignment]:
    assignments = repo.get_all()

    if course_filter:
        assignments = [a for a in assignments if a.course.lower() == course_filter.lower()]

    if sort_by == "due_date":
        assignments.sort(key=lambda a: a.due_date)

    return assignments
