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
