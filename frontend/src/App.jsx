import { useState, useEffect, useMemo } from "react";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  toggleComplete,
} from "./api";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentList from "./components/AssignmentList";
import FilterSort from "./components/FilterSort";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "./components/ui/sidebar";
import "./App.css";

function SidebarBrand({ openAddForm }) {
  const { open } = useSidebar();
  return (
    <>
      <SidebarHeader>
        <div style={{ display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", gap: "8px" }}>
          {open && (
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "20px", fontWeight: 800, color: "#0d2d7a", letterSpacing: "-0.02em", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                The Scholarly Curator
              </h1>
              <p style={{ fontSize: "11px", color: "#757682", fontWeight: 500, marginTop: "3px" }}>Academic Excellence</p>
            </div>
          )}
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Curated List">
              <span className="material-symbols-outlined" style={{ fontSize: "20px", flexShrink: 0 }}>auto_awesome</span>
              {open && <span>Curated List</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {open ? (
          <button
            onClick={openAddForm}
            style={{ width: "100%", marginBottom: "8px", padding: "11px 16px", background: "#0d2d7a", color: "white", borderRadius: "9999px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "'Manrope', system-ui, sans-serif", boxShadow: "0 4px 12px rgba(13,45,122,0.25)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
            Quick Add Task
          </button>
        ) : (
          <button
            onClick={openAddForm}
            title="Quick Add Task"
            style={{ width: "100%", marginBottom: "8px", padding: "11px 0", background: "#0d2d7a", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(13,45,122,0.25)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add</span>
          </button>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <span className="material-symbols-outlined" style={{ fontSize: "20px", flexShrink: 0 }}>settings</span>
              {open && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Support">
              <span className="material-symbols-outlined" style={{ fontSize: "20px", flexShrink: 0 }}>help</span>
              {open && <span>Support</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [sortBy, setSortBy] = useState("due_date");
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

  useEffect(() => { loadAssignments(); }, [filterCourse, sortBy]);

  const courses = useMemo(
    () => [...new Set(assignments.map((a) => a.course))].sort(),
    [assignments]
  );

  const dueSoonCount = useMemo(
    () => assignments.filter((a) => a.upcoming_soon && !a.completed).length,
    [assignments]
  );

  const priorityCount = assignments.filter((a) => !a.completed).length;

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

  function openAddForm() {
    setEditingAssignment(null);
    setShowForm(true);
  }

  return (
    <SidebarProvider>
      {/* ── shadcn Sidebar ── */}
      <Sidebar>
        <SidebarBrand openAddForm={openAddForm} />
      </Sidebar>

      {/* ── Main content ── */}
      <SidebarInset>
        {/* Top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: "1px solid #e3e1e9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <SidebarTrigger className="md:hidden" />
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "22px", fontWeight: 800, color: "#0d2d7a", letterSpacing: "-0.02em" }}>
              Your Dashboard
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button style={{ padding: "8px", color: "#757682", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex" }}>
              <span className="material-symbols-outlined">search</span>
            </button>
            <button style={{ padding: "8px", color: "#757682", background: "none", border: "none", cursor: "pointer", borderRadius: "50%", display: "flex", position: "relative" }}>
              <span className="material-symbols-outlined">notifications</span>
              {dueSoonCount > 0 && (
                <span style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", background: "#ba1a1a", borderRadius: "50%" }} />
              )}
            </button>
          </div>
        </header>

        {/* Error banner */}
        {apiError && (
          <div style={{ margin: "16px 32px 0", background: "#ffdad6", color: "#93000a", padding: "12px 16px", borderRadius: "12px", fontSize: "14px", fontWeight: 500 }}>
            {apiError}
          </div>
        )}

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "40px 40px 80px", maxWidth: "1280px", width: "100%", margin: "0 auto", fontFamily: "'Manrope', system-ui, sans-serif" }}>
          {/* Hero stats */}
          <section style={{ marginBottom: "40px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
            <div style={{ maxWidth: "520px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#0d2d7a", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Overview</span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "30px", fontWeight: 800, color: "#1a1b20", lineHeight: 1.25 }}>
                Focus on the path ahead. You have{" "}
                <span style={{ color: "#0d2d7a" }}>{priorityCount} {priorityCount === 1 ? "priority" : "priorities"}</span> this week.
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#f4f3fa", padding: "16px 28px", borderRadius: "16px", minWidth: "110px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "#0d2d7a", fontFamily: "'Plus Jakarta Sans', system-ui" }}>{String(dueSoonCount).padStart(2, "0")}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#515f76", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Due Soon</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#f4f3fa", padding: "16px 28px", borderRadius: "16px", minWidth: "110px" }}>
                <span style={{ fontSize: "32px", fontWeight: 800, color: "#763a00", fontFamily: "'Plus Jakarta Sans', system-ui" }}>{String(assignments.length).padStart(2, "0")}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#515f76", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Total</span>
              </div>
            </div>
          </section>

          {/* Filter / sort */}
          <FilterSort
            courses={courses}
            filterCourse={filterCourse}
            sortBy={sortBy}
            onFilterChange={setFilterCourse}
            onSortChange={setSortBy}
          />

          {/* Assignment list */}
          <AssignmentList
            assignments={assignments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            onAdd={openAddForm}
          />
        </main>
      </SidebarInset>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl flex justify-around items-center py-3 px-2 z-50 border-t border-[#e3e1e9]">
        <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "#0d2d7a", background: "none", border: "none", cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>List</span>
        </button>
        <div style={{ position: "relative", top: "-20px" }}>
          <button
            onClick={openAddForm}
            style={{ background: "#0d2d7a", color: "white", width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(13,45,122,0.4)", border: "4px solid white", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>add</span>
          </button>
        </div>
      </nav>

      {/* ── Desktop FAB ── */}
      <button
        onClick={openAddForm}
        className="hidden md:flex fixed bottom-10 right-10 bg-[#0d2d7a] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-40 group items-center gap-2"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>edit_square</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap text-sm">
          Add Assignment
        </span>
      </button>

      {/* ── Modal form ── */}
      {showForm && (
        <div className="modal-backdrop" onClick={handleCancel}>
          <div onClick={(e) => e.stopPropagation()}>
            <AssignmentForm
              initialData={editingAssignment}
              courses={courses}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
