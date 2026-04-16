import { formatDueDate, getStatusLabel } from "../utils/time";

const STATUS_STYLES = {
  Urgent:   { badge: { background: "#ffdad6", color: "#93000a" }, borderColor: "#ba1a1a", due: "#ba1a1a" },
  Upcoming: { badge: { background: "#ffdcc5", color: "#713700" }, borderColor: "#763a00", due: "#515f76" },
  Planned:  { badge: { background: "#d2e0fc", color: "#2b4592" }, borderColor: "#2b4592", due: "#515f76" },
  Done:     { badge: { background: "#f1f0f7", color: "#757682" }, borderColor: "#c5c6d3", due: "#515f76" },
};

export default function AssignmentCard({ assignment, onEdit, onDelete, onToggleComplete }) {
  const { id, title, course, due_date, completed, created_at } = assignment;

  const status = getStatusLabel(assignment);
  const styles = STATUS_STYLES[status];
  const relativeTime = formatDueDate(due_date, completed, created_at);

  return (
    <article style={{
      background: "white",
      borderRadius: "14px",
      padding: "20px 20px 20px 24px",
      borderLeft: `4px solid ${styles.borderColor}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      opacity: completed ? 0.6 : 1,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontFamily: "'Manrope', system-ui, sans-serif",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}>
      {/* Top row: status badge + checkbox */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          ...styles.badge,
          fontSize: "10px",
          fontWeight: 700,
          padding: "3px 10px",
          borderRadius: "9999px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textDecoration: completed ? "line-through" : "none",
        }}>
          {status}
        </span>
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggleComplete(id)}
          aria-label={completed ? "Mark incomplete" : "Mark complete"}
          style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#0d2d7a" }}
        />
      </div>

      {/* Title */}
      <h4 style={{
        fontSize: "16px",
        fontWeight: 700,
        color: "#1a1b20",
        lineHeight: 1.3,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        textDecoration: completed ? "line-through" : "none",
        margin: 0,
      }}>
        {title}
      </h4>

      {/* Course */}
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#0d2d7a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {course}
      </span>

      {/* Bottom row: due date + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: styles.due, fontWeight: 600, fontSize: "13px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            {completed ? "check_circle" : "event"}
          </span>
          {relativeTime}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => onEdit(assignment)}
            aria-label="Edit"
            style={{ padding: "6px", color: "#757682", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
          </button>
          <button
            onClick={() => onDelete(id)}
            aria-label="Delete"
            style={{ padding: "6px", color: "#757682", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
