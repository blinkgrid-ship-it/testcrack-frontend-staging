import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Recommended for smooth "ticking"
import { Student, modules } from '@/features/courses/data/mockData';

interface LiveEvent {
  id: string;
  studentName: string;
  message: string;
  type: 'COMPLETION' | 'STRUGGLE' | 'ACTIVE';
  timestamp: Date;
}

export function LiveActivityFeed({ students }: { students: Student[] }) {
  const [events, setEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    // Simulate incoming "Live" events every 4-7 seconds
    const interval = setInterval(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      const randomModule = modules[Math.floor(Math.random() * modules.length)];
      
      const eventTypes: LiveEvent['type'][] = ['COMPLETION', 'ACTIVE', 'STRUGGLE'];
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

      const newEvent: LiveEvent = {
        id: Math.random().toString(36).substr(2, 9),
        studentName: randomStudent.name,
        timestamp: new Date(),
        type,
        message: type === 'COMPLETION' 
          ? `just completed ${randomModule.name}`
          : type === 'STRUGGLE'
          ? `Caution: struggling with ${randomModule.name} quiz`
          : `started a new session in ${randomModule.name}`
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 5)); // Keep only the latest 5
    }, 5000);

    return () => clearInterval(interval);
  }, [students]);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          Live Activity Feed
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          LIVE STREAM
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-3 rounded-lg border text-sm flex gap-3 ${
                event.type === 'STRUGGLE' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="mt-0.5">
                {event.type === 'STRUGGLE' ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : event.type === 'COMPLETION' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Clock className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-slate-900">
                  <span className="font-semibold">{event.studentName}</span> {event.message}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}