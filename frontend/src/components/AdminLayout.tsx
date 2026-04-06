import { Outlet } from "react-router-dom";

import { AdminSidebar } from "./AdminSidebar";

import { TopHeader } from "./TopHeader";



export function AdminLayout() {

  return (

    <div className="flex min-h-screen w-full">

      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">

        <TopHeader />

        <main className="flex-1 overflow-auto">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

