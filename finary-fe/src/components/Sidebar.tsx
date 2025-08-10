import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  setActiveItem,
  isOpen,
  toggleSidebar,
}) => {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: CreditCard },
    { id: "budgets", label: "Budgets", icon: PiggyBank },
    { id: "goals", label: "Goals", icon: Target },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto w-64
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Finary</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 hover:cursor-pointer
                ${
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon
                className={`w-5 h-5 ${
                  activeItem === item.id ? "text-blue-600" : ""
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto p-3 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:cursor-pointer">
            <img
              src={
                user?.avatar ||
                "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2"
              }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 mt-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors hover:cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
