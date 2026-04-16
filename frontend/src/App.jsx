import { useState, useEffect, useMemo } from "react";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  toggleComplete,
} from "./api";
import FilterSort from "./components/FilterSort";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentList from "./components/AssignmentList";
import "./App.css";

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [apiError, setApiError] = useState("");

  async function loadAssignments(course = filterCourse, sort = sortBy) {
    try {
      const data = await fetchAssignments({ course, sort });
      setAssignments(data.assignments);
      setApiError("");
    } catch (e) {
      setApiError(e.message);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [filterCourse, sortBy]);

  const courses = useMemo(
    () => [...new Set(assignments.map((a) => a.course))].sort(),
    [assignments]
  );

  async function handleSave(formData) {
    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, formData);
      } else {
        await createAssignment(formData);
      }
      setShowForm(false);
      setEditingAssignment(null);
      loadAssignments();
    } catch (e) {
      setApiError(e.message);
    }
  }

  function handleEdit(assignment) {
    setEditingAssignment(assignment);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingAssignment(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      loadAssignments();
    } catch (e) {
      setApiError(e.message);
    }
  }

  async function handleToggleComplete(id) {
    try {
      await toggleComplete(id);
      loadAssignments();
    } catch (e) {
      setApiError(e.message);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Study Planner</h1>
        <button
          className="btn-add"
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
        >
          + Add Assignment
        </button>
      </header>

      {apiError && <div className="api-error">{apiError}</div>}

      {showForm && (
        <AssignmentForm
          initialData={editingAssignment}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <FilterSort
        courses={courses}
        filterCourse={filterCourse}
        sortBy={sortBy}
        onFilterChange={setFilterCourse}
        onSortChange={setSortBy}
      />

      <AssignmentList
        assignments={assignments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}
