import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, Timer, Target, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils';
import { ModuleHealth,modules } from '@/features/courses/data/mockData';

interface ModuleHealthMatrixProps {
  data: ModuleHealth[];
}

// Sub-topic mock data for each module
const subtopicData: Record<string, { name: string; avgTime: number; accuracy: number; difficulty: 'easy' | 'medium' | 'hard' }[]> = {
  'mod-1': [
    { name: 'Percentage Problems', avgTime: 420, accuracy: 78, difficulty: 'medium' },
    { name: 'Profit & Loss', avgTime: 380, accuracy: 82, difficulty: 'easy' },
    { name: 'Time & Work', avgTime: 510, accuracy: 65, difficulty: 'hard' },
    { name: 'Algebra Equations', avgTime: 450, accuracy: 71, difficulty: 'medium' },
  ],
  'mod-2': [
    { name: 'Syllogisms', avgTime: 320, accuracy: 74, difficulty: 'medium' },
    { name: 'Blood Relations', avgTime: 280, accuracy: 85, difficulty: 'easy' },
    { name: 'Coding-Decoding', avgTime: 350, accuracy: 79, difficulty: 'medium' },
    { name: 'Seating Arrangements', avgTime: 480, accuracy: 62, difficulty: 'hard' },
  ],
  'mod-3': [
    { name: 'Para Jumbles', avgTime: 390, accuracy: 68, difficulty: 'hard' },
    { name: 'Critical Reasoning', avgTime: 420, accuracy: 72, difficulty: 'medium' },
    { name: 'Sentence Correction', avgTime: 300, accuracy: 81, difficulty: 'easy' },
  ],
  'mod-4': [
    { name: 'Bar Graphs', avgTime: 340, accuracy: 84, difficulty: 'easy' },
    { name: 'Pie Charts', avgTime: 360, accuracy: 79, difficulty: 'medium' },
    { name: 'Caselets', avgTime: 520, accuracy: 61, difficulty: 'hard' },
  ],
  'mod-5': [
    { name: 'Current Affairs', avgTime: 280, accuracy: 72, difficulty: 'medium' },
    { name: 'Indian Polity', avgTime: 350, accuracy: 68, difficulty: 'medium' },
    { name: 'Economics', avgTime: 400, accuracy: 65, difficulty: 'hard' },
  ],
  'mod-6': [
    { name: 'Idioms & Phrases', avgTime: 260, accuracy: 77, difficulty: 'easy' },
    { name: 'Vocabulary', avgTime: 300, accuracy: 82, difficulty: 'easy' },
    { name: 'Grammar Rules', avgTime: 380, accuracy: 74, difficulty: 'medium' },
  ],
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
};

const getTrendIcon = (trend: ModuleHealth['trend']) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
    default: return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 80) return 'text-success bg-success/10';
  if (accuracy >= 70) return 'text-warning bg-warning/10';
  return 'text-destructive bg-destructive/10';
};

const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
  const styles = {
    easy: 'bg-success/10 text-success',
    medium: 'bg-warning/10 text-warning',
    hard: 'bg-destructive/10 text-destructive',
  };
  return styles[difficulty];
};

export function ModuleHealthMatrix({ data }: ModuleHealthMatrixProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(prev => prev === moduleId ? null : moduleId);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Module Health Matrix</h3>
            <p className="text-sm text-muted-foreground">Cohort performance across all modules • Click to expand</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Tᵣ = Reading Time
            </span>
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" /> Tᵧ = Quiz Time
            </span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Module
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Avg Tᵣ
                </div>
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Timer className="h-3.5 w-3.5" />
                  Avg Tᵧ
                </div>
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  Accuracy
                </div>
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Struggling
                </div>
              </th>
              <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((module, index) => {
              const isExpanded = expandedModule === module.moduleId;
              const subtopics = subtopicData[module.moduleId] || [];
              
              return (
                <>
                  <tr 
                    key={module.moduleId} 
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/20",
                      isExpanded && "bg-muted/10"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => toggleModule(module.moduleId)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center text-muted-foreground">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                          {module.moduleName.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{module.moduleName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground">
                        {formatTime(module.avgReadingTime)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground">
                        {formatTime(module.avgQuizTime)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        'rounded-full px-3 py-1 text-sm font-semibold',
                        getAccuracyColor(module.avgAccuracy)
                      )}>
                        {module.avgAccuracy}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {module.studentsStruggling > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-sm font-medium text-warning">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {module.studentsStruggling}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        {getTrendIcon(module.trend)}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Sub-topic Breakdown */}
                  {isExpanded && (
                    <tr key={`${module.moduleId}-subtopics`}>
                      <td colSpan={6} className="bg-muted/5 px-5 py-4">
                        <div className="ml-8 rounded-lg border border-border bg-card p-4">
                          <h4 className="mb-3 text-sm font-semibold text-foreground">
                            Sub-topic Breakdown
                          </h4>
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="pb-2 text-left text-xs font-medium uppercase text-muted-foreground">Topic</th>
                                <th className="pb-2 text-center text-xs font-medium uppercase text-muted-foreground">Avg Time</th>
                                <th className="pb-2 text-center text-xs font-medium uppercase text-muted-foreground">Accuracy</th>
                                <th className="pb-2 text-center text-xs font-medium uppercase text-muted-foreground">Difficulty</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                              {subtopics.map((subtopic) => (
                                <tr key={subtopic.name} className="text-sm">
                                  <td className="py-2.5 font-medium text-foreground">{subtopic.name}</td>
                                  <td className="py-2.5 text-center text-muted-foreground">{formatTime(subtopic.avgTime)}</td>
                                  <td className="py-2.5 text-center">
                                    <span className={cn(
                                      'rounded-full px-2 py-0.5 text-xs font-medium',
                                      getAccuracyColor(subtopic.accuracy)
                                    )}>
                                      {subtopic.accuracy}%
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-center">
                                    <span className={cn(
                                      'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                      getDifficultyBadge(subtopic.difficulty)
                                    )}>
                                      {subtopic.difficulty}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}