# Design Document
## Study Planner / Assignment Tracker

**Project:** Honors Contract — CSCI 3508 Intro to Software Engineering
**Author:** Yaseer Abdulla Sabir (Student ID: 111158157)
**Instructor:** Cecilia Wong
**Semester:** Spring 2026
**Version:** 1.0
**Date:** March 2026

---

## 1. Architecture Overview

The application follows a classic three-tier architecture:

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION TIER                   │
│              React + Vite (localhost:5173)            │
│   App.jsx → FilterSort, AssignmentForm, AssignmentList│
│                   └─ AssignmentCard                  │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP/JSON (REST API)
                           │ /api/assignments
                           ▼
┌─────────────────────────────────────────────────────┐
│                   BUSINESS TIER                      │
│              Flask REST API (localhost:5000)          │
│   app.py (routes) → service.py (logic)               │
└──────────────────────────┬──────────────────────────┘
                           │ Python function calls
                           ▼
┌─────────────────────────────────────────────────────┐
│                    DATA TIER                         │
│           repository.py → assignments.json           │
│         (atomic file write via os.replace)           │
└─────────────────────────────────────────────────────┘
```

**Tier responsibilities:**

| Tier | Technology | Responsibility |
|------|-----------|----------------|
| Presentation | React (Vite) | Render UI, manage local UI state, call API |
| Business | Flask + Python | Validate input, apply business rules, coordinate I/O |
| Data | JSON file | Persist assignment records across restarts |

---

## 2. Data Model

### 2.1 Assignment Schema

Each assignment is stored as a JSON object with the following fields:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string | UUID4, unique, immutable | System-generated identifier |
| `title` | string | Required, 1–200 chars, non-blank | Assignment name |
| `course` | string | Required, 1–100 chars, non-blank | Course name or code |
| `due_date` | string | Required, YYYY-MM-DD, valid calendar date | Deadline |
| `priority` | string | One of: `low`, `medium`, `high` | Urgency level |
| `completed` | boolean | Default: `false` | Completion status |
| `created_at` | string | ISO 8601 datetime, set on creation | Audit timestamp |

### 2.2 Storage Format (`assignments.json`)

```json
{
  "assignments": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Chapter 5 Review",
      "course": "CSCI 3508",
      "due_date": "2026-04-01",
      "priority": "high",
      "completed": false,
      "created_at": "2026-03-19T10:00:00"
    }
  ]
}
```

---

## 3. UML Class Diagram

```
┌──────────────────────────────────┐
│           Assignment             │
├──────────────────────────────────┤
│ + id: str                        │
│ + title: str                     │
│ + course: str                    │
│ + due_date: str                  │
│ + priority: str                  │
│ + completed: bool                │
│ + created_at: str                │
├──────────────────────────────────┤
│ + from_dict(d: dict): Assignment │
│ + to_dict(): dict                │
└──────────────┬───────────────────┘
               │ uses
               ▼
┌──────────────────────────────────┐
│           Repository             │
├──────────────────────────────────┤
│ - ASSIGNMENTS_FILE: Path         │
├──────────────────────────────────┤
│ + get_all(): list[Assignment]    │
│ + get_by_id(id): Assignment|None │
│ + save(a: Assignment): Assignment│
│ + delete(id: str): bool          │
│ - _read_all(): list[dict]        │
│ - _write_all(records): None      │
└──────────────┬───────────────────┘
               │ used by
               ▼
┌──────────────────────────────────────────────────┐
│                    Service                        │
├──────────────────────────────────────────────────┤
│ + validate_assignment(data): dict                 │
│ + create_assignment(data): Assignment             │
│ + update_assignment(id, data): Assignment         │
│ + toggle_complete(id): Assignment                 │
│ + delete_assignment(id): bool                     │
│ + get_assignments(course, sort): list[Assignment] │
│ + is_upcoming_soon(a: Assignment): bool           │
└──────────────┬───────────────────────────────────┘
               │ called by
               ▼
┌─────────────────────────────────────────┐
│               FlaskApp (app.py)          │
├─────────────────────────────────────────┤
│ GET    /api/assignments                  │
│ POST   /api/assignments                  │
│ PUT    /api/assignments/<id>             │
│ DELETE /api/assignments/<id>             │
│ PATCH  /api/assignments/<id>/complete    │
└─────────────────────────────────────────┘
```

### Class Relationships

| Relationship | Description |
|---|---|
| `FlaskApp` → `Service` | Routes delegate all logic to service functions (dependency) |
| `Service` → `Repository` | Service calls repository for all persistence operations (dependency) |
| `Repository` → `Assignment` | Repository creates and returns Assignment instances (association) |
| `Assignment` | Standalone data class; no dependencies on other classes |

---

## 4. Frontend Component Diagram

```
App.jsx
  │  state: assignments[], editingAssignment, showForm,
  │          filterCourse, sortBy
  │
  ├── FilterSort.jsx
  │     props: courses[], filterCourse, sortBy
  │     events: onFilterChange, onSortChange
  │
  ├── AssignmentForm.jsx  (conditional — shown when showForm=true)
  │     props: initialData (null=add, object=edit)
  │     events: onSave, onCancel
  │
  └── AssignmentList.jsx
        props: assignments[]
        │
        └── AssignmentCard.jsx  (one per assignment)
              props: assignment, isUpcomingSoon
              events: onEdit, onDelete, onToggleComplete
```

**Data flow:** All state lives in `App.jsx`. Child components are purely controlled — they receive data via props and communicate changes via callback functions. No child component fetches from the API directly; all API calls are in `App.jsx` via `api.js`.

---

## 5. API Specification

### 5.1 GET /api/assignments

**Query Parameters:**
- `course` (optional): Filter by course name (case-insensitive exact match)
- `sort` (optional): `due_date` sorts ascending by due date

**Response 200:**
```json
{
  "assignments": [
    {
      "id": "...",
      "title": "...",
      "course": "...",
      "due_date": "YYYY-MM-DD",
      "priority": "low|medium|high",
      "completed": false,
      "created_at": "...",
      "upcoming_soon": true
    }
  ]
}
```

---

### 5.2 POST /api/assignments

**Request Body:**
```json
{
  "title": "string (required)",
  "course": "string (required)",
  "due_date": "YYYY-MM-DD (required)",
  "priority": "low|medium|high (required)"
}
```

**Response 201:** Full assignment object (same shape as GET item above)
**Response 400:** `{ "error": "descriptive message" }`

---

### 5.3 PUT /api/assignments/\<id\>

**Request Body:** Any subset of title, course, due_date, priority (unspecified fields keep existing values)

**Response 200:** Updated assignment object
**Response 400:** Validation error
**Response 404:** Assignment not found

---

### 5.4 DELETE /api/assignments/\<id\>

**Response 200:** `{ "message": "Assignment deleted" }`
**Response 404:** `{ "error": "..." }`

---

### 5.5 PATCH /api/assignments/\<id\>/complete

**Response 200:** Updated assignment object with flipped `completed` value
**Response 404:** `{ "error": "..." }`

---

## 6. Sequence Diagrams

### 6.1 Add Assignment

```
User          AssignmentForm    App.jsx         api.js        Flask       Service     Repository
 │                │               │               │              │            │            │
 │──click "+Add"─►│               │               │              │            │            │
 │                │◄──showForm────│               │              │            │            │
 │──fill form────►│               │               │              │            │            │
 │──submit────────►               │               │              │            │            │
 │                │──onSave(data)─►               │              │            │            │
 │                │               │──POST /api/──►│              │            │            │
 │                │               │               │──fetch POST──►            │            │
 │                │               │               │              │──create──► │            │
 │                │               │               │              │            │──validate──►
 │                │               │               │              │            │◄──cleaned──│
 │                │               │               │              │            │──save()───►│
 │                │               │               │              │            │            │──write JSON
 │                │               │               │              │            │◄──Assignment│
 │                │               │               │              │◄──201+body─│            │
 │                │               │◄──response────│              │            │            │
 │                │               │──loadAssign()─►               │            │            │
 │                │               │◄──updated list─               │            │            │
 │◄───────────────│───────────────│ (card appears in list)        │            │            │
```

---

### 6.2 Mark Assignment Complete

```
User        AssignmentCard    App.jsx        api.js         Flask       Service     Repository
 │               │               │               │              │            │            │
 │──click "Mark Complete"        │               │              │            │            │
 │───────────────►               │               │              │            │            │
 │               │──onToggle(id)─►               │              │            │            │
 │               │               │──PATCH /──────►              │            │            │
 │               │               │               │──fetch PATCH──►           │            │
 │               │               │               │              │──toggle()──►            │
 │               │               │               │              │            │──get_by_id─►
 │               │               │               │              │            │◄──Assignment│
 │               │               │               │              │            │  flip bool  │
 │               │               │               │              │            │──save()────►│
 │               │               │               │              │            │            │──write JSON
 │               │               │               │              │◄──200+body─│            │
 │               │               │◄──response────│              │            │            │
 │               │               │──loadAssign()─► (re-fetch)   │            │            │
 │◄──────────────│───────────────│ card now shows strikethrough  │            │            │
```

---

### 6.3 View Filtered and Sorted List

```
User        FilterSort        App.jsx        api.js         Flask       Service
 │               │               │               │              │            │
 │──select course►               │               │              │            │
 │               │──onFilter()───►               │              │            │
 │               │               │  setFilterCourse()           │            │
 │               │               │  (useEffect fires)           │            │
 │               │               │──GET ?course=X&sort=due─────►│            │
 │               │               │               │──fetch GET───►            │
 │               │               │               │              │──getAssign()►
 │               │               │               │              │            │──filter
 │               │               │               │              │            │──sort
 │               │               │               │              │◄──list─────│
 │               │               │◄──200+body────│              │            │
 │               │               │  setAssignments()            │            │
 │◄──────────────│───────────────│ list re-renders with filtered+sorted cards│
```

---

## 7. Design Decisions

### 7.1 Atomic File Write
`repository.py` writes to a `.tmp` file and calls `os.replace()` to atomically swap it into place. On all major operating systems this is a single atomic filesystem operation, ensuring the JSON file is never in a partially-written state. This satisfies NFR-02 (Reliability).

### 7.2 Service Layer Separation
All business logic (validation, sorting, filtering, upcoming-soon detection) lives exclusively in `service.py`. Flask routes in `app.py` are thin HTTP adapters that call service functions and format responses. This means the entire business layer can be unit-tested without starting a Flask server, significantly reducing test complexity.

### 7.3 UUID4 Identifiers
Assignment IDs are UUID4 strings generated in `service.create_assignment()`. This requires no database sequence, is collision-safe at any realistic scale, and makes IDs unguessable (minor security benefit).

### 7.4 Vite API Proxy
`vite.config.js` proxies `/api` requests to `http://localhost:5000`. The React app uses `/api` as its base URL, never hardcoding the Flask port. This eliminates CORS complexity during development and makes the frontend portable to a production deployment with a real reverse proxy.

### 7.5 Client-Side Upcoming-Soon Detection
The `upcoming_soon` field is computed server-side in the API response (inside `app.py` using `service.is_upcoming_soon()`). The same logic also exists in `service.py` for independent unit testing. This design ensures the warning is always computed relative to the actual current time and does not require a separate client-side timer.

### 7.6 No External State Manager (No Redux)
At the scale of this application (~200 assignments, single user, no concurrent sessions), React's built-in `useState` and `useEffect` in `App.jsx` are sufficient. Adding Redux or Zustand would introduce complexity with no benefit. All derived data (unique courses list) is computed with `useMemo`.
