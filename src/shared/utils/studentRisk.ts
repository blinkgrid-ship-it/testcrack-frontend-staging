import { Student } from '@/features/courses/data/mockData';
export type RiskLevel = 'high' | 'medium' | 'normal';

/**
 * Multi-tier risk assessment system:
 * - High Risk (Red): Accuracy < 60% AND Total Time Spent > 120 minutes
 * - Medium Risk (Yellow): Accuracy < 75% OR Total Time Spent > 90 minutes
 * - Normal: Any student not meeting the above criteria
 * 
 * @param student - The student object to evaluate
 * @returns RiskLevel ('high' | 'medium' | 'normal')
 */
export function getStudentRiskLevel(student: Student): RiskLevel {
  const totalTimeMinutes = (student.totalReadingTime + student.totalQuizTime) / 60;
  
  // High Risk: Accuracy < 60% AND Time > 120 mins
  if (student.avgAccuracy < 60 && totalTimeMinutes > 120) {
    return 'high';
  }
  
  // Medium Risk: Accuracy < 75% OR Time > 90 mins
  if (student.avgAccuracy < 75 || totalTimeMinutes > 90) {
    return 'medium';
  }
  
  // Normal: Everything else
  return 'normal';
}

/**
 * Legacy helper for backwards compatibility
 * @deprecated Use getStudentRiskLevel instead
 */
export function isHighRiskStudent(student: Student): boolean {
  return getStudentRiskLevel(student) === 'high';
}

/**
 * Check if student needs attention (High or Medium risk)
 */
export function isAtRiskStudent(student: Student): boolean {
  const level = getStudentRiskLevel(student);
  return level === 'high' || level === 'medium';
}

/**
 * Gets detailed risk assessment for a student
 * @param student - The student object to evaluate
 * @returns Object with risk level and contributing factors
 */
export function getStudentRiskAssessment(student: Student) {
  const totalTimeMinutes = (student.totalReadingTime + student.totalQuizTime) / 60;
  const riskLevel = getStudentRiskLevel(student);
  
  return {
    riskLevel,
    isHighRisk: riskLevel === 'high',
    isMediumRisk: riskLevel === 'medium',
    isAtRisk: riskLevel !== 'normal',
    factors: {
      accuracy: student.avgAccuracy,
      isLowAccuracy: student.avgAccuracy < 60,
      isMediumAccuracy: student.avgAccuracy < 75,
      totalTimeMinutes: Math.round(totalTimeMinutes),
      isHighTimeSpent: totalTimeMinutes > 120,
      isMediumTimeSpent: totalTimeMinutes > 90,
    },
  };
}