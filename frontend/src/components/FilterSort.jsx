export default function FilterSort({ courses, filterCourse, sortBy, onFilterChange, onSortChange }) {
  return (
    <div className="filter-sort">
      <label>
        Filter by Course:
        <select value={filterCourse} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label>
        Sort:
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="">None</option>
          <option value="due_date">Due Date (Soonest First)</option>
        </select>
      </label>
    </div>
  );
}
