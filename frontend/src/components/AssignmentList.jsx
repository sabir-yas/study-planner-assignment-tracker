import AssignmentCard from "./AssignmentCard";

export default function AssignmentList({ assignments, onEdit, onDelete, onToggleComplete }) {
  if (assignments.length === 0) {
    return <p className="empty-state">No assignments yet. Add one above!</p>;
  }

  return (
    <div className="assignment-list">
      {assignments.map((a) => (
        <AssignmentCard
          key={a.id}
          assignment={a}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
