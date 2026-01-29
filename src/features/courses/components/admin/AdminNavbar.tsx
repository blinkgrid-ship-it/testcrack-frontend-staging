import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { 
  LayoutDashboard, 
  BarChart3, 
  LogOut, 
  Bell,
  GraduationCap,
  ChevronLeft,
  Home,
  Globe,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/courses/admin/dashboard" },
    { id: "analytics", label: "Analytics", icon: BarChart3, route: "/courses/admin/analytics" },
  ];

  const activeTab = navItems.find(item => item.route === location.pathname)?.id || "dashboard";

  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 flex flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-gray-900">
                TESTCRACK
              </span>
              <span className="block text-xs text-gray-500 uppercase tracking-wide">
                Instructor
              </span>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => navigate(item.route)}
                className={`w-full justify-start space-x-3 h-12 rounded-lg ${
                  isActive 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Footer Icon */}
        <div className="p-4 border-t border-gray-200">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
        </div>
      </aside>

      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-6">
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

        <div className="flex items-center space-x-4">
          {/* Home Icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
          </Button>

          {/* Language Selector */}
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:bg-gray-100 rounded-lg space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm">English</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Student View Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden lg:flex items-center space-x-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => navigate("/courses")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Student View</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {user?.email?.split('@')[0] || "Instructor"}
              </p>
              <p className="text-xs text-indigo-600 font-medium">
                Pro Mentor
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 hover:bg-transparent"
              onClick={() => navigate("/profile")}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.[0].toUpperCase() || "I"}
              </div>
            </Button>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>

          {/* Logout */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={signOut}
            className="text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
    </>
  );
};