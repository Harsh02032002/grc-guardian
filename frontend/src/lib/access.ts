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

export const getUserAllowedModules = (user: User | null | undefined) => {
  if (!user) return [];
  if (user.role === "superadmin") return ["all"];
  if (user.role === "client") return DEFAULT_CLIENT_MODULES;
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