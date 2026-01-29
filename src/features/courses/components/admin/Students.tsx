import { useEffect, useState } from 'react';
import { Search, Bell } from 'lucide-react';

// --- UI & LAYOUT IMPORTS ---
import { 
  SidebarProvider, 
  SidebarInset, 
} from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "./dashboard/AdminSidebar";
import { Input } from '@/shared/components/ui/input'; 

// --- DATA & COMPONENTS ---
import { StudentPerformanceTable } from './dashboard/StudentPerformanceTable';
import { fetchStudents, type Student } from '@/features/courses/data/mockData';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      const data = await fetchStudents();
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    };
    loadStudents();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [search, students]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AdminSidebar />
        
        <SidebarInset className="bg-transparent">
          {/* Main Top Header */}
          <header className="flex h-16 items-center justify-between px-8 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students, courses, modules..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          <main className="p-8 space-y-8">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Students</h1>
              <p className="text-slate-500">Manage and monitor all enrolled students</p>
            </div>

            {/* Performance Table Section */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <StudentPerformanceTable students={filteredStudents} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}