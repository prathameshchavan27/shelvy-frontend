import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Sidebar } from "../components/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}


const DashboardLayout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar - fixed position */}
      <div className="fixed left-0 top-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Main content area with sidebar spacing */}
      <div className="flex flex-col flex-1 ml-16">

        {/* Navbar - fixed at top */}
        <div className="fixed top-0 right-0 left-16 z-30 bg-white shadow">
          <Navbar title={title} />
        </div>

        {/* Main content scrolls */}
        <main className="overflow-y-auto pt-16 p-3 bg-gray-50 min-h-screen">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
