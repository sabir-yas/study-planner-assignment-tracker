from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Assignment:
    id: str
    title: str
    course: str
    due_date: str          # "YYYY-MM-DD"
    priority: str          # "low" | "medium" | "high"
    completed: bool = False
    created_at: str = field(default_factory=lambda: datetime.now().isoformat(timespec="seconds"))

    @classmethod
    def from_dict(cls, d: dict) -> "Assignment":
        return cls(
            id=d["id"],
            title=d["title"],
            course=d["course"],
            due_date=d["due_date"],
            priority=d["priority"],
            completed=d.get("completed", False),
            created_at=d.get("created_at", datetime.now().isoformat(timespec="seconds")),
        )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "course": self.course,
            "due_date": self.due_date,
            "priority": self.priority,
            "completed": self.completed,
            "created_at": self.created_at,
        }
