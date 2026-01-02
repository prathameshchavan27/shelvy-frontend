import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Layers, LogOutIcon, Package, Package2, ShoppingCartIcon } from "lucide-react";
import { ShelvyLogo } from "../assets/ShelvyLogo";
import { api } from "../api/client";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

export const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    {
      label: "Products",
      icon: <Box className="w-6 h-6 text-blue-700" />,
      to: "/products",
    },
    {
      label: "Inventory",
      icon: <Layers className="w-6 h-6 text-blue-700" />,
      to: "/",
    },
    {
      label: "Bundles",
      icon: <Package2 className="w-6 h-6 text-blue-700" />,
      to: "/bundles",
    },
    {
      label: "Receiving",
      icon: <ShoppingCartIcon className="w-6 h-6 text-blue-700" />,
      to: "/receiving",
    }
  ];
  const logout = async() => {
    try {
      const res = await api.delete('logout');
      if (res.status === 200) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }

  }

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`h-screen border-r bg-white shadow-sm transition-all duration-300  
        ${expanded ? "w-56" : "w-16"}`}
    >
        <nav className="flex flex-row items-center gap-2 p-3 border-b mt-1 transition text-gray-900">
            <ShelvyLogo />  
            {expanded && <b className="text-lg">Shelvy</b>}
         </nav>
        <nav className="flex flex-col gap-2 p-2 mt-4">
            {menuItems.map((item) => (
            <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-100 transition text-gray-800"
            >
                {item.icon}
                {expanded && <span className="text-lg">{item.label}</span>}
            </Link>
            ))}
        </nav>
        <div className="absolute bottom-12 flex flex-col gap-2 p-2 mt-4">
             <button
                onClick={logout}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-100 transition text-gray-800"
            >
                <LogOutIcon className="w-6 h-6 text-blue-700" />
                {expanded && <span className="text-lg">Logout</span>}
            </button>
        </div>
        <span className="absolute bottom-4 left-4 text-xs text-gray-400">v1.0.0</span>
    </aside>
  );
};
