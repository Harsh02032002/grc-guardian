import { useState } from "react";

import { NavLink } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

import { canAccessModule } from "@/lib/access";

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

  Users,

  LogOut,

} from "lucide-react";



interface SubItem {

  title: string;

  url: string;

}



interface MenuItem {

  title: string;

  icon: React.ElementType;

  url?: string;

  module?: string;

  subItems?: SubItem[];

}



const menuItems: MenuItem[] = [

  { title: "Dashboard", icon: LayoutDashboard, url: "/", module: "dashboard" },

  {

    title: "Configuration",

    icon: Wrench,

    module: "configuration",

    subItems: [

      { title: "Risk Owners", url: "/risk-owners" },

      { title: "Risk Categories", url: "/risks/categories" },

      { title: "Risk Subcategories", url: "/risks/subcategories" },

      { title: "Asset Categories", url: "/config/asset-categories" },

      { title: "Asset Classification", url: "/config/asset-classification" },

      { title: "Retention Period", url: "/config/retention-period" },

      { title: "Department", url: "/config/department" },

      { title: "Asset ID Format", url: "/config/asset-id-format" },

      { title: "Asset Type", url: "/config/asset-type" },

      { title: "Location", url: "/config/location" },

      { title: "Business Impact Guidelines", url: "/config/impact" },

      { title: "CIA Matrix Configuration", url: "/config/cia-matrix" },

    ],

  },

  {

    title: "Assets",

    icon: Box,

    module: "assets",

    subItems: [

      { title: "Asset Register", url: "/assets" },

      { title: "Add Asset", url: "/assets/add" },

    ],

  },

  {

    title: "Risks",

    icon: AlertTriangle,

    module: "risks",

    subItems: [

      { title: "Risk Register", url: "/risks" },

      { title: "Add Risk", url: "/risks/add" },

      { title: "Risk Library", url: "/risks/library" },

    ],

  },

  {

    title: "Controls",

    icon: Shield,

    module: "controls",

    subItems: [

      { title: "Controls Register", url: "/controls" },

      { title: "Add Control", url: "/controls/add" },

    ],

  },

  {

    title: "Treatments",

    icon: FileCheck,

    module: "treatments",

    subItems: [

      { title: "Treatment Register", url: "/treatments" },

      { title: "Add Treatment Plan", url: "/treatments/add" },

    ],

  },

  {

    title: "User Management",

    icon: Users,

    module: "dashboard",

    subItems: [

      { title: "Manage Users", url: "/company/users" },

    ],

  },

];



export function GRCSidebar() {

  const { user, logout } = useAuthStore();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({

    "Configuration": true,

    "Assets": true,

    "Risks": true,

  });



  const toggleMenu = (title: string) => {

    setOpenMenus((prev: Record<string, boolean>) => ({ ...prev, [title]: !prev[title] }));

  };



  // Filter menu items based on user role and assigned modules

  const filteredMenuItems = menuItems.filter((item) => {

    if (!user) return false;

    if (!item.module) return true;

    return canAccessModule(user, item.module);

  });



  return (

    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">

      {/* Logo Section - Just Logo Image */}

      <div className="px-5 py-5 border-b border-sidebar-border">

        <div className="flex items-center justify-center">

          <img 

            src="/logo.png" 

            alt="ezRisk Management" 

            className="h-10 w-auto"

            onError={(e) => {

              // Fallback if logo.png doesn't exist yet

              const target = e.target as HTMLImageElement;

              target.style.display = 'none';

            }}

          />

        </div>

      </div>



      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

        {filteredMenuItems.map((item) => {

          if (item.url) {

            return (

              <NavLink

                key={item.title}

                to={item.url}

                end={item.url === "/"}

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

                {isOpen ? (

                  <ChevronDown className="h-3.5 w-3.5" />

                ) : (

                  <ChevronRight className="h-3.5 w-3.5" />

                )}

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



      {/* User info & logout */}

      <div className="px-4 py-3 border-t border-sidebar-border">

        {user && (

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.name}</p>

              <p className="text-[10px] text-sidebar-foreground truncate">{user.role}</p>

            </div>

            <button

              onClick={logout}

              className="p-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"

              title="Logout"

            >

              <LogOut className="h-4 w-4" />

            </button>

          </div>

        )}

        <p className="text-[10px] text-sidebar-foreground mt-2">ezRisk Management v1.0.0</p>

      </div>

    </aside>

  );

}

