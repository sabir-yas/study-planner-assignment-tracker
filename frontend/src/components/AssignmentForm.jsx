import { useState, useEffect } from "react";

const EMPTY = { title: "", course: "", due_date: "", priority: "medium" };

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #c5c6d3",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#1a1b20",
  fontFamily: "'Manrope', system-ui, sans-serif",
  outline: "none",
  background: "white",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#444651",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "6px",
};

export default function AssignmentForm({ initialData, courses, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [useCustomCourse, setUseCustomCourse] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = initialData ? { ...initialData } : EMPTY;
    setForm(data);
    // If editing and course isn't in existing courses list, show text input
    if (initialData && courses && courses.length > 0 && !courses.includes(initialData.course)) {
      setUseCustomCourse(true);
    } else {
      setUseCustomCourse(false);
    }
    setError("");
  }, [initialData]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleCourseSelect(e) {
    const val = e.target.value;
    if (val === "__new__") {
      setUseCustomCourse(true);
      setForm((f) => ({ ...f, course: "" }));
    } else {
      setForm((f) => ({ ...f, course: val }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.course.trim()) { setError("Course is required."); return; }
    if (!form.due_date) { setError("Due date is required."); return; }
    setError("");
    onSave(form);
  }

  const hasCourses = courses && courses.length > 0;

  return (
    <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: "480px", padding: "36px", fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#0d2d7a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
            {initialData ? "Edit Assignment" : "Add Assignment"}
          </p>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "20px", fontWeight: 800, color: "#1a1b20", lineHeight: 1.2 }}>
            {initialData ? "Refining your entry." : "Refining your academic collection."}
          </h2>
        </div>
        <button type="button" onClick={onCancel} style={{ padding: "6px", color: "#757682", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex", flexShrink: 0, marginLeft: "12px" }}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {error && (
        <p style={{ background: "#ffdad6", color: "#93000a", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px", fontWeight: 500 }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Assignment Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Neural Networks Lab Report"
            style={inputStyle}
          />
        </div>

        {/* Course */}
        <div>
          <label style={labelStyle}>Course</label>
          {hasCourses && !useCustomCourse ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <select
                value={form.course}
                onChange={handleCourseSelect}
                style={{ ...inputStyle, appearance: "auto" }}
              >
                <option value="">Select a Course</option>
                {courses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__new__">+ Enter new course...</option>
              </select>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. CSCI 3508"
                style={inputStyle}
                autoFocus={useCustomCourse}
              />
              {hasCourses && (
                <button
                  type="button"
                  onClick={() => { setUseCustomCourse(false); setForm((f) => ({ ...f, course: "" })); }}
                  style={{ fontSize: "12px", color: "#0d2d7a", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontWeight: 600 }}
                >
                  ← Pick from existing courses
                </button>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label style={labelStyle}>Due Date</label>
          <input
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Priority */}
        <div>
          <label style={labelStyle}>Priority Level</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { value: "low",    label: "Low",    active: "#0d2d7a" },
              { value: "medium", label: "Medium", active: "#763a00" },
              { value: "high",   label: "High",   active: "#ba1a1a" },
            ].map(({ value, label, active }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, priority: value }))}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: `1.5px solid ${form.priority === value ? active : "#c5c6d3"}`,
                  background: form.priority === value ? active : "white",
                  color: form.priority === value ? "white" : "#757682",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "'Manrope', system-ui, sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, padding: "11px", borderRadius: "9999px", border: "1.5px solid #c5c6d3", color: "#515f76", fontWeight: 700, fontSize: "14px", background: "white", cursor: "pointer", fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ flex: 1, padding: "11px", borderRadius: "9999px", background: "#0d2d7a", color: "white", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>save</span>
            {initialData ? "Save Changes" : "Save Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
}
