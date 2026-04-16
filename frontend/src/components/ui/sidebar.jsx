import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext({});

function useSidebar() {
  return React.useContext(SidebarContext);
}

function SidebarProvider({ children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen((o) => !o) }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>{children}</div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ children, className, ...props }) {
  const { open } = useSidebar();
  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 shrink-0 border-r border-[#e3e1e9] bg-[#f4f3fa] overflow-hidden",
        className
      )}
      style={{
        width: open ? "260px" : "64px",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarHeader({ children, className, ...props }) {
  return (
    <div className={cn("px-4 py-5 border-b border-[#e3e1e9]/60", className)} {...props}>
      {children}
    </div>
  );
}

function SidebarContent({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 overflow-y-auto py-4", className)} {...props}>
      {children}
    </div>
  );
}

function SidebarFooter({ children, className, ...props }) {
  return (
    <div className={cn("px-4 py-4 border-t border-[#e3e1e9]/60", className)} {...props}>
      {children}
    </div>
  );
}

function SidebarMenu({ children, className, ...props }) {
  return (
    <ul className={cn("flex flex-col gap-0.5 px-2", className)} {...props}>
      {children}
    </ul>
  );
}

function SidebarMenuItem({ children, className, ...props }) {
  return (
    <li className={cn("list-none", className)} {...props}>
      {children}
    </li>
  );
}

function SidebarMenuButton({ children, className, isActive, tooltip, ...props }) {
  const { open } = useSidebar();
  return (
    <button
      title={!open ? tooltip : undefined}
      data-active={isActive}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
        "text-[#757682] hover:text-[#0d2d7a] hover:bg-white/70",
        isActive && "bg-white text-[#0d2d7a] shadow-sm",
        !open && "justify-center px-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SidebarTrigger({ className, ...props }) {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg text-[#757682] hover:bg-[#eeedf4] transition-colors shrink-0",
        className
      )}
      aria-label="Toggle sidebar"
      {...props}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>menu</span>
    </button>
  );
}

function SidebarInset({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 flex flex-col min-w-0 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export {
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
};
