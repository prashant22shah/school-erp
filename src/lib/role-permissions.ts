// ── RBAC / ABAC Permission Engine ────────────────────────────────────────────
// Role-Based + Attribute-Based Access Control for the Shikshya ERP prototype.
// In production this would come from M02.03 RBAC/ABAC engine with OPA/Casbin.

// ── Types ────────────────────────────────────────────────────────────────────

export type UserRole =
  | "admin"
  | "principal"
  | "accountant"
  | "teacher"
  | "student"
  | "parent";

/** CRUD actions that can be controlled per resource. */
export type PermissionAction = "create" | "read" | "update" | "delete" | "export" | "approve";

/** Every entity/resource in the system. */
export type PermissionResource =
  // M01
  | "tenants" | "institutions" | "orgUnits" | "locations" | "calendars" | "featureFlags"
  // M02
  | "userIdentities" | "authSessions" | "roles" | "dataScopes" | "delegations" | "dutyRules" | "privilegedAccess"
  // M03
  | "academicYears" | "schoolLevels" | "subjects" | "sections" | "gradingScales" | "academicPolicies"
  // M04
  | "campaigns" | "applications" | "selections" | "conversions"
  // M05
  | "students" | "enrolments" | "holds"
  // M06
  | "curriculumMaps" | "syllabusPlans" | "lessonPlans" | "teachingWorkload" | "qualityReviews" | "facultyReviews"
  // M07
  | "timetables" | "substitutions" | "attendance" | "attendanceCorrections" | "shifts" | "attendanceAlerts"
  // M08
  | "assessments" | "questionBank" | "exams" | "examRooms" | "marks" | "moderation" | "practicals" | "integrityCases" | "rechecks"
  // M09
  | "results" | "resultPublications" | "resultCorrections" | "marksheets" | "certificates" | "credentials" | "completions"
  // M11
  | "portalAnnouncements" | "portalAccessLogs" | "kioskSessions" | "mobileDevices" | "accessibilityProfiles" | "portalTickets"
  | "studentPortal" | "parentPortal" | "teacherPortal" | "managementPortal"
  // M12
  | "fiscalYears" | "chartOfAccounts" | "journalEntries" | "recurringJournals" | "feeStructures" | "feeAssignments"
  | "invoices" | "accountsReceivable" | "scholarships" | "payments" | "onlinePayments" | "refunds" | "dunning"
  | "vendorBills" | "expenseClaims" | "disbursements" | "bankAccounts" | "bankReconciliation"
  | "budgets" | "commitments" | "taxCodes" | "accruals" | "funds" | "periodClose" | "financialStatements"
  // M13
  | "staffProfiles" | "positions" | "recruitments" | "leaveRequests" | "performanceReviews"
  | "compensation" | "payrollRules" | "payslips" | "separations"
  // M16
  | "libraryResources" | "libraryHoldings" | "libraryMembers" | "libraryLoans" | "libraryReservations"
  | "libraryAcquisitions" | "digitalResources"
  // M17
  | "vehicles" | "transportRoutes" | "busStops" | "routeSchedules" | "riderAssignments"
  | "boardingLogs" | "gpsTracks" | "vehicleMaintenance";

/** A single permission rule: role + resource + allowed actions. */
interface PermissionRule {
  role: UserRole;
  resource: PermissionResource;
  actions: PermissionAction[];
}

/** ABAC condition: extra attribute check beyond role. */
export interface AbacContext {
  /** The ID of the record being accessed. */
  recordOwnerId?: string;
  /** The department of the record. */
  recordDepartment?: string;
  /** The grade/class of the record. */
  recordGrade?: string;
  /** The user's own ID. */
  userId?: string;
  /** The user's department. */
  userDepartment?: string;
  /** The user's assigned sections. */
  userSections?: string[];
}

// ── RBAC Permission Matrix ───────────────────────────────────────────────────
// Defines which CRUD actions each role can perform on each resource.

const ROLE_PERMISSIONS: PermissionRule[] = [
  // ── Admin: full access to everything ────────────────────────────────────────
  { role: "admin", resource: "tenants", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "institutions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "orgUnits", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "locations", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "calendars", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "featureFlags", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "userIdentities", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "authSessions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "roles", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "dataScopes", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "delegations", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "dutyRules", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "privilegedAccess", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "academicYears", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "schoolLevels", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "subjects", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "sections", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "gradingScales", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "academicPolicies", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "campaigns", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "applications", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "selections", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "conversions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "students", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "enrolments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "holds", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "curriculumMaps", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "syllabusPlans", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "lessonPlans", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "teachingWorkload", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "qualityReviews", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "facultyReviews", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "timetables", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "substitutions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "attendance", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "attendanceCorrections", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "shifts", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "attendanceAlerts", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "assessments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "questionBank", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "exams", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "examRooms", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "marks", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "moderation", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "practicals", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "integrityCases", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "rechecks", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "results", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "resultPublications", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "resultCorrections", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "marksheets", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "certificates", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "credentials", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "completions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "portalAnnouncements", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "portalAccessLogs", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "kioskSessions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "mobileDevices", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "accessibilityProfiles", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "portalTickets", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "studentPortal", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "parentPortal", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "teacherPortal", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "managementPortal", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "fiscalYears", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "chartOfAccounts", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "journalEntries", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "recurringJournals", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "feeStructures", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "feeAssignments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "invoices", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "accountsReceivable", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "scholarships", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "payments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "onlinePayments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "refunds", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "dunning", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "vendorBills", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "expenseClaims", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "disbursements", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "bankAccounts", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "bankReconciliation", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "budgets", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "commitments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "taxCodes", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "accruals", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "funds", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "periodClose", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "financialStatements", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "staffProfiles", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "positions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "recruitments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "leaveRequests", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "performanceReviews", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "compensation", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "payrollRules", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "payslips", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "separations", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "libraryResources", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "libraryHoldings", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "libraryMembers", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "libraryLoans", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "libraryReservations", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "libraryAcquisitions", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "digitalResources", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "vehicles", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "transportRoutes", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "busStops", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "routeSchedules", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "riderAssignments", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "boardingLogs", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "gpsTracks", actions: ["create", "read", "update", "delete", "export", "approve"] },
  { role: "admin", resource: "vehicleMaintenance", actions: ["create", "read", "update", "delete", "export", "approve"] },

  // ── Principal: broad academic + operational + read finance ───────────────────
  { role: "principal", resource: "institutions", actions: ["read", "update"] },
  { role: "principal", resource: "orgUnits", actions: ["read", "update"] },
  { role: "principal", resource: "locations", actions: ["read", "update"] },
  { role: "principal", resource: "calendars", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "featureFlags", actions: ["read", "update"] },
  { role: "principal", resource: "userIdentities", actions: ["read"] },
  { role: "principal", resource: "roles", actions: ["read"] },
  { role: "principal", resource: "academicYears", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "schoolLevels", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "subjects", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "sections", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "gradingScales", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "academicPolicies", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "campaigns", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "applications", actions: ["create", "read", "update", "delete", "approve"] },
  { role: "principal", resource: "selections", actions: ["create", "read", "update", "delete", "approve"] },
  { role: "principal", resource: "conversions", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "students", actions: ["create", "read", "update", "delete", "export"] },
  { role: "principal", resource: "enrolments", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "holds", actions: ["create", "read", "update", "delete", "approve"] },
  { role: "principal", resource: "curriculumMaps", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "syllabusPlans", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "lessonPlans", actions: ["read", "update"] },
  { role: "principal", resource: "teachingWorkload", actions: ["read", "update"] },
  { role: "principal", resource: "qualityReviews", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "facultyReviews", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "timetables", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "substitutions", actions: ["read", "approve"] },
  { role: "principal", resource: "attendance", actions: ["read", "export"] },
  { role: "principal", resource: "attendanceCorrections", actions: ["read", "approve"] },
  { role: "principal", resource: "shifts", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "attendanceAlerts", actions: ["read"] },
  { role: "principal", resource: "assessments", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "questionBank", actions: ["read"] },
  { role: "principal", resource: "exams", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "examRooms", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "marks", actions: ["read", "export"] },
  { role: "principal", resource: "moderation", actions: ["create", "read", "update", "approve"] },
  { role: "principal", resource: "practicals", actions: ["read"] },
  { role: "principal", resource: "integrityCases", actions: ["create", "read", "update", "approve"] },
  { role: "principal", resource: "rechecks", actions: ["read", "approve"] },
  { role: "principal", resource: "results", actions: ["read", "approve"] },
  { role: "principal", resource: "resultPublications", actions: ["create", "read", "update", "delete", "approve"] },
  { role: "principal", resource: "resultCorrections", actions: ["read", "approve"] },
  { role: "principal", resource: "marksheets", actions: ["read", "export"] },
  { role: "principal", resource: "certificates", actions: ["create", "read", "update", "delete", "approve"] },
  { role: "principal", resource: "credentials", actions: ["read", "approve"] },
  { role: "principal", resource: "completions", actions: ["read", "approve"] },
  { role: "principal", resource: "portalAnnouncements", actions: ["create", "read", "update", "delete"] },
  { role: "principal", resource: "portalAccessLogs", actions: ["read"] },
  { role: "principal", resource: "kioskSessions", actions: ["read"] },
  { role: "principal", resource: "mobileDevices", actions: ["read"] },
  { role: "principal", resource: "accessibilityProfiles", actions: ["read"] },
  { role: "principal", resource: "portalTickets", actions: ["read", "update"] },
  { role: "principal", resource: "managementPortal", actions: ["read"] },
  { role: "principal", resource: "fiscalYears", actions: ["read"] },
  { role: "principal", resource: "chartOfAccounts", actions: ["read"] },
  { role: "principal", resource: "journalEntries", actions: ["read"] },
  { role: "principal", resource: "feeStructures", actions: ["read"] },
  { role: "principal", resource: "feeAssignments", actions: ["read"] },
  { role: "principal", resource: "invoices", actions: ["read"] },
  { role: "principal", resource: "accountsReceivable", actions: ["read"] },
  { role: "principal", resource: "scholarships", actions: ["read", "approve"] },
  { role: "principal", resource: "payments", actions: ["read"] },
  { role: "principal", resource: "onlinePayments", actions: ["read"] },
  { role: "principal", resource: "refunds", actions: ["read", "approve"] },
  { role: "principal", resource: "dunning", actions: ["read"] },
  { role: "principal", resource: "vendorBills", actions: ["read", "approve"] },
  { role: "principal", resource: "expenseClaims", actions: ["read", "approve"] },
  { role: "principal", resource: "disbursements", actions: ["read", "approve"] },
  { role: "principal", resource: "bankAccounts", actions: ["read"] },
  { role: "principal", resource: "bankReconciliation", actions: ["read"] },
  { role: "principal", resource: "budgets", actions: ["read"] },
  { role: "principal", resource: "commitments", actions: ["read"] },
  { role: "principal", resource: "taxCodes", actions: ["read"] },
  { role: "principal", resource: "accruals", actions: ["read"] },
  { role: "principal", resource: "funds", actions: ["read"] },
  { role: "principal", resource: "periodClose", actions: ["read", "approve"] },
  { role: "principal", resource: "financialStatements", actions: ["read", "export"] },
  { role: "principal", resource: "staffProfiles", actions: ["create", "read", "update"] },
  { role: "principal", resource: "positions", actions: ["create", "read", "update"] },
  { role: "principal", resource: "recruitments", actions: ["create", "read", "update", "approve"] },
  { role: "principal", resource: "leaveRequests", actions: ["read", "approve"] },
  { role: "principal", resource: "performanceReviews", actions: ["create", "read", "update", "approve"] },
  { role: "principal", resource: "compensation", actions: ["read"] },
  { role: "principal", resource: "payrollRules", actions: ["read"] },
  { role: "principal", resource: "payslips", actions: ["read"] },
  { role: "principal", resource: "separations", actions: ["read", "approve"] },
  { role: "principal", resource: "libraryResources", actions: ["read"] },
  { role: "principal", resource: "libraryHoldings", actions: ["read"] },
  { role: "principal", resource: "libraryMembers", actions: ["read"] },
  { role: "principal", resource: "libraryLoans", actions: ["read"] },
  { role: "principal", resource: "libraryReservations", actions: ["read"] },
  { role: "principal", resource: "libraryAcquisitions", actions: ["read", "approve"] },
  { role: "principal", resource: "digitalResources", actions: ["read"] },
  { role: "principal", resource: "vehicles", actions: ["create", "read", "update"] },
  { role: "principal", resource: "transportRoutes", actions: ["create", "read", "update"] },
  { role: "principal", resource: "busStops", actions: ["create", "read", "update"] },
  { role: "principal", resource: "routeSchedules", actions: ["create", "read", "update"] },
  { role: "principal", resource: "riderAssignments", actions: ["create", "read", "update"] },
  { role: "principal", resource: "boardingLogs", actions: ["read"] },
  { role: "principal", resource: "gpsTracks", actions: ["read"] },
  { role: "principal", resource: "vehicleMaintenance", actions: ["read", "approve"] },

  // ── Accountant: finance CRUD, student read, staff read/payroll ──────────────
  { role: "accountant", resource: "institutions", actions: ["read"] },
  { role: "accountant", resource: "calendars", actions: ["read"] },
  { role: "accountant", resource: "students", actions: ["read", "export"] },
  { role: "accountant", resource: "enrolments", actions: ["read"] },
  { role: "accountant", resource: "holds", actions: ["read"] },
  { role: "accountant", resource: "managementPortal", actions: ["read"] },
  { role: "accountant", resource: "fiscalYears", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "chartOfAccounts", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "journalEntries", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "recurringJournals", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "feeStructures", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "feeAssignments", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "invoices", actions: ["create", "read", "update", "delete", "export"] },
  { role: "accountant", resource: "accountsReceivable", actions: ["create", "read", "update", "delete", "export"] },
  { role: "accountant", resource: "scholarships", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "payments", actions: ["create", "read", "update", "delete", "export"] },
  { role: "accountant", resource: "onlinePayments", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "refunds", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "dunning", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "vendorBills", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "expenseClaims", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "disbursements", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "bankAccounts", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "bankReconciliation", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "budgets", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "commitments", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "taxCodes", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "accruals", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "funds", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "periodClose", actions: ["create", "read", "update", "delete"] },
  { role: "accountant", resource: "financialStatements", actions: ["create", "read", "export"] },
  { role: "accountant", resource: "staffProfiles", actions: ["read"] },
  { role: "accountant", resource: "compensation", actions: ["create", "read", "update"] },
  { role: "accountant", resource: "payrollRules", actions: ["create", "read", "update"] },
  { role: "accountant", resource: "payslips", actions: ["create", "read", "update", "export"] },
  { role: "accountant", resource: "leaveRequests", actions: ["read"] },

  // ── Teacher: academic CRUD, limited student management ──────────────────────
  { role: "teacher", resource: "calendars", actions: ["read"] },
  { role: "teacher", resource: "academicYears", actions: ["read"] },
  { role: "teacher", resource: "subjects", actions: ["read"] },
  { role: "teacher", resource: "sections", actions: ["read"] },
  { role: "teacher", resource: "gradingScales", actions: ["read"] },
  { role: "teacher", resource: "students", actions: ["read"] },
  { role: "teacher", resource: "enrolments", actions: ["read"] },
  { role: "teacher", resource: "curriculumMaps", actions: ["read", "update"] },
  { role: "teacher", resource: "syllabusPlans", actions: ["create", "read", "update", "delete"] },
  { role: "teacher", resource: "lessonPlans", actions: ["create", "read", "update", "delete"] },
  { role: "teacher", resource: "teachingWorkload", actions: ["read"] },
  { role: "teacher", resource: "qualityReviews", actions: ["read"] },
  { role: "teacher", resource: "facultyReviews", actions: ["read"] },
  { role: "teacher", resource: "timetables", actions: ["read"] },
  { role: "teacher", resource: "substitutions", actions: ["read"] },
  { role: "teacher", resource: "attendance", actions: ["create", "read", "update"] },
  { role: "teacher", resource: "attendanceCorrections", actions: ["create", "read"] },
  { role: "teacher", resource: "shifts", actions: ["read"] },
  { role: "teacher", resource: "assessments", actions: ["create", "read", "update", "delete"] },
  { role: "teacher", resource: "questionBank", actions: ["create", "read", "update", "delete"] },
  { role: "teacher", resource: "exams", actions: ["read"] },
  { role: "teacher", resource: "examRooms", actions: ["read"] },
  { role: "teacher", resource: "marks", actions: ["create", "read", "update"] },
  { role: "teacher", resource: "moderation", actions: ["read"] },
  { role: "teacher", resource: "practicals", actions: ["create", "read", "update"] },
  { role: "teacher", resource: "integrityCases", actions: ["create", "read"] },
  { role: "teacher", resource: "rechecks", actions: ["create", "read"] },
  { role: "teacher", resource: "results", actions: ["read"] },
  { role: "teacher", resource: "resultPublications", actions: ["read"] },
  { role: "teacher", resource: "resultCorrections", actions: ["create", "read"] },
  { role: "teacher", resource: "marksheets", actions: ["read", "export"] },
  { role: "teacher", resource: "certificates", actions: ["read"] },
  { role: "teacher", resource: "credentials", actions: ["read"] },
  { role: "teacher", resource: "portalAnnouncements", actions: ["read"] },
  { role: "teacher", resource: "portalAccessLogs", actions: ["read"] },
  { role: "teacher", resource: "mobileDevices", actions: ["read"] },
  { role: "teacher", resource: "accessibilityProfiles", actions: ["read"] },
  { role: "teacher", resource: "teacherPortal", actions: ["read"] },
  { role: "teacher", resource: "staffProfiles", actions: ["read"] },
  { role: "teacher", resource: "leaveRequests", actions: ["create", "read"] },
  { role: "teacher", resource: "performanceReviews", actions: ["read"] },
  { role: "teacher", resource: "payrollRules", actions: ["read"] },
  { role: "teacher", resource: "payslips", actions: ["read"] },
  { role: "teacher", resource: "libraryResources", actions: ["read"] },
  { role: "teacher", resource: "libraryHoldings", actions: ["read"] },
  { role: "teacher", resource: "libraryMembers", actions: ["read"] },
  { role: "teacher", resource: "libraryLoans", actions: ["read"] },
  { role: "teacher", resource: "libraryReservations", actions: ["read"] },
  { role: "teacher", resource: "libraryAcquisitions", actions: ["read"] },
  { role: "teacher", resource: "digitalResources", actions: ["read"] },
  { role: "teacher", resource: "vehicles", actions: ["read"] },
  { role: "teacher", resource: "transportRoutes", actions: ["read"] },
  { role: "teacher", resource: "riderAssignments", actions: ["read"] },
  { role: "teacher", resource: "boardingLogs", actions: ["read"] },
  { role: "teacher", resource: "vehicleMaintenance", actions: ["read"] },

  // ── Student: read-only own data + library borrowing ─────────────────────────
  { role: "student", resource: "calendars", actions: ["read"] },
  { role: "student", resource: "subjects", actions: ["read"] },
  { role: "student", resource: "students", actions: ["read"] },
  { role: "student", resource: "enrolments", actions: ["read"] },
  { role: "student", resource: "attendance", actions: ["read"] },
  { role: "student", resource: "assessments", actions: ["read"] },
  { role: "student", resource: "exams", actions: ["read"] },
  { role: "student", resource: "marks", actions: ["read"] },
  { role: "student", resource: "results", actions: ["read"] },
  { role: "student", resource: "marksheets", actions: ["read"] },
  { role: "student", resource: "certificates", actions: ["read"] },
  { role: "student", resource: "studentPortal", actions: ["read"] },
  { role: "student", resource: "libraryResources", actions: ["read"] },
  { role: "student", resource: "libraryHoldings", actions: ["read"] },
  { role: "student", resource: "libraryMembers", actions: ["read"] },
  { role: "student", resource: "libraryLoans", actions: ["create", "read"] },
  { role: "student", resource: "libraryReservations", actions: ["create", "read"] },
  { role: "student", resource: "digitalResources", actions: ["read"] },

  // ── Parent: read-only child data ────────────────────────────────────────────
  { role: "parent", resource: "calendars", actions: ["read"] },
  { role: "parent", resource: "students", actions: ["read"] },
  { role: "parent", resource: "parentPortal", actions: ["read"] },
  { role: "parent", resource: "attendance", actions: ["read"] },
  { role: "parent", resource: "marks", actions: ["read"] },
  { role: "parent", resource: "results", actions: ["read"] },
  { role: "parent", resource: "marksheets", actions: ["read"] },
  { role: "parent", resource: "libraryResources", actions: ["read"] },
];

// ── Permission Check Functions ───────────────────────────────────────────────

/**
 * Check if a role has a specific action on a resource.
 * This is the core RBAC check.
 */
export function hasPermission(
  role: UserRole,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  const rule = ROLE_PERMISSIONS.find((r) => r.role === role && r.resource === resource);
  return rule?.actions.includes(action) ?? false;
}

/**
 * ABAC check: extends RBAC with attribute-based conditions.
 * In a real system, this would query OPA/Casbin with context attributes.
 */
export function hasAbacPermission(
  role: UserRole,
  resource: PermissionResource,
  action: PermissionAction,
  ctx?: AbacContext
): boolean {
  // Base RBAC check
  if (!hasPermission(role, resource, action)) return false;
  if (!ctx) return true;

  // ABAC rules: attribute-based overrides
  switch (role) {
    case "teacher":
      // Teachers can only update marks/attendance for their own sections
      if (action === "update" && (resource === "marks" || resource === "attendance")) {
        if (ctx.recordDepartment && ctx.userDepartment && ctx.recordDepartment !== ctx.userDepartment) {
          return false;
        }
      }
      // Teachers cannot delete other teachers' records
      if (action === "delete" && resource === "staffProfiles") {
        return false;
      }
      break;

    case "student":
      // Students can only read their own data
      if (resource === "students" || resource === "marks" || resource === "results") {
        if (ctx.recordOwnerId && ctx.userId && ctx.recordOwnerId !== ctx.userId) {
          return false;
        }
      }
      // Students can only create their own library loans/reservations
      if (action === "create" && (resource === "libraryLoans" || resource === "libraryReservations")) {
        if (ctx.recordOwnerId && ctx.userId && ctx.recordOwnerId !== ctx.userId) {
          return false;
        }
      }
      break;

    case "parent":
      // Parents can only read their ward's data
      if (resource === "students" || resource === "marks" || resource === "results") {
        if (ctx.recordOwnerId && ctx.userId && ctx.recordOwnerId !== ctx.userId) {
          return false;
        }
      }
      break;

    case "accountant":
      // Accountants cannot delete users/roles
      if (action === "delete" && (resource === "userIdentities" || resource === "roles")) {
        return false;
      }
      break;
  }

  return true;
}

/**
 * Check route access (existing behavior).
 */
export function canAccess(role: UserRole, path: string): boolean {
  if (path === "/" || path === "") return true;
  return ROLE_ROUTES[role]?.some((r) => path.startsWith(r)) ?? false;
}

/**
 * Get all allowed routes for a role.
 */
export function getAllowedRoutes(role: UserRole): string[] {
  return ["/", ...ROLE_ROUTES[role]];
}

/**
 * Get all permissions for a role (for debugging/display).
 */
export function getRolePermissions(role: UserRole): PermissionRule[] {
  return ROLE_PERMISSIONS.filter((r) => r.role === role);
}

/**
 * Check if a role can perform ANY action on a resource.
 */
export function hasAnyPermission(
  role: UserRole,
  resource: PermissionResource
): boolean {
  return ROLE_PERMISSIONS.some((r) => r.role === role && r.resource === resource);
}

/**
 * Get all resources a role has access to.
 */
export function getAccessibleResources(role: UserRole): PermissionResource[] {
  const resources = new Set<PermissionResource>();
  ROLE_PERMISSIONS.filter((r) => r.role === role).forEach((r) => resources.add(r.resource));
  return Array.from(resources);
}

// ── Session Management ───────────────────────────────────────────────────────

/** Read the current session from localStorage. */
export function getSession(): { name: string; role: UserRole; initials: string } | null {
  try {
    const raw = localStorage.getItem("m01-session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Clear session and redirect to login. */
export function logout() {
  localStorage.removeItem("m01-session");
  window.location.href = "/login";
}

// ── Route Access Matrix ──────────────────────────────────────────────────────

const ALL_ADMIN_ROUTES = [
  "/tenants", "/institution", "/organization", "/locations", "/calendar", "/features",
  "/identity", "/auth", "/rbac", "/delegation", "/duties", "/privileges",
  "/academic-year", "/levels", "/subjects", "/sections", "/grading", "/policies",
  "/campaigns", "/applications", "/selections", "/conversions",
  "/students", "/enrolments", "/holds",
  "/curriculum", "/syllabus", "/lesson-planning", "/workload", "/quality-review", "/faculty-review",
  "/timetable", "/substitutions", "/attendance", "/attendance-corrections", "/shifts", "/attendance-alerts",
  "/assessments", "/question-bank", "/exams", "/exam-rooms", "/marks", "/moderation", "/practicals", "/integrity", "/rechecks",
  "/results", "/result-publications", "/result-corrections", "/marksheets", "/certificates", "/credentials", "/completions",
  "/portal-announcements", "/portal-access", "/kiosk-sessions", "/mobile-devices", "/accessibility",
  "/student-portal", "/parent-portal", "/teacher-portal", "/management-portal",
  "/finance-setup", "/chart-of-accounts", "/journals", "/recurring-journals", "/fee-catalog", "/fee-assignments", "/invoices", "/accounts-receivable", "/scholarships", "/collections", "/online-payments", "/refunds-writeoffs", "/dunning", "/vendor-bills", "/expense-claims", "/disbursements", "/bank-budget", "/bank-reconciliation", "/budgeting-commitments", "/tax-withholding", "/accruals-deferrals", "/fund-accounting", "/period-close", "/financial-statements",
  "/staff", "/position-control", "/recruitment", "/leave-requests", "/performance", "/compensation-benefits", "/payroll-rules", "/payslip-management", "/payroll", "/separations",
  "/library-catalog", "/library-holdings", "/library-circulation", "/library-acquisitions", "/library-digital",
  "/fleet", "/transport-routes", "/transport-riders", "/boarding-safety", "/transport-operations", "/fuel-maintenance",
];

const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: ALL_ADMIN_ROUTES,

  principal: [
    "/institution", "/organization", "/calendar", "/features",
    "/identity", "/rbac",
    "/academic-year", "/levels", "/subjects", "/sections", "/grading", "/policies",
    "/campaigns", "/applications", "/selections", "/conversions",
    "/students", "/enrolments", "/holds",
    "/curriculum", "/syllabus", "/lesson-planning", "/workload", "/quality-review", "/faculty-review",
    "/timetable", "/substitutions", "/attendance", "/attendance-corrections", "/shifts", "/attendance-alerts",
    "/assessments", "/question-bank", "/exams", "/exam-rooms", "/marks", "/moderation", "/practicals", "/integrity", "/rechecks",
    "/results", "/result-publications", "/result-corrections", "/marksheets", "/certificates", "/credentials", "/completions",
    "/portal-announcements", "/portal-access", "/kiosk-sessions", "/mobile-devices", "/accessibility",
    "/student-portal", "/parent-portal", "/teacher-portal", "/management-portal",
    "/finance-setup", "/chart-of-accounts", "/journals", "/recurring-journals", "/fee-catalog", "/fee-assignments", "/invoices", "/accounts-receivable", "/scholarships", "/collections", "/online-payments", "/refunds-writeoffs", "/dunning", "/vendor-bills", "/expense-claims", "/disbursements", "/bank-budget", "/bank-reconciliation", "/budgeting-commitments", "/tax-withholding", "/accruals-deferrals", "/fund-accounting", "/period-close", "/financial-statements",
    "/staff", "/recruitment", "/leave-requests", "/performance", "/payroll", "/separations",
    "/library-catalog", "/library-holdings", "/library-circulation", "/library-acquisitions", "/library-digital",
    "/fleet", "/transport-routes", "/transport-riders", "/boarding-safety", "/transport-operations", "/fuel-maintenance",
  ],

  accountant: [
    "/institution", "/calendar",
    "/students", "/enrolments", "/holds",
    "/portal-announcements", "/portal-access",
    "/management-portal",
    "/finance-setup", "/chart-of-accounts", "/journals", "/recurring-journals", "/fee-catalog", "/fee-assignments", "/invoices", "/accounts-receivable", "/scholarships", "/collections", "/online-payments", "/refunds-writeoffs", "/dunning", "/vendor-bills", "/expense-claims", "/disbursements", "/bank-budget", "/bank-reconciliation", "/budgeting-commitments", "/tax-withholding", "/accruals-deferrals", "/fund-accounting", "/period-close", "/financial-statements",
    "/staff", "/compensation-benefits", "/payroll-rules", "/payslip-management", "/payroll",
  ],

  teacher: [
    "/calendar",
    "/academic-year", "/subjects", "/sections", "/grading",
    "/students", "/enrolments",
    "/curriculum", "/syllabus", "/lesson-planning", "/workload", "/quality-review", "/faculty-review",
    "/timetable", "/substitutions", "/attendance", "/attendance-corrections", "/shifts", "/attendance-alerts",
    "/assessments", "/question-bank", "/exams", "/exam-rooms", "/marks", "/moderation", "/practicals", "/integrity", "/rechecks",
    "/results", "/result-publications", "/result-corrections", "/marksheets", "/certificates", "/credentials", "/completions",
    "/portal-announcements", "/portal-access", "/mobile-devices", "/accessibility",
    "/teacher-portal",
    "/library-catalog", "/library-holdings", "/library-circulation", "/library-acquisitions", "/library-digital",
    "/staff", "/leave-requests", "/performance", "/payroll", "/separations",
    "/fleet", "/transport-routes", "/transport-riders", "/boarding-safety", "/transport-operations",
  ],

  student: [
    "/calendar",
    "/subjects",
    "/students",
    "/student-portal",
    "/library-catalog", "/library-circulation", "/library-digital",
  ],

  parent: [
    "/calendar",
    "/students",
    "/parent-portal",
    "/library-catalog",
  ],
};

// ── Role Profiles (used by Login page) ───────────────────────────────────────

export interface RoleProfile {
  id: UserRole;
  label: string;
  email: string;
  initials: string;
  description: string;
}

export const ROLE_PROFILES: RoleProfile[] = [
  {
    id: "admin",
    label: "System Administrator",
    email: "admin@shikshya.edu.np",
    initials: "AD",
    description: "Full system access across all modules. Manages tenants, users, roles, integrations, and system health.",
  },
  {
    id: "principal",
    label: "Principal / Head of School",
    email: "principal@shikshya.edu.np",
    initials: "PR",
    description: "Academic and operational oversight. Manages curriculum, staff, admissions, and reviews school-wide data.",
  },
  {
    id: "accountant",
    label: "Accountant / Finance Manager",
    email: "accountant@shikshya.edu.np",
    initials: "AC",
    description: "Manages invoicing, payments, bank reconciliation, budgets, and financial reporting.",
  },
  {
    id: "teacher",
    label: "Teacher / Instructor",
    email: "teacher@shikshya.edu.np",
    initials: "TE",
    description: "Manages lesson plans, attendance, assessments, and marks for assigned sections and subjects.",
  },
  {
    id: "student",
    label: "Student",
    email: "student@shikshya.edu.np",
    initials: "ST",
    description: "Views own profile, attendance, marks, library, and transport. Limited read-only access.",
  },
  {
    id: "parent",
    label: "Parent / Guardian",
    email: "parent@shikshya.edu.np",
    initials: "PA",
    description: "Views child's academic records, attendance, fee invoices, and transport information.",
  },
];
