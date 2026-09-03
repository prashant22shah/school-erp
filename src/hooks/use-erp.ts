import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Tenant, Institution, LegalEntity, Campus, OrgUnit, LocationNode,
  Holiday, LocaleSettings, DocSequence, FeatureFlag, ConfigVersion,
  UserIdentity, AuthSession, Role, UserRole, DataScope,
  Delegation, ImpersonationLog, DutyRule, DutyViolation, PrivilegedAccess, AccessReview,
  AcademicYear, Term, SchoolLevel, GradeClass, Stream, Subject, CurriculumOffering,
  Section, House, Cohort, GradingScale, PromotionRule, CompletionRule, AcademicPolicy,
  Campaign, Enquiry, EnquiryInteraction, Application, ApplicationChoice,
  ApplicationDocument, EligibilityDecision, SelectionEvent, SelectionScore,
  Offer, OfferAcceptance, ConversionCase, ConversionStep,
  Person, Student, Guardian, StudentGuardian, StudentDocument, Enrolment,
  SubjectSelection, StudentMovement, ProgressionAudit, StudentHold,
  ClearanceCase, ClearanceResponse, IdentityCard,
  CurriculumMap, LearningOutcome, SyllabusPlan, ContentPlanItem,
  TeachingAssignment, LessonPlan, CoverageEntry, WorkloadAllocation,
  QualityReview, QualityEvidence, ModerationReview, ReviewAction,
  Timetable, TimetableSlot, TimetableAssignment, Substitution,
  AttendanceSession, StudentAttendance, AttendanceCorrection, AttendanceAlert,
  Shift, StaffRoster, TimeEntry, TimeAdjustment,
  Assessment, AssessmentComponent, Question, ExamPaper, Exam, ExamRegistration,
  ExamRoom, SeatAllocation, InvigilationDuty, MarkEntry, ModerationRecord,
  PracticalExam, IntegrityCase, RecheckRequest,
  ResultRun, ResultLine, ResultPublication, ResultCorrection, Marksheet, Transcript,
  Certificate, CertificateRequest, DigitalCredential, CompletionRecord,
  PortalAnnouncement, PortalAccessLog, KioskSession, MobileDevice, OfflineSyncLog,
  AccessibilityProfile, PortalTicket,
  FiscalYear, ChartOfAccount, JournalEntry, FeeStructure, FeeAssignment, Invoice,
  Payment, CreditNote, VendorBill, ExpenseClaim, BankAccount, Budget,
  StaffProfile, Position, Recruitment, LeaveRequest, PerformanceReview, Compensation,
  PayrollRun, Payslip, Separation, StaffContract,
} from "@/lib/types";

export const keys = {
  // M01
  tenants: ["tenants"] as const,
  institution: ["institution"] as const,
  legalEntities: ["legalEntities"] as const,
  campuses: ["campuses"] as const,
  orgUnits: ["orgUnits"] as const,
  locations: ["locations"] as const,
  calendarYears: ["calendarYears"] as const,
  holidays: ["holidays"] as const,
  locale: ["locale"] as const,
  sequences: ["sequences"] as const,
  featureFlags: ["featureFlags"] as const,
  configVersions: ["configVersions"] as const,
  audit: ["audit"] as const,
  // M02
  userIdentities: ["userIdentities"] as const,
  authSessions: ["authSessions"] as const,
  authFactors: ["authFactors"] as const,
  roles: ["roles"] as const,
  userRoles: ["userRoles"] as const,
  dataScopes: ["dataScopes"] as const,
  delegations: ["delegations"] as const,
  impersonationLogs: ["impersonationLogs"] as const,
  dutyRules: ["dutyRules"] as const,
  dutyViolations: ["dutyViolations"] as const,
  privilegedAccess: ["privilegedAccess"] as const,
  accessReviews: ["accessReviews"] as const,
  // M03
  academicYears: ["academicYears"] as const,
  terms: ["terms"] as const,
  schoolLevels: ["schoolLevels"] as const,
  gradeClasses: ["gradeClasses"] as const,
  streams: ["streams"] as const,
  subjects: ["subjects"] as const,
  curriculumOfferings: ["curriculumOfferings"] as const,
  sections: ["sections"] as const,
  houses: ["houses"] as const,
  cohorts: ["cohorts"] as const,
  gradingScales: ["gradingScales"] as const,
  promotionRules: ["promotionRules"] as const,
  completionRules: ["completionRules"] as const,
  academicPolicies: ["academicPolicies"] as const,
  // M04
  campaigns: ["campaigns"] as const,
  enquiries: ["enquiries"] as const,
  enquiryInteractions: ["enquiryInteractions"] as const,
  applications: ["applications"] as const,
  applicationChoices: ["applicationChoices"] as const,
  applicationDocuments: ["applicationDocuments"] as const,
  eligibilityDecisions: ["eligibilityDecisions"] as const,
  selectionEvents: ["selectionEvents"] as const,
  selectionScores: ["selectionScores"] as const,
  offers: ["offers"] as const,
  offerAcceptances: ["offerAcceptances"] as const,
  conversionCases: ["conversionCases"] as const,
  conversionSteps: ["conversionSteps"] as const,
  // M05
  persons: ["persons"] as const,
  students: ["students"] as const,
  guardians: ["guardians"] as const,
  studentGuardians: ["studentGuardians"] as const,
  studentDocuments: ["studentDocuments"] as const,
  enrolments: ["enrolments"] as const,
  subjectSelections: ["subjectSelections"] as const,
  studentMovements: ["studentMovements"] as const,
  progressionAudits: ["progressionAudits"] as const,
  studentHolds: ["studentHolds"] as const,
  clearanceCases: ["clearanceCases"] as const,
  clearanceResponses: ["clearanceResponses"] as const,
  identityCards: ["identityCards"] as const,
  // M06
  curriculumMaps: ["curriculumMaps"] as const,
  learningOutcomes: ["learningOutcomes"] as const,
  syllabusPlans: ["syllabusPlans"] as const,
  contentPlanItems: ["contentPlanItems"] as const,
  teachingAssignments: ["teachingAssignments"] as const,
  lessonPlans: ["lessonPlans"] as const,
  coverageEntries: ["coverageEntries"] as const,
  workloadAllocations: ["workloadAllocations"] as const,
  qualityReviews: ["qualityReviews"] as const,
  qualityEvidences: ["qualityEvidences"] as const,
  moderationReviews: ["moderationReviews"] as const,
  reviewActions: ["reviewActions"] as const,
  // M07
  timetables: ["timetables"] as const,
  timetableSlots: ["timetableSlots"] as const,
  timetableAssignments: ["timetableAssignments"] as const,
  substitutions: ["substitutions"] as const,
  attendanceSessions: ["attendanceSessions"] as const,
  studentAttendances: ["studentAttendances"] as const,
  attendanceCorrections: ["attendanceCorrections"] as const,
  attendanceAlerts: ["attendanceAlerts"] as const,
  shifts: ["shifts"] as const,
  staffRosters: ["staffRosters"] as const,
  timeEntries: ["timeEntries"] as const,
  timeAdjustments: ["timeAdjustments"] as const,
  // M08
  assessments: ["assessments"] as const,
  assessmentComponents: ["assessmentComponents"] as const,
  questions: ["questions"] as const,
  examPapers: ["examPapers"] as const,
  exams: ["exams"] as const,
  examRegistrations: ["examRegistrations"] as const,
  examRooms: ["examRooms"] as const,
  seatAllocations: ["seatAllocations"] as const,
  invigilationDuties: ["invigilationDuties"] as const,
  markEntries: ["markEntries"] as const,
  moderationRecords: ["moderationRecords"] as const,
  practicalExams: ["practicalExams"] as const,
  integrityCases: ["integrityCases"] as const,
  recheckRequests: ["recheckRequests"] as const,
  // M09
  resultRuns: ["resultRuns"] as const,
  resultLines: ["resultLines"] as const,
  resultPublications: ["resultPublications"] as const,
  resultCorrections: ["resultCorrections"] as const,
  marksheets: ["marksheets"] as const,
  transcripts: ["transcripts"] as const,
  certificates: ["certificates"] as const,
  certificateRequests: ["certificateRequests"] as const,
  digitalCredentials: ["digitalCredentials"] as const,
  completionRecords: ["completionRecords"] as const,
  // M11
  portalAnnouncements: ["portalAnnouncements"] as const,
  portalAccessLogs: ["portalAccessLogs"] as const,
  kioskSessions: ["kioskSessions"] as const,
  mobileDevices: ["mobileDevices"] as const,
  offlineSyncLogs: ["offlineSyncLogs"] as const,
  accessibilityProfiles: ["accessibilityProfiles"] as const,
  portalTickets: ["portalTickets"] as const,
  // M12
  fiscalYears: ["fiscalYears"] as const,
  chartOfAccounts: ["chartOfAccounts"] as const,
  journalEntries: ["journalEntries"] as const,
  feeStructures: ["feeStructures"] as const,
  feeAssignments: ["feeAssignments"] as const,
  invoices: ["invoices"] as const,
  payments: ["payments"] as const,
  creditNotes: ["creditNotes"] as const,
  vendorBills: ["vendorBills"] as const,
  expenseClaims: ["expenseClaims"] as const,
  bankAccounts: ["bankAccounts"] as const,
  budgets: ["budgets"] as const,
  // M13
  staffProfiles: ["staffProfiles"] as const,
  positions: ["positions"] as const,
  recruitments: ["recruitments"] as const,
  leaveRequests: ["leaveRequests"] as const,
  performanceReviews: ["performanceReviews"] as const,
  compensations: ["compensations"] as const,
  payrollRuns: ["payrollRuns"] as const,
  payslips: ["payslips"] as const,
  separations: ["separations"] as const,
  staffContracts: ["staffContracts"] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────
// M01
export const useTenants = () => useQuery({ queryKey: keys.tenants, queryFn: api.listTenants });
export const useInstitution = () => useQuery({ queryKey: keys.institution, queryFn: api.getInstitution });
export const useLegalEntities = () => useQuery({ queryKey: keys.legalEntities, queryFn: api.listLegalEntities });
export const useCampuses = () => useQuery({ queryKey: keys.campuses, queryFn: api.listCampuses });
export const useOrgUnits = () => useQuery({ queryKey: keys.orgUnits, queryFn: api.listOrgUnits });
export const useLocations = () => useQuery({ queryKey: keys.locations, queryFn: api.listLocations });
export const useCalendarYears = () => useQuery({ queryKey: keys.calendarYears, queryFn: api.listCalendarYears });
export const useHolidays = () => useQuery({ queryKey: keys.holidays, queryFn: api.listHolidays });
export const useLocale = () => useQuery({ queryKey: keys.locale, queryFn: api.getLocale });
export const useSequences = () => useQuery({ queryKey: keys.sequences, queryFn: api.listSequences });
export const useFeatureFlags = () => useQuery({ queryKey: keys.featureFlags, queryFn: api.listFeatureFlags });
export const useConfigVersions = () => useQuery({ queryKey: keys.configVersions, queryFn: api.listConfigVersions });
export const useAudit = () => useQuery({ queryKey: keys.audit, queryFn: api.listAudit });
// M02
export const useUserIdentities = () => useQuery({ queryKey: keys.userIdentities, queryFn: api.listUserIdentities });
export const useAuthSessions = () => useQuery({ queryKey: keys.authSessions, queryFn: api.listAuthSessions });
export const useAuthFactors = () => useQuery({ queryKey: keys.authFactors, queryFn: api.listAuthFactors });
export const useRoles = () => useQuery({ queryKey: keys.roles, queryFn: api.listRoles });
export const useUserRoles = () => useQuery({ queryKey: keys.userRoles, queryFn: api.listUserRoles });
export const useDataScopes = () => useQuery({ queryKey: keys.dataScopes, queryFn: api.listDataScopes });
export const useDelegations = () => useQuery({ queryKey: keys.delegations, queryFn: api.listDelegations });
export const useImpersonationLogs = () => useQuery({ queryKey: keys.impersonationLogs, queryFn: api.listImpersonationLogs });
export const useDutyRules = () => useQuery({ queryKey: keys.dutyRules, queryFn: api.listDutyRules });
export const useDutyViolations = () => useQuery({ queryKey: keys.dutyViolations, queryFn: api.listDutyViolations });
export const usePrivilegedAccess = () => useQuery({ queryKey: keys.privilegedAccess, queryFn: api.listPrivilegedAccess });
export const useAccessReviews = () => useQuery({ queryKey: keys.accessReviews, queryFn: api.listAccessReviews });
// M03
export const useAcademicYears = () => useQuery({ queryKey: keys.academicYears, queryFn: api.listAcademicYears });
export const useTerms = () => useQuery({ queryKey: keys.terms, queryFn: api.listTerms });
export const useSchoolLevels = () => useQuery({ queryKey: keys.schoolLevels, queryFn: api.listSchoolLevels });
export const useGradeClasses = () => useQuery({ queryKey: keys.gradeClasses, queryFn: api.listGradeClasses });
export const useStreams = () => useQuery({ queryKey: keys.streams, queryFn: api.listStreams });
export const useSubjects = () => useQuery({ queryKey: keys.subjects, queryFn: api.listSubjects });
export const useCurriculumOfferings = () => useQuery({ queryKey: keys.curriculumOfferings, queryFn: api.listCurriculumOfferings });
export const useSections = () => useQuery({ queryKey: keys.sections, queryFn: api.listSections });
export const useHouses = () => useQuery({ queryKey: keys.houses, queryFn: api.listHouses });
export const useCohorts = () => useQuery({ queryKey: keys.cohorts, queryFn: api.listCohorts });
export const useGradingScales = () => useQuery({ queryKey: keys.gradingScales, queryFn: api.listGradingScales });
export const usePromotionRules = () => useQuery({ queryKey: keys.promotionRules, queryFn: api.listPromotionRules });
export const useCompletionRules = () => useQuery({ queryKey: keys.completionRules, queryFn: api.listCompletionRules });
export const useAcademicPolicies = () => useQuery({ queryKey: keys.academicPolicies, queryFn: api.listAcademicPolicies });
// M04
export const useCampaigns = () => useQuery({ queryKey: keys.campaigns, queryFn: api.listCampaigns });
export const useEnquiries = () => useQuery({ queryKey: keys.enquiries, queryFn: api.listEnquiries });
export const useEnquiryInteractions = () => useQuery({ queryKey: keys.enquiryInteractions, queryFn: api.listEnquiryInteractions });
export const useApplications = () => useQuery({ queryKey: keys.applications, queryFn: api.listApplications });
export const useApplicationChoices = () => useQuery({ queryKey: keys.applicationChoices, queryFn: api.listApplicationChoices });
export const useApplicationDocuments = () => useQuery({ queryKey: keys.applicationDocuments, queryFn: api.listApplicationDocuments });
export const useEligibilityDecisions = () => useQuery({ queryKey: keys.eligibilityDecisions, queryFn: api.listEligibilityDecisions });
export const useSelectionEvents = () => useQuery({ queryKey: keys.selectionEvents, queryFn: api.listSelectionEvents });
export const useSelectionScores = () => useQuery({ queryKey: keys.selectionScores, queryFn: api.listSelectionScores });
export const useOffers = () => useQuery({ queryKey: keys.offers, queryFn: api.listOffers });
export const useOfferAcceptances = () => useQuery({ queryKey: keys.offerAcceptances, queryFn: api.listOfferAcceptances });
export const useConversionCases = () => useQuery({ queryKey: keys.conversionCases, queryFn: api.listConversionCases });
export const useConversionSteps = () => useQuery({ queryKey: keys.conversionSteps, queryFn: api.listConversionSteps });
// M05
export const usePersons = () => useQuery({ queryKey: keys.persons, queryFn: api.listPersons });
export const useStudents = () => useQuery({ queryKey: keys.students, queryFn: api.listStudents });
export const useGuardians = () => useQuery({ queryKey: keys.guardians, queryFn: api.listGuardians });
export const useStudentGuardians = () => useQuery({ queryKey: keys.studentGuardians, queryFn: api.listStudentGuardians });
export const useStudentDocuments = () => useQuery({ queryKey: keys.studentDocuments, queryFn: api.listStudentDocuments });
export const useEnrolments = () => useQuery({ queryKey: keys.enrolments, queryFn: api.listEnrolments });
export const useSubjectSelections = () => useQuery({ queryKey: keys.subjectSelections, queryFn: api.listSubjectSelections });
export const useStudentMovements = () => useQuery({ queryKey: keys.studentMovements, queryFn: api.listStudentMovements });
export const useProgressionAudits = () => useQuery({ queryKey: keys.progressionAudits, queryFn: api.listProgressionAudits });
export const useStudentHolds = () => useQuery({ queryKey: keys.studentHolds, queryFn: api.listStudentHolds });
export const useClearanceCases = () => useQuery({ queryKey: keys.clearanceCases, queryFn: api.listClearanceCases });
export const useClearanceResponses = () => useQuery({ queryKey: keys.clearanceResponses, queryFn: api.listClearanceResponses });
export const useIdentityCards = () => useQuery({ queryKey: keys.identityCards, queryFn: api.listIdentityCards });
// M06
export const useCurriculumMaps = () => useQuery({ queryKey: keys.curriculumMaps, queryFn: api.listCurriculumMaps });
export const useLearningOutcomes = () => useQuery({ queryKey: keys.learningOutcomes, queryFn: api.listLearningOutcomes });
export const useSyllabusPlans = () => useQuery({ queryKey: keys.syllabusPlans, queryFn: api.listSyllabusPlans });
export const useContentPlanItems = () => useQuery({ queryKey: keys.contentPlanItems, queryFn: api.listContentPlanItems });
export const useTeachingAssignments = () => useQuery({ queryKey: keys.teachingAssignments, queryFn: api.listTeachingAssignments });
export const useLessonPlans = () => useQuery({ queryKey: keys.lessonPlans, queryFn: api.listLessonPlans });
export const useCoverageEntries = () => useQuery({ queryKey: keys.coverageEntries, queryFn: api.listCoverageEntries });
export const useWorkloadAllocations = () => useQuery({ queryKey: keys.workloadAllocations, queryFn: api.listWorkloadAllocations });
export const useQualityReviews = () => useQuery({ queryKey: keys.qualityReviews, queryFn: api.listQualityReviews });
export const useQualityEvidences = () => useQuery({ queryKey: keys.qualityEvidences, queryFn: api.listQualityEvidences });
export const useModerationReviews = () => useQuery({ queryKey: keys.moderationReviews, queryFn: api.listModerationReviews });
export const useReviewActions = () => useQuery({ queryKey: keys.reviewActions, queryFn: api.listReviewActions });
// M07
export const useTimetables = () => useQuery({ queryKey: keys.timetables, queryFn: api.listTimetables });
export const useTimetableSlots = () => useQuery({ queryKey: keys.timetableSlots, queryFn: api.listTimetableSlots });
export const useTimetableAssignments = () => useQuery({ queryKey: keys.timetableAssignments, queryFn: api.listTimetableAssignments });
export const useSubstitutions = () => useQuery({ queryKey: keys.substitutions, queryFn: api.listSubstitutions });
export const useAttendanceSessions = () => useQuery({ queryKey: keys.attendanceSessions, queryFn: api.listAttendanceSessions });
export const useStudentAttendances = () => useQuery({ queryKey: keys.studentAttendances, queryFn: api.listStudentAttendances });
export const useAttendanceCorrections = () => useQuery({ queryKey: keys.attendanceCorrections, queryFn: api.listAttendanceCorrections });
export const useAttendanceAlerts = () => useQuery({ queryKey: keys.attendanceAlerts, queryFn: api.listAttendanceAlerts });
export const useShifts = () => useQuery({ queryKey: keys.shifts, queryFn: api.listShifts });
export const useStaffRosters = () => useQuery({ queryKey: keys.staffRosters, queryFn: api.listStaffRosters });
export const useTimeEntries = () => useQuery({ queryKey: keys.timeEntries, queryFn: api.listTimeEntries });
export const useTimeAdjustments = () => useQuery({ queryKey: keys.timeAdjustments, queryFn: api.listTimeAdjustments });
// M08
export const useAssessments = () => useQuery({ queryKey: keys.assessments, queryFn: api.listAssessments });
export const useAssessmentComponents = () => useQuery({ queryKey: keys.assessmentComponents, queryFn: api.listAssessmentComponents });
export const useQuestions = () => useQuery({ queryKey: keys.questions, queryFn: api.listQuestions });
export const useExamPapers = () => useQuery({ queryKey: keys.examPapers, queryFn: api.listExamPapers });
export const useExams = () => useQuery({ queryKey: keys.exams, queryFn: api.listExams });
export const useExamRegistrations = () => useQuery({ queryKey: keys.examRegistrations, queryFn: api.listExamRegistrations });
export const useExamRooms = () => useQuery({ queryKey: keys.examRooms, queryFn: api.listExamRooms });
export const useSeatAllocations = () => useQuery({ queryKey: keys.seatAllocations, queryFn: api.listSeatAllocations });
export const useInvigilationDuties = () => useQuery({ queryKey: keys.invigilationDuties, queryFn: api.listInvigilationDuties });
export const useMarkEntries = () => useQuery({ queryKey: keys.markEntries, queryFn: api.listMarkEntries });
export const useModerationRecords = () => useQuery({ queryKey: keys.moderationRecords, queryFn: api.listModerationRecords });
export const usePracticalExams = () => useQuery({ queryKey: keys.practicalExams, queryFn: api.listPracticalExams });
export const useIntegrityCases = () => useQuery({ queryKey: keys.integrityCases, queryFn: api.listIntegrityCases });
export const useRecheckRequests = () => useQuery({ queryKey: keys.recheckRequests, queryFn: api.listRecheckRequests });
// M09
export const useResultRuns = () => useQuery({ queryKey: keys.resultRuns, queryFn: api.listResultRuns });
export const useResultLines = () => useQuery({ queryKey: keys.resultLines, queryFn: api.listResultLines });
export const useResultPublications = () => useQuery({ queryKey: keys.resultPublications, queryFn: api.listResultPublications });
export const useResultCorrections = () => useQuery({ queryKey: keys.resultCorrections, queryFn: api.listResultCorrections });
export const useMarksheets = () => useQuery({ queryKey: keys.marksheets, queryFn: api.listMarksheets });
export const useTranscripts = () => useQuery({ queryKey: keys.transcripts, queryFn: api.listTranscripts });
export const useCertificates = () => useQuery({ queryKey: keys.certificates, queryFn: api.listCertificates });
export const useCertificateRequests = () => useQuery({ queryKey: keys.certificateRequests, queryFn: api.listCertificateRequests });
export const useDigitalCredentials = () => useQuery({ queryKey: keys.digitalCredentials, queryFn: api.listDigitalCredentials });
export const useCompletionRecords = () => useQuery({ queryKey: keys.completionRecords, queryFn: api.listCompletionRecords });
// M11
export const usePortalAnnouncements = () => useQuery({ queryKey: keys.portalAnnouncements, queryFn: api.listPortalAnnouncements });
export const usePortalAccessLogs = () => useQuery({ queryKey: keys.portalAccessLogs, queryFn: api.listPortalAccessLogs });
export const useKioskSessions = () => useQuery({ queryKey: keys.kioskSessions, queryFn: api.listKioskSessions });
export const useMobileDevices = () => useQuery({ queryKey: keys.mobileDevices, queryFn: api.listMobileDevices });
export const useOfflineSyncLogs = () => useQuery({ queryKey: keys.offlineSyncLogs, queryFn: api.listOfflineSyncLogs });
export const useAccessibilityProfiles = () => useQuery({ queryKey: keys.accessibilityProfiles, queryFn: api.listAccessibilityProfiles });
export const usePortalTickets = () => useQuery({ queryKey: keys.portalTickets, queryFn: api.listPortalTickets });
// M12
export const useFiscalYears = () => useQuery({ queryKey: keys.fiscalYears, queryFn: api.listFiscalYears });
export const useChartOfAccounts = () => useQuery({ queryKey: keys.chartOfAccounts, queryFn: api.listChartOfAccounts });
export const useJournalEntries = () => useQuery({ queryKey: keys.journalEntries, queryFn: api.listJournalEntries });
export const useFeeStructures = () => useQuery({ queryKey: keys.feeStructures, queryFn: api.listFeeStructures });
export const useFeeAssignments = () => useQuery({ queryKey: keys.feeAssignments, queryFn: api.listFeeAssignments });
export const useInvoices = () => useQuery({ queryKey: keys.invoices, queryFn: api.listInvoices });
export const usePayments = () => useQuery({ queryKey: keys.payments, queryFn: api.listPayments });
export const useCreditNotes = () => useQuery({ queryKey: keys.creditNotes, queryFn: api.listCreditNotes });
export const useVendorBills = () => useQuery({ queryKey: keys.vendorBills, queryFn: api.listVendorBills });
export const useExpenseClaims = () => useQuery({ queryKey: keys.expenseClaims, queryFn: api.listExpenseClaims });
export const useBankAccounts = () => useQuery({ queryKey: keys.bankAccounts, queryFn: api.listBankAccounts });
export const useBudgets = () => useQuery({ queryKey: keys.budgets, queryFn: api.listBudgets });
// M13
export const useStaffProfiles = () => useQuery({ queryKey: keys.staffProfiles, queryFn: api.listStaffProfiles });
export const usePositions = () => useQuery({ queryKey: keys.positions, queryFn: api.listPositions });
export const useRecruitments = () => useQuery({ queryKey: keys.recruitments, queryFn: api.listRecruitments });
export const useLeaveRequests = () => useQuery({ queryKey: keys.leaveRequests, queryFn: api.listLeaveRequests });
export const usePerformanceReviews = () => useQuery({ queryKey: keys.performanceReviews, queryFn: api.listPerformanceReviews });
export const useCompensations = () => useQuery({ queryKey: keys.compensations, queryFn: api.listCompensations });
export const usePayrollRuns = () => useQuery({ queryKey: keys.payrollRuns, queryFn: api.listPayrollRuns });
export const usePayslips = () => useQuery({ queryKey: keys.payslips, queryFn: api.listPayslips });
export const useSeparations = () => useQuery({ queryKey: keys.separations, queryFn: api.listSeparations });
export const useStaffContracts = () => useQuery({ queryKey: keys.staffContracts, queryFn: api.listStaffContracts });

// ── Mutations ────────────────────────────────────────────────────────────────
function useErpMutation<TIn, TOut>(
  fn: (input: TIn) => Promise<TOut>,
  invalidate: readonly (readonly unknown[])[]
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      await Promise.all(invalidate.map((k) => qc.invalidateQueries({ queryKey: k })));
    },
  });
}

// M01
export const useSaveTenant = () => useErpMutation<Tenant, Tenant>(api.saveTenant, [keys.tenants, keys.audit]);
export const useDeleteTenant = () => useErpMutation<Tenant, void>(api.deleteTenant, [keys.tenants, keys.audit]);
export const useSaveInstitution = () => useErpMutation<Institution, Institution>(api.saveInstitution, [keys.institution, keys.audit]);
export const useSaveLegalEntity = () => useErpMutation<LegalEntity, LegalEntity>(api.saveLegalEntity, [keys.legalEntities, keys.audit]);
export const useDeleteLegalEntity = () => useErpMutation<LegalEntity, void>(api.deleteLegalEntity, [keys.legalEntities, keys.audit]);
export const useSaveCampus = () => useErpMutation<Campus, Campus>(api.saveCampus, [keys.campuses, keys.audit]);
export const useDeleteCampus = () => useErpMutation<Campus, void>(api.deleteCampus, [keys.campuses, keys.audit]);
export const useSaveOrgUnit = () => useErpMutation<OrgUnit, OrgUnit>(api.saveOrgUnit, [keys.orgUnits, keys.audit]);
export const useDeleteOrgUnit = () => useErpMutation<{ unit: OrgUnit; children: number }, void>(
  ({ unit, children }) => api.deleteOrgUnit(unit, children),
  [keys.orgUnits, keys.audit]
);
export const useSaveLocation = () => useErpMutation<LocationNode, LocationNode>(api.saveLocation, [keys.locations, keys.audit]);
export const useDeleteLocation = () => useErpMutation<{ loc: LocationNode; children: number }, void>(
  ({ loc, children }) => api.deleteLocation(loc, children),
  [keys.locations, keys.audit]
);
export const useSaveHoliday = () => useErpMutation<Holiday, Holiday>(api.saveHoliday, [keys.holidays, keys.audit]);
export const useDeleteHoliday = () => useErpMutation<Holiday, void>(api.deleteHoliday, [keys.holidays, keys.audit]);
export const useSaveLocale = () => useErpMutation<LocaleSettings, LocaleSettings>(api.saveLocale, [keys.locale, keys.audit]);
export const useSaveSequence = () => useErpMutation<DocSequence, DocSequence>(api.saveSequence, [keys.sequences, keys.audit]);
export const useSaveFeatureFlag = () => useErpMutation<FeatureFlag, FeatureFlag>(api.saveFeatureFlag, [keys.featureFlags, keys.audit]);
export const useSaveConfigVersion = () => useErpMutation<ConfigVersion, ConfigVersion>(api.saveConfigVersion, [keys.configVersions, keys.audit]);

// M02
export const useSaveUserIdentity = () => useErpMutation<UserIdentity, UserIdentity>(api.saveUserIdentity, [keys.userIdentities, keys.audit]);
export const useDeleteUserIdentity = () => useErpMutation<UserIdentity, void>(api.deleteUserIdentity, [keys.userIdentities, keys.audit]);
export const useRevokeAuthSession = () => useErpMutation<AuthSession, void>(api.revokeAuthSession, [keys.authSessions, keys.audit]);
export const useSaveRole = () => useErpMutation<Role, Role>(api.saveRole, [keys.roles, keys.audit]);
export const useDeleteRole = () => useErpMutation<Role, void>(api.deleteRole, [keys.roles, keys.audit]);
export const useSaveUserRole = () => useErpMutation<UserRole, UserRole>(api.saveUserRole, [keys.userRoles, keys.audit]);
export const useDeleteUserRole = () => useErpMutation<UserRole, void>(api.deleteUserRole, [keys.userRoles, keys.audit]);
export const useSaveDataScope = () => useErpMutation<DataScope, DataScope>(api.saveDataScope, [keys.dataScopes, keys.audit]);
export const useDeleteDataScope = () => useErpMutation<DataScope, void>(api.deleteDataScope, [keys.dataScopes, keys.audit]);
export const useSaveDelegation = () => useErpMutation<Delegation, Delegation>(api.saveDelegation, [keys.delegations, keys.audit]);
export const useRevokeDelegation = () => useErpMutation<Delegation, void>(api.revokeDelegation, [keys.delegations, keys.audit]);
export const useSaveImpersonationLog = () => useErpMutation<ImpersonationLog, ImpersonationLog>(api.saveImpersonationLog, [keys.impersonationLogs, keys.audit]);
export const useSaveDutyRule = () => useErpMutation<DutyRule, DutyRule>(api.saveDutyRule, [keys.dutyRules, keys.audit]);
export const useDeleteDutyRule = () => useErpMutation<DutyRule, void>(api.deleteDutyRule, [keys.dutyRules, keys.audit]);
export const useSaveDutyViolation = () => useErpMutation<DutyViolation, DutyViolation>(api.saveDutyViolation, [keys.dutyViolations, keys.audit]);
export const useSavePrivilegedAccess = () => useErpMutation<PrivilegedAccess, PrivilegedAccess>(api.savePrivilegedAccess, [keys.privilegedAccess, keys.audit]);
export const useSaveAccessReview = () => useErpMutation<AccessReview, AccessReview>(api.saveAccessReview, [keys.accessReviews, keys.audit]);
// M03
export const useSaveAcademicYear = () => useErpMutation<AcademicYear, AcademicYear>(api.saveAcademicYear, [keys.academicYears, keys.audit]);
export const useDeleteAcademicYear = () => useErpMutation<AcademicYear, void>(api.deleteAcademicYear, [keys.academicYears, keys.audit]);
export const useSaveTerm = () => useErpMutation<Term, Term>(api.saveTerm, [keys.terms, keys.audit]);
export const useDeleteTerm = () => useErpMutation<Term, void>(api.deleteTerm, [keys.terms, keys.audit]);
export const useSaveSchoolLevel = () => useErpMutation<SchoolLevel, SchoolLevel>(api.saveSchoolLevel, [keys.schoolLevels, keys.audit]);
export const useSaveGradeClass = () => useErpMutation<GradeClass, GradeClass>(api.saveGradeClass, [keys.gradeClasses, keys.audit]);
export const useDeleteGradeClass = () => useErpMutation<GradeClass, void>(api.deleteGradeClass, [keys.gradeClasses, keys.audit]);
export const useSaveStream = () => useErpMutation<Stream, Stream>(api.saveStream, [keys.streams, keys.audit]);
export const useDeleteStream = () => useErpMutation<Stream, void>(api.deleteStream, [keys.streams, keys.audit]);
export const useSaveSubject = () => useErpMutation<Subject, Subject>(api.saveSubject, [keys.subjects, keys.audit]);
export const useDeleteSubject = () => useErpMutation<Subject, void>(api.deleteSubject, [keys.subjects, keys.audit]);
export const useSaveCurriculumOffering = () => useErpMutation<CurriculumOffering, CurriculumOffering>(api.saveCurriculumOffering, [keys.curriculumOfferings, keys.audit]);
export const useDeleteCurriculumOffering = () => useErpMutation<CurriculumOffering, void>(api.deleteCurriculumOffering, [keys.curriculumOfferings, keys.audit]);
export const useSaveSection = () => useErpMutation<Section, Section>(api.saveSection, [keys.sections, keys.audit]);
export const useDeleteSection = () => useErpMutation<Section, void>(api.deleteSection, [keys.sections, keys.audit]);
export const useSaveHouse = () => useErpMutation<House, House>(api.saveHouse, [keys.houses, keys.audit]);
export const useSaveCohort = () => useErpMutation<Cohort, Cohort>(api.saveCohort, [keys.cohorts, keys.audit]);
export const useSaveGradingScale = () => useErpMutation<GradingScale, GradingScale>(api.saveGradingScale, [keys.gradingScales, keys.audit]);
export const useDeleteGradingScale = () => useErpMutation<GradingScale, void>(api.deleteGradingScale, [keys.gradingScales, keys.audit]);
export const useSavePromotionRule = () => useErpMutation<PromotionRule, PromotionRule>(api.savePromotionRule, [keys.promotionRules, keys.audit]);
export const useDeletePromotionRule = () => useErpMutation<PromotionRule, void>(api.deletePromotionRule, [keys.promotionRules, keys.audit]);
export const useSaveCompletionRule = () => useErpMutation<CompletionRule, CompletionRule>(api.saveCompletionRule, [keys.completionRules, keys.audit]);
export const useSaveAcademicPolicy = () => useErpMutation<AcademicPolicy, AcademicPolicy>(api.saveAcademicPolicy, [keys.academicPolicies, keys.audit]);
export const useDeleteAcademicPolicy = () => useErpMutation<AcademicPolicy, void>(api.deleteAcademicPolicy, [keys.academicPolicies, keys.audit]);
// M04
export const useSaveCampaign = () => useErpMutation<Campaign, Campaign>(api.saveCampaign, [keys.campaigns, keys.audit]);
export const useDeleteCampaign = () => useErpMutation<Campaign, void>(api.deleteCampaign, [keys.campaigns, keys.audit]);
export const useSaveEnquiry = () => useErpMutation<Enquiry, Enquiry>(api.saveEnquiry, [keys.enquiries, keys.audit]);
export const useDeleteEnquiry = () => useErpMutation<Enquiry, void>(api.deleteEnquiry, [keys.enquiries, keys.audit]);
export const useSaveEnquiryInteraction = () => useErpMutation<EnquiryInteraction, EnquiryInteraction>(api.saveEnquiryInteraction, [keys.enquiryInteractions, keys.audit]);
export const useDeleteEnquiryInteraction = () => useErpMutation<EnquiryInteraction, void>(api.deleteEnquiryInteraction, [keys.enquiryInteractions, keys.audit]);
export const useSaveApplication = () => useErpMutation<Application, Application>(api.saveApplication, [keys.applications, keys.audit]);
export const useDeleteApplication = () => useErpMutation<Application, void>(api.deleteApplication, [keys.applications, keys.audit]);
export const useSaveApplicationChoice = () => useErpMutation<ApplicationChoice, ApplicationChoice>(api.saveApplicationChoice, [keys.applicationChoices, keys.audit]);
export const useDeleteApplicationChoice = () => useErpMutation<ApplicationChoice, void>(api.deleteApplicationChoice, [keys.applicationChoices, keys.audit]);
export const useSaveApplicationDocument = () => useErpMutation<ApplicationDocument, ApplicationDocument>(api.saveApplicationDocument, [keys.applicationDocuments, keys.audit]);
export const useDeleteApplicationDocument = () => useErpMutation<ApplicationDocument, void>(api.deleteApplicationDocument, [keys.applicationDocuments, keys.audit]);
export const useSaveEligibilityDecision = () => useErpMutation<EligibilityDecision, EligibilityDecision>(api.saveEligibilityDecision, [keys.eligibilityDecisions, keys.audit]);
export const useDeleteEligibilityDecision = () => useErpMutation<EligibilityDecision, void>(api.deleteEligibilityDecision, [keys.eligibilityDecisions, keys.audit]);
export const useSaveSelectionEvent = () => useErpMutation<SelectionEvent, SelectionEvent>(api.saveSelectionEvent, [keys.selectionEvents, keys.audit]);
export const useDeleteSelectionEvent = () => useErpMutation<SelectionEvent, void>(api.deleteSelectionEvent, [keys.selectionEvents, keys.audit]);
export const useSaveSelectionScore = () => useErpMutation<SelectionScore, SelectionScore>(api.saveSelectionScore, [keys.selectionScores, keys.audit]);
export const useDeleteSelectionScore = () => useErpMutation<SelectionScore, void>(api.deleteSelectionScore, [keys.selectionScores, keys.audit]);
export const useSaveOffer = () => useErpMutation<Offer, Offer>(api.saveOffer, [keys.offers, keys.audit]);
export const useDeleteOffer = () => useErpMutation<Offer, void>(api.deleteOffer, [keys.offers, keys.audit]);
export const useSaveOfferAcceptance = () => useErpMutation<OfferAcceptance, OfferAcceptance>(api.saveOfferAcceptance, [keys.offerAcceptances, keys.audit]);
export const useDeleteOfferAcceptance = () => useErpMutation<OfferAcceptance, void>(api.deleteOfferAcceptance, [keys.offerAcceptances, keys.audit]);
export const useSaveConversionCase = () => useErpMutation<ConversionCase, ConversionCase>(api.saveConversionCase, [keys.conversionCases, keys.audit]);
export const useDeleteConversionCase = () => useErpMutation<ConversionCase, void>(api.deleteConversionCase, [keys.conversionCases, keys.audit]);
export const useSaveConversionStep = () => useErpMutation<ConversionStep, ConversionStep>(api.saveConversionStep, [keys.conversionSteps, keys.audit]);
export const useDeleteConversionStep = () => useErpMutation<ConversionStep, void>(api.deleteConversionStep, [keys.conversionSteps, keys.audit]);
// M05
export const useSavePerson = () => useErpMutation<Person, Person>(api.savePerson, [keys.persons, keys.audit]);
export const useDeletePerson = () => useErpMutation<Person, void>(api.deletePerson, [keys.persons, keys.audit]);
export const useSaveStudent = () => useErpMutation<Student, Student>(api.saveStudent, [keys.students, keys.audit]);
export const useDeleteStudent = () => useErpMutation<Student, void>(api.deleteStudent, [keys.students, keys.audit]);
export const useSaveGuardian = () => useErpMutation<Guardian, Guardian>(api.saveGuardian, [keys.guardians, keys.audit]);
export const useDeleteGuardian = () => useErpMutation<Guardian, void>(api.deleteGuardian, [keys.guardians, keys.audit]);
export const useSaveStudentGuardian = () => useErpMutation<StudentGuardian, StudentGuardian>(api.saveStudentGuardian, [keys.studentGuardians, keys.audit]);
export const useDeleteStudentGuardian = () => useErpMutation<StudentGuardian, void>(api.deleteStudentGuardian, [keys.studentGuardians, keys.audit]);
export const useSaveStudentDocument = () => useErpMutation<StudentDocument, StudentDocument>(api.saveStudentDocument, [keys.studentDocuments, keys.audit]);
export const useDeleteStudentDocument = () => useErpMutation<StudentDocument, void>(api.deleteStudentDocument, [keys.studentDocuments, keys.audit]);
export const useSaveEnrolment = () => useErpMutation<Enrolment, Enrolment>(api.saveEnrolment, [keys.enrolments, keys.audit]);
export const useDeleteEnrolment = () => useErpMutation<Enrolment, void>(api.deleteEnrolment, [keys.enrolments, keys.audit]);
export const useSaveSubjectSelection = () => useErpMutation<SubjectSelection, SubjectSelection>(api.saveSubjectSelection, [keys.subjectSelections, keys.audit]);
export const useDeleteSubjectSelection = () => useErpMutation<SubjectSelection, void>(api.deleteSubjectSelection, [keys.subjectSelections, keys.audit]);
export const useSaveStudentMovement = () => useErpMutation<StudentMovement, StudentMovement>(api.saveStudentMovement, [keys.studentMovements, keys.audit]);
export const useDeleteStudentMovement = () => useErpMutation<StudentMovement, void>(api.deleteStudentMovement, [keys.studentMovements, keys.audit]);
export const useSaveProgressionAudit = () => useErpMutation<ProgressionAudit, ProgressionAudit>(api.saveProgressionAudit, [keys.progressionAudits, keys.audit]);
export const useDeleteProgressionAudit = () => useErpMutation<ProgressionAudit, void>(api.deleteProgressionAudit, [keys.progressionAudits, keys.audit]);
export const useSaveStudentHold = () => useErpMutation<StudentHold, StudentHold>(api.saveStudentHold, [keys.studentHolds, keys.audit]);
export const useDeleteStudentHold = () => useErpMutation<StudentHold, void>(api.deleteStudentHold, [keys.studentHolds, keys.audit]);
export const useSaveClearanceCase = () => useErpMutation<ClearanceCase, ClearanceCase>(api.saveClearanceCase, [keys.clearanceCases, keys.audit]);
export const useDeleteClearanceCase = () => useErpMutation<ClearanceCase, void>(api.deleteClearanceCase, [keys.clearanceCases, keys.audit]);
export const useSaveClearanceResponse = () => useErpMutation<ClearanceResponse, ClearanceResponse>(api.saveClearanceResponse, [keys.clearanceResponses, keys.audit]);
export const useDeleteClearanceResponse = () => useErpMutation<ClearanceResponse, void>(api.deleteClearanceResponse, [keys.clearanceResponses, keys.audit]);
export const useSaveIdentityCard = () => useErpMutation<IdentityCard, IdentityCard>(api.saveIdentityCard, [keys.identityCards, keys.audit]);
export const useDeleteIdentityCard = () => useErpMutation<IdentityCard, void>(api.deleteIdentityCard, [keys.identityCards, keys.audit]);
// M06
export const useSaveCurriculumMap = () => useErpMutation<CurriculumMap, CurriculumMap>(api.saveCurriculumMap, [keys.curriculumMaps, keys.audit]);
export const useDeleteCurriculumMap = () => useErpMutation<CurriculumMap, void>(api.deleteCurriculumMap, [keys.curriculumMaps, keys.audit]);
export const useSaveLearningOutcome = () => useErpMutation<LearningOutcome, LearningOutcome>(api.saveLearningOutcome, [keys.learningOutcomes, keys.audit]);
export const useDeleteLearningOutcome = () => useErpMutation<LearningOutcome, void>(api.deleteLearningOutcome, [keys.learningOutcomes, keys.audit]);
export const useSaveSyllabusPlan = () => useErpMutation<SyllabusPlan, SyllabusPlan>(api.saveSyllabusPlan, [keys.syllabusPlans, keys.audit]);
export const useDeleteSyllabusPlan = () => useErpMutation<SyllabusPlan, void>(api.deleteSyllabusPlan, [keys.syllabusPlans, keys.audit]);
export const useSaveContentPlanItem = () => useErpMutation<ContentPlanItem, ContentPlanItem>(api.saveContentPlanItem, [keys.contentPlanItems, keys.audit]);
export const useDeleteContentPlanItem = () => useErpMutation<ContentPlanItem, void>(api.deleteContentPlanItem, [keys.contentPlanItems, keys.audit]);
export const useSaveTeachingAssignment = () => useErpMutation<TeachingAssignment, TeachingAssignment>(api.saveTeachingAssignment, [keys.teachingAssignments, keys.audit]);
export const useDeleteTeachingAssignment = () => useErpMutation<TeachingAssignment, void>(api.deleteTeachingAssignment, [keys.teachingAssignments, keys.audit]);
export const useSaveLessonPlan = () => useErpMutation<LessonPlan, LessonPlan>(api.saveLessonPlan, [keys.lessonPlans, keys.audit]);
export const useDeleteLessonPlan = () => useErpMutation<LessonPlan, void>(api.deleteLessonPlan, [keys.lessonPlans, keys.audit]);
export const useSaveCoverageEntry = () => useErpMutation<CoverageEntry, CoverageEntry>(api.saveCoverageEntry, [keys.coverageEntries, keys.audit]);
export const useDeleteCoverageEntry = () => useErpMutation<CoverageEntry, void>(api.deleteCoverageEntry, [keys.coverageEntries, keys.audit]);
export const useSaveWorkloadAllocation = () => useErpMutation<WorkloadAllocation, WorkloadAllocation>(api.saveWorkloadAllocation, [keys.workloadAllocations, keys.audit]);
export const useDeleteWorkloadAllocation = () => useErpMutation<WorkloadAllocation, void>(api.deleteWorkloadAllocation, [keys.workloadAllocations, keys.audit]);
export const useSaveQualityReview = () => useErpMutation<QualityReview, QualityReview>(api.saveQualityReview, [keys.qualityReviews, keys.audit]);
export const useDeleteQualityReview = () => useErpMutation<QualityReview, void>(api.deleteQualityReview, [keys.qualityReviews, keys.audit]);
export const useSaveQualityEvidence = () => useErpMutation<QualityEvidence, QualityEvidence>(api.saveQualityEvidence, [keys.qualityEvidences, keys.audit]);
export const useDeleteQualityEvidence = () => useErpMutation<QualityEvidence, void>(api.deleteQualityEvidence, [keys.qualityEvidences, keys.audit]);
export const useSaveModerationReview = () => useErpMutation<ModerationReview, ModerationReview>(api.saveModerationReview, [keys.moderationReviews, keys.audit]);
export const useDeleteModerationReview = () => useErpMutation<ModerationReview, void>(api.deleteModerationReview, [keys.moderationReviews, keys.audit]);
export const useSaveReviewAction = () => useErpMutation<ReviewAction, ReviewAction>(api.saveReviewAction, [keys.reviewActions, keys.audit]);
export const useDeleteReviewAction = () => useErpMutation<ReviewAction, void>(api.deleteReviewAction, [keys.reviewActions, keys.audit]);
// M07
export const useSaveTimetable = () => useErpMutation<Timetable, Timetable>(api.saveTimetable, [keys.timetables, keys.audit]);
export const useDeleteTimetable = () => useErpMutation<Timetable, void>(api.deleteTimetable, [keys.timetables, keys.audit]);
export const useSaveTimetableSlot = () => useErpMutation<TimetableSlot, TimetableSlot>(api.saveTimetableSlot, [keys.timetableSlots, keys.audit]);
export const useDeleteTimetableSlot = () => useErpMutation<TimetableSlot, void>(api.deleteTimetableSlot, [keys.timetableSlots, keys.audit]);
export const useSaveTimetableAssignment = () => useErpMutation<TimetableAssignment, TimetableAssignment>(api.saveTimetableAssignment, [keys.timetableAssignments, keys.audit]);
export const useDeleteTimetableAssignment = () => useErpMutation<TimetableAssignment, void>(api.deleteTimetableAssignment, [keys.timetableAssignments, keys.audit]);
export const useSaveSubstitution = () => useErpMutation<Substitution, Substitution>(api.saveSubstitution, [keys.substitutions, keys.audit]);
export const useDeleteSubstitution = () => useErpMutation<Substitution, void>(api.deleteSubstitution, [keys.substitutions, keys.audit]);
export const useSaveAttendanceSession = () => useErpMutation<AttendanceSession, AttendanceSession>(api.saveAttendanceSession, [keys.attendanceSessions, keys.audit]);
export const useDeleteAttendanceSession = () => useErpMutation<AttendanceSession, void>(api.deleteAttendanceSession, [keys.attendanceSessions, keys.audit]);
export const useSaveStudentAttendance = () => useErpMutation<StudentAttendance, StudentAttendance>(api.saveStudentAttendance, [keys.studentAttendances, keys.audit]);
export const useDeleteStudentAttendance = () => useErpMutation<StudentAttendance, void>(api.deleteStudentAttendance, [keys.studentAttendances, keys.audit]);
export const useSaveAttendanceCorrection = () => useErpMutation<AttendanceCorrection, AttendanceCorrection>(api.saveAttendanceCorrection, [keys.attendanceCorrections, keys.audit]);
export const useDeleteAttendanceCorrection = () => useErpMutation<AttendanceCorrection, void>(api.deleteAttendanceCorrection, [keys.attendanceCorrections, keys.audit]);
export const useSaveAttendanceAlert = () => useErpMutation<AttendanceAlert, AttendanceAlert>(api.saveAttendanceAlert, [keys.attendanceAlerts, keys.audit]);
export const useDeleteAttendanceAlert = () => useErpMutation<AttendanceAlert, void>(api.deleteAttendanceAlert, [keys.attendanceAlerts, keys.audit]);
export const useSaveShift = () => useErpMutation<Shift, Shift>(api.saveShift, [keys.shifts, keys.audit]);
export const useDeleteShift = () => useErpMutation<Shift, void>(api.deleteShift, [keys.shifts, keys.audit]);
export const useSaveStaffRoster = () => useErpMutation<StaffRoster, StaffRoster>(api.saveStaffRoster, [keys.staffRosters, keys.audit]);
export const useDeleteStaffRoster = () => useErpMutation<StaffRoster, void>(api.deleteStaffRoster, [keys.staffRosters, keys.audit]);
export const useSaveTimeEntry = () => useErpMutation<TimeEntry, TimeEntry>(api.saveTimeEntry, [keys.timeEntries, keys.audit]);
export const useDeleteTimeEntry = () => useErpMutation<TimeEntry, void>(api.deleteTimeEntry, [keys.timeEntries, keys.audit]);
export const useSaveTimeAdjustment = () => useErpMutation<TimeAdjustment, TimeAdjustment>(api.saveTimeAdjustment, [keys.timeAdjustments, keys.audit]);
export const useDeleteTimeAdjustment = () => useErpMutation<TimeAdjustment, void>(api.deleteTimeAdjustment, [keys.timeAdjustments, keys.audit]);
// M08
export const useSaveAssessment = () => useErpMutation<Assessment, Assessment>(api.saveAssessment, [keys.assessments, keys.audit]);
export const useDeleteAssessment = () => useErpMutation<Assessment, void>(api.deleteAssessment, [keys.assessments, keys.audit]);
export const useSaveAssessmentComponent = () => useErpMutation<AssessmentComponent, AssessmentComponent>(api.saveAssessmentComponent, [keys.assessmentComponents, keys.audit]);
export const useDeleteAssessmentComponent = () => useErpMutation<AssessmentComponent, void>(api.deleteAssessmentComponent, [keys.assessmentComponents, keys.audit]);
export const useSaveQuestion = () => useErpMutation<Question, Question>(api.saveQuestion, [keys.questions, keys.audit]);
export const useDeleteQuestion = () => useErpMutation<Question, void>(api.deleteQuestion, [keys.questions, keys.audit]);
export const useSaveExamPaper = () => useErpMutation<ExamPaper, ExamPaper>(api.saveExamPaper, [keys.examPapers, keys.audit]);
export const useDeleteExamPaper = () => useErpMutation<ExamPaper, void>(api.deleteExamPaper, [keys.examPapers, keys.audit]);
export const useSaveExam = () => useErpMutation<Exam, Exam>(api.saveExam, [keys.exams, keys.audit]);
export const useDeleteExam = () => useErpMutation<Exam, void>(api.deleteExam, [keys.exams, keys.audit]);
export const useSaveExamRegistration = () => useErpMutation<ExamRegistration, ExamRegistration>(api.saveExamRegistration, [keys.examRegistrations, keys.audit]);
export const useDeleteExamRegistration = () => useErpMutation<ExamRegistration, void>(api.deleteExamRegistration, [keys.examRegistrations, keys.audit]);
export const useSaveExamRoom = () => useErpMutation<ExamRoom, ExamRoom>(api.saveExamRoom, [keys.examRooms, keys.audit]);
export const useDeleteExamRoom = () => useErpMutation<ExamRoom, void>(api.deleteExamRoom, [keys.examRooms, keys.audit]);
export const useSaveSeatAllocation = () => useErpMutation<SeatAllocation, SeatAllocation>(api.saveSeatAllocation, [keys.seatAllocations, keys.audit]);
export const useDeleteSeatAllocation = () => useErpMutation<SeatAllocation, void>(api.deleteSeatAllocation, [keys.seatAllocations, keys.audit]);
export const useSaveInvigilationDuty = () => useErpMutation<InvigilationDuty, InvigilationDuty>(api.saveInvigilationDuty, [keys.invigilationDuties, keys.audit]);
export const useDeleteInvigilationDuty = () => useErpMutation<InvigilationDuty, void>(api.deleteInvigilationDuty, [keys.invigilationDuties, keys.audit]);
export const useSaveMarkEntry = () => useErpMutation<MarkEntry, MarkEntry>(api.saveMarkEntry, [keys.markEntries, keys.audit]);
export const useDeleteMarkEntry = () => useErpMutation<MarkEntry, void>(api.deleteMarkEntry, [keys.markEntries, keys.audit]);
export const useSaveModerationRecord = () => useErpMutation<ModerationRecord, ModerationRecord>(api.saveModerationRecord, [keys.moderationRecords, keys.audit]);
export const useDeleteModerationRecord = () => useErpMutation<ModerationRecord, void>(api.deleteModerationRecord, [keys.moderationRecords, keys.audit]);
export const useSavePracticalExam = () => useErpMutation<PracticalExam, PracticalExam>(api.savePracticalExam, [keys.practicalExams, keys.audit]);
export const useDeletePracticalExam = () => useErpMutation<PracticalExam, void>(api.deletePracticalExam, [keys.practicalExams, keys.audit]);
export const useSaveIntegrityCase = () => useErpMutation<IntegrityCase, IntegrityCase>(api.saveIntegrityCase, [keys.integrityCases, keys.audit]);
export const useDeleteIntegrityCase = () => useErpMutation<IntegrityCase, void>(api.deleteIntegrityCase, [keys.integrityCases, keys.audit]);
export const useSaveRecheckRequest = () => useErpMutation<RecheckRequest, RecheckRequest>(api.saveRecheckRequest, [keys.recheckRequests, keys.audit]);
export const useDeleteRecheckRequest = () => useErpMutation<RecheckRequest, void>(api.deleteRecheckRequest, [keys.recheckRequests, keys.audit]);
// M09
export const useSaveResultRun = () => useErpMutation<ResultRun, ResultRun>(api.saveResultRun, [keys.resultRuns, keys.audit]);
export const useDeleteResultRun = () => useErpMutation<ResultRun, void>(api.deleteResultRun, [keys.resultRuns, keys.audit]);
export const useSaveResultLine = () => useErpMutation<ResultLine, ResultLine>(api.saveResultLine, [keys.resultLines, keys.audit]);
export const useDeleteResultLine = () => useErpMutation<ResultLine, void>(api.deleteResultLine, [keys.resultLines, keys.audit]);
export const useSaveResultPublication = () => useErpMutation<ResultPublication, ResultPublication>(api.saveResultPublication, [keys.resultPublications, keys.audit]);
export const useDeleteResultPublication = () => useErpMutation<ResultPublication, void>(api.deleteResultPublication, [keys.resultPublications, keys.audit]);
export const useSaveResultCorrection = () => useErpMutation<ResultCorrection, ResultCorrection>(api.saveResultCorrection, [keys.resultCorrections, keys.audit]);
export const useDeleteResultCorrection = () => useErpMutation<ResultCorrection, void>(api.deleteResultCorrection, [keys.resultCorrections, keys.audit]);
export const useSaveMarksheet = () => useErpMutation<Marksheet, Marksheet>(api.saveMarksheet, [keys.marksheets, keys.audit]);
export const useDeleteMarksheet = () => useErpMutation<Marksheet, void>(api.deleteMarksheet, [keys.marksheets, keys.audit]);
export const useSaveTranscript = () => useErpMutation<Transcript, Transcript>(api.saveTranscript, [keys.transcripts, keys.audit]);
export const useDeleteTranscript = () => useErpMutation<Transcript, void>(api.deleteTranscript, [keys.transcripts, keys.audit]);
export const useSaveCertificate = () => useErpMutation<Certificate, Certificate>(api.saveCertificate, [keys.certificates, keys.audit]);
export const useDeleteCertificate = () => useErpMutation<Certificate, void>(api.deleteCertificate, [keys.certificates, keys.audit]);
export const useSaveCertificateRequest = () => useErpMutation<CertificateRequest, CertificateRequest>(api.saveCertificateRequest, [keys.certificateRequests, keys.audit]);
export const useDeleteCertificateRequest = () => useErpMutation<CertificateRequest, void>(api.deleteCertificateRequest, [keys.certificateRequests, keys.audit]);
export const useSaveDigitalCredential = () => useErpMutation<DigitalCredential, DigitalCredential>(api.saveDigitalCredential, [keys.digitalCredentials, keys.audit]);
export const useDeleteDigitalCredential = () => useErpMutation<DigitalCredential, void>(api.deleteDigitalCredential, [keys.digitalCredentials, keys.audit]);
export const useSaveCompletionRecord = () => useErpMutation<CompletionRecord, CompletionRecord>(api.saveCompletionRecord, [keys.completionRecords, keys.audit]);
export const useDeleteCompletionRecord = () => useErpMutation<CompletionRecord, void>(api.deleteCompletionRecord, [keys.completionRecords, keys.audit]);
// M11
export const useSavePortalAnnouncement = () => useErpMutation<PortalAnnouncement, PortalAnnouncement>(api.savePortalAnnouncement, [keys.portalAnnouncements, keys.audit]);
export const useDeletePortalAnnouncement = () => useErpMutation<PortalAnnouncement, void>(api.deletePortalAnnouncement, [keys.portalAnnouncements, keys.audit]);
export const useSavePortalAccessLog = () => useErpMutation<PortalAccessLog, PortalAccessLog>(api.savePortalAccessLog, [keys.portalAccessLogs, keys.audit]);
export const useDeletePortalAccessLog = () => useErpMutation<PortalAccessLog, void>(api.deletePortalAccessLog, [keys.portalAccessLogs, keys.audit]);
export const useSaveKioskSession = () => useErpMutation<KioskSession, KioskSession>(api.saveKioskSession, [keys.kioskSessions, keys.audit]);
export const useDeleteKioskSession = () => useErpMutation<KioskSession, void>(api.deleteKioskSession, [keys.kioskSessions, keys.audit]);
export const useSaveMobileDevice = () => useErpMutation<MobileDevice, MobileDevice>(api.saveMobileDevice, [keys.mobileDevices, keys.audit]);
export const useDeleteMobileDevice = () => useErpMutation<MobileDevice, void>(api.deleteMobileDevice, [keys.mobileDevices, keys.audit]);
export const useSaveOfflineSyncLog = () => useErpMutation<OfflineSyncLog, OfflineSyncLog>(api.saveOfflineSyncLog, [keys.offlineSyncLogs, keys.audit]);
export const useDeleteOfflineSyncLog = () => useErpMutation<OfflineSyncLog, void>(api.deleteOfflineSyncLog, [keys.offlineSyncLogs, keys.audit]);
export const useSaveAccessibilityProfile = () => useErpMutation<AccessibilityProfile, AccessibilityProfile>(api.saveAccessibilityProfile, [keys.accessibilityProfiles, keys.audit]);
export const useDeleteAccessibilityProfile = () => useErpMutation<AccessibilityProfile, void>(api.deleteAccessibilityProfile, [keys.accessibilityProfiles, keys.audit]);
export const useSavePortalTicket = () => useErpMutation<PortalTicket, PortalTicket>(api.savePortalTicket, [keys.portalTickets, keys.audit]);
export const useDeletePortalTicket = () => useErpMutation<PortalTicket, void>(api.deletePortalTicket, [keys.portalTickets, keys.audit]);
// M12
export const useSaveFiscalYear = () => useErpMutation<FiscalYear, FiscalYear>(api.saveFiscalYear, [keys.fiscalYears, keys.audit]);
export const useDeleteFiscalYear = () => useErpMutation<FiscalYear, void>(api.deleteFiscalYear, [keys.fiscalYears, keys.audit]);
export const useSaveChartOfAccount = () => useErpMutation<ChartOfAccount, ChartOfAccount>(api.saveChartOfAccount, [keys.chartOfAccounts, keys.audit]);
export const useDeleteChartOfAccount = () => useErpMutation<ChartOfAccount, void>(api.deleteChartOfAccount, [keys.chartOfAccounts, keys.audit]);
export const useSaveJournalEntry = () => useErpMutation<JournalEntry, JournalEntry>(api.saveJournalEntry, [keys.journalEntries, keys.audit]);
export const useDeleteJournalEntry = () => useErpMutation<JournalEntry, void>(api.deleteJournalEntry, [keys.journalEntries, keys.audit]);
export const useSaveFeeStructure = () => useErpMutation<FeeStructure, FeeStructure>(api.saveFeeStructure, [keys.feeStructures, keys.audit]);
export const useDeleteFeeStructure = () => useErpMutation<FeeStructure, void>(api.deleteFeeStructure, [keys.feeStructures, keys.audit]);
export const useSaveFeeAssignment = () => useErpMutation<FeeAssignment, FeeAssignment>(api.saveFeeAssignment, [keys.feeAssignments, keys.audit]);
export const useDeleteFeeAssignment = () => useErpMutation<FeeAssignment, void>(api.deleteFeeAssignment, [keys.feeAssignments, keys.audit]);
export const useSaveInvoice = () => useErpMutation<Invoice, Invoice>(api.saveInvoice, [keys.invoices, keys.audit]);
export const useDeleteInvoice = () => useErpMutation<Invoice, void>(api.deleteInvoice, [keys.invoices, keys.audit]);
export const useSavePayment = () => useErpMutation<Payment, Payment>(api.savePayment, [keys.payments, keys.audit]);
export const useDeletePayment = () => useErpMutation<Payment, void>(api.deletePayment, [keys.payments, keys.audit]);
export const useSaveCreditNote = () => useErpMutation<CreditNote, CreditNote>(api.saveCreditNote, [keys.creditNotes, keys.audit]);
export const useDeleteCreditNote = () => useErpMutation<CreditNote, void>(api.deleteCreditNote, [keys.creditNotes, keys.audit]);
export const useSaveVendorBill = () => useErpMutation<VendorBill, VendorBill>(api.saveVendorBill, [keys.vendorBills, keys.audit]);
export const useDeleteVendorBill = () => useErpMutation<VendorBill, void>(api.deleteVendorBill, [keys.vendorBills, keys.audit]);
export const useSaveExpenseClaim = () => useErpMutation<ExpenseClaim, ExpenseClaim>(api.saveExpenseClaim, [keys.expenseClaims, keys.audit]);
export const useDeleteExpenseClaim = () => useErpMutation<ExpenseClaim, void>(api.deleteExpenseClaim, [keys.expenseClaims, keys.audit]);
export const useSaveBankAccount = () => useErpMutation<BankAccount, BankAccount>(api.saveBankAccount, [keys.bankAccounts, keys.audit]);
export const useDeleteBankAccount = () => useErpMutation<BankAccount, void>(api.deleteBankAccount, [keys.bankAccounts, keys.audit]);
export const useSaveBudget = () => useErpMutation<Budget, Budget>(api.saveBudget, [keys.budgets, keys.audit]);
export const useDeleteBudget = () => useErpMutation<Budget, void>(api.deleteBudget, [keys.budgets, keys.audit]);
// M13
export const useSaveStaffProfile = () => useErpMutation<StaffProfile, StaffProfile>(api.saveStaffProfile, [keys.staffProfiles, keys.audit]);
export const useDeleteStaffProfile = () => useErpMutation<StaffProfile, void>(api.deleteStaffProfile, [keys.staffProfiles, keys.audit]);
export const useSavePosition = () => useErpMutation<Position, Position>(api.savePosition, [keys.positions, keys.audit]);
export const useDeletePosition = () => useErpMutation<Position, void>(api.deletePosition, [keys.positions, keys.audit]);
export const useSaveRecruitment = () => useErpMutation<Recruitment, Recruitment>(api.saveRecruitment, [keys.recruitments, keys.audit]);
export const useDeleteRecruitment = () => useErpMutation<Recruitment, void>(api.deleteRecruitment, [keys.recruitments, keys.audit]);
export const useSaveLeaveRequest = () => useErpMutation<LeaveRequest, LeaveRequest>(api.saveLeaveRequest, [keys.leaveRequests, keys.audit]);
export const useDeleteLeaveRequest = () => useErpMutation<LeaveRequest, void>(api.deleteLeaveRequest, [keys.leaveRequests, keys.audit]);
export const useSavePerformanceReview = () => useErpMutation<PerformanceReview, PerformanceReview>(api.savePerformanceReview, [keys.performanceReviews, keys.audit]);
export const useDeletePerformanceReview = () => useErpMutation<PerformanceReview, void>(api.deletePerformanceReview, [keys.performanceReviews, keys.audit]);
export const useSaveCompensation = () => useErpMutation<Compensation, Compensation>(api.saveCompensation, [keys.compensations, keys.audit]);
export const useDeleteCompensation = () => useErpMutation<Compensation, void>(api.deleteCompensation, [keys.compensations, keys.audit]);
export const useSavePayrollRun = () => useErpMutation<PayrollRun, PayrollRun>(api.savePayrollRun, [keys.payrollRuns, keys.audit]);
export const useDeletePayrollRun = () => useErpMutation<PayrollRun, void>(api.deletePayrollRun, [keys.payrollRuns, keys.audit]);
export const useSavePayslip = () => useErpMutation<Payslip, Payslip>(api.savePayslip, [keys.payslips, keys.audit]);
export const useDeletePayslip = () => useErpMutation<Payslip, void>(api.deletePayslip, [keys.payslips, keys.audit]);
export const useSaveSeparation = () => useErpMutation<Separation, Separation>(api.saveSeparation, [keys.separations, keys.audit]);
export const useDeleteSeparation = () => useErpMutation<Separation, void>(api.deleteSeparation, [keys.separations, keys.audit]);
export const useSaveStaffContract = () => useErpMutation<StaffContract, StaffContract>(api.saveStaffContract, [keys.staffContracts, keys.audit]);
export const useDeleteStaffContract = () => useErpMutation<StaffContract, void>(api.deleteStaffContract, [keys.staffContracts, keys.audit]);
