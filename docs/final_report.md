# Final Report
## Study Planner / Assignment Tracker

**Project:** Honors Contract — CSCI 3508 Intro to Software Engineering
**Author:** Yaseer Abdulla Sabir (Student ID: 111158157)
**Instructor:** Cecilia Wong
**Semester:** Spring 2026
**Version:** 1.0
**Date:** March 2026

---

## 1. Executive Summary

This report summarizes the design, implementation, testing, and lessons learned from the Study Planner / Assignment Tracker, a web-based application developed as an honors contract project for CSCI 3508 (Intro to Software Engineering). The project demonstrates professional software engineering practices including requirements engineering, UML modeling, test-driven design, and full-stack implementation.

The final deliverable is a working Flask + React application that allows a student to create, view, edit, delete, sort, filter, and track academic assignments across multiple courses. All eight functional requirements were implemented and verified through a suite of 27 automated tests, all of which pass.

---

## 2. Project Description

### 2.1 Problem Being Solved

Students managing coursework across multiple classes often lack a centralized, reliable system for tracking assignment deadlines, priorities, and completion status. Paper planners and general-purpose task apps do not provide course-specific filtering or automatic urgency warnings. The goal of this project was to build a purpose-built tool that fills this gap while also serving as a demonstration of software engineering practices.

### 2.2 Application Overview

The Study Planner / Assignment Tracker is a full-stack web application with:
- A **React frontend** (served by Vite on localhost:5173) providing a card-based UI
- A **Flask REST API backend** (localhost:5000) handling all business logic
- A **JSON file** (`assignments.json`) for persistent, crash-safe data storage

Users can add assignments with a title, course, due date, and priority level (low, medium, high). Assignments can be edited, marked complete, or deleted. The list can be sorted by due date and filtered by course. Assignments due within 48 hours display a "Due Soon!" warning banner.

---

## 3. Requirements Engineering

### 3.1 Process

Requirements were derived from the honors contract specification and organized into a formal Requirements Document following standard SE practices. The process involved:
1. Identifying stakeholders (student, instructor, honors program, developer)
2. Defining a problem statement and goals
3. Writing 8 functional requirements (FR-01–FR-08) with MoSCoW priorities and acceptance criteria
4. Writing 6 nonfunctional requirements (NFR-01–NFR-06) covering usability, reliability, performance, maintainability, portability, and data integrity
5. Writing 5 use cases describing the main user workflows
6. Documenting assumptions, constraints, and a definition of done

### 3.2 Key Requirements Decisions

All 8 functional requirements were classified as "Must Have." This reflects the fact that each feature was explicitly required by the honors contract specification, and the application would not be meaningfully useful without any one of them. For example, sort-by-due-date (FR-06) and filter-by-course (FR-07) are essential to the app's value proposition for students with many assignments across many courses.

The upcoming-soon warning (FR-08) was implemented as a server-computed field (`upcoming_soon: bool`) returned alongside every assignment in API responses, rather than as a client-side calculation only. This ensures the logic is independently testable in unit tests (T17–T19).

---

## 4. Design

### 4.1 Architecture

The system uses a three-tier architecture:

**Presentation tier (React + Vite):** Five components handle all UI concerns. `App.jsx` manages all application state and coordinates API calls. Child components (`FilterSort`, `AssignmentForm`, `AssignmentList`, `AssignmentCard`) are fully controlled — they receive data via props and raise events via callbacks. No child component interacts with the API directly.

**Business tier (Flask):** The backend enforces strict separation between the HTTP layer (`app.py`) and business logic (`service.py`). Route handlers contain no business logic — they only parse requests, call service functions, and format responses. This made the service layer independently unit-testable without starting a Flask server.

**Data tier (JSON file):** `repository.py` provides a clean interface (`get_all`, `get_by_id`, `save`, `delete`) over a single JSON file. Writes use an atomic `os.replace()` pattern to guarantee the file is never in a corrupt state, satisfying the reliability requirement.

### 4.2 Key Design Decisions

**Atomic file write:** Rather than writing directly to `assignments.json`, the repository writes to `assignments.tmp` and uses `os.replace()` to atomically swap it into place. This ensures a process crash during a write cannot corrupt the data file.

**Service layer isolation:** By placing all validation, sorting, filtering, and upcoming-soon logic in `service.py` with no Flask dependencies, it was possible to test 11 business-logic test cases without any HTTP overhead. This significantly simplified the test suite.

**Vite proxy:** Configuring Vite to proxy `/api` requests to the Flask server eliminated all CORS configuration complexity and avoided hardcoding `localhost:5000` in the React source code.

### 4.3 UML Artifacts

The design document includes:
- A UML class diagram showing the four backend classes (`Assignment`, `Repository`, `Service`, `FlaskApp`) and their relationships
- A frontend component diagram showing the prop and event relationships
- Three UML sequence diagrams: "Add Assignment," "Mark Complete," and "View Filtered/Sorted List"

---

## 5. Implementation

### 5.1 Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Backend | Python 3.13, Flask 3.0.3 | Required by contract; clean routing and test client |
| Frontend | React 18, Vite 8 | Component-based UI; fast HMR dev experience |
| Persistence | JSON file | Required by contract; simple and portable |
| Testing | pytest 8.2.2 | Industry-standard Python test runner |

### 5.2 Implementation Order

The implementation followed a deliberate bottom-up order within each tier:

1. `models.py` — data class with serialization
2. `repository.py` — file I/O layer
3. `service.py` — business logic layer
4. `app.py` — HTTP routing layer
5. `api.js` — frontend HTTP client
6. `App.jsx` + components — UI layer

This order ensured each layer was tested before the next layer depended on it.

### 5.3 Notable Implementation Details

**Priority color coding:** Assignment cards have a left border color that reflects priority — red for high, orange for medium, green for low — making urgency visible at a glance without reading text.

**Edit mode in the form:** `AssignmentForm.jsx` handles both "add" and "edit" modes from a single component. When `initialData` is provided via props, the form pre-populates all fields. The parent (`App.jsx`) determines which API call to make (POST vs. PUT) based on whether `editingAssignment` state is null.

**Upcoming soon computation:** The `is_upcoming_soon()` function in `service.py` compares `datetime.now()` against the assignment's due date. It returns `False` for completed assignments regardless of the due date, enforcing the business rule that completed work should not generate warnings.

---

## 6. Testing

### 6.1 Test Suite Summary

The test suite contains 27 test cases across four files:

| File | Tests | Focus |
|------|-------|-------|
| `test_models.py` | T01–T04 | Serialization correctness and field contract |
| `test_repository.py` | T05–T08 | File I/O, update idempotency, delete behavior |
| `test_service.py` | T09–T19 | Validation boundaries, create, filter, sort, upcoming-soon |
| `test_api.py` | T20–T27 | All 5 API endpoints including error responses |

All 27 tests pass in 0.83 seconds.

### 6.2 Testing Techniques Applied

**Boundary value analysis** was applied to the title field (empty vs. blank vs. valid), the due date field (valid format, wrong format, impossible date), and the upcoming-soon window (24h = True, 72h = False).

**Equivalence class testing** was applied to the priority field (one representative valid value, one invalid value) and assignment IDs (existing ID vs. nonexistent ID for PUT/DELETE/PATCH endpoints).

**Error path testing** was applied to all five API endpoints to verify correct 400 and 404 responses for invalid or missing inputs.

### 6.3 Test Isolation

All tests use `pytest`'s `tmp_path` fixture combined with `monkeypatch` to redirect file I/O to a temporary directory. Each test function starts with a fresh, empty data store. The production `assignments.json` is never modified by any test.

### 6.4 Traceability

Every functional requirement (FR-01–FR-08) is covered by at least one test case. The full traceability matrix is documented in the Testing Document.

---

## 7. Results and Verification

### 7.1 Functional Requirements Met

| Requirement | Status | Tests |
|-------------|--------|-------|
| FR-01 Add assignment | ✓ Implemented and tested | T09–T14, T21–T22 |
| FR-02 View list | ✓ Implemented and tested | T05, T15, T16, T20 |
| FR-03 Edit assignment | ✓ Implemented and tested | T06, T23, T24 |
| FR-04 Mark complete | ✓ Implemented and tested | T27 |
| FR-05 Delete assignment | ✓ Implemented and tested | T07, T08, T25, T26 |
| FR-06 Sort by due date | ✓ Implemented and tested | T16 |
| FR-07 Filter by course | ✓ Implemented and tested | T15 |
| FR-08 Upcoming soon warning | ✓ Implemented and tested | T17, T18, T19 |

### 7.2 Nonfunctional Requirements Met

| Requirement | Verification |
|-------------|-------------|
| NFR-01 Usability | All features accessible via labeled UI controls; no instructions needed |
| NFR-02 Reliability | Atomic write via `os.replace()`; data survives Flask restarts (manually verified) |
| NFR-03 Performance | API responses measured < 50ms locally for a 200-item dataset |
| NFR-04 Maintainability | Four-layer backend separation; no logic in routes; stateless components in frontend |
| NFR-05 Portability | Requires only Python 3.11+ and Node.js 18+; runs on Windows 11 (tested) |
| NFR-06 Data Integrity | Validation rejects blank strings, wrong date formats, impossible dates, and invalid priorities |

---

## 8. Lessons Learned

### 8.1 Value of Layered Architecture
Separating the service layer from Flask routes made a significant practical difference during testing. Being able to test all 11 business-logic cases without starting a server, handling HTTP requests, or managing ports reduced test complexity and runtime substantially. This reinforced why the "separation of concerns" principle is not just theoretical — it has direct, measurable impact on testability.

### 8.2 Test Isolation is Critical
Early in development, tests were inadvertently sharing state through the real `assignments.json` file, causing test order dependencies and intermittent failures. Introducing the `monkeypatch`/`tmp_path` fixture pattern to redirect all I/O to a temporary file eliminated this immediately. The lesson is that test isolation should be designed from the start, not added as a fix.

### 8.3 Atomic Writes Matter More Than Expected
The atomic write pattern (`write-to-temp, then os.replace()`) felt like over-engineering at first for a local student tool. However, during development, a crash mid-write would have left a partially-written JSON file and required manual repair. Implementing the pattern correctly at the start saved real debugging time.

### 8.4 Requirements as a Communication Tool
Writing the requirements document before coding clarified several ambiguities in the original specification — for example, whether "filter by course" should be case-sensitive, what exactly "upcoming soon" means in hours, and whether completed assignments should still show the urgency warning. Resolving these in the requirements document first meant they never had to be re-decided during implementation.

### 8.5 UML Sequence Diagrams Aid Implementation
Drawing the sequence diagrams before writing the API integration code made the data flow across tiers much clearer. The diagrams exposed one design issue: the original plan had the upcoming-soon flag computed only client-side, but the sequence diagram showed that the server response would then be missing information needed for testing. Moving the computation server-side (while keeping it independently testable) resolved this cleanly.

---

## 9. Conclusion

The Study Planner / Assignment Tracker successfully meets all functional and nonfunctional requirements defined in the honors contract. The project demonstrated the application of professional software engineering practices: formal requirements specification, UML design artifacts, systematic test planning with traceability, and clean modular implementation.

The 27-test suite provides confidence in the correctness of all major code paths. The layered architecture ensures that each tier (data, business, presentation) can be understood, modified, and tested independently. The resulting application is a usable, reliable, and maintainable tool for student assignment management.

---

## 10. Deliverables Checklist

| # | Deliverable | Status |
|---|------------|--------|
| 1 | Source code (GitHub repository) | ✓ Complete |
| 2 | README with setup, run, and test instructions | ✓ Complete |
| 3 | Requirements Document | ✓ Complete |
| 4 | Design Document with UML diagrams | ✓ Complete |
| 5 | Testing Document with test cases and traceability matrix | ✓ Complete |
| 6 | Final Report | ✓ Complete |
