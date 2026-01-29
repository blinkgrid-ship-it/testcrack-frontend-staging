import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Video,
  BookMarked,
  TrendingUp,
  Star,
  User,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { StepIndicator } from "@/features/speed-assessment/components/StepIndicator";

interface Step {
  id: string;
  label: string;
  shortLabel?: string;
}

interface NavbarProps {
  showNavItems?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showUpgradeButton?: boolean;
  onUpgradeClick?: () => void;
  showStepIndicator?: boolean;
  currentStep?: string;
  steps?: Step[];
  onStepClick?: (stepId: string) => void;
  allowStepNavigation?: boolean;
}

export function Navbar({
  showNavItems = true,
  activeTab,
  onTabChange,
  showUpgradeButton = true,
  onUpgradeClick,
  showStepIndicator = false,
  currentStep,
  steps = [],
  onStepClick,
  allowStepNavigation = false,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "courses", label: "Courses", icon: GraduationCap, route: "/courses" },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "youtube", label: "Videos", icon: Video },
    { id: "guides", label: "Study Guides", icon: BookMarked },
    { id: "progress", label: "Progress", icon: TrendingUp },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.route) {
      navigate(item.route);
    } else if (location.pathname === "/" && onTabChange) {
      onTabChange(item.id);
    } else {
      navigate("/");
    }
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === "/" && onTabChange) {
      onTabChange("dashboard");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
      {/* Updated with apple-glass and improved height/spacing */}
      <nav className="apple-glass border-b border-slate-200/50 sticky top-0 z-50 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center">
            
            <div className="flex items-center space-x-8 flex-1">
              {/* Logo with tighter tracking for a premium feel */}
              <button
                onClick={handleLogoClick}
                className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                TestCrack
              </button>

              {/* Desktop Navigation - Apple Style Segmented Control */}
              {showNavItems && (
                <div className="hidden lg:flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item)}
                        className={`px-4 py-1.5 text-sm font-medium transition-all rounded-lg ${
                          isActive 
                            ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* User Actions Grouped */}
              <div className="flex items-center bg-slate-100/50 rounded-xl p-1">
                <Button
                  variant="ghost"
                  onClick={handleProfileClick}
                  className="text-slate-600 hover:bg-white hover:shadow-sm h-8 w-8 p-0 rounded-lg transition-all"
                  size="sm"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-sm h-8 w-8 p-0 rounded-lg transition-all"
                  size="sm"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Upgrade Button - Sharp and Pro Look */}
              {showUpgradeButton && (
                <Button
                  onClick={onUpgradeClick}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-4 h-9 font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95"
                  size="sm"
                >
                  <Star className="h-3.5 w-3.5 mr-1.5 fill-yellow-400 text-yellow-400" />
                  Upgrade
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              {showNavItems && (
                <Button
                  variant="ghost"
                  className="lg:hidden p-2 rounded-xl bg-slate-100/50"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Floating iOS Style */}
      {showNavItems && mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-20 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-[24px] border border-white/20 shadow-2xl p-4 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleNavClick(item)}
                    className={`w-full justify-start text-base py-6 rounded-2xl transition-all ${
                      isActive ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      {showStepIndicator && currentStep && steps.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm border-b border-slate-100">
          <StepIndicator
            currentStep={currentStep}
            steps={steps}
            onStepClick={onStepClick}
            allowNavigation={allowStepNavigation}
          />
        </div>
      )}
    </>
  );
}