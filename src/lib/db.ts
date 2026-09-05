// Minimal promise-based IndexedDB wrapper acting as the fake backend.
import type { DBSchema, StoreName } from "./types";
import { seedData } from "./seed";

const DB_NAME = "shikshya-erp-m01";
const DB_VERSION = 19;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      const stores: StoreName[] = [
        "tenants",
        "institution",
        "legalEntities",
        "campuses",
        "orgUnits",
        "locations",
        "holidays",
        "calendarYears",
        "locale",
        "sequences",
        "featureFlags",
        "configVersions",
        "audit",
        // M02 stores
        "userIdentities",
        "authSessions",
        "authFactors",
        "roles",
        "userRoles",
        "dataScopes",
        "delegations",
        "impersonationLogs",
        "dutyRules",
        "dutyViolations",
        "privilegedAccess",
        "accessReviews",
        // M03 stores
        "academicYears",
        "terms",
        "schoolLevels",
        "gradeClasses",
        "streams",
        "subjects",
        "curriculumOfferings",
        "sections",
        "houses",
        "cohorts",
        "gradingScales",
        "promotionRules",
        "completionRules",
        "academicPolicies",
        // M04 stores
        "campaigns",
        "enquiries",
        "enquiryInteractions",
        "applications",
        "applicationChoices",
        "applicationDocuments",
        "eligibilityDecisions",
        "selectionEvents",
        "selectionScores",
        "offers",
        "offerAcceptances",
        "conversionCases",
        "conversionSteps",
        // M05 stores
        "persons",
        "students",
        "guardians",
        "studentGuardians",
        "studentDocuments",
        "enrolments",
        "subjectSelections",
        "studentMovements",
        "progressionAudits",
        "studentHolds",
        "clearanceCases",
        "clearanceResponses",
        "identityCards",
        // M06 stores
        "curriculumMaps",
        "learningOutcomes",
        "syllabusPlans",
        "contentPlanItems",
        "teachingAssignments",
        "lessonPlans",
        "coverageEntries",
        "workloadAllocations",
        "qualityReviews",
        "qualityEvidences",
        "moderationReviews",
        "reviewActions",
        // M07 stores
        "timetables",
        "timetableSlots",
        "timetableAssignments",
        "substitutions",
        "attendanceSessions",
        "studentAttendances",
        "attendanceCorrections",
        "attendanceAlerts",
        "shifts",
        "staffRosters",
        "timeEntries",
        "timeAdjustments",
        // M08 stores
        "assessments",
        "assessmentComponents",
        "questions",
        "examPapers",
        "exams",
        "examRegistrations",
        "examRooms",
        "seatAllocations",
        "invigilationDuties",
        "markEntries",
        "moderationRecords",
        "practicalExams",
        "integrityCases",
        "recheckRequests",
        // M09 stores
        "resultRuns",
        "resultLines",
        "resultPublications",
        "resultCorrections",
        "marksheets",
        "transcripts",
        "certificates",
        "certificateRequests",
        "digitalCredentials",
        "completionRecords",
        // M11 stores
        "portalAnnouncements",
        "portalAccessLogs",
        "kioskSessions",
        "mobileDevices",
        "offlineSyncLogs",
        "accessibilityProfiles",
        "portalTickets",
        "studentPortalProfiles",
        "parentPortalProfiles",
        "teacherPortalProfiles",
        "managementDashboards",
        // M12 stores
        "fiscalYears",
        "chartOfAccounts",
        "journalEntries",
        "feeStructures",
        "feeAssignments",
        "invoices",
        "payments",
        "creditNotes",
        "vendorBills",
        "expenseClaims",
        "recurringJournals",
        "disbursementEntries",
        "bankReconciliations",
        "bankReconciliationEntries",
        "bankAccounts",
        "budgets",
        "accountsReceivable",
        "scholarshipSchemes",
        "onlinePaymentTransactions",
        "refundRecords",
        "writeOffEntries",
        "dunningNotices",
        "commitmentRecords",
        "taxCodes",
        "accrualEntries",
        "funds",
        "periodCloseChecklists",
        "financialStatements",
        // M13 stores
        "staffProfiles",
        "positions",
        "recruitments",
        "leaveRequests",
        "performanceReviews",
        "compensations",
        "payrollRuns",
        "payslips",
        "separations",
        "staffContracts",
        // M16 stores
        "libraryResources",
        "libraryHoldings",
        "libraryMembers",
        "libraryLoans",
        "libraryReservations",
        "libraryAcquisitions",
        "digitalResources",
        // M17 stores
        "vehicles",
        "transportRoutes",
        "busStops",
        "routeSchedules",
        "riderAssignments",
        "boardingLogs",
        "gpsTracks",
        "vehicleMaintenance",
        // M19 stores
        "healthProfiles",
        "clinicVisits",
        "medicationAdministrations",
        "immunizationRecords",
        "counselingCases",
        "caseNotes",
        "safeguardingActions",
        "supportNeeds",
        "accommodationPlans",
        "conductIncidents",
        "conductActions",
        "grievances",
        "grievanceOutcomes",
        "advisingAssignments",
        "interventionPlans",
        "interventionActions",
        // M20 stores
        "communityEvents",
        "eventRegistrations",
        "activityGroups",
        "groupMemberships",
        "competitions",
        "competitionEntries",
        "competitionResults",
        "trips",
        "tripParticipants",
        "ptmEvents",
        "ptmBookings",
        "fundraisingCampaigns",
        "donations",
        // M21 stores
        "subjectCombinationRules",
        "studentSubjectPlans",
        "boardRegistrations",
        "readinessChecks",
        "internalAssessmentSnapshots",
        "guidanceProfiles",
        "guidanceSessions",
        "externalApplications",
        "schoolExitCases",
        "migrationDocuments",
        "formerStudents",
        "alumniPreferences",
        // M22 stores
        "serviceRequests",
        "workOrders",
        "workOrderActivities",
        "maintenancePlans",
        "bookings",
        "bookingAttendees",
        "safetyIncidents",
        "emergencyActions",
        "visitorVisits",
        "accessCredentials",
        "keyIssues",
        "utilityMeters",
        "meterReadings",
        "continuityPlans",
        "continuityExercises",
        // M23 stores
        "announcements",
        "messages",
        "deliveryAttempts",
        "notificationPreferences",
        "conversations",
        "conversationParticipants",
        "conversationMessages",
        "workflowDefinitions",
        "workflowInstances",
        "workflowTasks",
        "workflowTransitions",
        "serviceCases",
        "caseActivities",
        "slaClocks",
        "documentTemplates",
        "documentInstances",
        "signatureRequests",
        "recordDeclarations",
        "retentionAssignments",
        // M24 stores
        "reportDefinitions",
        "dashboards",
        "dashboardWidgets",
        "reportRuns",
        "metricDefinitions",
        "semanticDimensions",
        "reportAccessPolicies",
        "reportCatalogEntries",
        "dataProducts",
        "pipelineRuns",
        "dataQualityResults",
        "modelVersions",
        "modelScores",
        // M04.02 stores
        "counselingSessions", "followUps",
        // M10 stores
        "courseSpaces", "courseRosters", "courseContents", "learningResources",
        "assignments", "submissions", "quizzes", "quizAttempts",
        "discussions", "discussionPosts", "learningMetrics", "interventionAlerts",
        "ltiTools", "contentImports",
        // M14 stores
        "vendors", "vendorDocuments", "purchaseRequisitions", "requisitionItems",
        "rfqs", "bidComparisons", "purchaseOrders", "poItems",
        "goodsReceipts", "qualityInspections", "contracts", "contractRenewals",
        "supplierScores", "slaTrackings",
        // M15 stores
        "items", "stores", "warehouses", "stockEntries", "stockLedgers",
        "physicalCounts", "varianceReports", "fixedAssets", "assetCategories",
        "assetTransfers", "custodyRecords", "depreciationSchedules", "impairments",
        "assetMaintenances", "disposals",
        // M18 stores
        "residenceBlocks", "roomTypes", "hostelApplications", "roomAllocations",
        "rollCalls", "residenceIncidents", "mealPlans", "messManagement",
        "posModules", "prepaidWallets",
        // M24 analytics stores
        "studentAnalytics", "cohortAnalysis", "financeAnalytics", "workforceAnalytics",
        "reportBuilders", "reportSchedules",
      ];
      stores.forEach((s) => {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

const ALL_STORES: StoreName[] = [
  "tenants", "institution", "legalEntities", "campuses", "orgUnits", "locations",
  "holidays", "calendarYears", "locale", "sequences", "featureFlags", "configVersions", "audit",
  "userIdentities", "authSessions", "authFactors", "roles", "userRoles", "dataScopes",
  "delegations", "impersonationLogs", "dutyRules", "dutyViolations", "privilegedAccess", "accessReviews",
  // M03 stores
  "academicYears", "terms", "schoolLevels", "gradeClasses", "streams",
  "subjects", "curriculumOfferings", "sections", "houses", "cohorts",
  "gradingScales", "promotionRules", "completionRules", "academicPolicies",
  // M04 stores
  "campaigns", "enquiries", "enquiryInteractions", "applications", "applicationChoices",
  "applicationDocuments", "eligibilityDecisions", "selectionEvents", "selectionScores",
  "offers", "offerAcceptances", "conversionCases", "conversionSteps",
  // M05 stores
  "persons", "students", "guardians", "studentGuardians", "studentDocuments",
  "enrolments", "subjectSelections", "studentMovements", "progressionAudits",
  "studentHolds", "clearanceCases", "clearanceResponses", "identityCards",
  // M06 stores
  "curriculumMaps", "learningOutcomes", "syllabusPlans", "contentPlanItems",
  "teachingAssignments", "lessonPlans", "coverageEntries", "workloadAllocations",
  "qualityReviews", "qualityEvidences", "moderationReviews", "reviewActions",
  // M07 stores
  "timetables", "timetableSlots", "timetableAssignments", "substitutions",
  "attendanceSessions", "studentAttendances", "attendanceCorrections", "attendanceAlerts",
  "shifts", "staffRosters", "timeEntries", "timeAdjustments",
  // M08 stores
  "assessments", "assessmentComponents", "questions", "examPapers", "exams", "examRegistrations",
  "examRooms", "seatAllocations", "invigilationDuties", "markEntries", "moderationRecords",
  "practicalExams", "integrityCases", "recheckRequests",
  // M09 stores
  "resultRuns", "resultLines", "resultPublications", "resultCorrections", "marksheets",
  "transcripts", "certificates", "certificateRequests", "digitalCredentials", "completionRecords",
  // M11 stores
  "portalAnnouncements", "portalAccessLogs", "kioskSessions", "mobileDevices", "offlineSyncLogs",
  "accessibilityProfiles", "portalTickets",
  "studentPortalProfiles", "parentPortalProfiles", "teacherPortalProfiles", "managementDashboards",
  // M12 stores
  "fiscalYears", "chartOfAccounts", "journalEntries", "feeStructures", "feeAssignments",
  "invoices", "payments", "creditNotes", "vendorBills", "expenseClaims", "recurringJournals", "disbursementEntries", "bankReconciliations", "bankReconciliationEntries", "bankAccounts", "budgets",
  "accountsReceivable", "scholarshipSchemes", "onlinePaymentTransactions", "refundRecords", "writeOffEntries", "dunningNotices",
  "commitmentRecords", "taxCodes", "accrualEntries", "funds", "periodCloseChecklists", "financialStatements",
  // M13 stores
  "staffProfiles", "positions", "recruitments", "leaveRequests", "performanceReviews",
  "compensations", "payrollRuns", "payslips", "separations", "staffContracts",
  // M16 stores
  "libraryResources", "libraryHoldings", "libraryMembers", "libraryLoans", "libraryReservations",
  "libraryAcquisitions", "digitalResources",
  // M17 stores
  "vehicles", "transportRoutes", "busStops", "routeSchedules", "riderAssignments",
  "boardingLogs", "gpsTracks", "vehicleMaintenance",
  // M19 stores
  "healthProfiles", "clinicVisits", "medicationAdministrations", "immunizationRecords",
  "counselingCases", "caseNotes", "safeguardingActions", "supportNeeds", "accommodationPlans",
  "conductIncidents", "conductActions", "grievances", "grievanceOutcomes", "advisingAssignments",
  "interventionPlans", "interventionActions",
  // M20 stores
  "communityEvents", "eventRegistrations", "activityGroups", "groupMemberships",
  "competitions", "competitionEntries", "competitionResults", "trips", "tripParticipants",
  "ptmEvents", "ptmBookings", "fundraisingCampaigns", "donations",
  // M21 stores
  "subjectCombinationRules", "studentSubjectPlans", "boardRegistrations", "readinessChecks",
  "internalAssessmentSnapshots", "guidanceProfiles", "guidanceSessions", "externalApplications",
  "schoolExitCases", "migrationDocuments", "formerStudents", "alumniPreferences",
  // M22 stores
  "serviceRequests", "workOrders", "workOrderActivities", "maintenancePlans",
  "bookings", "bookingAttendees", "safetyIncidents", "emergencyActions",
  "visitorVisits", "accessCredentials", "keyIssues", "utilityMeters",
  "meterReadings", "continuityPlans", "continuityExercises",
  // M24 stores
  "reportDefinitions", "dashboards", "dashboardWidgets", "reportRuns",
  "metricDefinitions", "semanticDimensions", "reportAccessPolicies", "reportCatalogEntries",
  "dataProducts", "pipelineRuns", "dataQualityResults", "modelVersions", "modelScores",
  // M04.02 stores
  "counselingSessions", "followUps",
  // M10 stores
  "courseSpaces", "courseRosters", "courseContents", "learningResources",
  "assignments", "submissions", "quizzes", "quizAttempts",
  "discussions", "discussionPosts", "learningMetrics", "interventionAlerts",
  "ltiTools", "contentImports",
  // M14 stores
  "vendors", "vendorDocuments", "purchaseRequisitions", "requisitionItems",
  "rfqs", "bidComparisons", "purchaseOrders", "poItems",
  "goodsReceipts", "qualityInspections", "contracts", "contractRenewals",
  "supplierScores", "slaTrackings",
  // M15 stores
  "items", "stores", "warehouses", "stockEntries", "stockLedgers",
  "physicalCounts", "varianceReports", "fixedAssets", "assetCategories",
  "assetTransfers", "custodyRecords", "depreciationSchedules", "impairments",
  "assetMaintenances", "disposals",
  // M18 stores
  "residenceBlocks", "roomTypes", "hostelApplications", "roomAllocations",
  "rollCalls", "residenceIncidents", "mealPlans", "messManagement",
  "posModules", "prepaidWallets",
  // M24 analytics stores
  "studentAnalytics", "cohortAnalysis", "financeAnalytics", "workforceAnalytics",
  "reportBuilders", "reportSchedules",
];

async function ensureSeeded(): Promise<void> {
  const db = await openDB();
  const existing = await new Promise<number>((resolve) => {
    const t = db.transaction("tenants", "readonly");
    const req = t.objectStore("tenants").count();
    req.onsuccess = () => resolve(req.result);
  });
  if (existing === 0) {
    const seed = seedData();
    await new Promise<void>((resolve, reject) => {
      const t = db.transaction(ALL_STORES, "readwrite");
      (Object.keys(seed) as StoreName[]).forEach((k) => {
        const store = t.objectStore(k);
        (seed[k] as { id: string }[]).forEach((item) => store.put(item));
      });
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
    });
    return;
  }
  const seed = seedData();
  const incrementalStores: StoreName[] = [
    "persons", "students", "guardians", "studentGuardians", "studentDocuments",
    "enrolments", "subjectSelections", "studentMovements", "progressionAudits",
    "studentHolds", "clearanceCases", "clearanceResponses", "identityCards",
    "curriculumMaps", "learningOutcomes", "syllabusPlans", "contentPlanItems",
    "teachingAssignments", "lessonPlans", "coverageEntries", "workloadAllocations",
    "qualityReviews", "qualityEvidences", "moderationReviews", "reviewActions",
    "timetables", "timetableSlots", "timetableAssignments", "substitutions",
    "attendanceSessions", "studentAttendances", "attendanceCorrections", "attendanceAlerts",
    "shifts", "staffRosters", "timeEntries", "timeAdjustments",
    "assessments", "assessmentComponents", "questions", "examPapers", "exams", "examRegistrations",
    "examRooms", "seatAllocations", "invigilationDuties", "markEntries", "moderationRecords",
    "practicalExams", "integrityCases", "recheckRequests",
    "resultRuns", "resultLines", "resultPublications", "resultCorrections", "marksheets",
    "transcripts", "certificates", "certificateRequests", "digitalCredentials", "completionRecords",
    "portalAnnouncements", "portalAccessLogs", "kioskSessions", "mobileDevices", "offlineSyncLogs",
    "accessibilityProfiles", "portalTickets",
    "studentPortalProfiles", "parentPortalProfiles", "teacherPortalProfiles", "managementDashboards",
    "fiscalYears", "chartOfAccounts", "journalEntries", "feeStructures", "feeAssignments",
    "invoices", "payments", "creditNotes", "vendorBills", "expenseClaims", "recurringJournals", "disbursementEntries", "bankReconciliations", "bankReconciliationEntries", "bankAccounts", "budgets",
    "accountsReceivable", "scholarshipSchemes", "onlinePaymentTransactions", "refundRecords", "writeOffEntries", "dunningNotices",
    "commitmentRecords", "taxCodes", "accrualEntries", "funds", "periodCloseChecklists", "financialStatements",
    "staffProfiles", "positions", "recruitments", "leaveRequests", "performanceReviews",
    "compensations", "payrollRuns", "payslips", "separations", "staffContracts",
    "libraryResources", "libraryHoldings", "libraryMembers", "libraryLoans", "libraryReservations",
    "libraryAcquisitions", "digitalResources",
    "vehicles", "transportRoutes", "busStops", "routeSchedules", "riderAssignments",
    "boardingLogs", "gpsTracks", "vehicleMaintenance",
    "healthProfiles", "clinicVisits", "medicationAdministrations", "immunizationRecords",
    "counselingCases", "caseNotes", "safeguardingActions", "supportNeeds", "accommodationPlans",
    "conductIncidents", "conductActions", "grievances", "grievanceOutcomes", "advisingAssignments",
    "interventionPlans", "interventionActions",
    "communityEvents", "eventRegistrations", "activityGroups", "groupMemberships",
    "competitions", "competitionEntries", "competitionResults", "trips", "tripParticipants",
    "ptmEvents", "ptmBookings", "fundraisingCampaigns", "donations",
    "subjectCombinationRules", "studentSubjectPlans", "boardRegistrations", "readinessChecks",
    "internalAssessmentSnapshots", "guidanceProfiles", "guidanceSessions", "externalApplications",
    "schoolExitCases", "migrationDocuments", "formerStudents", "alumniPreferences",
    // M22 stores
    "serviceRequests", "workOrders", "workOrderActivities", "maintenancePlans",
    "bookings", "bookingAttendees", "safetyIncidents", "emergencyActions",
    "visitorVisits", "accessCredentials", "keyIssues", "utilityMeters",
    "meterReadings",     "continuityPlans", "continuityExercises",
    // M23 stores
    "announcements", "messages", "deliveryAttempts", "notificationPreferences",
    "conversations", "conversationParticipants", "conversationMessages",
    "workflowDefinitions", "workflowInstances", "workflowTasks", "workflowTransitions",
    "serviceCases", "caseActivities", "slaClocks",
    "documentTemplates", "documentInstances", "signatureRequests",
    "recordDeclarations", "retentionAssignments",
    // M24 stores
    "reportDefinitions", "dashboards", "dashboardWidgets", "reportRuns",
    "metricDefinitions", "semanticDimensions", "reportAccessPolicies", "reportCatalogEntries",
    "dataProducts", "pipelineRuns", "dataQualityResults", "modelVersions", "modelScores",
    // M04.02 stores
    "counselingSessions", "followUps",
    // M10 stores
    "courseSpaces", "courseRosters", "courseContents", "learningResources",
    "assignments", "submissions", "quizzes", "quizAttempts",
    "discussions", "discussionPosts", "learningMetrics", "interventionAlerts",
    "ltiTools", "contentImports",
    // M14 stores
    "vendors", "vendorDocuments", "purchaseRequisitions", "requisitionItems",
    "rfqs", "bidComparisons", "purchaseOrders", "poItems",
    "goodsReceipts", "qualityInspections", "contracts", "contractRenewals",
    "supplierScores", "slaTrackings",
    // M15 stores
    "items", "stores", "warehouses", "stockEntries", "stockLedgers",
    "physicalCounts", "varianceReports", "fixedAssets", "assetCategories",
    "assetTransfers", "custodyRecords", "depreciationSchedules", "impairments",
    "assetMaintenances", "disposals",
    // M18 stores
    "residenceBlocks", "roomTypes", "hostelApplications", "roomAllocations",
    "rollCalls", "residenceIncidents", "mealPlans", "messManagement",
    "posModules", "prepaidWallets",
    // M24 analytics stores
    "studentAnalytics", "cohortAnalysis", "financeAnalytics", "workforceAnalytics",
    "reportBuilders", "reportSchedules",
  ];
  const missing = incrementalStores.filter((s) => !db.objectStoreNames.contains(s));
  if (missing.length === 0) {
    let needsSeed = false;
    for (const s of incrementalStores) {
      const expected = (seed[s] as { id: string }[])?.length ?? 0;
      const count = await new Promise<number>((resolve) => {
        try {
          const t = db.transaction(s, "readonly");
          const req = t.objectStore(s).count();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => resolve(0);
          t.onerror = () => resolve(0);
        } catch { resolve(0); }
      });
      if (count === 0 || count < expected) { needsSeed = true; break; }
    }
    if (!needsSeed) return;
  }
  // Seed only stores that actually exist (guards against partial upgrade)
  const seedableStores = incrementalStores.filter((s) => db.objectStoreNames.contains(s));
  if (seedableStores.length === 0) return;
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(seedableStores, "readwrite");
    seedableStores.forEach((k) => {
      try {
        const store = t.objectStore(k);
        (seed[k] as { id: string }[]).forEach((item) => store.put(item));
      } catch {}
    });
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function dbGetAll<K extends StoreName>(store: K): Promise<DBSchema[K]> {
  await ensureSeeded();
  const rows = await tx<DBSchema[K]>(store, "readonly", (s) => s.getAll() as IDBRequest<DBSchema[K]>);
  return rows;
}

export async function dbPut<K extends StoreName>(store: K, item: DBSchema[K][number]): Promise<void> {
  await ensureSeeded();
  await tx(store, "readwrite", (s) => s.put(item));
}

export async function dbDelete(store: StoreName, id: string): Promise<void> {
  await ensureSeeded();
  await tx(store, "readwrite", (s) => s.delete(id));
}
