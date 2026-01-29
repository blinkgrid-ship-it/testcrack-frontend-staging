import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Zap, Brain, AlertCircle, Clock, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

// --- UPDATED IMPORTS FOR LOCAL STRUCTURE ---
import { cn } from '@/shared/utils';
import { Student } from '@/features/courses/data/mockData';
import { getStudentRiskLevel, RiskLevel } from '@/shared/utils/studentRisk';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { StudentDrilldown } from './StudentDrilldown'; // Assumes this is in the same folder

const getRiskBadgeConfig = (riskLevel: RiskLevel) => {
  const configs = {
    high: {
      label: 'High Risk',
      icon: ShieldAlert,
      className: 'border-destructive/30 bg-destructive/10 text-destructive',
    },
    medium: {
      label: 'Medium Risk',
      icon: AlertTriangle,
      className: 'border-warning/30 bg-warning/10 text-warning',
    },
    normal: {
      label: 'Normal',
      icon: CheckCircle2,
      className: 'border-muted-foreground/20 bg-muted/50 text-muted-foreground',
    },
  };
  return configs[riskLevel];
};

interface StudentPerformanceTableProps {
  students: Student[];
}

const ITEMS_PER_PAGE = 10;

const getMasteryConfig = (quadrant: Student['masteryQuadrant']) => {
  const configs = {
    'efficient-mastery': {
      label: 'Efficient Mastery',
      icon: Zap,
      className: 'bg-success/10 text-success border-success/20',
    },
    'surface-learner': {
      label: 'Surface Learner',
      icon: Brain,
      className: 'bg-warning/10 text-warning border-warning/20',
    },
    'cognitive-overload': {
      label: 'Cognitive Overload',
      icon: AlertCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    'slow-mastery': {
      label: 'Slow Mastery',
      icon: Clock,
      className: 'bg-primary/10 text-primary border-primary/20',
    },
  };
  return configs[quadrant];
};

const getLEIColor = (lei: number) => {
  if (lei >= 80) return 'text-success';
  if (lei >= 65) return 'text-warning';
  return 'text-destructive';
};

export function StudentPerformanceTable({ students }: StudentPerformanceTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return students.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [students, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const startEntry = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, students.length);

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Student Performance</h3>
              <p className="text-sm text-muted-foreground">Learning Efficiency Index & Mastery Quadrants</p>
            </div>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Student
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  LEI Score
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Avg Accuracy
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Mastery Quadrant
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Risk Status
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Knowledge Gaps
                </th>
                <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedStudents.map((student, index) => {
                const masteryConfig = getMasteryConfig(student.masteryQuadrant);
                const MasteryIcon = masteryConfig.icon;
                
                return (
                  <tr 
                    key={student.id}
                    className="group cursor-pointer transition-colors hover:bg-muted/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={cn('text-2xl font-bold', getLEIColor(student.learningEfficiencyIndex))}>
                          {student.learningEfficiencyIndex}
                        </span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-lg font-semibold text-foreground">{student.avgAccuracy}%</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={cn('gap-1.5', masteryConfig.className)}>
                          <MasteryIcon className="h-3.5 w-3.5" />
                          {masteryConfig.label}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {(() => {
                        const riskLevel = getStudentRiskLevel(student);
                        const riskConfig = getRiskBadgeConfig(riskLevel);
                        const RiskIcon = riskConfig.icon;
                        return (
                          <Badge variant="outline" className={cn('gap-1.5', riskConfig.className)}>
                            <RiskIcon className="h-3.5 w-3.5" />
                            {riskConfig.label}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {student.knowledgeGaps.length > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-sm font-medium text-destructive">
                          {student.knowledgeGaps.length} gaps
                        </span>
                      ) : (
                        <span className="text-sm text-success">No gaps</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                        }}
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{startEntry}</span> to{' '}
            <span className="font-medium text-foreground">{endEntry}</span> of{' '}
            <span className="font-medium text-foreground">{students.length}</span> students
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, filtered) => {
                  const prevPage = filtered[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  
                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </span>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <StudentDrilldown 
        student={selectedStudent} 
        open={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />
    </>
  );
}