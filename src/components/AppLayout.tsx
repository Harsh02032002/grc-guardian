import { Outlet } from "react-router-dom";
import { GRCSidebar } from "./GRCSidebar";
import { TopHeader } from "./TopHeader";

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <GRCSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
