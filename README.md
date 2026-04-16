# Study Planner / Assignment Tracker

A full-stack web application for tracking assignments, due dates, and completion status. Built with Flask (Python) and React (Vite) for the CU Denver Honors Contract — CSCI 3508 Spring 2026.

---

## Features

- Add assignments with title, course, due date, and priority (low / medium / high)
- View all assignments in a clean card layout
- Edit any assignment's fields
- Mark assignments complete / incomplete
- Delete assignments
- Sort by due date (soonest first)
- Filter by course
- "Due Soon!" warning for assignments due within 48 hours
- Data persists across restarts via `backend/assignments.json`

---

## Project Structure

```
study-planner-assignment-tracker/
  backend/
    app.py           # Flask REST API
    models.py        # Assignment dataclass
    repository.py    # JSON file persistence (atomic writes)
    service.py       # Business logic: validate, sort, filter, upcoming-soon
    assignments.json # Data store
    requirements.txt
  frontend/
    src/
      api.js                     # Fetch wrappers for all API calls
      App.jsx                    # Top-level state and layout
      components/
        AssignmentForm.jsx       # Add / Edit form
        AssignmentList.jsx       # List of cards
        AssignmentCard.jsx       # Single assignment card
        FilterSort.jsx           # Course filter + sort controls
    vite.config.js
  tests/
    test_models.py      # T01–T04
    test_repository.py  # T05–T08
    test_service.py     # T09–T19
    test_api.py         # T20–T27
  README.md
```

---

## Requirements

- Python 3.11+
- Node.js 18+

---

## Setup

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Frontend

```bash
cd frontend
npm install
```

---

## Running the App

Open **two terminals**:

**Terminal 1 — Flask backend:**
```bash
cd backend
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 — React frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Then open http://localhost:5173 in your browser.

---

## Running the Tests

From the project root:

```bash
python -m pytest tests/ -v
```

All 27 tests should pass. Test coverage:

| File | Tests | What is covered |
|------|-------|-----------------|
| `test_models.py` | T01–T04 | Serialization, defaults, field contract |
| `test_repository.py` | T05–T08 | Save, update, delete, delete-not-found |
| `test_service.py` | T09–T19 | Validation (boundary + equivalence), sort, filter, upcoming-soon |
| `test_api.py` | T20–T27 | All 5 API endpoints including 400/404 error responses |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assignments` | List all (supports `?course=X&sort=due_date`) |
| POST | `/api/assignments` | Create a new assignment |
| PUT | `/api/assignments/<id>` | Update an assignment |
| DELETE | `/api/assignments/<id>` | Delete an assignment |
| PATCH | `/api/assignments/<id>/complete` | Toggle completion status |

---

## Author

Yaseer Abdulla Sabir — CU Denver, Student ID 111158157
