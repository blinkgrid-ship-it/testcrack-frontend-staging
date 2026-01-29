// Mock Data for Testcrack Instructor Dashboard
// This file simulates a backend API. Replace fetch calls with real API endpoints later.

export interface Module {
  id: string;
  name: string;
  description: string;
  totalTopics: number;
}

export interface ModulePerformance {
  moduleId: string;
  moduleName: string;
  readingTimeSec: number;
  quizTimeSec: number;
  accuracyScore: number;
}

export interface KnowledgeGap {
  topic: string;
  module: string;
  accuracyScore: number;
  attempts: number;
  status: 'critical' | 'needs-improvement' | 'developing';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrollmentDate: string;
  coursesEnrolled: number;
  overallProgress: number;
  learningEfficiencyIndex: number; // LEI score 0-100
  masteryQuadrant: 'efficient-mastery' | 'surface-learner' | 'cognitive-overload' | 'slow-mastery';
  modulePerformance: ModulePerformance[];
  knowledgeGaps: KnowledgeGap[];
  totalReadingTime: number;
  totalQuizTime: number;
  avgAccuracy: number;
  lastActive: string;
}

export interface CourseStats {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  avgCompletionRate: number;
  studentGrowth: number;
  courseGrowth: number;
  revenueGrowth: number;
  completionGrowth: number;
}

// Modules data
export const modules: Module[] = [
  { id: 'mod-1', name: 'Quantitative Aptitude', description: 'Numbers, algebra, and arithmetic', totalTopics: 24 },
  { id: 'mod-2', name: 'Logical Reasoning', description: 'Analytical and logical thinking', totalTopics: 18 },
  { id: 'mod-3', name: 'Verbal Ability', description: 'Reading comprehension and grammar', totalTopics: 20 },
  { id: 'mod-4', name: 'Data Interpretation', description: 'Charts, graphs, and data analysis', totalTopics: 15 },
  { id: 'mod-5', name: 'General Knowledge', description: 'Current affairs and static GK', totalTopics: 30 },
  { id: 'mod-6', name: 'English Proficiency', description: 'Advanced grammar and vocabulary', totalTopics: 22 },
];

// Generate realistic student data (Normal students)
const generateModulePerformance = (): ModulePerformance[] => {
  return modules.map(mod => ({
    moduleId: mod.id,
    moduleName: mod.name,
    readingTimeSec: Math.floor(Math.random() * 600) + 400, // 6-16 mins (normal time)
    quizTimeSec: Math.floor(Math.random() * 300) + 200, // 3-8 mins
    accuracyScore: Math.floor(Math.random() * 20) + 78, // 78-98% (good accuracy)
  }));
};

// Generate Medium Risk data: 71% accuracy, 95 mins total time
const generateMediumRiskModulePerformance = (): ModulePerformance[] => {
  // Total time needs to be 95 mins = 5700 seconds
  // Split across 6 modules: ~950 sec each (650 reading + 300 quiz avg)
  return modules.map(mod => ({
    moduleId: mod.id,
    moduleName: mod.name,
    readingTimeSec: 620 + Math.floor(Math.random() * 60), // ~620-680 sec reading
    quizTimeSec: 280 + Math.floor(Math.random() * 40), // ~280-320 sec quiz
    accuracyScore: 69 + Math.floor(Math.random() * 5), // 69-74% accuracy (avg ~71%)
  }));
};

// Generate High Risk data: 55% accuracy, 140 mins total time
const generateHighRiskModulePerformance = (): ModulePerformance[] => {
  // Total time needs to be 140 mins = 8400 seconds
  // Split across 6 modules: ~1400 sec each (1000 reading + 400 quiz avg)
  return modules.map(mod => ({
    moduleId: mod.id,
    moduleName: mod.name,
    readingTimeSec: 950 + Math.floor(Math.random() * 100), // ~950-1050 sec reading
    quizTimeSec: 380 + Math.floor(Math.random() * 40), // ~380-420 sec quiz
    accuracyScore: 52 + Math.floor(Math.random() * 6), // 52-58% accuracy (avg ~55%)
  }));
};

const generateKnowledgeGaps = (performance: ModulePerformance[]): KnowledgeGap[] => {
  const gaps: KnowledgeGap[] = [];
  const weakModules = performance.filter(p => p.accuracyScore < 75);
  
  const topicsByModule: Record<string, string[]> = {
    'Quantitative Aptitude': ['Percentage Problems', 'Profit & Loss', 'Time & Work', 'Algebra Equations'],
    'Logical Reasoning': ['Syllogisms', 'Blood Relations', 'Coding-Decoding', 'Seating Arrangements'],
    'Verbal Ability': ['Para Jumbles', 'Critical Reasoning', 'Sentence Correction'],
    'Data Interpretation': ['Bar Graphs', 'Pie Charts', 'Caselets'],
    'General Knowledge': ['Current Affairs', 'Indian Polity', 'Economics'],
    'English Proficiency': ['Idioms & Phrases', 'Vocabulary', 'Grammar Rules'],
  };

  weakModules.forEach(mod => {
    const topics = topicsByModule[mod.moduleName] || [];
    const randomTopics = topics.slice(0, Math.floor(Math.random() * 2) + 1);
    randomTopics.forEach(topic => {
      gaps.push({
        topic,
        module: mod.moduleName,
        accuracyScore: Math.floor(Math.random() * 30) + 40,
        attempts: Math.floor(Math.random() * 5) + 2,
        status: mod.accuracyScore < 65 ? 'critical' : mod.accuracyScore < 70 ? 'needs-improvement' : 'developing',
      });
    });
  });

  return gaps;
};

const getMasteryQuadrant = (lei: number, avgAccuracy: number): Student['masteryQuadrant'] => {
  if (lei >= 70 && avgAccuracy >= 75) return 'efficient-mastery';
  if (lei >= 70 && avgAccuracy < 75) return 'surface-learner';
  if (lei < 70 && avgAccuracy >= 75) return 'slow-mastery';
  return 'cognitive-overload';
};

const studentNames = [
  'Aarav Sharma', 'Priya Patel', 'Rohit Kumar', 'Sneha Gupta', 'Vikram Singh',
  'Ananya Reddy', 'Arjun Nair', 'Kavya Iyer', 'Rahul Verma', 'Meera Joshi',
];

const avatarColors = ['6366f1', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];

export const students: Student[] = studentNames.map((name, index) => {
  // Demo data injection for risk tier demonstration
  let modulePerf: ModulePerformance[];
  
  if (name === 'Ananya Reddy') {
    // Medium Risk: 71% accuracy, 95 mins time
    modulePerf = generateMediumRiskModulePerformance();
  } else if (name === 'Vikram Singh') {
    // High Risk: 55% accuracy, 140 mins time
    modulePerf = generateHighRiskModulePerformance();
  } else {
    // Normal students
    modulePerf = generateModulePerformance();
  }
  
  const totalReadingTime = modulePerf.reduce((sum, m) => sum + m.readingTimeSec, 0);
  const totalQuizTime = modulePerf.reduce((sum, m) => sum + m.quizTimeSec, 0);
  const avgAccuracy = Math.round(modulePerf.reduce((sum, m) => sum + m.accuracyScore, 0) / modulePerf.length);
  
  // LEI = (Accuracy * 0.6) + (TimeEfficiency * 0.4)
  const timeEfficiency = Math.min(100, (totalQuizTime / totalReadingTime) * 100 + 50);
  const lei = Math.round(avgAccuracy * 0.6 + timeEfficiency * 0.4);
  
  return {
    id: `student-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${avatarColors[index % avatarColors.length]}&color=fff`,
    enrollmentDate: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString(),
    coursesEnrolled: Math.floor(Math.random() * 3) + 1,
    overallProgress: Math.floor(Math.random() * 40) + 60,
    learningEfficiencyIndex: lei,
    masteryQuadrant: getMasteryQuadrant(lei, avgAccuracy),
    modulePerformance: modulePerf,
    knowledgeGaps: generateKnowledgeGaps(modulePerf),
    totalReadingTime,
    totalQuizTime,
    avgAccuracy,
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  };
});

export const courseStats: CourseStats = {
  totalStudents: 1247,
  activeCourses: 24,
  totalRevenue: 89450,
  avgCompletionRate: 73,
  studentGrowth: 12.5,
  courseGrowth: 8.2,
  revenueGrowth: 23.1,
  completionGrowth: -2.4,
};

// Module Health Matrix - Aggregated cohort data
export interface ModuleHealth {
  moduleId: string;
  moduleName: string;
  avgReadingTime: number;
  avgQuizTime: number;
  avgAccuracy: number;
  studentsStruggling: number;
  trend: 'up' | 'down' | 'stable';
}

// Import risk utility for struggling count calculation
import { isAtRiskStudent } from '@/shared/utils/studentRisk';
export const moduleHealthData: ModuleHealth[] = modules.map(mod => {
  const modulePerfs = students.map(s => s.modulePerformance.find(mp => mp.moduleId === mod.id)!);
  
  // Count students who are at risk (High or Medium) for this module
  const strugglingCount = students.filter(student => {
    const perf = student.modulePerformance.find(mp => mp.moduleId === mod.id);
    // A student struggles in a module if they're at risk AND their module accuracy < 75%
    return perf && perf.accuracyScore < 75 && isAtRiskStudent(student);
  }).length;
  
  return {
    moduleId: mod.id,
    moduleName: mod.name,
    avgReadingTime: Math.round(modulePerfs.reduce((sum, mp) => sum + mp.readingTimeSec, 0) / modulePerfs.length),
    avgQuizTime: Math.round(modulePerfs.reduce((sum, mp) => sum + mp.quizTimeSec, 0) / modulePerfs.length),
    avgAccuracy: Math.round(modulePerfs.reduce((sum, mp) => sum + mp.accuracyScore, 0) / modulePerfs.length),
    studentsStruggling: strugglingCount,
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
  };
});

// API simulation functions
export const fetchStudents = (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(students), 300);
  });
};

export const fetchStudentById = (id: string): Promise<Student | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(students.find(s => s.id === id)), 200);
  });
};

export const fetchCourseStats = (): Promise<CourseStats> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(courseStats), 200);
  });
};

export const fetchModuleHealth = (): Promise<ModuleHealth[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(moduleHealthData), 250);
  });
};