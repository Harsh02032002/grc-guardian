import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function apiRequest(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw new Error("Session expired");
    }
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || "API request failed");
  }
  return res.json();
}

// ========== ASSETS ==========
export const assetApi = {
  getAll: () => apiRequest("/assets"),
  getById: (id: string) => apiRequest(`/assets/${id}`),
  create: (data: any) => apiRequest("/assets", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/assets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/assets/${id}`, { method: "DELETE" }),
};

// ========== RISKS ==========
export const riskApi = {
  getAll: () => apiRequest("/risks"),
  getById: (id: string) => apiRequest(`/risks/${id}`),
  create: (data: any) => apiRequest("/risks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/risks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/risks/${id}`, { method: "DELETE" }),
};

// ========== CONTROLS ==========
export const controlApi = {
  getAll: () => apiRequest("/controls"),
  getById: (id: string) => apiRequest(`/controls/${id}`),
  create: (data: any) => apiRequest("/controls", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/controls/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/controls/${id}`, { method: "DELETE" }),
};

// ========== TREATMENTS ==========
export const treatmentApi = {
  getAll: () => apiRequest("/treatments"),
  getById: (id: string) => apiRequest(`/treatments/${id}`),
  create: (data: any) => apiRequest("/treatments", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/treatments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/treatments/${id}`, { method: "DELETE" }),
};

// ========== CONFIG ==========
export const configApi = {
  getByType: (type: string) => apiRequest(`/config/${type}`),
  create: (data: any) => apiRequest("/config", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/config/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/config/${id}`, { method: "DELETE" }),
  seedDefaults: () => apiRequest("/config/seed/defaults", { method: "POST" }),
};

// ========== AUTH ==========
export const authApi = {
  login: (data: any) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: any) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiRequest("/auth/me"),
};

// ========== ADMIN ==========
export const adminApi = {
  getCompanies: () => apiRequest("/admin/companies"),
  approveCompany: (id: string, isApproved: boolean) =>
    apiRequest(`/admin/companies/${id}/approve`, { method: "PATCH", body: JSON.stringify({ isApproved }) }),
  deleteCompany: (id: string) => apiRequest(`/admin/companies/${id}`, { method: "DELETE" }),
  getUsers: () => apiRequest("/admin/users"),
  createSubAdmin: (data: any) => apiRequest("/admin/users/create-subadmin", { method: "POST", body: JSON.stringify(data) }),
  updateModules: (id: string, modules: string[]) =>
    apiRequest(`/admin/users/${id}/modules`, { method: "PUT", body: JSON.stringify({ assignedModules: modules }) }),
  deleteUser: (id: string) => apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
  getStats: () => apiRequest("/admin/stats"),
};
