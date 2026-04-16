export default function AssignmentCard({ assignment, onEdit, onDelete, onToggleComplete }) {
  const { id, title, course, due_date, priority, completed, upcoming_soon } = assignment;

  return (
    <div className={`assignment-card priority-${priority} ${completed ? "completed" : ""}`}>
      {upcoming_soon && !completed && (
        <div className="due-soon-banner">Due Soon!</div>
      )}

      <div className="card-header">
        <span className={`priority-badge priority-${priority}`}>{priority}</span>
        <span className="course-badge">{course}</span>
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-due">Due: {due_date}</p>

      <div className="card-actions">
        <button
          className={`btn-complete ${completed ? "btn-undo" : ""}`}
          onClick={() => onToggleComplete(id)}
        >
          {completed ? "Undo" : "Mark Complete"}
        </button>
        <button className="btn-edit" onClick={() => onEdit(assignment)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  );
}
