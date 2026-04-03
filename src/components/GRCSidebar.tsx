import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  AlertTriangle,
  Shield,
  FileCheck,
  ClipboardCheck,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Wrench,
} from "lucide-react";

interface SubItem { title: string; url: string; }
interface MenuItem { title: string; icon: React.ElementType; url?: string; subItems?: SubItem[]; }

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  {
    title: "Configuration",
    icon: Wrench,
    subItems: [
      { title: "Asset Categories", url: "/config/asset-categories" },
      { title: "Asset Classification", url: "/config/asset-classification" },
      { title: "Retention Period", url: "/config/retention-period" },
      { title: "Department", url: "/config/department" },
      { title: "Asset ID Format", url: "/config/asset-id-format" },
      { title: "Asset Type", url: "/config/asset-type" },
      { title: "Location", url: "/config/location" },
      { title: "Risk Categories", url: "/config/risk-categories" },
      { title: "Risk Subcategories", url: "/config/risk-subcategories" },
      { title: "Risk Owners", url: "/config/risk-owners" },
      { title: "Business Impact Guidelines", url: "/config/impact" },
      { title: "CIA Matrix Configuration", url: "/config/cia-matrix" },
    ],
  },
  {
    title: "Asset Management",
    icon: Box,
    subItems: [
      { title: "Asset Register", url: "/assets" },
      { title: "Add Asset", url: "/assets/add" },
    ],
  },
  {
    title: "Risk Management",
    icon: AlertTriangle,
    subItems: [
      { title: "Risk Register", url: "/risks" },
      { title: "Add Risk", url: "/risks/add" },
      { title: "Risk Library", url: "/risks/library" },
    ],
  },
  {
    title: "Controls Management",
    icon: Shield,
    subItems: [
      { title: "Controls Register", url: "/controls" },
      { title: "Add Control", url: "/controls/add" },
    ],
  },
  {
    title: "Risk Treatment",
    icon: FileCheck,
    subItems: [
      { title: "Treatment Register", url: "/treatments" },
      { title: "Add Treatment Plan", url: "/treatments/add" },
    ],
  },
  { title: "Audit & Version Control", icon: ClipboardCheck, url: "/audit" },
  { title: "Reports & Analytics", icon: BarChart3, url: "/reports" },
];

export function GRCSidebar() {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Configuration": true,
    "Asset Management": true,
    "Risk Management": true,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-sidebar-primary" />
          <div>
            <h1 className="text-base font-bold text-sidebar-accent-foreground tracking-tight">GRC Platform</h1>
            <p className="text-[10px] text-sidebar-foreground">Governance · Risk · Compliance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.url) {
            return (
              <NavLink key={item.title} to={item.url} end={item.url === "/"}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                <item.icon className="h-4 w-4 shrink-0" /><span>{item.title}</span>
              </NavLink>
            );
          }
          const isOpen = openMenus[item.title] ?? false;
          return (
            <div key={item.title}>
              <button onClick={() => toggleMenu(item.title)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
              {isOpen && item.subItems && (
                <div className="ml-6 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.subItems.map((sub) => (
                    <NavLink key={sub.url} to={sub.url}
                      className={({ isActive }) => `block px-3 py-2 rounded-md text-xs transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                      {sub.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground">v1.0.0 · Enterprise Edition</p>
      </div>
    </aside>
  );
}
