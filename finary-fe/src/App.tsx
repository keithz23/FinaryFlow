import { useState } from "react";
import { Menu } from "lucide-react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import SettingsPage from "./pages/Settings";
import ReportsPage from "./pages/Reports";
import GoalsPage from "./pages/Goals";
import BudgetsPage from "./pages/Budgets";
import TransactionsPage from "./pages/Transactions";
import Sidebar from "./components/Sidebar";
import { useAuthStore } from "./store/useAuthStore";
import { useAuthSync } from "./hooks/useAuthSync";

function App() {
  const { user, isLoading } = useAuthStore();

  useAuthSync({
    runOnMount: true,
    refetchOnFocus: true,
    refetchIntervalMs: 5 * 60_000,
  });

  const [activeItem, setActiveItem] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <Dashboard />;
      case "transactions":
        return <TransactionsPage />;
      case "budgets":
        return <BudgetsPage />;
      case "goals":
        return <GoalsPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 capitalize">
              {activeItem}
            </h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;
