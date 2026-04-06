import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { canAccessModule } from "@/lib/access";

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

  // Role check
  if (requiredRole && !requiredRole.includes(user.role)) {
    // Admin trying to access client routes → redirect to admin
    if (user.role === "superadmin" || user.role === "subadmin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Module check
  if (requiredModule && !canAccessModule(user, requiredModule)) {
    if (user.role === "superadmin" || user.role === "subadmin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
