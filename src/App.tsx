import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { getSession, canAccess } from "@/lib/role-permissions";
import { ShieldAlert } from "lucide-react";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Tenants from "@/pages/tenants";
import InstitutionPage from "@/pages/institution";
import Organization from "@/pages/organization";
import Locations from "@/pages/locations";
import CalendarPage from "@/pages/calendar";
import Features from "@/pages/features";
// M02 pages
import IdentityLifecycle from "@/pages/identity-lifecycle";
import AuthFederation from "@/pages/auth-federation";
import RbacAbac from "@/pages/rbac-abac";
import DelegationImpersonation from "@/pages/delegation-impersonation";
import SegregationDuties from "@/pages/segregation-duties";
import PrivilegedAccessPage from "@/pages/privileged-access";
// M03 pages
import AcademicYearPage from "@/pages/academic-year";
import LevelGradeStream from "@/pages/level-grade-stream";
import SubjectCurriculum from "@/pages/subject-curriculum";
import SectionHouseCohort from "@/pages/section-house-cohort";
import GradingPromotion from "@/pages/grading-promotion";
import AcademicPolicyPage from "@/pages/academic-policy";
// M04 pages
import CampaignEnquiry from "@/pages/campaign-enquiry";
import ApplicationPortal from "@/pages/application-portal";
import SelectionOffer from "@/pages/selection-offer";
import ApplicantConversion from "@/pages/applicant-conversion";
// M05 pages
import StudentMaster from "@/pages/student-master";
import EnrolmentMovement from "@/pages/enrolment-movement";
import HoldClearance from "@/pages/hold-clearance";
// M06 pages
import CurriculumMapping from "@/pages/curriculum-mapping";
import SyllabusContent from "@/pages/syllabus-content";
import LessonPlanning from "@/pages/lesson-planning";
import TeachingWorkload from "@/pages/teaching-workload";
import QualityReviewPage from "@/pages/quality-review";
import FacultyReview from "@/pages/faculty-review";
// M07 pages
import TimetablePage from "@/pages/timetable";
import SubstitutionPage from "@/pages/substitution";
import AttendancePage from "@/pages/attendance";
import AttendanceCorrectionsPage from "@/pages/attendance-corrections";
import ShiftsPage from "@/pages/shifts";
import AttendanceAlertsPage from "@/pages/attendance-alerts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (!canAccess(session.role, location.pathname)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-500 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your role (<span className="font-medium">{session.role}</span>) does not have
          permission to access this page. Contact your administrator if you believe
          this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-sm text-primary underline hover:no-underline"
        >
          Go back
        </button>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              {/* M01 */}
              <Route path="tenants" element={<Tenants />} />
              <Route path="institution" element={<InstitutionPage />} />
              <Route path="organization" element={<Organization />} />
              <Route path="locations" element={<Locations />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="features" element={<Features />} />
              {/* M02 */}
              <Route path="identity" element={<IdentityLifecycle />} />
              <Route path="auth" element={<AuthFederation />} />
              <Route path="rbac" element={<RbacAbac />} />
              <Route path="delegation" element={<DelegationImpersonation />} />
              <Route path="duties" element={<SegregationDuties />} />
              <Route path="privileges" element={<PrivilegedAccessPage />} />
              {/* M03 */}
              <Route path="academic-year" element={<AcademicYearPage />} />
              <Route path="levels" element={<LevelGradeStream />} />
              <Route path="subjects" element={<SubjectCurriculum />} />
              <Route path="sections" element={<SectionHouseCohort />} />
              <Route path="grading" element={<GradingPromotion />} />
              <Route path="policies" element={<AcademicPolicyPage />} />
              {/* M04 */}
              <Route path="campaigns" element={<CampaignEnquiry />} />
              <Route path="applications" element={<ApplicationPortal />} />
              <Route path="selections" element={<SelectionOffer />} />
              <Route path="conversions" element={<ApplicantConversion />} />
              {/* M05 */}
              <Route path="students" element={<StudentMaster />} />
              <Route path="enrolments" element={<EnrolmentMovement />} />
              <Route path="holds" element={<HoldClearance />} />
              {/* M06 */}
              <Route path="curriculum" element={<CurriculumMapping />} />
              <Route path="syllabus" element={<SyllabusContent />} />
              <Route path="lesson-planning" element={<LessonPlanning />} />
              <Route path="workload" element={<TeachingWorkload />} />
              <Route path="quality-review" element={<QualityReviewPage />} />
              <Route path="faculty-review" element={<FacultyReview />} />
              {/* M07 */}
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="substitutions" element={<SubstitutionPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="attendance-corrections" element={<AttendanceCorrectionsPage />} />
              <Route path="shifts" element={<ShiftsPage />} />
              <Route path="attendance-alerts" element={<AttendanceAlertsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
