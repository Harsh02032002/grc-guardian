import type { User } from "@/stores/authStore";



export const DEFAULT_CLIENT_MODULES = ["dashboard", "assets", "risks", "controls", "treatments", "configuration"];



export const MODULE_OPTIONS = [

  { key: "dashboard", label: "Dashboard", route: "/" },

  { key: "assets", label: "Assets", route: "/assets" },

  { key: "risks", label: "Risks", route: "/risks" },

  { key: "controls", label: "Controls", route: "/controls" },

  { key: "treatments", label: "Treatments", route: "/treatments" },

  { key: "configuration", label: "Risk Masters", route: "/risk-owners" },

];



// OSA Admin Modules (for OSA Super Admin and Sub Admin)

export const OSA_MODULE_OPTIONS = [

  { key: "dashboard", label: "Dashboard", route: "/admin" },

  { key: "companies", label: "Company Management", route: "/admin/companies" },

  { key: "users", label: "User Management", route: "/admin/users" },

  { key: "payments", label: "Payment Management", route: "/admin/payments" },

  { key: "resources", label: "Resource Allocation", route: "/admin/resources" },

];



export const getUserAllowedModules = (user: User | null | undefined) => {

  if (!user) return [];

  // OSA Super Admin - full access
  if (user.userType === "osa" && user.role === "superadmin") return ["all"];

  // Company Super Admin - full access to all company modules
  if (user.userType === "client" && user.role === "superadmin") return ["all"];

  // Company Sub-Admin - only assigned modules
  if (user.userType === "client" && user.role === "subadmin") {
    return user.assignedModules?.length ? user.assignedModules : ["dashboard"];
  }

  // Company Users (auditor, auditee, general) - limited read-only modules
  if (user.userType === "client" && ["auditor", "auditee", "general"].includes(user.role)) {
    return ["dashboard", "assets", "risks"]; // Read-only access
  }

  return user.assignedModules || [];

};



export const canAccessModule = (user: User | null | undefined, moduleKey?: string) => {

  if (!user) return false;

  if (!moduleKey) return true;



  const allowedModules = getUserAllowedModules(user);

  return allowedModules.includes("all") || allowedModules.includes(moduleKey);

};



export const getDefaultRouteForUser = (user: User | null | undefined) => {

  if (!user) return "/login";

  if (user.role === "superadmin" || user.role === "subadmin") return "/admin";



  const allowedModules = getUserAllowedModules(user);

  if (allowedModules.includes("all") || allowedModules.includes("dashboard")) {

    return "/";

  }



  return MODULE_OPTIONS.find((moduleItem) => allowedModules.includes(moduleItem.key))?.route || "/login";

};