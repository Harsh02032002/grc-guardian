import { Search, Bell, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export function TopHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const companyName = user?.companyId && typeof user.companyId === "object" ? user.companyId.name : "";

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets, risks, controls..."
          className="pl-9 h-9 text-sm bg-muted/50 border-none"
        />
      </div>
      <div className="flex items-center gap-4">
        {companyName && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{companyName}</span>
        )}
        <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name || "Guest"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
