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
// M08 pages
import AssessmentsPage from "@/pages/assessments";
import QuestionBankPage from "@/pages/question-bank";
import ExamsPage from "@/pages/exams";
import ExamRoomsPage from "@/pages/exam-rooms";
import MarksPage from "@/pages/marks";
import ModerationPage from "@/pages/moderation";
import PracticalsPage from "@/pages/practicals";
import IntegrityPage from "@/pages/integrity";
import RechecksPage from "@/pages/rechecks";
// M09 pages
import ResultsPage from "@/pages/results";
import ResultPublicationsPage from "@/pages/result-publications";
import ResultCorrectionsPage from "@/pages/result-corrections";
import MarksheetsPage from "@/pages/marksheets";
import CertificatesPage from "@/pages/certificates";
import CredentialsPage from "@/pages/credentials";
import CompletionsPage from "@/pages/completions";
// M11 pages
import PortalAnnouncementsPage from "@/pages/portal-announcements";
import PortalAccessPage from "@/pages/portal-access";
import KioskSessionsPage from "@/pages/kiosk-sessions";
import MobileDevicesPage from "@/pages/mobile-devices";
import AccessibilityPage from "@/pages/accessibility";
// M12 pages
import FinanceSetupPage from "@/pages/finance-setup";
import JournalsPage from "@/pages/journals";
import FeeCatalogPage from "@/pages/fee-catalog";
import FeeAssignmentsPage from "@/pages/fee-assignments";
import InvoicesPage from "@/pages/invoices";
import CollectionsPage from "@/pages/collections";
import VendorBillsPage from "@/pages/vendor-bills";
import BankBudgetPage from "@/pages/bank-budget";
// M13 pages
import StaffPage from "@/pages/staff";
import RecruitmentPage from "@/pages/recruitment";
import LeaveRequestsPage from "@/pages/leave-requests";
import PerformancePage from "@/pages/performance";
import PayrollPage from "@/pages/payroll";
import SeparationsPage from "@/pages/separations";

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
              {/* M08 */}
              <Route path="assessments" element={<AssessmentsPage />} />
              <Route path="question-bank" element={<QuestionBankPage />} />
              <Route path="exams" element={<ExamsPage />} />
              <Route path="exam-rooms" element={<ExamRoomsPage />} />
              <Route path="marks" element={<MarksPage />} />
              <Route path="moderation" element={<ModerationPage />} />
              <Route path="practicals" element={<PracticalsPage />} />
              <Route path="integrity" element={<IntegrityPage />} />
              <Route path="rechecks" element={<RechecksPage />} />
              {/* M09 */}
              <Route path="results" element={<ResultsPage />} />
              <Route path="result-publications" element={<ResultPublicationsPage />} />
              <Route path="result-corrections" element={<ResultCorrectionsPage />} />
              <Route path="marksheets" element={<MarksheetsPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="credentials" element={<CredentialsPage />} />
              <Route path="completions" element={<CompletionsPage />} />
              {/* M11 */}
              <Route path="portal-announcements" element={<PortalAnnouncementsPage />} />
              <Route path="portal-access" element={<PortalAccessPage />} />
              <Route path="kiosk-sessions" element={<KioskSessionsPage />} />
              <Route path="mobile-devices" element={<MobileDevicesPage />} />
              <Route path="accessibility" element={<AccessibilityPage />} />
              {/* M12 */}
              <Route path="finance-setup" element={<FinanceSetupPage />} />
              <Route path="journals" element={<JournalsPage />} />
              <Route path="fee-catalog" element={<FeeCatalogPage />} />
              <Route path="fee-assignments" element={<FeeAssignmentsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="vendor-bills" element={<VendorBillsPage />} />
              <Route path="bank-budget" element={<BankBudgetPage />} />
              {/* M13 */}
              <Route path="staff" element={<StaffPage />} />
              <Route path="recruitment" element={<RecruitmentPage />} />
              <Route path="leave-requests" element={<LeaveRequestsPage />} />
              <Route path="performance" element={<PerformancePage />} />
              <Route path="payroll" element={<PayrollPage />} />
              <Route path="separations" element={<SeparationsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
