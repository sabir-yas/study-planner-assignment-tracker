# Requirements Document
## Study Planner / Assignment Tracker

**Project:** Honors Contract — CSCI 3508 Intro to Software Engineering
**Author:** Yaseer Abdulla Sabir (Student ID: 111158157)
**Instructor:** Cecilia Wong
**Semester:** Spring 2026
**Version:** 1.0
**Date:** March 2026

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and nonfunctional requirements for the Study Planner / Assignment Tracker application. It serves as the authoritative specification for development, testing, and evaluation of the honors contract prototype.

### 1.2 Scope
The Study Planner / Assignment Tracker is a web-based application that allows a student to manage their academic assignments. The system supports creating, viewing, editing, deleting, sorting, and filtering assignments, as well as marking them complete and receiving warnings for upcoming deadlines.

The application consists of a React frontend, a Flask REST API backend, and a JSON file for persistent data storage.

### 1.3 Intended Audience
- Developer (Yaseer Abdulla Sabir) — implementation reference
- Faculty evaluator (Cecilia Wong) — assessment of SE practices
- Honors Program — contract fulfillment record

### 1.4 Definitions and Acronyms

| Term | Definition |
|------|-----------|
| Assignment | An academic task with a title, course, due date, priority, and completion status |
| FR | Functional Requirement |
| NFR | Nonfunctional Requirement |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| JSON | JavaScript Object Notation |
| CRUD | Create, Read, Update, Delete |

---

## 2. Stakeholders

| # | Stakeholder | Role | Interest |
|---|-------------|------|----------|
| S1 | Student (end user) | Primary user of the application | Wants to track assignments efficiently, avoid missed deadlines |
| S2 | Faculty Instructor (Prof. Wong) | Evaluator | Wants to see professional SE practices demonstrated |
| S3 | CU Denver Honors Program | Contract authority | Wants to confirm contract deliverables are met |
| S4 | Developer (Yaseer Sabir) | Builder and maintainer | Wants a working, testable, well-documented system |

---

## 3. Goals and Problem Statement

### 3.1 Problem Statement
Students managing multiple courses often lose track of assignment due dates, priorities, and completion status. Without a centralized tool, assignments can be missed or deprioritized incorrectly, leading to academic underperformance.

### 3.2 Goals
1. Provide a single interface for tracking all assignments across all courses.
2. Allow students to organize assignments by due date and filter by course.
3. Warn students when deadlines are approaching (within 48 hours).
4. Persist data reliably across application restarts.
5. Demonstrate professional software engineering practices including requirements specification, UML modeling, and systematic testing.

---

## 4. Functional Requirements

Each requirement is labeled with a unique ID, a description, a MoSCoW priority, and an acceptance criterion.

---

### FR-01 — Add Assignment

**Description:** The system shall allow a user to create a new assignment by providing a title, course name/code, due date, and priority level.

**Priority:** Must Have

**Input fields:**
- Title (text, required, 1–200 characters)
- Course name/code (text, required, 1–100 characters)
- Due date (date picker, required, must be a valid calendar date in YYYY-MM-DD format)
- Priority (selection: low, medium, or high; required)

**Acceptance Criteria:**
- The user can submit the form and the new assignment appears in the list immediately.
- Submissions with missing title, missing course, invalid date format, or invalid priority are rejected with an error message.
- The system assigns a unique ID and creation timestamp automatically.

---

### FR-02 — View Assignment List

**Description:** The system shall display all stored assignments in a readable card-based format.

**Priority:** Must Have

**Acceptance Criteria:**
- All assignments are displayed with their title, course, due date, priority badge, and completion status.
- If no assignments exist, a friendly empty-state message is shown.
- The list reflects the current state of the data store on every page load.

---

### FR-03 — Edit Assignment

**Description:** The system shall allow a user to modify the title, course, due date, or priority of an existing assignment.

**Priority:** Must Have

**Acceptance Criteria:**
- Clicking "Edit" on a card populates the form with the existing values.
- Saving the form updates the assignment in the data store.
- The same validation rules as FR-01 apply during editing.
- If the assignment ID does not exist, the system returns a 404 error.

---

### FR-04 — Mark Assignment Complete

**Description:** The system shall allow a user to toggle the completion status of an assignment.

**Priority:** Must Have

**Acceptance Criteria:**
- Clicking "Mark Complete" on an incomplete assignment sets its status to completed.
- Completed assignments are visually distinguished (strikethrough title, reduced opacity).
- Clicking "Undo" on a completed assignment restores it to incomplete.
- The completion status is persisted across restarts.

---

### FR-05 — Delete Assignment

**Description:** The system shall allow a user to permanently remove an assignment.

**Priority:** Must Have

**Acceptance Criteria:**
- Clicking "Delete" prompts the user for confirmation.
- Upon confirmation, the assignment is removed from the data store and no longer appears in the list.
- If the assignment ID does not exist, the system returns a 404 error.

---

### FR-06 — Sort Assignments by Due Date

**Description:** The system shall allow a user to sort the assignment list by due date, from soonest to latest.

**Priority:** Must Have

**Acceptance Criteria:**
- Selecting "Due Date (Soonest First)" from the sort control re-orders the list in ascending due date order.
- Selecting "None" restores the default insertion order.
- Sorting is applied server-side via query parameter (`?sort=due_date`).

---

### FR-07 — Filter Assignments by Course

**Description:** The system shall allow a user to filter the assignment list to show only assignments for a selected course.

**Priority:** Must Have

**Acceptance Criteria:**
- The course filter dropdown is populated with all unique course names present in the data.
- Selecting a course shows only assignments matching that course (case-insensitive).
- Selecting "All Courses" restores the full list.

---

### FR-08 — Upcoming Soon Warning

**Description:** The system shall display a visual warning on any assignment that is due within 48 hours and is not yet completed.

**Priority:** Must Have

**Acceptance Criteria:**
- Assignments due within 48 hours from the current time display a "Due Soon!" banner.
- Completed assignments do not display the warning even if their due date is within 48 hours.
- Assignments due more than 48 hours away do not display the warning.

---

## 5. Nonfunctional Requirements

### NFR-01 — Usability
The application shall be usable without any prior instructions or training.

**Measure:** All core features (add, view, edit, delete, complete, sort, filter) are accessible through clearly labeled UI controls without requiring documentation.

---

### NFR-02 — Reliability
Data shall not be lost between application restarts.

**Measure:** All assignments written to `assignments.json` via an atomic file write (write-to-temp then `os.replace()`) are retrievable after restarting the Flask server. No partial writes shall corrupt the data file.

---

### NFR-03 — Performance
All user-initiated actions shall complete in under 1 second for a dataset of up to 200 assignments.

**Measure:** API response time (measured locally) for GET, POST, PUT, DELETE, and PATCH operations on a 200-item dataset is less than 1,000 ms.

---

### NFR-04 — Maintainability
The codebase shall follow a clean separation of concerns with modular structure.

**Measure:**
- Backend separates data models (`models.py`), persistence (`repository.py`), business logic (`service.py`), and HTTP routing (`app.py`).
- No business logic resides in route handlers.
- Frontend separates API communication (`api.js`), layout (`App.jsx`), and UI components (`components/`).

---

### NFR-05 — Portability
The application shall run on a typical student laptop running Windows, macOS, or Linux.

**Measure:** The application requires only Python 3.11+ and Node.js 18+. No database engine, Docker, or cloud service is required. Setup is achievable with two commands (`pip install`, `npm install`).

---

### NFR-06 — Data Integrity
The system shall reject malformed input and never store invalid data.

**Measure:**
- Due dates in incorrect format (e.g., MM/DD/YYYY) or impossible dates (e.g., February 30) are rejected with a descriptive error message.
- Priority values outside {low, medium, high} are rejected.
- Blank or whitespace-only titles and courses are rejected.

---

## 6. Use Cases

### UC-01: Add a New Assignment
**Actor:** Student
**Precondition:** App is running; user is on the main page.
**Main Flow:**
1. User clicks "+ Add Assignment."
2. System displays the assignment form.
3. User fills in title, course, due date, and priority.
4. User submits the form.
5. System validates input and saves the assignment.
6. System closes the form and displays the new assignment in the list.

**Alternative Flow (invalid input):** System displays an error message; form remains open.

---

### UC-02: Edit an Assignment
**Actor:** Student
**Precondition:** At least one assignment exists.
**Main Flow:**
1. User clicks "Edit" on an assignment card.
2. System pre-fills the form with existing values.
3. User modifies one or more fields and saves.
4. System validates and persists the changes.
5. System updates the card in the list.

---

### UC-03: Mark an Assignment Complete
**Actor:** Student
**Precondition:** An incomplete assignment exists.
**Main Flow:**
1. User clicks "Mark Complete."
2. System toggles the assignment's completed field to true.
3. Card is visually dimmed with strikethrough title.

---

### UC-04: Filter and Sort
**Actor:** Student
**Precondition:** Multiple assignments from different courses exist.
**Main Flow:**
1. User selects a course from the filter dropdown.
2. System re-fetches assignments filtered to that course.
3. User selects "Due Date (Soonest First)" from the sort dropdown.
4. System re-fetches and displays assignments in ascending due date order.

---

### UC-05: Receive Upcoming Warning
**Actor:** Student
**Precondition:** An assignment is due within 48 hours and is not completed.
**Main Flow:**
1. User views the assignment list.
2. System displays a "Due Soon!" banner on the relevant card.

---

## 7. Assumptions and Constraints

### Assumptions
- The application is used by a single user on a local machine (no multi-user or authentication requirements).
- The user has Python 3.11+ and Node.js 18+ installed.
- The data file (`assignments.json`) is stored on a local filesystem with read/write access.
- The number of assignments will not exceed approximately 200 in typical use.

### Constraints
- No external database (PostgreSQL, SQLite, etc.) may be used; persistence must use a JSON file.
- The prototype must run on a standard laptop OS without special infrastructure.
- The backend must be implemented in Python (Flask); the frontend must be implemented in React.

---

## 8. Definition of Done

A feature is considered complete when:
1. The corresponding functional requirement is fully implemented.
2. At least one automated test covers its main success path.
3. At least one automated test covers an error or boundary case.
4. The test is passing in the `pytest` suite.
5. The feature is accessible through the React UI without errors.
6. The feature's requirement ID appears in the traceability matrix.
