import { useState, useEffect } from "react";

const EMPTY = { title: "", course: "", due_date: "", priority: "medium" };

export default function AssignmentForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData ? { ...initialData } : EMPTY);
    setError("");
  }, [initialData]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.course.trim()) { setError("Course is required."); return; }
    if (!form.due_date) { setError("Due date is required."); return; }
    setError("");
    onSave(form);
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <h2>{initialData ? "Edit Assignment" : "Add Assignment"}</h2>

      {error && <p className="form-error">{error}</p>}

      <label>
        Title *
        <input name="title" value={form.title} onChange={handleChange} placeholder="Assignment title" />
      </label>

      <label>
        Course *
        <input name="course" value={form.course} onChange={handleChange} placeholder="e.g. CSCI 3508" />
      </label>

      <label>
        Due Date *
        <input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
      </label>

      <fieldset>
        <legend>Priority</legend>
        {["low", "medium", "high"].map((p) => (
          <label key={p} className="radio-label">
            <input
              type="radio"
              name="priority"
              value={p}
              checked={form.priority === p}
              onChange={handleChange}
            />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </label>
        ))}
      </fieldset>

      <div className="form-actions">
        <button type="submit">{initialData ? "Save Changes" : "Add Assignment"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
