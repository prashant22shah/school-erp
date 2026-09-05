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
  StudentPortalProfile, ParentPortalProfile, TeacherPortalProfile, ManagementDashboard,
  FiscalYear, ChartOfAccount, JournalEntry, FeeStructure, FeeAssignment, Invoice,
  Payment, CreditNote, VendorBill, ExpenseClaim, RecurringJournal, DisbursementEntry,
  BankReconciliation, BankReconciliationEntry, BankAccount, Budget,
  AccountsReceivable, ScholarshipScheme, OnlinePaymentTransaction,
  RefundRecord, WriteOffEntry, DunningNotice,
  CommitmentRecord, TaxCode, AccrualEntry, Fund, PeriodCloseChecklist, FinancialStatement,
  StaffProfile, Position, Recruitment, LeaveRequest, PerformanceReview, Compensation,
  PayrollRun, Payslip, Separation, StaffContract,
  Vendor, VendorDocument, PurchaseRequisition, RequisitionItem, RFQ, BidComparison,
  PurchaseOrder, POItem, GoodsReceipt, QualityInspection, Contract, ContractRenewal,
  SupplierScore, SLATracking,
  Item, Store, StockEntry, StockLedger, PhysicalCount, VarianceReport,
  FixedAsset, AssetCategory, AssetTransfer, CustodyRecord,
  DepreciationSchedule, Impairment, AssetMaintenance, Disposal,
  LibraryResource, LibraryHolding, LibraryMember, LibraryLoan, LibraryReservation,
  LibraryAcquisition, DigitalResource,
  Vehicle, TransportRoute, BusStop, RouteSchedule, RiderAssignment, BoardingLog,
  GpsTrack, VehicleMaintenance,
  ResidenceBlock, RoomType, HostelApplication, RoomAllocation, RollCall,
  ResidenceIncident, MealPlan, MessManagement, POSModule, PrepaidWallet,
  HealthProfile, ClinicVisit, CounselingCase, SupportNeed, AccommodationPlan,
  ConductIncident, ConductAction, Grievance, AdvisingAssignment, InterventionPlan,
  CommunityEvent, EventRegistration, ActivityGroup, GroupMembership,
  Competition, CompetitionEntry, CompetitionResult,
  Trip, TripParticipant, PTMEvent, PTMBooking, FundraisingCampaign, Donation,
  SubjectCombinationRule, StudentSubjectPlan, BoardRegistration, ReadinessCheck,
  InternalAssessmentSnapshot, GuidanceProfile, GuidanceSession,
  ExternalApplication, SchoolExitCase, MigrationDocument, FormerStudent, AlumniPreference,
  ServiceRequest, WorkOrder, WorkOrderActivity, MaintenancePlan,
  Booking, BookingAttendee, SafetyIncident, EmergencyAction,
  VisitorVisit, AccessCredential, KeyIssue, UtilityMeter,
  MeterReading, ContinuityPlan, ContinuityExercise,
  Announcement, Message, DeliveryAttempt, NotificationPreference,
  Conversation, ConversationParticipant, ConversationMessage,
  WorkflowDefinition, WorkflowInstance, WorkflowTask, WorkflowTransition,
  ServiceCase, CaseActivity, SlaClock,
  DocumentTemplate, DocumentInstance, SignatureRequest,
  RecordDeclaration, RetentionAssignment,
  ReportDefinition, Dashboard, DashboardWidget, ReportRun,
  MetricDefinition, SemanticDimension, ReportAccessPolicy, ReportCatalogEntry,
  DataProduct, PipelineRun, DataQualityResult, ModelVersion, ModelScore,
  StudentAnalytics, CohortAnalysis, FinanceAnalytics, WorkforceAnalytics,
  ReportBuilder, ReportSchedule,
  CounselingSession, FollowUp,
  CourseSpace, CourseRoster, CourseContent, LearningResource, Assignment, Submission,
  Quiz, QuizAttempt, Discussion, DiscussionPost, LearningMetric, InterventionAlert,
  LTITool, ContentImport, Warehouse,
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
  counselingSessions: ["counselingSessions"] as const,
  followUps: ["followUps"] as const,
  courseSpaces: ["courseSpaces"] as const,
  courseRosters: ["courseRosters"] as const,
  courseContents: ["courseContents"] as const,
  learningResources: ["learningResources"] as const,
  assignments: ["assignments"] as const,
  submissions: ["submissions"] as const,
  quizzes: ["quizzes"] as const,
  quizAttempts: ["quizAttempts"] as const,
  discussions: ["discussions"] as const,
  discussionPosts: ["discussionPosts"] as const,
  learningMetrics: ["learningMetrics"] as const,
  interventionAlerts: ["interventionAlerts"] as const,
  ltiTools: ["ltiTools"] as const,
  contentImports: ["contentImports"] as const,
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
  studentPortalProfiles: ["studentPortalProfiles"] as const,
  parentPortalProfiles: ["parentPortalProfiles"] as const,
  teacherPortalProfiles: ["teacherPortalProfiles"] as const,
  managementDashboards: ["managementDashboards"] as const,
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
  recurringJournals: ["recurringJournals"] as const,
  disbursementEntries: ["disbursementEntries"] as const,
  bankReconciliations: ["bankReconciliations"] as const,
  bankReconciliationEntries: ["bankReconciliationEntries"] as const,
  bankAccounts: ["bankAccounts"] as const,
  budgets: ["budgets"] as const,
  accountsReceivable: ["accountsReceivable"] as const,
  scholarshipSchemes: ["scholarshipSchemes"] as const,
  onlinePaymentTransactions: ["onlinePaymentTransactions"] as const,
  refundRecords: ["refundRecords"] as const,
  writeOffEntries: ["writeOffEntries"] as const,
  dunningNotices: ["dunningNotices"] as const,
  commitmentRecords: ["commitmentRecords"] as const,
  taxCodes: ["taxCodes"] as const,
  accrualEntries: ["accrualEntries"] as const,
  funds: ["funds"] as const,
  periodCloseChecklists: ["periodCloseChecklists"] as const,
  financialStatements: ["financialStatements"] as const,
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
  // M14
  vendors: ["vendors"] as const,
  vendorDocuments: ["vendorDocuments"] as const,
  purchaseRequisitions: ["purchaseRequisitions"] as const,
  requisitionItems: ["requisitionItems"] as const,
  rfqs: ["rfqs"] as const,
  bidComparisons: ["bidComparisons"] as const,
  purchaseOrders: ["purchaseOrders"] as const,
  poItems: ["poItems"] as const,
  goodsReceipts: ["goodsReceipts"] as const,
  qualityInspections: ["qualityInspections"] as const,
  contracts: ["contracts"] as const,
  contractRenewals: ["contractRenewals"] as const,
  supplierScores: ["supplierScores"] as const,
  slaTrackings: ["slaTrackings"] as const,
  // M15
  items: ["items"] as const,
  stores: ["stores"] as const,
  warehouses: ["warehouses"] as const,
  stockEntries: ["stockEntries"] as const,
  stockLedgers: ["stockLedgers"] as const,
  physicalCounts: ["physicalCounts"] as const,
  varianceReports: ["varianceReports"] as const,
  fixedAssets: ["fixedAssets"] as const,
  assetCategories: ["assetCategories"] as const,
  assetTransfers: ["assetTransfers"] as const,
  custodyRecords: ["custodyRecords"] as const,
  depreciationSchedules: ["depreciationSchedules"] as const,
  impairments: ["impairments"] as const,
  assetMaintenances: ["assetMaintenances"] as const,
  disposals: ["disposals"] as const,
  // M16
  libraryResources: ["libraryResources"] as const,
  libraryHoldings: ["libraryHoldings"] as const,
  libraryMembers: ["libraryMembers"] as const,
  libraryLoans: ["libraryLoans"] as const,
  libraryReservations: ["libraryReservations"] as const,
  libraryAcquisitions: ["libraryAcquisitions"] as const,
  digitalResources: ["digitalResources"] as const,
  // M17
  vehicles: ["vehicles"] as const,
  transportRoutes: ["transportRoutes"] as const,
  busStops: ["busStops"] as const,
  routeSchedules: ["routeSchedules"] as const,
  riderAssignments: ["riderAssignments"] as const,
  boardingLogs: ["boardingLogs"] as const,
  gpsTracks: ["gpsTracks"] as const,
  vehicleMaintenance: ["vehicleMaintenance"] as const,
  // M18
  residenceBlocks: ["residenceBlocks"] as const,
  roomTypes: ["roomTypes"] as const,
  hostelApplications: ["hostelApplications"] as const,
  roomAllocations: ["roomAllocations"] as const,
  rollCalls: ["rollCalls"] as const,
  residenceIncidents: ["residenceIncidents"] as const,
  mealPlans: ["mealPlans"] as const,
  messManagement: ["messManagement"] as const,
  posModules: ["posModules"] as const,
  prepaidWallets: ["prepaidWallets"] as const,
  // M19
  healthProfiles: ["healthProfiles"] as const,
  clinicVisits: ["clinicVisits"] as const,
  counselingCases: ["counselingCases"] as const,
  supportNeeds: ["supportNeeds"] as const,
  accommodationPlans: ["accommodationPlans"] as const,
  conductIncidents: ["conductIncidents"] as const,
  conductActions: ["conductActions"] as const,
  grievances: ["grievances"] as const,
  advisingAssignments: ["advisingAssignments"] as const,
  interventionPlans: ["interventionPlans"] as const,
  // M20
  communityEvents: ["communityEvents"] as const,
  eventRegistrations: ["eventRegistrations"] as const,
  activityGroups: ["activityGroups"] as const,
  groupMemberships: ["groupMemberships"] as const,
  competitions: ["competitions"] as const,
  competitionEntries: ["competitionEntries"] as const,
  competitionResults: ["competitionResults"] as const,
  trips: ["trips"] as const,
  tripParticipants: ["tripParticipants"] as const,
  ptmEvents: ["ptmEvents"] as const,
  ptmBookings: ["ptmBookings"] as const,
  fundraisingCampaigns: ["fundraisingCampaigns"] as const,
  donations: ["donations"] as const,
  // M21
  subjectCombinationRules: ["subjectCombinationRules"] as const,
  studentSubjectPlans: ["studentSubjectPlans"] as const,
  boardRegistrations: ["boardRegistrations"] as const,
  readinessChecks: ["readinessChecks"] as const,
  internalAssessmentSnapshots: ["internalAssessmentSnapshots"] as const,
  guidanceProfiles: ["guidanceProfiles"] as const,
  guidanceSessions: ["guidanceSessions"] as const,
  externalApplications: ["externalApplications"] as const,
  schoolExitCases: ["schoolExitCases"] as const,
  migrationDocuments: ["migrationDocuments"] as const,
  formerStudents: ["formerStudents"] as const,
  alumniPreferences: ["alumniPreferences"] as const,
  // M22
  serviceRequests: ["serviceRequests"] as const,
  workOrders: ["workOrders"] as const,
  workOrderActivities: ["workOrderActivities"] as const,
  maintenancePlans: ["maintenancePlans"] as const,
  bookings: ["bookings"] as const,
  bookingAttendees: ["bookingAttendees"] as const,
  safetyIncidents: ["safetyIncidents"] as const,
  emergencyActions: ["emergencyActions"] as const,
  visitorVisits: ["visitorVisits"] as const,
  accessCredentials: ["accessCredentials"] as const,
  keyIssues: ["keyIssues"] as const,
  utilityMeters: ["utilityMeters"] as const,
  meterReadings: ["meterReadings"] as const,
  continuityPlans: ["continuityPlans"] as const,
  continuityExercises: ["continuityExercises"] as const,
  // M23
  announcements: ["announcements"] as const,
  messages: ["messages"] as const,
  deliveryAttempts: ["deliveryAttempts"] as const,
  notificationPreferences: ["notificationPreferences"] as const,
  conversations: ["conversations"] as const,
  conversationParticipants: ["conversationParticipants"] as const,
  conversationMessages: ["conversationMessages"] as const,
  workflowDefinitions: ["workflowDefinitions"] as const,
  workflowInstances: ["workflowInstances"] as const,
  workflowTasks: ["workflowTasks"] as const,
  workflowTransitions: ["workflowTransitions"] as const,
  serviceCases: ["serviceCases"] as const,
  caseActivities: ["caseActivities"] as const,
  slaClocks: ["slaClocks"] as const,
  documentTemplates: ["documentTemplates"] as const,
  documentInstances: ["documentInstances"] as const,
  signatureRequests: ["signatureRequests"] as const,
  recordDeclarations: ["recordDeclarations"] as const,
  retentionAssignments: ["retentionAssignments"] as const,
  // M24
  reportDefinitions: ["reportDefinitions"] as const,
  dashboards: ["dashboards"] as const,
  dashboardWidgets: ["dashboardWidgets"] as const,
  reportRuns: ["reportRuns"] as const,
  metricDefinitions: ["metricDefinitions"] as const,
  semanticDimensions: ["semanticDimensions"] as const,
  reportAccessPolicies: ["reportAccessPolicies"] as const,
  reportCatalogEntries: ["reportCatalogEntries"] as const,
  dataProducts: ["dataProducts"] as const,
  pipelineRuns: ["pipelineRuns"] as const,
  dataQualityResults: ["dataQualityResults"] as const,
  modelVersions: ["modelVersions"] as const,
  modelScores: ["modelScores"] as const,
  studentAnalytics: ["studentAnalytics"] as const,
  cohortAnalysis: ["cohortAnalysis"] as const,
  financeAnalytics: ["financeAnalytics"] as const,
  workforceAnalytics: ["workforceAnalytics"] as const,
  reportBuilders: ["reportBuilders"] as const,
  reportSchedules: ["reportSchedules"] as const,
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
export const useCounselingSessions = () => useQuery({ queryKey: keys.counselingSessions, queryFn: api.listCounselingSessions });
export const useFollowUps = () => useQuery({ queryKey: keys.followUps, queryFn: api.listFollowUps });
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
export const useStudentPortalProfiles = () => useQuery({ queryKey: keys.studentPortalProfiles, queryFn: api.listStudentPortalProfiles });
export const useParentPortalProfiles = () => useQuery({ queryKey: keys.parentPortalProfiles, queryFn: api.listParentPortalProfiles });
export const useTeacherPortalProfiles = () => useQuery({ queryKey: keys.teacherPortalProfiles, queryFn: api.listTeacherPortalProfiles });
export const useManagementDashboards = () => useQuery({ queryKey: keys.managementDashboards, queryFn: api.listManagementDashboards });
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
export const useRecurringJournals = () => useQuery({ queryKey: keys.recurringJournals, queryFn: api.listRecurringJournals });
export const useDisbursementEntries = () => useQuery({ queryKey: keys.disbursementEntries, queryFn: api.listDisbursementEntries });
export const useBankReconciliations = () => useQuery({ queryKey: keys.bankReconciliations, queryFn: api.listBankReconciliations });
export const useBankReconciliationEntries = () => useQuery({ queryKey: keys.bankReconciliationEntries, queryFn: api.listBankReconciliationEntries });
export const useBankAccounts = () => useQuery({ queryKey: keys.bankAccounts, queryFn: api.listBankAccounts });
export const useBudgets = () => useQuery({ queryKey: keys.budgets, queryFn: api.listBudgets });
export const useAccountsReceivable = () => useQuery({ queryKey: keys.accountsReceivable, queryFn: api.listAccountsReceivable });
export const useScholarshipSchemes = () => useQuery({ queryKey: keys.scholarshipSchemes, queryFn: api.listScholarshipSchemes });
export const useOnlinePaymentTransactions = () => useQuery({ queryKey: keys.onlinePaymentTransactions, queryFn: api.listOnlinePaymentTransactions });
export const useRefundRecords = () => useQuery({ queryKey: keys.refundRecords, queryFn: api.listRefundRecords });
export const useWriteOffEntries = () => useQuery({ queryKey: keys.writeOffEntries, queryFn: api.listWriteOffEntries });
export const useDunningNotices = () => useQuery({ queryKey: keys.dunningNotices, queryFn: api.listDunningNotices });
export const useCommitmentRecords = () => useQuery({ queryKey: keys.commitmentRecords, queryFn: api.listCommitmentRecords });
export const useTaxCodes = () => useQuery({ queryKey: keys.taxCodes, queryFn: api.listTaxCodes });
export const useAccrualEntries = () => useQuery({ queryKey: keys.accrualEntries, queryFn: api.listAccrualEntries });
export const useFunds = () => useQuery({ queryKey: keys.funds, queryFn: api.listFunds });
export const usePeriodCloseChecklists = () => useQuery({ queryKey: keys.periodCloseChecklists, queryFn: api.listPeriodCloseChecklists });
export const useFinancialStatements = () => useQuery({ queryKey: keys.financialStatements, queryFn: api.listFinancialStatements });
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
// M14
export const useVendors = () => useQuery({ queryKey: keys.vendors, queryFn: api.listVendors });
export const useVendorDocuments = () => useQuery({ queryKey: keys.vendorDocuments, queryFn: api.listVendorDocuments });
export const usePurchaseRequisitions = () => useQuery({ queryKey: keys.purchaseRequisitions, queryFn: api.listPurchaseRequisitions });
export const useRequisitionItems = () => useQuery({ queryKey: keys.requisitionItems, queryFn: api.listRequisitionItems });
export const useRfqs = () => useQuery({ queryKey: keys.rfqs, queryFn: api.listRFQs });
export const useBidComparisons = () => useQuery({ queryKey: keys.bidComparisons, queryFn: api.listBidComparisons });
export const usePurchaseOrders = () => useQuery({ queryKey: keys.purchaseOrders, queryFn: api.listPurchaseOrders });
export const usePoItems = () => useQuery({ queryKey: keys.poItems, queryFn: api.listPOItems });
export const useGoodsReceipts = () => useQuery({ queryKey: keys.goodsReceipts, queryFn: api.listGoodsReceipts });
export const useQualityInspections = () => useQuery({ queryKey: keys.qualityInspections, queryFn: api.listQualityInspections });
export const useContracts = () => useQuery({ queryKey: keys.contracts, queryFn: api.listContracts });
export const useContractRenewals = () => useQuery({ queryKey: keys.contractRenewals, queryFn: api.listContractRenewals });
export const useSupplierScores = () => useQuery({ queryKey: keys.supplierScores, queryFn: api.listSupplierScores });
export const useSlaTrackings = () => useQuery({ queryKey: keys.slaTrackings, queryFn: api.listSLATrackings });
// M15
export const useItems = () => useQuery({ queryKey: keys.items, queryFn: api.listItems });
export const useStores = () => useQuery({ queryKey: keys.stores, queryFn: api.listStores });
export const useStockEntries = () => useQuery({ queryKey: keys.stockEntries, queryFn: api.listStockEntrys });
export const useStockLedgers = () => useQuery({ queryKey: keys.stockLedgers, queryFn: api.listStockLedgers });
export const usePhysicalCounts = () => useQuery({ queryKey: keys.physicalCounts, queryFn: api.listPhysicalCounts });
export const useVarianceReports = () => useQuery({ queryKey: keys.varianceReports, queryFn: api.listVarianceReports });
export const useFixedAssets = () => useQuery({ queryKey: keys.fixedAssets, queryFn: api.listFixedAssets });
export const useAssetCategories = () => useQuery({ queryKey: keys.assetCategories, queryFn: api.listAssetCategorys });
export const useAssetTransfers = () => useQuery({ queryKey: keys.assetTransfers, queryFn: api.listAssetTransfers });
export const useCustodyRecords = () => useQuery({ queryKey: keys.custodyRecords, queryFn: api.listCustodyRecords });
export const useDepreciationSchedules = () => useQuery({ queryKey: keys.depreciationSchedules, queryFn: api.listDepreciationSchedules });
export const useImpairments = () => useQuery({ queryKey: keys.impairments, queryFn: api.listImpairments });
export const useAssetMaintenances = () => useQuery({ queryKey: keys.assetMaintenances, queryFn: api.listAssetMaintenances });
export const useDisposals = () => useQuery({ queryKey: keys.disposals, queryFn: api.listDisposals });
// M16
export const useLibraryResources = () => useQuery({ queryKey: keys.libraryResources, queryFn: api.listLibraryResources });
export const useLibraryHoldings = () => useQuery({ queryKey: keys.libraryHoldings, queryFn: api.listLibraryHoldings });
export const useLibraryMembers = () => useQuery({ queryKey: keys.libraryMembers, queryFn: api.listLibraryMembers });
export const useLibraryLoans = () => useQuery({ queryKey: keys.libraryLoans, queryFn: api.listLibraryLoans });
export const useLibraryReservations = () => useQuery({ queryKey: keys.libraryReservations, queryFn: api.listLibraryReservations });
export const useLibraryAcquisitions = () => useQuery({ queryKey: keys.libraryAcquisitions, queryFn: api.listLibraryAcquisitions });
export const useDigitalResources = () => useQuery({ queryKey: keys.digitalResources, queryFn: api.listDigitalResources });
// M17
export const useVehicles = () => useQuery({ queryKey: keys.vehicles, queryFn: api.listVehicles });
export const useTransportRoutes = () => useQuery({ queryKey: keys.transportRoutes, queryFn: api.listTransportRoutes });
export const useBusStops = () => useQuery({ queryKey: keys.busStops, queryFn: api.listBusStops });
export const useRouteSchedules = () => useQuery({ queryKey: keys.routeSchedules, queryFn: api.listRouteSchedules });
export const useRiderAssignments = () => useQuery({ queryKey: keys.riderAssignments, queryFn: api.listRiderAssignments });
export const useBoardingLogs = () => useQuery({ queryKey: keys.boardingLogs, queryFn: api.listBoardingLogs });
export const useGpsTracks = () => useQuery({ queryKey: keys.gpsTracks, queryFn: api.listGpsTracks });
export const useVehicleMaintenance = () => useQuery({ queryKey: keys.vehicleMaintenance, queryFn: api.listVehicleMaintenance });
// M18
export const useResidenceBlocks = () => useQuery({ queryKey: keys.residenceBlocks, queryFn: api.listResidenceBlocks });
export const useRoomTypes = () => useQuery({ queryKey: keys.roomTypes, queryFn: api.listRoomTypes });
export const useHostelApplications = () => useQuery({ queryKey: keys.hostelApplications, queryFn: api.listHostelApplications });
export const useRoomAllocations = () => useQuery({ queryKey: keys.roomAllocations, queryFn: api.listRoomAllocations });
export const useRollCalls = () => useQuery({ queryKey: keys.rollCalls, queryFn: api.listRollCalls });
export const useResidenceIncidents = () => useQuery({ queryKey: keys.residenceIncidents, queryFn: api.listResidenceIncidents });
export const useMealPlans = () => useQuery({ queryKey: keys.mealPlans, queryFn: api.listMealPlans });
export const useMessManagement = () => useQuery({ queryKey: keys.messManagement, queryFn: api.listMessManagements });
export const usePosModules = () => useQuery({ queryKey: keys.posModules, queryFn: api.listPOSModules });
export const usePrepaidWallets = () => useQuery({ queryKey: keys.prepaidWallets, queryFn: api.listPrepaidWallets });
// M19
export const useHealthProfiles = () => useQuery({ queryKey: keys.healthProfiles, queryFn: api.listHealthProfiles });
export const useClinicVisits = () => useQuery({ queryKey: keys.clinicVisits, queryFn: api.listClinicVisits });
export const useCounselingCases = () => useQuery({ queryKey: keys.counselingCases, queryFn: api.listCounselingCases });
export const useSupportNeeds = () => useQuery({ queryKey: keys.supportNeeds, queryFn: api.listSupportNeeds });
export const useAccommodationPlans = () => useQuery({ queryKey: keys.accommodationPlans, queryFn: api.listAccommodationPlans });
export const useConductIncidents = () => useQuery({ queryKey: keys.conductIncidents, queryFn: api.listConductIncidents });
export const useConductActions = () => useQuery({ queryKey: keys.conductActions, queryFn: api.listConductActions });
export const useGrievances = () => useQuery({ queryKey: keys.grievances, queryFn: api.listGrievances });
export const useAdvisingAssignments = () => useQuery({ queryKey: keys.advisingAssignments, queryFn: api.listAdvisingAssignments });
export const useInterventionPlans = () => useQuery({ queryKey: keys.interventionPlans, queryFn: api.listInterventionPlans });
// M20
export const useCommunityEvents = () => useQuery({ queryKey: keys.communityEvents, queryFn: api.listCommunityEvents });
export const useEventRegistrations = () => useQuery({ queryKey: keys.eventRegistrations, queryFn: api.listEventRegistrations });
export const useActivityGroups = () => useQuery({ queryKey: keys.activityGroups, queryFn: api.listActivityGroups });
export const useGroupMemberships = () => useQuery({ queryKey: keys.groupMemberships, queryFn: api.listGroupMemberships });
export const useCompetitions = () => useQuery({ queryKey: keys.competitions, queryFn: api.listCompetitions });
export const useCompetitionEntries = () => useQuery({ queryKey: keys.competitionEntries, queryFn: api.listCompetitionEntries });
export const useCompetitionResults = () => useQuery({ queryKey: keys.competitionResults, queryFn: api.listCompetitionResults });
export const useTrips = () => useQuery({ queryKey: keys.trips, queryFn: api.listTrips });
export const useTripParticipants = () => useQuery({ queryKey: keys.tripParticipants, queryFn: api.listTripParticipants });
export const usePtmEvents = () => useQuery({ queryKey: keys.ptmEvents, queryFn: api.listPtmEvents });
export const usePtmBookings = () => useQuery({ queryKey: keys.ptmBookings, queryFn: api.listPtmBookings });
export const useFundraisingCampaigns = () => useQuery({ queryKey: keys.fundraisingCampaigns, queryFn: api.listFundraisingCampaigns });
export const useDonations = () => useQuery({ queryKey: keys.donations, queryFn: api.listDonations });
// M21
export const useSubjectCombinationRules = () => useQuery({ queryKey: keys.subjectCombinationRules, queryFn: api.listSubjectCombinationRules });
export const useStudentSubjectPlans = () => useQuery({ queryKey: keys.studentSubjectPlans, queryFn: api.listStudentSubjectPlans });
export const useBoardRegistrations = () => useQuery({ queryKey: keys.boardRegistrations, queryFn: api.listBoardRegistrations });
export const useReadinessChecks = () => useQuery({ queryKey: keys.readinessChecks, queryFn: api.listReadinessChecks });
export const useInternalAssessmentSnapshots = () => useQuery({ queryKey: keys.internalAssessmentSnapshots, queryFn: api.listInternalAssessmentSnapshots });
export const useGuidanceProfiles = () => useQuery({ queryKey: keys.guidanceProfiles, queryFn: api.listGuidanceProfiles });
export const useGuidanceSessions = () => useQuery({ queryKey: keys.guidanceSessions, queryFn: api.listGuidanceSessions });
export const useExternalApplications = () => useQuery({ queryKey: keys.externalApplications, queryFn: api.listExternalApplications });
export const useSchoolExitCases = () => useQuery({ queryKey: keys.schoolExitCases, queryFn: api.listSchoolExitCases });
export const useMigrationDocuments = () => useQuery({ queryKey: keys.migrationDocuments, queryFn: api.listMigrationDocuments });
export const useFormerStudents = () => useQuery({ queryKey: keys.formerStudents, queryFn: api.listFormerStudents });
export const useAlumniPreferences = () => useQuery({ queryKey: keys.alumniPreferences, queryFn: api.listAlumniPreferences });

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
export const useSaveCounselingSession = () => useErpMutation<CounselingSession, CounselingSession>(api.saveCounselingSession, [keys.counselingSessions, keys.audit]);
export const useDeleteCounselingSession = () => useErpMutation<CounselingSession, void>(api.deleteCounselingSession, [keys.counselingSessions, keys.audit]);
export const useSaveFollowUp = () => useErpMutation<FollowUp, FollowUp>(api.saveFollowUp, [keys.followUps, keys.audit]);
export const useDeleteFollowUp = () => useErpMutation<FollowUp, void>(api.deleteFollowUp, [keys.followUps, keys.audit]);
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
export const useSaveStudentPortalProfile = () => useErpMutation<StudentPortalProfile, StudentPortalProfile>(api.saveStudentPortalProfile, [keys.studentPortalProfiles, keys.audit]);
export const useDeleteStudentPortalProfile = () => useErpMutation<StudentPortalProfile, void>(api.deleteStudentPortalProfile, [keys.studentPortalProfiles, keys.audit]);
export const useSaveParentPortalProfile = () => useErpMutation<ParentPortalProfile, ParentPortalProfile>(api.saveParentPortalProfile, [keys.parentPortalProfiles, keys.audit]);
export const useDeleteParentPortalProfile = () => useErpMutation<ParentPortalProfile, void>(api.deleteParentPortalProfile, [keys.parentPortalProfiles, keys.audit]);
export const useSaveTeacherPortalProfile = () => useErpMutation<TeacherPortalProfile, TeacherPortalProfile>(api.saveTeacherPortalProfile, [keys.teacherPortalProfiles, keys.audit]);
export const useDeleteTeacherPortalProfile = () => useErpMutation<TeacherPortalProfile, void>(api.deleteTeacherPortalProfile, [keys.teacherPortalProfiles, keys.audit]);
export const useSaveManagementDashboard = () => useErpMutation<ManagementDashboard, ManagementDashboard>(api.saveManagementDashboard, [keys.managementDashboards, keys.audit]);
export const useDeleteManagementDashboard = () => useErpMutation<ManagementDashboard, void>(api.deleteManagementDashboard, [keys.managementDashboards, keys.audit]);
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
export const useSaveRecurringJournal = () => useErpMutation<RecurringJournal, RecurringJournal>(api.saveRecurringJournal, [keys.recurringJournals, keys.audit]);
export const useDeleteRecurringJournal = () => useErpMutation<RecurringJournal, void>(api.deleteRecurringJournal, [keys.recurringJournals, keys.audit]);
export const useSaveDisbursementEntry = () => useErpMutation<DisbursementEntry, DisbursementEntry>(api.saveDisbursementEntry, [keys.disbursementEntries, keys.audit]);
export const useDeleteDisbursementEntry = () => useErpMutation<DisbursementEntry, void>(api.deleteDisbursementEntry, [keys.disbursementEntries, keys.audit]);
export const useSaveBankReconciliation = () => useErpMutation<BankReconciliation, BankReconciliation>(api.saveBankReconciliation, [keys.bankReconciliations, keys.audit]);
export const useDeleteBankReconciliation = () => useErpMutation<BankReconciliation, void>(api.deleteBankReconciliation, [keys.bankReconciliations, keys.audit]);
export const useSaveBankReconciliationEntry = () => useErpMutation<BankReconciliationEntry, BankReconciliationEntry>(api.saveBankReconciliationEntry, [keys.bankReconciliationEntries, keys.audit]);
export const useDeleteBankReconciliationEntry = () => useErpMutation<BankReconciliationEntry, void>(api.deleteBankReconciliationEntry, [keys.bankReconciliationEntries, keys.audit]);
export const useSaveBankAccount = () => useErpMutation<BankAccount, BankAccount>(api.saveBankAccount, [keys.bankAccounts, keys.audit]);
export const useDeleteBankAccount = () => useErpMutation<BankAccount, void>(api.deleteBankAccount, [keys.bankAccounts, keys.audit]);
export const useSaveBudget = () => useErpMutation<Budget, Budget>(api.saveBudget, [keys.budgets, keys.audit]);
export const useDeleteBudget = () => useErpMutation<Budget, void>(api.deleteBudget, [keys.budgets, keys.audit]);
export const useSaveAccountsReceivable = () => useErpMutation<AccountsReceivable, AccountsReceivable>(api.saveAccountsReceivable, [keys.accountsReceivable, keys.audit]);
export const useDeleteAccountsReceivable = () => useErpMutation<AccountsReceivable, void>(api.deleteAccountsReceivable, [keys.accountsReceivable, keys.audit]);
export const useSaveScholarshipScheme = () => useErpMutation<ScholarshipScheme, ScholarshipScheme>(api.saveScholarshipScheme, [keys.scholarshipSchemes, keys.audit]);
export const useDeleteScholarshipScheme = () => useErpMutation<ScholarshipScheme, void>(api.deleteScholarshipScheme, [keys.scholarshipSchemes, keys.audit]);
export const useSaveOnlinePaymentTransaction = () => useErpMutation<OnlinePaymentTransaction, OnlinePaymentTransaction>(api.saveOnlinePaymentTransaction, [keys.onlinePaymentTransactions, keys.audit]);
export const useDeleteOnlinePaymentTransaction = () => useErpMutation<OnlinePaymentTransaction, void>(api.deleteOnlinePaymentTransaction, [keys.onlinePaymentTransactions, keys.audit]);
export const useSaveRefundRecord = () => useErpMutation<RefundRecord, RefundRecord>(api.saveRefundRecord, [keys.refundRecords, keys.audit]);
export const useDeleteRefundRecord = () => useErpMutation<RefundRecord, void>(api.deleteRefundRecord, [keys.refundRecords, keys.audit]);
export const useSaveWriteOffEntry = () => useErpMutation<WriteOffEntry, WriteOffEntry>(api.saveWriteOffEntry, [keys.writeOffEntries, keys.audit]);
export const useDeleteWriteOffEntry = () => useErpMutation<WriteOffEntry, void>(api.deleteWriteOffEntry, [keys.writeOffEntries, keys.audit]);
export const useSaveDunningNotice = () => useErpMutation<DunningNotice, DunningNotice>(api.saveDunningNotice, [keys.dunningNotices, keys.audit]);
export const useDeleteDunningNotice = () => useErpMutation<DunningNotice, void>(api.deleteDunningNotice, [keys.dunningNotices, keys.audit]);
export const useSaveCommitmentRecord = () => useErpMutation<CommitmentRecord, CommitmentRecord>(api.saveCommitmentRecord, [keys.commitmentRecords, keys.audit]);
export const useDeleteCommitmentRecord = () => useErpMutation<CommitmentRecord, void>(api.deleteCommitmentRecord, [keys.commitmentRecords, keys.audit]);
export const useSaveTaxCode = () => useErpMutation<TaxCode, TaxCode>(api.saveTaxCode, [keys.taxCodes, keys.audit]);
export const useDeleteTaxCode = () => useErpMutation<TaxCode, void>(api.deleteTaxCode, [keys.taxCodes, keys.audit]);
export const useSaveAccrualEntry = () => useErpMutation<AccrualEntry, AccrualEntry>(api.saveAccrualEntry, [keys.accrualEntries, keys.audit]);
export const useDeleteAccrualEntry = () => useErpMutation<AccrualEntry, void>(api.deleteAccrualEntry, [keys.accrualEntries, keys.audit]);
export const useSaveFund = () => useErpMutation<Fund, Fund>(api.saveFund, [keys.funds, keys.audit]);
export const useDeleteFund = () => useErpMutation<Fund, void>(api.deleteFund, [keys.funds, keys.audit]);
export const useSavePeriodCloseChecklist = () => useErpMutation<PeriodCloseChecklist, PeriodCloseChecklist>(api.savePeriodCloseChecklist, [keys.periodCloseChecklists, keys.audit]);
export const useDeletePeriodCloseChecklist = () => useErpMutation<PeriodCloseChecklist, void>(api.deletePeriodCloseChecklist, [keys.periodCloseChecklists, keys.audit]);
export const useSaveFinancialStatement = () => useErpMutation<FinancialStatement, FinancialStatement>(api.saveFinancialStatement, [keys.financialStatements, keys.audit]);
export const useDeleteFinancialStatement = () => useErpMutation<FinancialStatement, void>(api.deleteFinancialStatement, [keys.financialStatements, keys.audit]);
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
// M14
export const useSaveVendor = () => useErpMutation<Vendor, Vendor>(api.saveVendor, [keys.vendors, keys.audit]);
export const useDeleteVendor = () => useErpMutation<Vendor, void>(api.deleteVendor, [keys.vendors, keys.audit]);
export const useSaveVendorDocument = () => useErpMutation<VendorDocument, VendorDocument>(api.saveVendorDocument, [keys.vendorDocuments, keys.audit]);
export const useDeleteVendorDocument = () => useErpMutation<VendorDocument, void>(api.deleteVendorDocument, [keys.vendorDocuments, keys.audit]);
export const useSavePurchaseRequisition = () => useErpMutation<PurchaseRequisition, PurchaseRequisition>(api.savePurchaseRequisition, [keys.purchaseRequisitions, keys.audit]);
export const useDeletePurchaseRequisition = () => useErpMutation<PurchaseRequisition, void>(api.deletePurchaseRequisition, [keys.purchaseRequisitions, keys.audit]);
export const useSaveRequisitionItem = () => useErpMutation<RequisitionItem, RequisitionItem>(api.saveRequisitionItem, [keys.requisitionItems, keys.audit]);
export const useDeleteRequisitionItem = () => useErpMutation<RequisitionItem, void>(api.deleteRequisitionItem, [keys.requisitionItems, keys.audit]);
export const useSaveRfq = () => useErpMutation<RFQ, RFQ>(api.saveRFQ, [keys.rfqs, keys.audit]);
export const useDeleteRfq = () => useErpMutation<RFQ, void>(api.deleteRFQ, [keys.rfqs, keys.audit]);
export const useSaveBidComparison = () => useErpMutation<BidComparison, BidComparison>(api.saveBidComparison, [keys.bidComparisons, keys.audit]);
export const useDeleteBidComparison = () => useErpMutation<BidComparison, void>(api.deleteBidComparison, [keys.bidComparisons, keys.audit]);
export const useSavePurchaseOrder = () => useErpMutation<PurchaseOrder, PurchaseOrder>(api.savePurchaseOrder, [keys.purchaseOrders, keys.audit]);
export const useDeletePurchaseOrder = () => useErpMutation<PurchaseOrder, void>(api.deletePurchaseOrder, [keys.purchaseOrders, keys.audit]);
export const useSavePoItem = () => useErpMutation<POItem, POItem>(api.savePOItem, [keys.poItems, keys.audit]);
export const useDeletePoItem = () => useErpMutation<POItem, void>(api.deletePOItem, [keys.poItems, keys.audit]);
export const useSaveGoodsReceipt = () => useErpMutation<GoodsReceipt, GoodsReceipt>(api.saveGoodsReceipt, [keys.goodsReceipts, keys.audit]);
export const useDeleteGoodsReceipt = () => useErpMutation<GoodsReceipt, void>(api.deleteGoodsReceipt, [keys.goodsReceipts, keys.audit]);
export const useSaveQualityInspection = () => useErpMutation<QualityInspection, QualityInspection>(api.saveQualityInspection, [keys.qualityInspections, keys.audit]);
export const useDeleteQualityInspection = () => useErpMutation<QualityInspection, void>(api.deleteQualityInspection, [keys.qualityInspections, keys.audit]);
export const useSaveContract = () => useErpMutation<Contract, Contract>(api.saveContract, [keys.contracts, keys.audit]);
export const useDeleteContract = () => useErpMutation<Contract, void>(api.deleteContract, [keys.contracts, keys.audit]);
export const useSaveContractRenewal = () => useErpMutation<ContractRenewal, ContractRenewal>(api.saveContractRenewal, [keys.contractRenewals, keys.audit]);
export const useDeleteContractRenewal = () => useErpMutation<ContractRenewal, void>(api.deleteContractRenewal, [keys.contractRenewals, keys.audit]);
export const useSaveSupplierScore = () => useErpMutation<SupplierScore, SupplierScore>(api.saveSupplierScore, [keys.supplierScores, keys.audit]);
export const useDeleteSupplierScore = () => useErpMutation<SupplierScore, void>(api.deleteSupplierScore, [keys.supplierScores, keys.audit]);
export const useSaveSlaTracking = () => useErpMutation<SLATracking, SLATracking>(api.saveSLATracking, [keys.slaTrackings, keys.audit]);
export const useDeleteSlaTracking = () => useErpMutation<SLATracking, void>(api.deleteSLATracking, [keys.slaTrackings, keys.audit]);
// M15
export const useSaveItem = () => useErpMutation<Item, Item>(api.saveItem, [keys.items, keys.audit]);
export const useDeleteItem = () => useErpMutation<Item, void>(api.deleteItem, [keys.items, keys.audit]);
export const useSaveStore = () => useErpMutation<Store, Store>(api.saveStore, [keys.stores, keys.audit]);
export const useDeleteStore = () => useErpMutation<Store, void>(api.deleteStore, [keys.stores, keys.audit]);
export const useSaveStockEntry = () => useErpMutation<StockEntry, StockEntry>(api.saveStockEntry, [keys.stockEntries, keys.audit]);
export const useDeleteStockEntry = () => useErpMutation<StockEntry, void>(api.deleteStockEntry, [keys.stockEntries, keys.audit]);
export const useSaveStockLedger = () => useErpMutation<StockLedger, StockLedger>(api.saveStockLedger, [keys.stockLedgers, keys.audit]);
export const useDeleteStockLedger = () => useErpMutation<StockLedger, void>(api.deleteStockLedger, [keys.stockLedgers, keys.audit]);
export const useSavePhysicalCount = () => useErpMutation<PhysicalCount, PhysicalCount>(api.savePhysicalCount, [keys.physicalCounts, keys.audit]);
export const useDeletePhysicalCount = () => useErpMutation<PhysicalCount, void>(api.deletePhysicalCount, [keys.physicalCounts, keys.audit]);
export const useSaveVarianceReport = () => useErpMutation<VarianceReport, VarianceReport>(api.saveVarianceReport, [keys.varianceReports, keys.audit]);
export const useDeleteVarianceReport = () => useErpMutation<VarianceReport, void>(api.deleteVarianceReport, [keys.varianceReports, keys.audit]);
export const useSaveFixedAsset = () => useErpMutation<FixedAsset, FixedAsset>(api.saveFixedAsset, [keys.fixedAssets, keys.audit]);
export const useDeleteFixedAsset = () => useErpMutation<FixedAsset, void>(api.deleteFixedAsset, [keys.fixedAssets, keys.audit]);
export const useSaveAssetCategory = () => useErpMutation<AssetCategory, AssetCategory>(api.saveAssetCategory, [keys.assetCategories, keys.audit]);
export const useDeleteAssetCategory = () => useErpMutation<AssetCategory, void>(api.deleteAssetCategory, [keys.assetCategories, keys.audit]);
export const useSaveAssetTransfer = () => useErpMutation<AssetTransfer, AssetTransfer>(api.saveAssetTransfer, [keys.assetTransfers, keys.audit]);
export const useDeleteAssetTransfer = () => useErpMutation<AssetTransfer, void>(api.deleteAssetTransfer, [keys.assetTransfers, keys.audit]);
export const useSaveCustodyRecord = () => useErpMutation<CustodyRecord, CustodyRecord>(api.saveCustodyRecord, [keys.custodyRecords, keys.audit]);
export const useDeleteCustodyRecord = () => useErpMutation<CustodyRecord, void>(api.deleteCustodyRecord, [keys.custodyRecords, keys.audit]);
export const useSaveDepreciationSchedule = () => useErpMutation<DepreciationSchedule, DepreciationSchedule>(api.saveDepreciationSchedule, [keys.depreciationSchedules, keys.audit]);
export const useDeleteDepreciationSchedule = () => useErpMutation<DepreciationSchedule, void>(api.deleteDepreciationSchedule, [keys.depreciationSchedules, keys.audit]);
export const useSaveImpairment = () => useErpMutation<Impairment, Impairment>(api.saveImpairment, [keys.impairments, keys.audit]);
export const useDeleteImpairment = () => useErpMutation<Impairment, void>(api.deleteImpairment, [keys.impairments, keys.audit]);
export const useSaveAssetMaintenance = () => useErpMutation<AssetMaintenance, AssetMaintenance>(api.saveAssetMaintenance, [keys.assetMaintenances, keys.audit]);
export const useDeleteAssetMaintenance = () => useErpMutation<AssetMaintenance, void>(api.deleteAssetMaintenance, [keys.assetMaintenances, keys.audit]);
export const useSaveDisposal = () => useErpMutation<Disposal, Disposal>(api.saveDisposal, [keys.disposals, keys.audit]);
export const useDeleteDisposal = () => useErpMutation<Disposal, void>(api.deleteDisposal, [keys.disposals, keys.audit]);
// M16
export const useSaveLibraryResource = () => useErpMutation<LibraryResource, LibraryResource>(api.saveLibraryResource, [keys.libraryResources, keys.audit]);
export const useDeleteLibraryResource = () => useErpMutation<LibraryResource, void>(api.deleteLibraryResource, [keys.libraryResources, keys.audit]);
export const useSaveLibraryHolding = () => useErpMutation<LibraryHolding, LibraryHolding>(api.saveLibraryHolding, [keys.libraryHoldings, keys.audit]);
export const useDeleteLibraryHolding = () => useErpMutation<LibraryHolding, void>(api.deleteLibraryHolding, [keys.libraryHoldings, keys.audit]);
export const useSaveLibraryMember = () => useErpMutation<LibraryMember, LibraryMember>(api.saveLibraryMember, [keys.libraryMembers, keys.audit]);
export const useDeleteLibraryMember = () => useErpMutation<LibraryMember, void>(api.deleteLibraryMember, [keys.libraryMembers, keys.audit]);
export const useSaveLibraryLoan = () => useErpMutation<LibraryLoan, LibraryLoan>(api.saveLibraryLoan, [keys.libraryLoans, keys.audit]);
export const useDeleteLibraryLoan = () => useErpMutation<LibraryLoan, void>(api.deleteLibraryLoan, [keys.libraryLoans, keys.audit]);
export const useSaveLibraryReservation = () => useErpMutation<LibraryReservation, LibraryReservation>(api.saveLibraryReservation, [keys.libraryReservations, keys.audit]);
export const useDeleteLibraryReservation = () => useErpMutation<LibraryReservation, void>(api.deleteLibraryReservation, [keys.libraryReservations, keys.audit]);
export const useSaveLibraryAcquisition = () => useErpMutation<LibraryAcquisition, LibraryAcquisition>(api.saveLibraryAcquisition, [keys.libraryAcquisitions, keys.audit]);
export const useDeleteLibraryAcquisition = () => useErpMutation<LibraryAcquisition, void>(api.deleteLibraryAcquisition, [keys.libraryAcquisitions, keys.audit]);
export const useSaveDigitalResource = () => useErpMutation<DigitalResource, DigitalResource>(api.saveDigitalResource, [keys.digitalResources, keys.audit]);
export const useDeleteDigitalResource = () => useErpMutation<DigitalResource, void>(api.deleteDigitalResource, [keys.digitalResources, keys.audit]);
// M17
export const useSaveVehicle = () => useErpMutation<Vehicle, Vehicle>(api.saveVehicle, [keys.vehicles, keys.audit]);
export const useDeleteVehicle = () => useErpMutation<Vehicle, void>(api.deleteVehicle, [keys.vehicles, keys.audit]);
export const useSaveTransportRoute = () => useErpMutation<TransportRoute, TransportRoute>(api.saveTransportRoute, [keys.transportRoutes, keys.audit]);
export const useDeleteTransportRoute = () => useErpMutation<TransportRoute, void>(api.deleteTransportRoute, [keys.transportRoutes, keys.audit]);
export const useSaveBusStop = () => useErpMutation<BusStop, BusStop>(api.saveBusStop, [keys.busStops, keys.audit]);
export const useDeleteBusStop = () => useErpMutation<BusStop, void>(api.deleteBusStop, [keys.busStops, keys.audit]);
export const useSaveRouteSchedule = () => useErpMutation<RouteSchedule, RouteSchedule>(api.saveRouteSchedule, [keys.routeSchedules, keys.audit]);
export const useDeleteRouteSchedule = () => useErpMutation<RouteSchedule, void>(api.deleteRouteSchedule, [keys.routeSchedules, keys.audit]);
export const useSaveRiderAssignment = () => useErpMutation<RiderAssignment, RiderAssignment>(api.saveRiderAssignment, [keys.riderAssignments, keys.audit]);
export const useDeleteRiderAssignment = () => useErpMutation<RiderAssignment, void>(api.deleteRiderAssignment, [keys.riderAssignments, keys.audit]);
export const useSaveBoardingLog = () => useErpMutation<BoardingLog, BoardingLog>(api.saveBoardingLog, [keys.boardingLogs, keys.audit]);
export const useDeleteBoardingLog = () => useErpMutation<BoardingLog, void>(api.deleteBoardingLog, [keys.boardingLogs, keys.audit]);
export const useSaveGpsTrack = () => useErpMutation<GpsTrack, GpsTrack>(api.saveGpsTrack, [keys.gpsTracks, keys.audit]);
export const useDeleteGpsTrack = () => useErpMutation<GpsTrack, void>(api.deleteGpsTrack, [keys.gpsTracks, keys.audit]);
export const useSaveVehicleMaintenance = () => useErpMutation<VehicleMaintenance, VehicleMaintenance>(api.saveVehicleMaintenance, [keys.vehicleMaintenance, keys.audit]);
export const useDeleteVehicleMaintenance = () => useErpMutation<VehicleMaintenance, void>(api.deleteVehicleMaintenance, [keys.vehicleMaintenance, keys.audit]);
// M18
export const useSaveResidenceBlock = () => useErpMutation<ResidenceBlock, ResidenceBlock>(api.saveResidenceBlock, [keys.residenceBlocks, keys.audit]);
export const useDeleteResidenceBlock = () => useErpMutation<ResidenceBlock, void>(api.deleteResidenceBlock, [keys.residenceBlocks, keys.audit]);
export const useSaveRoomType = () => useErpMutation<RoomType, RoomType>(api.saveRoomType, [keys.roomTypes, keys.audit]);
export const useDeleteRoomType = () => useErpMutation<RoomType, void>(api.deleteRoomType, [keys.roomTypes, keys.audit]);
export const useSaveHostelApplication = () => useErpMutation<HostelApplication, HostelApplication>(api.saveHostelApplication, [keys.hostelApplications, keys.audit]);
export const useDeleteHostelApplication = () => useErpMutation<HostelApplication, void>(api.deleteHostelApplication, [keys.hostelApplications, keys.audit]);
export const useSaveRoomAllocation = () => useErpMutation<RoomAllocation, RoomAllocation>(api.saveRoomAllocation, [keys.roomAllocations, keys.audit]);
export const useDeleteRoomAllocation = () => useErpMutation<RoomAllocation, void>(api.deleteRoomAllocation, [keys.roomAllocations, keys.audit]);
export const useSaveRollCall = () => useErpMutation<RollCall, RollCall>(api.saveRollCall, [keys.rollCalls, keys.audit]);
export const useDeleteRollCall = () => useErpMutation<RollCall, void>(api.deleteRollCall, [keys.rollCalls, keys.audit]);
export const useSaveResidenceIncident = () => useErpMutation<ResidenceIncident, ResidenceIncident>(api.saveResidenceIncident, [keys.residenceIncidents, keys.audit]);
export const useDeleteResidenceIncident = () => useErpMutation<ResidenceIncident, void>(api.deleteResidenceIncident, [keys.residenceIncidents, keys.audit]);
export const useSaveMealPlan = () => useErpMutation<MealPlan, MealPlan>(api.saveMealPlan, [keys.mealPlans, keys.audit]);
export const useDeleteMealPlan = () => useErpMutation<MealPlan, void>(api.deleteMealPlan, [keys.mealPlans, keys.audit]);
export const useSaveMessManagement = () => useErpMutation<MessManagement, MessManagement>(api.saveMessManagement, [keys.messManagement, keys.audit]);
export const useDeleteMessManagement = () => useErpMutation<MessManagement, void>(api.deleteMessManagement, [keys.messManagement, keys.audit]);
export const useSavePOSModule = () => useErpMutation<POSModule, POSModule>(api.savePOSModule, [keys.posModules, keys.audit]);
export const useDeletePOSModule = () => useErpMutation<POSModule, void>(api.deletePOSModule, [keys.posModules, keys.audit]);
export const useDeletePosModule = useDeletePOSModule;
export const useSavePosModule = useSavePOSModule;
export const useSavePrepaidWallet = () => useErpMutation<PrepaidWallet, PrepaidWallet>(api.savePrepaidWallet, [keys.prepaidWallets, keys.audit]);
export const useDeletePrepaidWallet = () => useErpMutation<PrepaidWallet, void>(api.deletePrepaidWallet, [keys.prepaidWallets, keys.audit]);
// M19
export const useSaveHealthProfile = () => useErpMutation<HealthProfile, HealthProfile>(api.saveHealthProfile, [keys.healthProfiles, keys.audit]);
export const useDeleteHealthProfile = () => useErpMutation<HealthProfile, void>(api.deleteHealthProfile, [keys.healthProfiles, keys.audit]);
export const useSaveClinicVisit = () => useErpMutation<ClinicVisit, ClinicVisit>(api.saveClinicVisit, [keys.clinicVisits, keys.audit]);
export const useDeleteClinicVisit = () => useErpMutation<ClinicVisit, void>(api.deleteClinicVisit, [keys.clinicVisits, keys.audit]);
export const useSaveCounselingCase = () => useErpMutation<CounselingCase, CounselingCase>(api.saveCounselingCase, [keys.counselingCases, keys.audit]);
export const useDeleteCounselingCase = () => useErpMutation<CounselingCase, void>(api.deleteCounselingCase, [keys.counselingCases, keys.audit]);
export const useSaveSupportNeed = () => useErpMutation<SupportNeed, SupportNeed>(api.saveSupportNeed, [keys.supportNeeds, keys.audit]);
export const useDeleteSupportNeed = () => useErpMutation<SupportNeed, void>(api.deleteSupportNeed, [keys.supportNeeds, keys.audit]);
export const useSaveAccommodationPlan = () => useErpMutation<AccommodationPlan, AccommodationPlan>(api.saveAccommodationPlan, [keys.accommodationPlans, keys.audit]);
export const useDeleteAccommodationPlan = () => useErpMutation<AccommodationPlan, void>(api.deleteAccommodationPlan, [keys.accommodationPlans, keys.audit]);
export const useSaveConductIncident = () => useErpMutation<ConductIncident, ConductIncident>(api.saveConductIncident, [keys.conductIncidents, keys.audit]);
export const useDeleteConductIncident = () => useErpMutation<ConductIncident, void>(api.deleteConductIncident, [keys.conductIncidents, keys.audit]);
export const useSaveConductAction = () => useErpMutation<ConductAction, ConductAction>(api.saveConductAction, [keys.conductActions, keys.audit]);
export const useDeleteConductAction = () => useErpMutation<ConductAction, void>(api.deleteConductAction, [keys.conductActions, keys.audit]);
export const useSaveGrievance = () => useErpMutation<Grievance, Grievance>(api.saveGrievance, [keys.grievances, keys.audit]);
export const useDeleteGrievance = () => useErpMutation<Grievance, void>(api.deleteGrievance, [keys.grievances, keys.audit]);
export const useSaveAdvisingAssignment = () => useErpMutation<AdvisingAssignment, AdvisingAssignment>(api.saveAdvisingAssignment, [keys.advisingAssignments, keys.audit]);
export const useDeleteAdvisingAssignment = () => useErpMutation<AdvisingAssignment, void>(api.deleteAdvisingAssignment, [keys.advisingAssignments, keys.audit]);
export const useSaveInterventionPlan = () => useErpMutation<InterventionPlan, InterventionPlan>(api.saveInterventionPlan, [keys.interventionPlans, keys.audit]);
export const useDeleteInterventionPlan = () => useErpMutation<InterventionPlan, void>(api.deleteInterventionPlan, [keys.interventionPlans, keys.audit]);
// M20
export const useSaveCommunityEvent = () => useErpMutation<CommunityEvent, CommunityEvent>(api.saveCommunityEvent, [keys.communityEvents, keys.audit]);
export const useDeleteCommunityEvent = () => useErpMutation<CommunityEvent, void>(api.deleteCommunityEvent, [keys.communityEvents, keys.audit]);
export const useSaveEventRegistration = () => useErpMutation<EventRegistration, EventRegistration>(api.saveEventRegistration, [keys.eventRegistrations, keys.audit]);
export const useDeleteEventRegistration = () => useErpMutation<EventRegistration, void>(api.deleteEventRegistration, [keys.eventRegistrations, keys.audit]);
export const useSaveActivityGroup = () => useErpMutation<ActivityGroup, ActivityGroup>(api.saveActivityGroup, [keys.activityGroups, keys.audit]);
export const useDeleteActivityGroup = () => useErpMutation<ActivityGroup, void>(api.deleteActivityGroup, [keys.activityGroups, keys.audit]);
export const useSaveGroupMembership = () => useErpMutation<GroupMembership, GroupMembership>(api.saveGroupMembership, [keys.groupMemberships, keys.audit]);
export const useDeleteGroupMembership = () => useErpMutation<GroupMembership, void>(api.deleteGroupMembership, [keys.groupMemberships, keys.audit]);
export const useSaveCompetition = () => useErpMutation<Competition, Competition>(api.saveCompetition, [keys.competitions, keys.audit]);
export const useDeleteCompetition = () => useErpMutation<Competition, void>(api.deleteCompetition, [keys.competitions, keys.audit]);
export const useSaveCompetitionEntry = () => useErpMutation<CompetitionEntry, CompetitionEntry>(api.saveCompetitionEntry, [keys.competitionEntries, keys.audit]);
export const useDeleteCompetitionEntry = () => useErpMutation<CompetitionEntry, void>(api.deleteCompetitionEntry, [keys.competitionEntries, keys.audit]);
export const useSaveCompetitionResult = () => useErpMutation<CompetitionResult, CompetitionResult>(api.saveCompetitionResult, [keys.competitionResults, keys.audit]);
export const useDeleteCompetitionResult = () => useErpMutation<CompetitionResult, void>(api.deleteCompetitionResult, [keys.competitionResults, keys.audit]);
export const useSaveTrip = () => useErpMutation<Trip, Trip>(api.saveTrip, [keys.trips, keys.audit]);
export const useDeleteTrip = () => useErpMutation<Trip, void>(api.deleteTrip, [keys.trips, keys.audit]);
export const useSaveTripParticipant = () => useErpMutation<TripParticipant, TripParticipant>(api.saveTripParticipant, [keys.tripParticipants, keys.audit]);
export const useDeleteTripParticipant = () => useErpMutation<TripParticipant, void>(api.deleteTripParticipant, [keys.tripParticipants, keys.audit]);
export const useSavePtmEvent = () => useErpMutation<PTMEvent, PTMEvent>(api.savePtmEvent, [keys.ptmEvents, keys.audit]);
export const useDeletePtmEvent = () => useErpMutation<PTMEvent, void>(api.deletePtmEvent, [keys.ptmEvents, keys.audit]);
export const useSavePtmBooking = () => useErpMutation<PTMBooking, PTMBooking>(api.savePtmBooking, [keys.ptmBookings, keys.audit]);
export const useDeletePtmBooking = () => useErpMutation<PTMBooking, void>(api.deletePtmBooking, [keys.ptmBookings, keys.audit]);
export const useSaveFundraisingCampaign = () => useErpMutation<FundraisingCampaign, FundraisingCampaign>(api.saveFundraisingCampaign, [keys.fundraisingCampaigns, keys.audit]);
export const useDeleteFundraisingCampaign = () => useErpMutation<FundraisingCampaign, void>(api.deleteFundraisingCampaign, [keys.fundraisingCampaigns, keys.audit]);
export const useSaveDonation = () => useErpMutation<Donation, Donation>(api.saveDonation, [keys.donations, keys.audit]);
export const useDeleteDonation = () => useErpMutation<Donation, void>(api.deleteDonation, [keys.donations, keys.audit]);
// M21
export const useSaveSubjectCombinationRule = () => useErpMutation<SubjectCombinationRule, SubjectCombinationRule>(api.saveSubjectCombinationRule, [keys.subjectCombinationRules, keys.audit]);
export const useDeleteSubjectCombinationRule = () => useErpMutation<SubjectCombinationRule, void>(api.deleteSubjectCombinationRule, [keys.subjectCombinationRules, keys.audit]);
export const useSaveStudentSubjectPlan = () => useErpMutation<StudentSubjectPlan, StudentSubjectPlan>(api.saveStudentSubjectPlan, [keys.studentSubjectPlans, keys.audit]);
export const useDeleteStudentSubjectPlan = () => useErpMutation<StudentSubjectPlan, void>(api.deleteStudentSubjectPlan, [keys.studentSubjectPlans, keys.audit]);
export const useSaveBoardRegistration = () => useErpMutation<BoardRegistration, BoardRegistration>(api.saveBoardRegistration, [keys.boardRegistrations, keys.audit]);
export const useDeleteBoardRegistration = () => useErpMutation<BoardRegistration, void>(api.deleteBoardRegistration, [keys.boardRegistrations, keys.audit]);
export const useSaveReadinessCheck = () => useErpMutation<ReadinessCheck, ReadinessCheck>(api.saveReadinessCheck, [keys.readinessChecks, keys.audit]);
export const useDeleteReadinessCheck = () => useErpMutation<ReadinessCheck, void>(api.deleteReadinessCheck, [keys.readinessChecks, keys.audit]);
export const useSaveInternalAssessmentSnapshot = () => useErpMutation<InternalAssessmentSnapshot, InternalAssessmentSnapshot>(api.saveInternalAssessmentSnapshot, [keys.internalAssessmentSnapshots, keys.audit]);
export const useDeleteInternalAssessmentSnapshot = () => useErpMutation<InternalAssessmentSnapshot, void>(api.deleteInternalAssessmentSnapshot, [keys.internalAssessmentSnapshots, keys.audit]);
export const useSaveGuidanceProfile = () => useErpMutation<GuidanceProfile, GuidanceProfile>(api.saveGuidanceProfile, [keys.guidanceProfiles, keys.audit]);
export const useDeleteGuidanceProfile = () => useErpMutation<GuidanceProfile, void>(api.deleteGuidanceProfile, [keys.guidanceProfiles, keys.audit]);
export const useSaveGuidanceSession = () => useErpMutation<GuidanceSession, GuidanceSession>(api.saveGuidanceSession, [keys.guidanceSessions, keys.audit]);
export const useDeleteGuidanceSession = () => useErpMutation<GuidanceSession, void>(api.deleteGuidanceSession, [keys.guidanceSessions, keys.audit]);
export const useSaveExternalApplication = () => useErpMutation<ExternalApplication, ExternalApplication>(api.saveExternalApplication, [keys.externalApplications, keys.audit]);
export const useDeleteExternalApplication = () => useErpMutation<ExternalApplication, void>(api.deleteExternalApplication, [keys.externalApplications, keys.audit]);
export const useSaveSchoolExitCase = () => useErpMutation<SchoolExitCase, SchoolExitCase>(api.saveSchoolExitCase, [keys.schoolExitCases, keys.audit]);
export const useDeleteSchoolExitCase = () => useErpMutation<SchoolExitCase, void>(api.deleteSchoolExitCase, [keys.schoolExitCases, keys.audit]);
export const useSaveMigrationDocument = () => useErpMutation<MigrationDocument, MigrationDocument>(api.saveMigrationDocument, [keys.migrationDocuments, keys.audit]);
export const useDeleteMigrationDocument = () => useErpMutation<MigrationDocument, void>(api.deleteMigrationDocument, [keys.migrationDocuments, keys.audit]);
export const useSaveFormerStudent = () => useErpMutation<FormerStudent, FormerStudent>(api.saveFormerStudent, [keys.formerStudents, keys.audit]);
export const useDeleteFormerStudent = () => useErpMutation<FormerStudent, void>(api.deleteFormerStudent, [keys.formerStudents, keys.audit]);
export const useSaveAlumniPreference = () => useErpMutation<AlumniPreference, AlumniPreference>(api.saveAlumniPreference, [keys.alumniPreferences, keys.audit]);
export const useDeleteAlumniPreference = () => useErpMutation<AlumniPreference, void>(api.deleteAlumniPreference, [keys.alumniPreferences, keys.audit]);
// M22
export const useServiceRequests = () => useQuery({ queryKey: keys.serviceRequests, queryFn: api.listServiceRequests });
export const useSaveServiceRequest = () => useErpMutation<ServiceRequest, ServiceRequest>(api.saveServiceRequest, [keys.serviceRequests, keys.audit]);
export const useDeleteServiceRequest = () => useErpMutation<ServiceRequest, void>(api.deleteServiceRequest, [keys.serviceRequests, keys.audit]);
export const useWorkOrders = () => useQuery({ queryKey: keys.workOrders, queryFn: api.listWorkOrders });
export const useSaveWorkOrder = () => useErpMutation<WorkOrder, WorkOrder>(api.saveWorkOrder, [keys.workOrders, keys.audit]);
export const useDeleteWorkOrder = () => useErpMutation<WorkOrder, void>(api.deleteWorkOrder, [keys.workOrders, keys.audit]);
export const useWorkOrderActivities = () => useQuery({ queryKey: keys.workOrderActivities, queryFn: api.listWorkOrderActivities });
export const useSaveWorkOrderActivity = () => useErpMutation<WorkOrderActivity, WorkOrderActivity>(api.saveWorkOrderActivity, [keys.workOrderActivities, keys.audit]);
export const useDeleteWorkOrderActivity = () => useErpMutation<WorkOrderActivity, void>(api.deleteWorkOrderActivity, [keys.workOrderActivities, keys.audit]);
export const useMaintenancePlans = () => useQuery({ queryKey: keys.maintenancePlans, queryFn: api.listMaintenancePlans });
export const useSaveMaintenancePlan = () => useErpMutation<MaintenancePlan, MaintenancePlan>(api.saveMaintenancePlan, [keys.maintenancePlans, keys.audit]);
export const useDeleteMaintenancePlan = () => useErpMutation<MaintenancePlan, void>(api.deleteMaintenancePlan, [keys.maintenancePlans, keys.audit]);
export const useBookings = () => useQuery({ queryKey: keys.bookings, queryFn: api.listBookings });
export const useSaveBooking = () => useErpMutation<Booking, Booking>(api.saveBooking, [keys.bookings, keys.audit]);
export const useDeleteBooking = () => useErpMutation<Booking, void>(api.deleteBooking, [keys.bookings, keys.audit]);
export const useBookingAttendees = () => useQuery({ queryKey: keys.bookingAttendees, queryFn: api.listBookingAttendees });
export const useSaveBookingAttendee = () => useErpMutation<BookingAttendee, BookingAttendee>(api.saveBookingAttendee, [keys.bookingAttendees, keys.audit]);
export const useDeleteBookingAttendee = () => useErpMutation<BookingAttendee, void>(api.deleteBookingAttendee, [keys.bookingAttendees, keys.audit]);
export const useSafetyIncidents = () => useQuery({ queryKey: keys.safetyIncidents, queryFn: api.listSafetyIncidents });
export const useSaveSafetyIncident = () => useErpMutation<SafetyIncident, SafetyIncident>(api.saveSafetyIncident, [keys.safetyIncidents, keys.audit]);
export const useDeleteSafetyIncident = () => useErpMutation<SafetyIncident, void>(api.deleteSafetyIncident, [keys.safetyIncidents, keys.audit]);
export const useEmergencyActions = () => useQuery({ queryKey: keys.emergencyActions, queryFn: api.listEmergencyActions });
export const useSaveEmergencyAction = () => useErpMutation<EmergencyAction, EmergencyAction>(api.saveEmergencyAction, [keys.emergencyActions, keys.audit]);
export const useDeleteEmergencyAction = () => useErpMutation<EmergencyAction, void>(api.deleteEmergencyAction, [keys.emergencyActions, keys.audit]);
export const useVisitorVisits = () => useQuery({ queryKey: keys.visitorVisits, queryFn: api.listVisitorVisits });
export const useSaveVisitorVisit = () => useErpMutation<VisitorVisit, VisitorVisit>(api.saveVisitorVisit, [keys.visitorVisits, keys.audit]);
export const useDeleteVisitorVisit = () => useErpMutation<VisitorVisit, void>(api.deleteVisitorVisit, [keys.visitorVisits, keys.audit]);
export const useAccessCredentials = () => useQuery({ queryKey: keys.accessCredentials, queryFn: api.listAccessCredentials });
export const useSaveAccessCredential = () => useErpMutation<AccessCredential, AccessCredential>(api.saveAccessCredential, [keys.accessCredentials, keys.audit]);
export const useDeleteAccessCredential = () => useErpMutation<AccessCredential, void>(api.deleteAccessCredential, [keys.accessCredentials, keys.audit]);
export const useKeyIssues = () => useQuery({ queryKey: keys.keyIssues, queryFn: api.listKeyIssues });
export const useSaveKeyIssue = () => useErpMutation<KeyIssue, KeyIssue>(api.saveKeyIssue, [keys.keyIssues, keys.audit]);
export const useDeleteKeyIssue = () => useErpMutation<KeyIssue, void>(api.deleteKeyIssue, [keys.keyIssues, keys.audit]);
export const useUtilityMeters = () => useQuery({ queryKey: keys.utilityMeters, queryFn: api.listUtilityMeters });
export const useSaveUtilityMeter = () => useErpMutation<UtilityMeter, UtilityMeter>(api.saveUtilityMeter, [keys.utilityMeters, keys.audit]);
export const useDeleteUtilityMeter = () => useErpMutation<UtilityMeter, void>(api.deleteUtilityMeter, [keys.utilityMeters, keys.audit]);
export const useMeterReadings = () => useQuery({ queryKey: keys.meterReadings, queryFn: api.listMeterReadings });
export const useSaveMeterReading = () => useErpMutation<MeterReading, MeterReading>(api.saveMeterReading, [keys.meterReadings, keys.audit]);
export const useDeleteMeterReading = () => useErpMutation<MeterReading, void>(api.deleteMeterReading, [keys.meterReadings, keys.audit]);
export const useContinuityPlans = () => useQuery({ queryKey: keys.continuityPlans, queryFn: api.listContinuityPlans });
export const useSaveContinuityPlan = () => useErpMutation<ContinuityPlan, ContinuityPlan>(api.saveContinuityPlan, [keys.continuityPlans, keys.audit]);
export const useDeleteContinuityPlan = () => useErpMutation<ContinuityPlan, void>(api.deleteContinuityPlan, [keys.continuityPlans, keys.audit]);
export const useContinuityExercises = () => useQuery({ queryKey: keys.continuityExercises, queryFn: api.listContinuityExercises });
// M23
export const useAnnouncements = () => useQuery({ queryKey: keys.announcements, queryFn: api.listAnnouncements });
export const useSaveAnnouncement = () => useErpMutation<Announcement, Announcement>(api.saveAnnouncement, [keys.announcements, keys.audit]);
export const useDeleteAnnouncement = () => useErpMutation<Announcement, void>(api.deleteAnnouncement, [keys.announcements, keys.audit]);
export const useMessages = () => useQuery({ queryKey: keys.messages, queryFn: api.listMessages });
export const useSaveMessage = () => useErpMutation<Message, Message>(api.saveMessage, [keys.messages, keys.audit]);
export const useDeleteMessage = () => useErpMutation<Message, void>(api.deleteMessage, [keys.messages, keys.audit]);
export const useDeliveryAttempts = () => useQuery({ queryKey: keys.deliveryAttempts, queryFn: api.listDeliveryAttempts });
export const useSaveDeliveryAttempt = () => useErpMutation<DeliveryAttempt, DeliveryAttempt>(api.saveDeliveryAttempt, [keys.deliveryAttempts, keys.audit]);
export const useDeleteDeliveryAttempt = () => useErpMutation<DeliveryAttempt, void>(api.deleteDeliveryAttempt, [keys.deliveryAttempts, keys.audit]);
export const useNotificationPreferences = () => useQuery({ queryKey: keys.notificationPreferences, queryFn: api.listNotificationPreferences });
export const useSaveNotificationPreference = () => useErpMutation<NotificationPreference, NotificationPreference>(api.saveNotificationPreference, [keys.notificationPreferences, keys.audit]);
export const useDeleteNotificationPreference = () => useErpMutation<NotificationPreference, void>(api.deleteNotificationPreference, [keys.notificationPreferences, keys.audit]);
export const useConversations = () => useQuery({ queryKey: keys.conversations, queryFn: api.listConversations });
export const useSaveConversation = () => useErpMutation<Conversation, Conversation>(api.saveConversation, [keys.conversations, keys.audit]);
export const useDeleteConversation = () => useErpMutation<Conversation, void>(api.deleteConversation, [keys.conversations, keys.audit]);
export const useConversationParticipants = () => useQuery({ queryKey: keys.conversationParticipants, queryFn: api.listConversationParticipants });
export const useSaveConversationParticipant = () => useErpMutation<ConversationParticipant, ConversationParticipant>(api.saveConversationParticipant, [keys.conversationParticipants, keys.audit]);
export const useDeleteConversationParticipant = () => useErpMutation<ConversationParticipant, void>(api.deleteConversationParticipant, [keys.conversationParticipants, keys.audit]);
export const useConversationMessages = () => useQuery({ queryKey: keys.conversationMessages, queryFn: api.listConversationMessages });
export const useSaveConversationMessage = () => useErpMutation<ConversationMessage, ConversationMessage>(api.saveConversationMessage, [keys.conversationMessages, keys.audit]);
export const useDeleteConversationMessage = () => useErpMutation<ConversationMessage, void>(api.deleteConversationMessage, [keys.conversationMessages, keys.audit]);
export const useWorkflowDefinitions = () => useQuery({ queryKey: keys.workflowDefinitions, queryFn: api.listWorkflowDefinitions });
export const useSaveWorkflowDefinition = () => useErpMutation<WorkflowDefinition, WorkflowDefinition>(api.saveWorkflowDefinition, [keys.workflowDefinitions, keys.audit]);
export const useDeleteWorkflowDefinition = () => useErpMutation<WorkflowDefinition, void>(api.deleteWorkflowDefinition, [keys.workflowDefinitions, keys.audit]);
export const useWorkflowInstances = () => useQuery({ queryKey: keys.workflowInstances, queryFn: api.listWorkflowInstances });
export const useSaveWorkflowInstance = () => useErpMutation<WorkflowInstance, WorkflowInstance>(api.saveWorkflowInstance, [keys.workflowInstances, keys.audit]);
export const useDeleteWorkflowInstance = () => useErpMutation<WorkflowInstance, void>(api.deleteWorkflowInstance, [keys.workflowInstances, keys.audit]);
export const useWorkflowTasks = () => useQuery({ queryKey: keys.workflowTasks, queryFn: api.listWorkflowTasks });
export const useSaveWorkflowTask = () => useErpMutation<WorkflowTask, WorkflowTask>(api.saveWorkflowTask, [keys.workflowTasks, keys.audit]);
export const useDeleteWorkflowTask = () => useErpMutation<WorkflowTask, void>(api.deleteWorkflowTask, [keys.workflowTasks, keys.audit]);
export const useWorkflowTransitions = () => useQuery({ queryKey: keys.workflowTransitions, queryFn: api.listWorkflowTransitions });
export const useSaveWorkflowTransition = () => useErpMutation<WorkflowTransition, WorkflowTransition>(api.saveWorkflowTransition, [keys.workflowTransitions, keys.audit]);
export const useDeleteWorkflowTransition = () => useErpMutation<WorkflowTransition, void>(api.deleteWorkflowTransition, [keys.workflowTransitions, keys.audit]);
export const useServiceCases = () => useQuery({ queryKey: keys.serviceCases, queryFn: api.listServiceCases });
export const useSaveServiceCase = () => useErpMutation<ServiceCase, ServiceCase>(api.saveServiceCase, [keys.serviceCases, keys.audit]);
export const useDeleteServiceCase = () => useErpMutation<ServiceCase, void>(api.deleteServiceCase, [keys.serviceCases, keys.audit]);
export const useCaseActivities = () => useQuery({ queryKey: keys.caseActivities, queryFn: api.listCaseActivities });
export const useSaveCaseActivity = () => useErpMutation<CaseActivity, CaseActivity>(api.saveCaseActivity, [keys.caseActivities, keys.audit]);
export const useDeleteCaseActivity = () => useErpMutation<CaseActivity, void>(api.deleteCaseActivity, [keys.caseActivities, keys.audit]);
export const useSlaClocks = () => useQuery({ queryKey: keys.slaClocks, queryFn: api.listSlaClocks });
export const useSaveSlaClock = () => useErpMutation<SlaClock, SlaClock>(api.saveSlaClock, [keys.slaClocks, keys.audit]);
export const useDeleteSlaClock = () => useErpMutation<SlaClock, void>(api.deleteSlaClock, [keys.slaClocks, keys.audit]);
export const useDocumentTemplates = () => useQuery({ queryKey: keys.documentTemplates, queryFn: api.listDocumentTemplates });
export const useSaveDocumentTemplate = () => useErpMutation<DocumentTemplate, DocumentTemplate>(api.saveDocumentTemplate, [keys.documentTemplates, keys.audit]);
export const useDeleteDocumentTemplate = () => useErpMutation<DocumentTemplate, void>(api.deleteDocumentTemplate, [keys.documentTemplates, keys.audit]);
export const useDocumentInstances = () => useQuery({ queryKey: keys.documentInstances, queryFn: api.listDocumentInstances });
export const useSaveDocumentInstance = () => useErpMutation<DocumentInstance, DocumentInstance>(api.saveDocumentInstance, [keys.documentInstances, keys.audit]);
export const useDeleteDocumentInstance = () => useErpMutation<DocumentInstance, void>(api.deleteDocumentInstance, [keys.documentInstances, keys.audit]);
export const useSignatureRequests = () => useQuery({ queryKey: keys.signatureRequests, queryFn: api.listSignatureRequests });
export const useSaveSignatureRequest = () => useErpMutation<SignatureRequest, SignatureRequest>(api.saveSignatureRequest, [keys.signatureRequests, keys.audit]);
export const useDeleteSignatureRequest = () => useErpMutation<SignatureRequest, void>(api.deleteSignatureRequest, [keys.signatureRequests, keys.audit]);
export const useRecordDeclarations = () => useQuery({ queryKey: keys.recordDeclarations, queryFn: api.listRecordDeclarations });
export const useSaveRecordDeclaration = () => useErpMutation<RecordDeclaration, RecordDeclaration>(api.saveRecordDeclaration, [keys.recordDeclarations, keys.audit]);
export const useDeleteRecordDeclaration = () => useErpMutation<RecordDeclaration, void>(api.deleteRecordDeclaration, [keys.recordDeclarations, keys.audit]);
export const useRetentionAssignments = () => useQuery({ queryKey: keys.retentionAssignments, queryFn: api.listRetentionAssignments });
export const useSaveRetentionAssignment = () => useErpMutation<RetentionAssignment, RetentionAssignment>(api.saveRetentionAssignment, [keys.retentionAssignments, keys.audit]);
export const useDeleteRetentionAssignment = () => useErpMutation<RetentionAssignment, void>(api.deleteRetentionAssignment, [keys.retentionAssignments, keys.audit]);
// M24
export const useReportDefinitions = () => useQuery({ queryKey: keys.reportDefinitions, queryFn: api.listReportDefinitions });
export const useDashboards = () => useQuery({ queryKey: keys.dashboards, queryFn: api.listDashboards });
export const useDashboardWidgets = () => useQuery({ queryKey: keys.dashboardWidgets, queryFn: api.listDashboardWidgets });
export const useReportRuns = () => useQuery({ queryKey: keys.reportRuns, queryFn: api.listReportRuns });
export const useMetricDefinitions = () => useQuery({ queryKey: keys.metricDefinitions, queryFn: api.listMetricDefinitions });
export const useSemanticDimensions = () => useQuery({ queryKey: keys.semanticDimensions, queryFn: api.listSemanticDimensions });
export const useReportAccessPolicies = () => useQuery({ queryKey: keys.reportAccessPolicies, queryFn: api.listReportAccessPolicies });
export const useReportCatalogEntries = () => useQuery({ queryKey: keys.reportCatalogEntries, queryFn: api.listReportCatalogEntries });
export const useDataProducts = () => useQuery({ queryKey: keys.dataProducts, queryFn: api.listDataProducts });
export const usePipelineRuns = () => useQuery({ queryKey: keys.pipelineRuns, queryFn: api.listPipelineRuns });
export const useDataQualityResults = () => useQuery({ queryKey: keys.dataQualityResults, queryFn: api.listDataQualityResults });
export const useModelVersions = () => useQuery({ queryKey: keys.modelVersions, queryFn: api.listModelVersions });
export const useModelScores = () => useQuery({ queryKey: keys.modelScores, queryFn: api.listModelScores });
export const useSaveContinuityExercise = () => useErpMutation<ContinuityExercise, ContinuityExercise>(api.saveContinuityExercise, [keys.continuityExercises, keys.audit]);
export const useDeleteContinuityExercise = () => useErpMutation<ContinuityExercise, void>(api.deleteContinuityExercise, [keys.continuityExercises, keys.audit]);
// M24
export const useSaveReportDefinition = () => useErpMutation<ReportDefinition, ReportDefinition>(api.saveReportDefinition, [keys.reportDefinitions, keys.audit]);
export const useDeleteReportDefinition = () => useErpMutation<ReportDefinition, void>(api.deleteReportDefinition, [keys.reportDefinitions, keys.audit]);
export const useSaveDashboard = () => useErpMutation<Dashboard, Dashboard>(api.saveDashboard, [keys.dashboards, keys.audit]);
export const useDeleteDashboard = () => useErpMutation<Dashboard, void>(api.deleteDashboard, [keys.dashboards, keys.audit]);
export const useSaveDashboardWidget = () => useErpMutation<DashboardWidget, DashboardWidget>(api.saveDashboardWidget, [keys.dashboardWidgets, keys.audit]);
export const useDeleteDashboardWidget = () => useErpMutation<DashboardWidget, void>(api.deleteDashboardWidget, [keys.dashboardWidgets, keys.audit]);
export const useSaveReportRun = () => useErpMutation<ReportRun, ReportRun>(api.saveReportRun, [keys.reportRuns, keys.audit]);
export const useDeleteReportRun = () => useErpMutation<ReportRun, void>(api.deleteReportRun, [keys.reportRuns, keys.audit]);
export const useSaveMetricDefinition = () => useErpMutation<MetricDefinition, MetricDefinition>(api.saveMetricDefinition, [keys.metricDefinitions, keys.audit]);
export const useDeleteMetricDefinition = () => useErpMutation<MetricDefinition, void>(api.deleteMetricDefinition, [keys.metricDefinitions, keys.audit]);
export const useSaveSemanticDimension = () => useErpMutation<SemanticDimension, SemanticDimension>(api.saveSemanticDimension, [keys.semanticDimensions, keys.audit]);
export const useDeleteSemanticDimension = () => useErpMutation<SemanticDimension, void>(api.deleteSemanticDimension, [keys.semanticDimensions, keys.audit]);
export const useSaveReportAccessPolicy = () => useErpMutation<ReportAccessPolicy, ReportAccessPolicy>(api.saveReportAccessPolicy, [keys.reportAccessPolicies, keys.audit]);
export const useDeleteReportAccessPolicy = () => useErpMutation<ReportAccessPolicy, void>(api.deleteReportAccessPolicy, [keys.reportAccessPolicies, keys.audit]);
export const useSaveReportCatalogEntry = () => useErpMutation<ReportCatalogEntry, ReportCatalogEntry>(api.saveReportCatalogEntry, [keys.reportCatalogEntries, keys.audit]);
export const useDeleteReportCatalogEntry = () => useErpMutation<ReportCatalogEntry, void>(api.deleteReportCatalogEntry, [keys.reportCatalogEntries, keys.audit]);
export const useSaveDataProduct = () => useErpMutation<DataProduct, DataProduct>(api.saveDataProduct, [keys.dataProducts, keys.audit]);
export const useDeleteDataProduct = () => useErpMutation<DataProduct, void>(api.deleteDataProduct, [keys.dataProducts, keys.audit]);
export const useSavePipelineRun = () => useErpMutation<PipelineRun, PipelineRun>(api.savePipelineRun, [keys.pipelineRuns, keys.audit]);
export const useDeletePipelineRun = () => useErpMutation<PipelineRun, void>(api.deletePipelineRun, [keys.pipelineRuns, keys.audit]);
export const useSaveDataQualityResult = () => useErpMutation<DataQualityResult, DataQualityResult>(api.saveDataQualityResult, [keys.dataQualityResults, keys.audit]);
export const useDeleteDataQualityResult = () => useErpMutation<DataQualityResult, void>(api.deleteDataQualityResult, [keys.dataQualityResults, keys.audit]);
export const useSaveModelVersion = () => useErpMutation<ModelVersion, ModelVersion>(api.saveModelVersion, [keys.modelVersions, keys.audit]);
export const useDeleteModelVersion = () => useErpMutation<ModelVersion, void>(api.deleteModelVersion, [keys.modelVersions, keys.audit]);
export const useSaveModelScore = () => useErpMutation<ModelScore, ModelScore>(api.saveModelScore, [keys.modelScores, keys.audit]);
export const useDeleteModelScore = () => useErpMutation<ModelScore, void>(api.deleteModelScore, [keys.modelScores, keys.audit]);
export const useStudentAnalytics = () => useQuery({ queryKey: keys.studentAnalytics, queryFn: api.listStudentAnalyticses });
export const useSaveStudentAnalytics = () => useErpMutation<StudentAnalytics, StudentAnalytics>(api.saveStudentAnalytics, [keys.studentAnalytics, keys.audit]);
export const useDeleteStudentAnalytics = () => useErpMutation<StudentAnalytics, void>(api.deleteStudentAnalytics, [keys.studentAnalytics, keys.audit]);
export const useCohortAnalysis = () => useQuery({ queryKey: keys.cohortAnalysis, queryFn: api.listCohortAnalyses });
export const useSaveCohortAnalysis = () => useErpMutation<CohortAnalysis, CohortAnalysis>(api.saveCohortAnalysis, [keys.cohortAnalysis, keys.audit]);
export const useDeleteCohortAnalysis = () => useErpMutation<CohortAnalysis, void>(api.deleteCohortAnalysis, [keys.cohortAnalysis, keys.audit]);
export const useFinanceAnalytics = () => useQuery({ queryKey: keys.financeAnalytics, queryFn: api.listFinanceAnalyticses });
export const useSaveFinanceAnalytics = () => useErpMutation<FinanceAnalytics, FinanceAnalytics>(api.saveFinanceAnalytics, [keys.financeAnalytics, keys.audit]);
export const useDeleteFinanceAnalytics = () => useErpMutation<FinanceAnalytics, void>(api.deleteFinanceAnalytics, [keys.financeAnalytics, keys.audit]);
export const useWorkforceAnalytics = () => useQuery({ queryKey: keys.workforceAnalytics, queryFn: api.listWorkforceAnalyticses });
export const useSaveWorkforceAnalytics = () => useErpMutation<WorkforceAnalytics, WorkforceAnalytics>(api.saveWorkforceAnalytics, [keys.workforceAnalytics, keys.audit]);
export const useDeleteWorkforceAnalytics = () => useErpMutation<WorkforceAnalytics, void>(api.deleteWorkforceAnalytics, [keys.workforceAnalytics, keys.audit]);
export const useReportBuilders = () => useQuery({ queryKey: keys.reportBuilders, queryFn: api.listReportBuilders });
export const useSaveReportBuilder = () => useErpMutation<ReportBuilder, ReportBuilder>(api.saveReportBuilder, [keys.reportBuilders, keys.audit]);
export const useDeleteReportBuilder = () => useErpMutation<ReportBuilder, void>(api.deleteReportBuilder, [keys.reportBuilders, keys.audit]);
export const useReportSchedules = () => useQuery({ queryKey: keys.reportSchedules, queryFn: api.listReportSchedules });
export const useSaveReportSchedule = () => useErpMutation<ReportSchedule, ReportSchedule>(api.saveReportSchedule, [keys.reportSchedules, keys.audit]);
export const useDeleteReportSchedule = () => useErpMutation<ReportSchedule, void>(api.deleteReportSchedule, [keys.reportSchedules, keys.audit]);
export const useCourseSpaces = () => useQuery({ queryKey: keys.courseSpaces, queryFn: api.listCourseSpaces });
export const useSaveCourseSpace = () => useErpMutation<CourseSpace, CourseSpace>(api.saveCourseSpace, [keys.courseSpaces, keys.audit]);
export const useDeleteCourseSpace = () => useErpMutation<CourseSpace, void>(api.deleteCourseSpace, [keys.courseSpaces, keys.audit]);
export const useCourseRosters = () => useQuery({ queryKey: keys.courseRosters, queryFn: api.listCourseRosters });
export const useSaveCourseRoster = () => useErpMutation<CourseRoster, CourseRoster>(api.saveCourseRoster, [keys.courseRosters, keys.audit]);
export const useDeleteCourseRoster = () => useErpMutation<CourseRoster, void>(api.deleteCourseRoster, [keys.courseRosters, keys.audit]);
export const useCourseContents = () => useQuery({ queryKey: keys.courseContents, queryFn: api.listCourseContents });
export const useSaveCourseContent = () => useErpMutation<CourseContent, CourseContent>(api.saveCourseContent, [keys.courseContents, keys.audit]);
export const useDeleteCourseContent = () => useErpMutation<CourseContent, void>(api.deleteCourseContent, [keys.courseContents, keys.audit]);
export const useLearningResources = () => useQuery({ queryKey: keys.learningResources, queryFn: api.listLearningResources });
export const useSaveLearningResource = () => useErpMutation<LearningResource, LearningResource>(api.saveLearningResource, [keys.learningResources, keys.audit]);
export const useDeleteLearningResource = () => useErpMutation<LearningResource, void>(api.deleteLearningResource, [keys.learningResources, keys.audit]);
export const useAssignments = () => useQuery({ queryKey: keys.assignments, queryFn: api.listAssignments });
export const useSaveAssignment = () => useErpMutation<Assignment, Assignment>(api.saveAssignment, [keys.assignments, keys.audit]);
export const useDeleteAssignment = () => useErpMutation<Assignment, void>(api.deleteAssignment, [keys.assignments, keys.audit]);
export const useSubmissions = () => useQuery({ queryKey: keys.submissions, queryFn: api.listSubmissions });
export const useSaveSubmission = () => useErpMutation<Submission, Submission>(api.saveSubmission, [keys.submissions, keys.audit]);
export const useDeleteSubmission = () => useErpMutation<Submission, void>(api.deleteSubmission, [keys.submissions, keys.audit]);
export const useQuizzes = () => useQuery({ queryKey: keys.quizzes, queryFn: api.listQuizs });
export const useSaveQuiz = () => useErpMutation<Quiz, Quiz>(api.saveQuiz, [keys.quizzes, keys.audit]);
export const useDeleteQuiz = () => useErpMutation<Quiz, void>(api.deleteQuiz, [keys.quizzes, keys.audit]);
export const useQuizAttempts = () => useQuery({ queryKey: keys.quizAttempts, queryFn: api.listQuizAttempts });
export const useSaveQuizAttempt = () => useErpMutation<QuizAttempt, QuizAttempt>(api.saveQuizAttempt, [keys.quizAttempts, keys.audit]);
export const useDeleteQuizAttempt = () => useErpMutation<QuizAttempt, void>(api.deleteQuizAttempt, [keys.quizAttempts, keys.audit]);
export const useDiscussions = () => useQuery({ queryKey: keys.discussions, queryFn: api.listDiscussions });
export const useSaveDiscussion = () => useErpMutation<Discussion, Discussion>(api.saveDiscussion, [keys.discussions, keys.audit]);
export const useDeleteDiscussion = () => useErpMutation<Discussion, void>(api.deleteDiscussion, [keys.discussions, keys.audit]);
export const useDiscussionPosts = () => useQuery({ queryKey: keys.discussionPosts, queryFn: api.listDiscussionPosts });
export const useSaveDiscussionPost = () => useErpMutation<DiscussionPost, DiscussionPost>(api.saveDiscussionPost, [keys.discussionPosts, keys.audit]);
export const useDeleteDiscussionPost = () => useErpMutation<DiscussionPost, void>(api.deleteDiscussionPost, [keys.discussionPosts, keys.audit]);
export const useLearningMetrics = () => useQuery({ queryKey: keys.learningMetrics, queryFn: api.listLearningMetrics });
export const useSaveLearningMetric = () => useErpMutation<LearningMetric, LearningMetric>(api.saveLearningMetric, [keys.learningMetrics, keys.audit]);
export const useDeleteLearningMetric = () => useErpMutation<LearningMetric, void>(api.deleteLearningMetric, [keys.learningMetrics, keys.audit]);
export const useInterventionAlerts = () => useQuery({ queryKey: keys.interventionAlerts, queryFn: api.listInterventionAlerts });
export const useSaveInterventionAlert = () => useErpMutation<InterventionAlert, InterventionAlert>(api.saveInterventionAlert, [keys.interventionAlerts, keys.audit]);
export const useDeleteInterventionAlert = () => useErpMutation<InterventionAlert, void>(api.deleteInterventionAlert, [keys.interventionAlerts, keys.audit]);
export const useLtiTools = () => useQuery({ queryKey: keys.ltiTools, queryFn: api.listLTITools });
export const useSaveLtiTool = () => useErpMutation<LTITool, LTITool>(api.saveLTITool, [keys.ltiTools, keys.audit]);
export const useDeleteLtiTool = () => useErpMutation<LTITool, void>(api.deleteLTITool, [keys.ltiTools, keys.audit]);
export const useLTITools = useLtiTools;
export const useSaveLTITool = useSaveLtiTool;
export const useDeleteLTITool = useDeleteLtiTool;
export const useContentImports = () => useQuery({ queryKey: keys.contentImports, queryFn: api.listContentImports });
export const useSaveContentImport = () => useErpMutation<ContentImport, ContentImport>(api.saveContentImport, [keys.contentImports, keys.audit]);
export const useDeleteContentImport = () => useErpMutation<ContentImport, void>(api.deleteContentImport, [keys.contentImports, keys.audit]);
export const useWarehouses = () => useQuery({ queryKey: keys.warehouses, queryFn: api.listWarehouses });
export const useSaveWarehouse = () => useErpMutation<Warehouse, Warehouse>(api.saveWarehouse, [keys.warehouses, keys.audit]);
export const useDeleteWarehouse = () => useErpMutation<Warehouse, void>(api.deleteWarehouse, [keys.warehouses, keys.audit]);
