// ── M01 Product, Tenant and School Institution Core — domain types ──────────

export type TenantStatus =
  | "trial"
  | "active"
  | "suspended"
  | "read_only"
  | "archived"
  | "terminated";

export type Environment = "sandbox" | "training" | "production";

export type Edition = "basic" | "standard" | "premium" | "enterprise";

export interface Tenant {
  id: string;
  code: string; // immutable
  name: string;
  nameNe?: string;
  edition: Edition;
  status: TenantStatus;
  environment: Environment;
  contactEmail: string;
  phone?: string;
  createdOn: string;
  validFrom: string;
  validTo?: string;
  licensedModules: string[];
  userLimit: number;
  storageLimitGb: number;
  usage: { users: number; students: number; storageGb: number; apiCallsK: number };
}

export type CampusStatus = "open" | "closing" | "closed" | "archived";

export interface Campus {
  id: string;
  name: string;
  nameNe?: string;
  code: string;
  status: CampusStatus;
  type: "main" | "branch";
  address: string;
  province: string;
  district: string;
  localLevel: string;
  ward: number;
  phone: string;
  email: string;
  head: string;
  gradeFrom: string;
  gradeTo: string;
  brandingColor: string;
  studentCount: number;
  openedOn: string;
}

export interface LegalEntity {
  id: string;
  name: string;
  type: "company" | "trust" | "community" | "government";
  pan: string;
  registrationNumber: string;
  address: string;
  isPrimary: boolean;
}

export interface Institution {
  id: string;
  legalName: string;
  name: string;
  nameNe: string;
  iemisCode: string;
  registrationNumber: string;
  schoolType: string;
  province: string;
  district: string;
  localLevel: string;
  ward: number;
  establishedOn: string;
  governingBody: string;
  recognition: string;
  affiliation: string;
  pan: string;
  website: string;
  email: string;
  phone: string;
  moto: string;
}

export type OrgUnitType = "academic" | "administrative" | "support";

export interface OrgUnit {
  id: string;
  name: string;
  nameNe?: string;
  code: string;
  type: OrgUnitType;
  parentId: string | null;
  head: string;
  headRole: string;
  staffCount: number;
  budgetCode?: string;
  status: "active" | "inactive";
}

export type LocationType =
  | "site"
  | "building"
  | "floor"
  | "room"
  | "lab"
  | "hall"
  | "field";

export type BookingPolicy = "open" | "approval" | "restricted" | "closed";

export interface LocationNode {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  parentId: string | null;
  capacity?: number;
  accessibility: boolean;
  equipment: string[];
  safetyRating?: number; // 1..5, only rooms/labs/halls
  bookingPolicy: BookingPolicy;
  barcode: string;
  shared: boolean;
  department?: string;
  status: "available" | "occupied" | "maintenance";
}

export interface Holiday {
  id: string;
  name: string;
  nameNe: string;
  date: string; // AD
  dateBs: string; // BS display (prototype static mapping)
  type: "public" | "school" | "festival";
}

export interface CalendarYear {
  id: string;
  academicYear: string;
  adRange: string;
  bsRange: string;
  totalDays: number;
  workingDays: number;
  status: "current" | "upcoming" | "completed";
}

export interface LocaleSettings {
  id: string;
  timezone: string;
  weekStart: "sunday" | "monday";
  dateFormat: string;
  numberFormat: string;
  language: "en" | "ne" | "both";
  calendarSystem: "BS" | "AD" | "both";
  fiscalYearStart: string;
}

export interface DocSequence {
  id: string;
  docType: string;
  description: string;
  prefix: string;
  currentNumber: number;
  padLength: number;
  period: string;
  locked: boolean;
  lastIssued?: string;
}

export type FeatureCategory = "academics" | "finance" | "transport" | "library" | "communication" | "hr";

export interface FeatureFlag {
  id: string;
  featureCode: string;
  name: string;
  description: string;
  category: FeatureCategory;
  enabled: boolean;
  scope: "tenant" | "campus" | "role";
  campusId?: string | null;
  role?: string | null;
  effectiveFrom: string;
}

export type ConfigStatus = "draft" | "in_review" | "approved" | "published" | "rejected";

export interface ConfigVersion {
  id: string;
  version: string;
  status: ConfigStatus;
  createdBy: string;
  createdOn: string;
  approvedBy?: string;
  notes: string;
  changes: number;
  targetEnv: Environment;
}

export interface AuditEntry {
  id: string;
  ts: string;
  actor: string;
  action: string;
  entity: string;
  detail: string;
  recordsAffected: number;
}

// ── M02 Identity, Access and Delegation — domain types ──────────────────────

export type IdentityStatus = "active" | "inactive" | "locked" | "suspended" | "pending_activation" | "archived";

export type IdentityType = "staff" | "student" | "guardian" | "vendor" | "admin" | "service_account";

export interface UserIdentity {
  id: string;
  tenantId: string;
  schoolId?: string;
  username: string;
  email: string;
  phone?: string;
  displayName: string;
  displayNameNe?: string;
  type: IdentityType;
  status: IdentityStatus;
  passwordHash?: string;
  mfaEnabled: boolean;
  mfaMethod?: "totp" | "sms" | "email";
  lastLogin?: string;
  failedAttempts: number;
  lockedUntil?: string;
  passwordChangedOn?: string;
  mustChangePassword: boolean;
  avatar?: string;
  personId?: string;
  createdOn: string;
  updatedOn: string;
}

export type AuthProvider = "local" | "google" | "microsoft" | "sso" | "saml";

export interface AuthSession {
  id: string;
  userId: string;
  provider: AuthProvider;
  issuedAt: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
  isActive: boolean;
  revokedAt?: string;
  revokeReason?: string;
}

export interface AuthFactor {
  id: string;
  userId: string;
  type: "totp" | "sms" | "email" | "backup_codes";
  enabled: boolean;
  enrolledOn: string;
  lastUsed?: string;
  label?: string;
}

export type PermissionEffect = "allow" | "deny";

export interface Permission {
  id: string;
  resource: string;
  action: string;
  effect: PermissionEffect;
  conditions?: string;
}

export interface Role {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  nameNe?: string;
  description: string;
  isSystem: boolean;
  isDefault: boolean;
  priority: number;
  permissions: Permission[];
  createdOn: string;
}

export interface UserRole {
  id: string;
  userId: string;
  userName: string;
  roleId: string;
  roleName: string;
  scope: "tenant" | "campus" | "org_unit";
  scopeId?: string;
  scopeName?: string;
  assignedBy: string;
  assignedOn: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}

export interface DataScope {
  id: string;
  userId: string;
  userName: string;
  scopeType: "tenant" | "campus" | "org_unit" | "class_section";
  scopeId: string;
  scopeName: string;
  grantedBy: string;
  grantedOn: string;
}

export interface Delegation {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegateId: string;
  delegateName: string;
  reason: string;
  scope: string;
  validFrom: string;
  validTo: string;
  status: "active" | "expired" | "revoked";
  revokedBy?: string;
  revokedOn?: string;
  createdOn: string;
}

export interface ImpersonationLog {
  id: string;
  adminId: string;
  adminName: string;
  targetUserId: string;
  targetName: string;
  reason: string;
  startedAt: string;
  endedAt?: string;
  actionsPerformed: number;
  status: "active" | "ended" | "forced_end";
}

export interface DutyRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  conflictingRoles: [string, string];
  enforcement: "strict" | "warning" | "advisory";
  isActive: boolean;
  exceptionNote?: string;
  createdBy: string;
  createdOn: string;
}

export interface DutyViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  userId: string;
  userName: string;
  roleA: string;
  roleB: string;
  detectedOn: string;
  severity: "critical" | "high" | "medium";
  status: "open" | "acknowledged" | "resolved" | "waived";
  resolvedBy?: string;
  resolvedOn?: string;
  notes?: string;
}

export type PrivilegeLevel = "standard" | "elevated" | "emergency" | "break_glass";

export interface PrivilegedAccess {
  id: string;
  userId: string;
  userName: string;
  level: PrivilegeLevel;
  resource: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  requestedOn: string;
  validFrom: string;
  validTo: string;
  status: "pending" | "approved" | "active" | "expired" | "revoked";
  conditions?: string;
  usedCount: number;
  maxUses?: number;
}

export interface AccessReview {
  id: string;
  tenantId: string;
  reviewPeriod: string;
  reviewerId: string;
  reviewerName: string;
  scope: string;
  totalIdentities: number;
  reviewed: number;
  approved: number;
  revoked: number;
  status: "draft" | "in_progress" | "completed" | "certified";
  startedOn: string;
  completedOn?: string;
  certifiedBy?: string;
}

// ── M03 School Academic Foundation and Catalog — domain types ───────────────

export type AcademicYearStatus = "planning" | "active" | "closed";

export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  startDate: string;
  endDate: string;
  bsYear?: string;
  status: AcademicYearStatus;
  isCurrent: boolean;
  createdOn: string;
}

export interface Term {
  id: string;
  academicYearId: string;
  academicYearName: string;
  name: string;
  nameNe?: string;
  startDate: string;
  endDate: string;
  sequence: number;
  status: "planned" | "active" | "completed";
}

export type SchoolLevelCode = "ECED" | "Basic" | "Secondary" | "Plus2";

export interface SchoolLevel {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  code: SchoolLevelCode;
  description: string;
  ageRange?: string;
  sequence: number;
  isActive: boolean;
}

export interface GradeClass {
  id: string;
  tenantId: string;
  levelId: string;
  levelName: string;
  name: string;
  nameNe?: string;
  code: string;
  sequence: number;
  isActive: boolean;
}

export interface Stream {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  code: string;
  description: string;
  gradeClassId: string;
  gradeClassName: string;
  isActive: boolean;
}

export type SubjectType = "core" | "elective" | "practical" | "extra";

export interface Subject {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  code: string;
  description: string;
  type: SubjectType;
  levelId: string;
  levelName: string;
  isActive: boolean;
}

export interface CurriculumOffering {
  id: string;
  tenantId: string;
  subjectId: string;
  subjectName: string;
  gradeClassId: string;
  gradeClassName: string;
  streamId?: string;
  streamName?: string;
  isCompulsory: boolean;
  fullMarks: number;
  passMarks: number;
  creditHours?: number;
  isActive: boolean;
}

export interface Section {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  gradeClassId: string;
  gradeClassName: string;
  academicYearId: string;
  academicYearName: string;
  capacity: number;
  enrolled: number;
  classTeacherId?: string;
  classTeacherName?: string;
  roomNo?: string;
  isActive: boolean;
}

export interface House {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  code: string;
  color: string;
  description: string;
  memberCount: number;
}

export interface Cohort {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  academicYearId: string;
  academicYearName: string;
  gradeClassId: string;
  gradeClassName: string;
  description: string;
  studentCount: number;
}

export interface GradeEntry {
  letter: string;
  minMark: number;
  maxMark: number;
  gpa: number;
  description: string;
}

export interface GradingScale {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  description: string;
  grades: GradeEntry[];
  isActive: boolean;
  isDefault: boolean;
}

export interface PromotionRule {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  fromGradeId: string;
  fromGradeName: string;
  toGradeId: string;
  toGradeName: string;
  minGpa: number;
  minAttendance: number;
  maxBacklogs: number;
  isActive: boolean;
}

export interface CompletionRule {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  gradeClassId: string;
  gradeClassName: string;
  minGpa: number;
  minCreditHours: number;
  requirements: string;
  isActive: boolean;
}

export type PolicyCategory = "attendance" | "assessment" | "promotion" | "discipline" | "examination" | "general";

export type PolicyStatus = "draft" | "approved" | "published" | "archived";

export interface AcademicPolicy {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  category: PolicyCategory;
  description: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: PolicyStatus;
  approvedBy?: string;
  createdOn: string;
}

// ── M04 CRM, Enquiry and Admissions — domain types ───────────────────────

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  nameNe?: string;
  code: string;
  channel: "web" | "walk_in" | "referral" | "agent" | "fair" | "social";
  startDate: string;
  endDate: string;
  budget?: number;
  targetEnquiries: number;
  actualEnquiries: number;
  status: CampaignStatus;
  createdOn: string;
}

export type EnquiryStatus = "new" | "contacted" | "interested" | "visit_scheduled" | "applied" | "converted" | "lost";
export type EnquirySource = "web" | "walk_in" | "referral" | "agent" | "fair" | "social" | "campaign";

export interface Enquiry {
  id: string;
  tenantId: string;
  campaignId?: string;
  campaignName?: string;
  studentName: string;
  studentNameNe?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  address?: string;
  interestedGradeId: string;
  interestedGradeName: string;
  interestedStreamId?: string;
  interestedStreamName?: string;
  source: EnquirySource;
  status: EnquiryStatus;
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
  createdOn: string;
}

export type InteractionType = "call" | "visit" | "campus_tour" | "email" | "whatsapp" | "follow_up";

export interface EnquiryInteraction {
  id: string;
  tenantId: string;
  enquiryId: string;
  enquiryName: string;
  type: InteractionType;
  occurredAt: string;
  performedBy: string;
  performedByName: string;
  notes: string;
  nextAction?: string;
  nextFollowUp?: string;
  outcome?: string;
}

export type ApplicationStatus = "draft" | "submitted" | "under_review" | "eligible" | "not_eligible" | "admitted" | "rejected" | "withdrawn";

export interface Application {
  id: string;
  tenantId: string;
  applicationNo: string;
  enquiryId?: string;
  studentName: string;
  studentNameNe?: string;
  dateOfBirth: string;
  dateOfBirthBs?: string;
  gender: "male" | "female" | "other";
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  address: string;
  academicYearId: string;
  academicYearName: string;
  appliedGradeId: string;
  appliedGradeName: string;
  appliedStreamId?: string;
  appliedStreamName?: string;
  previousSchool?: string;
  previousGrade?: string;
  status: ApplicationStatus;
  submittedOn?: string;
  reviewedBy?: string;
  reviewedOn?: string;
  createdOn: string;
}

export interface ApplicationChoice {
  id: string;
  tenantId: string;
  applicationId: string;
  offeringRef: string;
  offeringName: string;
  preference: number;
}

export type DocumentStatus = "missing" | "received" | "verified" | "rejected" | "expired" | "waived";

export interface ApplicationDocument {
  id: string;
  tenantId: string;
  applicationId: string;
  documentType: string;
  documentName: string;
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedOn?: string;
  remarks?: string;
}

export type EligibilityOutcome = "pending" | "eligible" | "not_eligible" | "conditional" | "manual_review";

export interface EligibilityDecision {
  id: string;
  tenantId: string;
  applicationId: string;
  applicationName: string;
  ruleName: string;
  outcome: EligibilityOutcome;
  reason: string;
  decidedBy: string;
  decidedOn: string;
  remarks?: string;
}

export type SelectionEventType = "entrance_test" | "interview" | "both";

export interface SelectionEvent {
  id: string;
  tenantId: string;
  applicationId: string;
  applicationName: string;
  type: SelectionEventType;
  scheduledDate: string;
  scheduledTime?: string;
  venue?: string;
  panelMembers?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  createdOn: string;
}

export interface SelectionScore {
  id: string;
  tenantId: string;
  selectionEventId: string;
  criterion: string;
  maxScore: number;
  score: number;
  remarks?: string;
  evaluatedBy: string;
}

export type OfferStatus = "pending" | "offered" | "accepted" | "declined" | "waitlisted" | "expired" | "withdrawn";

export interface Offer {
  id: string;
  tenantId: string;
  applicationId: string;
  applicationName: string;
  offerType: "unconditional" | "conditional" | "waitlist";
  offeredGradeId: string;
  offeredGradeName: string;
  offeredStreamId?: string;
  offeredStreamName?: string;
  conditions?: string;
  validUntil: string;
  status: OfferStatus;
  issuedOn: string;
  issuedBy: string;
}

export interface OfferAcceptance {
  id: string;
  tenantId: string;
  offerId: string;
  offerName: string;
  acceptedOn: string;
  acceptedBy: string;
  depositPaid: boolean;
  depositAmount?: number;
  remarks?: string;
}

export type ConversionState = "pending" | "in_progress" | "completed" | "failed" | "cancelled";

export interface ConversionCase {
  id: string;
  tenantId: string;
  acceptanceId: string;
  acceptanceName: string;
  applicationId: string;
  studentName: string;
  state: ConversionState;
  admissionNo?: string;
  startedOn: string;
  completedOn?: string;
  createdOn: string;
}

export type StepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface ConversionStep {
  id: string;
  tenantId: string;
  conversionId: string;
  stepCode: string;
  stepName: string;
  status: StepStatus;
  startedOn?: string;
  completedOn?: string;
  errorMessage?: string;
  retryCount: number;
}

// ── M05 Student Information and Lifecycle — domain types ─────────────────

export type Gender = "male" | "female" | "other";

export interface Person {
  id: string;
  tenantId: string;
  legalName: string;
  officialName: string;
  officialNameNe?: string;
  preferredName?: string;
  dateOfBirth: string;
  dateOfBirthBs?: string;
  gender: Gender;
  nationality: string;
  photoUrl?: string;
  dedupeKey: string;
  createdOn: string;
}

export type StudentStatus = "active" | "inactive" | "graduated" | "transferred" | "expelled" | "withdrawn";

export interface Student {
  id: string;
  tenantId: string;
  personId: string;
  personName: string;
  admissionNo: string;
  admissionNumber: string;
  iemisId?: string;
  status: StudentStatus;
  admittedOn: string;
  completionDate?: string;
  currentGradeId?: string;
  currentGradeName?: string;
  currentSectionId?: string;
  currentSectionName?: string;
  createdOn: string;
}

export interface Guardian {
  id: string;
  tenantId: string;
  personId: string;
  personName: string;
  name: string;
  phone: string;
  email?: string;
  occupation?: string;
  relationToStudent: string;
  createdOn: string;
}

export type RelationshipType = "parent" | "guardian" | "emergency_contact" | "pickup_authorized";

export interface StudentGuardian {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  guardianId: string;
  guardianName: string;
  type: RelationshipType;
  isPrimary: boolean;
  validFrom: string;
  validTo?: string;
}

export type StudentDocType = "birth_certificate" | "citizenship" | "photo" | "transcript" | "migration" | "character_certificate" | "medical" | "other";

export interface StudentDocument {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  type: StudentDocType;
  documentName: string;
  fileRef?: string;
  verifiedBy?: string;
  verifiedOn?: string;
  status: "pending" | "verified" | "rejected";
  createdOn: string;
}

export type EnrolmentStatus = "enrolled" | "promoted" | "repeated" | "transferred" | "withdrawn" | "completed";

export interface Enrolment {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  academicYearId: string;
  academicYearName: string;
  gradeId: string;
  gradeName: string;
  sectionId?: string;
  sectionName?: string;
  streamId?: string;
  streamName?: string;
  rollNumber?: string;
  status: EnrolmentStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  createdOn: string;
}

export interface SubjectSelection {
  id: string;
  tenantId: string;
  enrolmentId: string;
  studentName: string;
  subjectOfferingRef: string;
  subjectName: string;
  isCompulsory: boolean;
  status: "selected" | "dropped" | "completed";
  createdOn: string;
}

export type MovementType = "promotion" | "repeat" | "transfer_in" | "transfer_out" | "withdrawal" | "re_admission";

export interface StudentMovement {
  id: string;
  tenantId: string;
  enrolmentId: string;
  studentName: string;
  type: MovementType;
  fromGradeName?: string;
  toGradeName?: string;
  fromSectionName?: string;
  toSectionName?: string;
  effectiveDate: string;
  reason?: string;
  approvedBy?: string;
  createdOn: string;
}

export type AuditOutcome = "promoted" | "conditionally_promoted" | "repeated" | "completed" | "failed";

export interface ProgressionAudit {
  id: string;
  tenantId: string;
  enrolmentId: string;
  studentName: string;
  gradeName: string;
  academicYearName: string;
  ruleVersion: string;
  outcome: AuditOutcome;
  gpa?: number;
  attendance?: number;
  backlogs?: number;
  remarks?: string;
  decidedBy: string;
  decidedOn: string;
  recordHash?: string;
}

export type HoldType = "academic" | "financial" | "disciplinary" | "library" | "transport" | "administrative";

export interface StudentHold {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  holdType: HoldType;
  ownerModule: string;
  reason: string;
  placedBy: string;
  placedOn: string;
  releasedBy?: string;
  releasedOn?: string;
  status: "active" | "released" | "expired";
}

export interface ClearanceCase {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  purpose: "transfer" | "graduation" | "withdrawal" | "library" | "general";
  status: "pending" | "in_progress" | "cleared" | "blocked";
  initiatedBy: string;
  initiatedOn: string;
  completedOn?: string;
  createdOn: string;
}

export interface ClearanceResponse {
  id: string;
  tenantId: string;
  clearanceId: string;
  moduleCode: string;
  moduleName: string;
  decision: "cleared" | "not_cleared" | "not_applicable";
  respondedBy: string;
  respondedOn: string;
  remarks?: string;
}

export type CardType = "student_id" | "library" | "transport" | "rfid";

export interface IdentityCard {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  cardType: CardType;
  serial: string;
  issuedOn: string;
  validUntil: string;
  status: "active" | "lost" | "expired" | "replaced";
  replacedBy?: string;
  createdOn: string;
}

// ── M06 Curriculum, Teaching and Quality — domain types ──────────────────────

export type CurriculumMapStatus = "draft" | "submitted" | "verified" | "approved" | "published" | "superseded";

export interface CurriculumMap {
  id: string;
  tenantId: string;
  schoolId: string;
  offeringRef: string;
  version: number;
  status: CurriculumMapStatus;
  createdOn: string;
  updatedOn: string;
}

export interface LearningOutcome {
  id: string;
  tenantId: string;
  schoolId: string;
  curriculumMapId: string;
  code: string;
  description: string;
  createdOn: string;
  updatedOn: string;
}

export type SyllabusStatus = "draft" | "approved" | "published" | "archived";

export interface SyllabusPlan {
  id: string;
  tenantId: string;
  schoolId: string;
  offeringRef: string;
  academicPeriodRef: string;
  name: string;
  status: SyllabusStatus;
  createdOn: string;
  updatedOn: string;
}

export interface ContentPlanItem {
  id: string;
  tenantId: string;
  schoolId: string;
  syllabusPlanId: string;
  sequence: string;
  topic: string;
  resources?: string;
  assessmentMethod?: string;
  createdOn: string;
  updatedOn: string;
}

export interface TeachingAssignment {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  sectionRef: string;
  sectionName: string;
  offeringRef: string;
  subjectName: string;
  createdOn: string;
  updatedOn: string;
}

export type LessonPlanStatus = "draft" | "submitted" | "approved" | "active" | "completed" | "cancelled";

export interface LessonPlan {
  id: string;
  tenantId: string;
  schoolId: string;
  assignmentId: string;
  localDate: string;
  status: LessonPlanStatus;
  objectives: string;
  methods: string;
  resources: string;
  homework?: string;
  assessmentCheck: string;
  createdOn: string;
  updatedOn: string;
}

export interface CoverageEntry {
  id: string;
  tenantId: string;
  schoolId: string;
  lessonPlanId: string;
  completedAt: string;
  notes?: string;
  createdOn: string;
  updatedOn: string;
}

export type ActivityType = "teaching" | "assessment" | "administration" | "guidance" | "extra_curricular";

export interface WorkloadAllocation {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  activityType: ActivityType;
  units: string;
  periodStart: string;
  periodEnd: string;
  createdOn: string;
  updatedOn: string;
}

export type ReviewScopeType = "school" | "faculty" | "subject" | "affiliation";
export type ReviewType = "internal" | "external" | "affiliation" | "moderation";
export type ReviewStatus = "draft" | "in_progress" | "completed" | "certified";

export interface QualityReview {
  id: string;
  tenantId: string;
  schoolId: string;
  scopeType: ReviewScopeType;
  scopeId: string;
  reviewType: ReviewType;
  cycle: string;
  status: ReviewStatus;
  findings?: string;
  createdOn: string;
  updatedOn: string;
}

export interface QualityEvidence {
  id: string;
  tenantId: string;
  schoolId: string;
  reviewId: string;
  objectRef: string;
  objectType: string;
  description: string;
  createdOn: string;
  updatedOn: string;
}

export type ModerationOutcome = "agreed" | "disagreed" | "revised" | "pending";

export interface ModerationReview {
  id: string;
  tenantId: string;
  schoolId: string;
  reviewId: string;
  subjectRef: string;
  subjectName: string;
  outcome: ModerationOutcome;
  remarks: string;
  reviewerId: string;
  reviewerName: string;
  isAnonymous: boolean;
  createdOn: string;
  updatedOn: string;
}

export type ReviewActionStatus = "draft" | "open" | "in_progress" | "completed" | "overdue";

export interface ReviewAction {
  id: string;
  tenantId: string;
  schoolId: string;
  reviewId: string;
  ownerRef: string;
  ownerName: string;
  dueDate: string;
  status: ReviewActionStatus;
  action: string;
  createdOn: string;
  updatedOn: string;
}

// ── M07 Scheduling, Attendance and Time — domain types ───────────────────────

export type TimetableStatus = "draft" | "approved" | "published" | "archived";

export interface Timetable {
  id: string;
  tenantId: string;
  schoolId: string;
  academicPeriodRef: string;
  academicPeriodName?: string;
  campusId: string;
  campusName?: string;
  version: number;
  name: string;
  status: TimetableStatus;
  createdOn: string;
  updatedOn: string;
}

export interface TimetableSlot {
  id: string;
  tenantId: string;
  schoolId: string;
  timetableId: string;
  timetableName?: string;
  dayPattern: string;
  startTime: string;
  endTime: string;
  createdOn: string;
  updatedOn: string;
}

export interface TimetableAssignment {
  id: string;
  tenantId: string;
  schoolId: string;
  timetableId: string;
  slotId: string;
  slotLabel?: string;
  sectionRef: string;
  sectionName: string;
  offeringRef: string;
  offeringName: string;
  staffRef: string;
  staffName: string;
  locationRef?: string;
  locationName?: string;
  createdOn: string;
  updatedOn: string;
}

export type SubstitutionStatus = "pending" | "approved" | "rejected" | "completed";

export interface Substitution {
  id: string;
  tenantId: string;
  schoolId: string;
  assignmentId: string;
  assignmentLabel?: string;
  localDate: string;
  replacementStaffRef: string;
  replacementStaffName: string;
  reason?: string;
  status: SubstitutionStatus;
  createdOn: string;
  updatedOn: string;
}

export type AttendanceSessionStatus = "scheduled" | "open" | "finalized" | "cancelled";

export interface AttendanceSession {
  id: string;
  tenantId: string;
  schoolId: string;
  assignmentRef?: string;
  localDate: string;
  status: AttendanceSessionStatus;
  courseOfferingId?: string;
  courseOfferingName?: string;
  sectionId: string;
  sectionName: string;
  sessionDate: string;
  periodNo?: number;
  scheduledStartAt: string;
  scheduledEndAt: string;
  finalizedAt?: string;
  createdOn: string;
  updatedOn: string;
}

export type StudentAttendanceStatus = "present" | "absent" | "late" | "excused" | "leave" | "half_day" | "unknown";

export interface StudentAttendance {
  id: string;
  tenantId: string;
  schoolId: string;
  sessionId: string;
  sessionLabel?: string;
  studentRef: string;
  studentName: string;
  status: StudentAttendanceStatus;
  recordedAt: string;
  remarks?: string;
  createdOn: string;
  updatedOn: string;
}

export type CorrectionStatus = "draft" | "pending" | "approved" | "rejected";

export interface AttendanceCorrection {
  id: string;
  tenantId: string;
  schoolId: string;
  sessionId: string;
  studentRef: string;
  studentName: string;
  fromStatus: StudentAttendanceStatus;
  toStatus: StudentAttendanceStatus;
  reason: string;
  approval?: string;
  status: CorrectionStatus;
  createdOn: string;
  updatedOn: string;
}

export type AlertStatus = "open" | "acknowledged" | "resolved" | "dismissed";

export interface AttendanceAlert {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  ruleVersion: string;
  alertType: string;
  message?: string;
  status: AlertStatus;
  createdOn: string;
  updatedOn: string;
}

export interface Shift {
  id: string;
  tenantId: string;
  schoolId: string;
  campusId: string;
  campusName?: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  createdOn: string;
  updatedOn: string;
}

export type RosterStatus = "scheduled" | "completed" | "absent" | "on_leave";

export interface StaffRoster {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  localDate: string;
  shiftId: string;
  shiftName?: string;
  status: RosterStatus;
  createdOn: string;
  updatedOn: string;
}

export type TimeSource = "manual" | "qr" | "rfid" | "biometric" | "device";
export type TimeEntryStatus = "pending" | "approved" | "rejected";

export interface TimeEntry {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  occurredAt: string;
  source: TimeSource;
  status: TimeEntryStatus;
  createdOn: string;
  updatedOn: string;
}

export interface TimeAdjustment {
  id: string;
  tenantId: string;
  schoolId: string;
  timeEntryId: string;
  staffName?: string;
  reason: string;
  approval?: string;
  status: CorrectionStatus;
  createdOn: string;
  updatedOn: string;
}

// ── M08 Assessment, Examinations and Integrity — domain types ────────────────

export type AssessmentType = "formative" | "summative" | "unit_test" | "terminal" | "board_mock";
export type AssessmentStatus = "draft" | "published" | "active" | "archived";

export interface Assessment {
  id: string;
  tenantId: string;
  schoolId: string;
  academicPeriodRef: string;
  code: string;
  name: string;
  type: AssessmentType;
  maxMarks: number;
  passMarks: number;
  weight: number;
  status: AssessmentStatus;
  createdOn: string;
  updatedOn: string;
}

export interface AssessmentComponent {
  id: string;
  tenantId: string;
  schoolId: string;
  assessmentId: string;
  assessmentName?: string;
  name: string;
  maxMarks: number;
  weight: number;
  createdOn: string;
  updatedOn: string;
}

export type QuestionType = "mcq" | "short" | "long" | "practical" | "objective";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionStatus = "draft" | "approved" | "archived";

export interface Question {
  id: string;
  tenantId: string;
  schoolId: string;
  subjectRef: string;
  subjectName?: string;
  code: string;
  text: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  marks: number;
  status: QuestionStatus;
  createdOn: string;
  updatedOn: string;
}

export type PaperStatus = "draft" | "in_review" | "approved" | "published" | "archived";

export interface ExamPaper {
  id: string;
  tenantId: string;
  schoolId: string;
  assessmentId: string;
  assessmentName?: string;
  subjectRef: string;
  subjectName?: string;
  code: string;
  title: string;
  totalMarks: number;
  durationMins: number;
  status: PaperStatus;
  createdOn: string;
  updatedOn: string;
}

export type ExamType = "unit" | "terminal" | "pre_board" | "board" | "entrance";
export type ExamStatus = "draft" | "scheduled" | "ongoing" | "completed" | "cancelled";

export interface Exam {
  id: string;
  tenantId: string;
  schoolId: string;
  academicPeriodRef: string;
  name: string;
  code: string;
  type: ExamType;
  status: ExamStatus;
  startDate: string;
  endDate: string;
  createdOn: string;
  updatedOn: string;
}

export type RegistrationStatus = "registered" | "admitted" | "absent" | "cancelled" | "completed";

export interface ExamRegistration {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  examName?: string;
  studentRef: string;
  studentName: string;
  status: RegistrationStatus;
  createdOn: string;
  updatedOn: string;
}

export interface ExamRoom {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  examName?: string;
  locationRef: string;
  locationName?: string;
  capacity: number;
  createdOn: string;
  updatedOn: string;
}

export interface SeatAllocation {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  roomId: string;
  roomName?: string;
  studentRef: string;
  studentName: string;
  seatNo: string;
  createdOn: string;
  updatedOn: string;
}

export type InvigilationRole = "chief" | "assistant" | "reliever";

export interface InvigilationDuty {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  roomId: string;
  roomName?: string;
  staffRef: string;
  staffName: string;
  role: InvigilationRole;
  createdOn: string;
  updatedOn: string;
}

export type MarkStatus = "draft" | "submitted" | "verified" | "published";

export interface MarkEntry {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  registrationId: string;
  studentName?: string;
  subjectRef: string;
  subjectName?: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  status: MarkStatus;
  enteredBy: string;
  createdOn: string;
  updatedOn: string;
}

export type ModerationAction = "scaled" | "grace" | "remarked" | "no_change";
export type ModerationStatus = "pending" | "approved" | "rejected";

export interface ModerationRecord {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  subjectRef: string;
  action: ModerationAction;
  reason: string;
  adjustment: number;
  status: ModerationStatus;
  createdOn: string;
  updatedOn: string;
}

export type PracticalType = "practical" | "project" | "viva";
export type PracticalStatus = "scheduled" | "completed" | "absent" | "cancelled";

export interface PracticalExam {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  subjectRef: string;
  subjectName?: string;
  type: PracticalType;
  scheduledOn: string;
  venue?: string;
  status: PracticalStatus;
  createdOn: string;
  updatedOn: string;
}

export type IntegrityType = "malpractice" | "impersonation" | "cheating" | "disruption" | "other";
export type IntegrityStatus = "open" | "under_review" | "resolved" | "dismissed";

export interface IntegrityCase {
  id: string;
  tenantId: string;
  schoolId: string;
  examId: string;
  studentRef: string;
  studentName: string;
  type: IntegrityType;
  description: string;
  status: IntegrityStatus;
  createdOn: string;
  updatedOn: string;
}

export type RecheckStatus = "pending" | "in_review" | "approved" | "rejected" | "completed";

export interface RecheckRequest {
  id: string;
  tenantId: string;
  schoolId: string;
  markEntryId: string;
  studentName?: string;
  subjectRef: string;
  reason: string;
  status: RecheckStatus;
  requestedOn: string;
  createdOn: string;
  updatedOn: string;
}

// ── M09 School Results, Records and Certificates — domain types ──────────────

export type ResultRunStatus = "draft" | "computed" | "approved" | "published" | "superseded";
export type ResultOutcome = "pass" | "fail" | "withheld" | "absent";

export interface ResultRun {
  id: string;
  tenantId: string;
  schoolId: string;
  academicPeriodRef: string;
  examId: string;
  examName?: string;
  name: string;
  status: ResultRunStatus;
  computedOn?: string;
  createdOn: string;
  updatedOn: string;
}

export interface ResultLine {
  id: string;
  tenantId: string;
  schoolId: string;
  resultRunId: string;
  resultRunName?: string;
  studentRef: string;
  studentName: string;
  totalMarks: number;
  gpa?: number;
  grade?: string;
  outcome: ResultOutcome;
  rank?: number;
  createdOn: string;
  updatedOn: string;
}

export type PublicationStatus = "draft" | "approved" | "published" | "revoked";

export interface ResultPublication {
  id: string;
  tenantId: string;
  schoolId: string;
  resultRunId: string;
  resultRunName?: string;
  publishedOn: string;
  status: PublicationStatus;
  approvedBy?: string;
  createdOn: string;
  updatedOn: string;
}

export type CorrectionType = "retotal" | "recheck" | "grade_change" | "data_fix";
export type CorrectionStatus2 = "pending" | "approved" | "rejected" | "applied";

export interface ResultCorrection {
  id: string;
  tenantId: string;
  schoolId: string;
  resultLineId: string;
  studentName?: string;
  type: CorrectionType;
  reason: string;
  status: CorrectionStatus2;
  correctedBy?: string;
  createdOn: string;
  updatedOn: string;
}

export type MarksheetStatus = "draft" | "issued" | "reissued" | "revoked";

export interface Marksheet {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  academicPeriodRef: string;
  examId?: string;
  serial: string;
  status: MarksheetStatus;
  issuedOn: string;
  createdOn: string;
  updatedOn: string;
}

export type TranscriptStatus = "draft" | "issued" | "reissued";

export interface Transcript {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  fromPeriod: string;
  toPeriod: string;
  status: TranscriptStatus;
  issuedOn: string;
  createdOn: string;
  updatedOn: string;
}

export type CertificateType = "transfer" | "character" | "migration" | "provisional" | "bonafide" | "other";
export type CertificateStatus = "draft" | "issued" | "revoked" | "expired";

export interface Certificate {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  type: CertificateType;
  serial: string;
  status: CertificateStatus;
  issuedOn: string;
  validUntil?: string;
  createdOn: string;
  updatedOn: string;
}

export type CertRequestStatus = "pending" | "approved" | "issued" | "rejected";

export interface CertificateRequest {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  certificateType: CertificateType;
  purpose: string;
  status: CertRequestStatus;
  requestedOn: string;
  createdOn: string;
  updatedOn: string;
}

export type CredentialStatus = "active" | "revoked" | "expired";

export interface DigitalCredential {
  id: string;
  tenantId: string;
  schoolId: string;
  certificateId: string;
  certificateSerial?: string;
  studentName?: string;
  credentialCode: string;
  status: CredentialStatus;
  issuedOn: string;
  verifiedOn?: string;
  createdOn: string;
  updatedOn: string;
}

export type CompletionType = "SEE" | "NEB_12" | "school_completion" | "transfer";
export type CompletionStatus = "pending" | "completed" | "withheld" | "certified";

export interface CompletionRecord {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  gradeClassRef: string;
  academicPeriodRef: string;
  type: CompletionType;
  status: CompletionStatus;
  completedOn: string;
  createdOn: string;
  updatedOn: string;
}

// ── M11 Role-Based Portal Profiles ───────────────────────────────────────────

export interface StudentPortalProfile {
  id: string; tenantId: string; schoolId: string;
  studentId: string; studentName: string; grade: string; section: string;
  enrolledSubjects: string[]; upcomingExams: string[];
  attendanceSummary: { present: number; absent: number; late: number };
  feeBalance: number; lastResults: string[];
  dashboardConfig: Record<string, boolean>;
  createdOn: string; updatedOn: string;
}

export interface ParentPortalProfile {
  id: string; tenantId: string; schoolId: string;
  parentName: string; relation: string;
  wardIds: string[]; wardNames: string[];
  linkedSince: string;
  notificationPrefs: { sms: boolean; email: boolean; push: boolean };
  dashboardConfig: Record<string, boolean>;
  createdOn: string; updatedOn: string;
}

export interface TeacherPortalProfile {
  id: string; tenantId: string; schoolId: string;
  teacherId: string; teacherName: string;
  assignedSections: string[]; assignedSubjects: string[];
  classesToday: number; pendingGrading: number;
  pendingLeaves: number; advisorStudents: number;
  dashboardConfig: Record<string, boolean>;
  createdOn: string; updatedOn: string;
}

export interface ManagementDashboard {
  id: string; tenantId: string; schoolId: string;
  totalStudents: number; totalStaff: number;
  attendanceRate: number; feeCollectionRate: number;
  activeVehicles: number; pendingAdmissions: number;
  openTickets: number; upcomingEvents: number;
  kpiWidgets: string[];
  createdOn: string; updatedOn: string;
}

// ── M11 Portals, Mobile and Self-Service — domain types ──────────────────────

export type PortalAudience = "all" | "student" | "parent" | "teacher" | "staff";
export type PortalAnnouncementStatus = "draft" | "published" | "archived";

export interface PortalAnnouncement {
  id: string;
  tenantId: string;
  schoolId: string;
  title: string;
  body: string;
  targetAudience: PortalAudience;
  publishOn: string;
  expiresOn?: string;
  status: PortalAnnouncementStatus;
  createdOn: string;
  updatedOn: string;
}

export type PortalKind = "student" | "parent" | "teacher" | "admin" | "kiosk";
export interface PortalAccessLog {
  id: string;
  tenantId: string;
  schoolId: string;
  portal: PortalKind;
  userRef: string;
  userName: string;
  action: string;
  ip?: string;
  accessedOn: string;
  createdOn: string;
  updatedOn: string;
}

export type KioskStatus = "active" | "ended" | "error";
export interface KioskSession {
  id: string;
  tenantId: string;
  schoolId: string;
  kioskId: string;
  location: string;
  startedAt: string;
  endedAt?: string;
  status: KioskStatus;
  createdOn: string;
  updatedOn: string;
}

export type DevicePlatform = "android" | "ios" | "web";
export type DeviceStatus = "active" | "blocked" | "expired";
export interface MobileDevice {
  id: string;
  tenantId: string;
  schoolId: string;
  userRef: string;
  userName: string;
  deviceName: string;
  platform: DevicePlatform;
  lastSyncOn?: string;
  status: DeviceStatus;
  createdOn: string;
  updatedOn: string;
}

export type SyncStatus = "pending" | "synced" | "failed";
export interface OfflineSyncLog {
  id: string;
  tenantId: string;
  schoolId: string;
  deviceId: string;
  deviceName?: string;
  entityType: string;
  recordsSynced: number;
  status: SyncStatus;
  syncedOn?: string;
  createdOn: string;
  updatedOn: string;
}

export interface AccessibilityProfile {
  id: string;
  tenantId: string;
  schoolId: string;
  userRef: string;
  userName: string;
  theme: "light" | "dark" | "high_contrast";
  fontScale: number;
  language: string;
  createdOn: string;
  updatedOn: string;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export interface PortalTicket {
  id: string;
  tenantId: string;
  schoolId: string;
  requesterRef: string;
  requesterName: string;
  category: "access" | "content" | "technical" | "other";
  subject: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdOn: string;
  updatedOn: string;
}

// ── M12 Finance, Fees and Accounting — domain types ──────────────────────────

export type FiscalYearStatus = "draft" | "open" | "closed" | "locked";
export interface FiscalYear {
  id: string;
  tenantId: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: FiscalYearStatus;
  createdOn: string;
  updatedOn: string;
}

export type AccountType = "asset" | "liability" | "income" | "expense" | "equity";
export interface ChartOfAccount {
  id: string;
  tenantId: string;
  schoolId: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

export type JournalStatus = "draft" | "posted" | "reversed";
export interface JournalEntry {
  id: string;
  tenantId: string;
  schoolId: string;
  fiscalYearId: string;
  fiscalYearName?: string;
  entryNo: string;
  entryDate: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: JournalStatus;
  createdOn: string;
  updatedOn: string;
}

export interface FeeStructure {
  id: string;
  tenantId: string;
  schoolId: string;
  academicPeriodRef: string;
  academicPeriodName?: string;
  name: string;
  code: string;
  amount: number;
  frequency: "one_time" | "monthly" | "term" | "annual";
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

export type FeeAssignmentStatus = "assigned" | "invoiced" | "waived";
export interface FeeAssignment {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  feeStructureId: string;
  feeStructureName?: string;
  amount: number;
  discountAmount: number;
  dueDate: string;
  status: FeeAssignmentStatus;
  createdOn: string;
  updatedOn: string;
}

export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue" | "cancelled";
export interface Invoice {
  id: string;
  tenantId: string;
  schoolId: string;
  studentRef: string;
  studentName: string;
  academicPeriodRef: string;
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  createdOn: string;
  updatedOn: string;
}

export type PaymentMethod = "cash" | "bank" | "online" | "wallet";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export interface Payment {
  id: string;
  tenantId: string;
  schoolId: string;
  invoiceId: string;
  invoiceNo?: string;
  studentName?: string;
  amount: number;
  method: PaymentMethod;
  paidOn: string;
  status: PaymentStatus;
  reference?: string;
  createdOn: string;
  updatedOn: string;
}

export type CreditNoteStatus = "draft" | "approved" | "applied" | "rejected";
export interface CreditNote {
  id: string;
  tenantId: string;
  schoolId: string;
  invoiceId: string;
  invoiceNo?: string;
  amount: number;
  reason: string;
  status: CreditNoteStatus;
  createdOn: string;
  updatedOn: string;
}

export type VendorBillStatus = "draft" | "approved" | "paid" | "overdue";
export interface VendorBill {
  id: string;
  tenantId: string;
  schoolId: string;
  vendorName: string;
  billNo: string;
  billDate: string;
  amount: number;
  dueDate: string;
  status: VendorBillStatus;
  createdOn: string;
  updatedOn: string;
}

export type ExpenseClaimStatus = "draft" | "submitted" | "approved" | "rejected" | "paid";
export interface ExpenseClaim {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  category: string;
  amount: number;
  claimDate: string;
  status: ExpenseClaimStatus;
  description?: string;
  createdOn: string;
  updatedOn: string;
}

export interface BankAccount {
  id: string;
  tenantId: string;
  schoolId: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

export type RecurringFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export interface RecurringJournal {
  id: string; tenantId: string; schoolId: string;
  name: string; description: string;
  debitAccount: string; creditAccount: string;
  amount: number; frequency: RecurringFrequency;
  nextRunDate: string; lastRunDate: string;
  totalRuns: number; maxRuns: number;
  status: "active" | "paused" | "completed" | "cancelled";
  createdOn: string; updatedOn: string;
}

export type DisbursementStatus = "pending" | "approved" | "processed" | "cancelled";
export type DisbursementMethod = "bank_transfer" | "cheque" | "cash" | "online";
export interface DisbursementEntry {
  id: string; tenantId: string; schoolId: string;
  vendorId: string; vendorName: string;
  billId: string; billNumber: string;
  amount: number; method: DisbursementMethod;
  chequeNumber: string; bankAccount: string;
  status: DisbursementStatus; processedAt: string;
  approvedBy: string;
  createdOn: string; updatedOn: string;
}

export type ReconciliationStatus = "draft" | "in_progress" | "completed" | "discrepancy";
export interface BankReconciliation {
  id: string; tenantId: string; schoolId: string;
  bankAccountId: string; bankName: string;
  statementDate: string; statementBalance: number;
  bookBalance: number; difference: number;
  matchedEntries: number; unmatchedEntries: number;
  status: ReconciliationStatus;
  completedAt: string; reconciledBy: string;
  createdOn: string; updatedOn: string;
}

export type MatchStatus = "matched" | "unmatched" | "partial" | "disputed";
export interface BankReconciliationEntry {
  id: string; tenantId: string; schoolId: string;
  reconciliationId: string;
  transactionDate: string; description: string;
  bankAmount: number; bookAmount: number;
  status: MatchStatus; matchedEntryId: string;
  createdOn: string; updatedOn: string;
}

export type BudgetStatus = "draft" | "approved" | "locked";
export interface Budget {
  id: string;
  tenantId: string;
  schoolId: string;
  fiscalYearId: string;
  fiscalYearName?: string;
  department: string;
  allocatedAmount: number;
  utilizedAmount: number;
  status: BudgetStatus;
  createdOn: string;
  updatedOn: string;
}

export type ARStatus = "current" | "overdue" | "written_off" | "in_collection";
export interface AccountsReceivable {
  id: string; tenantId: string; schoolId: string;
  studentId: string; studentName: string; grade: string;
  invoiceId: string; invoiceNumber: string;
  totalAmount: number; paidAmount: number; balanceAmount: number;
  dueDate: string; status: ARStatus;
  agingDays: number; lastReminderDate: string;
  createdOn: string; updatedOn: string;
}

export type ScholarshipStatus = "active" | "inactive" | "expired" | "suspended";
export type DiscountType = "percentage" | "fixed" | "sibling" | "merit" | "need";
export interface ScholarshipScheme {
  id: string; tenantId: string; schoolId: string;
  name: string; description: string;
  discountType: DiscountType; discountValue: number;
  applicableGrades: string[]; maxRecipients: number;
  currentRecipients: number; status: ScholarshipStatus;
  validFrom: string; validUntil: string;
  createdOn: string; updatedOn: string;
}

export type OnlinePaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
export type PaymentGateway = "esewa" | "khalti" | "imepay" | "bank_transfer" | "cod";
export interface OnlinePaymentTransaction {
  id: string; tenantId: string; schoolId: string;
  invoiceId: string; studentId: string; studentName: string;
  amount: number; gateway: PaymentGateway;
  transactionRef: string; gatewayRef: string;
  status: OnlinePaymentStatus;
  initiatedAt: string; completedAt: string;
  createdOn: string; updatedOn: string;
}

export type RefundStatus = "pending" | "approved" | "processed" | "rejected";
export type WriteOffReason = "bad_debt" | "scholarship_adjustment" | "admin_correction" | "other";
export interface RefundRecord {
  id: string; tenantId: string; schoolId: string;
  invoiceId: string; studentId: string; studentName: string;
  amount: number; reason: string;
  approvedBy: string; status: RefundStatus;
  processedAt: string;
  createdOn: string; updatedOn: string;
}

export interface WriteOffEntry {
  id: string; tenantId: string; schoolId: string;
  studentId: string; studentName: string;
  invoiceId: string; amount: number;
  reason: WriteOffReason; approvedBy: string;
  writtenOffAt: string;
  createdOn: string; updatedOn: string;
}

export type DunningStatus = "scheduled" | "sent" | "acknowledged" | "escalated";
export type DunningLevel = "reminder" | "warning" | "final_notice" | "legal";
export interface DunningNotice {
  id: string; tenantId: string; schoolId: string;
  studentId: string; studentName: string;
  invoiceId: string; balanceAmount: number;
  level: DunningLevel; status: DunningStatus;
  sentAt: string; acknowledgedAt: string;
  nextActionDate: string;
  createdOn: string; updatedOn: string;
}

export type CommitmentStatus = "pledged" | "received" | "cancelled";
export interface CommitmentRecord {
  id: string; tenantId: string; schoolId: string;
  donorName: string; fundName: string; amount: number;
  pledgeDate: string; expectedDate: string; receivedDate: string;
  status: CommitmentStatus; remarks: string;
  createdOn: string; updatedOn: string;
}

export type TaxType = "vat" | "withholding" | "income" | "service";
export interface TaxCode {
  id: string; tenantId: string; schoolId: string;
  code: string; name: string; type: TaxType;
  rate: number; isExempt: boolean; description: string;
  createdOn: string; updatedOn: string;
}

export type AccrualStatus = "pending" | "reversed" | "posted";
export interface AccrualEntry {
  id: string; tenantId: string; schoolId: string;
  fiscalYearId: string; fiscalYearName: string;
  entryDate: string; description: string;
  debitAccount: string; creditAccount: string;
  amount: number; reversesOn: string;
  status: AccrualStatus;
  createdOn: string; updatedOn: string;
}

export type FundType = "general" | "restricted" | "endowment" | "project";
export interface Fund {
  id: string; tenantId: string; schoolId: string;
  name: string; code: string; type: FundType;
  balance: number; isRestricted: boolean; description: string;
  createdOn: string; updatedOn: string;
}

export type PeriodCloseStatus = "open" | "closing" | "closed";
export interface PeriodCloseChecklist {
  id: string; tenantId: string; schoolId: string;
  fiscalYearId: string; fiscalYearName: string;
  periodName: string; closedOn: string;
  totalJournalEntries: number; postedEntries: number;
  reconciliationsComplete: boolean; accrualsComplete: boolean;
  status: PeriodCloseStatus; closedBy: string;
  createdOn: string; updatedOn: string;
}

export type StatementType = "balance_sheet" | "income_statement" | "cash_flow" | "trial_balance";
export type StatementStatus = "draft" | "final";
export interface FinancialStatement {
  id: string; tenantId: string; schoolId: string;
  fiscalYearId: string; fiscalYearName: string;
  name: string; type: StatementType;
  asOfDate: string; totalDebit: number; totalCredit: number;
  status: StatementStatus; generatedBy: string;
  createdOn: string; updatedOn: string;
}

// ── M13 Human Resources and Payroll — domain types ───────────────────────────

export type StaffStatus = "active" | "on_leave" | "suspended" | "resigned" | "retired";
export interface StaffProfile {
  id: string;
  tenantId: string;
  schoolId: string;
  staffCode: string;
  name: string;
  department: string;
  designation: string;
  joinDate: string;
  status: StaffStatus;
  createdOn: string;
  updatedOn: string;
}

export interface Position {
  id: string;
  tenantId: string;
  schoolId: string;
  title: string;
  department: string;
  grade: string;
  isVacant: boolean;
  headCount: number;
  createdOn: string;
  updatedOn: string;
}

export type RecruitmentStage = "applied" | "shortlisted" | "interviewed" | "offered" | "hired" | "rejected";
export interface Recruitment {
  id: string;
  tenantId: string;
  schoolId: string;
  positionId: string;
  positionTitle?: string;
  applicantName: string;
  stage: RecruitmentStage;
  appliedOn: string;
  createdOn: string;
  updatedOn: string;
}

export type LeaveType = "sick" | "casual" | "annual" | "maternity" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export interface LeaveRequest {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
  createdOn: string;
  updatedOn: string;
}

export type ReviewStatus2 = "draft" | "submitted" | "approved" | "acknowledged";
export interface PerformanceReview {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  period: string;
  rating: number;
  reviewer: string;
  status: ReviewStatus2;
  remarks?: string;
  createdOn: string;
  updatedOn: string;
}

export interface Compensation {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  component: "basic" | "allowance" | "bonus" | "deduction";
  amount: number;
  effectiveFrom: string;
  createdOn: string;
  updatedOn: string;
}

export type PayrollStatus = "draft" | "computed" | "approved" | "paid" | "cancelled";
export interface PayrollRun {
  id: string;
  tenantId: string;
  schoolId: string;
  month: number;
  year: number;
  status: PayrollStatus;
  totalAmount: number;
  runOn: string;
  createdOn: string;
  updatedOn: string;
}

export type PayslipStatus = "draft" | "issued" | "paid";
export interface Payslip {
  id: string;
  tenantId: string;
  schoolId: string;
  payrollRunId: string;
  payrollMonth?: string;
  staffRef: string;
  staffName: string;
  gross: number;
  deductions: number;
  net: number;
  status: PayslipStatus;
  createdOn: string;
  updatedOn: string;
}

export type SeparationType = "resignation" | "retirement" | "termination" | "transfer";
export type SeparationStatus = "pending" | "approved" | "completed" | "cancelled";
export interface Separation {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  type: SeparationType;
  lastWorkingDate: string;
  status: SeparationStatus;
  reason: string;
  createdOn: string;
  updatedOn: string;
}

export type ContractType = "permanent" | "contract" | "probation" | "temporary";
export type ContractStatus = "active" | "expired" | "terminated";
export interface StaffContract {
  id: string;
  tenantId: string;
  schoolId: string;
  staffRef: string;
  staffName: string;
  contractType: ContractType;
  startDate: string;
  endDate?: string;
  salary: number;
  status: ContractStatus;
  createdOn: string;
  updatedOn: string;
}

// ── M16 Library and Learning Resources — domain types ───────────────────────

export type ResourceType = "book" | "journal" | "reference" | "digital" | "av" | "thesis";
export type ResourceStatus = "available" | "restricted" | "archived" | "lost";
export interface LibraryResource {
  id: string;
  tenantId: string;
  schoolId: string;
  accessionNo: string;
  title: string;
  subtitle?: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  language: string;
  category: string;
  type: ResourceType;
  shelfRef?: string;
  tags?: string[];
  status: ResourceStatus;
  createdOn: string;
  updatedOn: string;
}

export type HoldingCondition = "new" | "good" | "worn" | "damaged" | "lost" | "withdrawn";
export type HoldingStatusM16 = "available" | "issued" | "reserved" | "maintenance" | "lost";
export interface LibraryHolding {
  id: string;
  tenantId: string;
  schoolId: string;
  resourceId: string;
  resourceTitle?: string;
  copyNo: string;
  barcode: string;
  location: string;
  condition: HoldingCondition;
  status: HoldingStatusM16;
  acquiredOn: string;
  createdOn: string;
  updatedOn: string;
}

export type MemberType = "student" | "staff" | "external";
export type LibraryMemberStatus = "active" | "suspended" | "expired" | "blocked";
export interface LibraryMember {
  id: string;
  tenantId: string;
  schoolId: string;
  userRef: string;
  userName: string;
  memberType: MemberType;
  cardNo: string;
  enrolledOn: string;
  validUntil: string;
  status: LibraryMemberStatus;
  createdOn: string;
  updatedOn: string;
}

export type LoanStatus = "issued" | "returned" | "overdue" | "lost" | "renewed";
export interface LibraryLoan {
  id: string;
  tenantId: string;
  schoolId: string;
  memberId: string;
  memberName?: string;
  holdingId: string;
  resourceTitle?: string;
  issuedOn: string;
  dueOn: string;
  returnedOn?: string;
  status: LoanStatus;
  fineAmount: number;
  createdOn: string;
  updatedOn: string;
}

export type ReservationStatus = "pending" | "ready" | "collected" | "cancelled" | "expired";
export interface LibraryReservation {
  id: string;
  tenantId: string;
  schoolId: string;
  memberId: string;
  memberName?: string;
  resourceId: string;
  resourceTitle?: string;
  reservedOn: string;
  expiresOn?: string;
  status: ReservationStatus;
  createdOn: string;
  updatedOn: string;
}

export type AcquisitionStatus = "draft" | "ordered" | "received" | "cataloged" | "cancelled";
export type AcquisitionSource = "purchase" | "donation" | "exchange" | "subscription";
export interface LibraryAcquisition {
  id: string;
  tenantId: string;
  schoolId: string;
  resourceId?: string;
  title: string;
  vendorName: string;
  orderNo: string;
  source: AcquisitionSource;
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: AcquisitionStatus;
  orderedOn: string;
  receivedOn?: string;
  createdOn: string;
  updatedOn: string;
}

export type DigitalAccessStatus = "active" | "expired" | "revoked";
export interface DigitalResource {
  id: string;
  tenantId: string;
  schoolId: string;
  title: string;
  provider: string;
  url?: string;
  licenseKey?: string;
  accessType: "open" | "subscription" | "per_user";
  validFrom: string;
  validUntil?: string;
  status: DigitalAccessStatus;
  createdOn: string;
  updatedOn: string;
}

// ── M17 Transport and Fleet — domain types ─────────────────────────────────

export type VehicleType = "bus" | "minibus" | "van" | "car";
export type VehicleStatus = "active" | "maintenance" | "retired" | "idle";
export interface Vehicle {
  id: string;
  tenantId: string;
  schoolId: string;
  registrationNo: string;
  type: VehicleType;
  capacity: number;
  driverName?: string;
  driverContact?: string;
  fitnessUntil: string;
  insuranceUntil: string;
  permitUntil: string;
  pollutionUntil: string;
  status: VehicleStatus;
  createdOn: string;
  updatedOn: string;
}

export type RouteStatus = "active" | "inactive" | "archived";
export interface TransportRoute {
  id: string;
  tenantId: string;
  schoolId: string;
  code: string;
  name: string;
  direction: "pickup" | "drop" | "both";
  vehicleId?: string;
  vehicleNo?: string;
  totalDistanceKm: number;
  estimatedMins: number;
  status: RouteStatus;
  createdOn: string;
  updatedOn: string;
}

export interface BusStop {
  id: string;
  tenantId: string;
  schoolId: string;
  routeId: string;
  routeName?: string;
  name: string;
  sequence: number;
  arrivalTime?: string;
  latitude?: number;
  longitude?: number;
  status: "active" | "inactive";
  createdOn: string;
  updatedOn: string;
}

export type ScheduleStatus = "active" | "suspended" | "cancelled";
export interface RouteSchedule {
  id: string;
  tenantId: string;
  schoolId: string;
  routeId: string;
  routeName?: string;
  dayPattern: string;
  departureTime: string;
  arrivalTime: string;
  status: ScheduleStatus;
  createdOn: string;
  updatedOn: string;
}

export type RiderType = "student" | "staff";
export type AssignmentStatus = "active" | "inactive" | "pending" | "cancelled";
export interface RiderAssignment {
  id: string;
  tenantId: string;
  schoolId: string;
  riderRef: string;
  riderName: string;
  riderType: RiderType;
  routeId: string;
  routeName?: string;
  stopId?: string;
  stopName?: string;
  vehicleId?: string;
  pickupTime?: string;
  status: AssignmentStatus;
  createdOn: string;
  updatedOn: string;
}

export type BoardingStatus = "boarded" | "alighted" | "absent" | "no_show";
export interface BoardingLog {
  id: string;
  tenantId: string;
  schoolId: string;
  riderAssignmentId?: string;
  riderName: string;
  routeId?: string;
  vehicleId?: string;
  logDate: string;
  boardingStatus: BoardingStatus;
  recordedOn: string;
  remarks?: string;
  createdOn: string;
  updatedOn: string;
}

export type GpsStatus = "moving" | "stopped" | "idle" | "offline";
export interface GpsTrack {
  id: string;
  tenantId: string;
  schoolId: string;
  vehicleId: string;
  vehicleNo?: string;
  latitude: number;
  longitude: number;
  speedKmph: number;
  heading?: number;
  status: GpsStatus;
  trackedOn: string;
  createdOn: string;
  updatedOn: string;
}

export type MaintenanceType = "fuel" | "service" | "repair" | "inspection" | "tyre" | "other";
export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export interface VehicleMaintenance {
  id: string;
  tenantId: string;
  schoolId: string;
  vehicleId: string;
  vehicleNo?: string;
  type: MaintenanceType;
  description: string;
  cost: number;
  odometerKm?: number;
  performedOn?: string;
  nextDueOn?: string;
  status: MaintenanceStatus;
  createdOn: string;
  updatedOn: string;
}

// ── Database schema ─────────────────────────────────────────────────────────

export interface DBSchema {
  tenants: Tenant[];
  institution: Institution[];
  legalEntities: LegalEntity[];
  campuses: Campus[];
  orgUnits: OrgUnit[];
  locations: LocationNode[];
  holidays: Holiday[];
  calendarYears: CalendarYear[];
  locale: LocaleSettings[];
  sequences: DocSequence[];
  featureFlags: FeatureFlag[];
  configVersions: ConfigVersion[];
  audit: AuditEntry[];
  // M02 stores
  userIdentities: UserIdentity[];
  authSessions: AuthSession[];
  authFactors: AuthFactor[];
  roles: Role[];
  userRoles: UserRole[];
  dataScopes: DataScope[];
  delegations: Delegation[];
  impersonationLogs: ImpersonationLog[];
  dutyRules: DutyRule[];
  dutyViolations: DutyViolation[];
  privilegedAccess: PrivilegedAccess[];
  accessReviews: AccessReview[];
  // M03 stores
  academicYears: AcademicYear[];
  terms: Term[];
  schoolLevels: SchoolLevel[];
  gradeClasses: GradeClass[];
  streams: Stream[];
  subjects: Subject[];
  curriculumOfferings: CurriculumOffering[];
  sections: Section[];
  houses: House[];
  cohorts: Cohort[];
  gradingScales: GradingScale[];
  promotionRules: PromotionRule[];
  completionRules: CompletionRule[];
  academicPolicies: AcademicPolicy[];
  // M04 stores
  campaigns: Campaign[];
  enquiries: Enquiry[];
  enquiryInteractions: EnquiryInteraction[];
  applications: Application[];
  applicationChoices: ApplicationChoice[];
  applicationDocuments: ApplicationDocument[];
  eligibilityDecisions: EligibilityDecision[];
  selectionEvents: SelectionEvent[];
  selectionScores: SelectionScore[];
  offers: Offer[];
  offerAcceptances: OfferAcceptance[];
  conversionCases: ConversionCase[];
  conversionSteps: ConversionStep[];
  // M05 stores
  persons: Person[];
  students: Student[];
  guardians: Guardian[];
  studentGuardians: StudentGuardian[];
  studentDocuments: StudentDocument[];
  enrolments: Enrolment[];
  subjectSelections: SubjectSelection[];
  studentMovements: StudentMovement[];
  progressionAudits: ProgressionAudit[];
  studentHolds: StudentHold[];
  clearanceCases: ClearanceCase[];
  clearanceResponses: ClearanceResponse[];
  identityCards: IdentityCard[];
  // M06 stores
  curriculumMaps: CurriculumMap[];
  learningOutcomes: LearningOutcome[];
  syllabusPlans: SyllabusPlan[];
  contentPlanItems: ContentPlanItem[];
  teachingAssignments: TeachingAssignment[];
  lessonPlans: LessonPlan[];
  coverageEntries: CoverageEntry[];
  workloadAllocations: WorkloadAllocation[];
  qualityReviews: QualityReview[];
  qualityEvidences: QualityEvidence[];
  moderationReviews: ModerationReview[];
  reviewActions: ReviewAction[];
  // M07 stores
  timetables: Timetable[];
  timetableSlots: TimetableSlot[];
  timetableAssignments: TimetableAssignment[];
  substitutions: Substitution[];
  attendanceSessions: AttendanceSession[];
  studentAttendances: StudentAttendance[];
  attendanceCorrections: AttendanceCorrection[];
  attendanceAlerts: AttendanceAlert[];
  shifts: Shift[];
  staffRosters: StaffRoster[];
  timeEntries: TimeEntry[];
  timeAdjustments: TimeAdjustment[];
  // M08 stores
  assessments: Assessment[];
  assessmentComponents: AssessmentComponent[];
  questions: Question[];
  examPapers: ExamPaper[];
  exams: Exam[];
  examRegistrations: ExamRegistration[];
  examRooms: ExamRoom[];
  seatAllocations: SeatAllocation[];
  invigilationDuties: InvigilationDuty[];
  markEntries: MarkEntry[];
  moderationRecords: ModerationRecord[];
  practicalExams: PracticalExam[];
  integrityCases: IntegrityCase[];
  recheckRequests: RecheckRequest[];
  // M09 stores
  resultRuns: ResultRun[];
  resultLines: ResultLine[];
  resultPublications: ResultPublication[];
  resultCorrections: ResultCorrection[];
  marksheets: Marksheet[];
  transcripts: Transcript[];
  certificates: Certificate[];
  certificateRequests: CertificateRequest[];
  digitalCredentials: DigitalCredential[];
  completionRecords: CompletionRecord[];
  // M11 stores
  portalAnnouncements: PortalAnnouncement[];
  portalAccessLogs: PortalAccessLog[];
  kioskSessions: KioskSession[];
  mobileDevices: MobileDevice[];
  offlineSyncLogs: OfflineSyncLog[];
  accessibilityProfiles: AccessibilityProfile[];
  portalTickets: PortalTicket[];
  studentPortalProfiles: StudentPortalProfile[];
  parentPortalProfiles: ParentPortalProfile[];
  teacherPortalProfiles: TeacherPortalProfile[];
  managementDashboards: ManagementDashboard[];
  // M12 stores
  fiscalYears: FiscalYear[];
  chartOfAccounts: ChartOfAccount[];
  journalEntries: JournalEntry[];
  feeStructures: FeeStructure[];
  feeAssignments: FeeAssignment[];
  invoices: Invoice[];
  payments: Payment[];
  creditNotes: CreditNote[];
  vendorBills: VendorBill[];
  expenseClaims: ExpenseClaim[];
  recurringJournals: RecurringJournal[];
  disbursementEntries: DisbursementEntry[];
  bankReconciliations: BankReconciliation[];
  bankReconciliationEntries: BankReconciliationEntry[];
  bankAccounts: BankAccount[];
  budgets: Budget[];
  accountsReceivable: AccountsReceivable[];
  scholarshipSchemes: ScholarshipScheme[];
  onlinePaymentTransactions: OnlinePaymentTransaction[];
  refundRecords: RefundRecord[];
  writeOffEntries: WriteOffEntry[];
  dunningNotices: DunningNotice[];
  commitmentRecords: CommitmentRecord[];
  taxCodes: TaxCode[];
  accrualEntries: AccrualEntry[];
  funds: Fund[];
  periodCloseChecklists: PeriodCloseChecklist[];
  financialStatements: FinancialStatement[];
  // M13 stores
  staffProfiles: StaffProfile[];
  positions: Position[];
  recruitments: Recruitment[];
  leaveRequests: LeaveRequest[];
  performanceReviews: PerformanceReview[];
  compensations: Compensation[];
  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  separations: Separation[];
  staffContracts: StaffContract[];
  // M16 stores
  libraryResources: LibraryResource[];
  libraryHoldings: LibraryHolding[];
  libraryMembers: LibraryMember[];
  libraryLoans: LibraryLoan[];
  libraryReservations: LibraryReservation[];
  libraryAcquisitions: LibraryAcquisition[];
  digitalResources: DigitalResource[];
  // M17 stores
  vehicles: Vehicle[];
  transportRoutes: TransportRoute[];
  busStops: BusStop[];
  routeSchedules: RouteSchedule[];
  riderAssignments: RiderAssignment[];
  boardingLogs: BoardingLog[];
  gpsTracks: GpsTrack[];
  vehicleMaintenance: VehicleMaintenance[];
}

export type StoreName = keyof DBSchema;
