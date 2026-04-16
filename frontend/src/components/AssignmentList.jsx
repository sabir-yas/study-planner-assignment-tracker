import AssignmentCard from "./AssignmentCard";

export default function AssignmentList({ assignments, onEdit, onDelete, onToggleComplete, onAdd }) {
  if (assignments.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center text-center px-4">
        <div className="w-24 h-24 bg-[#f4f3fa] rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-[#c5c6d3]">spa</span>
        </div>
        <h3 className="text-2xl font-bold text-[#1a1b20] mb-2">A Moment of Serenity</h3>
        <p className="text-[#515f76] max-w-xs mx-auto text-sm">
          Your curated list is currently clear. Take this time to reflect or start a new academic pursuit.
        </p>
        <button
          onClick={onAdd}
          className="mt-8 bg-[#0d2d7a] text-white rounded-full px-8 py-3 font-bold hover:scale-105 transition-transform text-sm"
        >
          Add Assignment
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
