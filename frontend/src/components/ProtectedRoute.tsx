import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
  requiredModule?: string;
}

export function ProtectedRoute({ children, requiredRole, requiredModule }: ProtectedRouteProps) {
  const { user, token, hasHydrated, isLoading } = useAuthStore();

  if (!hasHydrated || (token && !user && isLoading)) {
    return null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requiredModule && user.role !== "superadmin") {
    if (!user.assignedModules.includes(requiredModule) && !user.assignedModules.includes("all")) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
