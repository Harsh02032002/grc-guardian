import { useState } from "react";

import { NavLink } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

import { canAccessModule } from "@/lib/access";

import {

  LayoutDashboard,

  Box,

  AlertTriangle,

  Wrench,

  Users,

  LogOut,

  Shield,

  ChevronDown,

  ChevronRight,

  UserCheck,

  UserPlus,

} from "lucide-react";



interface SubItem { title: string; url: string }

interface MenuItem {

  title: string;

  icon: React.ElementType;

  url?: string;

  module?: string;

  subItems?: SubItem[];

}



const adminMenuItems: MenuItem[] = [

  { title: "Dashboard", icon: LayoutDashboard, url: "/admin", module: "dashboard" },

  { title: "Assets", icon: Box, url: "/admin/assets", module: "assets" },

  { title: "Risks", icon: AlertTriangle, url: "/admin/risks", module: "risks" },

  {

    title: "Configuration",

    icon: Wrench,

    module: "configuration",

    subItems: [

      { title: "Risk Owners", url: "/admin/config/risk-owners" },

      { title: "Risk Categories", url: "/admin/config/risk-categories" },

      { title: "Risk Subcategories", url: "/admin/config/risk-subcategories" },

      { title: "Asset Categories", url: "/admin/config/asset-categories" },

      { title: "Asset Classification", url: "/admin/config/asset-classification" },

      { title: "Retention Period", url: "/admin/config/retention-period" },

      { title: "Department", url: "/admin/config/department" },

      { title: "Asset ID Format", url: "/admin/config/asset-id-format" },

      { title: "Asset Type", url: "/admin/config/asset-type" },

      { title: "Location", url: "/admin/config/location" },

      { title: "Business Impact", url: "/admin/config/impact" },

      { title: "CIA Matrix", url: "/admin/config/cia-matrix" },

    ],

  },

  {

    title: "User Management",

    icon: Users,

    module: "dashboard", // always visible for admins

    subItems: [

      { title: "Approve Users", url: "/admin/users/approve" },

      { title: "Create Sub-Admin", url: "/admin/users/create-subadmin" },

    ],

  },

];



export function AdminSidebar() {

  const { user, logout } = useAuthStore();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({

    Configuration: true,

    "User Management": true,

  });



  const toggleMenu = (title: string) => {

    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));

  };



  const filteredMenuItems = adminMenuItems.filter((item) => {

    if (!user) return false;

    if (user.role === "superadmin") return true;

    if (!item.module) return true;

    return canAccessModule(user, item.module);

  });



  return (

    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">

      <div className="px-5 py-5 border-b border-sidebar-border">

        <div className="flex items-center gap-2">

          <Shield className="h-7 w-7 text-sidebar-primary" />

          <div>

            <h1 className="text-base font-bold text-sidebar-accent-foreground tracking-tight">EzRiskManagement</h1>

            <p className="text-[10px] text-sidebar-foreground">Admin Portal</p>

          </div>

        </div>

      </div>



      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

        {filteredMenuItems.map((item) => {

          if (item.url) {

            return (

              <NavLink

                key={item.title}

                to={item.url}

                end={item.url === "/admin"}

                className={({ isActive }) =>

                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${

                    isActive

                      ? "bg-sidebar-accent text-sidebar-primary font-medium"

                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

                  }`

                }

              >

                <item.icon className="h-4 w-4 shrink-0" />

                <span>{item.title}</span>

              </NavLink>

            );

          }



          const isOpen = openMenus[item.title] ?? false;



          return (

            <div key={item.title}>

              <button

                onClick={() => toggleMenu(item.title)}

                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"

              >

                <item.icon className="h-4 w-4 shrink-0" />

                <span className="flex-1 text-left">{item.title}</span>

                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}

              </button>

              {isOpen && item.subItems && (

                <div className="ml-6 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">

                  {item.subItems.map((sub) => (

                    <NavLink

                      key={sub.url}

                      to={sub.url}

                      className={({ isActive }) =>

                        `block px-3 py-2 rounded-md text-xs transition-colors ${

                          isActive

                            ? "bg-sidebar-accent text-sidebar-primary font-medium"

                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

                        }`

                      }

                    >

                      {sub.title}

                    </NavLink>

                  ))}

                </div>

              )}

            </div>

          );

        })}

      </nav>



      <div className="px-4 py-3 border-t border-sidebar-border">

        {user && (

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.name}</p>

              <p className="text-[10px] text-sidebar-foreground truncate capitalize">{user.role}</p>

            </div>

            <button onClick={logout} className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors" title="Logout">

              <LogOut className="h-4 w-4" />

            </button>

          </div>

        )}

      </div>

    </aside>

  );

}

