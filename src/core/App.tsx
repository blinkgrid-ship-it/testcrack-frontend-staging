import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";

import { AuthProvider, useAuth } from "@/features/auth/hooks/useAuth";
import { RoleProtectedRoute } from "@/shared/components/auth/ProtectedRoute";

// Eager load (small & critical)
import LandingPage from "@/features/home/components/LandingPage";

// Lazy loaded pages (optimized)
const DashboardPage = lazy(() => import("@/features/home/components/DashboardPage"));
const AuthPage = lazy(() => import("@/features/auth/components/AuthPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/components/ResetPasswordPage"));
const PricingPage = lazy(() => import("@/features/payment/components/PricingPage"));
const CoursesPage = lazy(() => import("@/features/courses/components/CoursesPage"));
const CourseDetailPage = lazy(() => import("@/features/courses/components/CourseDetailPage"));
const LearningPage = lazy(() => import("@/features/courses/components/learning/LearningPage"));
const NotesPage = lazy(() => import("@/features/notes/components/NotesPage"));
const ProfilePage = lazy(() => import("@/features/profile/components/ProfilePage"));
const ReadingAssessmentPage = lazy(() => import("@/features/reading-assessment/components/ReadingAssessmentPage"));
const SpeedAssessmentPage = lazy(() => import("@/features/speed-assessment/components/SpeedAssessmentPage"));
const PaymentSuccess = lazy(() => import("@/features/payment/components/PaymentSuccess"));
const NotFoundPage = lazy(() => import("@/shared/components/layout/NotFoundPage"));

// Admin / Instructor
const AdminDashboardPage = lazy(() => import("@/features/courses/components/admin/AdminDashboardPage"));
const CourseManagementPage = lazy(() => import("@/features/courses/components/admin/CourseManagementPage"));
const StudentsPage = lazy(() => import("@/features/courses/components/admin/Students"));
const AnalyticsPage = lazy(() => import("@/features/courses/components/admin/Analytics"));
const DiagnosticDashboard = lazy(() => import("@/features/courses/components/admin/Dashboard"));

/* ---------------- Query Client (Optimized) ---------------- */

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

/* ---------------- Loader ---------------- */

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary"></div>
  </div>
);

/* ---------------- Routes ---------------- */

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <RouteLoader />;

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>

        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />

        {/* ---------- Protected Routes (User) ---------- */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute>
              <DashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/learn/:slug"
          element={
            <RoleProtectedRoute>
              <LearningPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <RoleProtectedRoute>
              <NotesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleProtectedRoute>
              <ProfilePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <RoleProtectedRoute>
              <ReadingAssessmentPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/assessment/legacy"
          element={
            <RoleProtectedRoute>
              <SpeedAssessmentPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <RoleProtectedRoute>
              <PaymentSuccess />
            </RoleProtectedRoute>
          }
        />

        {/* ---------- Admin / Instructor Routes ---------- */}
        <Route
          path="/diagnostic-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <DiagnosticDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <AdminDashboardPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/admin/manage/:id"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <CourseManagementPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <StudentsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <AnalyticsPage />
            </RoleProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

/* ---------------- App Wrapper ---------------- */

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
