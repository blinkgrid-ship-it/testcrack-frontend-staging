import { BarChart3, Search, Bell } from 'lucide-react';
import { 
  SidebarProvider, 
  SidebarInset, 
} from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "./dashboard/AdminSidebar";
import { Input } from "@/shared/components/ui/input";

export default function Analytics() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AdminSidebar />
        
        <SidebarInset className="bg-transparent">
          {/* Reusable Header */}
          <header className="flex h-16 items-center justify-between px-8 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search analytics..." 
                className="pl-10 bg-slate-50 border-none h-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">Dr. Sharma</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  DI
                </div>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-500">Deep dive into course performance metrics</p>
            </div>

            {/* Placeholder Content */}
            <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-slate-200 bg-white/50">
              <div className="rounded-full bg-indigo-50 p-4">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Analytics Coming Soon</h2>
              <p className="text-slate-500 text-center max-w-xs">
                Detailed analytics and reporting features are currently under development.
              </p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}