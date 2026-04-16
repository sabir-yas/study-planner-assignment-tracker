export default function FilterSort({ courses, filterCourse, sortBy, onFilterChange, onSortChange }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      {/* Course filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
        <button
          onClick={() => onFilterChange("")}
          className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
            filterCourse === ""
              ? "bg-[#0d2d7a] text-white"
              : "bg-[#e3e1e9] text-[#1a1b20] hover:bg-[#d2d0d8]"
          }`}
        >
          All Courses
        </button>
        {courses.map((c) => (
          <button
            key={c}
            onClick={() => onFilterChange(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filterCourse === c
                ? "bg-[#0d2d7a] text-white"
                : "bg-[#e3e1e9] text-[#1a1b20] hover:bg-[#d2d0d8]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2 bg-[#f4f3fa] rounded-xl px-3 py-2 shrink-0">
        <span className="material-symbols-outlined text-sm text-[#757682]">sort</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent border-none text-sm font-semibold text-[#1a1b20] focus:outline-none cursor-pointer pr-2"
        >
          <option value="due_date">Due Date</option>
          <option value="">None</option>
        </select>
      </div>
    </div>
  );
}
