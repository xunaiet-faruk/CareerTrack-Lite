import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;