/**
 * Returns a human-readable relative time string for a due date string (YYYY-MM-DD).
 * Examples: "Due in 4 hours", "Tomorrow, 11:59 PM", "Friday, Oct 24", "Completed Oct 20"
 */
export function formatDueDate(due_date, completed, created_at) {
  if (completed) {
    const d = new Date(created_at || due_date);
    return `Completed ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }

  // due_date is YYYY-MM-DD — parse as local midnight
  const [year, month, day] = due_date.split("-").map(Number);
  const due = new Date(year, month - 1, day, 23, 59, 0);
  const now = new Date();
  const diffMs = due - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) return `Overdue`;
  if (diffHours < 24) return `Due in ${Math.ceil(diffHours)} hour${Math.ceil(diffHours) === 1 ? "" : "s"}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (due.toDateString() === tomorrow.toDateString()) return "Tomorrow, 11:59 PM";

  return due.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

/**
 * Returns status label based on priority and due date proximity.
 */
export function getStatusLabel(assignment) {
  if (assignment.completed) return "Done";
  if (assignment.upcoming_soon) return "Urgent";
  const [year, month, day] = assignment.due_date.split("-").map(Number);
  const due = new Date(year, month - 1, day);
  const now = new Date();
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);
  if (diffDays <= 3) return "Upcoming";
  return "Planned";
}
