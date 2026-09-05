// Fake backend — reads/writes IndexedDB with simulated network latency.
// Swap these functions with real HTTP calls later; TanStack Query hooks stay identical.
import { dbGetAll, dbPut, dbDelete } from "./db";
import { uid } from "./utils";
import type {
  Tenant, Institution, LegalEntity, Campus, OrgUnit, LocationNode,
  Holiday, CalendarYear, LocaleSettings, DocSequence, FeatureFlag, ConfigVersion, AuditEntry,
  UserIdentity, AuthSession, AuthFactor, Role, UserRole, DataScope,
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
  LibraryResource, LibraryHolding, LibraryMember, LibraryLoan, LibraryReservation,
  LibraryAcquisition, DigitalResource,
  Vehicle, TransportRoute, BusStop, RouteSchedule, RiderAssignment, BoardingLog,
  GpsTrack, VehicleMaintenance,
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
} from "./types";

const delay = (ms?: number) => new Promise<void>((r) => setTimeout(r, ms ?? 220 + Math.random() * 380));

interface ErpApi {
  // M01
  listTenants(): Promise<Tenant[]>;
  saveTenant(tenant: Tenant): Promise<Tenant>;
  deleteTenant(tenant: Tenant): Promise<void>;
  getInstitution(): Promise<Institution>;
  saveInstitution(inst: Institution): Promise<Institution>;
  listLegalEntities(): Promise<LegalEntity[]>;
  saveLegalEntity(e: LegalEntity): Promise<LegalEntity>;
  deleteLegalEntity(e: LegalEntity): Promise<void>;
  listCampuses(): Promise<Campus[]>;
  saveCampus(c: Campus): Promise<Campus>;
  deleteCampus(c: Campus): Promise<void>;
  listOrgUnits(): Promise<OrgUnit[]>;
  saveOrgUnit(u: OrgUnit): Promise<OrgUnit>;
  deleteOrgUnit(u: OrgUnit, children: number): Promise<void>;
  listLocations(): Promise<LocationNode[]>;
  saveLocation(l: LocationNode): Promise<LocationNode>;
  deleteLocation(l: LocationNode, children: number): Promise<void>;
  listCalendarYears(): Promise<CalendarYear[]>;
  listHolidays(): Promise<Holiday[]>;
  saveHoliday(h: Holiday): Promise<Holiday>;
  deleteHoliday(h: Holiday): Promise<void>;
  getLocale(): Promise<LocaleSettings>;
  saveLocale(l: LocaleSettings): Promise<LocaleSettings>;
  listSequences(): Promise<DocSequence[]>;
  saveSequence(s: DocSequence): Promise<DocSequence>;
  listFeatureFlags(): Promise<FeatureFlag[]>;
  saveFeatureFlag(f: FeatureFlag): Promise<FeatureFlag>;
  listConfigVersions(): Promise<ConfigVersion[]>;
  saveConfigVersion(v: ConfigVersion): Promise<ConfigVersion>;
  listAudit(): Promise<AuditEntry[]>;
  // M02
  listUserIdentities(): Promise<UserIdentity[]>;
  saveUserIdentity(u: UserIdentity): Promise<UserIdentity>;
  deleteUserIdentity(u: UserIdentity): Promise<void>;
  listAuthSessions(): Promise<AuthSession[]>;
  revokeAuthSession(s: AuthSession): Promise<void>;
  listAuthFactors(): Promise<AuthFactor[]>;
  listRoles(): Promise<Role[]>;
  saveRole(r: Role): Promise<Role>;
  deleteRole(r: Role): Promise<void>;
  listUserRoles(): Promise<UserRole[]>;
  saveUserRole(ur: UserRole): Promise<UserRole>;
  deleteUserRole(ur: UserRole): Promise<void>;
  listDataScopes(): Promise<DataScope[]>;
  saveDataScope(ds: DataScope): Promise<DataScope>;
  deleteDataScope(ds: DataScope): Promise<void>;
  listDelegations(): Promise<Delegation[]>;
  saveDelegation(d: Delegation): Promise<Delegation>;
  revokeDelegation(d: Delegation): Promise<void>;
  listImpersonationLogs(): Promise<ImpersonationLog[]>;
  saveImpersonationLog(l: ImpersonationLog): Promise<ImpersonationLog>;
  listDutyRules(): Promise<DutyRule[]>;
  saveDutyRule(r: DutyRule): Promise<DutyRule>;
  deleteDutyRule(r: DutyRule): Promise<void>;
  listDutyViolations(): Promise<DutyViolation[]>;
  saveDutyViolation(v: DutyViolation): Promise<DutyViolation>;
  listPrivilegedAccess(): Promise<PrivilegedAccess[]>;
  savePrivilegedAccess(pa: PrivilegedAccess): Promise<PrivilegedAccess>;
  listAccessReviews(): Promise<AccessReview[]>;
  saveAccessReview(ar: AccessReview): Promise<AccessReview>;
  // M03
  listAcademicYears(): Promise<AcademicYear[]>;
  saveAcademicYear(y: AcademicYear): Promise<AcademicYear>;
  deleteAcademicYear(y: AcademicYear): Promise<void>;
  listTerms(): Promise<Term[]>;
  saveTerm(t: Term): Promise<Term>;
  deleteTerm(t: Term): Promise<void>;
  listSchoolLevels(): Promise<SchoolLevel[]>;
  saveSchoolLevel(l: SchoolLevel): Promise<SchoolLevel>;
  listGradeClasses(): Promise<GradeClass[]>;
  saveGradeClass(g: GradeClass): Promise<GradeClass>;
  deleteGradeClass(g: GradeClass): Promise<void>;
  listStreams(): Promise<Stream[]>;
  saveStream(s: Stream): Promise<Stream>;
  deleteStream(s: Stream): Promise<void>;
  listSubjects(): Promise<Subject[]>;
  saveSubject(s: Subject): Promise<Subject>;
  deleteSubject(s: Subject): Promise<void>;
  listCurriculumOfferings(): Promise<CurriculumOffering[]>;
  saveCurriculumOffering(c: CurriculumOffering): Promise<CurriculumOffering>;
  deleteCurriculumOffering(c: CurriculumOffering): Promise<void>;
  listSections(): Promise<Section[]>;
  saveSection(s: Section): Promise<Section>;
  deleteSection(s: Section): Promise<void>;
  listHouses(): Promise<House[]>;
  saveHouse(h: House): Promise<House>;
  listCohorts(): Promise<Cohort[]>;
  saveCohort(c: Cohort): Promise<Cohort>;
  listGradingScales(): Promise<GradingScale[]>;
  saveGradingScale(g: GradingScale): Promise<GradingScale>;
  deleteGradingScale(g: GradingScale): Promise<void>;
  listPromotionRules(): Promise<PromotionRule[]>;
  savePromotionRule(r: PromotionRule): Promise<PromotionRule>;
  deletePromotionRule(r: PromotionRule): Promise<void>;
  listCompletionRules(): Promise<CompletionRule[]>;
  saveCompletionRule(r: CompletionRule): Promise<CompletionRule>;
  listAcademicPolicies(): Promise<AcademicPolicy[]>;
  saveAcademicPolicy(p: AcademicPolicy): Promise<AcademicPolicy>;
  deleteAcademicPolicy(p: AcademicPolicy): Promise<void>;
  // M04
  listCampaigns(): Promise<Campaign[]>;
  saveCampaign(c: Campaign): Promise<Campaign>;
  deleteCampaign(c: Campaign): Promise<void>;
  listEnquiries(): Promise<Enquiry[]>;
  saveEnquiry(e: Enquiry): Promise<Enquiry>;
  deleteEnquiry(e: Enquiry): Promise<void>;
  listEnquiryInteractions(): Promise<EnquiryInteraction[]>;
  saveEnquiryInteraction(i: EnquiryInteraction): Promise<EnquiryInteraction>;
  deleteEnquiryInteraction(i: EnquiryInteraction): Promise<void>;
  listApplications(): Promise<Application[]>;
  saveApplication(a: Application): Promise<Application>;
  deleteApplication(a: Application): Promise<void>;
  listApplicationChoices(): Promise<ApplicationChoice[]>;
  saveApplicationChoice(c: ApplicationChoice): Promise<ApplicationChoice>;
  deleteApplicationChoice(c: ApplicationChoice): Promise<void>;
  listApplicationDocuments(): Promise<ApplicationDocument[]>;
  saveApplicationDocument(d: ApplicationDocument): Promise<ApplicationDocument>;
  deleteApplicationDocument(d: ApplicationDocument): Promise<void>;
  listEligibilityDecisions(): Promise<EligibilityDecision[]>;
  saveEligibilityDecision(d: EligibilityDecision): Promise<EligibilityDecision>;
  deleteEligibilityDecision(d: EligibilityDecision): Promise<void>;
  listSelectionEvents(): Promise<SelectionEvent[]>;
  saveSelectionEvent(e: SelectionEvent): Promise<SelectionEvent>;
  deleteSelectionEvent(e: SelectionEvent): Promise<void>;
  listSelectionScores(): Promise<SelectionScore[]>;
  saveSelectionScore(s: SelectionScore): Promise<SelectionScore>;
  deleteSelectionScore(s: SelectionScore): Promise<void>;
  listOffers(): Promise<Offer[]>;
  saveOffer(o: Offer): Promise<Offer>;
  deleteOffer(o: Offer): Promise<void>;
  listOfferAcceptances(): Promise<OfferAcceptance[]>;
  saveOfferAcceptance(a: OfferAcceptance): Promise<OfferAcceptance>;
  deleteOfferAcceptance(a: OfferAcceptance): Promise<void>;
  listConversionCases(): Promise<ConversionCase[]>;
  saveConversionCase(c: ConversionCase): Promise<ConversionCase>;
  deleteConversionCase(c: ConversionCase): Promise<void>;
  listConversionSteps(): Promise<ConversionStep[]>;
  saveConversionStep(s: ConversionStep): Promise<ConversionStep>;
  deleteConversionStep(s: ConversionStep): Promise<void>;
  // M05
  listPersons(): Promise<Person[]>;
  savePerson(p: Person): Promise<Person>;
  deletePerson(p: Person): Promise<void>;
  listStudents(): Promise<Student[]>;
  saveStudent(s: Student): Promise<Student>;
  deleteStudent(s: Student): Promise<void>;
  listGuardians(): Promise<Guardian[]>;
  saveGuardian(g: Guardian): Promise<Guardian>;
  deleteGuardian(g: Guardian): Promise<void>;
  listStudentGuardians(): Promise<StudentGuardian[]>;
  saveStudentGuardian(sg: StudentGuardian): Promise<StudentGuardian>;
  deleteStudentGuardian(sg: StudentGuardian): Promise<void>;
  listStudentDocuments(): Promise<StudentDocument[]>;
  saveStudentDocument(d: StudentDocument): Promise<StudentDocument>;
  deleteStudentDocument(d: StudentDocument): Promise<void>;
  listEnrolments(): Promise<Enrolment[]>;
  saveEnrolment(e: Enrolment): Promise<Enrolment>;
  deleteEnrolment(e: Enrolment): Promise<void>;
  listSubjectSelections(): Promise<SubjectSelection[]>;
  saveSubjectSelection(s: SubjectSelection): Promise<SubjectSelection>;
  deleteSubjectSelection(s: SubjectSelection): Promise<void>;
  listStudentMovements(): Promise<StudentMovement[]>;
  saveStudentMovement(m: StudentMovement): Promise<StudentMovement>;
  deleteStudentMovement(m: StudentMovement): Promise<void>;
  listProgressionAudits(): Promise<ProgressionAudit[]>;
  saveProgressionAudit(a: ProgressionAudit): Promise<ProgressionAudit>;
  deleteProgressionAudit(a: ProgressionAudit): Promise<void>;
  listStudentHolds(): Promise<StudentHold[]>;
  saveStudentHold(h: StudentHold): Promise<StudentHold>;
  deleteStudentHold(h: StudentHold): Promise<void>;
  listClearanceCases(): Promise<ClearanceCase[]>;
  saveClearanceCase(c: ClearanceCase): Promise<ClearanceCase>;
  deleteClearanceCase(c: ClearanceCase): Promise<void>;
  listClearanceResponses(): Promise<ClearanceResponse[]>;
  saveClearanceResponse(r: ClearanceResponse): Promise<ClearanceResponse>;
  deleteClearanceResponse(r: ClearanceResponse): Promise<void>;
  listIdentityCards(): Promise<IdentityCard[]>;
  saveIdentityCard(c: IdentityCard): Promise<IdentityCard>;
  deleteIdentityCard(c: IdentityCard): Promise<void>;
  // M06
  listCurriculumMaps(): Promise<CurriculumMap[]>;
  saveCurriculumMap(c: CurriculumMap): Promise<CurriculumMap>;
  deleteCurriculumMap(c: CurriculumMap): Promise<void>;
  listLearningOutcomes(): Promise<LearningOutcome[]>;
  saveLearningOutcome(o: LearningOutcome): Promise<LearningOutcome>;
  deleteLearningOutcome(o: LearningOutcome): Promise<void>;
  listSyllabusPlans(): Promise<SyllabusPlan[]>;
  saveSyllabusPlan(s: SyllabusPlan): Promise<SyllabusPlan>;
  deleteSyllabusPlan(s: SyllabusPlan): Promise<void>;
  listContentPlanItems(): Promise<ContentPlanItem[]>;
  saveContentPlanItem(i: ContentPlanItem): Promise<ContentPlanItem>;
  deleteContentPlanItem(i: ContentPlanItem): Promise<void>;
  listTeachingAssignments(): Promise<TeachingAssignment[]>;
  saveTeachingAssignment(t: TeachingAssignment): Promise<TeachingAssignment>;
  deleteTeachingAssignment(t: TeachingAssignment): Promise<void>;
  listLessonPlans(): Promise<LessonPlan[]>;
  saveLessonPlan(l: LessonPlan): Promise<LessonPlan>;
  deleteLessonPlan(l: LessonPlan): Promise<void>;
  listCoverageEntries(): Promise<CoverageEntry[]>;
  saveCoverageEntry(c: CoverageEntry): Promise<CoverageEntry>;
  deleteCoverageEntry(c: CoverageEntry): Promise<void>;
  listWorkloadAllocations(): Promise<WorkloadAllocation[]>;
  saveWorkloadAllocation(w: WorkloadAllocation): Promise<WorkloadAllocation>;
  deleteWorkloadAllocation(w: WorkloadAllocation): Promise<void>;
  listQualityReviews(): Promise<QualityReview[]>;
  saveQualityReview(q: QualityReview): Promise<QualityReview>;
  deleteQualityReview(q: QualityReview): Promise<void>;
  listQualityEvidences(): Promise<QualityEvidence[]>;
  saveQualityEvidence(e: QualityEvidence): Promise<QualityEvidence>;
  deleteQualityEvidence(e: QualityEvidence): Promise<void>;
  listModerationReviews(): Promise<ModerationReview[]>;
  saveModerationReview(m: ModerationReview): Promise<ModerationReview>;
  deleteModerationReview(m: ModerationReview): Promise<void>;
  listReviewActions(): Promise<ReviewAction[]>;
  saveReviewAction(a: ReviewAction): Promise<ReviewAction>;
  deleteReviewAction(a: ReviewAction): Promise<void>;
  // M07
  listTimetables(): Promise<Timetable[]>;
  saveTimetable(t: Timetable): Promise<Timetable>;
  deleteTimetable(t: Timetable): Promise<void>;
  listTimetableSlots(): Promise<TimetableSlot[]>;
  saveTimetableSlot(s: TimetableSlot): Promise<TimetableSlot>;
  deleteTimetableSlot(s: TimetableSlot): Promise<void>;
  listTimetableAssignments(): Promise<TimetableAssignment[]>;
  saveTimetableAssignment(a: TimetableAssignment): Promise<TimetableAssignment>;
  deleteTimetableAssignment(a: TimetableAssignment): Promise<void>;
  listSubstitutions(): Promise<Substitution[]>;
  saveSubstitution(s: Substitution): Promise<Substitution>;
  deleteSubstitution(s: Substitution): Promise<void>;
  listAttendanceSessions(): Promise<AttendanceSession[]>;
  saveAttendanceSession(s: AttendanceSession): Promise<AttendanceSession>;
  deleteAttendanceSession(s: AttendanceSession): Promise<void>;
  listStudentAttendances(): Promise<StudentAttendance[]>;
  saveStudentAttendance(s: StudentAttendance): Promise<StudentAttendance>;
  deleteStudentAttendance(s: StudentAttendance): Promise<void>;
  listAttendanceCorrections(): Promise<AttendanceCorrection[]>;
  saveAttendanceCorrection(c: AttendanceCorrection): Promise<AttendanceCorrection>;
  deleteAttendanceCorrection(c: AttendanceCorrection): Promise<void>;
  listAttendanceAlerts(): Promise<AttendanceAlert[]>;
  saveAttendanceAlert(a: AttendanceAlert): Promise<AttendanceAlert>;
  deleteAttendanceAlert(a: AttendanceAlert): Promise<void>;
  listShifts(): Promise<Shift[]>;
  saveShift(s: Shift): Promise<Shift>;
  deleteShift(s: Shift): Promise<void>;
  listStaffRosters(): Promise<StaffRoster[]>;
  saveStaffRoster(r: StaffRoster): Promise<StaffRoster>;
  deleteStaffRoster(r: StaffRoster): Promise<void>;
  listTimeEntries(): Promise<TimeEntry[]>;
  saveTimeEntry(t: TimeEntry): Promise<TimeEntry>;
  deleteTimeEntry(t: TimeEntry): Promise<void>;
  listTimeAdjustments(): Promise<TimeAdjustment[]>;
  saveTimeAdjustment(a: TimeAdjustment): Promise<TimeAdjustment>;
  deleteTimeAdjustment(a: TimeAdjustment): Promise<void>;
  // M08
  listAssessments(): Promise<Assessment[]>;
  saveAssessment(a: Assessment): Promise<Assessment>;
  deleteAssessment(a: Assessment): Promise<void>;
  listAssessmentComponents(): Promise<AssessmentComponent[]>;
  saveAssessmentComponent(c: AssessmentComponent): Promise<AssessmentComponent>;
  deleteAssessmentComponent(c: AssessmentComponent): Promise<void>;
  listQuestions(): Promise<Question[]>;
  saveQuestion(q: Question): Promise<Question>;
  deleteQuestion(q: Question): Promise<void>;
  listExamPapers(): Promise<ExamPaper[]>;
  saveExamPaper(p: ExamPaper): Promise<ExamPaper>;
  deleteExamPaper(p: ExamPaper): Promise<void>;
  listExams(): Promise<Exam[]>;
  saveExam(e: Exam): Promise<Exam>;
  deleteExam(e: Exam): Promise<void>;
  listExamRegistrations(): Promise<ExamRegistration[]>;
  saveExamRegistration(r: ExamRegistration): Promise<ExamRegistration>;
  deleteExamRegistration(r: ExamRegistration): Promise<void>;
  listExamRooms(): Promise<ExamRoom[]>;
  saveExamRoom(r: ExamRoom): Promise<ExamRoom>;
  deleteExamRoom(r: ExamRoom): Promise<void>;
  listSeatAllocations(): Promise<SeatAllocation[]>;
  saveSeatAllocation(s: SeatAllocation): Promise<SeatAllocation>;
  deleteSeatAllocation(s: SeatAllocation): Promise<void>;
  listInvigilationDuties(): Promise<InvigilationDuty[]>;
  saveInvigilationDuty(d: InvigilationDuty): Promise<InvigilationDuty>;
  deleteInvigilationDuty(d: InvigilationDuty): Promise<void>;
  listMarkEntries(): Promise<MarkEntry[]>;
  saveMarkEntry(m: MarkEntry): Promise<MarkEntry>;
  deleteMarkEntry(m: MarkEntry): Promise<void>;
  listModerationRecords(): Promise<ModerationRecord[]>;
  saveModerationRecord(m: ModerationRecord): Promise<ModerationRecord>;
  deleteModerationRecord(m: ModerationRecord): Promise<void>;
  listPracticalExams(): Promise<PracticalExam[]>;
  savePracticalExam(p: PracticalExam): Promise<PracticalExam>;
  deletePracticalExam(p: PracticalExam): Promise<void>;
  listIntegrityCases(): Promise<IntegrityCase[]>;
  saveIntegrityCase(c: IntegrityCase): Promise<IntegrityCase>;
  deleteIntegrityCase(c: IntegrityCase): Promise<void>;
  listRecheckRequests(): Promise<RecheckRequest[]>;
  saveRecheckRequest(r: RecheckRequest): Promise<RecheckRequest>;
  deleteRecheckRequest(r: RecheckRequest): Promise<void>;
  // M09
  listResultRuns(): Promise<ResultRun[]>;
  saveResultRun(r: ResultRun): Promise<ResultRun>;
  deleteResultRun(r: ResultRun): Promise<void>;
  listResultLines(): Promise<ResultLine[]>;
  saveResultLine(l: ResultLine): Promise<ResultLine>;
  deleteResultLine(l: ResultLine): Promise<void>;
  listResultPublications(): Promise<ResultPublication[]>;
  saveResultPublication(p: ResultPublication): Promise<ResultPublication>;
  deleteResultPublication(p: ResultPublication): Promise<void>;
  listResultCorrections(): Promise<ResultCorrection[]>;
  saveResultCorrection(c: ResultCorrection): Promise<ResultCorrection>;
  deleteResultCorrection(c: ResultCorrection): Promise<void>;
  listMarksheets(): Promise<Marksheet[]>;
  saveMarksheet(m: Marksheet): Promise<Marksheet>;
  deleteMarksheet(m: Marksheet): Promise<void>;
  listTranscripts(): Promise<Transcript[]>;
  saveTranscript(t: Transcript): Promise<Transcript>;
  deleteTranscript(t: Transcript): Promise<void>;
  listCertificates(): Promise<Certificate[]>;
  saveCertificate(c: Certificate): Promise<Certificate>;
  deleteCertificate(c: Certificate): Promise<void>;
  listCertificateRequests(): Promise<CertificateRequest[]>;
  saveCertificateRequest(r: CertificateRequest): Promise<CertificateRequest>;
  deleteCertificateRequest(r: CertificateRequest): Promise<void>;
  listDigitalCredentials(): Promise<DigitalCredential[]>;
  saveDigitalCredential(d: DigitalCredential): Promise<DigitalCredential>;
  deleteDigitalCredential(d: DigitalCredential): Promise<void>;
  listCompletionRecords(): Promise<CompletionRecord[]>;
  saveCompletionRecord(c: CompletionRecord): Promise<CompletionRecord>;
  deleteCompletionRecord(c: CompletionRecord): Promise<void>;
  // M11
  listPortalAnnouncements(): Promise<PortalAnnouncement[]>;
  savePortalAnnouncement(a: PortalAnnouncement): Promise<PortalAnnouncement>;
  deletePortalAnnouncement(a: PortalAnnouncement): Promise<void>;
  listPortalAccessLogs(): Promise<PortalAccessLog[]>;
  savePortalAccessLog(l: PortalAccessLog): Promise<PortalAccessLog>;
  deletePortalAccessLog(l: PortalAccessLog): Promise<void>;
  listKioskSessions(): Promise<KioskSession[]>;
  saveKioskSession(k: KioskSession): Promise<KioskSession>;
  deleteKioskSession(k: KioskSession): Promise<void>;
  listMobileDevices(): Promise<MobileDevice[]>;
  saveMobileDevice(d: MobileDevice): Promise<MobileDevice>;
  deleteMobileDevice(d: MobileDevice): Promise<void>;
  listOfflineSyncLogs(): Promise<OfflineSyncLog[]>;
  saveOfflineSyncLog(l: OfflineSyncLog): Promise<OfflineSyncLog>;
  deleteOfflineSyncLog(l: OfflineSyncLog): Promise<void>;
  listAccessibilityProfiles(): Promise<AccessibilityProfile[]>;
  saveAccessibilityProfile(a: AccessibilityProfile): Promise<AccessibilityProfile>;
  deleteAccessibilityProfile(a: AccessibilityProfile): Promise<void>;
  listPortalTickets(): Promise<PortalTicket[]>;
  savePortalTicket(t: PortalTicket): Promise<PortalTicket>;
  deletePortalTicket(t: PortalTicket): Promise<void>;
  listStudentPortalProfiles(): Promise<StudentPortalProfile[]>;
  saveStudentPortalProfile(p: StudentPortalProfile): Promise<StudentPortalProfile>;
  deleteStudentPortalProfile(p: StudentPortalProfile): Promise<void>;
  listParentPortalProfiles(): Promise<ParentPortalProfile[]>;
  saveParentPortalProfile(p: ParentPortalProfile): Promise<ParentPortalProfile>;
  deleteParentPortalProfile(p: ParentPortalProfile): Promise<void>;
  listTeacherPortalProfiles(): Promise<TeacherPortalProfile[]>;
  saveTeacherPortalProfile(p: TeacherPortalProfile): Promise<TeacherPortalProfile>;
  deleteTeacherPortalProfile(p: TeacherPortalProfile): Promise<void>;
  listManagementDashboards(): Promise<ManagementDashboard[]>;
  saveManagementDashboard(d: ManagementDashboard): Promise<ManagementDashboard>;
  deleteManagementDashboard(d: ManagementDashboard): Promise<void>;
  // M12
  listFiscalYears(): Promise<FiscalYear[]>;
  saveFiscalYear(f: FiscalYear): Promise<FiscalYear>;
  deleteFiscalYear(f: FiscalYear): Promise<void>;
  listChartOfAccounts(): Promise<ChartOfAccount[]>;
  saveChartOfAccount(c: ChartOfAccount): Promise<ChartOfAccount>;
  deleteChartOfAccount(c: ChartOfAccount): Promise<void>;
  listJournalEntries(): Promise<JournalEntry[]>;
  saveJournalEntry(j: JournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(j: JournalEntry): Promise<void>;
  listFeeStructures(): Promise<FeeStructure[]>;
  saveFeeStructure(f: FeeStructure): Promise<FeeStructure>;
  deleteFeeStructure(f: FeeStructure): Promise<void>;
  listFeeAssignments(): Promise<FeeAssignment[]>;
  saveFeeAssignment(f: FeeAssignment): Promise<FeeAssignment>;
  deleteFeeAssignment(f: FeeAssignment): Promise<void>;
  listInvoices(): Promise<Invoice[]>;
  saveInvoice(i: Invoice): Promise<Invoice>;
  deleteInvoice(i: Invoice): Promise<void>;
  listPayments(): Promise<Payment[]>;
  savePayment(p: Payment): Promise<Payment>;
  deletePayment(p: Payment): Promise<void>;
  listCreditNotes(): Promise<CreditNote[]>;
  saveCreditNote(c: CreditNote): Promise<CreditNote>;
  deleteCreditNote(c: CreditNote): Promise<void>;
  listVendorBills(): Promise<VendorBill[]>;
  saveVendorBill(v: VendorBill): Promise<VendorBill>;
  deleteVendorBill(v: VendorBill): Promise<void>;
  listExpenseClaims(): Promise<ExpenseClaim[]>;
  saveExpenseClaim(e: ExpenseClaim): Promise<ExpenseClaim>;
  deleteExpenseClaim(e: ExpenseClaim): Promise<void>;
  listRecurringJournals(): Promise<RecurringJournal[]>;
  saveRecurringJournal(r: RecurringJournal): Promise<RecurringJournal>;
  deleteRecurringJournal(r: RecurringJournal): Promise<void>;
  listDisbursementEntries(): Promise<DisbursementEntry[]>;
  saveDisbursementEntry(d: DisbursementEntry): Promise<DisbursementEntry>;
  deleteDisbursementEntry(d: DisbursementEntry): Promise<void>;
  listBankReconciliations(): Promise<BankReconciliation[]>;
  saveBankReconciliation(b: BankReconciliation): Promise<BankReconciliation>;
  deleteBankReconciliation(b: BankReconciliation): Promise<void>;
  listBankReconciliationEntries(): Promise<BankReconciliationEntry[]>;
  saveBankReconciliationEntry(e: BankReconciliationEntry): Promise<BankReconciliationEntry>;
  deleteBankReconciliationEntry(e: BankReconciliationEntry): Promise<void>;
  listBankAccounts(): Promise<BankAccount[]>;
  saveBankAccount(b: BankAccount): Promise<BankAccount>;
  deleteBankAccount(b: BankAccount): Promise<void>;
  listBudgets(): Promise<Budget[]>;
  saveBudget(b: Budget): Promise<Budget>;
  deleteBudget(b: Budget): Promise<void>;
  listAccountsReceivable(): Promise<AccountsReceivable[]>;
  saveAccountsReceivable(a: AccountsReceivable): Promise<AccountsReceivable>;
  deleteAccountsReceivable(a: AccountsReceivable): Promise<void>;
  listScholarshipSchemes(): Promise<ScholarshipScheme[]>;
  saveScholarshipScheme(s: ScholarshipScheme): Promise<ScholarshipScheme>;
  deleteScholarshipScheme(s: ScholarshipScheme): Promise<void>;
  listOnlinePaymentTransactions(): Promise<OnlinePaymentTransaction[]>;
  saveOnlinePaymentTransaction(p: OnlinePaymentTransaction): Promise<OnlinePaymentTransaction>;
  deleteOnlinePaymentTransaction(p: OnlinePaymentTransaction): Promise<void>;
  listRefundRecords(): Promise<RefundRecord[]>;
  saveRefundRecord(r: RefundRecord): Promise<RefundRecord>;
  deleteRefundRecord(r: RefundRecord): Promise<void>;
  listWriteOffEntries(): Promise<WriteOffEntry[]>;
  saveWriteOffEntry(w: WriteOffEntry): Promise<WriteOffEntry>;
  deleteWriteOffEntry(w: WriteOffEntry): Promise<void>;
  listDunningNotices(): Promise<DunningNotice[]>;
  saveDunningNotice(d: DunningNotice): Promise<DunningNotice>;
  deleteDunningNotice(d: DunningNotice): Promise<void>;
  listCommitmentRecords(): Promise<CommitmentRecord[]>;
  saveCommitmentRecord(c: CommitmentRecord): Promise<CommitmentRecord>;
  deleteCommitmentRecord(c: CommitmentRecord): Promise<void>;
  listTaxCodes(): Promise<TaxCode[]>;
  saveTaxCode(t: TaxCode): Promise<TaxCode>;
  deleteTaxCode(t: TaxCode): Promise<void>;
  listAccrualEntries(): Promise<AccrualEntry[]>;
  saveAccrualEntry(a: AccrualEntry): Promise<AccrualEntry>;
  deleteAccrualEntry(a: AccrualEntry): Promise<void>;
  listFunds(): Promise<Fund[]>;
  saveFund(f: Fund): Promise<Fund>;
  deleteFund(f: Fund): Promise<void>;
  listPeriodCloseChecklists(): Promise<PeriodCloseChecklist[]>;
  savePeriodCloseChecklist(p: PeriodCloseChecklist): Promise<PeriodCloseChecklist>;
  deletePeriodCloseChecklist(p: PeriodCloseChecklist): Promise<void>;
  listFinancialStatements(): Promise<FinancialStatement[]>;
  saveFinancialStatement(f: FinancialStatement): Promise<FinancialStatement>;
  deleteFinancialStatement(f: FinancialStatement): Promise<void>;
  // M13
  listStaffProfiles(): Promise<StaffProfile[]>;
  saveStaffProfile(s: StaffProfile): Promise<StaffProfile>;
  deleteStaffProfile(s: StaffProfile): Promise<void>;
  listPositions(): Promise<Position[]>;
  savePosition(p: Position): Promise<Position>;
  deletePosition(p: Position): Promise<void>;
  listRecruitments(): Promise<Recruitment[]>;
  saveRecruitment(r: Recruitment): Promise<Recruitment>;
  deleteRecruitment(r: Recruitment): Promise<void>;
  listLeaveRequests(): Promise<LeaveRequest[]>;
  saveLeaveRequest(l: LeaveRequest): Promise<LeaveRequest>;
  deleteLeaveRequest(l: LeaveRequest): Promise<void>;
  listPerformanceReviews(): Promise<PerformanceReview[]>;
  savePerformanceReview(r: PerformanceReview): Promise<PerformanceReview>;
  deletePerformanceReview(r: PerformanceReview): Promise<void>;
  listCompensations(): Promise<Compensation[]>;
  saveCompensation(c: Compensation): Promise<Compensation>;
  deleteCompensation(c: Compensation): Promise<void>;
  listPayrollRuns(): Promise<PayrollRun[]>;
  savePayrollRun(r: PayrollRun): Promise<PayrollRun>;
  deletePayrollRun(r: PayrollRun): Promise<void>;
  listPayslips(): Promise<Payslip[]>;
  savePayslip(p: Payslip): Promise<Payslip>;
  deletePayslip(p: Payslip): Promise<void>;
  listSeparations(): Promise<Separation[]>;
  saveSeparation(s: Separation): Promise<Separation>;
  deleteSeparation(s: Separation): Promise<void>;
  listStaffContracts(): Promise<StaffContract[]>;
  saveStaffContract(c: StaffContract): Promise<StaffContract>;
  deleteStaffContract(c: StaffContract): Promise<void>;
  // M16
  listLibraryResources(): Promise<LibraryResource[]>;
  saveLibraryResource(r: LibraryResource): Promise<LibraryResource>;
  deleteLibraryResource(r: LibraryResource): Promise<void>;
  listLibraryHoldings(): Promise<LibraryHolding[]>;
  saveLibraryHolding(h: LibraryHolding): Promise<LibraryHolding>;
  deleteLibraryHolding(h: LibraryHolding): Promise<void>;
  listLibraryMembers(): Promise<LibraryMember[]>;
  saveLibraryMember(m: LibraryMember): Promise<LibraryMember>;
  deleteLibraryMember(m: LibraryMember): Promise<void>;
  listLibraryLoans(): Promise<LibraryLoan[]>;
  saveLibraryLoan(l: LibraryLoan): Promise<LibraryLoan>;
  deleteLibraryLoan(l: LibraryLoan): Promise<void>;
  listLibraryReservations(): Promise<LibraryReservation[]>;
  saveLibraryReservation(r: LibraryReservation): Promise<LibraryReservation>;
  deleteLibraryReservation(r: LibraryReservation): Promise<void>;
  listLibraryAcquisitions(): Promise<LibraryAcquisition[]>;
  saveLibraryAcquisition(a: LibraryAcquisition): Promise<LibraryAcquisition>;
  deleteLibraryAcquisition(a: LibraryAcquisition): Promise<void>;
  listDigitalResources(): Promise<DigitalResource[]>;
  saveDigitalResource(d: DigitalResource): Promise<DigitalResource>;
  deleteDigitalResource(d: DigitalResource): Promise<void>;
  // M17
  listVehicles(): Promise<Vehicle[]>;
  saveVehicle(v: Vehicle): Promise<Vehicle>;
  deleteVehicle(v: Vehicle): Promise<void>;
  listTransportRoutes(): Promise<TransportRoute[]>;
  saveTransportRoute(r: TransportRoute): Promise<TransportRoute>;
  deleteTransportRoute(r: TransportRoute): Promise<void>;
  listBusStops(): Promise<BusStop[]>;
  saveBusStop(b: BusStop): Promise<BusStop>;
  deleteBusStop(b: BusStop): Promise<void>;
  listRouteSchedules(): Promise<RouteSchedule[]>;
  saveRouteSchedule(r: RouteSchedule): Promise<RouteSchedule>;
  deleteRouteSchedule(r: RouteSchedule): Promise<void>;
  listRiderAssignments(): Promise<RiderAssignment[]>;
  saveRiderAssignment(r: RiderAssignment): Promise<RiderAssignment>;
  deleteRiderAssignment(r: RiderAssignment): Promise<void>;
  listBoardingLogs(): Promise<BoardingLog[]>;
  saveBoardingLog(b: BoardingLog): Promise<BoardingLog>;
  deleteBoardingLog(b: BoardingLog): Promise<void>;
  listGpsTracks(): Promise<GpsTrack[]>;
  saveGpsTrack(g: GpsTrack): Promise<GpsTrack>;
  deleteGpsTrack(g: GpsTrack): Promise<void>;
  listVehicleMaintenance(): Promise<VehicleMaintenance[]>;
  saveVehicleMaintenance(v: VehicleMaintenance): Promise<VehicleMaintenance>;
  deleteVehicleMaintenance(v: VehicleMaintenance): Promise<void>;
  // M19
  listHealthProfiles(): Promise<HealthProfile[]>;
  saveHealthProfile(h: HealthProfile): Promise<HealthProfile>;
  deleteHealthProfile(h: HealthProfile): Promise<void>;
  listClinicVisits(): Promise<ClinicVisit[]>;
  saveClinicVisit(c: ClinicVisit): Promise<ClinicVisit>;
  deleteClinicVisit(c: ClinicVisit): Promise<void>;
  listCounselingCases(): Promise<CounselingCase[]>;
  saveCounselingCase(c: CounselingCase): Promise<CounselingCase>;
  deleteCounselingCase(c: CounselingCase): Promise<void>;
  listSupportNeeds(): Promise<SupportNeed[]>;
  saveSupportNeed(s: SupportNeed): Promise<SupportNeed>;
  deleteSupportNeed(s: SupportNeed): Promise<void>;
  listAccommodationPlans(): Promise<AccommodationPlan[]>;
  saveAccommodationPlan(a: AccommodationPlan): Promise<AccommodationPlan>;
  deleteAccommodationPlan(a: AccommodationPlan): Promise<void>;
  listConductIncidents(): Promise<ConductIncident[]>;
  saveConductIncident(c: ConductIncident): Promise<ConductIncident>;
  deleteConductIncident(c: ConductIncident): Promise<void>;
  listConductActions(): Promise<ConductAction[]>;
  saveConductAction(c: ConductAction): Promise<ConductAction>;
  deleteConductAction(c: ConductAction): Promise<void>;
  listGrievances(): Promise<Grievance[]>;
  saveGrievance(g: Grievance): Promise<Grievance>;
  deleteGrievance(g: Grievance): Promise<void>;
  listAdvisingAssignments(): Promise<AdvisingAssignment[]>;
  saveAdvisingAssignment(a: AdvisingAssignment): Promise<AdvisingAssignment>;
  deleteAdvisingAssignment(a: AdvisingAssignment): Promise<void>;
  listInterventionPlans(): Promise<InterventionPlan[]>;
  saveInterventionPlan(i: InterventionPlan): Promise<InterventionPlan>;
  deleteInterventionPlan(i: InterventionPlan): Promise<void>;
  // M20
  listCommunityEvents(): Promise<CommunityEvent[]>;
  saveCommunityEvent(e: CommunityEvent): Promise<CommunityEvent>;
  deleteCommunityEvent(e: CommunityEvent): Promise<void>;
  listEventRegistrations(): Promise<EventRegistration[]>;
  saveEventRegistration(e: EventRegistration): Promise<EventRegistration>;
  deleteEventRegistration(e: EventRegistration): Promise<void>;
  listActivityGroups(): Promise<ActivityGroup[]>;
  saveActivityGroup(a: ActivityGroup): Promise<ActivityGroup>;
  deleteActivityGroup(a: ActivityGroup): Promise<void>;
  listGroupMemberships(): Promise<GroupMembership[]>;
  saveGroupMembership(g: GroupMembership): Promise<GroupMembership>;
  deleteGroupMembership(g: GroupMembership): Promise<void>;
  listCompetitions(): Promise<Competition[]>;
  saveCompetition(c: Competition): Promise<Competition>;
  deleteCompetition(c: Competition): Promise<void>;
  listCompetitionEntries(): Promise<CompetitionEntry[]>;
  saveCompetitionEntry(e: CompetitionEntry): Promise<CompetitionEntry>;
  deleteCompetitionEntry(e: CompetitionEntry): Promise<void>;
  listCompetitionResults(): Promise<CompetitionResult[]>;
  saveCompetitionResult(r: CompetitionResult): Promise<CompetitionResult>;
  deleteCompetitionResult(r: CompetitionResult): Promise<void>;
  listTrips(): Promise<Trip[]>;
  saveTrip(t: Trip): Promise<Trip>;
  deleteTrip(t: Trip): Promise<void>;
  listTripParticipants(): Promise<TripParticipant[]>;
  saveTripParticipant(t: TripParticipant): Promise<TripParticipant>;
  deleteTripParticipant(t: TripParticipant): Promise<void>;
  listPtmEvents(): Promise<PTMEvent[]>;
  savePtmEvent(p: PTMEvent): Promise<PTMEvent>;
  deletePtmEvent(p: PTMEvent): Promise<void>;
  listPtmBookings(): Promise<PTMBooking[]>;
  savePtmBooking(p: PTMBooking): Promise<PTMBooking>;
  deletePtmBooking(p: PTMBooking): Promise<void>;
  listFundraisingCampaigns(): Promise<FundraisingCampaign[]>;
  saveFundraisingCampaign(f: FundraisingCampaign): Promise<FundraisingCampaign>;
  deleteFundraisingCampaign(f: FundraisingCampaign): Promise<void>;
  listDonations(): Promise<Donation[]>;
  saveDonation(d: Donation): Promise<Donation>;
  deleteDonation(d: Donation): Promise<void>;
  // M21
  listSubjectCombinationRules(): Promise<SubjectCombinationRule[]>;
  saveSubjectCombinationRule(s: SubjectCombinationRule): Promise<SubjectCombinationRule>;
  deleteSubjectCombinationRule(s: SubjectCombinationRule): Promise<void>;
  listStudentSubjectPlans(): Promise<StudentSubjectPlan[]>;
  saveStudentSubjectPlan(s: StudentSubjectPlan): Promise<StudentSubjectPlan>;
  deleteStudentSubjectPlan(s: StudentSubjectPlan): Promise<void>;
  listBoardRegistrations(): Promise<BoardRegistration[]>;
  saveBoardRegistration(b: BoardRegistration): Promise<BoardRegistration>;
  deleteBoardRegistration(b: BoardRegistration): Promise<void>;
  listReadinessChecks(): Promise<ReadinessCheck[]>;
  saveReadinessCheck(r: ReadinessCheck): Promise<ReadinessCheck>;
  deleteReadinessCheck(r: ReadinessCheck): Promise<void>;
  listInternalAssessmentSnapshots(): Promise<InternalAssessmentSnapshot[]>;
  saveInternalAssessmentSnapshot(i: InternalAssessmentSnapshot): Promise<InternalAssessmentSnapshot>;
  deleteInternalAssessmentSnapshot(i: InternalAssessmentSnapshot): Promise<void>;
  listGuidanceProfiles(): Promise<GuidanceProfile[]>;
  saveGuidanceProfile(g: GuidanceProfile): Promise<GuidanceProfile>;
  deleteGuidanceProfile(g: GuidanceProfile): Promise<void>;
  listGuidanceSessions(): Promise<GuidanceSession[]>;
  saveGuidanceSession(g: GuidanceSession): Promise<GuidanceSession>;
  deleteGuidanceSession(g: GuidanceSession): Promise<void>;
  listExternalApplications(): Promise<ExternalApplication[]>;
  saveExternalApplication(e: ExternalApplication): Promise<ExternalApplication>;
  deleteExternalApplication(e: ExternalApplication): Promise<void>;
  listSchoolExitCases(): Promise<SchoolExitCase[]>;
  saveSchoolExitCase(s: SchoolExitCase): Promise<SchoolExitCase>;
  deleteSchoolExitCase(s: SchoolExitCase): Promise<void>;
  listMigrationDocuments(): Promise<MigrationDocument[]>;
  saveMigrationDocument(m: MigrationDocument): Promise<MigrationDocument>;
  deleteMigrationDocument(m: MigrationDocument): Promise<void>;
  listFormerStudents(): Promise<FormerStudent[]>;
  saveFormerStudent(f: FormerStudent): Promise<FormerStudent>;
  deleteFormerStudent(f: FormerStudent): Promise<void>;
  listAlumniPreferences(): Promise<AlumniPreference[]>;
  saveAlumniPreference(a: AlumniPreference): Promise<AlumniPreference>;
  deleteAlumniPreference(a: AlumniPreference): Promise<void>;
  // M22
  listServiceRequests(): Promise<ServiceRequest[]>;
  saveServiceRequest(s: ServiceRequest): Promise<ServiceRequest>;
  deleteServiceRequest(s: ServiceRequest): Promise<void>;
  listWorkOrders(): Promise<WorkOrder[]>;
  saveWorkOrder(w: WorkOrder): Promise<WorkOrder>;
  deleteWorkOrder(w: WorkOrder): Promise<void>;
  listWorkOrderActivities(): Promise<WorkOrderActivity[]>;
  saveWorkOrderActivity(a: WorkOrderActivity): Promise<WorkOrderActivity>;
  deleteWorkOrderActivity(a: WorkOrderActivity): Promise<void>;
  listMaintenancePlans(): Promise<MaintenancePlan[]>;
  saveMaintenancePlan(m: MaintenancePlan): Promise<MaintenancePlan>;
  deleteMaintenancePlan(m: MaintenancePlan): Promise<void>;
  listBookings(): Promise<Booking[]>;
  saveBooking(b: Booking): Promise<Booking>;
  deleteBooking(b: Booking): Promise<void>;
  listBookingAttendees(): Promise<BookingAttendee[]>;
  saveBookingAttendee(a: BookingAttendee): Promise<BookingAttendee>;
  deleteBookingAttendee(a: BookingAttendee): Promise<void>;
  listSafetyIncidents(): Promise<SafetyIncident[]>;
  saveSafetyIncident(s: SafetyIncident): Promise<SafetyIncident>;
  deleteSafetyIncident(s: SafetyIncident): Promise<void>;
  listEmergencyActions(): Promise<EmergencyAction[]>;
  saveEmergencyAction(e: EmergencyAction): Promise<EmergencyAction>;
  deleteEmergencyAction(e: EmergencyAction): Promise<void>;
  listVisitorVisits(): Promise<VisitorVisit[]>;
  saveVisitorVisit(v: VisitorVisit): Promise<VisitorVisit>;
  deleteVisitorVisit(v: VisitorVisit): Promise<void>;
  listAccessCredentials(): Promise<AccessCredential[]>;
  saveAccessCredential(a: AccessCredential): Promise<AccessCredential>;
  deleteAccessCredential(a: AccessCredential): Promise<void>;
  listKeyIssues(): Promise<KeyIssue[]>;
  saveKeyIssue(k: KeyIssue): Promise<KeyIssue>;
  deleteKeyIssue(k: KeyIssue): Promise<void>;
  listUtilityMeters(): Promise<UtilityMeter[]>;
  saveUtilityMeter(u: UtilityMeter): Promise<UtilityMeter>;
  deleteUtilityMeter(u: UtilityMeter): Promise<void>;
  listMeterReadings(): Promise<MeterReading[]>;
  saveMeterReading(m: MeterReading): Promise<MeterReading>;
  deleteMeterReading(m: MeterReading): Promise<void>;
  listContinuityPlans(): Promise<ContinuityPlan[]>;
  saveContinuityPlan(c: ContinuityPlan): Promise<ContinuityPlan>;
  deleteContinuityPlan(c: ContinuityPlan): Promise<void>;
  listContinuityExercises(): Promise<ContinuityExercise[]>;
  saveContinuityExercise(e: ContinuityExercise): Promise<ContinuityExercise>;
  deleteContinuityExercise(e: ContinuityExercise): Promise<void>;
  // M23
  listAnnouncements(): Promise<Announcement[]>;
  saveAnnouncement(a: Announcement): Promise<Announcement>;
  deleteAnnouncement(a: Announcement): Promise<void>;
  listMessages(): Promise<Message[]>;
  saveMessage(m: Message): Promise<Message>;
  deleteMessage(m: Message): Promise<void>;
  listDeliveryAttempts(): Promise<DeliveryAttempt[]>;
  saveDeliveryAttempt(d: DeliveryAttempt): Promise<DeliveryAttempt>;
  deleteDeliveryAttempt(d: DeliveryAttempt): Promise<void>;
  listNotificationPreferences(): Promise<NotificationPreference[]>;
  saveNotificationPreference(n: NotificationPreference): Promise<NotificationPreference>;
  deleteNotificationPreference(n: NotificationPreference): Promise<void>;
  listConversations(): Promise<Conversation[]>;
  saveConversation(c: Conversation): Promise<Conversation>;
  deleteConversation(c: Conversation): Promise<void>;
  listConversationParticipants(): Promise<ConversationParticipant[]>;
  saveConversationParticipant(cp: ConversationParticipant): Promise<ConversationParticipant>;
  deleteConversationParticipant(cp: ConversationParticipant): Promise<void>;
  listConversationMessages(): Promise<ConversationMessage[]>;
  saveConversationMessage(cm: ConversationMessage): Promise<ConversationMessage>;
  deleteConversationMessage(cm: ConversationMessage): Promise<void>;
  listWorkflowDefinitions(): Promise<WorkflowDefinition[]>;
  saveWorkflowDefinition(w: WorkflowDefinition): Promise<WorkflowDefinition>;
  deleteWorkflowDefinition(w: WorkflowDefinition): Promise<void>;
  listWorkflowInstances(): Promise<WorkflowInstance[]>;
  saveWorkflowInstance(w: WorkflowInstance): Promise<WorkflowInstance>;
  deleteWorkflowInstance(w: WorkflowInstance): Promise<void>;
  listWorkflowTasks(): Promise<WorkflowTask[]>;
  saveWorkflowTask(w: WorkflowTask): Promise<WorkflowTask>;
  deleteWorkflowTask(w: WorkflowTask): Promise<void>;
  listWorkflowTransitions(): Promise<WorkflowTransition[]>;
  saveWorkflowTransition(w: WorkflowTransition): Promise<WorkflowTransition>;
  deleteWorkflowTransition(w: WorkflowTransition): Promise<void>;
  listServiceCases(): Promise<ServiceCase[]>;
  saveServiceCase(s: ServiceCase): Promise<ServiceCase>;
  deleteServiceCase(s: ServiceCase): Promise<void>;
  listCaseActivities(): Promise<CaseActivity[]>;
  saveCaseActivity(c: CaseActivity): Promise<CaseActivity>;
  deleteCaseActivity(c: CaseActivity): Promise<void>;
  listSlaClocks(): Promise<SlaClock[]>;
  saveSlaClock(s: SlaClock): Promise<SlaClock>;
  deleteSlaClock(s: SlaClock): Promise<void>;
  listDocumentTemplates(): Promise<DocumentTemplate[]>;
  saveDocumentTemplate(d: DocumentTemplate): Promise<DocumentTemplate>;
  deleteDocumentTemplate(d: DocumentTemplate): Promise<void>;
  listDocumentInstances(): Promise<DocumentInstance[]>;
  saveDocumentInstance(d: DocumentInstance): Promise<DocumentInstance>;
  deleteDocumentInstance(d: DocumentInstance): Promise<void>;
  listSignatureRequests(): Promise<SignatureRequest[]>;
  saveSignatureRequest(s: SignatureRequest): Promise<SignatureRequest>;
  deleteSignatureRequest(s: SignatureRequest): Promise<void>;
  listRecordDeclarations(): Promise<RecordDeclaration[]>;
  saveRecordDeclaration(r: RecordDeclaration): Promise<RecordDeclaration>;
  deleteRecordDeclaration(r: RecordDeclaration): Promise<void>;
  listRetentionAssignments(): Promise<RetentionAssignment[]>;
  saveRetentionAssignment(r: RetentionAssignment): Promise<RetentionAssignment>;
  deleteRetentionAssignment(r: RetentionAssignment): Promise<void>;
  // M24
  listReportDefinitions(): Promise<ReportDefinition[]>;
  saveReportDefinition(r: ReportDefinition): Promise<ReportDefinition>;
  deleteReportDefinition(r: ReportDefinition): Promise<void>;
  listDashboards(): Promise<Dashboard[]>;
  saveDashboard(d: Dashboard): Promise<Dashboard>;
  deleteDashboard(d: Dashboard): Promise<void>;
  listDashboardWidgets(): Promise<DashboardWidget[]>;
  saveDashboardWidget(w: DashboardWidget): Promise<DashboardWidget>;
  deleteDashboardWidget(w: DashboardWidget): Promise<void>;
  listReportRuns(): Promise<ReportRun[]>;
  saveReportRun(r: ReportRun): Promise<ReportRun>;
  deleteReportRun(r: ReportRun): Promise<void>;
  listMetricDefinitions(): Promise<MetricDefinition[]>;
  saveMetricDefinition(m: MetricDefinition): Promise<MetricDefinition>;
  deleteMetricDefinition(m: MetricDefinition): Promise<void>;
  listSemanticDimensions(): Promise<SemanticDimension[]>;
  saveSemanticDimension(s: SemanticDimension): Promise<SemanticDimension>;
  deleteSemanticDimension(s: SemanticDimension): Promise<void>;
  listReportAccessPolicies(): Promise<ReportAccessPolicy[]>;
  saveReportAccessPolicy(p: ReportAccessPolicy): Promise<ReportAccessPolicy>;
  deleteReportAccessPolicy(p: ReportAccessPolicy): Promise<void>;
  listReportCatalogEntries(): Promise<ReportCatalogEntry[]>;
  saveReportCatalogEntry(e: ReportCatalogEntry): Promise<ReportCatalogEntry>;
  deleteReportCatalogEntry(e: ReportCatalogEntry): Promise<void>;
  listDataProducts(): Promise<DataProduct[]>;
  saveDataProduct(p: DataProduct): Promise<DataProduct>;
  deleteDataProduct(p: DataProduct): Promise<void>;
  listPipelineRuns(): Promise<PipelineRun[]>;
  savePipelineRun(r: PipelineRun): Promise<PipelineRun>;
  deletePipelineRun(r: PipelineRun): Promise<void>;
  listDataQualityResults(): Promise<DataQualityResult[]>;
  saveDataQualityResult(r: DataQualityResult): Promise<DataQualityResult>;
  deleteDataQualityResult(r: DataQualityResult): Promise<void>;
  listModelVersions(): Promise<ModelVersion[]>;
  saveModelVersion(m: ModelVersion): Promise<ModelVersion>;
  deleteModelVersion(m: ModelVersion): Promise<void>;
  listModelScores(): Promise<ModelScore[]>;
  saveModelScore(s: ModelScore): Promise<ModelScore>;
  deleteModelScore(s: ModelScore): Promise<void>;
}

async function logAudit(action: string, entity: string, detail: string, recordsAffected = 1) {
  const entry: AuditEntry = {
    id: uid(),
    ts: new Date().toISOString(),
    actor: "Anish Karki (you)",
    action,
    entity,
    detail,
    recordsAffected,
  };
  await dbPut("audit", entry);
}

// ── Tenants (M01.01) ─────────────────────────────────────────────────────────
const apiMethods: Partial<ErpApi> = {
  listTenants: async (): Promise<Tenant[]> => {
    await delay();
    const rows = await dbGetAll("tenants");
    return rows.sort((a, b) => a.code.localeCompare(b.code));
  },
  saveTenant: async (tenant: Tenant): Promise<Tenant> => {
    await delay(350);
    const isNew = !(await dbGetAll("tenants")).some((t) => t.id === tenant.id);
    await dbPut("tenants", tenant);
    await logAudit(
      isNew ? "TENANT_CREATED" : "TENANT_UPDATED",
      "tenant",
      `${isNew ? "Created" : "Updated"} tenant ${tenant.code} — ${tenant.name} (${tenant.status}, ${tenant.edition})`
    );
    return tenant;
  },
  deleteTenant: async (tenant: Tenant): Promise<void> => {
    await delay(300);
    await dbDelete("tenants", tenant.id);
    await logAudit("TENANT_ARCHIVED", "tenant", `Tenant ${tenant.code} — ${tenant.name} removed from registry`);
  },

  // ── Institution & legal entities (M01.02) ──────────────────────────────────
  getInstitution: async (): Promise<Institution> => {
    await delay();
    const rows = await dbGetAll("institution");
    return rows[0]!;
  },
  saveInstitution: async (inst: Institution): Promise<Institution> => {
    await delay(400);
    await dbPut("institution", inst);
    await logAudit("INSTITUTION_UPDATED", "institution", `Institution profile updated — ${inst.name}`);
    return inst;
  },
  listLegalEntities: async (): Promise<LegalEntity[]> => {
    await delay();
    return dbGetAll("legalEntities");
  },
  saveLegalEntity: async (e: LegalEntity): Promise<LegalEntity> => {
    await delay(300);
    await dbPut("legalEntities", e);
    await logAudit("LEGAL_ENTITY_SAVED", "legal_entity", `Legal entity saved — ${e.name}`);
    return e;
  },
  deleteLegalEntity: async (e: LegalEntity): Promise<void> => {
    await delay(250);
    await dbDelete("legalEntities", e.id);
    await logAudit("LEGAL_ENTITY_REMOVED", "legal_entity", `Legal entity removed — ${e.name}`);
  },

  // ── Campuses (M01.02) ───────────────────────────────────────────────────────
  listCampuses: async (): Promise<Campus[]> => {
    await delay();
    return dbGetAll("campuses");
  },
  saveCampus: async (c: Campus): Promise<Campus> => {
    await delay(350);
    await dbPut("campuses", c);
    await logAudit("CAMPUS_SAVED", "campus", `Campus saved — ${c.name} (${c.status})`);
    return c;
  },
  deleteCampus: async (c: Campus): Promise<void> => {
    await delay(250);
    await dbDelete("campuses", c.id);
    await logAudit("CAMPUS_REMOVED", "campus", `Campus removed — ${c.name}`);
  },

  // ── Org units (M01.03) ──────────────────────────────────────────────────────
  listOrgUnits: async (): Promise<OrgUnit[]> => {
    await delay();
    return dbGetAll("orgUnits");
  },
  saveOrgUnit: async (u: OrgUnit): Promise<OrgUnit> => {
    await delay(320);
    await dbPut("orgUnits", u);
    await logAudit("ORG_UNIT_SAVED", "org_unit", `Org unit saved — ${u.name} (${u.code})`);
    return u;
  },
  deleteOrgUnit: async (u: OrgUnit, children: number): Promise<void> => {
    await delay(250);
    if (children > 0) {
      throw new Error(
        `${u.name} has ${children} sub-unit(s) and historical references. Deletion is blocked by M01.03 policy — archive it instead.`
      );
    }
    await dbDelete("orgUnits", u.id);
    await logAudit("ORG_UNIT_REMOVED", "org_unit", `Org unit removed — ${u.name}`);
  },
};

// continued — locations, calendar, sequences, features, config, audit
Object.assign(apiMethods, {
  // ── Locations (M01.04) ───────────────────────────────────────────────────────
  listLocations: async (): Promise<LocationNode[]> => {
    await delay();
    return dbGetAll("locations");
  },
  saveLocation: async (l: LocationNode): Promise<LocationNode> => {
    await delay(320);
    await dbPut("locations", l);
    await logAudit("LOCATION_SAVED", "location", `Location saved — ${l.name} (${l.code}, ${l.type})`);
    return l;
  },
  deleteLocation: async (l: LocationNode, children: number): Promise<void> => {
    await delay(250);
    if (children > 0) throw new Error(`${l.name} contains ${children} child space(s). Remove them first.`);
    await dbDelete("locations", l.id);
    await logAudit("LOCATION_REMOVED", "location", `Location removed — ${l.name}`);
  },

  // ── Calendar & sequences (M01.05) ────────────────────────────────────────────
  listCalendarYears: async () => {
    await delay();
    return dbGetAll("calendarYears");
  },
  listHolidays: async (): Promise<Holiday[]> => {
    await delay();
    const rows = await dbGetAll("holidays");
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  },
  saveHoliday: async (h: Holiday): Promise<Holiday> => {
    await delay(280);
    await dbPut("holidays", h);
    await logAudit("HOLIDAY_SAVED", "calendar_day", `Calendar day saved — ${h.name} (${h.date})`);
    return h;
  },
  deleteHoliday: async (h: Holiday): Promise<void> => {
    await delay(220);
    await dbDelete("holidays", h.id);
    await logAudit("HOLIDAY_REMOVED", "calendar_day", `Calendar day removed — ${h.name}`);
  },
  getLocale: async (): Promise<LocaleSettings> => {
    await delay();
    return (await dbGetAll("locale"))[0]!;
  },
  saveLocale: async (l: LocaleSettings): Promise<LocaleSettings> => {
    await delay(300);
    await dbPut("locale", l);
    await logAudit("LOCALE_UPDATED", "configuration_version", `Locale display updated — ${l.language}, ${l.calendarSystem}, ${l.timezone}`);
    return l;
  },
  listSequences: async (): Promise<DocSequence[]> => {
    await delay();
    return dbGetAll("sequences");
  },
  saveSequence: async (s: DocSequence): Promise<DocSequence> => {
    await delay(300);
    await dbPut("sequences", s);
    await logAudit("SEQUENCE_UPDATED", "document_sequence", `Sequence ${s.prefix} updated — next ${s.currentNumber}, ${s.locked ? "locked" : "unlocked"}`);
    return s;
  },

  // ── Feature flags & config versions (M01.06) ────────────────────────────────
  listFeatureFlags: async (): Promise<FeatureFlag[]> => {
    await delay();
    return dbGetAll("featureFlags");
  },
  saveFeatureFlag: async (f: FeatureFlag): Promise<FeatureFlag> => {
    await delay(300);
    await dbPut("featureFlags", f);
    await logAudit("POLICY_UPDATED", "feature_policy", `Feature ${f.featureCode} ${f.enabled ? "enabled" : "disabled"} (${f.scope}) effective ${f.effectiveFrom}`);
    return f;
  },
  listConfigVersions: async (): Promise<ConfigVersion[]> => {
    await delay();
    const rows = await dbGetAll("configVersions");
    return rows.sort((a, b) => b.createdOn.localeCompare(a.createdOn));
  },
  saveConfigVersion: async (v: ConfigVersion): Promise<ConfigVersion> => {
    await delay(320);
    await dbPut("configVersions", v);
    await logAudit("CONFIG_VERSION", "configuration_version", `Configuration ${v.version} — ${v.status}`);
    return v;
  },

  // ── Audit (M01.06.F5) ────────────────────────────────────────────────────────
  listAudit: async (): Promise<AuditEntry[]> => {
    await delay();
    const rows = await dbGetAll("audit");
    return rows.sort((a, b) => b.ts.localeCompare(a.ts));
  },
});

// ── M02 Identity, Access and Delegation ──────────────────────────────────────
Object.assign(apiMethods, {
  // M02.01 Identity Lifecycle
  listUserIdentities: async (): Promise<UserIdentity[]> => {
    await delay();
    return dbGetAll("userIdentities");
  },
  saveUserIdentity: async (u: UserIdentity): Promise<UserIdentity> => {
    await delay(350);
    const isNew = !(await dbGetAll("userIdentities")).some((i) => i.id === u.id);
    await dbPut("userIdentities", u);
    await logAudit(isNew ? "IDENTITY_CREATED" : "IDENTITY_UPDATED", "user_identity", `${isNew ? "Created" : "Updated"} identity — ${u.displayName} (${u.username}, ${u.type})`);
    return u;
  },
  deleteUserIdentity: async (u: UserIdentity): Promise<void> => {
    await delay(280);
    await dbDelete("userIdentities", u.id);
    await logAudit("IDENTITY_ARCHIVED", "user_identity", `Identity archived — ${u.displayName} (${u.username})`);
  },

  // M02.02 Authentication & Federation
  listAuthSessions: async (): Promise<AuthSession[]> => {
    await delay();
    return dbGetAll("authSessions");
  },
  revokeAuthSession: async (s: AuthSession): Promise<void> => {
    await delay(250);
    const updated = { ...s, isActive: false, revokedAt: new Date().toISOString(), revokeReason: "Admin revocation" };
    await dbPut("authSessions", updated);
    await logAudit("SESSION_REVOKED", "auth_session", `Session revoked for user ${s.userId} — ${s.provider} from ${s.ip}`);
  },
  listAuthFactors: async (): Promise<AuthFactor[]> => {
    await delay();
    return dbGetAll("authFactors");
  },

  // M02.03 RBAC, ABAC and Data Scope
  listRoles: async (): Promise<Role[]> => {
    await delay();
    return dbGetAll("roles");
  },
  saveRole: async (r: Role): Promise<Role> => {
    await delay(350);
    await dbPut("roles", r);
    await logAudit("ROLE_SAVED", "role", `Role saved — ${r.name} (${r.code}), ${r.permissions.length} permissions`);
    return r;
  },
  deleteRole: async (r: Role): Promise<void> => {
    await delay(250);
    if (r.isSystem) throw new Error(`Role ${r.name} is a system role and cannot be deleted.`);
    await dbDelete("roles", r.id);
    await logAudit("ROLE_REMOVED", "role", `Role removed — ${r.name} (${r.code})`);
  },
  listUserRoles: async (): Promise<UserRole[]> => {
    await delay();
    return dbGetAll("userRoles");
  },
  saveUserRole: async (ur: UserRole): Promise<UserRole> => {
    await delay(300);
    await dbPut("userRoles", ur);
    await logAudit("USER_ROLE_ASSIGNED", "user_role", `Role ${ur.roleName} assigned to ${ur.userName} (${ur.scope})`);
    return ur;
  },
  deleteUserRole: async (ur: UserRole): Promise<void> => {
    await delay(250);
    await dbDelete("userRoles", ur.id);
    await logAudit("USER_ROLE_REVOKED", "user_role", `Role ${ur.roleName} revoked from ${ur.userName}`);
  },
  listDataScopes: async (): Promise<DataScope[]> => {
    await delay();
    return dbGetAll("dataScopes");
  },
  saveDataScope: async (ds: DataScope): Promise<DataScope> => {
    await delay(280);
    await dbPut("dataScopes", ds);
    await logAudit("DATA_SCOPE_SAVED", "data_scope", `Data scope ${ds.scopeType}:${ds.scopeName} granted to ${ds.userName}`);
    return ds;
  },
  deleteDataScope: async (ds: DataScope): Promise<void> => {
    await delay(220);
    await dbDelete("dataScopes", ds.id);
    await logAudit("DATA_SCOPE_REMOVED", "data_scope", `Data scope removed from ${ds.userName} — ${ds.scopeName}`);
  },

  // M02.04 Delegation & Impersonation
  listDelegations: async (): Promise<Delegation[]> => {
    await delay();
    return dbGetAll("delegations");
  },
  saveDelegation: async (d: Delegation): Promise<Delegation> => {
    await delay(320);
    await dbPut("delegations", d);
    await logAudit("DELEGATION_SAVED", "delegation", `Delegation from ${d.delegatorName} to ${d.delegateName} — ${d.scope}`);
    return d;
  },
  revokeDelegation: async (d: Delegation): Promise<void> => {
    await delay(250);
    const updated = { ...d, status: "revoked" as const, revokedBy: "Anish Karki", revokedOn: new Date().toISOString() };
    await dbPut("delegations", updated);
    await logAudit("DELEGATION_REVOKED", "delegation", `Delegation revoked — ${d.delegatorName} → ${d.delegateName}`);
  },
  listImpersonationLogs: async (): Promise<ImpersonationLog[]> => {
    await delay();
    return dbGetAll("impersonationLogs");
  },
  saveImpersonationLog: async (l: ImpersonationLog): Promise<ImpersonationLog> => {
    await delay(300);
    await dbPut("impersonationLogs", l);
    await logAudit("IMPERSONATION_LOGGED", "impersonation", `Impersonation ${l.status} — ${l.adminName} → ${l.targetName}`);
    return l;
  },

  // M02.05 Segregation of Duties
  listDutyRules: async (): Promise<DutyRule[]> => {
    await delay();
    return dbGetAll("dutyRules");
  },
  saveDutyRule: async (r: DutyRule): Promise<DutyRule> => {
    await delay(320);
    await dbPut("dutyRules", r);
    await logAudit("DUTY_RULE_SAVED", "duty_rule", `SoD rule saved — ${r.name} (${r.enforcement})`);
    return r;
  },
  deleteDutyRule: async (r: DutyRule): Promise<void> => {
    await delay(250);
    await dbDelete("dutyRules", r.id);
    await logAudit("DUTY_RULE_REMOVED", "duty_rule", `SoD rule removed — ${r.name}`);
  },
  listDutyViolations: async (): Promise<DutyViolation[]> => {
    await delay();
    return dbGetAll("dutyViolations");
  },
  saveDutyViolation: async (v: DutyViolation): Promise<DutyViolation> => {
    await delay(300);
    await dbPut("dutyViolations", v);
    await logAudit("DUTY_VIOLATION_UPDATED", "duty_violation", `Violation ${v.status} — ${v.ruleName} for ${v.userName}`);
    return v;
  },

  // M02.06 Privileged Access
  listPrivilegedAccess: async (): Promise<PrivilegedAccess[]> => {
    await delay();
    return dbGetAll("privilegedAccess");
  },
  savePrivilegedAccess: async (pa: PrivilegedAccess): Promise<PrivilegedAccess> => {
    await delay(320);
    await dbPut("privilegedAccess", pa);
    await logAudit("PRIVILEGE_SAVED", "privileged_access", `Privileged access ${pa.status} — ${pa.userName} (${pa.level}) for ${pa.resource}`);
    return pa;
  },
  listAccessReviews: async (): Promise<AccessReview[]> => {
    await delay();
    return dbGetAll("accessReviews");
  },
  saveAccessReview: async (ar: AccessReview): Promise<AccessReview> => {
    await delay(350);
    await dbPut("accessReviews", ar);
    await logAudit("ACCESS_REVIEW_SAVED", "access_review", `Access review ${ar.reviewPeriod} — ${ar.status} (${ar.reviewed}/${ar.totalIdentities} reviewed)`);
    return ar;
  },
});

// ── M03 School Academic Foundation and Catalog ──────────────────────────────
Object.assign(apiMethods, {
  listAcademicYears: async (): Promise<AcademicYear[]> => { await delay(); return dbGetAll("academicYears"); },
  saveAcademicYear: async (y: AcademicYear): Promise<AcademicYear> => { await delay(300); await dbPut("academicYears", y); await logAudit("ACADEMIC_YEAR_SAVED", "academic_year", `Academic year saved — ${y.name} (${y.status})`); return y; },
  deleteAcademicYear: async (y: AcademicYear): Promise<void> => { await delay(250); await dbDelete("academicYears", y.id); await logAudit("ACADEMIC_YEAR_DELETED", "academic_year", `Academic year deleted — ${y.name}`); },
  listTerms: async (): Promise<Term[]> => { await delay(); return dbGetAll("terms"); },
  saveTerm: async (t: Term): Promise<Term> => { await delay(280); await dbPut("terms", t); await logAudit("TERM_SAVED", "term", `Term saved — ${t.name}`); return t; },
  deleteTerm: async (t: Term): Promise<void> => { await delay(220); await dbDelete("terms", t.id); await logAudit("TERM_DELETED", "term", `Term deleted — ${t.name}`); },
  listSchoolLevels: async (): Promise<SchoolLevel[]> => { await delay(); return dbGetAll("schoolLevels"); },
  saveSchoolLevel: async (l: SchoolLevel): Promise<SchoolLevel> => { await delay(300); await dbPut("schoolLevels", l); await logAudit("SCHOOL_LEVEL_SAVED", "school_level", `School level saved — ${l.name}`); return l; },
  listGradeClasses: async (): Promise<GradeClass[]> => { await delay(); return dbGetAll("gradeClasses"); },
  saveGradeClass: async (g: GradeClass): Promise<GradeClass> => { await delay(280); await dbPut("gradeClasses", g); await logAudit("GRADE_CLASS_SAVED", "grade_class", `Grade/Class saved — ${g.name}`); return g; },
  deleteGradeClass: async (g: GradeClass): Promise<void> => { await delay(220); await dbDelete("gradeClasses", g.id); await logAudit("GRADE_CLASS_DELETED", "grade_class", `Grade/Class deleted — ${g.name}`); },
  listStreams: async (): Promise<Stream[]> => { await delay(); return dbGetAll("streams"); },
  saveStream: async (s: Stream): Promise<Stream> => { await delay(280); await dbPut("streams", s); await logAudit("STREAM_SAVED", "stream", `Stream saved — ${s.name}`); return s; },
  deleteStream: async (s: Stream): Promise<void> => { await delay(220); await dbDelete("streams", s.id); await logAudit("STREAM_DELETED", "stream", `Stream deleted — ${s.name}`); },
  listSubjects: async (): Promise<Subject[]> => { await delay(); return dbGetAll("subjects"); },
  saveSubject: async (s: Subject): Promise<Subject> => { await delay(300); await dbPut("subjects", s); await logAudit("SUBJECT_SAVED", "subject", `Subject saved — ${s.name} (${s.code})`); return s; },
  deleteSubject: async (s: Subject): Promise<void> => { await delay(250); await dbDelete("subjects", s.id); await logAudit("SUBJECT_DELETED", "subject", `Subject deleted — ${s.name}`); },
  listCurriculumOfferings: async (): Promise<CurriculumOffering[]> => { await delay(); return dbGetAll("curriculumOfferings"); },
  saveCurriculumOffering: async (c: CurriculumOffering): Promise<CurriculumOffering> => { await delay(300); await dbPut("curriculumOfferings", c); await logAudit("CURRICULUM_SAVED", "curriculum_offering", `Curriculum offering saved — ${c.subjectName} → ${c.gradeClassName}`); return c; },
  deleteCurriculumOffering: async (c: CurriculumOffering): Promise<void> => { await delay(220); await dbDelete("curriculumOfferings", c.id); await logAudit("CURRICULUM_DELETED", "curriculum_offering", `Curriculum offering deleted — ${c.subjectName} → ${c.gradeClassName}`); },
  listSections: async (): Promise<Section[]> => { await delay(); return dbGetAll("sections"); },
  saveSection: async (s: Section): Promise<Section> => { await delay(300); await dbPut("sections", s); await logAudit("SECTION_SAVED", "section", `Section saved — ${s.gradeClassName} ${s.name}`); return s; },
  deleteSection: async (s: Section): Promise<void> => { await delay(250); await dbDelete("sections", s.id); await logAudit("SECTION_DELETED", "section", `Section deleted — ${s.gradeClassName} ${s.name}`); },
  listHouses: async (): Promise<House[]> => { await delay(); return dbGetAll("houses"); },
  saveHouse: async (h: House): Promise<House> => { await delay(280); await dbPut("houses", h); await logAudit("HOUSE_SAVED", "house", `House saved — ${h.name}`); return h; },
  listCohorts: async (): Promise<Cohort[]> => { await delay(); return dbGetAll("cohorts"); },
  saveCohort: async (c: Cohort): Promise<Cohort> => { await delay(280); await dbPut("cohorts", c); await logAudit("COHORT_SAVED", "cohort", `Cohort saved — ${c.name}`); return c; },
  listGradingScales: async (): Promise<GradingScale[]> => { await delay(); return dbGetAll("gradingScales"); },
  saveGradingScale: async (g: GradingScale): Promise<GradingScale> => { await delay(320); await dbPut("gradingScales", g); await logAudit("GRADING_SCALE_SAVED", "grading_scale", `Grading scale saved — ${g.name} (${g.grades.length} grades)`); return g; },
  deleteGradingScale: async (g: GradingScale): Promise<void> => { await delay(250); await dbDelete("gradingScales", g.id); await logAudit("GRADING_SCALE_DELETED", "grading_scale", `Grading scale deleted — ${g.name}`); },
  listPromotionRules: async (): Promise<PromotionRule[]> => { await delay(); return dbGetAll("promotionRules"); },
  savePromotionRule: async (r: PromotionRule): Promise<PromotionRule> => { await delay(300); await dbPut("promotionRules", r); await logAudit("PROMOTION_RULE_SAVED", "promotion_rule", `Promotion rule saved — ${r.name}`); return r; },
  deletePromotionRule: async (r: PromotionRule): Promise<void> => { await delay(220); await dbDelete("promotionRules", r.id); await logAudit("PROMOTION_RULE_DELETED", "promotion_rule", `Promotion rule deleted — ${r.name}`); },
  listCompletionRules: async (): Promise<CompletionRule[]> => { await delay(); return dbGetAll("completionRules"); },
  saveCompletionRule: async (r: CompletionRule): Promise<CompletionRule> => { await delay(300); await dbPut("completionRules", r); await logAudit("COMPLETION_RULE_SAVED", "completion_rule", `Completion rule saved — ${r.name}`); return r; },
  listAcademicPolicies: async (): Promise<AcademicPolicy[]> => { await delay(); return dbGetAll("academicPolicies"); },
  saveAcademicPolicy: async (p: AcademicPolicy): Promise<AcademicPolicy> => { await delay(320); await dbPut("academicPolicies", p); await logAudit("ACADEMIC_POLICY_SAVED", "academic_policy", `Academic policy saved — ${p.name} (${p.status})`); return p; },
  deleteAcademicPolicy: async (p: AcademicPolicy): Promise<void> => { await delay(250); await dbDelete("academicPolicies", p.id); await logAudit("ACADEMIC_POLICY_DELETED", "academic_policy", `Academic policy deleted — ${p.name}`); },
});

// ── M04 CRM, Enquiry and Admissions ────────────────────────────────────────
Object.assign(apiMethods, {
  listCampaigns: async (): Promise<Campaign[]> => { await delay(); return dbGetAll("campaigns"); },
  saveCampaign: async (c: Campaign): Promise<Campaign> => { await delay(300); await dbPut("campaigns", c); await logAudit("CAMPAIGN_SAVED", "campaign", `Campaign saved — ${c.name} (${c.status})`); return c; },
  deleteCampaign: async (c: Campaign): Promise<void> => { await delay(250); await dbDelete("campaigns", c.id); await logAudit("CAMPAIGN_DELETED", "campaign", `Campaign deleted — ${c.name}`); },
  listEnquiries: async (): Promise<Enquiry[]> => { await delay(); return dbGetAll("enquiries"); },
  saveEnquiry: async (e: Enquiry): Promise<Enquiry> => { await delay(300); await dbPut("enquiries", e); await logAudit("ENQUIRY_SAVED", "enquiry", `Enquiry saved — ${e.studentName} (${e.status})`); return e; },
  deleteEnquiry: async (e: Enquiry): Promise<void> => { await delay(250); await dbDelete("enquiries", e.id); await logAudit("ENQUIRY_DELETED", "enquiry", `Enquiry deleted — ${e.studentName}`); },
  listEnquiryInteractions: async (): Promise<EnquiryInteraction[]> => { await delay(); return dbGetAll("enquiryInteractions"); },
  saveEnquiryInteraction: async (i: EnquiryInteraction): Promise<EnquiryInteraction> => { await delay(280); await dbPut("enquiryInteractions", i); await logAudit("INTERACTION_SAVED", "enquiry_interaction", `Interaction saved — ${i.type} for ${i.enquiryName}`); return i; },
  deleteEnquiryInteraction: async (i: EnquiryInteraction): Promise<void> => { await delay(220); await dbDelete("enquiryInteractions", i.id); await logAudit("INTERACTION_DELETED", "enquiry_interaction", `Interaction deleted — ${i.type} for ${i.enquiryName}`); },
  listApplications: async (): Promise<Application[]> => { await delay(); return dbGetAll("applications"); },
  saveApplication: async (a: Application): Promise<Application> => { await delay(320); await dbPut("applications", a); await logAudit("APPLICATION_SAVED", "application", `Application saved — ${a.studentName} (${a.applicationNo})`); return a; },
  deleteApplication: async (a: Application): Promise<void> => { await delay(250); await dbDelete("applications", a.id); await logAudit("APPLICATION_DELETED", "application", `Application deleted — ${a.studentName}`); },
  listApplicationChoices: async (): Promise<ApplicationChoice[]> => { await delay(); return dbGetAll("applicationChoices"); },
  saveApplicationChoice: async (c: ApplicationChoice): Promise<ApplicationChoice> => { await delay(280); await dbPut("applicationChoices", c); await logAudit("APP_CHOICE_SAVED", "application_choice", `Application choice saved — ${c.offeringName}`); return c; },
  deleteApplicationChoice: async (c: ApplicationChoice): Promise<void> => { await delay(220); await dbDelete("applicationChoices", c.id); await logAudit("APP_CHOICE_DELETED", "application_choice", `Application choice deleted — ${c.offeringName}`); },
  listApplicationDocuments: async (): Promise<ApplicationDocument[]> => { await delay(); return dbGetAll("applicationDocuments"); },
  saveApplicationDocument: async (d: ApplicationDocument): Promise<ApplicationDocument> => { await delay(280); await dbPut("applicationDocuments", d); await logAudit("APP_DOC_SAVED", "application_document", `Document saved — ${d.documentName} (${d.status})`); return d; },
  deleteApplicationDocument: async (d: ApplicationDocument): Promise<void> => { await delay(220); await dbDelete("applicationDocuments", d.id); await logAudit("APP_DOC_DELETED", "application_document", `Document deleted — ${d.documentName}`); },
  listEligibilityDecisions: async (): Promise<EligibilityDecision[]> => { await delay(); return dbGetAll("eligibilityDecisions"); },
  saveEligibilityDecision: async (d: EligibilityDecision): Promise<EligibilityDecision> => { await delay(300); await dbPut("eligibilityDecisions", d); await logAudit("ELIGIBILITY_SAVED", "eligibility_decision", `Eligibility decision saved — ${d.applicationName} (${d.outcome})`); return d; },
  deleteEligibilityDecision: async (d: EligibilityDecision): Promise<void> => { await delay(250); await dbDelete("eligibilityDecisions", d.id); await logAudit("ELIGIBILITY_DELETED", "eligibility_decision", `Eligibility decision deleted — ${d.applicationName}`); },
  listSelectionEvents: async (): Promise<SelectionEvent[]> => { await delay(); return dbGetAll("selectionEvents"); },
  saveSelectionEvent: async (e: SelectionEvent): Promise<SelectionEvent> => { await delay(300); await dbPut("selectionEvents", e); await logAudit("SELECTION_EVENT_SAVED", "selection_event", `Selection event saved — ${e.applicationName} (${e.type})`); return e; },
  deleteSelectionEvent: async (e: SelectionEvent): Promise<void> => { await delay(250); await dbDelete("selectionEvents", e.id); await logAudit("SELECTION_EVENT_DELETED", "selection_event", `Selection event deleted — ${e.applicationName}`); },
  listSelectionScores: async (): Promise<SelectionScore[]> => { await delay(); return dbGetAll("selectionScores"); },
  saveSelectionScore: async (s: SelectionScore): Promise<SelectionScore> => { await delay(280); await dbPut("selectionScores", s); await logAudit("SELECTION_SCORE_SAVED", "selection_score", `Selection score saved — ${s.criterion} (${s.score}/${s.maxScore})`); return s; },
  deleteSelectionScore: async (s: SelectionScore): Promise<void> => { await delay(220); await dbDelete("selectionScores", s.id); await logAudit("SELECTION_SCORE_DELETED", "selection_score", `Selection score deleted — ${s.criterion}`); },
  listOffers: async (): Promise<Offer[]> => { await delay(); return dbGetAll("offers"); },
  saveOffer: async (o: Offer): Promise<Offer> => { await delay(320); await dbPut("offers", o); await logAudit("OFFER_SAVED", "offer", `Offer saved — ${o.applicationName} (${o.status})`); return o; },
  deleteOffer: async (o: Offer): Promise<void> => { await delay(250); await dbDelete("offers", o.id); await logAudit("OFFER_DELETED", "offer", `Offer deleted — ${o.applicationName}`); },
  listOfferAcceptances: async (): Promise<OfferAcceptance[]> => { await delay(); return dbGetAll("offerAcceptances"); },
  saveOfferAcceptance: async (a: OfferAcceptance): Promise<OfferAcceptance> => { await delay(300); await dbPut("offerAcceptances", a); await logAudit("OFFER_ACCEPTANCE_SAVED", "offer_acceptance", `Offer acceptance saved — ${a.offerName}`); return a; },
  deleteOfferAcceptance: async (a: OfferAcceptance): Promise<void> => { await delay(250); await dbDelete("offerAcceptances", a.id); await logAudit("OFFER_ACCEPTANCE_DELETED", "offer_acceptance", `Offer acceptance deleted — ${a.offerName}`); },
  listConversionCases: async (): Promise<ConversionCase[]> => { await delay(); return dbGetAll("conversionCases"); },
  saveConversionCase: async (c: ConversionCase): Promise<ConversionCase> => { await delay(320); await dbPut("conversionCases", c); await logAudit("CONVERSION_SAVED", "conversion_case", `Conversion case saved — ${c.studentName} (${c.state})`); return c; },
  deleteConversionCase: async (c: ConversionCase): Promise<void> => { await delay(250); await dbDelete("conversionCases", c.id); await logAudit("CONVERSION_DELETED", "conversion_case", `Conversion case deleted — ${c.studentName}`); },
  listConversionSteps: async (): Promise<ConversionStep[]> => { await delay(); return dbGetAll("conversionSteps"); },
  saveConversionStep: async (s: ConversionStep): Promise<ConversionStep> => { await delay(280); await dbPut("conversionSteps", s); await logAudit("CONVERSION_STEP_SAVED", "conversion_step", `Conversion step saved — ${s.stepName} (${s.status})`); return s; },
  deleteConversionStep: async (s: ConversionStep): Promise<void> => { await delay(220); await dbDelete("conversionSteps", s.id); await logAudit("CONVERSION_STEP_DELETED", "conversion_step", `Conversion step deleted — ${s.stepName}`); },
});

// ── M05 Student Information and Lifecycle ──────────────────────────────────
Object.assign(apiMethods, {
  listPersons: async (): Promise<Person[]> => { await delay(); return dbGetAll("persons"); },
  savePerson: async (p: Person): Promise<Person> => { await delay(300); await dbPut("persons", p); await logAudit("PERSON_SAVED", "person", `Person saved — ${p.legalName}`); return p; },
  deletePerson: async (p: Person): Promise<void> => { await delay(250); await dbDelete("persons", p.id); await logAudit("PERSON_DELETED", "person", `Person deleted — ${p.legalName}`); },
  listStudents: async (): Promise<Student[]> => { await delay(); return dbGetAll("students"); },
  saveStudent: async (s: Student): Promise<Student> => { await delay(300); await dbPut("students", s); await logAudit("STUDENT_SAVED", "student", `Student saved — ${s.personName} (${s.admissionNo})`); return s; },
  deleteStudent: async (s: Student): Promise<void> => { await delay(250); await dbDelete("students", s.id); await logAudit("STUDENT_DELETED", "student", `Student deleted — ${s.personName}`); },
  listGuardians: async (): Promise<Guardian[]> => { await delay(); return dbGetAll("guardians"); },
  saveGuardian: async (g: Guardian): Promise<Guardian> => { await delay(300); await dbPut("guardians", g); await logAudit("GUARDIAN_SAVED", "guardian", `Guardian saved — ${g.name} (${g.relationToStudent})`); return g; },
  deleteGuardian: async (g: Guardian): Promise<void> => { await delay(250); await dbDelete("guardians", g.id); await logAudit("GUARDIAN_DELETED", "guardian", `Guardian deleted — ${g.name}`); },
  listStudentGuardians: async (): Promise<StudentGuardian[]> => { await delay(); return dbGetAll("studentGuardians"); },
  saveStudentGuardian: async (sg: StudentGuardian): Promise<StudentGuardian> => { await delay(280); await dbPut("studentGuardians", sg); await logAudit("STUDENT_GUARDIAN_SAVED", "student_guardian", `Student-guardian link saved — ${sg.studentName} ↔ ${sg.guardianName} (${sg.type})`); return sg; },
  deleteStudentGuardian: async (sg: StudentGuardian): Promise<void> => { await delay(220); await dbDelete("studentGuardians", sg.id); await logAudit("STUDENT_GUARDIAN_DELETED", "student_guardian", `Student-guardian link deleted — ${sg.studentName} ↔ ${sg.guardianName}`); },
  listStudentDocuments: async (): Promise<StudentDocument[]> => { await delay(); return dbGetAll("studentDocuments"); },
  saveStudentDocument: async (d: StudentDocument): Promise<StudentDocument> => { await delay(280); await dbPut("studentDocuments", d); await logAudit("STUDENT_DOC_SAVED", "student_document", `Student document saved — ${d.documentName} (${d.type})`); return d; },
  deleteStudentDocument: async (d: StudentDocument): Promise<void> => { await delay(220); await dbDelete("studentDocuments", d.id); await logAudit("STUDENT_DOC_DELETED", "student_document", `Student document deleted — ${d.documentName}`); },
  listEnrolments: async (): Promise<Enrolment[]> => { await delay(); return dbGetAll("enrolments"); },
  saveEnrolment: async (e: Enrolment): Promise<Enrolment> => { await delay(300); await dbPut("enrolments", e); await logAudit("ENROLMENT_SAVED", "enrolment", `Enrolment saved — ${e.studentName} → ${e.gradeName} (${e.status})`); return e; },
  deleteEnrolment: async (e: Enrolment): Promise<void> => { await delay(250); await dbDelete("enrolments", e.id); await logAudit("ENROLMENT_DELETED", "enrolment", `Enrolment deleted — ${e.studentName} → ${e.gradeName}`); },
  listSubjectSelections: async (): Promise<SubjectSelection[]> => { await delay(); return dbGetAll("subjectSelections"); },
  saveSubjectSelection: async (s: SubjectSelection): Promise<SubjectSelection> => { await delay(280); await dbPut("subjectSelections", s); await logAudit("SUBJECT_SELECTION_SAVED", "subject_selection", `Subject selection saved — ${s.studentName} → ${s.subjectName}`); return s; },
  deleteSubjectSelection: async (s: SubjectSelection): Promise<void> => { await delay(220); await dbDelete("subjectSelections", s.id); await logAudit("SUBJECT_SELECTION_DELETED", "subject_selection", `Subject selection deleted — ${s.studentName} → ${s.subjectName}`); },
  listStudentMovements: async (): Promise<StudentMovement[]> => { await delay(); return dbGetAll("studentMovements"); },
  saveStudentMovement: async (m: StudentMovement): Promise<StudentMovement> => { await delay(300); await dbPut("studentMovements", m); await logAudit("STUDENT_MOVEMENT_SAVED", "student_movement", `Student movement saved — ${m.studentName} (${m.type})`); return m; },
  deleteStudentMovement: async (m: StudentMovement): Promise<void> => { await delay(250); await dbDelete("studentMovements", m.id); await logAudit("STUDENT_MOVEMENT_DELETED", "student_movement", `Student movement deleted — ${m.studentName} (${m.type})`); },
  listProgressionAudits: async (): Promise<ProgressionAudit[]> => { await delay(); return dbGetAll("progressionAudits"); },
  saveProgressionAudit: async (a: ProgressionAudit): Promise<ProgressionAudit> => { await delay(320); await dbPut("progressionAudits", a); await logAudit("PROGRESSION_AUDIT_SAVED", "progression_audit", `Progression audit saved — ${a.studentName} (${a.outcome})`); return a; },
  deleteProgressionAudit: async (a: ProgressionAudit): Promise<void> => { await delay(250); await dbDelete("progressionAudits", a.id); await logAudit("PROGRESSION_AUDIT_DELETED", "progression_audit", `Progression audit deleted — ${a.studentName}`); },
  listStudentHolds: async (): Promise<StudentHold[]> => { await delay(); return dbGetAll("studentHolds"); },
  saveStudentHold: async (h: StudentHold): Promise<StudentHold> => { await delay(300); await dbPut("studentHolds", h); await logAudit("STUDENT_HOLD_SAVED", "student_hold", `Student hold saved — ${h.studentName} (${h.holdType})`); return h; },
  deleteStudentHold: async (h: StudentHold): Promise<void> => { await delay(250); await dbDelete("studentHolds", h.id); await logAudit("STUDENT_HOLD_DELETED", "student_hold", `Student hold deleted — ${h.studentName} (${h.holdType})`); },
  listClearanceCases: async (): Promise<ClearanceCase[]> => { await delay(); return dbGetAll("clearanceCases"); },
  saveClearanceCase: async (c: ClearanceCase): Promise<ClearanceCase> => { await delay(320); await dbPut("clearanceCases", c); await logAudit("CLEARANCE_CASE_SAVED", "clearance_case", `Clearance case saved — ${c.studentName} (${c.purpose})`); return c; },
  deleteClearanceCase: async (c: ClearanceCase): Promise<void> => { await delay(250); await dbDelete("clearanceCases", c.id); await logAudit("CLEARANCE_CASE_DELETED", "clearance_case", `Clearance case deleted — ${c.studentName}`); },
  listClearanceResponses: async (): Promise<ClearanceResponse[]> => { await delay(); return dbGetAll("clearanceResponses"); },
  saveClearanceResponse: async (r: ClearanceResponse): Promise<ClearanceResponse> => { await delay(280); await dbPut("clearanceResponses", r); await logAudit("CLEARANCE_RESPONSE_SAVED", "clearance_response", `Clearance response saved — ${r.moduleName} (${r.decision})`); return r; },
  deleteClearanceResponse: async (r: ClearanceResponse): Promise<void> => { await delay(220); await dbDelete("clearanceResponses", r.id); await logAudit("CLEARANCE_RESPONSE_DELETED", "clearance_response", `Clearance response deleted — ${r.moduleName}`); },
  listIdentityCards: async (): Promise<IdentityCard[]> => { await delay(); return dbGetAll("identityCards"); },
  saveIdentityCard: async (c: IdentityCard): Promise<IdentityCard> => { await delay(300); await dbPut("identityCards", c); await logAudit("IDENTITY_CARD_SAVED", "identity_card", `Identity card saved — ${c.studentName} (${c.cardType})`); return c; },
  deleteIdentityCard: async (c: IdentityCard): Promise<void> => { await delay(250); await dbDelete("identityCards", c.id); await logAudit("IDENTITY_CARD_DELETED", "identity_card", `Identity card deleted — ${c.studentName} (${c.cardType})`); },
  // M06
  listCurriculumMaps: async (): Promise<CurriculumMap[]> => { await delay(); return dbGetAll("curriculumMaps"); },
  saveCurriculumMap: async (c: CurriculumMap): Promise<CurriculumMap> => { await delay(300); await dbPut("curriculumMaps", c); await logAudit("CURRICULUM_MAP_SAVED", "curriculum_map", `Curriculum map saved — offering ${c.offeringRef} v${c.version}`); return c; },
  deleteCurriculumMap: async (c: CurriculumMap): Promise<void> => { await delay(250); await dbDelete("curriculumMaps", c.id); await logAudit("CURRICULUM_MAP_DELETED", "curriculum_map", `Curriculum map deleted — ${c.id}`); },
  listLearningOutcomes: async (): Promise<LearningOutcome[]> => { await delay(); return dbGetAll("learningOutcomes"); },
  saveLearningOutcome: async (o: LearningOutcome): Promise<LearningOutcome> => { await delay(280); await dbPut("learningOutcomes", o); await logAudit("LEARNING_OUTCOME_SAVED", "learning_outcome", `Outcome saved — ${o.code}`); return o; },
  deleteLearningOutcome: async (o: LearningOutcome): Promise<void> => { await delay(220); await dbDelete("learningOutcomes", o.id); await logAudit("LEARNING_OUTCOME_DELETED", "learning_outcome", `Outcome deleted — ${o.code}`); },
  listSyllabusPlans: async (): Promise<SyllabusPlan[]> => { await delay(); return dbGetAll("syllabusPlans"); },
  saveSyllabusPlan: async (s: SyllabusPlan): Promise<SyllabusPlan> => { await delay(300); await dbPut("syllabusPlans", s); await logAudit("SYLLABUS_PLAN_SAVED", "syllabus_plan", `Syllabus plan saved — ${s.name}`); return s; },
  deleteSyllabusPlan: async (s: SyllabusPlan): Promise<void> => { await delay(250); await dbDelete("syllabusPlans", s.id); await logAudit("SYLLABUS_PLAN_DELETED", "syllabus_plan", `Syllabus plan deleted — ${s.name}`); },
  listContentPlanItems: async (): Promise<ContentPlanItem[]> => { await delay(); return dbGetAll("contentPlanItems"); },
  saveContentPlanItem: async (i: ContentPlanItem): Promise<ContentPlanItem> => { await delay(280); await dbPut("contentPlanItems", i); await logAudit("CONTENT_PLAN_ITEM_SAVED", "content_plan_item", `Content item saved — ${i.topic}`); return i; },
  deleteContentPlanItem: async (i: ContentPlanItem): Promise<void> => { await delay(220); await dbDelete("contentPlanItems", i.id); await logAudit("CONTENT_PLAN_ITEM_DELETED", "content_plan_item", `Content item deleted — ${i.topic}`); },
  listTeachingAssignments: async (): Promise<TeachingAssignment[]> => { await delay(); return dbGetAll("teachingAssignments"); },
  saveTeachingAssignment: async (t: TeachingAssignment): Promise<TeachingAssignment> => { await delay(300); await dbPut("teachingAssignments", t); await logAudit("TEACHING_ASSIGNMENT_SAVED", "teaching_assignment", `Assignment saved — ${t.staffName} → ${t.subjectName}`); return t; },
  deleteTeachingAssignment: async (t: TeachingAssignment): Promise<void> => { await delay(250); await dbDelete("teachingAssignments", t.id); await logAudit("TEACHING_ASSIGNMENT_DELETED", "teaching_assignment", `Assignment deleted — ${t.staffName}`); },
  listLessonPlans: async (): Promise<LessonPlan[]> => { await delay(); return dbGetAll("lessonPlans"); },
  saveLessonPlan: async (l: LessonPlan): Promise<LessonPlan> => { await delay(300); await dbPut("lessonPlans", l); await logAudit("LESSON_PLAN_SAVED", "lesson_plan", `Lesson plan saved — ${l.id}`); return l; },
  deleteLessonPlan: async (l: LessonPlan): Promise<void> => { await delay(250); await dbDelete("lessonPlans", l.id); await logAudit("LESSON_PLAN_DELETED", "lesson_plan", `Lesson plan deleted — ${l.id}`); },
  listCoverageEntries: async (): Promise<CoverageEntry[]> => { await delay(); return dbGetAll("coverageEntries"); },
  saveCoverageEntry: async (c: CoverageEntry): Promise<CoverageEntry> => { await delay(280); await dbPut("coverageEntries", c); await logAudit("COVERAGE_ENTRY_SAVED", "coverage_entry", `Coverage saved — ${c.id}`); return c; },
  deleteCoverageEntry: async (c: CoverageEntry): Promise<void> => { await delay(220); await dbDelete("coverageEntries", c.id); await logAudit("COVERAGE_ENTRY_DELETED", "coverage_entry", `Coverage deleted — ${c.id}`); },
  listWorkloadAllocations: async (): Promise<WorkloadAllocation[]> => { await delay(); return dbGetAll("workloadAllocations"); },
  saveWorkloadAllocation: async (w: WorkloadAllocation): Promise<WorkloadAllocation> => { await delay(300); await dbPut("workloadAllocations", w); await logAudit("WORKLOAD_ALLOCATION_SAVED", "workload_allocation", `Workload saved — ${w.staffName} (${w.activityType})`); return w; },
  deleteWorkloadAllocation: async (w: WorkloadAllocation): Promise<void> => { await delay(250); await dbDelete("workloadAllocations", w.id); await logAudit("WORKLOAD_ALLOCATION_DELETED", "workload_allocation", `Workload deleted — ${w.staffName}`); },
  listQualityReviews: async (): Promise<QualityReview[]> => { await delay(); return dbGetAll("qualityReviews"); },
  saveQualityReview: async (q: QualityReview): Promise<QualityReview> => { await delay(320); await dbPut("qualityReviews", q); await logAudit("QUALITY_REVIEW_SAVED", "quality_review", `Review saved — ${q.scopeType} (${q.status})`); return q; },
  deleteQualityReview: async (q: QualityReview): Promise<void> => { await delay(250); await dbDelete("qualityReviews", q.id); await logAudit("QUALITY_REVIEW_DELETED", "quality_review", `Review deleted — ${q.id}`); },
  listQualityEvidences: async (): Promise<QualityEvidence[]> => { await delay(); return dbGetAll("qualityEvidences"); },
  saveQualityEvidence: async (e: QualityEvidence): Promise<QualityEvidence> => { await delay(280); await dbPut("qualityEvidences", e); await logAudit("QUALITY_EVIDENCE_SAVED", "quality_evidence", `Evidence saved — ${e.objectRef}`); return e; },
  deleteQualityEvidence: async (e: QualityEvidence): Promise<void> => { await delay(220); await dbDelete("qualityEvidences", e.id); await logAudit("QUALITY_EVIDENCE_DELETED", "quality_evidence", `Evidence deleted — ${e.objectRef}`); },
  listModerationReviews: async (): Promise<ModerationReview[]> => { await delay(); return dbGetAll("moderationReviews"); },
  saveModerationReview: async (m: ModerationReview): Promise<ModerationReview> => { await delay(300); await dbPut("moderationReviews", m); await logAudit("MODERATION_REVIEW_SAVED", "moderation_review", `Moderation saved — ${m.subjectName} (${m.outcome})`); return m; },
  deleteModerationReview: async (m: ModerationReview): Promise<void> => { await delay(250); await dbDelete("moderationReviews", m.id); await logAudit("MODERATION_REVIEW_DELETED", "moderation_review", `Moderation deleted — ${m.subjectName}`); },
  listReviewActions: async (): Promise<ReviewAction[]> => { await delay(); return dbGetAll("reviewActions"); },
  saveReviewAction: async (a: ReviewAction): Promise<ReviewAction> => { await delay(300); await dbPut("reviewActions", a); await logAudit("REVIEW_ACTION_SAVED", "review_action", `Action saved — ${a.action} (${a.status})`); return a; },
  deleteReviewAction: async (a: ReviewAction): Promise<void> => { await delay(250); await dbDelete("reviewActions", a.id); await logAudit("REVIEW_ACTION_DELETED", "review_action", `Action deleted — ${a.action}`); },
  // M07
  listTimetables: async (): Promise<Timetable[]> => { await delay(); return dbGetAll("timetables"); },
  saveTimetable: async (t: Timetable): Promise<Timetable> => { await delay(300); await dbPut("timetables", t); await logAudit("TIMETABLE_SAVED", "timetable", `Timetable saved — ${t.name} (${t.status})`); return t; },
  deleteTimetable: async (t: Timetable): Promise<void> => { await delay(250); await dbDelete("timetables", t.id); await logAudit("TIMETABLE_DELETED", "timetable", `Timetable deleted — ${t.name}`); },
  listTimetableSlots: async (): Promise<TimetableSlot[]> => { await delay(); return dbGetAll("timetableSlots"); },
  saveTimetableSlot: async (s: TimetableSlot): Promise<TimetableSlot> => { await delay(280); await dbPut("timetableSlots", s); await logAudit("TIMETABLE_SLOT_SAVED", "timetable_slot", `Slot saved — ${s.dayPattern} ${s.startTime}-${s.endTime}`); return s; },
  deleteTimetableSlot: async (s: TimetableSlot): Promise<void> => { await delay(220); await dbDelete("timetableSlots", s.id); await logAudit("TIMETABLE_SLOT_DELETED", "timetable_slot", `Slot deleted — ${s.dayPattern} ${s.startTime}`); },
  listTimetableAssignments: async (): Promise<TimetableAssignment[]> => { await delay(); return dbGetAll("timetableAssignments"); },
  saveTimetableAssignment: async (a: TimetableAssignment): Promise<TimetableAssignment> => { await delay(300); await dbPut("timetableAssignments", a); await logAudit("TIMETABLE_ASSIGNMENT_SAVED", "timetable_assignment", `Assignment saved — ${a.sectionName} → ${a.offeringName}`); return a; },
  deleteTimetableAssignment: async (a: TimetableAssignment): Promise<void> => { await delay(250); await dbDelete("timetableAssignments", a.id); await logAudit("TIMETABLE_ASSIGNMENT_DELETED", "timetable_assignment", `Assignment deleted — ${a.sectionName}`); },
  listSubstitutions: async (): Promise<Substitution[]> => { await delay(); return dbGetAll("substitutions"); },
  saveSubstitution: async (s: Substitution): Promise<Substitution> => { await delay(300); await dbPut("substitutions", s); await logAudit("SUBSTITUTION_SAVED", "substitution", `Substitution saved — ${s.assignmentId} → ${s.replacementStaffName} (${s.status})`); return s; },
  deleteSubstitution: async (s: Substitution): Promise<void> => { await delay(250); await dbDelete("substitutions", s.id); await logAudit("SUBSTITUTION_DELETED", "substitution", `Substitution deleted — ${s.id}`); },
  listAttendanceSessions: async (): Promise<AttendanceSession[]> => { await delay(); return dbGetAll("attendanceSessions"); },
  saveAttendanceSession: async (s: AttendanceSession): Promise<AttendanceSession> => { await delay(300); await dbPut("attendanceSessions", s); await logAudit("ATTENDANCE_SESSION_SAVED", "attendance_session", `Session saved — ${s.sectionName} ${s.sessionDate} (${s.status})`); return s; },
  deleteAttendanceSession: async (s: AttendanceSession): Promise<void> => { await delay(250); await dbDelete("attendanceSessions", s.id); await logAudit("ATTENDANCE_SESSION_DELETED", "attendance_session", `Session deleted — ${s.id}`); },
  listStudentAttendances: async (): Promise<StudentAttendance[]> => { await delay(); return dbGetAll("studentAttendances"); },
  saveStudentAttendance: async (s: StudentAttendance): Promise<StudentAttendance> => { await delay(280); await dbPut("studentAttendances", s); await logAudit("STUDENT_ATTENDANCE_SAVED", "student_attendance", `Attendance saved — ${s.studentName} (${s.status})`); return s; },
  deleteStudentAttendance: async (s: StudentAttendance): Promise<void> => { await delay(220); await dbDelete("studentAttendances", s.id); await logAudit("STUDENT_ATTENDANCE_DELETED", "student_attendance", `Attendance deleted — ${s.studentName}`); },
  listAttendanceCorrections: async (): Promise<AttendanceCorrection[]> => { await delay(); return dbGetAll("attendanceCorrections"); },
  saveAttendanceCorrection: async (c: AttendanceCorrection): Promise<AttendanceCorrection> => { await delay(300); await dbPut("attendanceCorrections", c); await logAudit("ATTENDANCE_CORRECTION_SAVED", "attendance_correction", `Correction saved — ${c.studentName} ${c.fromStatus}→${c.toStatus} (${c.status})`); return c; },
  deleteAttendanceCorrection: async (c: AttendanceCorrection): Promise<void> => { await delay(250); await dbDelete("attendanceCorrections", c.id); await logAudit("ATTENDANCE_CORRECTION_DELETED", "attendance_correction", `Correction deleted — ${c.id}`); },
  listAttendanceAlerts: async (): Promise<AttendanceAlert[]> => { await delay(); return dbGetAll("attendanceAlerts"); },
  saveAttendanceAlert: async (a: AttendanceAlert): Promise<AttendanceAlert> => { await delay(280); await dbPut("attendanceAlerts", a); await logAudit("ATTENDANCE_ALERT_SAVED", "attendance_alert", `Alert saved — ${a.studentName} (${a.alertType})`); return a; },
  deleteAttendanceAlert: async (a: AttendanceAlert): Promise<void> => { await delay(220); await dbDelete("attendanceAlerts", a.id); await logAudit("ATTENDANCE_ALERT_DELETED", "attendance_alert", `Alert deleted — ${a.id}`); },
  listShifts: async (): Promise<Shift[]> => { await delay(); return dbGetAll("shifts"); },
  saveShift: async (s: Shift): Promise<Shift> => { await delay(300); await dbPut("shifts", s); await logAudit("SHIFT_SAVED", "shift", `Shift saved — ${s.name} (${s.code})`); return s; },
  deleteShift: async (s: Shift): Promise<void> => { await delay(250); await dbDelete("shifts", s.id); await logAudit("SHIFT_DELETED", "shift", `Shift deleted — ${s.name}`); },
  listStaffRosters: async (): Promise<StaffRoster[]> => { await delay(); return dbGetAll("staffRosters"); },
  saveStaffRoster: async (r: StaffRoster): Promise<StaffRoster> => { await delay(280); await dbPut("staffRosters", r); await logAudit("STAFF_ROSTER_SAVED", "staff_roster", `Roster saved — ${r.staffName} ${r.localDate} (${r.status})`); return r; },
  deleteStaffRoster: async (r: StaffRoster): Promise<void> => { await delay(220); await dbDelete("staffRosters", r.id); await logAudit("STAFF_ROSTER_DELETED", "staff_roster", `Roster deleted — ${r.staffName}`); },
  listTimeEntries: async (): Promise<TimeEntry[]> => { await delay(); return dbGetAll("timeEntries"); },
  saveTimeEntry: async (t: TimeEntry): Promise<TimeEntry> => { await delay(280); await dbPut("timeEntries", t); await logAudit("TIME_ENTRY_SAVED", "time_entry", `Time entry saved — ${t.staffName} ${t.occurredAt} (${t.source})`); return t; },
  deleteTimeEntry: async (t: TimeEntry): Promise<void> => { await delay(220); await dbDelete("timeEntries", t.id); await logAudit("TIME_ENTRY_DELETED", "time_entry", `Time entry deleted — ${t.staffName}`); },
  listTimeAdjustments: async (): Promise<TimeAdjustment[]> => { await delay(); return dbGetAll("timeAdjustments"); },
  saveTimeAdjustment: async (a: TimeAdjustment): Promise<TimeAdjustment> => { await delay(300); await dbPut("timeAdjustments", a); await logAudit("TIME_ADJUSTMENT_SAVED", "time_adjustment", `Adjustment saved — ${a.timeEntryId} (${a.status})`); return a; },
  deleteTimeAdjustment: async (a: TimeAdjustment): Promise<void> => { await delay(220); await dbDelete("timeAdjustments", a.id); await logAudit("TIME_ADJUSTMENT_DELETED", "time_adjustment", `Adjustment deleted — ${a.id}`); },
});

// ── M08 Assessment, Examinations and Integrity ─────────────────────────────
Object.assign(apiMethods, {
  listAssessments: async (): Promise<Assessment[]> => { await delay(); return dbGetAll("assessments"); },
  saveAssessment: async (a: Assessment): Promise<Assessment> => { await delay(300); await dbPut("assessments", a); await logAudit("ASSESSMENT_SAVED", "assessment", `Assessment saved — ${a.name} (${a.code}, ${a.status})`); return a; },
  deleteAssessment: async (a: Assessment): Promise<void> => { await delay(250); await dbDelete("assessments", a.id); await logAudit("ASSESSMENT_DELETED", "assessment", `Assessment deleted — ${a.name}`); },
  listAssessmentComponents: async (): Promise<AssessmentComponent[]> => { await delay(); return dbGetAll("assessmentComponents"); },
  saveAssessmentComponent: async (c: AssessmentComponent): Promise<AssessmentComponent> => { await delay(280); await dbPut("assessmentComponents", c); await logAudit("ASSESSMENT_COMPONENT_SAVED", "assessment_component", `Component saved — ${c.name} (${c.maxMarks})`); return c; },
  deleteAssessmentComponent: async (c: AssessmentComponent): Promise<void> => { await delay(220); await dbDelete("assessmentComponents", c.id); await logAudit("ASSESSMENT_COMPONENT_DELETED", "assessment_component", `Component deleted — ${c.name}`); },
  listQuestions: async (): Promise<Question[]> => { await delay(); return dbGetAll("questions"); },
  saveQuestion: async (q: Question): Promise<Question> => { await delay(300); await dbPut("questions", q); await logAudit("QUESTION_SAVED", "question", `Question saved — ${q.code} (${q.type}, ${q.difficulty})`); return q; },
  deleteQuestion: async (q: Question): Promise<void> => { await delay(220); await dbDelete("questions", q.id); await logAudit("QUESTION_DELETED", "question", `Question deleted — ${q.code}`); },
  listExamPapers: async (): Promise<ExamPaper[]> => { await delay(); return dbGetAll("examPapers"); },
  saveExamPaper: async (p: ExamPaper): Promise<ExamPaper> => { await delay(320); await dbPut("examPapers", p); await logAudit("EXAM_PAPER_SAVED", "exam_paper", `Paper saved — ${p.code} (${p.status})`); return p; },
  deleteExamPaper: async (p: ExamPaper): Promise<void> => { await delay(250); await dbDelete("examPapers", p.id); await logAudit("EXAM_PAPER_DELETED", "exam_paper", `Paper deleted — ${p.code}`); },
  listExams: async (): Promise<Exam[]> => { await delay(); return dbGetAll("exams"); },
  saveExam: async (e: Exam): Promise<Exam> => { await delay(300); await dbPut("exams", e); await logAudit("EXAM_SAVED", "exam", `Exam saved — ${e.name} (${e.code}, ${e.status})`); return e; },
  deleteExam: async (e: Exam): Promise<void> => { await delay(250); await dbDelete("exams", e.id); await logAudit("EXAM_DELETED", "exam", `Exam deleted — ${e.name}`); },
  listExamRegistrations: async (): Promise<ExamRegistration[]> => { await delay(); return dbGetAll("examRegistrations"); },
  saveExamRegistration: async (r: ExamRegistration): Promise<ExamRegistration> => { await delay(300); await dbPut("examRegistrations", r); await logAudit("EXAM_REGISTRATION_SAVED", "exam_registration", `Registration saved — ${r.studentName} for ${r.examId} (${r.status})`); return r; },
  deleteExamRegistration: async (r: ExamRegistration): Promise<void> => { await delay(220); await dbDelete("examRegistrations", r.id); await logAudit("EXAM_REGISTRATION_DELETED", "exam_registration", `Registration deleted — ${r.studentName}`); },
  listExamRooms: async (): Promise<ExamRoom[]> => { await delay(); return dbGetAll("examRooms"); },
  saveExamRoom: async (r: ExamRoom): Promise<ExamRoom> => { await delay(280); await dbPut("examRooms", r); await logAudit("EXAM_ROOM_SAVED", "exam_room", `Room saved — ${r.locationName ?? r.locationRef} for ${r.examId}`); return r; },
  deleteExamRoom: async (r: ExamRoom): Promise<void> => { await delay(220); await dbDelete("examRooms", r.id); await logAudit("EXAM_ROOM_DELETED", "exam_room", `Room deleted — ${r.locationName ?? r.locationRef}`); },
  listSeatAllocations: async (): Promise<SeatAllocation[]> => { await delay(); return dbGetAll("seatAllocations"); },
  saveSeatAllocation: async (s: SeatAllocation): Promise<SeatAllocation> => { await delay(280); await dbPut("seatAllocations", s); await logAudit("SEAT_ALLOCATION_SAVED", "seat_allocation", `Seat saved — ${s.studentName} → ${s.seatNo}`); return s; },
  deleteSeatAllocation: async (s: SeatAllocation): Promise<void> => { await delay(220); await dbDelete("seatAllocations", s.id); await logAudit("SEAT_ALLOCATION_DELETED", "seat_allocation", `Seat deleted — ${s.seatNo}`); },
  listInvigilationDuties: async (): Promise<InvigilationDuty[]> => { await delay(); return dbGetAll("invigilationDuties"); },
  saveInvigilationDuty: async (d: InvigilationDuty): Promise<InvigilationDuty> => { await delay(280); await dbPut("invigilationDuties", d); await logAudit("INVIGILATION_SAVED", "invigilation_duty", `Duty saved — ${d.staffName} (${d.role})`); return d; },
  deleteInvigilationDuty: async (d: InvigilationDuty): Promise<void> => { await delay(220); await dbDelete("invigilationDuties", d.id); await logAudit("INVIGILATION_DELETED", "invigilation_duty", `Duty deleted — ${d.staffName}`); },
  listMarkEntries: async (): Promise<MarkEntry[]> => { await delay(); return dbGetAll("markEntries"); },
  saveMarkEntry: async (m: MarkEntry): Promise<MarkEntry> => { await delay(300); await dbPut("markEntries", m); await logAudit("MARK_ENTRY_SAVED", "mark_entry", `Mark saved — ${m.studentName ?? m.registrationId} ${m.marksObtained}/${m.maxMarks} (${m.status})`); return m; },
  deleteMarkEntry: async (m: MarkEntry): Promise<void> => { await delay(220); await dbDelete("markEntries", m.id); await logAudit("MARK_ENTRY_DELETED", "mark_entry", `Mark deleted — ${m.id}`); },
  listModerationRecords: async (): Promise<ModerationRecord[]> => { await delay(); return dbGetAll("moderationRecords"); },
  saveModerationRecord: async (m: ModerationRecord): Promise<ModerationRecord> => { await delay(300); await dbPut("moderationRecords", m); await logAudit("MODERATION_SAVED", "moderation_record", `Moderation saved — ${m.examId} ${m.subjectRef} ${m.action} (${m.status})`); return m; },
  deleteModerationRecord: async (m: ModerationRecord): Promise<void> => { await delay(220); await dbDelete("moderationRecords", m.id); await logAudit("MODERATION_DELETED", "moderation_record", `Moderation deleted — ${m.id}`); },
  listPracticalExams: async (): Promise<PracticalExam[]> => { await delay(); return dbGetAll("practicalExams"); },
  savePracticalExam: async (p: PracticalExam): Promise<PracticalExam> => { await delay(300); await dbPut("practicalExams", p); await logAudit("PRACTICAL_SAVED", "practical_exam", `Practical saved — ${p.type} for ${p.subjectRef} (${p.status})`); return p; },
  deletePracticalExam: async (p: PracticalExam): Promise<void> => { await delay(220); await dbDelete("practicalExams", p.id); await logAudit("PRACTICAL_DELETED", "practical_exam", `Practical deleted — ${p.id}`); },
  listIntegrityCases: async (): Promise<IntegrityCase[]> => { await delay(); return dbGetAll("integrityCases"); },
  saveIntegrityCase: async (c: IntegrityCase): Promise<IntegrityCase> => { await delay(320); await dbPut("integrityCases", c); await logAudit("INTEGRITY_CASE_SAVED", "integrity_case", `Integrity case saved — ${c.studentName} (${c.type}, ${c.status})`); return c; },
  deleteIntegrityCase: async (c: IntegrityCase): Promise<void> => { await delay(220); await dbDelete("integrityCases", c.id); await logAudit("INTEGRITY_CASE_DELETED", "integrity_case", `Integrity case deleted — ${c.id}`); },
  listRecheckRequests: async (): Promise<RecheckRequest[]> => { await delay(); return dbGetAll("recheckRequests"); },
  saveRecheckRequest: async (r: RecheckRequest): Promise<RecheckRequest> => { await delay(300); await dbPut("recheckRequests", r); await logAudit("RECHECK_SAVED", "recheck_request", `Recheck saved — ${r.markEntryId} (${r.status})`); return r; },
  deleteRecheckRequest: async (r: RecheckRequest): Promise<void> => { await delay(220); await dbDelete("recheckRequests", r.id); await logAudit("RECHECK_DELETED", "recheck_request", `Recheck deleted — ${r.id}`); },
});

// ── M09 School Results, Records and Certificates ───────────────────────────
Object.assign(apiMethods, {
  listResultRuns: async (): Promise<ResultRun[]> => { await delay(); return dbGetAll("resultRuns"); },
  saveResultRun: async (r: ResultRun): Promise<ResultRun> => { await delay(300); await dbPut("resultRuns", r); await logAudit("RESULT_RUN_SAVED", "result_run", `Result run saved — ${r.name} (${r.status})`); return r; },
  deleteResultRun: async (r: ResultRun): Promise<void> => { await delay(250); await dbDelete("resultRuns", r.id); await logAudit("RESULT_RUN_DELETED", "result_run", `Result run deleted — ${r.name}`); },
  listResultLines: async (): Promise<ResultLine[]> => { await delay(); return dbGetAll("resultLines"); },
  saveResultLine: async (l: ResultLine): Promise<ResultLine> => { await delay(280); await dbPut("resultLines", l); await logAudit("RESULT_LINE_SAVED", "result_line", `Result line saved — ${l.studentName} (${l.outcome}, ${l.grade})`); return l; },
  deleteResultLine: async (l: ResultLine): Promise<void> => { await delay(220); await dbDelete("resultLines", l.id); await logAudit("RESULT_LINE_DELETED", "result_line", `Result line deleted — ${l.studentName}`); },
  listResultPublications: async (): Promise<ResultPublication[]> => { await delay(); return dbGetAll("resultPublications"); },
  saveResultPublication: async (p: ResultPublication): Promise<ResultPublication> => { await delay(300); await dbPut("resultPublications", p); await logAudit("RESULT_PUBLICATION_SAVED", "result_publication", `Publication saved — ${p.resultRunId} (${p.status})`); return p; },
  deleteResultPublication: async (p: ResultPublication): Promise<void> => { await delay(220); await dbDelete("resultPublications", p.id); await logAudit("RESULT_PUBLICATION_DELETED", "result_publication", `Publication deleted — ${p.id}`); },
  listResultCorrections: async (): Promise<ResultCorrection[]> => { await delay(); return dbGetAll("resultCorrections"); },
  saveResultCorrection: async (c: ResultCorrection): Promise<ResultCorrection> => { await delay(300); await dbPut("resultCorrections", c); await logAudit("RESULT_CORRECTION_SAVED", "result_correction", `Correction saved — ${c.resultLineId} (${c.type}, ${c.status})`); return c; },
  deleteResultCorrection: async (c: ResultCorrection): Promise<void> => { await delay(220); await dbDelete("resultCorrections", c.id); await logAudit("RESULT_CORRECTION_DELETED", "result_correction", `Correction deleted — ${c.id}`); },
  listMarksheets: async (): Promise<Marksheet[]> => { await delay(); return dbGetAll("marksheets"); },
  saveMarksheet: async (m: Marksheet): Promise<Marksheet> => { await delay(300); await dbPut("marksheets", m); await logAudit("MARKSHEET_SAVED", "marksheet", `Marksheet saved — ${m.studentName} (${m.serial}, ${m.status})`); return m; },
  deleteMarksheet: async (m: Marksheet): Promise<void> => { await delay(250); await dbDelete("marksheets", m.id); await logAudit("MARKSHEET_DELETED", "marksheet", `Marksheet deleted — ${m.serial}`); },
  listTranscripts: async (): Promise<Transcript[]> => { await delay(); return dbGetAll("transcripts"); },
  saveTranscript: async (t: Transcript): Promise<Transcript> => { await delay(300); await dbPut("transcripts", t); await logAudit("TRANSCRIPT_SAVED", "transcript", `Transcript saved — ${t.studentName} (${t.fromPeriod}→${t.toPeriod})`); return t; },
  deleteTranscript: async (t: Transcript): Promise<void> => { await delay(220); await dbDelete("transcripts", t.id); await logAudit("TRANSCRIPT_DELETED", "transcript", `Transcript deleted — ${t.id}`); },
  listCertificates: async (): Promise<Certificate[]> => { await delay(); return dbGetAll("certificates"); },
  saveCertificate: async (c: Certificate): Promise<Certificate> => { await delay(300); await dbPut("certificates", c); await logAudit("CERTIFICATE_SAVED", "certificate", `Certificate saved — ${c.studentName} (${c.type}, ${c.serial})`); return c; },
  deleteCertificate: async (c: Certificate): Promise<void> => { await delay(220); await dbDelete("certificates", c.id); await logAudit("CERTIFICATE_DELETED", "certificate", `Certificate deleted — ${c.serial}`); },
  listCertificateRequests: async (): Promise<CertificateRequest[]> => { await delay(); return dbGetAll("certificateRequests"); },
  saveCertificateRequest: async (r: CertificateRequest): Promise<CertificateRequest> => { await delay(300); await dbPut("certificateRequests", r); await logAudit("CERT_REQUEST_SAVED", "certificate_request", `Cert request saved — ${r.studentName} (${r.certificateType}, ${r.status})`); return r; },
  deleteCertificateRequest: async (r: CertificateRequest): Promise<void> => { await delay(220); await dbDelete("certificateRequests", r.id); await logAudit("CERT_REQUEST_DELETED", "certificate_request", `Cert request deleted — ${r.id}`); },
  listDigitalCredentials: async (): Promise<DigitalCredential[]> => { await delay(); return dbGetAll("digitalCredentials"); },
  saveDigitalCredential: async (d: DigitalCredential): Promise<DigitalCredential> => { await delay(300); await dbPut("digitalCredentials", d); await logAudit("CREDENTIAL_SAVED", "digital_credential", `Credential saved — ${d.credentialCode} (${d.status})`); return d; },
  deleteDigitalCredential: async (d: DigitalCredential): Promise<void> => { await delay(220); await dbDelete("digitalCredentials", d.id); await logAudit("CREDENTIAL_DELETED", "digital_credential", `Credential deleted — ${d.credentialCode}`); },
  listCompletionRecords: async (): Promise<CompletionRecord[]> => { await delay(); return dbGetAll("completionRecords"); },
  saveCompletionRecord: async (c: CompletionRecord): Promise<CompletionRecord> => { await delay(300); await dbPut("completionRecords", c); await logAudit("COMPLETION_SAVED", "completion_record", `Completion saved — ${c.studentName} (${c.type}, ${c.status})`); return c; },
  deleteCompletionRecord: async (c: CompletionRecord): Promise<void> => { await delay(220); await dbDelete("completionRecords", c.id); await logAudit("COMPLETION_DELETED", "completion_record", `Completion deleted — ${c.studentName}`); },
});

// ── M11 Portals, Mobile and Self-Service ─────────────────────────────────
Object.assign(apiMethods, {
  listPortalAnnouncements: async (): Promise<PortalAnnouncement[]> => { await delay(); return dbGetAll("portalAnnouncements"); },
  savePortalAnnouncement: async (a: PortalAnnouncement): Promise<PortalAnnouncement> => { await delay(300); await dbPut("portalAnnouncements", a); await logAudit("PORTAL_ANNOUNCEMENT_SAVED", "portal_announcement", `Announcement saved — ${a.title} (${a.targetAudience}, ${a.status})`); return a; },
  deletePortalAnnouncement: async (a: PortalAnnouncement): Promise<void> => { await delay(220); await dbDelete("portalAnnouncements", a.id); await logAudit("PORTAL_ANNOUNCEMENT_DELETED", "portal_announcement", `Announcement deleted — ${a.title}`); },
  listPortalAccessLogs: async (): Promise<PortalAccessLog[]> => { await delay(); return dbGetAll("portalAccessLogs"); },
  savePortalAccessLog: async (l: PortalAccessLog): Promise<PortalAccessLog> => { await delay(280); await dbPut("portalAccessLogs", l); await logAudit("PORTAL_ACCESS_SAVED", "portal_access_log", `Access saved — ${l.userName} → ${l.portal} (${l.action})`); return l; },
  deletePortalAccessLog: async (l: PortalAccessLog): Promise<void> => { await delay(220); await dbDelete("portalAccessLogs", l.id); await logAudit("PORTAL_ACCESS_DELETED", "portal_access_log", `Access deleted — ${l.id}`); },
  listKioskSessions: async (): Promise<KioskSession[]> => { await delay(); return dbGetAll("kioskSessions"); },
  saveKioskSession: async (k: KioskSession): Promise<KioskSession> => { await delay(300); await dbPut("kioskSessions", k); await logAudit("KIOSK_SESSION_SAVED", "kiosk_session", `Kiosk session saved — ${k.kioskId} ${k.location} (${k.status})`); return k; },
  deleteKioskSession: async (k: KioskSession): Promise<void> => { await delay(220); await dbDelete("kioskSessions", k.id); await logAudit("KIOSK_SESSION_DELETED", "kiosk_session", `Kiosk session deleted — ${k.id}`); },
  listMobileDevices: async (): Promise<MobileDevice[]> => { await delay(); return dbGetAll("mobileDevices"); },
  saveMobileDevice: async (d: MobileDevice): Promise<MobileDevice> => { await delay(300); await dbPut("mobileDevices", d); await logAudit("MOBILE_DEVICE_SAVED", "mobile_device", `Device saved — ${d.deviceName} (${d.platform}, ${d.status})`); return d; },
  deleteMobileDevice: async (d: MobileDevice): Promise<void> => { await delay(220); await dbDelete("mobileDevices", d.id); await logAudit("MOBILE_DEVICE_DELETED", "mobile_device", `Device deleted — ${d.deviceName}`); },
  listOfflineSyncLogs: async (): Promise<OfflineSyncLog[]> => { await delay(); return dbGetAll("offlineSyncLogs"); },
  saveOfflineSyncLog: async (l: OfflineSyncLog): Promise<OfflineSyncLog> => { await delay(280); await dbPut("offlineSyncLogs", l); await logAudit("OFFLINE_SYNC_SAVED", "offline_sync_log", `Sync saved — ${l.deviceId} ${l.entityType} ${l.recordsSynced} (${l.status})`); return l; },
  deleteOfflineSyncLog: async (l: OfflineSyncLog): Promise<void> => { await delay(220); await dbDelete("offlineSyncLogs", l.id); await logAudit("OFFLINE_SYNC_DELETED", "offline_sync_log", `Sync deleted — ${l.id}`); },
  listAccessibilityProfiles: async (): Promise<AccessibilityProfile[]> => { await delay(); return dbGetAll("accessibilityProfiles"); },
  saveAccessibilityProfile: async (a: AccessibilityProfile): Promise<AccessibilityProfile> => { await delay(300); await dbPut("accessibilityProfiles", a); await logAudit("ACCESSIBILITY_SAVED", "accessibility_profile", `Accessibility saved — ${a.userName} (${a.theme})`); return a; },
  deleteAccessibilityProfile: async (a: AccessibilityProfile): Promise<void> => { await delay(220); await dbDelete("accessibilityProfiles", a.id); await logAudit("ACCESSIBILITY_DELETED", "accessibility_profile", `Accessibility deleted — ${a.userName}`); },
  listPortalTickets: async (): Promise<PortalTicket[]> => { await delay(); return dbGetAll("portalTickets"); },
  savePortalTicket: async (t: PortalTicket): Promise<PortalTicket> => { await delay(300); await dbPut("portalTickets", t); await logAudit("PORTAL_TICKET_SAVED", "portal_ticket", `Ticket saved — ${t.subject} (${t.category}, ${t.status})`); return t; },
  deletePortalTicket: async (t: PortalTicket): Promise<void> => { await delay(220); await dbDelete("portalTickets", t.id); await logAudit("PORTAL_TICKET_DELETED", "portal_ticket", `Ticket deleted — ${t.subject}`); },
  listStudentPortalProfiles: async (): Promise<StudentPortalProfile[]> => { await delay(); return dbGetAll("studentPortalProfiles"); },
  saveStudentPortalProfile: async (p: StudentPortalProfile): Promise<StudentPortalProfile> => { await delay(300); await dbPut("studentPortalProfiles", p); await logAudit("STUDENT_PORTAL_SAVED", "student_portal_profile", `Student portal saved — ${p.studentName} (${p.grade}-${p.section})`); return p; },
  deleteStudentPortalProfile: async (p: StudentPortalProfile): Promise<void> => { await delay(220); await dbDelete("studentPortalProfiles", p.id); await logAudit("STUDENT_PORTAL_DELETED", "student_portal_profile", `Student portal deleted — ${p.studentName}`); },
  listParentPortalProfiles: async (): Promise<ParentPortalProfile[]> => { await delay(); return dbGetAll("parentPortalProfiles"); },
  saveParentPortalProfile: async (p: ParentPortalProfile): Promise<ParentPortalProfile> => { await delay(300); await dbPut("parentPortalProfiles", p); await logAudit("PARENT_PORTAL_SAVED", "parent_portal_profile", `Parent portal saved — ${p.parentName} (${p.relation})`); return p; },
  deleteParentPortalProfile: async (p: ParentPortalProfile): Promise<void> => { await delay(220); await dbDelete("parentPortalProfiles", p.id); await logAudit("PARENT_PORTAL_DELETED", "parent_portal_profile", `Parent portal deleted — ${p.parentName}`); },
  listTeacherPortalProfiles: async (): Promise<TeacherPortalProfile[]> => { await delay(); return dbGetAll("teacherPortalProfiles"); },
  saveTeacherPortalProfile: async (p: TeacherPortalProfile): Promise<TeacherPortalProfile> => { await delay(300); await dbPut("teacherPortalProfiles", p); await logAudit("TEACHER_PORTAL_SAVED", "teacher_portal_profile", `Teacher portal saved — ${p.teacherName} (${p.assignedSections.join(",")})`); return p; },
  deleteTeacherPortalProfile: async (p: TeacherPortalProfile): Promise<void> => { await delay(220); await dbDelete("teacherPortalProfiles", p.id); await logAudit("TEACHER_PORTAL_DELETED", "teacher_portal_profile", `Teacher portal deleted — ${p.teacherName}`); },
  listManagementDashboards: async (): Promise<ManagementDashboard[]> => { await delay(); return dbGetAll("managementDashboards"); },
  saveManagementDashboard: async (d: ManagementDashboard): Promise<ManagementDashboard> => { await delay(300); await dbPut("managementDashboards", d); await logAudit("MGMT_DASHBOARD_SAVED", "management_dashboard", `Management dashboard saved — ${d.totalStudents} students, ${d.totalStaff} staff`); return d; },
  deleteManagementDashboard: async (d: ManagementDashboard): Promise<void> => { await delay(220); await dbDelete("managementDashboards", d.id); await logAudit("MGMT_DASHBOARD_DELETED", "management_dashboard", `Management dashboard deleted — ${d.id}`); },
});

// ── M12 Finance, Fees and Accounting ─────────────────────────────────────
Object.assign(apiMethods, {
  listFiscalYears: async (): Promise<FiscalYear[]> => { await delay(); return dbGetAll("fiscalYears"); },
  saveFiscalYear: async (f: FiscalYear): Promise<FiscalYear> => { await delay(300); await dbPut("fiscalYears", f); await logAudit("FISCAL_YEAR_SAVED", "fiscal_year", `Fiscal year saved — ${f.name} (${f.status})`); return f; },
  deleteFiscalYear: async (f: FiscalYear): Promise<void> => { await delay(250); await dbDelete("fiscalYears", f.id); await logAudit("FISCAL_YEAR_DELETED", "fiscal_year", `Fiscal year deleted — ${f.name}`); },
  listChartOfAccounts: async (): Promise<ChartOfAccount[]> => { await delay(); return dbGetAll("chartOfAccounts"); },
  saveChartOfAccount: async (c: ChartOfAccount): Promise<ChartOfAccount> => { await delay(300); await dbPut("chartOfAccounts", c); await logAudit("COA_SAVED", "chart_of_account", `CoA saved — ${c.code} ${c.name} (${c.type})`); return c; },
  deleteChartOfAccount: async (c: ChartOfAccount): Promise<void> => { await delay(220); await dbDelete("chartOfAccounts", c.id); await logAudit("COA_DELETED", "chart_of_account", `CoA deleted — ${c.name}`); },
  listJournalEntries: async (): Promise<JournalEntry[]> => { await delay(); return dbGetAll("journalEntries"); },
  saveJournalEntry: async (j: JournalEntry): Promise<JournalEntry> => { await delay(300); await dbPut("journalEntries", j); await logAudit("JOURNAL_SAVED", "journal_entry", `Journal saved — ${j.entryNo} (${j.status})`); return j; },
  deleteJournalEntry: async (j: JournalEntry): Promise<void> => { await delay(220); await dbDelete("journalEntries", j.id); await logAudit("JOURNAL_DELETED", "journal_entry", `Journal deleted — ${j.entryNo}`); },
  listFeeStructures: async (): Promise<FeeStructure[]> => { await delay(); return dbGetAll("feeStructures"); },
  saveFeeStructure: async (f: FeeStructure): Promise<FeeStructure> => { await delay(300); await dbPut("feeStructures", f); await logAudit("FEE_STRUCTURE_SAVED", "fee_structure", `Fee structure saved — ${f.name} (${f.code})`); return f; },
  deleteFeeStructure: async (f: FeeStructure): Promise<void> => { await delay(220); await dbDelete("feeStructures", f.id); await logAudit("FEE_STRUCTURE_DELETED", "fee_structure", `Fee structure deleted — ${f.name}`); },
  listFeeAssignments: async (): Promise<FeeAssignment[]> => { await delay(); return dbGetAll("feeAssignments"); },
  saveFeeAssignment: async (f: FeeAssignment): Promise<FeeAssignment> => { await delay(300); await dbPut("feeAssignments", f); await logAudit("FEE_ASSIGNMENT_SAVED", "fee_assignment", `Fee assignment saved — ${f.studentName} → ${f.feeStructureName ?? f.feeStructureId} (${f.status})`); return f; },
  deleteFeeAssignment: async (f: FeeAssignment): Promise<void> => { await delay(220); await dbDelete("feeAssignments", f.id); await logAudit("FEE_ASSIGNMENT_DELETED", "fee_assignment", `Fee assignment deleted — ${f.studentName}`); },
  listInvoices: async (): Promise<Invoice[]> => { await delay(); return dbGetAll("invoices"); },
  saveInvoice: async (i: Invoice): Promise<Invoice> => { await delay(320); await dbPut("invoices", i); await logAudit("INVOICE_SAVED", "invoice", `Invoice saved — ${i.invoiceNo} ${i.studentName} Rs ${i.amount} (${i.status})`); return i; },
  deleteInvoice: async (i: Invoice): Promise<void> => { await delay(250); await dbDelete("invoices", i.id); await logAudit("INVOICE_DELETED", "invoice", `Invoice deleted — ${i.invoiceNo}`); },
  listPayments: async (): Promise<Payment[]> => { await delay(); return dbGetAll("payments"); },
  savePayment: async (p: Payment): Promise<Payment> => { await delay(300); await dbPut("payments", p); await logAudit("PAYMENT_SAVED", "payment", `Payment saved — ${p.invoiceNo ?? p.invoiceId} Rs ${p.amount} (${p.method}, ${p.status})`); return p; },
  deletePayment: async (p: Payment): Promise<void> => { await delay(220); await dbDelete("payments", p.id); await logAudit("PAYMENT_DELETED", "payment", `Payment deleted — ${p.id}`); },
  listCreditNotes: async (): Promise<CreditNote[]> => { await delay(); return dbGetAll("creditNotes"); },
  saveCreditNote: async (c: CreditNote): Promise<CreditNote> => { await delay(300); await dbPut("creditNotes", c); await logAudit("CREDIT_NOTE_SAVED", "credit_note", `Credit note saved — ${c.invoiceNo ?? c.invoiceId} Rs ${c.amount} (${c.status})`); return c; },
  deleteCreditNote: async (c: CreditNote): Promise<void> => { await delay(220); await dbDelete("creditNotes", c.id); await logAudit("CREDIT_NOTE_DELETED", "credit_note", `Credit note deleted — ${c.id}`); },
  listVendorBills: async (): Promise<VendorBill[]> => { await delay(); return dbGetAll("vendorBills"); },
  saveVendorBill: async (v: VendorBill): Promise<VendorBill> => { await delay(300); await dbPut("vendorBills", v); await logAudit("VENDOR_BILL_SAVED", "vendor_bill", `Vendor bill saved — ${v.vendorName} ${v.billNo} Rs ${v.amount} (${v.status})`); return v; },
  deleteVendorBill: async (v: VendorBill): Promise<void> => { await delay(220); await dbDelete("vendorBills", v.id); await logAudit("VENDOR_BILL_DELETED", "vendor_bill", `Vendor bill deleted — ${v.billNo}`); },
  listExpenseClaims: async (): Promise<ExpenseClaim[]> => { await delay(); return dbGetAll("expenseClaims"); },
  saveExpenseClaim: async (e: ExpenseClaim): Promise<ExpenseClaim> => { await delay(300); await dbPut("expenseClaims", e); await logAudit("EXPENSE_CLAIM_SAVED", "expense_claim", `Claim saved — ${e.staffName} ${e.category} Rs ${e.amount} (${e.status})`); return e; },
  deleteExpenseClaim: async (e: ExpenseClaim): Promise<void> => { await delay(220); await dbDelete("expenseClaims", e.id); await logAudit("EXPENSE_CLAIM_DELETED", "expense_claim", `Claim deleted — ${e.id}`); },
  listRecurringJournals: async (): Promise<RecurringJournal[]> => { await delay(); return dbGetAll("recurringJournals"); },
  saveRecurringJournal: async (r: RecurringJournal): Promise<RecurringJournal> => { await delay(300); await dbPut("recurringJournals", r); await logAudit("RECURRING_JOURNAL_SAVED", "recurring_journal", `Recurring journal saved — ${r.name} (${r.frequency}, Rs ${r.amount})`); return r; },
  deleteRecurringJournal: async (r: RecurringJournal): Promise<void> => { await delay(220); await dbDelete("recurringJournals", r.id); await logAudit("RECURRING_JOURNAL_DELETED", "recurring_journal", `Recurring journal deleted — ${r.name}`); },
  listDisbursementEntries: async (): Promise<DisbursementEntry[]> => { await delay(); return dbGetAll("disbursementEntries"); },
  saveDisbursementEntry: async (d: DisbursementEntry): Promise<DisbursementEntry> => { await delay(300); await dbPut("disbursementEntries", d); await logAudit("DISBURSEMENT_SAVED", "disbursement_entry", `Disbursement saved — ${d.vendorName} ${d.billNumber} Rs ${d.amount} (${d.status})`); return d; },
  deleteDisbursementEntry: async (d: DisbursementEntry): Promise<void> => { await delay(220); await dbDelete("disbursementEntries", d.id); await logAudit("DISBURSEMENT_DELETED", "disbursement_entry", `Disbursement deleted — ${d.billNumber}`); },
  listBankReconciliations: async (): Promise<BankReconciliation[]> => { await delay(); return dbGetAll("bankReconciliations"); },
  saveBankReconciliation: async (b: BankReconciliation): Promise<BankReconciliation> => { await delay(300); await dbPut("bankReconciliations", b); await logAudit("BANK_RECONCILIATION_SAVED", "bank_reconciliation", `Reconciliation saved — ${b.bankName} ${b.statementDate} (Rs ${b.difference} diff)`); return b; },
  deleteBankReconciliation: async (b: BankReconciliation): Promise<void> => { await delay(220); await dbDelete("bankReconciliations", b.id); await logAudit("BANK_RECONCILIATION_DELETED", "bank_reconciliation", `Reconciliation deleted — ${b.id}`); },
  listBankReconciliationEntries: async (): Promise<BankReconciliationEntry[]> => { await delay(); return dbGetAll("bankReconciliationEntries"); },
  saveBankReconciliationEntry: async (b: BankReconciliationEntry): Promise<BankReconciliationEntry> => { await delay(300); await dbPut("bankReconciliationEntries", b); await logAudit("BANK_RECONCILIATION_ENTRY_SAVED", "bank_reconciliation_entry", `Reconciliation entry saved — ${b.description} Rs ${b.bankAmount} (${b.status})`); return b; },
  deleteBankReconciliationEntry: async (b: BankReconciliationEntry): Promise<void> => { await delay(220); await dbDelete("bankReconciliationEntries", b.id); await logAudit("BANK_RECONCILIATION_ENTRY_DELETED", "bank_reconciliation_entry", `Reconciliation entry deleted — ${b.id}`); },
  listBankAccounts: async (): Promise<BankAccount[]> => { await delay(); return dbGetAll("bankAccounts"); },
  saveBankAccount: async (b: BankAccount): Promise<BankAccount> => { await delay(300); await dbPut("bankAccounts", b); await logAudit("BANK_ACCOUNT_SAVED", "bank_account", `Bank account saved — ${b.bankName} ${b.accountNo} (${b.balance})`); return b; },
  deleteBankAccount: async (b: BankAccount): Promise<void> => { await delay(220); await dbDelete("bankAccounts", b.id); await logAudit("BANK_ACCOUNT_DELETED", "bank_account", `Bank account deleted — ${b.bankName}`); },
  listBudgets: async (): Promise<Budget[]> => { await delay(); return dbGetAll("budgets"); },
  saveBudget: async (b: Budget): Promise<Budget> => { await delay(300); await dbPut("budgets", b); await logAudit("BUDGET_SAVED", "budget", `Budget saved — ${b.department} ${b.allocatedAmount} (${b.status})`); return b; },
  deleteBudget: async (b: Budget): Promise<void> => { await delay(220); await dbDelete("budgets", b.id); await logAudit("BUDGET_DELETED", "budget", `Budget deleted — ${b.department}`); },
  listAccountsReceivable: async (): Promise<AccountsReceivable[]> => { await delay(); return dbGetAll("accountsReceivable"); },
  saveAccountsReceivable: async (a: AccountsReceivable): Promise<AccountsReceivable> => { await delay(300); await dbPut("accountsReceivable", a); await logAudit("AR_SAVED", "accounts_receivable", `AR saved — ${a.studentName} Rs ${a.balanceAmount} (${a.status})`); return a; },
  deleteAccountsReceivable: async (a: AccountsReceivable): Promise<void> => { await delay(220); await dbDelete("accountsReceivable", a.id); await logAudit("AR_DELETED", "accounts_receivable", `AR deleted — ${a.studentName}`); },
  listScholarshipSchemes: async (): Promise<ScholarshipScheme[]> => { await delay(); return dbGetAll("scholarshipSchemes"); },
  saveScholarshipScheme: async (s: ScholarshipScheme): Promise<ScholarshipScheme> => { await delay(300); await dbPut("scholarshipSchemes", s); await logAudit("SCHOLARSHIP_SAVED", "scholarship_scheme", `Scholarship saved — ${s.name} ${s.discountType} ${s.discountValue}% (${s.status})`); return s; },
  deleteScholarshipScheme: async (s: ScholarshipScheme): Promise<void> => { await delay(220); await dbDelete("scholarshipSchemes", s.id); await logAudit("SCHOLARSHIP_DELETED", "scholarship_scheme", `Scholarship deleted — ${s.name}`); },
  listOnlinePaymentTransactions: async (): Promise<OnlinePaymentTransaction[]> => { await delay(); return dbGetAll("onlinePaymentTransactions"); },
  saveOnlinePaymentTransaction: async (p: OnlinePaymentTransaction): Promise<OnlinePaymentTransaction> => { await delay(300); await dbPut("onlinePaymentTransactions", p); await logAudit("ONLINE_PAYMENT_SAVED", "online_payment", `Payment saved — ${p.studentName} Rs ${p.amount} (${p.gateway}, ${p.status})`); return p; },
  deleteOnlinePaymentTransaction: async (p: OnlinePaymentTransaction): Promise<void> => { await delay(220); await dbDelete("onlinePaymentTransactions", p.id); await logAudit("ONLINE_PAYMENT_DELETED", "online_payment", `Payment deleted — ${p.studentName}`); },
  listRefundRecords: async (): Promise<RefundRecord[]> => { await delay(); return dbGetAll("refundRecords"); },
  saveRefundRecord: async (r: RefundRecord): Promise<RefundRecord> => { await delay(300); await dbPut("refundRecords", r); await logAudit("REFUND_SAVED", "refund_record", `Refund saved — ${r.studentName} Rs ${r.amount} (${r.status})`); return r; },
  deleteRefundRecord: async (r: RefundRecord): Promise<void> => { await delay(220); await dbDelete("refundRecords", r.id); await logAudit("REFUND_DELETED", "refund_record", `Refund deleted — ${r.studentName}`); },
  listWriteOffEntries: async (): Promise<WriteOffEntry[]> => { await delay(); return dbGetAll("writeOffEntries"); },
  saveWriteOffEntry: async (w: WriteOffEntry): Promise<WriteOffEntry> => { await delay(300); await dbPut("writeOffEntries", w); await logAudit("WRITEOFF_SAVED", "write_off_entry", `Write-off saved — ${w.studentName} Rs ${w.amount} (${w.reason})`); return w; },
  deleteWriteOffEntry: async (w: WriteOffEntry): Promise<void> => { await delay(220); await dbDelete("writeOffEntries", w.id); await logAudit("WRITEOFF_DELETED", "write_off_entry", `Write-off deleted — ${w.studentName}`); },
  listDunningNotices: async (): Promise<DunningNotice[]> => { await delay(); return dbGetAll("dunningNotices"); },
  saveDunningNotice: async (d: DunningNotice): Promise<DunningNotice> => { await delay(300); await dbPut("dunningNotices", d); await logAudit("DUNNING_SAVED", "dunning_notice", `Dunning saved — ${d.studentName} Level: ${d.level} (${d.status})`); return d; },
  deleteDunningNotice: async (d: DunningNotice): Promise<void> => { await delay(220); await dbDelete("dunningNotices", d.id); await logAudit("DUNNING_DELETED", "dunning_notice", `Dunning deleted — ${d.studentName}`); },
  listCommitmentRecords: async (): Promise<CommitmentRecord[]> => { await delay(); return dbGetAll("commitmentRecords"); },
  saveCommitmentRecord: async (c: CommitmentRecord): Promise<CommitmentRecord> => { await delay(300); await dbPut("commitmentRecords", c); await logAudit("COMMITMENT_SAVED", "commitment_record", `Commitment saved — ${c.donorName} ${c.fundName} Rs ${c.amount} (${c.status})`); return c; },
  deleteCommitmentRecord: async (c: CommitmentRecord): Promise<void> => { await delay(220); await dbDelete("commitmentRecords", c.id); await logAudit("COMMITMENT_DELETED", "commitment_record", `Commitment deleted — ${c.donorName}`); },
  listTaxCodes: async (): Promise<TaxCode[]> => { await delay(); return dbGetAll("taxCodes"); },
  saveTaxCode: async (t: TaxCode): Promise<TaxCode> => { await delay(300); await dbPut("taxCodes", t); await logAudit("TAX_CODE_SAVED", "tax_code", `Tax code saved — ${t.code} ${t.name} ${t.rate}% (${t.type})`); return t; },
  deleteTaxCode: async (t: TaxCode): Promise<void> => { await delay(220); await dbDelete("taxCodes", t.id); await logAudit("TAX_CODE_DELETED", "tax_code", `Tax code deleted — ${t.code}`); },
  listAccrualEntries: async (): Promise<AccrualEntry[]> => { await delay(); return dbGetAll("accrualEntries"); },
  saveAccrualEntry: async (a: AccrualEntry): Promise<AccrualEntry> => { await delay(300); await dbPut("accrualEntries", a); await logAudit("ACCRUAL_SAVED", "accrual_entry", `Accrual saved — ${a.description} Rs ${a.amount} (${a.status})`); return a; },
  deleteAccrualEntry: async (a: AccrualEntry): Promise<void> => { await delay(220); await dbDelete("accrualEntries", a.id); await logAudit("ACCRUAL_DELETED", "accrual_entry", `Accrual deleted — ${a.description}`); },
  listFunds: async (): Promise<Fund[]> => { await delay(); return dbGetAll("funds"); },
  saveFund: async (f: Fund): Promise<Fund> => { await delay(300); await dbPut("funds", f); await logAudit("FUND_SAVED", "fund", `Fund saved — ${f.code} ${f.name} Rs ${f.balance} (${f.type})`); return f; },
  deleteFund: async (f: Fund): Promise<void> => { await delay(220); await dbDelete("funds", f.id); await logAudit("FUND_DELETED", "fund", `Fund deleted — ${f.name}`); },
  listPeriodCloseChecklists: async (): Promise<PeriodCloseChecklist[]> => { await delay(); return dbGetAll("periodCloseChecklists"); },
  savePeriodCloseChecklist: async (p: PeriodCloseChecklist): Promise<PeriodCloseChecklist> => { await delay(300); await dbPut("periodCloseChecklists", p); await logAudit("PERIOD_CLOSE_SAVED", "period_close_checklist", `Period close saved — ${p.periodName} (${p.status})`); return p; },
  deletePeriodCloseChecklist: async (p: PeriodCloseChecklist): Promise<void> => { await delay(220); await dbDelete("periodCloseChecklists", p.id); await logAudit("PERIOD_CLOSE_DELETED", "period_close_checklist", `Period close deleted — ${p.periodName}`); },
  listFinancialStatements: async (): Promise<FinancialStatement[]> => { await delay(); return dbGetAll("financialStatements"); },
  saveFinancialStatement: async (f: FinancialStatement): Promise<FinancialStatement> => { await delay(300); await dbPut("financialStatements", f); await logAudit("FIN_STATEMENT_SAVED", "financial_statement", `Statement saved — ${f.name} (${f.type}, ${f.status})`); return f; },
  deleteFinancialStatement: async (f: FinancialStatement): Promise<void> => { await delay(220); await dbDelete("financialStatements", f.id); await logAudit("FIN_STATEMENT_DELETED", "financial_statement", `Statement deleted — ${f.name}`); },
});

// ── M13 Human Resources and Payroll ──────────────────────────────────────
Object.assign(apiMethods, {
  listStaffProfiles: async (): Promise<StaffProfile[]> => { await delay(); return dbGetAll("staffProfiles"); },
  saveStaffProfile: async (s: StaffProfile): Promise<StaffProfile> => { await delay(300); await dbPut("staffProfiles", s); await logAudit("STAFF_PROFILE_SAVED", "staff_profile", `Staff saved — ${s.name} (${s.staffCode}, ${s.status})`); return s; },
  deleteStaffProfile: async (s: StaffProfile): Promise<void> => { await delay(220); await dbDelete("staffProfiles", s.id); await logAudit("STAFF_PROFILE_DELETED", "staff_profile", `Staff deleted — ${s.name}`); },
  listPositions: async (): Promise<Position[]> => { await delay(); return dbGetAll("positions"); },
  savePosition: async (p: Position): Promise<Position> => { await delay(300); await dbPut("positions", p); await logAudit("POSITION_SAVED", "position", `Position saved — ${p.title} (${p.department}, ${p.isVacant ? "vacant" : "filled"})`); return p; },
  deletePosition: async (p: Position): Promise<void> => { await delay(220); await dbDelete("positions", p.id); await logAudit("POSITION_DELETED", "position", `Position deleted — ${p.title}`); },
  listRecruitments: async (): Promise<Recruitment[]> => { await delay(); return dbGetAll("recruitments"); },
  saveRecruitment: async (r: Recruitment): Promise<Recruitment> => { await delay(300); await dbPut("recruitments", r); await logAudit("RECRUITMENT_SAVED", "recruitment", `Recruitment saved — ${r.applicantName} for ${r.positionTitle ?? r.positionId} (${r.stage})`); return r; },
  deleteRecruitment: async (r: Recruitment): Promise<void> => { await delay(220); await dbDelete("recruitments", r.id); await logAudit("RECRUITMENT_DELETED", "recruitment", `Recruitment deleted — ${r.applicantName}`); },
  listLeaveRequests: async (): Promise<LeaveRequest[]> => { await delay(); return dbGetAll("leaveRequests"); },
  saveLeaveRequest: async (l: LeaveRequest): Promise<LeaveRequest> => { await delay(320); await dbPut("leaveRequests", l); await logAudit("LEAVE_REQUEST_SAVED", "leave_request", `Leave saved — ${l.staffName} ${l.leaveType} ${l.fromDate}→${l.toDate} (${l.status})`); return l; },
  deleteLeaveRequest: async (l: LeaveRequest): Promise<void> => { await delay(220); await dbDelete("leaveRequests", l.id); await logAudit("LEAVE_REQUEST_DELETED", "leave_request", `Leave deleted — ${l.staffName}`); },
  listPerformanceReviews: async (): Promise<PerformanceReview[]> => { await delay(); return dbGetAll("performanceReviews"); },
  savePerformanceReview: async (r: PerformanceReview): Promise<PerformanceReview> => { await delay(300); await dbPut("performanceReviews", r); await logAudit("PERFORMANCE_SAVED", "performance_review", `Review saved — ${r.staffName} ${r.rating} (${r.status})`); return r; },
  deletePerformanceReview: async (r: PerformanceReview): Promise<void> => { await delay(220); await dbDelete("performanceReviews", r.id); await logAudit("PERFORMANCE_DELETED", "performance_review", `Review deleted — ${r.staffName}`); },
  listCompensations: async (): Promise<Compensation[]> => { await delay(); return dbGetAll("compensations"); },
  saveCompensation: async (c: Compensation): Promise<Compensation> => { await delay(300); await dbPut("compensations", c); await logAudit("COMPENSATION_SAVED", "compensation", `Compensation saved — ${c.staffName} ${c.component} Rs ${c.amount}`); return c; },
  deleteCompensation: async (c: Compensation): Promise<void> => { await delay(220); await dbDelete("compensations", c.id); await logAudit("COMPENSATION_DELETED", "compensation", `Compensation deleted — ${c.staffName}`); },
  listPayrollRuns: async (): Promise<PayrollRun[]> => { await delay(); return dbGetAll("payrollRuns"); },
  savePayrollRun: async (r: PayrollRun): Promise<PayrollRun> => { await delay(320); await dbPut("payrollRuns", r); await logAudit("PAYROLL_RUN_SAVED", "payroll_run", `Payroll run saved — ${r.month}/${r.year} (${r.status}) Rs ${r.totalAmount}`); return r; },
  deletePayrollRun: async (r: PayrollRun): Promise<void> => { await delay(220); await dbDelete("payrollRuns", r.id); await logAudit("PAYROLL_RUN_DELETED", "payroll_run", `Payroll run deleted — ${r.id}`); },
  listPayslips: async (): Promise<Payslip[]> => { await delay(); return dbGetAll("payslips"); },
  savePayslip: async (p: Payslip): Promise<Payslip> => { await delay(300); await dbPut("payslips", p); await logAudit("PAYSLIP_SAVED", "payslip", `Payslip saved — ${p.staffName} net Rs ${p.net} (${p.status})`); return p; },
  deletePayslip: async (p: Payslip): Promise<void> => { await delay(220); await dbDelete("payslips", p.id); await logAudit("PAYSLIP_DELETED", "payslip", `Payslip deleted — ${p.staffName}`); },
  listSeparations: async (): Promise<Separation[]> => { await delay(); return dbGetAll("separations"); },
  saveSeparation: async (s: Separation): Promise<Separation> => { await delay(300); await dbPut("separations", s); await logAudit("SEPARATION_SAVED", "separation", `Separation saved — ${s.staffName} (${s.type}, ${s.status})`); return s; },
  deleteSeparation: async (s: Separation): Promise<void> => { await delay(220); await dbDelete("separations", s.id); await logAudit("SEPARATION_DELETED", "separation", `Separation deleted — ${s.staffName}`); },
  listStaffContracts: async (): Promise<StaffContract[]> => { await delay(); return dbGetAll("staffContracts"); },
  saveStaffContract: async (c: StaffContract): Promise<StaffContract> => { await delay(300); await dbPut("staffContracts", c); await logAudit("STAFF_CONTRACT_SAVED", "staff_contract", `Contract saved — ${c.staffName} (${c.contractType}, ${c.status})`); return c; },
  deleteStaffContract: async (c: StaffContract): Promise<void> => { await delay(220); await dbDelete("staffContracts", c.id); await logAudit("STAFF_CONTRACT_DELETED", "staff_contract", `Contract deleted — ${c.staffName}`); },
});

// ── M16 Library and Learning Resources ─────────────────────────────────
Object.assign(apiMethods, {
  listLibraryResources: async (): Promise<LibraryResource[]> => { await delay(); return dbGetAll("libraryResources"); },
  saveLibraryResource: async (r: LibraryResource): Promise<LibraryResource> => { await delay(300); await dbPut("libraryResources", r); await logAudit("LIB_RESOURCE_SAVED", "library_resource", `Library resource saved — ${r.title} (${r.type}, ${r.status})`); return r; },
  deleteLibraryResource: async (r: LibraryResource): Promise<void> => { await delay(220); await dbDelete("libraryResources", r.id); await logAudit("LIB_RESOURCE_DELETED", "library_resource", `Library resource deleted — ${r.title}`); },
  listLibraryHoldings: async (): Promise<LibraryHolding[]> => { await delay(); return dbGetAll("libraryHoldings"); },
  saveLibraryHolding: async (h: LibraryHolding): Promise<LibraryHolding> => { await delay(300); await dbPut("libraryHoldings", h); await logAudit("LIB_HOLDING_SAVED", "library_holding", `Holding saved — ${h.barcode} ${h.copyNo} (${h.status})`); return h; },
  deleteLibraryHolding: async (h: LibraryHolding): Promise<void> => { await delay(220); await dbDelete("libraryHoldings", h.id); await logAudit("LIB_HOLDING_DELETED", "library_holding", `Holding deleted — ${h.barcode}`); },
  listLibraryMembers: async (): Promise<LibraryMember[]> => { await delay(); return dbGetAll("libraryMembers"); },
  saveLibraryMember: async (m: LibraryMember): Promise<LibraryMember> => { await delay(300); await dbPut("libraryMembers", m); await logAudit("LIB_MEMBER_SAVED", "library_member", `Member saved — ${m.userName} (${m.memberType}, ${m.status})`); return m; },
  deleteLibraryMember: async (m: LibraryMember): Promise<void> => { await delay(220); await dbDelete("libraryMembers", m.id); await logAudit("LIB_MEMBER_DELETED", "library_member", `Member deleted — ${m.userName}`); },
  listLibraryLoans: async (): Promise<LibraryLoan[]> => { await delay(); return dbGetAll("libraryLoans"); },
  saveLibraryLoan: async (l: LibraryLoan): Promise<LibraryLoan> => { await delay(300); await dbPut("libraryLoans", l); await logAudit("LIB_LOAN_SAVED", "library_loan", `Loan saved — ${l.memberName} → ${l.resourceTitle ?? l.holdingId} (${l.status})`); return l; },
  deleteLibraryLoan: async (l: LibraryLoan): Promise<void> => { await delay(220); await dbDelete("libraryLoans", l.id); await logAudit("LIB_LOAN_DELETED", "library_loan", `Loan deleted — ${l.id}`); },
  listLibraryReservations: async (): Promise<LibraryReservation[]> => { await delay(); return dbGetAll("libraryReservations"); },
  saveLibraryReservation: async (r: LibraryReservation): Promise<LibraryReservation> => { await delay(300); await dbPut("libraryReservations", r); await logAudit("LIB_RESERVATION_SAVED", "library_reservation", `Reservation saved — ${r.memberName} → ${r.resourceTitle ?? r.resourceId} (${r.status})`); return r; },
  deleteLibraryReservation: async (r: LibraryReservation): Promise<void> => { await delay(220); await dbDelete("libraryReservations", r.id); await logAudit("LIB_RESERVATION_DELETED", "library_reservation", `Reservation deleted — ${r.id}`); },
  listLibraryAcquisitions: async (): Promise<LibraryAcquisition[]> => { await delay(); return dbGetAll("libraryAcquisitions"); },
  saveLibraryAcquisition: async (a: LibraryAcquisition): Promise<LibraryAcquisition> => { await delay(300); await dbPut("libraryAcquisitions", a); await logAudit("LIB_ACQUISITION_SAVED", "library_acquisition", `Acquisition saved — ${a.title} ${a.orderNo} (${a.status})`); return a; },
  deleteLibraryAcquisition: async (a: LibraryAcquisition): Promise<void> => { await delay(220); await dbDelete("libraryAcquisitions", a.id); await logAudit("LIB_ACQUISITION_DELETED", "library_acquisition", `Acquisition deleted — ${a.title}`); },
  listDigitalResources: async (): Promise<DigitalResource[]> => { await delay(); return dbGetAll("digitalResources"); },
  saveDigitalResource: async (d: DigitalResource): Promise<DigitalResource> => { await delay(300); await dbPut("digitalResources", d); await logAudit("DIGITAL_RESOURCE_SAVED", "digital_resource", `Digital resource saved — ${d.title} (${d.provider}, ${d.status})`); return d; },
  deleteDigitalResource: async (d: DigitalResource): Promise<void> => { await delay(220); await dbDelete("digitalResources", d.id); await logAudit("DIGITAL_RESOURCE_DELETED", "digital_resource", `Digital resource deleted — ${d.title}`); },
});

// ── M17 Transport and Fleet ────────────────────────────────────────────
Object.assign(apiMethods, {
  listVehicles: async (): Promise<Vehicle[]> => { await delay(); return dbGetAll("vehicles"); },
  saveVehicle: async (v: Vehicle): Promise<Vehicle> => { await delay(320); await dbPut("vehicles", v); await logAudit("VEHICLE_SAVED", "vehicle", `Vehicle saved — ${v.registrationNo} (${v.type}, ${v.status})`); return v; },
  deleteVehicle: async (v: Vehicle): Promise<void> => { await delay(220); await dbDelete("vehicles", v.id); await logAudit("VEHICLE_DELETED", "vehicle", `Vehicle deleted — ${v.registrationNo}`); },
  listTransportRoutes: async (): Promise<TransportRoute[]> => { await delay(); return dbGetAll("transportRoutes"); },
  saveTransportRoute: async (r: TransportRoute): Promise<TransportRoute> => { await delay(300); await dbPut("transportRoutes", r); await logAudit("ROUTE_SAVED", "transport_route", `Route saved — ${r.code} ${r.name} (${r.status})`); return r; },
  deleteTransportRoute: async (r: TransportRoute): Promise<void> => { await delay(220); await dbDelete("transportRoutes", r.id); await logAudit("ROUTE_DELETED", "transport_route", `Route deleted — ${r.name}`); },
  listBusStops: async (): Promise<BusStop[]> => { await delay(); return dbGetAll("busStops"); },
  saveBusStop: async (b: BusStop): Promise<BusStop> => { await delay(300); await dbPut("busStops", b); await logAudit("BUS_STOP_SAVED", "bus_stop", `Stop saved — ${b.name} (Seq ${b.sequence})`); return b; },
  deleteBusStop: async (b: BusStop): Promise<void> => { await delay(220); await dbDelete("busStops", b.id); await logAudit("BUS_STOP_DELETED", "bus_stop", `Stop deleted — ${b.name}`); },
  listRouteSchedules: async (): Promise<RouteSchedule[]> => { await delay(); return dbGetAll("routeSchedules"); },
  saveRouteSchedule: async (r: RouteSchedule): Promise<RouteSchedule> => { await delay(300); await dbPut("routeSchedules", r); await logAudit("ROUTE_SCHEDULE_SAVED", "route_schedule", `Schedule saved — ${r.routeName ?? r.routeId} ${r.dayPattern}`); return r; },
  deleteRouteSchedule: async (r: RouteSchedule): Promise<void> => { await delay(220); await dbDelete("routeSchedules", r.id); await logAudit("ROUTE_SCHEDULE_DELETED", "route_schedule", `Schedule deleted — ${r.id}`); },
  listRiderAssignments: async (): Promise<RiderAssignment[]> => { await delay(); return dbGetAll("riderAssignments"); },
  saveRiderAssignment: async (r: RiderAssignment): Promise<RiderAssignment> => { await delay(320); await dbPut("riderAssignments", r); await logAudit("RIDER_ASSIGNMENT_SAVED", "rider_assignment", `Rider saved — ${r.riderName} → ${r.routeName ?? r.routeId} (${r.status})`); return r; },
  deleteRiderAssignment: async (r: RiderAssignment): Promise<void> => { await delay(220); await dbDelete("riderAssignments", r.id); await logAudit("RIDER_ASSIGNMENT_DELETED", "rider_assignment", `Rider deleted — ${r.riderName}`); },
  listBoardingLogs: async (): Promise<BoardingLog[]> => { await delay(); return dbGetAll("boardingLogs"); },
  saveBoardingLog: async (b: BoardingLog): Promise<BoardingLog> => { await delay(300); await dbPut("boardingLogs", b); await logAudit("BOARDING_LOG_SAVED", "boarding_log", `Boarding saved — ${b.riderName} (${b.boardingStatus})`); return b; },
  deleteBoardingLog: async (b: BoardingLog): Promise<void> => { await delay(220); await dbDelete("boardingLogs", b.id); await logAudit("BOARDING_LOG_DELETED", "boarding_log", `Boarding deleted — ${b.id}`); },
  listGpsTracks: async (): Promise<GpsTrack[]> => { await delay(); return dbGetAll("gpsTracks"); },
  saveGpsTrack: async (g: GpsTrack): Promise<GpsTrack> => { await delay(300); await dbPut("gpsTracks", g); await logAudit("GPS_TRACK_SAVED", "gps_track", `GPS saved — ${g.vehicleNo ?? g.vehicleId} ${g.status} @ ${g.latitude},${g.longitude}`); return g; },
  deleteGpsTrack: async (g: GpsTrack): Promise<void> => { await delay(220); await dbDelete("gpsTracks", g.id); await logAudit("GPS_TRACK_DELETED", "gps_track", `GPS deleted — ${g.id}`); },
  listVehicleMaintenance: async (): Promise<VehicleMaintenance[]> => { await delay(); return dbGetAll("vehicleMaintenance"); },
  saveVehicleMaintenance: async (v: VehicleMaintenance): Promise<VehicleMaintenance> => { await delay(300); await dbPut("vehicleMaintenance", v); await logAudit("VEHICLE_MAINTENANCE_SAVED", "vehicle_maintenance", `Maintenance saved — ${v.vehicleNo ?? v.vehicleId} ${v.type} (${v.status})`); return v; },
  deleteVehicleMaintenance: async (v: VehicleMaintenance): Promise<void> => { await delay(220); await dbDelete("vehicleMaintenance", v.id); await logAudit("VEHICLE_MAINTENANCE_DELETED", "vehicle_maintenance", `Maintenance deleted — ${v.id}`); },
});

// ── M19 Student Welfare & Discipline ──────────────────────────────────
Object.assign(apiMethods, {
  listHealthProfiles: async (): Promise<HealthProfile[]> => { await delay(); return dbGetAll("healthProfiles"); },
  saveHealthProfile: async (h: HealthProfile): Promise<HealthProfile> => { await delay(300); await dbPut("healthProfiles", h); await logAudit("HEALTH_PROFILE_SAVED", "health_profile", `Health profile saved — ${h.studentName} (${h.bloodGroup})`); return h; },
  deleteHealthProfile: async (h: HealthProfile): Promise<void> => { await delay(220); await dbDelete("healthProfiles", h.id); await logAudit("HEALTH_PROFILE_DELETED", "health_profile", `Health profile deleted — ${h.studentName}`); },
  listClinicVisits: async (): Promise<ClinicVisit[]> => { await delay(); return dbGetAll("clinicVisits"); },
  saveClinicVisit: async (c: ClinicVisit): Promise<ClinicVisit> => { await delay(300); await dbPut("clinicVisits", c); await logAudit("CLINIC_VISIT_SAVED", "clinic_visit", `Clinic visit saved — ${c.studentName} (${c.reason})`); return c; },
  deleteClinicVisit: async (c: ClinicVisit): Promise<void> => { await delay(220); await dbDelete("clinicVisits", c.id); await logAudit("CLINIC_VISIT_DELETED", "clinic_visit", `Clinic visit deleted — ${c.studentName}`); },
  listCounselingCases: async (): Promise<CounselingCase[]> => { await delay(); return dbGetAll("counselingCases"); },
  saveCounselingCase: async (c: CounselingCase): Promise<CounselingCase> => { await delay(300); await dbPut("counselingCases", c); await logAudit("COUNSELING_CASE_SAVED", "counseling_case", `Counseling case saved — ${c.studentName} (${c.caseType})`); return c; },
  deleteCounselingCase: async (c: CounselingCase): Promise<void> => { await delay(220); await dbDelete("counselingCases", c.id); await logAudit("COUNSELING_CASE_DELETED", "counseling_case", `Counseling case deleted — ${c.studentName}`); },
  listSupportNeeds: async (): Promise<SupportNeed[]> => { await delay(); return dbGetAll("supportNeeds"); },
  saveSupportNeed: async (s: SupportNeed): Promise<SupportNeed> => { await delay(300); await dbPut("supportNeeds", s); await logAudit("SUPPORT_NEED_SAVED", "support_need", `Support need saved — ${s.studentName} (${s.category})`); return s; },
  deleteSupportNeed: async (s: SupportNeed): Promise<void> => { await delay(220); await dbDelete("supportNeeds", s.id); await logAudit("SUPPORT_NEED_DELETED", "support_need", `Support need deleted — ${s.studentName}`); },
  listAccommodationPlans: async (): Promise<AccommodationPlan[]> => { await delay(); return dbGetAll("accommodationPlans"); },
  saveAccommodationPlan: async (a: AccommodationPlan): Promise<AccommodationPlan> => { await delay(300); await dbPut("accommodationPlans", a); await logAudit("ACCOMMODATION_PLAN_SAVED", "accommodation_plan", `Accommodation plan saved — ${a.studentName} (${a.status})`); return a; },
  deleteAccommodationPlan: async (a: AccommodationPlan): Promise<void> => { await delay(220); await dbDelete("accommodationPlans", a.id); await logAudit("ACCOMMODATION_PLAN_DELETED", "accommodation_plan", `Accommodation plan deleted — ${a.studentName}`); },
  listConductIncidents: async (): Promise<ConductIncident[]> => { await delay(); return dbGetAll("conductIncidents"); },
  saveConductIncident: async (c: ConductIncident): Promise<ConductIncident> => { await delay(300); await dbPut("conductIncidents", c); await logAudit("CONDUCT_INCIDENT_SAVED", "conduct_incident", `Conduct incident saved — ${c.studentName} (${c.category})`); return c; },
  deleteConductIncident: async (c: ConductIncident): Promise<void> => { await delay(220); await dbDelete("conductIncidents", c.id); await logAudit("CONDUCT_INCIDENT_DELETED", "conduct_incident", `Conduct incident deleted — ${c.studentName}`); },
  listConductActions: async (): Promise<ConductAction[]> => { await delay(); return dbGetAll("conductActions"); },
  saveConductAction: async (c: ConductAction): Promise<ConductAction> => { await delay(300); await dbPut("conductActions", c); await logAudit("CONDUCT_ACTION_SAVED", "conduct_action", `Conduct action saved — ${c.actionType} (${c.status})`); return c; },
  deleteConductAction: async (c: ConductAction): Promise<void> => { await delay(220); await dbDelete("conductActions", c.id); await logAudit("CONDUCT_ACTION_DELETED", "conduct_action", `Conduct action deleted — ${c.id}`); },
  listGrievances: async (): Promise<Grievance[]> => { await delay(); return dbGetAll("grievances"); },
  saveGrievance: async (g: Grievance): Promise<Grievance> => { await delay(300); await dbPut("grievances", g); await logAudit("GRIEVANCE_SAVED", "grievance", `Grievance saved — ${g.complainantName} (${g.category})`); return g; },
  deleteGrievance: async (g: Grievance): Promise<void> => { await delay(220); await dbDelete("grievances", g.id); await logAudit("GRIEVANCE_DELETED", "grievance", `Grievance deleted — ${g.complainantName}`); },
  listAdvisingAssignments: async (): Promise<AdvisingAssignment[]> => { await delay(); return dbGetAll("advisingAssignments"); },
  saveAdvisingAssignment: async (a: AdvisingAssignment): Promise<AdvisingAssignment> => { await delay(300); await dbPut("advisingAssignments", a); await logAudit("ADVISING_ASSIGNMENT_SAVED", "advising_assignment", `Advising assignment saved — ${a.studentName} → ${a.advisorName}`); return a; },
  deleteAdvisingAssignment: async (a: AdvisingAssignment): Promise<void> => { await delay(220); await dbDelete("advisingAssignments", a.id); await logAudit("ADVISING_ASSIGNMENT_DELETED", "advising_assignment", `Advising assignment deleted — ${a.studentName}`); },
  listInterventionPlans: async (): Promise<InterventionPlan[]> => { await delay(); return dbGetAll("interventionPlans"); },
  saveInterventionPlan: async (i: InterventionPlan): Promise<InterventionPlan> => { await delay(300); await dbPut("interventionPlans", i); await logAudit("INTERVENTION_PLAN_SAVED", "intervention_plan", `Intervention plan saved — ${i.studentName} (${i.status})`); return i; },
  deleteInterventionPlan: async (i: InterventionPlan): Promise<void> => { await delay(220); await dbDelete("interventionPlans", i.id); await logAudit("INTERVENTION_PLAN_DELETED", "intervention_plan", `Intervention plan deleted — ${i.studentName}`); },
});

// ── M20 Activities & Community ────────────────────────────────────────
Object.assign(apiMethods, {
  listCommunityEvents: async (): Promise<CommunityEvent[]> => { await delay(); return dbGetAll("communityEvents"); },
  saveCommunityEvent: async (e: CommunityEvent): Promise<CommunityEvent> => { await delay(300); await dbPut("communityEvents", e); await logAudit("COMMUNITY_EVENT_SAVED", "community_event", `Community event saved — ${e.name} (${e.type})`); return e; },
  deleteCommunityEvent: async (e: CommunityEvent): Promise<void> => { await delay(220); await dbDelete("communityEvents", e.id); await logAudit("COMMUNITY_EVENT_DELETED", "community_event", `Community event deleted — ${e.name}`); },
  listEventRegistrations: async (): Promise<EventRegistration[]> => { await delay(); return dbGetAll("eventRegistrations"); },
  saveEventRegistration: async (e: EventRegistration): Promise<EventRegistration> => { await delay(300); await dbPut("eventRegistrations", e); await logAudit("EVENT_REGISTRATION_SAVED", "event_registration", `Event registration saved — ${e.participantName} (${e.status})`); return e; },
  deleteEventRegistration: async (e: EventRegistration): Promise<void> => { await delay(220); await dbDelete("eventRegistrations", e.id); await logAudit("EVENT_REGISTRATION_DELETED", "event_registration", `Event registration deleted — ${e.participantName}`); },
  listActivityGroups: async (): Promise<ActivityGroup[]> => { await delay(); return dbGetAll("activityGroups"); },
  saveActivityGroup: async (a: ActivityGroup): Promise<ActivityGroup> => { await delay(300); await dbPut("activityGroups", a); await logAudit("ACTIVITY_GROUP_SAVED", "activity_group", `Activity group saved — ${a.name} (${a.type})`); return a; },
  deleteActivityGroup: async (a: ActivityGroup): Promise<void> => { await delay(220); await dbDelete("activityGroups", a.id); await logAudit("ACTIVITY_GROUP_DELETED", "activity_group", `Activity group deleted — ${a.name}`); },
  listGroupMemberships: async (): Promise<GroupMembership[]> => { await delay(); return dbGetAll("groupMemberships"); },
  saveGroupMembership: async (g: GroupMembership): Promise<GroupMembership> => { await delay(300); await dbPut("groupMemberships", g); await logAudit("GROUP_MEMBERSHIP_SAVED", "group_membership", `Group membership saved — ${g.memberName} → ${g.groupName} (${g.role})`); return g; },
  deleteGroupMembership: async (g: GroupMembership): Promise<void> => { await delay(220); await dbDelete("groupMemberships", g.id); await logAudit("GROUP_MEMBERSHIP_DELETED", "group_membership", `Group membership deleted — ${g.memberName}`); },
  listCompetitions: async (): Promise<Competition[]> => { await delay(); return dbGetAll("competitions"); },
  saveCompetition: async (c: Competition): Promise<Competition> => { await delay(300); await dbPut("competitions", c); await logAudit("COMPETITION_SAVED", "competition", `Competition saved — ${c.name} (${c.sport})`); return c; },
  deleteCompetition: async (c: Competition): Promise<void> => { await delay(220); await dbDelete("competitions", c.id); await logAudit("COMPETITION_DELETED", "competition", `Competition deleted — ${c.name}`); },
  listCompetitionEntries: async (): Promise<CompetitionEntry[]> => { await delay(); return dbGetAll("competitionEntries"); },
  saveCompetitionEntry: async (e: CompetitionEntry): Promise<CompetitionEntry> => { await delay(300); await dbPut("competitionEntries", e); await logAudit("COMPETITION_ENTRY_SAVED", "competition_entry", `Competition entry saved — ${e.teamName} (${e.category})`); return e; },
  deleteCompetitionEntry: async (e: CompetitionEntry): Promise<void> => { await delay(220); await dbDelete("competitionEntries", e.id); await logAudit("COMPETITION_ENTRY_DELETED", "competition_entry", `Competition entry deleted — ${e.teamName}`); },
  listCompetitionResults: async (): Promise<CompetitionResult[]> => { await delay(); return dbGetAll("competitionResults"); },
  saveCompetitionResult: async (r: CompetitionResult): Promise<CompetitionResult> => { await delay(300); await dbPut("competitionResults", r); await logAudit("COMPETITION_RESULT_SAVED", "competition_result", `Competition result saved — Rank ${r.rank} (${r.award})`); return r; },
  deleteCompetitionResult: async (r: CompetitionResult): Promise<void> => { await delay(220); await dbDelete("competitionResults", r.id); await logAudit("COMPETITION_RESULT_DELETED", "competition_result", `Competition result deleted — ${r.id}`); },
  listTrips: async (): Promise<Trip[]> => { await delay(); return dbGetAll("trips"); },
  saveTrip: async (t: Trip): Promise<Trip> => { await delay(300); await dbPut("trips", t); await logAudit("TRIP_SAVED", "trip", `Trip saved — ${t.name} → ${t.destination} (${t.status})`); return t; },
  deleteTrip: async (t: Trip): Promise<void> => { await delay(220); await dbDelete("trips", t.id); await logAudit("TRIP_DELETED", "trip", `Trip deleted — ${t.name}`); },
  listTripParticipants: async (): Promise<TripParticipant[]> => { await delay(); return dbGetAll("tripParticipants"); },
  saveTripParticipant: async (t: TripParticipant): Promise<TripParticipant> => { await delay(300); await dbPut("tripParticipants", t); await logAudit("TRIP_PARTICIPANT_SAVED", "trip_participant", `Trip participant saved — ${t.studentName} (${t.status})`); return t; },
  deleteTripParticipant: async (t: TripParticipant): Promise<void> => { await delay(220); await dbDelete("tripParticipants", t.id); await logAudit("TRIP_PARTICIPANT_DELETED", "trip_participant", `Trip participant deleted — ${t.studentName}`); },
  listPtmEvents: async (): Promise<PTMEvent[]> => { await delay(); return dbGetAll("ptmEvents"); },
  savePtmEvent: async (p: PTMEvent): Promise<PTMEvent> => { await delay(300); await dbPut("ptmEvents", p); await logAudit("PTM_EVENT_SAVED", "ptm_event", `PTM event saved — ${p.name} (${p.status})`); return p; },
  deletePtmEvent: async (p: PTMEvent): Promise<void> => { await delay(220); await dbDelete("ptmEvents", p.id); await logAudit("PTM_EVENT_DELETED", "ptm_event", `PTM event deleted — ${p.name}`); },
  listPtmBookings: async (): Promise<PTMBooking[]> => { await delay(); return dbGetAll("ptmBookings"); },
  savePtmBooking: async (p: PTMBooking): Promise<PTMBooking> => { await delay(300); await dbPut("ptmBookings", p); await logAudit("PTM_BOOKING_SAVED", "ptm_booking", `PTM booking saved — ${p.parentName} → ${p.teacherName} (${p.status})`); return p; },
  deletePtmBooking: async (p: PTMBooking): Promise<void> => { await delay(220); await dbDelete("ptmBookings", p.id); await logAudit("PTM_BOOKING_DELETED", "ptm_booking", `PTM booking deleted — ${p.parentName}`); },
  listFundraisingCampaigns: async (): Promise<FundraisingCampaign[]> => { await delay(); return dbGetAll("fundraisingCampaigns"); },
  saveFundraisingCampaign: async (f: FundraisingCampaign): Promise<FundraisingCampaign> => { await delay(300); await dbPut("fundraisingCampaigns", f); await logAudit("FUNDRAISING_CAMPAIGN_SAVED", "fundraising_campaign", `Fundraising campaign saved — ${f.name} (${f.status})`); return f; },
  deleteFundraisingCampaign: async (f: FundraisingCampaign): Promise<void> => { await delay(220); await dbDelete("fundraisingCampaigns", f.id); await logAudit("FUNDRAISING_CAMPAIGN_DELETED", "fundraising_campaign", `Fundraising campaign deleted — ${f.name}`); },
  listDonations: async (): Promise<Donation[]> => { await delay(); return dbGetAll("donations"); },
  saveDonation: async (d: Donation): Promise<Donation> => { await delay(300); await dbPut("donations", d); await logAudit("DONATION_SAVED", "donation", `Donation saved — ${d.donorName} ${d.amount} (${d.method})`); return d; },
  deleteDonation: async (d: Donation): Promise<void> => { await delay(220); await dbDelete("donations", d.id); await logAudit("DONATION_DELETED", "donation", `Donation deleted — ${d.donorName}`); },
});

// ── M21 Senior Secondary & Alumni ─────────────────────────────────────
Object.assign(apiMethods, {
  listSubjectCombinationRules: async (): Promise<SubjectCombinationRule[]> => { await delay(); return dbGetAll("subjectCombinationRules"); },
  saveSubjectCombinationRule: async (s: SubjectCombinationRule): Promise<SubjectCombinationRule> => { await delay(300); await dbPut("subjectCombinationRules", s); await logAudit("SUBJECT_COMBINATION_RULE_SAVED", "subject_combination_rule", `Subject combination rule saved — ${s.board} ${s.grade} (${s.stream})`); return s; },
  deleteSubjectCombinationRule: async (s: SubjectCombinationRule): Promise<void> => { await delay(220); await dbDelete("subjectCombinationRules", s.id); await logAudit("SUBJECT_COMBINATION_RULE_DELETED", "subject_combination_rule", `Subject combination rule deleted — ${s.id}`); },
  listStudentSubjectPlans: async (): Promise<StudentSubjectPlan[]> => { await delay(); return dbGetAll("studentSubjectPlans"); },
  saveStudentSubjectPlan: async (s: StudentSubjectPlan): Promise<StudentSubjectPlan> => { await delay(300); await dbPut("studentSubjectPlans", s); await logAudit("STUDENT_SUBJECT_PLAN_SAVED", "student_subject_plan", `Student subject plan saved — ${s.studentName} (${s.status})`); return s; },
  deleteStudentSubjectPlan: async (s: StudentSubjectPlan): Promise<void> => { await delay(220); await dbDelete("studentSubjectPlans", s.id); await logAudit("STUDENT_SUBJECT_PLAN_DELETED", "student_subject_plan", `Student subject plan deleted — ${s.studentName}`); },
  listBoardRegistrations: async (): Promise<BoardRegistration[]> => { await delay(); return dbGetAll("boardRegistrations"); },
  saveBoardRegistration: async (b: BoardRegistration): Promise<BoardRegistration> => { await delay(300); await dbPut("boardRegistrations", b); await logAudit("BOARD_REGISTRATION_SAVED", "board_registration", `Board registration saved — ${b.studentName} (${b.board})`); return b; },
  deleteBoardRegistration: async (b: BoardRegistration): Promise<void> => { await delay(220); await dbDelete("boardRegistrations", b.id); await logAudit("BOARD_REGISTRATION_DELETED", "board_registration", `Board registration deleted — ${b.studentName}`); },
  listReadinessChecks: async (): Promise<ReadinessCheck[]> => { await delay(); return dbGetAll("readinessChecks"); },
  saveReadinessCheck: async (r: ReadinessCheck): Promise<ReadinessCheck> => { await delay(300); await dbPut("readinessChecks", r); await logAudit("READINESS_CHECK_SAVED", "readiness_check", `Readiness check saved — ${r.checkType} (${r.outcome})`); return r; },
  deleteReadinessCheck: async (r: ReadinessCheck): Promise<void> => { await delay(220); await dbDelete("readinessChecks", r.id); await logAudit("READINESS_CHECK_DELETED", "readiness_check", `Readiness check deleted — ${r.id}`); },
  listInternalAssessmentSnapshots: async (): Promise<InternalAssessmentSnapshot[]> => { await delay(); return dbGetAll("internalAssessmentSnapshots"); },
  saveInternalAssessmentSnapshot: async (i: InternalAssessmentSnapshot): Promise<InternalAssessmentSnapshot> => { await delay(300); await dbPut("internalAssessmentSnapshots", i); await logAudit("INTERNAL_ASSESSMENT_SNAPSHOT_SAVED", "internal_assessment_snapshot", `Internal assessment snapshot saved — ${i.subjectName} (${i.totalMarks})`); return i; },
  deleteInternalAssessmentSnapshot: async (i: InternalAssessmentSnapshot): Promise<void> => { await delay(220); await dbDelete("internalAssessmentSnapshots", i.id); await logAudit("INTERNAL_ASSESSMENT_SNAPSHOT_DELETED", "internal_assessment_snapshot", `Internal assessment snapshot deleted — ${i.id}`); },
  listGuidanceProfiles: async (): Promise<GuidanceProfile[]> => { await delay(); return dbGetAll("guidanceProfiles"); },
  saveGuidanceProfile: async (g: GuidanceProfile): Promise<GuidanceProfile> => { await delay(300); await dbPut("guidanceProfiles", g); await logAudit("GUIDANCE_PROFILE_SAVED", "guidance_profile", `Guidance profile saved — ${g.studentName} (${g.status})`); return g; },
  deleteGuidanceProfile: async (g: GuidanceProfile): Promise<void> => { await delay(220); await dbDelete("guidanceProfiles", g.id); await logAudit("GUIDANCE_PROFILE_DELETED", "guidance_profile", `Guidance profile deleted — ${g.studentName}`); },
  listGuidanceSessions: async (): Promise<GuidanceSession[]> => { await delay(); return dbGetAll("guidanceSessions"); },
  saveGuidanceSession: async (g: GuidanceSession): Promise<GuidanceSession> => { await delay(300); await dbPut("guidanceSessions", g); await logAudit("GUIDANCE_SESSION_SAVED", "guidance_session", `Guidance session saved — ${g.studentName} → ${g.counselorName} (${g.status})`); return g; },
  deleteGuidanceSession: async (g: GuidanceSession): Promise<void> => { await delay(220); await dbDelete("guidanceSessions", g.id); await logAudit("GUIDANCE_SESSION_DELETED", "guidance_session", `Guidance session deleted — ${g.studentName}`); },
  listExternalApplications: async (): Promise<ExternalApplication[]> => { await delay(); return dbGetAll("externalApplications"); },
  saveExternalApplication: async (e: ExternalApplication): Promise<ExternalApplication> => { await delay(300); await dbPut("externalApplications", e); await logAudit("EXTERNAL_APPLICATION_SAVED", "external_application", `External application saved — ${e.studentName} → ${e.destination} (${e.status})`); return e; },
  deleteExternalApplication: async (e: ExternalApplication): Promise<void> => { await delay(220); await dbDelete("externalApplications", e.id); await logAudit("EXTERNAL_APPLICATION_DELETED", "external_application", `External application deleted — ${e.studentName}`); },
  listSchoolExitCases: async (): Promise<SchoolExitCase[]> => { await delay(); return dbGetAll("schoolExitCases"); },
  saveSchoolExitCase: async (s: SchoolExitCase): Promise<SchoolExitCase> => { await delay(300); await dbPut("schoolExitCases", s); await logAudit("SCHOOL_EXIT_CASE_SAVED", "school_exit_case", `School exit case saved — ${s.studentName} (${s.leavingType})`); return s; },
  deleteSchoolExitCase: async (s: SchoolExitCase): Promise<void> => { await delay(220); await dbDelete("schoolExitCases", s.id); await logAudit("SCHOOL_EXIT_CASE_DELETED", "school_exit_case", `School exit case deleted — ${s.studentName}`); },
  listMigrationDocuments: async (): Promise<MigrationDocument[]> => { await delay(); return dbGetAll("migrationDocuments"); },
  saveMigrationDocument: async (m: MigrationDocument): Promise<MigrationDocument> => { await delay(300); await dbPut("migrationDocuments", m); await logAudit("MIGRATION_DOCUMENT_SAVED", "migration_document", `Migration document saved — ${m.documentType} (${m.documentNo})`); return m; },
  deleteMigrationDocument: async (m: MigrationDocument): Promise<void> => { await delay(220); await dbDelete("migrationDocuments", m.id); await logAudit("MIGRATION_DOCUMENT_DELETED", "migration_document", `Migration document deleted — ${m.id}`); },
  listFormerStudents: async (): Promise<FormerStudent[]> => { await delay(); return dbGetAll("formerStudents"); },
  saveFormerStudent: async (f: FormerStudent): Promise<FormerStudent> => { await delay(300); await dbPut("formerStudents", f); await logAudit("FORMER_STUDENT_SAVED", "former_student", `Former student saved — ${f.studentName} (${f.status})`); return f; },
  deleteFormerStudent: async (f: FormerStudent): Promise<void> => { await delay(220); await dbDelete("formerStudents", f.id); await logAudit("FORMER_STUDENT_DELETED", "former_student", `Former student deleted — ${f.studentName}`); },
  listAlumniPreferences: async (): Promise<AlumniPreference[]> => { await delay(); return dbGetAll("alumniPreferences"); },
  saveAlumniPreference: async (a: AlumniPreference): Promise<AlumniPreference> => { await delay(300); await dbPut("alumniPreferences", a); await logAudit("ALUMNI_PREFERENCE_SAVED", "alumni_preference", `Alumni preference saved — ${a.channel} (${a.purpose})`); return a; },
  deleteAlumniPreference: async (a: AlumniPreference): Promise<void> => { await delay(220); await dbDelete("alumniPreferences", a.id); await logAudit("ALUMNI_PREFERENCE_DELETED", "alumni_preference", `Alumni preference deleted — ${a.id}`); },
});

// ── M19 Health, Welfare and Student Conduct ──────────────────────────────
Object.assign(apiMethods, {
  listHealthProfiles: async (): Promise<HealthProfile[]> => { await delay(); return dbGetAll("healthProfiles"); },
  saveHealthProfile: async (h: HealthProfile): Promise<HealthProfile> => { await delay(300); await dbPut("healthProfiles", h); await logAudit("HEALTH_PROFILE_SAVED", "health_profile", `Health profile saved — ${h.studentName} (${h.bloodGroup}, ${h.status})`); return h; },
  deleteHealthProfile: async (h: HealthProfile): Promise<void> => { await delay(220); await dbDelete("healthProfiles", h.id); await logAudit("HEALTH_PROFILE_DELETED", "health_profile", `Health profile deleted — ${h.studentName}`); },
  listClinicVisits: async (): Promise<ClinicVisit[]> => { await delay(); return dbGetAll("clinicVisits"); },
  saveClinicVisit: async (c: ClinicVisit): Promise<ClinicVisit> => { await delay(300); await dbPut("clinicVisits", c); await logAudit("CLINIC_VISIT_SAVED", "clinic_visit", `Clinic visit saved — ${c.studentName} (${c.visitDate}, ${c.status})`); return c; },
  deleteClinicVisit: async (c: ClinicVisit): Promise<void> => { await delay(220); await dbDelete("clinicVisits", c.id); await logAudit("CLINIC_VISIT_DELETED", "clinic_visit", `Clinic visit deleted — ${c.studentName}`); },
  listCounselingCases: async (): Promise<CounselingCase[]> => { await delay(); return dbGetAll("counselingCases"); },
  saveCounselingCase: async (c: CounselingCase): Promise<CounselingCase> => { await delay(300); await dbPut("counselingCases", c); await logAudit("COUNSELING_CASE_SAVED", "counseling_case", `Counseling case saved — ${c.studentName} (${c.caseType}, ${c.status})`); return c; },
  deleteCounselingCase: async (c: CounselingCase): Promise<void> => { await delay(220); await dbDelete("counselingCases", c.id); await logAudit("COUNSELING_CASE_DELETED", "counseling_case", `Counseling case deleted — ${c.studentName}`); },
  listSupportNeeds: async (): Promise<SupportNeed[]> => { await delay(); return dbGetAll("supportNeeds"); },
  saveSupportNeed: async (s: SupportNeed): Promise<SupportNeed> => { await delay(300); await dbPut("supportNeeds", s); await logAudit("SUPPORT_NEED_SAVED", "support_need", `Support need saved — ${s.studentName} (${s.category}, ${s.status})`); return s; },
  deleteSupportNeed: async (s: SupportNeed): Promise<void> => { await delay(220); await dbDelete("supportNeeds", s.id); await logAudit("SUPPORT_NEED_DELETED", "support_need", `Support need deleted — ${s.studentName}`); },
  listAccommodationPlans: async (): Promise<AccommodationPlan[]> => { await delay(); return dbGetAll("accommodationPlans"); },
  saveAccommodationPlan: async (a: AccommodationPlan): Promise<AccommodationPlan> => { await delay(300); await dbPut("accommodationPlans", a); await logAudit("ACCOMMODATION_PLAN_SAVED", "accommodation_plan", `Accommodation plan saved — ${a.studentName} (${a.status})`); return a; },
  deleteAccommodationPlan: async (a: AccommodationPlan): Promise<void> => { await delay(220); await dbDelete("accommodationPlans", a.id); await logAudit("ACCOMMODATION_PLAN_DELETED", "accommodation_plan", `Accommodation plan deleted — ${a.studentName}`); },
  listConductIncidents: async (): Promise<ConductIncident[]> => { await delay(); return dbGetAll("conductIncidents"); },
  saveConductIncident: async (c: ConductIncident): Promise<ConductIncident> => { await delay(300); await dbPut("conductIncidents", c); await logAudit("CONDUCT_INCIDENT_SAVED", "conduct_incident", `Conduct incident saved — ${c.studentName} (${c.category}, ${c.status})`); return c; },
  deleteConductIncident: async (c: ConductIncident): Promise<void> => { await delay(220); await dbDelete("conductIncidents", c.id); await logAudit("CONDUCT_INCIDENT_DELETED", "conduct_incident", `Conduct incident deleted — ${c.studentName}`); },
  listConductActions: async (): Promise<ConductAction[]> => { await delay(); return dbGetAll("conductActions"); },
  saveConductAction: async (a: ConductAction): Promise<ConductAction> => { await delay(300); await dbPut("conductActions", a); await logAudit("CONDUCT_ACTION_SAVED", "conduct_action", `Conduct action saved — ${a.actionType} (${a.status})`); return a; },
  deleteConductAction: async (a: ConductAction): Promise<void> => { await delay(220); await dbDelete("conductActions", a.id); await logAudit("CONDUCT_ACTION_DELETED", "conduct_action", `Conduct action deleted — ${a.actionType}`); },
  listGrievances: async (): Promise<Grievance[]> => { await delay(); return dbGetAll("grievances"); },
  saveGrievance: async (g: Grievance): Promise<Grievance> => { await delay(300); await dbPut("grievances", g); await logAudit("GRIEVANCE_SAVED", "grievance", `Grievance saved — ${g.complainantName} (${g.category}, ${g.status})`); return g; },
  deleteGrievance: async (g: Grievance): Promise<void> => { await delay(220); await dbDelete("grievances", g.id); await logAudit("GRIEVANCE_DELETED", "grievance", `Grievance deleted — ${g.complainantName}`); },
  listAdvisingAssignments: async (): Promise<AdvisingAssignment[]> => { await delay(); return dbGetAll("advisingAssignments"); },
  saveAdvisingAssignment: async (a: AdvisingAssignment): Promise<AdvisingAssignment> => { await delay(300); await dbPut("advisingAssignments", a); await logAudit("ADVISING_ASSIGNMENT_SAVED", "advising_assignment", `Advising assignment saved — ${a.studentName} → ${a.advisorName} (${a.status})`); return a; },
  deleteAdvisingAssignment: async (a: AdvisingAssignment): Promise<void> => { await delay(220); await dbDelete("advisingAssignments", a.id); await logAudit("ADVISING_ASSIGNMENT_DELETED", "advising_assignment", `Advising assignment deleted — ${a.studentName}`); },
  listInterventionPlans: async (): Promise<InterventionPlan[]> => { await delay(); return dbGetAll("interventionPlans"); },
  saveInterventionPlan: async (p: InterventionPlan): Promise<InterventionPlan> => { await delay(300); await dbPut("interventionPlans", p); await logAudit("INTERVENTION_PLAN_SAVED", "intervention_plan", `Intervention plan saved — ${p.studentName} (${p.status})`); return p; },
  deleteInterventionPlan: async (p: InterventionPlan): Promise<void> => { await delay(220); await dbDelete("interventionPlans", p.id); await logAudit("INTERVENTION_PLAN_DELETED", "intervention_plan", `Intervention plan deleted — ${p.studentName}`); },
});

// ── M20 Activities, Community and Events ─────────────────────────────────
Object.assign(apiMethods, {
  listCommunityEvents: async (): Promise<CommunityEvent[]> => { await delay(); return dbGetAll("communityEvents"); },
  saveCommunityEvent: async (e: CommunityEvent): Promise<CommunityEvent> => { await delay(300); await dbPut("communityEvents", e); await logAudit("COMMUNITY_EVENT_SAVED", "community_event", `Community event saved — ${e.name} (${e.type}, ${e.status})`); return e; },
  deleteCommunityEvent: async (e: CommunityEvent): Promise<void> => { await delay(220); await dbDelete("communityEvents", e.id); await logAudit("COMMUNITY_EVENT_DELETED", "community_event", `Community event deleted — ${e.name}`); },
  listEventRegistrations: async (): Promise<EventRegistration[]> => { await delay(); return dbGetAll("eventRegistrations"); },
  saveEventRegistration: async (r: EventRegistration): Promise<EventRegistration> => { await delay(300); await dbPut("eventRegistrations", r); await logAudit("EVENT_REGISTRATION_SAVED", "event_registration", `Event registration saved — ${r.participantName} (${r.status})`); return r; },
  deleteEventRegistration: async (r: EventRegistration): Promise<void> => { await delay(220); await dbDelete("eventRegistrations", r.id); await logAudit("EVENT_REGISTRATION_DELETED", "event_registration", `Event registration deleted — ${r.participantName}`); },
  listActivityGroups: async (): Promise<ActivityGroup[]> => { await delay(); return dbGetAll("activityGroups"); },
  saveActivityGroup: async (g: ActivityGroup): Promise<ActivityGroup> => { await delay(300); await dbPut("activityGroups", g); await logAudit("ACTIVITY_GROUP_SAVED", "activity_group", `Activity group saved — ${g.name} (${g.type}, ${g.status})`); return g; },
  deleteActivityGroup: async (g: ActivityGroup): Promise<void> => { await delay(220); await dbDelete("activityGroups", g.id); await logAudit("ACTIVITY_GROUP_DELETED", "activity_group", `Activity group deleted — ${g.name}`); },
  listGroupMemberships: async (): Promise<GroupMembership[]> => { await delay(); return dbGetAll("groupMemberships"); },
  saveGroupMembership: async (m: GroupMembership): Promise<GroupMembership> => { await delay(300); await dbPut("groupMemberships", m); await logAudit("GROUP_MEMBERSHIP_SAVED", "group_membership", `Group membership saved — ${m.memberName} → ${m.groupName} (${m.role})`); return m; },
  deleteGroupMembership: async (m: GroupMembership): Promise<void> => { await delay(220); await dbDelete("groupMemberships", m.id); await logAudit("GROUP_MEMBERSHIP_DELETED", "group_membership", `Group membership deleted — ${m.memberName}`); },
  listCompetitions: async (): Promise<Competition[]> => { await delay(); return dbGetAll("competitions"); },
  saveCompetition: async (c: Competition): Promise<Competition> => { await delay(300); await dbPut("competitions", c); await logAudit("COMPETITION_SAVED", "competition", `Competition saved — ${c.name} (${c.sport}, ${c.level})`); return c; },
  deleteCompetition: async (c: Competition): Promise<void> => { await delay(220); await dbDelete("competitions", c.id); await logAudit("COMPETITION_DELETED", "competition", `Competition deleted — ${c.name}`); },
  listCompetitionEntries: async (): Promise<CompetitionEntry[]> => { await delay(); return dbGetAll("competitionEntries"); },
  saveCompetitionEntry: async (e: CompetitionEntry): Promise<CompetitionEntry> => { await delay(300); await dbPut("competitionEntries", e); await logAudit("COMPETITION_ENTRY_SAVED", "competition_entry", `Competition entry saved — ${e.teamName} (${e.status})`); return e; },
  deleteCompetitionEntry: async (e: CompetitionEntry): Promise<void> => { await delay(220); await dbDelete("competitionEntries", e.id); await logAudit("COMPETITION_ENTRY_DELETED", "competition_entry", `Competition entry deleted — ${e.teamName}`); },
  listCompetitionResults: async (): Promise<CompetitionResult[]> => { await delay(); return dbGetAll("competitionResults"); },
  saveCompetitionResult: async (r: CompetitionResult): Promise<CompetitionResult> => { await delay(300); await dbPut("competitionResults", r); await logAudit("COMPETITION_RESULT_SAVED", "competition_result", `Competition result saved — rank ${r.rank} (${r.award}, ${r.status})`); return r; },
  deleteCompetitionResult: async (r: CompetitionResult): Promise<void> => { await delay(220); await dbDelete("competitionResults", r.id); await logAudit("COMPETITION_RESULT_DELETED", "competition_result", `Competition result deleted — ${r.id}`); },
  listTrips: async (): Promise<Trip[]> => { await delay(); return dbGetAll("trips"); },
  saveTrip: async (t: Trip): Promise<Trip> => { await delay(300); await dbPut("trips", t); await logAudit("TRIP_SAVED", "trip", `Trip saved — ${t.name} → ${t.destination} (${t.status})`); return t; },
  deleteTrip: async (t: Trip): Promise<void> => { await delay(220); await dbDelete("trips", t.id); await logAudit("TRIP_DELETED", "trip", `Trip deleted — ${t.name}`); },
  listTripParticipants: async (): Promise<TripParticipant[]> => { await delay(); return dbGetAll("tripParticipants"); },
  saveTripParticipant: async (p: TripParticipant): Promise<TripParticipant> => { await delay(300); await dbPut("tripParticipants", p); await logAudit("TRIP_PARTICIPANT_SAVED", "trip_participant", `Trip participant saved — ${p.studentName} (${p.consentStatus}, ${p.status})`); return p; },
  deleteTripParticipant: async (p: TripParticipant): Promise<void> => { await delay(220); await dbDelete("tripParticipants", p.id); await logAudit("TRIP_PARTICIPANT_DELETED", "trip_participant", `Trip participant deleted — ${p.studentName}`); },
  listPtmEvents: async (): Promise<PTMEvent[]> => { await delay(); return dbGetAll("ptmEvents"); },
  savePtmEvent: async (e: PTMEvent): Promise<PTMEvent> => { await delay(300); await dbPut("ptmEvents", e); await logAudit("PTM_EVENT_SAVED", "ptm_event", `PTM event saved — ${e.name} (${e.status})`); return e; },
  deletePtmEvent: async (e: PTMEvent): Promise<void> => { await delay(220); await dbDelete("ptmEvents", e.id); await logAudit("PTM_EVENT_DELETED", "ptm_event", `PTM event deleted — ${e.name}`); },
  listPtmBookings: async (): Promise<PTMBooking[]> => { await delay(); return dbGetAll("ptmBookings"); },
  savePtmBooking: async (b: PTMBooking): Promise<PTMBooking> => { await delay(300); await dbPut("ptmBookings", b); await logAudit("PTM_BOOKING_SAVED", "ptm_booking", `PTM booking saved — ${b.parentName} → ${b.teacherName} (${b.slotTime}, ${b.status})`); return b; },
  deletePtmBooking: async (b: PTMBooking): Promise<void> => { await delay(220); await dbDelete("ptmBookings", b.id); await logAudit("PTM_BOOKING_DELETED", "ptm_booking", `PTM booking deleted — ${b.parentName}`); },
  listFundraisingCampaigns: async (): Promise<FundraisingCampaign[]> => { await delay(); return dbGetAll("fundraisingCampaigns"); },
  saveFundraisingCampaign: async (c: FundraisingCampaign): Promise<FundraisingCampaign> => { await delay(300); await dbPut("fundraisingCampaigns", c); await logAudit("FUNDRAISING_SAVED", "fundraising_campaign", `Fundraising campaign saved — ${c.name} (Rs ${c.raisedAmount}/${c.targetAmount}, ${c.status})`); return c; },
  deleteFundraisingCampaign: async (c: FundraisingCampaign): Promise<void> => { await delay(220); await dbDelete("fundraisingCampaigns", c.id); await logAudit("FUNDRAISING_DELETED", "fundraising_campaign", `Fundraising campaign deleted — ${c.name}`); },
  listDonations: async (): Promise<Donation[]> => { await delay(); return dbGetAll("donations"); },
  saveDonation: async (d: Donation): Promise<Donation> => { await delay(300); await dbPut("donations", d); await logAudit("DONATION_SAVED", "donation", `Donation saved — ${d.donorName} Rs ${d.amount} (${d.method}, ${d.status})`); return d; },
  deleteDonation: async (d: Donation): Promise<void> => { await delay(220); await dbDelete("donations", d.id); await logAudit("DONATION_DELETED", "donation", `Donation deleted — ${d.donorName}`); },
});

// ── M21 Senior Secondary and Board Examinations ─────────────────────────
Object.assign(apiMethods, {
  listSubjectCombinationRules: async (): Promise<SubjectCombinationRule[]> => { await delay(); return dbGetAll("subjectCombinationRules"); },
  saveSubjectCombinationRule: async (r: SubjectCombinationRule): Promise<SubjectCombinationRule> => { await delay(300); await dbPut("subjectCombinationRules", r); await logAudit("SUBJECT_RULE_SAVED", "subject_combination_rule", `Subject combination rule saved — ${r.board} ${r.grade} ${r.stream} v${r.version} (${r.status})`); return r; },
  deleteSubjectCombinationRule: async (r: SubjectCombinationRule): Promise<void> => { await delay(220); await dbDelete("subjectCombinationRules", r.id); await logAudit("SUBJECT_RULE_DELETED", "subject_combination_rule", `Subject combination rule deleted — ${r.board} ${r.grade}`); },
  listStudentSubjectPlans: async (): Promise<StudentSubjectPlan[]> => { await delay(); return dbGetAll("studentSubjectPlans"); },
  saveStudentSubjectPlan: async (p: StudentSubjectPlan): Promise<StudentSubjectPlan> => { await delay(300); await dbPut("studentSubjectPlans", p); await logAudit("STUDENT_SUBJECT_PLAN_SAVED", "student_subject_plan", `Student subject plan saved — ${p.studentName} (${p.stream}, ${p.status})`); return p; },
  deleteStudentSubjectPlan: async (p: StudentSubjectPlan): Promise<void> => { await delay(220); await dbDelete("studentSubjectPlans", p.id); await logAudit("STUDENT_SUBJECT_PLAN_DELETED", "student_subject_plan", `Student subject plan deleted — ${p.studentName}`); },
  listBoardRegistrations: async (): Promise<BoardRegistration[]> => { await delay(); return dbGetAll("boardRegistrations"); },
  saveBoardRegistration: async (r: BoardRegistration): Promise<BoardRegistration> => { await delay(300); await dbPut("boardRegistrations", r); await logAudit("BOARD_REGISTRATION_SAVED", "board_registration", `Board registration saved — ${r.studentName} ${r.board} (${r.status})`); return r; },
  deleteBoardRegistration: async (r: BoardRegistration): Promise<void> => { await delay(220); await dbDelete("boardRegistrations", r.id); await logAudit("BOARD_REGISTRATION_DELETED", "board_registration", `Board registration deleted — ${r.studentName}`); },
  listReadinessChecks: async (): Promise<ReadinessCheck[]> => { await delay(); return dbGetAll("readinessChecks"); },
  saveReadinessCheck: async (c: ReadinessCheck): Promise<ReadinessCheck> => { await delay(300); await dbPut("readinessChecks", c); await logAudit("READINESS_CHECK_SAVED", "readiness_check", `Readiness check saved — ${c.checkType} (${c.outcome}, ${c.status})`); return c; },
  deleteReadinessCheck: async (c: ReadinessCheck): Promise<void> => { await delay(220); await dbDelete("readinessChecks", c.id); await logAudit("READINESS_CHECK_DELETED", "readiness_check", `Readiness check deleted — ${c.id}`); },
  listInternalAssessmentSnapshots: async (): Promise<InternalAssessmentSnapshot[]> => { await delay(); return dbGetAll("internalAssessmentSnapshots"); },
  saveInternalAssessmentSnapshot: async (s: InternalAssessmentSnapshot): Promise<InternalAssessmentSnapshot> => { await delay(300); await dbPut("internalAssessmentSnapshots", s); await logAudit("INTERNAL_ASSESSMENT_SAVED", "internal_assessment_snapshot", `Internal assessment saved — ${s.subjectName} total ${s.totalMarks} (${s.status})`); return s; },
  deleteInternalAssessmentSnapshot: async (s: InternalAssessmentSnapshot): Promise<void> => { await delay(220); await dbDelete("internalAssessmentSnapshots", s.id); await logAudit("INTERNAL_ASSESSMENT_DELETED", "internal_assessment_snapshot", `Internal assessment deleted — ${s.id}`); },
  listGuidanceProfiles: async (): Promise<GuidanceProfile[]> => { await delay(); return dbGetAll("guidanceProfiles"); },
  saveGuidanceProfile: async (p: GuidanceProfile): Promise<GuidanceProfile> => { await delay(300); await dbPut("guidanceProfiles", p); await logAudit("GUIDANCE_PROFILE_SAVED", "guidance_profile", `Guidance profile saved — ${p.studentName} (${p.status})`); return p; },
  deleteGuidanceProfile: async (p: GuidanceProfile): Promise<void> => { await delay(220); await dbDelete("guidanceProfiles", p.id); await logAudit("GUIDANCE_PROFILE_DELETED", "guidance_profile", `Guidance profile deleted — ${p.studentName}`); },
  listGuidanceSessions: async (): Promise<GuidanceSession[]> => { await delay(); return dbGetAll("guidanceSessions"); },
  saveGuidanceSession: async (s: GuidanceSession): Promise<GuidanceSession> => { await delay(300); await dbPut("guidanceSessions", s); await logAudit("GUIDANCE_SESSION_SAVED", "guidance_session", `Guidance session saved — ${s.studentName} → ${s.counselorName} (${s.sessionDate}, ${s.status})`); return s; },
  deleteGuidanceSession: async (s: GuidanceSession): Promise<void> => { await delay(220); await dbDelete("guidanceSessions", s.id); await logAudit("GUIDANCE_SESSION_DELETED", "guidance_session", `Guidance session deleted — ${s.id}`); },
  listExternalApplications: async (): Promise<ExternalApplication[]> => { await delay(); return dbGetAll("externalApplications"); },
  saveExternalApplication: async (a: ExternalApplication): Promise<ExternalApplication> => { await delay(300); await dbPut("externalApplications", a); await logAudit("EXTERNAL_APP_SAVED", "external_application", `External application saved — ${a.studentName} → ${a.destination} (${a.status})`); return a; },
  deleteExternalApplication: async (a: ExternalApplication): Promise<void> => { await delay(220); await dbDelete("externalApplications", a.id); await logAudit("EXTERNAL_APP_DELETED", "external_application", `External application deleted — ${a.studentName}`); },
  listSchoolExitCases: async (): Promise<SchoolExitCase[]> => { await delay(); return dbGetAll("schoolExitCases"); },
  saveSchoolExitCase: async (c: SchoolExitCase): Promise<SchoolExitCase> => { await delay(300); await dbPut("schoolExitCases", c); await logAudit("SCHOOL_EXIT_SAVED", "school_exit_case", `School exit case saved — ${c.studentName} (${c.leavingType}, ${c.status})`); return c; },
  deleteSchoolExitCase: async (c: SchoolExitCase): Promise<void> => { await delay(220); await dbDelete("schoolExitCases", c.id); await logAudit("SCHOOL_EXIT_DELETED", "school_exit_case", `School exit case deleted — ${c.studentName}`); },
  listMigrationDocuments: async (): Promise<MigrationDocument[]> => { await delay(); return dbGetAll("migrationDocuments"); },
  saveMigrationDocument: async (d: MigrationDocument): Promise<MigrationDocument> => { await delay(300); await dbPut("migrationDocuments", d); await logAudit("MIGRATION_DOC_SAVED", "migration_document", `Migration document saved — ${d.documentType} (${d.documentNo}, ${d.status})`); return d; },
  deleteMigrationDocument: async (d: MigrationDocument): Promise<void> => { await delay(220); await dbDelete("migrationDocuments", d.id); await logAudit("MIGRATION_DOC_DELETED", "migration_document", `Migration document deleted — ${d.documentNo}`); },
  listFormerStudents: async (): Promise<FormerStudent[]> => { await delay(); return dbGetAll("formerStudents"); },
  saveFormerStudent: async (f: FormerStudent): Promise<FormerStudent> => { await delay(300); await dbPut("formerStudents", f); await logAudit("FORMER_STUDENT_SAVED", "former_student", `Former student saved — ${f.studentName} (${f.completionYear}, ${f.status})`); return f; },
  deleteFormerStudent: async (f: FormerStudent): Promise<void> => { await delay(220); await dbDelete("formerStudents", f.id); await logAudit("FORMER_STUDENT_DELETED", "former_student", `Former student deleted — ${f.studentName}`); },
  listAlumniPreferences: async (): Promise<AlumniPreference[]> => { await delay(); return dbGetAll("alumniPreferences"); },
  saveAlumniPreference: async (p: AlumniPreference): Promise<AlumniPreference> => { await delay(300); await dbPut("alumniPreferences", p); await logAudit("ALUMNI_PREFERENCE_SAVED", "alumni_preference", `Alumni preference saved — ${p.channel} for ${p.purpose} (${p.status})`); return p; },
  deleteAlumniPreference: async (p: AlumniPreference): Promise<void> => { await delay(220); await dbDelete("alumniPreferences", p.id); await logAudit("ALUMNI_PREFERENCE_DELETED", "alumni_preference", `Alumni preference deleted — ${p.channel}`); },
});

// ── M22 Facilities, Maintenance, Safety and Sustainability ─────────────────
Object.assign(apiMethods, {
  listServiceRequests: async (): Promise<ServiceRequest[]> => { await delay(); return dbGetAll("serviceRequests"); },
  saveServiceRequest: async (s: ServiceRequest): Promise<ServiceRequest> => { await delay(300); await dbPut("serviceRequests", s); await logAudit("SERVICE_REQUEST_SAVED", "service_request", `Service request saved — ${s.title} (${s.category}, ${s.status})`); return s; },
  deleteServiceRequest: async (s: ServiceRequest): Promise<void> => { await delay(220); await dbDelete("serviceRequests", s.id); await logAudit("SERVICE_REQUEST_DELETED", "service_request", `Service request deleted — ${s.title}`); },
  listWorkOrders: async (): Promise<WorkOrder[]> => { await delay(); return dbGetAll("workOrders"); },
  saveWorkOrder: async (w: WorkOrder): Promise<WorkOrder> => { await delay(300); await dbPut("workOrders", w); await logAudit("WORK_ORDER_SAVED", "work_order", `Work order saved — ${w.workOrderNo} (${w.status})`); return w; },
  deleteWorkOrder: async (w: WorkOrder): Promise<void> => { await delay(220); await dbDelete("workOrders", w.id); await logAudit("WORK_ORDER_DELETED", "work_order", `Work order deleted — ${w.workOrderNo}`); },
  listWorkOrderActivities: async (): Promise<WorkOrderActivity[]> => { await delay(); return dbGetAll("workOrderActivities"); },
  saveWorkOrderActivity: async (a: WorkOrderActivity): Promise<WorkOrderActivity> => { await delay(300); await dbPut("workOrderActivities", a); await logAudit("WORK_ORDER_ACTIVITY_SAVED", "work_order_activity", `Work order activity saved — ${a.activityType} (${a.status})`); return a; },
  deleteWorkOrderActivity: async (a: WorkOrderActivity): Promise<void> => { await delay(220); await dbDelete("workOrderActivities", a.id); await logAudit("WORK_ORDER_ACTIVITY_DELETED", "work_order_activity", `Work order activity deleted — ${a.activityType}`); },
  listMaintenancePlans: async (): Promise<MaintenancePlan[]> => { await delay(); return dbGetAll("maintenancePlans"); },
  saveMaintenancePlan: async (m: MaintenancePlan): Promise<MaintenancePlan> => { await delay(300); await dbPut("maintenancePlans", m); await logAudit("MAINTENANCE_PLAN_SAVED", "maintenance_plan", `Maintenance plan saved — ${m.title} (${m.assetType}, ${m.status})`); return m; },
  deleteMaintenancePlan: async (m: MaintenancePlan): Promise<void> => { await delay(220); await dbDelete("maintenancePlans", m.id); await logAudit("MAINTENANCE_PLAN_DELETED", "maintenance_plan", `Maintenance plan deleted — ${m.title}`); },
  listBookings: async (): Promise<Booking[]> => { await delay(); return dbGetAll("bookings"); },
  saveBooking: async (b: Booking): Promise<Booking> => { await delay(300); await dbPut("bookings", b); await logAudit("BOOKING_SAVED", "booking", `Booking saved — ${b.venueName} (${b.purpose}, ${b.status})`); return b; },
  deleteBooking: async (b: Booking): Promise<void> => { await delay(220); await dbDelete("bookings", b.id); await logAudit("BOOKING_DELETED", "booking", `Booking deleted — ${b.venueName}`); },
  listBookingAttendees: async (): Promise<BookingAttendee[]> => { await delay(); return dbGetAll("bookingAttendees"); },
  saveBookingAttendee: async (a: BookingAttendee): Promise<BookingAttendee> => { await delay(300); await dbPut("bookingAttendees", a); await logAudit("BOOKING_ATTENDEE_SAVED", "booking_attendee", `Booking attendee saved — ${a.attendeeName} (${a.status})`); return a; },
  deleteBookingAttendee: async (a: BookingAttendee): Promise<void> => { await delay(220); await dbDelete("bookingAttendees", a.id); await logAudit("BOOKING_ATTENDEE_DELETED", "booking_attendee", `Booking attendee deleted — ${a.attendeeName}`); },
  listSafetyIncidents: async (): Promise<SafetyIncident[]> => { await delay(); return dbGetAll("safetyIncidents"); },
  saveSafetyIncident: async (s: SafetyIncident): Promise<SafetyIncident> => { await delay(300); await dbPut("safetyIncidents", s); await logAudit("SAFETY_INCIDENT_SAVED", "safety_incident", `Safety incident saved — ${s.incidentNo} (${s.category}, ${s.severity})`); return s; },
  deleteSafetyIncident: async (s: SafetyIncident): Promise<void> => { await delay(220); await dbDelete("safetyIncidents", s.id); await logAudit("SAFETY_INCIDENT_DELETED", "safety_incident", `Safety incident deleted — ${s.incidentNo}`); },
  listEmergencyActions: async (): Promise<EmergencyAction[]> => { await delay(); return dbGetAll("emergencyActions"); },
  saveEmergencyAction: async (e: EmergencyAction): Promise<EmergencyAction> => { await delay(300); await dbPut("emergencyActions", e); await logAudit("EMERGENCY_ACTION_SAVED", "emergency_action", `Emergency action saved — ${e.actionType} (${e.status})`); return e; },
  deleteEmergencyAction: async (e: EmergencyAction): Promise<void> => { await delay(220); await dbDelete("emergencyActions", e.id); await logAudit("EMERGENCY_ACTION_DELETED", "emergency_action", `Emergency action deleted — ${e.actionType}`); },
  listVisitorVisits: async (): Promise<VisitorVisit[]> => { await delay(); return dbGetAll("visitorVisits"); },
  saveVisitorVisit: async (v: VisitorVisit): Promise<VisitorVisit> => { await delay(300); await dbPut("visitorVisits", v); await logAudit("VISITOR_VISIT_SAVED", "visitor_visit", `Visitor visit saved — ${v.visitorName} (${v.purpose}, ${v.status})`); return v; },
  deleteVisitorVisit: async (v: VisitorVisit): Promise<void> => { await delay(220); await dbDelete("visitorVisits", v.id); await logAudit("VISITOR_VISIT_DELETED", "visitor_visit", `Visitor visit deleted — ${v.visitorName}`); },
  listAccessCredentials: async (): Promise<AccessCredential[]> => { await delay(); return dbGetAll("accessCredentials"); },
  saveAccessCredential: async (a: AccessCredential): Promise<AccessCredential> => { await delay(300); await dbPut("accessCredentials", a); await logAudit("ACCESS_CREDENTIAL_SAVED", "access_credential", `Access credential saved — ${a.holderName} (${a.credentialType}, ${a.status})`); return a; },
  deleteAccessCredential: async (a: AccessCredential): Promise<void> => { await delay(220); await dbDelete("accessCredentials", a.id); await logAudit("ACCESS_CREDENTIAL_DELETED", "access_credential", `Access credential deleted — ${a.holderName}`); },
  listKeyIssues: async (): Promise<KeyIssue[]> => { await delay(); return dbGetAll("keyIssues"); },
  saveKeyIssue: async (k: KeyIssue): Promise<KeyIssue> => { await delay(300); await dbPut("keyIssues", k); await logAudit("KEY_ISSUE_SAVED", "key_issue", `Key issue saved — ${k.keyNo} (${k.location}, ${k.status})`); return k; },
  deleteKeyIssue: async (k: KeyIssue): Promise<void> => { await delay(220); await dbDelete("keyIssues", k.id); await logAudit("KEY_ISSUE_DELETED", "key_issue", `Key issue deleted — ${k.keyNo}`); },
  listUtilityMeters: async (): Promise<UtilityMeter[]> => { await delay(); return dbGetAll("utilityMeters"); },
  saveUtilityMeter: async (u: UtilityMeter): Promise<UtilityMeter> => { await delay(300); await dbPut("utilityMeters", u); await logAudit("UTILITY_METER_SAVED", "utility_meter", `Utility meter saved — ${u.meterNo} (${u.utilityType}, ${u.status})`); return u; },
  deleteUtilityMeter: async (u: UtilityMeter): Promise<void> => { await delay(220); await dbDelete("utilityMeters", u.id); await logAudit("UTILITY_METER_DELETED", "utility_meter", `Utility meter deleted — ${u.meterNo}`); },
  listMeterReadings: async (): Promise<MeterReading[]> => { await delay(); return dbGetAll("meterReadings"); },
  saveMeterReading: async (m: MeterReading): Promise<MeterReading> => { await delay(300); await dbPut("meterReadings", m); await logAudit("METER_READING_SAVED", "meter_reading", `Meter reading saved — ${m.meterNo} (${m.consumption} ${m.utilityType})`); return m; },
  deleteMeterReading: async (m: MeterReading): Promise<void> => { await delay(220); await dbDelete("meterReadings", m.id); await logAudit("METER_READING_DELETED", "meter_reading", `Meter reading deleted — ${m.meterNo}`); },
  listContinuityPlans: async (): Promise<ContinuityPlan[]> => { await delay(); return dbGetAll("continuityPlans"); },
  saveContinuityPlan: async (c: ContinuityPlan): Promise<ContinuityPlan> => { await delay(300); await dbPut("continuityPlans", c); await logAudit("CONTINUITY_PLAN_SAVED", "continuity_plan", `Continuity plan saved — ${c.title} (${c.planType}, ${c.status})`); return c; },
  deleteContinuityPlan: async (c: ContinuityPlan): Promise<void> => { await delay(220); await dbDelete("continuityPlans", c.id); await logAudit("CONTINUITY_PLAN_DELETED", "continuity_plan", `Continuity plan deleted — ${c.title}`); },
  listContinuityExercises: async (): Promise<ContinuityExercise[]> => { await delay(); return dbGetAll("continuityExercises"); },
  saveContinuityExercise: async (e: ContinuityExercise): Promise<ContinuityExercise> => { await delay(300); await dbPut("continuityExercises", e); await logAudit("CONTINUITY_EXERCISE_SAVED", "continuity_exercise", `Continuity exercise saved — ${e.exerciseName} (${e.exerciseType}, ${e.status})`); return e; },
  deleteContinuityExercise: async (e: ContinuityExercise): Promise<void> => { await delay(220); await dbDelete("continuityExercises", e.id); await logAudit("CONTINUITY_EXERCISE_DELETED", "continuity_exercise", `Continuity exercise deleted — ${e.exerciseName}`); },
  // M23 Communication, Workflow and Documents
  listAnnouncements: async (): Promise<Announcement[]> => { await delay(); return dbGetAll("announcements"); },
  saveAnnouncement: async (a: Announcement): Promise<Announcement> => { await delay(300); await dbPut("announcements", a); await logAudit("ANNOUNCEMENT_SAVED", "announcement", `Announcement saved — ${a.title} (${a.status})`); return a; },
  deleteAnnouncement: async (a: Announcement): Promise<void> => { await delay(220); await dbDelete("announcements", a.id); await logAudit("ANNOUNCEMENT_DELETED", "announcement", `Announcement deleted — ${a.title}`); },
  listMessages: async (): Promise<Message[]> => { await delay(); return dbGetAll("messages"); },
  saveMessage: async (m: Message): Promise<Message> => { await delay(300); await dbPut("messages", m); await logAudit("MESSAGE_SAVED", "message", `Message saved — ${m.channel} to ${m.recipientRef} (${m.status})`); return m; },
  deleteMessage: async (m: Message): Promise<void> => { await delay(220); await dbDelete("messages", m.id); await logAudit("MESSAGE_DELETED", "message", `Message deleted — ${m.id}`); },
  listDeliveryAttempts: async (): Promise<DeliveryAttempt[]> => { await delay(); return dbGetAll("deliveryAttempts"); },
  saveDeliveryAttempt: async (d: DeliveryAttempt): Promise<DeliveryAttempt> => { await delay(300); await dbPut("deliveryAttempts", d); await logAudit("DELIVERY_ATTEMPT_SAVED", "delivery_attempt", `Delivery attempt saved — ${d.provider} (${d.outcome})`); return d; },
  deleteDeliveryAttempt: async (d: DeliveryAttempt): Promise<void> => { await delay(220); await dbDelete("deliveryAttempts", d.id); await logAudit("DELIVERY_ATTEMPT_DELETED", "delivery_attempt", `Delivery attempt deleted — ${d.id}`); },
  listNotificationPreferences: async (): Promise<NotificationPreference[]> => { await delay(); return dbGetAll("notificationPreferences"); },
  saveNotificationPreference: async (n: NotificationPreference): Promise<NotificationPreference> => { await delay(300); await dbPut("notificationPreferences", n); await logAudit("NOTIFICATION_PREFERENCE_SAVED", "notification_preference", `Notification preference saved — ${n.purpose} (${n.channel})`); return n; },
  deleteNotificationPreference: async (n: NotificationPreference): Promise<void> => { await delay(220); await dbDelete("notificationPreferences", n.id); await logAudit("NOTIFICATION_PREFERENCE_DELETED", "notification_preference", `Notification preference deleted — ${n.id}`); },
  listConversations: async (): Promise<Conversation[]> => { await delay(); return dbGetAll("conversations"); },
  saveConversation: async (c: Conversation): Promise<Conversation> => { await delay(300); await dbPut("conversations", c); await logAudit("CONVERSATION_SAVED", "conversation", `Conversation saved — ${c.subject} (${c.type})`); return c; },
  deleteConversation: async (c: Conversation): Promise<void> => { await delay(220); await dbDelete("conversations", c.id); await logAudit("CONVERSATION_DELETED", "conversation", `Conversation deleted — ${c.subject}`); },
  listConversationParticipants: async (): Promise<ConversationParticipant[]> => { await delay(); return dbGetAll("conversationParticipants"); },
  saveConversationParticipant: async (cp: ConversationParticipant): Promise<ConversationParticipant> => { await delay(300); await dbPut("conversationParticipants", cp); await logAudit("CONVERSATION_PARTICIPANT_SAVED", "conversation_participant", `Conversation participant saved — ${cp.subjectRef} (${cp.role})`); return cp; },
  deleteConversationParticipant: async (cp: ConversationParticipant): Promise<void> => { await delay(220); await dbDelete("conversationParticipants", cp.id); await logAudit("CONVERSATION_PARTICIPANT_DELETED", "conversation_participant", `Conversation participant deleted — ${cp.id}`); },
  listConversationMessages: async (): Promise<ConversationMessage[]> => { await delay(); return dbGetAll("conversationMessages"); },
  saveConversationMessage: async (cm: ConversationMessage): Promise<ConversationMessage> => { await delay(300); await dbPut("conversationMessages", cm); await logAudit("CONVERSATION_MESSAGE_SAVED", "conversation_message", `Conversation message saved — from ${cm.senderRef}`); return cm; },
  deleteConversationMessage: async (cm: ConversationMessage): Promise<void> => { await delay(220); await dbDelete("conversationMessages", cm.id); await logAudit("CONVERSATION_MESSAGE_DELETED", "conversation_message", `Conversation message deleted — ${cm.id}`); },
  listWorkflowDefinitions: async (): Promise<WorkflowDefinition[]> => { await delay(); return dbGetAll("workflowDefinitions"); },
  saveWorkflowDefinition: async (w: WorkflowDefinition): Promise<WorkflowDefinition> => { await delay(300); await dbPut("workflowDefinitions", w); await logAudit("WORKFLOW_DEFINITION_SAVED", "workflow_definition", `Workflow definition saved — ${w.name} (${w.code})`); return w; },
  deleteWorkflowDefinition: async (w: WorkflowDefinition): Promise<void> => { await delay(220); await dbDelete("workflowDefinitions", w.id); await logAudit("WORKFLOW_DEFINITION_DELETED", "workflow_definition", `Workflow definition deleted — ${w.name}`); },
  listWorkflowInstances: async (): Promise<WorkflowInstance[]> => { await delay(); return dbGetAll("workflowInstances"); },
  saveWorkflowInstance: async (w: WorkflowInstance): Promise<WorkflowInstance> => { await delay(300); await dbPut("workflowInstances", w); await logAudit("WORKFLOW_INSTANCE_SAVED", "workflow_instance", `Workflow instance saved — ${w.businessRef} (${w.state})`); return w; },
  deleteWorkflowInstance: async (w: WorkflowInstance): Promise<void> => { await delay(220); await dbDelete("workflowInstances", w.id); await logAudit("WORKFLOW_INSTANCE_DELETED", "workflow_instance", `Workflow instance deleted — ${w.id}`); },
  listWorkflowTasks: async (): Promise<WorkflowTask[]> => { await delay(); return dbGetAll("workflowTasks"); },
  saveWorkflowTask: async (w: WorkflowTask): Promise<WorkflowTask> => { await delay(300); await dbPut("workflowTasks", w); await logAudit("WORKFLOW_TASK_SAVED", "workflow_task", `Workflow task saved — ${w.name} (${w.status})`); return w; },
  deleteWorkflowTask: async (w: WorkflowTask): Promise<void> => { await delay(220); await dbDelete("workflowTasks", w.id); await logAudit("WORKFLOW_TASK_DELETED", "workflow_task", `Workflow task deleted — ${w.name}`); },
  listWorkflowTransitions: async (): Promise<WorkflowTransition[]> => { await delay(); return dbGetAll("workflowTransitions"); },
  saveWorkflowTransition: async (w: WorkflowTransition): Promise<WorkflowTransition> => { await delay(300); await dbPut("workflowTransitions", w); await logAudit("WORKFLOW_TRANSITION_SAVED", "workflow_transition", `Workflow transition saved — ${w.fromState} → ${w.toState}`); return w; },
  deleteWorkflowTransition: async (w: WorkflowTransition): Promise<void> => { await delay(220); await dbDelete("workflowTransitions", w.id); await logAudit("WORKFLOW_TRANSITION_DELETED", "workflow_transition", `Workflow transition deleted — ${w.id}`); },
  listServiceCases: async (): Promise<ServiceCase[]> => { await delay(); return dbGetAll("serviceCases"); },
  saveServiceCase: async (s: ServiceCase): Promise<ServiceCase> => { await delay(300); await dbPut("serviceCases", s); await logAudit("SERVICE_CASE_SAVED", "service_case", `Service case saved — ${s.name} (${s.category})`); return s; },
  deleteServiceCase: async (s: ServiceCase): Promise<void> => { await delay(220); await dbDelete("serviceCases", s.id); await logAudit("SERVICE_CASE_DELETED", "service_case", `Service case deleted — ${s.name}`); },
  listCaseActivities: async (): Promise<CaseActivity[]> => { await delay(); return dbGetAll("caseActivities"); },
  saveCaseActivity: async (c: CaseActivity): Promise<CaseActivity> => { await delay(300); await dbPut("caseActivities", c); await logAudit("CASE_ACTIVITY_SAVED", "case_activity", `Case activity saved — ${c.name} (${c.type})`); return c; },
  deleteCaseActivity: async (c: CaseActivity): Promise<void> => { await delay(220); await dbDelete("caseActivities", c.id); await logAudit("CASE_ACTIVITY_DELETED", "case_activity", `Case activity deleted — ${c.name}`); },
  listSlaClocks: async (): Promise<SlaClock[]> => { await delay(); return dbGetAll("slaClocks"); },
  saveSlaClock: async (s: SlaClock): Promise<SlaClock> => { await delay(300); await dbPut("slaClocks", s); await logAudit("SLA_CLOCK_SAVED", "sla_clock", `SLA clock saved — ${s.metric} due ${s.dueAt}`); return s; },
  deleteSlaClock: async (s: SlaClock): Promise<void> => { await delay(220); await dbDelete("slaClocks", s.id); await logAudit("SLA_CLOCK_DELETED", "sla_clock", `SLA clock deleted — ${s.id}`); },
  listDocumentTemplates: async (): Promise<DocumentTemplate[]> => { await delay(); return dbGetAll("documentTemplates"); },
  saveDocumentTemplate: async (d: DocumentTemplate): Promise<DocumentTemplate> => { await delay(300); await dbPut("documentTemplates", d); await logAudit("DOCUMENT_TEMPLATE_SAVED", "document_template", `Document template saved — ${d.name} (${d.code})`); return d; },
  deleteDocumentTemplate: async (d: DocumentTemplate): Promise<void> => { await delay(220); await dbDelete("documentTemplates", d.id); await logAudit("DOCUMENT_TEMPLATE_DELETED", "document_template", `Document template deleted — ${d.name}`); },
  listDocumentInstances: async (): Promise<DocumentInstance[]> => { await delay(); return dbGetAll("documentInstances"); },
  saveDocumentInstance: async (d: DocumentInstance): Promise<DocumentInstance> => { await delay(300); await dbPut("documentInstances", d); await logAudit("DOCUMENT_INSTANCE_SAVED", "document_instance", `Document instance saved — ${d.businessRef} (${d.objectRef})`); return d; },
  deleteDocumentInstance: async (d: DocumentInstance): Promise<void> => { await delay(220); await dbDelete("documentInstances", d.id); await logAudit("DOCUMENT_INSTANCE_DELETED", "document_instance", `Document instance deleted — ${d.id}`); },
  listSignatureRequests: async (): Promise<SignatureRequest[]> => { await delay(); return dbGetAll("signatureRequests"); },
  saveSignatureRequest: async (s: SignatureRequest): Promise<SignatureRequest> => { await delay(300); await dbPut("signatureRequests", s); await logAudit("SIGNATURE_REQUEST_SAVED", "signature_request", `Signature request saved — ${s.signerRef} (${s.status})`); return s; },
  deleteSignatureRequest: async (s: SignatureRequest): Promise<void> => { await delay(220); await dbDelete("signatureRequests", s.id); await logAudit("SIGNATURE_REQUEST_DELETED", "signature_request", `Signature request deleted — ${s.id}`); },
  listRecordDeclarations: async (): Promise<RecordDeclaration[]> => { await delay(); return dbGetAll("recordDeclarations"); },
  saveRecordDeclaration: async (r: RecordDeclaration): Promise<RecordDeclaration> => { await delay(300); await dbPut("recordDeclarations", r); await logAudit("RECORD_DECLARATION_SAVED", "record_declaration", `Record declaration saved — ${r.documentId} (${r.classification})`); return r; },
  deleteRecordDeclaration: async (r: RecordDeclaration): Promise<void> => { await delay(220); await dbDelete("recordDeclarations", r.id); await logAudit("RECORD_DECLARATION_DELETED", "record_declaration", `Record declaration deleted — ${r.id}`); },
  listRetentionAssignments: async (): Promise<RetentionAssignment[]> => { await delay(); return dbGetAll("retentionAssignments"); },
  saveRetentionAssignment: async (r: RetentionAssignment): Promise<RetentionAssignment> => { await delay(300); await dbPut("retentionAssignments", r); await logAudit("RETENTION_ASSIGNMENT_SAVED", "retention_assignment", `Retention assignment saved — ${r.scheduleRef} due ${r.dispositionAt}`); return r; },
  deleteRetentionAssignment: async (r: RetentionAssignment): Promise<void> => { await delay(220); await dbDelete("retentionAssignments", r.id); await logAudit("RETENTION_ASSIGNMENT_DELETED", "retention_assignment", `Retention assignment deleted — ${r.id}`); },
});

// ── M24 Analytics, Reporting & Decision Support ───────────────────────────
Object.assign(apiMethods, {
  listReportDefinitions: async (): Promise<ReportDefinition[]> => { await delay(); return dbGetAll("reportDefinitions"); },
  saveReportDefinition: async (r: ReportDefinition): Promise<ReportDefinition> => { await delay(300); await dbPut("reportDefinitions", r); await logAudit("REPORT_DEFINITION_SAVED", "report_definition", `Report definition saved — ${r.name} (${r.code}, ${r.status})`); return r; },
  deleteReportDefinition: async (r: ReportDefinition): Promise<void> => { await delay(220); await dbDelete("reportDefinitions", r.id); await logAudit("REPORT_DEFINITION_DELETED", "report_definition", `Report definition deleted — ${r.name}`); },
  listDashboards: async (): Promise<Dashboard[]> => { await delay(); return dbGetAll("dashboards"); },
  saveDashboard: async (d: Dashboard): Promise<Dashboard> => { await delay(300); await dbPut("dashboards", d); await logAudit("DASHBOARD_SAVED", "dashboard", `Dashboard saved — ${d.name} (${d.code}, ${d.status})`); return d; },
  deleteDashboard: async (d: Dashboard): Promise<void> => { await delay(220); await dbDelete("dashboards", d.id); await logAudit("DASHBOARD_DELETED", "dashboard", `Dashboard deleted — ${d.name}`); },
  listDashboardWidgets: async (): Promise<DashboardWidget[]> => { await delay(); return dbGetAll("dashboardWidgets"); },
  saveDashboardWidget: async (w: DashboardWidget): Promise<DashboardWidget> => { await delay(300); await dbPut("dashboardWidgets", w); await logAudit("DASHBOARD_WIDGET_SAVED", "dashboard_widget", `Dashboard widget saved — ${w.name} (${w.type}, ${w.dashboardName})`); return w; },
  deleteDashboardWidget: async (w: DashboardWidget): Promise<void> => { await delay(220); await dbDelete("dashboardWidgets", w.id); await logAudit("DASHBOARD_WIDGET_DELETED", "dashboard_widget", `Dashboard widget deleted — ${w.name}`); },
  listReportRuns: async (): Promise<ReportRun[]> => { await delay(); return dbGetAll("reportRuns"); },
  saveReportRun: async (r: ReportRun): Promise<ReportRun> => { await delay(300); await dbPut("reportRuns", r); await logAudit("REPORT_RUN_SAVED", "report_run", `Report run saved — ${r.reportName} (${r.status})`); return r; },
  deleteReportRun: async (r: ReportRun): Promise<void> => { await delay(220); await dbDelete("reportRuns", r.id); await logAudit("REPORT_RUN_DELETED", "report_run", `Report run deleted — ${r.id}`); },
  listMetricDefinitions: async (): Promise<MetricDefinition[]> => { await delay(); return dbGetAll("metricDefinitions"); },
  saveMetricDefinition: async (m: MetricDefinition): Promise<MetricDefinition> => { await delay(300); await dbPut("metricDefinitions", m); await logAudit("METRIC_DEFINITION_SAVED", "metric_definition", `Metric definition saved — ${m.name} (${m.code}, ${m.frequency})`); return m; },
  deleteMetricDefinition: async (m: MetricDefinition): Promise<void> => { await delay(220); await dbDelete("metricDefinitions", m.id); await logAudit("METRIC_DEFINITION_DELETED", "metric_definition", `Metric definition deleted — ${m.name}`); },
  listSemanticDimensions: async (): Promise<SemanticDimension[]> => { await delay(); return dbGetAll("semanticDimensions"); },
  saveSemanticDimension: async (s: SemanticDimension): Promise<SemanticDimension> => { await delay(300); await dbPut("semanticDimensions", s); await logAudit("SEMANTIC_DIMENSION_SAVED", "semantic_dimension", `Semantic dimension saved — ${s.name} (${s.type}, ${s.code})`); return s; },
  deleteSemanticDimension: async (s: SemanticDimension): Promise<void> => { await delay(220); await dbDelete("semanticDimensions", s.id); await logAudit("SEMANTIC_DIMENSION_DELETED", "semantic_dimension", `Semantic dimension deleted — ${s.name}`); },
  listReportAccessPolicies: async (): Promise<ReportAccessPolicy[]> => { await delay(); return dbGetAll("reportAccessPolicies"); },
  saveReportAccessPolicy: async (p: ReportAccessPolicy): Promise<ReportAccessPolicy> => { await delay(300); await dbPut("reportAccessPolicies", p); await logAudit("REPORT_ACCESS_POLICY_SAVED", "report_access_policy", `Report access policy saved — ${p.reportName} → ${p.roleName} (${p.accessLevel})`); return p; },
  deleteReportAccessPolicy: async (p: ReportAccessPolicy): Promise<void> => { await delay(220); await dbDelete("reportAccessPolicies", p.id); await logAudit("REPORT_ACCESS_POLICY_DELETED", "report_access_policy", `Report access policy deleted — ${p.reportName}`); },
  listReportCatalogEntries: async (): Promise<ReportCatalogEntry[]> => { await delay(); return dbGetAll("reportCatalogEntries"); },
  saveReportCatalogEntry: async (e: ReportCatalogEntry): Promise<ReportCatalogEntry> => { await delay(300); await dbPut("reportCatalogEntries", e); await logAudit("REPORT_CATALOG_ENTRY_SAVED", "report_catalog_entry", `Report catalog entry saved — ${e.reportName} v${e.version} (${e.status})`); return e; },
  deleteReportCatalogEntry: async (e: ReportCatalogEntry): Promise<void> => { await delay(220); await dbDelete("reportCatalogEntries", e.id); await logAudit("REPORT_CATALOG_ENTRY_DELETED", "report_catalog_entry", `Report catalog entry deleted — ${e.reportName}`); },
  listDataProducts: async (): Promise<DataProduct[]> => { await delay(); return dbGetAll("dataProducts"); },
  saveDataProduct: async (p: DataProduct): Promise<DataProduct> => { await delay(300); await dbPut("dataProducts", p); await logAudit("DATA_PRODUCT_SAVED", "data_product", `Data product saved — ${p.name} (${p.domain}, ${p.status})`); return p; },
  deleteDataProduct: async (p: DataProduct): Promise<void> => { await delay(220); await dbDelete("dataProducts", p.id); await logAudit("DATA_PRODUCT_DELETED", "data_product", `Data product deleted — ${p.name}`); },
  listPipelineRuns: async (): Promise<PipelineRun[]> => { await delay(); return dbGetAll("pipelineRuns"); },
  savePipelineRun: async (r: PipelineRun): Promise<PipelineRun> => { await delay(300); await dbPut("pipelineRuns", r); await logAudit("PIPELINE_RUN_SAVED", "pipeline_run", `Pipeline run saved — ${r.pipelineName} (${r.type}, ${r.status})`); return r; },
  deletePipelineRun: async (r: PipelineRun): Promise<void> => { await delay(220); await dbDelete("pipelineRuns", r.id); await logAudit("PIPELINE_RUN_DELETED", "pipeline_run", `Pipeline run deleted — ${r.id}`); },
  listDataQualityResults: async (): Promise<DataQualityResult[]> => { await delay(); return dbGetAll("dataQualityResults"); },
  saveDataQualityResult: async (r: DataQualityResult): Promise<DataQualityResult> => { await delay(300); await dbPut("dataQualityResults", r); await logAudit("DATA_QUALITY_RESULT_SAVED", "data_quality_result", `Data quality result saved — ${r.datasetName} (${r.dimension}, score ${r.score})`); return r; },
  deleteDataQualityResult: async (r: DataQualityResult): Promise<void> => { await delay(220); await dbDelete("dataQualityResults", r.id); await logAudit("DATA_QUALITY_RESULT_DELETED", "data_quality_result", `Data quality result deleted — ${r.id}`); },
  listModelVersions: async (): Promise<ModelVersion[]> => { await delay(); return dbGetAll("modelVersions"); },
  saveModelVersion: async (m: ModelVersion): Promise<ModelVersion> => { await delay(300); await dbPut("modelVersions", m); await logAudit("MODEL_VERSION_SAVED", "model_version", `Model version saved — ${m.modelName} v${m.version} (${m.status})`); return m; },
  deleteModelVersion: async (m: ModelVersion): Promise<void> => { await delay(220); await dbDelete("modelVersions", m.id); await logAudit("MODEL_VERSION_DELETED", "model_version", `Model version deleted — ${m.modelName} v${m.version}`); },
  listModelScores: async (): Promise<ModelScore[]> => { await delay(); return dbGetAll("modelScores"); },
  saveModelScore: async (s: ModelScore): Promise<ModelScore> => { await delay(300); await dbPut("modelScores", s); await logAudit("MODEL_SCORE_SAVED", "model_score", `Model score saved — ${s.modelName} → ${s.entityRef} (${s.scoreValue}, ${s.status})`); return s; },
  deleteModelScore: async (s: ModelScore): Promise<void> => { await delay(220); await dbDelete("modelScores", s.id); await logAudit("MODEL_SCORE_DELETED", "model_score", `Model score deleted — ${s.id}`); },
});

export const api = apiMethods as ErpApi;
