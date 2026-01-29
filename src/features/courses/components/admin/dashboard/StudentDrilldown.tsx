import { X, Clock, Timer, Target, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import { Progress } from '@/shared/components/ui/progress';
import { Student } from '@/features/courses/data/mockData';
import { cn } from '@/shared/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StudentDrilldownProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
};

const getGapStatusConfig = (status: string) => {
  const configs = {
    critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    'needs-improvement': { label: 'Needs Work', className: 'bg-warning/10 text-warning border-warning/20' },
    developing: { label: 'Developing', className: 'bg-primary/10 text-primary border-primary/20' },
  };
  return configs[status as keyof typeof configs] || configs.developing;
};

export function StudentDrilldown({ student, open, onClose }: StudentDrilldownProps) {
  if (!student) return null;

  const chartData = student.modulePerformance.map((mp) => ({
    name: mp.moduleName.split(' ')[0],
    'Reading Time': Math.round(mp.readingTimeSec / 60),
    'Quiz Time': Math.round(mp.quizTimeSec / 60),
    Accuracy: mp.accuracyScore,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">{student.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{student.learningEfficiencyIndex}</div>
              <p className="text-xs text-muted-foreground">LEI Score</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Total Reading</span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatTime(student.totalReadingTime)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span className="text-xs">Total Quiz</span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatTime(student.totalQuizTime)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span className="text-xs">Avg Accuracy</span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">{student.avgAccuracy}%</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Progress</span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">{student.overallProgress}%</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              Module Performance Comparison
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="Reading Time" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Reading (min)"
                  />
                  <Bar 
                    dataKey="Quiz Time" 
                    fill="hsl(var(--success))" 
                    radius={[4, 4, 0, 0]}
                    name="Quiz (min)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Knowledge Gaps */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Knowledge Gaps ({student.knowledgeGaps.length})
            </h4>
            {student.knowledgeGaps.length > 0 ? (
              <div className="space-y-3">
                {student.knowledgeGaps.map((gap, index) => {
                  const statusConfig = getGapStatusConfig(gap.status);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{gap.topic}</span>
                          <Badge variant="outline" className={statusConfig.className}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{gap.module}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Accuracy</p>
                          <p className="font-semibold text-foreground">{gap.accuracyScore}%</p>
                        </div>
                        <div className="w-24">
                          <Progress 
                            value={gap.accuracyScore} 
                            className={cn(
                              'h-2',
                              gap.status === 'critical' && '[&>div]:bg-destructive',
                              gap.status === 'needs-improvement' && '[&>div]:bg-warning',
                              gap.status === 'developing' && '[&>div]:bg-primary'
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <span>No knowledge gaps detected. Great performance!</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}