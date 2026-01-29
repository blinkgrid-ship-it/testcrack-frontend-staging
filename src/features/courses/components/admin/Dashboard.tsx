import { useEffect, useState, useMemo } from 'react';
import { Users, BookOpen, DollarSign, Target, Search, Bell, Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SIDEBAR & UI LAYOUT ---
import { 
  SidebarProvider, 
  SidebarInset, 
} from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "./dashboard/AdminSidebar";
import { Input } from "@/shared/components/ui/input";

// --- DASHBOARD COMPONENTS ---
import { StatCard } from './dashboard/StatCard';
import { ModuleHealthMatrix } from './dashboard/ModuleHealthMatrix';
import { StudentPerformanceTable } from './dashboard/StudentPerformanceTable';

import { 
  fetchCourseStats, 
  fetchModuleHealth, 
  fetchStudents,
  modules,
  type CourseStats,
  type ModuleHealth,
  type Student 
} from '@/features/courses/data/mockData';

// --- LIVE FEED TYPES ---
interface LiveEvent {
  id: string;
  message: string;
  type: 'COMPLETION' | 'STRUGGLE' | 'SYSTEM';
  timestamp: Date;
}

export default function Dashboard() {
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [moduleHealth, setModuleHealth] = useState<ModuleHealth[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Data Loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, moduleData, studentData] = await Promise.all([
          fetchCourseStats(),
          fetchModuleHealth(),
          fetchStudents(),
        ]);
        setStats(statsData);
        setModuleHealth(moduleData);
        setStudents(studentData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Mock WebSocket/Live Stream Logic
  useEffect(() => {
    if (students.length === 0) return;

    const interval = setInterval(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomModule = modules[Math.floor(Math.random() * modules.length)];
      
      // Randomly decide if it's a completion, a struggle caution, or a system alert
      const rand = Math.random();
      let newEvent: LiveEvent;

      if (rand > 0.7) {
        newEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'STRUGGLE',
          message: `Caution: ${Math.floor(Math.random() * 3) + 3} students currently struggling with ${randomModule.name} Q3.`,
          timestamp: new Date()
        };
      } else {
        newEvent = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'COMPLETION',
          message: `${randomStudent.name} just completed ${randomModule.name}.`,
          timestamp: new Date()
        };
      }

      setLiveEvents(prev => [newEvent, ...prev].slice(0, 4)); // Keep latest 4
    }, 6000); // Ticks every 6 seconds

    return () => clearInterval(interval);
  }, [students]);

  const derivedStats = useMemo(() => {
    if (students.length === 0) return null;
    return {
      totalStudents: students.length,
      avgCompletion: Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length)
    };
  }, [students]);

  if (loading) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AdminSidebar />
        
        <SidebarInset className="bg-transparent">
          <header className="flex h-16 items-center justify-between px-8 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students, courses, modules..." 
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
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h1>
              <p className="text-slate-500">Monitor student performance and identify knowledge gaps</p>
            </div>

            {/* Stats Grid */}
            {stats && derivedStats && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Students"
                  value={derivedStats.totalStudents}
                  icon={<Users className="h-5 w-5 text-indigo-600" />}
                  trend={stats.studentGrowth}
                  className="bg-white border-slate-100 shadow-sm"
                />
                <StatCard
                  title="Active Courses"
                  value={stats.activeCourses}
                  icon={<BookOpen className="h-5 w-5 text-indigo-600" />}
                  trend={stats.courseGrowth}
                  className="bg-white border-slate-100 shadow-sm"
                />
                <StatCard
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
                  trend={stats.revenueGrowth}
                  format="currency"
                  className="bg-white border-slate-100 shadow-sm"
                />
                <StatCard
                  title="Avg. Completion"
                  value={derivedStats.avgCompletion}
                  icon={<Target className="h-5 w-5 text-indigo-600" />}
                  trend={stats.completionGrowth}
                  format="percentage"
                  className="bg-white border-slate-100 shadow-sm"
                />
              </div>
            )}

            {/* Matrix & Live Feed Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Matrix (2/3 width) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <ModuleHealthMatrix data={moduleHealth} />
              </div>

              {/* Live Activity Feed (1/3 width) */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-600" />
                    Live Activity
                  </h3>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 animate-pulse">
                    LIVE
                  </span>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {liveEvents.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-10">Waiting for student activity...</p>
                    )}
                    {liveEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-3 rounded-lg border text-sm flex gap-3 transition-colors ${
                          event.type === 'STRUGGLE' 
                            ? 'bg-red-50 border-red-100' 
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="mt-0.5">
                          {event.type === 'STRUGGLE' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`leading-relaxed ${event.type === 'STRUGGLE' ? 'text-red-900 font-medium' : 'text-slate-700'}`}>
                            {event.message}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Performance Table Section */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <StudentPerformanceTable students={students} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}