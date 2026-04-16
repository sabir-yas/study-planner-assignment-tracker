# Testing Document
## Study Planner / Assignment Tracker

**Project:** Honors Contract — CSCI 3508 Intro to Software Engineering
**Author:** Yaseer Abdulla Sabir (Student ID: 111158157)
**Instructor:** Cecilia Wong
**Semester:** Spring 2026
**Version:** 1.0
**Date:** March 2026

---

## 1. Test Plan

### 1.1 Testing Objectives
- Verify all 8 functional requirements are correctly implemented.
- Validate input boundary conditions and invalid input handling.
- Confirm API endpoints return correct HTTP status codes and response shapes.
- Ensure data persistence and integrity across operations.

### 1.2 Testing Strategy

The test suite uses a **multi-level approach**:

| Level | Scope | Tool | Location |
|-------|-------|------|----------|
| Unit | Individual classes and functions | pytest | `tests/test_models.py`, `tests/test_repository.py`, `tests/test_service.py` |
| Integration | Flask API endpoints (full request/response cycle) | pytest + Flask test client | `tests/test_api.py` |
| Manual (exploratory) | Full UI interaction in browser | Manual | localhost:5173 |

### 1.3 Types of Testing Applied

- **Functional testing** — verifies that each feature works as specified (happy path)
- **Boundary value analysis** — tests values at the edges of valid input ranges (e.g., blank strings, impossible dates, exactly-48-hour window)
- **Equivalence class testing** — tests one representative from each valid and invalid input partition (e.g., a valid priority vs. an invalid priority)
- **Error path testing** — verifies correct HTTP error codes and messages for invalid or missing resources

### 1.4 Test Environment

| Component | Version |
|-----------|---------|
| Python | 3.13.7 |
| pytest | 8.2.2 |
| Flask | 3.0.3 |
| flask-cors | 4.0.1 |
| Node.js | 18+ |
| OS | Windows 11 |

### 1.5 Test Data Management
- All backend tests use `pytest`'s `tmp_path` fixture to redirect file I/O to a temporary directory.
- The real `backend/assignments.json` is **never touched** by any automated test.
- Each test function starts with an empty data store (fixture is function-scoped).

### 1.6 Running the Tests

```bash
# From the project root
python -m pytest tests/ -v
```

Expected result: **27 passed**.

---

## 2. Test Cases

### 2.1 Model Tests (T01–T04)

| ID | Test Name | Input | Expected Output | Test Type |
|----|-----------|-------|-----------------|-----------|
| T01 | `test_from_dict_valid` | Complete valid dict with all 7 fields | Assignment object with matching field values | Functional |
| T02 | `test_to_dict_roundtrip` | Assignment → to_dict() → from_dict() | Resulting object is identical to original | Functional |
| T03 | `test_default_completed_false` | Dict without `completed` key | Assignment.completed == False | Boundary (default value) |
| T04 | `test_to_dict_contains_all_fields` | Any valid Assignment | to_dict() result has exactly {id, title, course, due_date, priority, completed, created_at} | Contract |

---

### 2.2 Repository Tests (T05–T08)

| ID | Test Name | Input | Expected Output | Test Type |
|----|-----------|-------|-----------------|-----------|
| T05 | `test_save_and_get_all` | Save one Assignment, then get_all() | List with exactly that one Assignment | Functional |
| T06 | `test_update_existing` | Save same ID twice with different title | get_all() returns 1 record with new title | Functional (idempotency) |
| T07 | `test_delete_existing` | Save then delete by ID | get_all() returns empty list; delete returns True | Functional |
| T08 | `test_delete_nonexistent_returns_false` | Delete an ID that was never saved | Returns False; original record untouched | Boundary (not found) |

---

### 2.3 Service Tests (T09–T19)

| ID | Test Name | Input | Expected Output | Test Type |
|----|-----------|-------|-----------------|-----------|
| T09 | `test_validate_missing_title` | Data dict with no `title` key | Raises ValueError mentioning "title" | Equivalence (invalid input) |
| T10 | `test_validate_blank_title` | title = `"   "` (whitespace only) | Raises ValueError mentioning "title" | Boundary (empty after strip) |
| T11 | `test_validate_invalid_priority` | priority = `"urgent"` | Raises ValueError mentioning "priority" | Equivalence (invalid enum value) |
| T12 | `test_validate_invalid_date_format` | due_date = `"03/21/2026"` (MM/DD/YYYY) | Raises ValueError mentioning "due_date" | Equivalence (wrong format) |
| T13 | `test_validate_impossible_date` | due_date = `"2026-02-30"` | Raises ValueError mentioning "due_date" | Boundary (non-existent date) |
| T14 | `test_create_generates_uuid` | Two separate valid create calls | Both have non-null IDs; IDs are different | Functional |
| T15 | `test_get_assignments_filter_by_course` | 3 assignments (2 CS101, 1 MATH201); filter="CS101" | Returns exactly 2 assignments, all course="CS101" | Functional (FR-07) |
| T16 | `test_get_assignments_sort_by_due_date` | 3 assignments with dates: 2026-05-01, 2026-03-25, 2026-04-10; sort="due_date" | Returned in order: 03-25, 04-10, 05-01 | Functional (FR-06) |
| T17 | `test_is_upcoming_soon_within_48h` | Incomplete assignment due in 24 hours | Returns True | Boundary (within window) |
| T18 | `test_is_upcoming_soon_beyond_48h` | Incomplete assignment due in 72 hours | Returns False | Boundary (outside window) |
| T19 | `test_is_upcoming_soon_completed_ignored` | Completed assignment due in 1 hour | Returns False | Business rule (FR-08) |

---

### 2.4 API Tests (T20–T27)

| ID | Test Name | HTTP Request | Expected Status | Expected Body | Test Type |
|----|-----------|--------------|-----------------|---------------|-----------|
| T20 | `test_get_assignments_empty` | GET /api/assignments (empty store) | 200 | `{"assignments": []}` | Functional |
| T21 | `test_post_assignment_valid` | POST with valid payload | 201 | Contains `id`, `title`, `completed: false` | Functional (FR-01) |
| T22 | `test_post_assignment_missing_field` | POST with no `title` | 400 | Contains `"error"` key | Error path |
| T23 | `test_put_assignment_valid` | PUT existing ID with changed title | 200 | Updated title in response | Functional (FR-03) |
| T24 | `test_put_assignment_not_found` | PUT unknown ID | 404 | Contains `"error"` key | Error path |
| T25 | `test_delete_assignment_valid` | DELETE existing ID | 200 | Assignment gone on subsequent GET | Functional (FR-05) |
| T26 | `test_delete_assignment_not_found` | DELETE unknown ID | 404 | Contains `"error"` key | Error path |
| T27 | `test_patch_toggle_complete` | PATCH /complete on incomplete → then again | 200 twice | completed flips true then false | Functional (FR-04) |

---

## 3. Test Results

All 27 tests pass:

```
tests/test_api.py::test_get_assignments_empty           PASSED
tests/test_api.py::test_post_assignment_valid           PASSED
tests/test_api.py::test_post_assignment_missing_field   PASSED
tests/test_api.py::test_put_assignment_valid            PASSED
tests/test_api.py::test_put_assignment_not_found        PASSED
tests/test_api.py::test_delete_assignment_valid         PASSED
tests/test_api.py::test_delete_assignment_not_found     PASSED
tests/test_api.py::test_patch_toggle_complete           PASSED
tests/test_models.py::test_from_dict_valid              PASSED
tests/test_models.py::test_to_dict_roundtrip            PASSED
tests/test_models.py::test_default_completed_false      PASSED
tests/test_models.py::test_to_dict_contains_all_fields  PASSED
tests/test_repository.py::test_save_and_get_all         PASSED
tests/test_repository.py::test_update_existing          PASSED
tests/test_repository.py::test_delete_existing          PASSED
tests/test_repository.py::test_delete_nonexistent_returns_false PASSED
tests/test_service.py::test_validate_missing_title      PASSED
tests/test_service.py::test_validate_blank_title        PASSED
tests/test_service.py::test_validate_invalid_priority   PASSED
tests/test_service.py::test_validate_invalid_date_format PASSED
tests/test_service.py::test_validate_impossible_date    PASSED
tests/test_service.py::test_create_generates_uuid       PASSED
tests/test_service.py::test_get_assignments_filter_by_course PASSED
tests/test_service.py::test_get_assignments_sort_by_due_date PASSED
tests/test_service.py::test_is_upcoming_soon_within_48h PASSED
tests/test_service.py::test_is_upcoming_soon_beyond_48h PASSED
tests/test_service.py::test_is_upcoming_soon_completed_ignored PASSED

27 passed in 0.83s
```

---

## 4. Requirements Traceability Matrix

The following matrix maps each functional requirement to the test cases that verify it.

| Requirement | Description | Test IDs | # Tests |
|-------------|-------------|----------|---------|
| FR-01 | Add assignment | T09, T10, T11, T12, T13, T14, T21, T22 | 8 |
| FR-02 | View assignment list | T05, T15, T16, T20 | 4 |
| FR-03 | Edit assignment | T06, T23, T24 | 3 |
| FR-04 | Mark assignment complete | T27 | 1 |
| FR-05 | Delete assignment | T07, T08, T25, T26 | 4 |
| FR-06 | Sort by due date | T16 | 1 |
| FR-07 | Filter by course | T15 | 1 |
| FR-08 | Upcoming soon warning | T17, T18, T19 | 3 |

**Total coverage:** All 8 functional requirements have at least one passing test. All 27 tests are mapped to at least one requirement.

---

## 5. Boundary Value Analysis

### 5.1 Title Field (string, required)
| Partition | Test Value | Class | Expected |
|-----------|-----------|-------|----------|
| Valid | `"Chapter 5 Review"` | Valid non-empty string | Accepted |
| Invalid — missing | (key absent) | Missing required field | ValueError (T09) |
| Invalid — blank | `"   "` | Whitespace-only string | ValueError (T10) |

### 5.2 Priority Field (enum)
| Partition | Test Value | Class | Expected |
|-----------|-----------|-------|----------|
| Valid | `"low"`, `"medium"`, `"high"` | Valid enum member | Accepted |
| Invalid | `"urgent"`, `"1"`, `""` | Outside enum | ValueError (T11) |

### 5.3 Due Date Field (YYYY-MM-DD)
| Partition | Test Value | Class | Expected |
|-----------|-----------|-------|----------|
| Valid | `"2026-04-01"` | Correct format, real date | Accepted |
| Invalid format | `"03/21/2026"` | Wrong separator | ValueError (T12) |
| Invalid date | `"2026-02-30"` | Correct format, impossible date | ValueError (T13) |

### 5.4 Upcoming Soon Window (48-hour boundary)
| Partition | Due offset | Expected |
|-----------|-----------|----------|
| Well inside | due in 24h, incomplete | True (T17) |
| Well outside | due in 72h, incomplete | False (T18) |
| Completed override | due in 1h, completed | False (T19) |

---

## 6. Equivalence Class Summary

| Input | Valid Classes | Invalid Classes |
|-------|--------------|-----------------|
| Title | Non-empty, non-blank string (any length 1–200) | Missing, blank/whitespace-only, absent key |
| Course | Non-empty, non-blank string (any length 1–100) | Missing, blank/whitespace-only, absent key |
| Due Date | Valid ISO 8601 date (YYYY-MM-DD) | Wrong format (MM/DD/YYYY, YYYY/MM/DD), impossible date |
| Priority | `"low"` OR `"medium"` OR `"high"` | Any string not in that set, missing key |
| Assignment ID (for PUT/DELETE/PATCH) | Existing UUID in data store | UUID not in store, arbitrary string |
