import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/features/auth/hooks/useAuth";
import { lazy, Suspense } from "react";

// Eagerly loaded components
import LandingPage from "@/features/home/components/LandingPage";
import Students from "@/features/courses/components/admin/Students";

// OPTIMIZED: Lazy loaded routes
const DashboardPage = lazy(() => import("@/features/home/components/DashboardPage"));
const AuthPage = lazy(() => import("@/features/auth/components/AuthPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/components/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("@/shared/components/layout/NotFoundPage"));
const SpeedAssessmentPage = lazy(() => import("@/features/speed-assessment/components/SpeedAssessmentPage"));
const ReadingAssessmentPage = lazy(() => import("@/features/reading-assessment/components/ReadingAssessmentPage"));
const NotesPage = lazy(() => import("@/features/notes/components/NotesPage"));
const ProfilePage = lazy(() => import("@/features/profile/components/ProfilePage"));
const PricingPage = lazy(() => import("@/features/payment/components/PricingPage"));
const PaymentSuccess = lazy(() => import("@/features/payment/components/PaymentSuccess"));
const CoursesPage = lazy(() => import("@/features/courses/components/CoursesPage"));
const CourseDetailPage = lazy(() => import("@/features/courses/components/CourseDetailPage"));
const LearningPage = lazy(() => import("@/features/courses/components/learning/LearningPage"));
const AdminDashboardPage = lazy(() => import("@/features/courses/components/admin/AdminDashboardPage"));
const DiagnosticDashboard = lazy(() => import("@/features/courses/components/admin/Dashboard"));
const AnalyticsPage = lazy(() => import("@/features/courses/components/admin/Analytics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RouteLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <RouteLoader />;
  }

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />

        {/* FIXED: Diagnostic Dashboard Route */}
        <Route path="/diagnostic-dashboard" element={<DiagnosticDashboard />} />
        
        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/learn/:slug" element={<LearningPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/students" element={<Students />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/assessment" element={<ReadingAssessmentPage />} />
            <Route path="/assessment/legacy" element={<SpeedAssessmentPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/courses/admin/dashboard" element={<AdminDashboardPage />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Navigate to="/auth" replace />} />
            <Route path="/learn/:slug" element={<Navigate to="/auth" replace />} />
            <Route path="/notes" element={<Navigate to="/auth" replace />} />
            <Route path="/profile" element={<Navigate to="/auth" replace />} />
            <Route path="/assessment" element={<Navigate to="/auth" replace />} />
            <Route path="/courses/admin/dashboard" element={<Navigate to="/auth" replace />} />
            <Route path="/courses/admin/dashboard/StudentPerformanceTable" element={<Navigate to="/auth" replace />} />
          </>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;