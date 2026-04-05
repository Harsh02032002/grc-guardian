import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { canAccessModule, getDefaultRouteForUser } from "@/lib/access";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
  requiredModule?: string;
}

export function ProtectedRoute({ children, requiredRole, requiredModule }: ProtectedRouteProps) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const fallbackRoute = getDefaultRouteForUser(user);

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  if (requiredModule && !canAccessModule(user, requiredModule)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
}
