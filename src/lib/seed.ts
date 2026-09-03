import type { DBSchema } from "./types";

const uuid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}`;

export function seedData() {
  const tenants: DBSchema["tenants"] = [
    {
      id: uuid(), code: "TNT-1042", name: "Sunrise Public School", nameNe: "सनराइज पब्लिक स्कूल",
      edition: "premium", status: "active", environment: "production",
      contactEmail: "admin@sunrise.edu.np", phone: "+977-1-4470091",
      createdOn: "2024-01-15", validFrom: "2024-01-15", validTo: "2027-04-13",
      licensedModules: ["M04 CRM & Admissions", "M05 Student Info", "M07 Attendance", "M08 Examinations", "M12 Fees & Finance", "M16 Library", "M17 Transport"],
      userLimit: 250, storageLimitGb: 500,
      usage: { users: 173, students: 1468, storageGb: 312, apiCallsK: 8420 },
    },
    {
      id: uuid(), code: "TNT-1043", name: "Little Angels Secondary", nameNe: "लिटल एन्जल्स सेकेन्डरी",
      edition: "standard", status: "trial", environment: "sandbox",
      contactEmail: "info@littleangels.edu.np", phone: "+977-1-6630021",
      createdOn: "2026-08-01", validFrom: "2026-08-01", validTo: "2026-09-30",
      licensedModules: ["M04 CRM & Admissions", "M05 Student Info", "M12 Fees & Finance"],
      userLimit: 25, storageLimitGb: 20,
      usage: { users: 11, students: 240, storageGb: 6, apiCallsK: 310 },
    },
    {
      id: uuid(), code: "TNT-1036", name: "Everest English Boarding", nameNe: "एभरेस्ट इन्ग्लिस बोर्डिङ",
      edition: "standard", status: "active", environment: "production",
      contactEmail: "admin@everestboarding.edu.np", phone: "+977-61-540221",
      createdOn: "2024-07-10", validFrom: "2024-07-10", validTo: "2026-07-16",
      licensedModules: ["M04 CRM & Admissions", "M05 Student Info", "M07 Attendance", "M12 Fees & Finance", "M17 Transport"],
      userLimit: 120, storageLimitGb: 200,
      usage: { users: 96, students: 980, storageGb: 121, apiCallsK: 5210 },
    },
    {
      id: uuid(), code: "TNT-1029", name: "Shanti Nikunja School", nameNe: "शान्ति निकुञ्ज विद्यालय",
      edition: "basic", status: "suspended", environment: "production",
      contactEmail: "office@shantinikunja.edu.np", phone: "+977-56-520144",
      createdOn: "2023-04-02", validFrom: "2023-04-02", validTo: "2026-04-13",
      licensedModules: ["M05 Student Info", "M12 Fees & Finance"],
      userLimit: 60, storageLimitGb: 100,
      usage: { users: 41, students: 620, storageGb: 74, apiCallsK: 0 },
    },
    {
      id: uuid(), code: "TNT-1015", name: "Galaxy Public School", nameNe: "ग्यालेक्सी पब्लिक स्कूल",
      edition: "basic", status: "read_only", environment: "production",
      contactEmail: "info@galaxy.edu.np", phone: "+977-1-4371122",
      createdOn: "2022-06-18", validFrom: "2022-06-18", validTo: "2025-07-16",
      licensedModules: ["M05 Student Info"],
      userLimit: 40, storageLimitGb: 50,
      usage: { users: 0, students: 410, storageGb: 33, apiCallsK: 0 },
    },
    {
      id: uuid(), code: "TNT-1008", name: "Himalaya Higher Secondary", nameNe: "हिमालय उच्च माध्यमिक",
      edition: "standard", status: "archived", environment: "training",
      contactEmail: "admin@himalaya.edu.np", phone: "+977-64-410288",
      createdOn: "2021-03-11", validFrom: "2021-03-11", validTo: "2024-04-12",
      licensedModules: ["M05 Student Info", "M08 Examinations"],
      userLimit: 80, storageLimitGb: 80,
      usage: { users: 0, students: 0, storageGb: 12, apiCallsK: 0 },
    },
  ];

  const institution: DBSchema["institution"] = [
    {
      id: "inst-primary", legalName: "Sunrise Education Foundation Pvt. Ltd.",
      name: "Sunrise Public School", nameNe: "सनराइज पब्लिक स्कूल",
      iemisCode: "NP-BAG-2704-0118", registrationNumber: "REG-KTM-741/2079",
      schoolType: "Institutional (Private)", province: "Bagmati", district: "Kathmandu",
      localLevel: "Kathmandu Metropolitan City", ward: 32, establishedOn: "2059-01-15",
      governingBody: "Sunrise Education Foundation Board of Trustees",
      recognition: "Upgraded Secondary — PABSON Recognition 2080",
      affiliation: "National Examinations Board (NEB), Sanothimi",
      pan: "601234567", website: "www.sunrise.edu.np", email: "info@sunrise.edu.np",
      phone: "+977-1-4470091", moto: "Knowledge · Character · Service",
    },
  ];

  const legalEntities: DBSchema["legalEntities"] = [
    { id: uuid(), name: "Sunrise Education Foundation Pvt. Ltd.", type: "company", pan: "601234567", registrationNumber: "182934/078/079", address: "Baneshwor, Kathmandu-32", isPrimary: true },
    { id: uuid(), name: "Sunrise Community Scholarship Trust", type: "trust", pan: "602987651", registrationNumber: "TRUST-4471/2081", address: "Suryabinayak, Bhaktapur", isPrimary: false },
  ];

  const campuses: DBSchema["campuses"] = [
    { id: "camp-main", name: "Baneshwor Main Campus", nameNe: "बानेश्वर मुख्य क्याम्पस", code: "CAMP-MAIN", status: "open", type: "main", address: "Mid-Baneshwor Chowk, New Baneshwor", province: "Bagmati", district: "Kathmandu", localLevel: "Kathmandu Metropolitan City", ward: 10, phone: "+977-1-4470091", email: "main@sunrise.edu.np", head: "Ramesh Shrestha", gradeFrom: "ECED", gradeTo: "12", brandingColor: "#4f46e5", studentCount: 860, openedOn: "2059-04-01" },
    { id: "camp-bkt", name: "Bhaktapur Branch", nameNe: "भक्तपुर शाखा", code: "CAMP-BKT", status: "open", type: "branch", address: "Suryabinayak Road, Bhaktapur", province: "Bagmati", district: "Bhaktapur", localLevel: "Suryabinayak Municipality", ward: 6, phone: "+977-1-6630021", email: "bhaktapur@sunrise.edu.np", head: "Sunita Bajracharya", gradeFrom: "1", gradeTo: "10", brandingColor: "#0d9488", studentCount: 420, openedOn: "2072-04-01" },
    { id: "camp-eyc", name: "Satdobato Early Years Centre", nameNe: "साटदोबाटो प्रारम्भिक केन्द्र", code: "CAMP-EYC", status: "closing", type: "branch", address: "Ring Road, Satdobato, Lalitpur", province: "Bagmati", district: "Lalitpur", localLevel: "Lalitpur Metropolitan City", ward: 15, phone: "+977-1-5550123", email: "earlyyears@sunrise.edu.np", head: "Anita Maharjan", gradeFrom: "ECED", gradeTo: "UKG", brandingColor: "#f59e0b", studentCount: 188, openedOn: "2075-04-01" },
  ];

  const orgUnits: DBSchema["orgUnits"] = [
    { id: "org-lt", name: "School Leadership", nameNe: "विद्यालय नेतृत्व", code: "ORG-01", type: "administrative", parentId: null, head: "Ramesh Shrestha", headRole: "Principal", staffCount: 4, status: "active" },
    { id: "org-aca", name: "Academic Section", nameNe: "शैक्षिक शाखा", code: "ORG-02", type: "academic", parentId: "org-lt", head: "Sita Karki", headRole: "Vice Principal (Academic)", staffCount: 68, status: "active" },
    { id: "org-prim", name: "Primary Department", code: "ORG-02A", type: "academic", parentId: "org-aca", head: "Kabita Gurung", headRole: "Primary Coordinator", staffCount: 22, status: "active" },
    { id: "org-lsec", name: "Lower Secondary Department", code: "ORG-02B", type: "academic", parentId: "org-aca", head: "Bikash Tamang", headRole: "Lower Secondary Coordinator", staffCount: 18, status: "active" },
    { id: "org-sec", name: "Secondary Department", code: "ORG-02C", type: "academic", parentId: "org-aca", head: "Deepak Adhikari", headRole: "Secondary Coordinator", staffCount: 24, status: "active" },
    { id: "org-sci", name: "Science Stream (11–12)", code: "ORG-02C1", type: "academic", parentId: "org-sec", head: "Nabin Joshi", headRole: "Stream Lead", staffCount: 9, status: "active" },
    { id: "org-mgt", name: "Management Stream (11–12)", code: "ORG-02C2", type: "academic", parentId: "org-sec", head: "Puja Shrestha", headRole: "Stream Lead", staffCount: 7, status: "active" },
    { id: "org-adm", name: "Administration Section", nameNe: "प्रशासकीय शाखा", code: "ORG-03", type: "administrative", parentId: "org-lt", head: "Manoj Rai", headRole: "Admin Officer", staffCount: 11, status: "active" },
    { id: "org-fin", name: "Finance Office", code: "ORG-03A", type: "administrative", parentId: "org-adm", head: "Laxmi Poudel", headRole: "Accountant", staffCount: 4, budgetCode: "FIN-2026", status: "active" },
    { id: "org-hr", name: "HR Office", code: "ORG-03B", type: "administrative", parentId: "org-adm", head: "Suresh Thapa", headRole: "HR Officer", staffCount: 3, budgetCode: "HR-2026", status: "active" },
    { id: "org-sup", name: "Student Support Services", nameNe: "विद्यार्थी सहायता", code: "ORG-04", type: "support", parentId: "org-lt", head: "Rekha Bhandari", headRole: "Support Lead", staffCount: 6, status: "active" },
    { id: "org-coun", name: "Counselling Cell", code: "ORG-04A", type: "support", parentId: "org-sup", head: "Sabina Dulal", headRole: "School Counsellor", staffCount: 2, status: "active" },
    { id: "org-it", name: "IT & Records Cell", code: "ORG-05", type: "support", parentId: "org-adm", head: "Anish Karki", headRole: "IT Officer", staffCount: 3, status: "inactive" },
  ];

  const locations: DBSchema["locations"] = [
    { id: "loc-site-main", name: "Baneshwor Campus Site", code: "SITE-01", type: "site", parentId: null, accessibility: true, equipment: [], bookingPolicy: "closed", barcode: "QR-SITE-01", shared: false, status: "available" },
    { id: "loc-blk-main", name: "Main Academic Block", code: "BLK-01", type: "building", parentId: "loc-site-main", accessibility: true, equipment: [], bookingPolicy: "closed", barcode: "QR-BLK-01", shared: false, status: "available" },
    { id: "loc-blk-annex", name: "Academic Annex", code: "BLK-02", type: "building", parentId: "loc-site-main", accessibility: false, equipment: [], bookingPolicy: "closed", barcode: "QR-BLK-02", shared: false, status: "available" },
    { id: "loc-fl-g", name: "Ground Floor", code: "BLK-01-F0", type: "floor", parentId: "loc-blk-main", accessibility: true, equipment: [], bookingPolicy: "closed", barcode: "QR-F0", shared: false, status: "available" },
    { id: "loc-fl-1", name: "First Floor", code: "BLK-01-F1", type: "floor", parentId: "loc-blk-main", accessibility: true, equipment: ["Lift access"], bookingPolicy: "closed", barcode: "QR-F1", shared: false, status: "available" },
    { id: "loc-rm-101", name: "Room 101", code: "RM-101", type: "room", parentId: "loc-fl-g", capacity: 40, accessibility: true, equipment: ["Projector", "Whiteboard", "Fans"], safetyRating: 4, bookingPolicy: "open", barcode: "QR-RM-101", shared: true, department: "Primary Department", status: "occupied" },
    { id: "loc-rm-102", name: "Room 102", code: "RM-102", type: "room", parentId: "loc-fl-g", capacity: 40, accessibility: true, equipment: ["Whiteboard", "Fans"], safetyRating: 4, bookingPolicy: "open", barcode: "QR-RM-102", shared: false, department: "Primary Department", status: "available" },
    { id: "loc-rm-201", name: "Room 201", code: "RM-201", type: "room", parentId: "loc-fl-1", capacity: 36, accessibility: true, equipment: ["Smart board", "AC"], safetyRating: 5, bookingPolicy: "approval", barcode: "QR-RM-201", shared: false, department: "Science Stream (11–12)", status: "available" },
    { id: "loc-lab-phy", name: "Physics Laboratory", code: "LAB-PHY", type: "lab", parentId: "loc-fl-g", capacity: 30, accessibility: true, equipment: ["Lab benches", "Fume hood", "Fire extinguisher"], safetyRating: 5, bookingPolicy: "restricted", barcode: "QR-LAB-PHY", shared: true, department: "Science Stream (11–12)", status: "available" },
    { id: "loc-lab-comp", name: "Computer Laboratory", code: "LAB-COMP", type: "lab", parentId: "loc-fl-1", capacity: 32, accessibility: true, equipment: ["40 workstations", "UPS", "Projector"], safetyRating: 4, bookingPolicy: "approval", barcode: "QR-LAB-COMP", shared: true, department: "Secondary Department", status: "occupied" },
    { id: "loc-hall-asm", name: "Assembly Hall", code: "HALL-01", type: "hall", parentId: "loc-blk-main", capacity: 400, accessibility: true, equipment: ["PA system", "Stage lighting"], safetyRating: 5, bookingPolicy: "approval", barcode: "QR-HALL-01", shared: true, status: "available" },
    { id: "loc-fld-main", name: "Main Sports Field", code: "FLD-01", type: "field", parentId: "loc-site-main", capacity: 600, accessibility: true, equipment: ["Basketball hoops", "Volleyball posts"], bookingPolicy: "open", barcode: "QR-FLD-01", shared: true, status: "available" },
    { id: "loc-rm-a1", name: "Annex Room A-1", code: "RM-A1", type: "room", parentId: "loc-blk-annex", capacity: 28, accessibility: false, equipment: ["Whiteboard"], safetyRating: 3, bookingPolicy: "open", barcode: "QR-RM-A1", shared: false, department: "Lower Secondary Department", status: "maintenance" },
  ];

  const calendarYears: DBSchema["calendarYears"] = [
    { id: "cal-2082", academicYear: "2082 BS", adRange: "Apr 2025 – Apr 2026", bsRange: "बैशाख २०८२ – चैत २०८२", totalDays: 365, workingDays: 242, status: "completed" },
    { id: "cal-2083", academicYear: "2083 BS", adRange: "Apr 2026 – Apr 2027", bsRange: "बैशाख २०८३ – चैत २०८३", totalDays: 365, workingDays: 245, status: "current" },
    { id: "cal-2084", academicYear: "2084 BS", adRange: "Apr 2027 – Apr 2028", bsRange: "बैशाख २०८४ – चैत २०८४", totalDays: 366, workingDays: 248, status: "upcoming" },
  ];

  const holidays: DBSchema["holidays"] = [
    { id: "hol-1", name: "Republic Day", nameNe: "गणतन्त्र दिवस", date: "2026-05-29", dateBs: "जेठ १५, २०८३", type: "public" },
    { id: "hol-2", name: "Janai Purnima", nameNe: "जनै पूर्णिमा", date: "2026-08-28", dateBs: "भदौ ११, २०८३", type: "festival" },
    { id: "hol-3", name: "Constitution Day", nameNe: "संविधान दिवस", date: "2026-09-20", dateBs: "असोज ३, २०८३", type: "public" },
    { id: "hol-4", name: "Dashain Holiday", nameNe: "दशैं बिदा", date: "2026-10-14", dateBs: "असोज २७, २०८३", type: "festival" },
    { id: "hol-5", name: "Tihar Holiday", nameNe: "तिहार बिदा", date: "2026-11-06", dateBs: "कात्तिक २०, २०८३", type: "festival" },
    { id: "hol-6", name: "Chhath Parva", nameNe: "छठ पर्व", date: "2026-11-10", dateBs: "कात्तिक २४, २०८३", type: "festival" },
    { id: "hol-7", name: "Winter Break", nameNe: "शीतकालीन बिदा", date: "2026-12-24", dateBs: "पुस ९, २०८३", type: "school" },
    { id: "hol-8", name: "Prithvi Jayanti", nameNe: "पृथ्वी जयन्ती", date: "2027-01-11", dateBs: "पुस २७, २०८३", type: "public" },
    { id: "hol-9", name: "Maha Shivaratri", nameNe: "महाशिवरात्रि", date: "2027-02-15", dateBs: "फागुन ३, २०८३", type: "festival" },
    { id: "hol-10", name: "Holi", nameNe: "होली", date: "2027-03-03", dateBs: "फागुन १९, २०८३", type: "festival" },
  ];

  const locale: DBSchema["locale"] = [
    { id: "locale-default", timezone: "Asia/Kathmandu (UTC+05:45)", weekStart: "sunday", dateFormat: "DD/MM/YYYY", numberFormat: "en-IN (1,23,456.78)", language: "both", calendarSystem: "both", fiscalYearStart: "Shrawan 1 (mid-July)" },
  ];

  const sequences: DBSchema["sequences"] = [
    { id: "seq-stu", docType: "Student ID", description: "Enrollment / student registry numbers", prefix: "STU-2083-", currentNumber: 1468, padLength: 4, period: "Academic 2083", locked: false, lastIssued: "2026-08-29" },
    { id: "seq-inv", docType: "Invoice", description: "Fee invoices issued to guardians", prefix: "INV-2083-", currentNumber: 8934, padLength: 5, period: "Fiscal 2083/84", locked: true, lastIssued: "2026-09-01" },
    { id: "seq-rcp", docType: "Receipt", description: "Payment receipts", prefix: "RCP-2083-", currentNumber: 8102, padLength: 5, period: "Fiscal 2083/84", locked: false, lastIssued: "2026-09-01" },
    { id: "seq-adm", docType: "Application", description: "Admission enquiry / application forms", prefix: "ADM-2083-", currentNumber: 421, padLength: 4, period: "Academic 2083", locked: false, lastIssued: "2026-08-30" },
    { id: "seq-emp", docType: "Employee ID", description: "Staff / payroll registry numbers", prefix: "EMP-2083-", currentNumber: 138, padLength: 3, period: "Fiscal 2083/84", locked: false, lastIssued: "2026-08-16" },
    { id: "seq-cer", docType: "Certificate", description: "Transfer / character certificates", prefix: "CER-2083-", currentNumber: 96, padLength: 4, period: "Academic 2083", locked: true, lastIssued: "2026-08-11" },
  ];

  const featureFlags: DBSchema["featureFlags"] = [
    { id: "ff-1", featureCode: "M10.LMS", name: "Learning Management System", description: "Digital classrooms, assignments and resources (M10)", category: "academics", enabled: true, scope: "tenant", campusId: null, role: null, effectiveFrom: "2026-04-14" },
    { id: "ff-2", featureCode: "M12.ONLINE_PAY", name: "Online Fee Payments", description: "Connect IPS/eSewa/Khalti gateway for guardian payments", category: "finance", enabled: true, scope: "campus", campusId: "camp-main", role: null, effectiveFrom: "2026-07-17" },
    { id: "ff-3", featureCode: "M17.GPS_TRACK", name: "Live Transport Tracking", description: "GPS bus tracking exposed to parent portal", category: "transport", enabled: false, scope: "tenant", campusId: null, role: null, effectiveFrom: "2026-10-01" },
    { id: "ff-4", featureCode: "M16.BARCODE", name: "Library Barcode Circulation", description: "Barcode-based issue/return of learning resources", category: "library", enabled: true, scope: "tenant", campusId: null, role: null, effectiveFrom: "2026-04-20" },
    { id: "ff-5", featureCode: "M23.SMS", name: "SMS Notifications", description: "Attendance and fee alerts via SMS (Nepali templates)", category: "communication", enabled: true, scope: "role", campusId: null, role: "Guardian", effectiveFrom: "2026-05-01" },
    { id: "ff-6", featureCode: "M07.BIOMETRIC", name: "Biometric Staff Attendance", description: "Fingerprint device sync for staff attendance", category: "hr", enabled: false, scope: "campus", campusId: "camp-bkt", role: null, effectiveFrom: "2026-11-01" },
    { id: "ff-7", featureCode: "M08.ONLINE_EXAM", name: "Online Examinations", description: "Computer-based tests with integrity monitoring", category: "academics", enabled: false, scope: "role", campusId: null, role: "Teacher", effectiveFrom: "2027-01-01" },
    { id: "ff-8", featureCode: "M11.PARENT_PORTAL", name: "Parent Self-Service Portal", description: "Guardian web/mobile access to results, fees and notices", category: "communication", enabled: true, scope: "tenant", campusId: null, role: null, effectiveFrom: "2026-04-14" },
  ];

  const configVersions: DBSchema["configVersions"] = [
    { id: "cv-1", version: "v4.2", status: "published", createdBy: "Anish Karki (IT Officer)", createdOn: "2026-07-01", approvedBy: "Ramesh Shrestha (Principal)", notes: "Fee heads restructured for FY 2083/84; transport slabs updated", changes: 14, targetEnv: "production" },
    { id: "cv-2", version: "v4.3", status: "in_review", createdBy: "Anish Karki (IT Officer)", createdOn: "2026-08-20", notes: "Enable online payments for Bhaktapur branch; new custom field 'Blood Group' on student profile", changes: 6, targetEnv: "production" },
    { id: "cv-3", version: "v5.0", status: "draft", createdBy: "Suresh Thapa (HR Officer)", createdOn: "2026-08-28", notes: "Sandbox draft: grading scheme for NEB letter grading 11–12", changes: 9, targetEnv: "sandbox" },
    { id: "cv-4", version: "v4.1", status: "rejected", createdBy: "Laxmi Poudel (Accountant)", createdOn: "2026-06-10", approvedBy: "Ramesh Shrestha (Principal)", notes: "Rejected — discount policy conflicted with sibling-quota rule", changes: 3, targetEnv: "production" },
  ];

  const audit: DBSchema["audit"] = [
    { id: "au-1", ts: "2026-09-01T09:41:00", actor: "Anish Karki", action: "POLICY_UPDATED", entity: "feature_policy", detail: "Enabled M12.ONLINE_PAY effective 2026-07-17 for Baneshwor Main Campus", recordsAffected: 128 },
    { id: "au-2", ts: "2026-08-30T14:22:00", actor: "Ramesh Shrestha", action: "APPROVED", entity: "configuration_version", detail: "Version v4.2 published to production", recordsAffected: 14 },
    { id: "au-3", ts: "2026-08-29T10:05:00", actor: "Suresh Thapa", action: "SEQUENCE_LOCKED", entity: "document_sequence", detail: "INV-2083- locked for fiscal period 2083/84", recordsAffected: 1 },
    { id: "au-4", ts: "2026-08-25T16:48:00", actor: "Manoj Rai", action: "CAMPUS_STATUS", entity: "campus", detail: "Satdobato Early Years Centre marked as closing (end of FY)", recordsAffected: 1 },
    { id: "au-5", ts: "2026-08-20T11:30:00", actor: "Anish Karki", action: "TENANT_ENTITLEMENT", entity: "tenant_entitlement", detail: "Storage quota raised 400 GB → 500 GB for TNT-1042", recordsAffected: 1 },
    { id: "au-6", ts: "2026-08-11T09:12:00", actor: "Laxmi Poudel", action: "REJECTED", entity: "configuration_version", detail: "Version v4.1 rejected with review comments", recordsAffected: 3 },
  ];

  // ── M02 Identity, Access and Delegation seed data ─────────────────────────

  const userIdentities: DBSchema["userIdentities"] = [
    { id: "uid-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, username: "anish.karki", email: "anish.karki@sunrise.edu.np", phone: "+977-9841001001", displayName: "Anish Karki", displayNameNe: "अनिश कार्की", type: "admin", status: "active", mfaEnabled: true, mfaMethod: "totp", lastLogin: "2026-09-03T08:15:00", failedAttempts: 0, passwordChangedOn: "2026-08-01", mustChangePassword: false, createdOn: "2024-01-15", updatedOn: "2026-09-03" },
    { id: "uid-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, username: "ramesh.shrestha", email: "ramesh.shrestha@sunrise.edu.np", phone: "+977-9841001002", displayName: "Ramesh Shrestha", displayNameNe: "रमेश श्रेष्ठ", type: "staff", status: "active", mfaEnabled: false, lastLogin: "2026-09-02T16:30:00", failedAttempts: 0, passwordChangedOn: "2026-07-15", mustChangePassword: false, createdOn: "2024-02-01", updatedOn: "2026-09-02" },
    { id: "uid-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, username: "laxmi.poudel", email: "laxmi.poudel@sunrise.edu.np", phone: "+977-9841001003", displayName: "Laxmi Poudel", displayNameNe: "लक्ष्मी पौडेल", type: "staff", status: "active", mfaEnabled: false, lastLogin: "2026-09-01T10:00:00", failedAttempts: 0, passwordChangedOn: "2026-06-20", mustChangePassword: false, createdOn: "2024-03-10", updatedOn: "2026-09-01" },
    { id: "uid-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, username: "suresh.thapa", email: "suresh.thapa@sunrise.edu.np", phone: "+977-9841001004", displayName: "Suresh Thapa", displayNameNe: "सुरेश थापा", type: "staff", status: "active", mfaEnabled: true, mfaMethod: "sms", lastLogin: "2026-09-03T07:45:00", failedAttempts: 0, passwordChangedOn: "2026-08-10", mustChangePassword: false, createdOn: "2024-04-01", updatedOn: "2026-09-03" },
    { id: "uid-5", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, username: "manoj.rai", email: "manoj.rai@sunrise.edu.np", phone: "+977-9841001005", displayName: "Manoj Rai", displayNameNe: "मनोज राई", type: "staff", status: "active", mfaEnabled: false, lastLogin: "2026-08-30T14:00:00", failedAttempts: 0, passwordChangedOn: "2026-07-01", mustChangePassword: false, createdOn: "2024-05-15", updatedOn: "2026-08-30" },
    { id: "uid-6", tenantId: tenants[0]!.id, username: "sita.adhikari", email: "sita.adhikari@sunrise.edu.np", displayName: "Sita Adhikari", displayNameNe: "सीता अधिकारी", type: "guardian", status: "active", mfaEnabled: false, failedAttempts: 0, mustChangePassword: false, createdOn: "2025-04-01", updatedOn: "2026-08-15" },
    { id: "uid-7", tenantId: tenants[0]!.id, username: "test.locked", email: "locked@sunrise.edu.np", displayName: "Test Locked User", type: "staff", status: "locked", mfaEnabled: false, failedAttempts: 5, lockedUntil: "2026-09-10T00:00:00", mustChangePassword: true, createdOn: "2025-01-01", updatedOn: "2026-09-01" },
    { id: "uid-8", tenantId: tenants[1]!.id, username: "admin.littleangels", email: "admin@littleangels.edu.np", displayName: "Little Angels Admin", type: "admin", status: "active", mfaEnabled: false, failedAttempts: 0, mustChangePassword: false, createdOn: "2026-08-01", updatedOn: "2026-08-01" },
  ];

  const authSessions: DBSchema["authSessions"] = [
    { id: "as-1", userId: "uid-1", provider: "local", issuedAt: "2026-09-03T08:15:00", expiresAt: "2026-09-03T20:15:00", ip: "202.51.78.12", userAgent: "Chrome/128", isActive: true },
    { id: "as-2", userId: "uid-2", provider: "local", issuedAt: "2026-09-02T16:30:00", expiresAt: "2026-09-03T04:30:00", ip: "202.51.78.14", userAgent: "Firefox/130", isActive: false },
    { id: "as-3", userId: "uid-4", provider: "google", issuedAt: "2026-09-03T07:45:00", expiresAt: "2026-09-03T19:45:00", ip: "202.51.78.20", userAgent: "Chrome/128", isActive: true },
    { id: "as-4", userId: "uid-3", provider: "local", issuedAt: "2026-09-01T10:00:00", expiresAt: "2026-09-01T22:00:00", ip: "202.51.78.15", userAgent: "Safari/18", isActive: false, revokedAt: "2026-09-01T18:00:00", revokeReason: "User logout" },
    { id: "as-5", userId: "uid-1", provider: "sso", issuedAt: "2026-09-02T09:00:00", expiresAt: "2026-09-02T21:00:00", ip: "10.0.1.5", userAgent: "Chrome/128", isActive: false, revokedAt: "2026-09-02T17:30:00", revokeReason: "Session expired" },
  ];

  const authFactors: DBSchema["authFactors"] = [
    { id: "af-1", userId: "uid-1", type: "totp", enabled: true, enrolledOn: "2024-06-01", lastUsed: "2026-09-03T08:15:00", label: "Google Authenticator" },
    { id: "af-2", userId: "uid-4", type: "sms", enabled: true, enrolledOn: "2025-01-15", lastUsed: "2026-09-03T07:45:00", label: "+977-984****004" },
    { id: "af-3", userId: "uid-1", type: "backup_codes", enabled: true, enrolledOn: "2024-06-01", label: "Recovery codes" },
    { id: "af-4", userId: "uid-2", type: "email", enabled: false, enrolledOn: "2024-08-10", label: "Email OTP" },
  ];

  const roles: DBSchema["roles"] = [
    { id: "role-1", tenantId: tenants[0]!.id, code: "SUPER_ADMIN", name: "Super Administrator", nameNe: "सुपर व्यवस्थापक", description: "Full platform access across all modules and campuses", isSystem: true, isDefault: false, priority: 100, permissions: [{ id: "perm-1", resource: "*", action: "*", effect: "allow" }], createdOn: "2024-01-15" },
    { id: "role-2", tenantId: tenants[0]!.id, code: "PRINCIPAL", name: "Principal", nameNe: "प्रधानाध्यापक", description: "School head with approval authority for academics, staff and finance", isSystem: true, isDefault: false, priority: 90, permissions: [
      { id: "perm-2", resource: "students", action: "read", effect: "allow" }, { id: "perm-3", resource: "students", action: "write", effect: "allow" },
      { id: "perm-4", resource: "exams", action: "approve", effect: "allow" }, { id: "perm-5", resource: "fees", action: "approve", effect: "allow" },
      { id: "perm-6", resource: "staff", action: "read", effect: "allow" }, { id: "perm-7", resource: "staff", action: "write", effect: "allow" },
    ], createdOn: "2024-01-15" },
    { id: "role-3", tenantId: tenants[0]!.id, code: "ACCOUNTANT", name: "Accountant", nameNe: "लेखापाल", description: "Finance module maker — invoices, receipts, fee assignment", isSystem: true, isDefault: false, priority: 70, permissions: [
      { id: "perm-8", resource: "fees", action: "read", effect: "allow" }, { id: "perm-9", resource: "fees", action: "write", effect: "allow" },
      { id: "perm-10", resource: "fees", action: "approve", effect: "deny" }, { id: "perm-11", resource: "reports", action: "read", effect: "allow" },
    ], createdOn: "2024-01-15" },
    { id: "role-4", tenantId: tenants[0]!.id, code: "TEACHER", name: "Teacher", nameNe: "शिक्षक", description: "Class teacher with attendance, marks entry and lesson plan access", isSystem: true, isDefault: true, priority: 50, permissions: [
      { id: "perm-12", resource: "attendance", action: "write", effect: "allow" }, { id: "perm-13", resource: "exams", action: "write", effect: "allow" },
      { id: "perm-14", resource: "students", action: "read", effect: "allow", conditions: "{\"scope\":\"assigned_class\"}" },
    ], createdOn: "2024-01-15" },
    { id: "role-5", tenantId: tenants[0]!.id, code: "ADMISSIONS", name: "Admissions Officer", nameNe: "भर्ना अधिकारी", description: "CRM, enquiry, application and conversion workflow", isSystem: false, isDefault: false, priority: 60, permissions: [
      { id: "perm-15", resource: "admissions", action: "read", effect: "allow" }, { id: "perm-16", resource: "admissions", action: "write", effect: "allow" },
      { id: "perm-17", resource: "students", action: "write", effect: "allow", conditions: "{\"stage\":\"enquiry\"}" },
    ], createdOn: "2024-06-01" },
    { id: "role-6", tenantId: tenants[0]!.id, code: "GUARDIAN", name: "Parent / Guardian", nameNe: "अभिभावक", description: "Read-only portal access for own ward's results, fees and attendance", isSystem: true, isDefault: false, priority: 20, permissions: [
      { id: "perm-18", resource: "results", action: "read", effect: "allow", conditions: "{\"scope\":\"own_ward\"}" },
      { id: "perm-19", resource: "fees", action: "read", effect: "allow", conditions: "{\"scope\":\"own_ward\"}" },
    ], createdOn: "2024-01-15" },
  ];

  const userRoles: DBSchema["userRoles"] = [
    { id: "ur-1", userId: "uid-1", userName: "Anish Karki", roleId: "role-1", roleName: "Super Administrator", scope: "tenant", assignedBy: "system", assignedOn: "2024-01-15", validFrom: "2024-01-15", isActive: true },
    { id: "ur-2", userId: "uid-2", userName: "Ramesh Shrestha", roleId: "role-2", roleName: "Principal", scope: "campus", scopeId: campuses[0]!.id, scopeName: "Baneshwor Main Campus", assignedBy: "Anish Karki", assignedOn: "2024-02-01", validFrom: "2024-02-01", isActive: true },
    { id: "ur-3", userId: "uid-3", userName: "Laxmi Poudel", roleId: "role-3", roleName: "Accountant", scope: "campus", scopeId: campuses[0]!.id, scopeName: "Baneshwor Main Campus", assignedBy: "Ramesh Shrestha", assignedOn: "2024-03-10", validFrom: "2024-03-10", isActive: true },
    { id: "ur-4", userId: "uid-4", userName: "Suresh Thapa", roleId: "role-5", roleName: "Admissions Officer", scope: "tenant", assignedBy: "Anish Karki", assignedOn: "2024-04-01", validFrom: "2024-04-01", isActive: true },
    { id: "ur-5", userId: "uid-5", userName: "Manoj Rai", roleId: "role-4", roleName: "Teacher", scope: "campus", scopeId: campuses[1]!.id, scopeName: "Bhaktapur Branch", assignedBy: "Ramesh Shrestha", assignedOn: "2024-05-15", validFrom: "2024-05-15", isActive: true },
    { id: "ur-6", userId: "uid-6", userName: "Sita Adhikari", roleId: "role-6", roleName: "Parent / Guardian", scope: "tenant", assignedBy: "system", assignedOn: "2025-04-01", validFrom: "2025-04-01", isActive: true },
    { id: "ur-7", userId: "uid-3", userName: "Laxmi Poudel", roleId: "role-4", roleName: "Teacher", scope: "campus", scopeId: campuses[0]!.id, scopeName: "Baneshwor Main Campus", assignedBy: "Ramesh Shrestha", assignedOn: "2024-03-10", validFrom: "2024-03-10", validTo: "2025-03-31", isActive: false },
  ];

  const dataScopes: DBSchema["dataScopes"] = [
    { id: "ds-1", userId: "uid-2", userName: "Ramesh Shrestha", scopeType: "campus", scopeId: campuses[0]!.id, scopeName: "Baneshwor Main Campus", grantedBy: "Anish Karki", grantedOn: "2024-02-01" },
    { id: "ds-2", userId: "uid-3", userName: "Laxmi Poudel", scopeType: "campus", scopeId: campuses[0]!.id, scopeName: "Baneshwor Main Campus", grantedBy: "Ramesh Shrestha", grantedOn: "2024-03-10" },
    { id: "ds-3", userId: "uid-5", userName: "Manoj Rai", scopeType: "campus", scopeId: campuses[1]!.id, scopeName: "Bhaktapur Branch", grantedBy: "Ramesh Shrestha", grantedOn: "2024-05-15" },
    { id: "ds-4", userId: "uid-5", userName: "Manoj Rai", scopeType: "class_section", scopeId: "cs-10a", scopeName: "Class 10 — Section A", grantedBy: "Ramesh Shrestha", grantedOn: "2026-04-15" },
  ];

  const delegations: DBSchema["delegations"] = [
    { id: "del-1", delegatorId: "uid-2", delegatorName: "Ramesh Shrestha", delegateId: "uid-4", delegateName: "Suresh Thapa", reason: "Annual leave — Dashain vacation", scope: "exams.approve, fees.approve", validFrom: "2026-10-15", validTo: "2026-10-30", status: "active", createdOn: "2026-09-01" },
    { id: "del-2", delegatorId: "uid-3", delegatorName: "Laxmi Poudel", delegateId: "uid-5", delegateName: "Manoj Rai", reason: "Maternity leave coverage", scope: "fees.read, reports.read", validFrom: "2026-07-01", validTo: "2026-12-31", status: "active", createdOn: "2026-06-25" },
    { id: "del-3", delegatorId: "uid-1", delegatorName: "Anish Karki", delegateId: "uid-4", delegateName: "Suresh Thapa", reason: "System migration weekend", scope: "*", validFrom: "2026-08-24", validTo: "2026-08-26", status: "expired", createdOn: "2026-08-20" },
  ];

  const impersonationLogs: DBSchema["impersonationLogs"] = [
    { id: "il-1", adminId: "uid-1", adminName: "Anish Karki", targetUserId: "uid-3", targetName: "Laxmi Poudel", reason: "Troubleshoot fee report permission error reported by user", startedAt: "2026-09-01T14:00:00", endedAt: "2026-09-01T14:22:00", actionsPerformed: 5, status: "ended" },
    { id: "il-2", adminId: "uid-1", adminName: "Anish Karki", targetUserId: "uid-6", targetName: "Sita Adhikari", reason: "Verify guardian portal view for ward results", startedAt: "2026-08-28T11:00:00", endedAt: "2026-08-28T11:08:00", actionsPerformed: 3, status: "ended" },
    { id: "il-3", adminId: "uid-1", adminName: "Anish Karki", targetUserId: "uid-7", targetName: "Test Locked User", reason: "Debug account lockout after 5 failed attempts", startedAt: "2026-09-02T09:30:00", actionsPerformed: 1, status: "active" },
  ];

  const dutyRules: DBSchema["dutyRules"] = [
    { id: "dr-1", tenantId: tenants[0]!.id, name: "Maker-Checker Separation", description: "Same user cannot both create and approve financial transactions", conflictingRoles: ["ACCOUNTANT", "PRINCIPAL"], enforcement: "strict", isActive: true, createdBy: "Anish Karki", createdOn: "2024-06-01" },
    { id: "dr-2", tenantId: tenants[0]!.id, name: "Exam Entry vs Result Approval", description: "Teacher entering marks cannot also approve final results for same class", conflictingRoles: ["TEACHER", "PRINCIPAL"], enforcement: "warning", isActive: true, createdBy: "Ramesh Shrestha", createdOn: "2025-01-10" },
    { id: "dr-3", tenantId: tenants[0]!.id, name: "Admissions and Fee Waiver", description: "Admissions officer cannot approve fee waivers or scholarships", conflictingRoles: ["ADMISSIONS", "ACCOUNTANT"], enforcement: "strict", isActive: true, createdBy: "Anish Karki", createdOn: "2025-03-15" },
    { id: "dr-4", tenantId: tenants[0]!.id, name: "IT Admin Finance Restriction", description: "IT admin should not have direct finance write access (advisory)", conflictingRoles: ["SUPER_ADMIN", "ACCOUNTANT"], enforcement: "advisory", isActive: true, exceptionNote: "Emergency break-glass override permitted with audit trail", createdBy: "Ramesh Shrestha", createdOn: "2024-06-01" },
  ];

  const dutyViolations: DBSchema["dutyViolations"] = [
    { id: "dv-1", ruleId: "dr-1", ruleName: "Maker-Checker Separation", userId: "uid-3", userName: "Laxmi Poudel", roleA: "ACCOUNTANT", roleB: "PRINCIPAL", detectedOn: "2026-08-15", severity: "critical", status: "resolved", resolvedBy: "Anish Karki", resolvedOn: "2026-08-16", notes: "Temporary principal role removed; was granted during Ramesh's leave" },
    { id: "dv-2", ruleId: "dr-2", ruleName: "Exam Entry vs Result Approval", userId: "uid-5", userName: "Manoj Rai", roleA: "TEACHER", roleB: "PRINCIPAL", detectedOn: "2026-09-01", severity: "high", status: "open", notes: "User has both roles on Bhaktapur Branch — needs review" },
    { id: "dv-3", ruleId: "dr-4", ruleName: "IT Admin Finance Restriction", userId: "uid-1", userName: "Anish Karki", roleA: "SUPER_ADMIN", roleB: "ACCOUNTANT", detectedOn: "2026-07-20", severity: "medium", status: "waived", resolvedBy: "Ramesh Shrestha", resolvedOn: "2026-07-21", notes: "Approved exception — IT needs write access for system integration testing" },
  ];

  const privilegedAccess: DBSchema["privilegedAccess"] = [
    { id: "pa-1", userId: "uid-1", userName: "Anish Karki", level: "elevated", resource: "database.admin", reason: "Monthly DB maintenance window", requestedBy: "Anish Karki", approvedBy: "Ramesh Shrestha", requestedOn: "2026-09-01", validFrom: "2026-09-03T02:00:00", validTo: "2026-09-03T06:00:00", status: "active", usedCount: 1, maxUses: 5 },
    { id: "pa-2", userId: "uid-4", userName: "Suresh Thapa", level: "break_glass", resource: "fees.bulk_waiver", reason: "Emergency scholarship processing for earthquake-affected students", requestedBy: "Ramesh Shrestha", approvedBy: "Ramesh Shrestha", requestedOn: "2026-08-20", validFrom: "2026-08-20", validTo: "2026-08-22", status: "expired", usedCount: 3, maxUses: 10 },
    { id: "pa-3", userId: "uid-2", userName: "Ramesh Shrestha", level: "emergency", resource: "system.config", reason: "Emergency config rollback after failed deployment", requestedBy: "Ramesh Shrestha", requestedOn: "2026-09-02", validFrom: "2026-09-02T18:00:00", validTo: "2026-09-02T23:59:00", status: "expired", usedCount: 2 },
    { id: "pa-4", userId: "uid-3", userName: "Laxmi Poudel", level: "elevated", resource: "reports.audit_trail", reason: "Quarterly audit report extraction", requestedBy: "Laxmi Poudel", requestedOn: "2026-09-03", validFrom: "2026-09-05", validTo: "2026-09-07", status: "pending", usedCount: 0, maxUses: 3 },
  ];

  const accessReviews: DBSchema["accessReviews"] = [
    { id: "ar-1", tenantId: tenants[0]!.id, reviewPeriod: "Q2 2026", reviewerId: "uid-2", reviewerName: "Ramesh Shrestha", scope: "All campus staff roles", totalIdentities: 173, reviewed: 173, approved: 165, revoked: 8, status: "certified", startedOn: "2026-07-01", completedOn: "2026-07-15", certifiedBy: "Anish Karki" },
    { id: "ar-2", tenantId: tenants[0]!.id, reviewPeriod: "Q3 2026", reviewerId: "uid-2", reviewerName: "Ramesh Shrestha", scope: "Finance module access", totalIdentities: 42, reviewed: 28, approved: 26, revoked: 2, status: "in_progress", startedOn: "2026-09-01" },
    { id: "ar-3", tenantId: tenants[0]!.id, reviewPeriod: "Annual 2026", reviewerId: "uid-1", reviewerName: "Anish Karki", scope: "Privileged and break-glass accounts", totalIdentities: 12, reviewed: 0, approved: 0, revoked: 0, status: "draft", startedOn: "2026-09-03" },
  ];

  // ── M03 School Academic Foundation and Catalog ────────────────────────────

  const academicYears: DBSchema["academicYears"] = [
    { id: "ay-1", tenantId: tenants[0]!.id, name: "2082 BS (2025/2026)", nameNe: "२०८२ बि.सं.", startDate: "2025-04-15", endDate: "2026-04-14", bsYear: "2082", status: "active", isCurrent: true, createdOn: "2025-03-01" },
    { id: "ay-2", tenantId: tenants[0]!.id, name: "2081 BS (2024/2025)", nameNe: "२०८१ बि.सं.", startDate: "2024-04-15", endDate: "2025-04-14", bsYear: "2081", status: "closed", isCurrent: false, createdOn: "2024-03-01" },
    { id: "ay-3", tenantId: tenants[0]!.id, name: "2083 BS (2026/2027)", nameNe: "२०८३ बि.सं.", startDate: "2026-04-15", endDate: "2027-04-14", bsYear: "2083", status: "planning", isCurrent: false, createdOn: "2026-02-15" },
  ];

  const terms: DBSchema["terms"] = [
    { id: "tm-1", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", name: "First Term", nameNe: "पहिलो त्रैमासिक", startDate: "2025-04-15", endDate: "2025-07-15", sequence: 1, status: "completed" },
    { id: "tm-2", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", name: "Second Term", nameNe: "दोस्रो त्रैमासिक", startDate: "2025-07-16", endDate: "2025-10-15", sequence: 2, status: "active" },
    { id: "tm-3", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", name: "Third Term", nameNe: "तेस्रो त्रैमासिक", startDate: "2025-10-16", endDate: "2026-01-15", sequence: 3, status: "planned" },
    { id: "tm-4", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", name: "Fourth Term", nameNe: "चौथो त्रैमासिक", startDate: "2026-01-16", endDate: "2026-04-14", sequence: 4, status: "planned" },
  ];

  const schoolLevels: DBSchema["schoolLevels"] = [
    { id: "sl-1", tenantId: tenants[0]!.id, name: "Early Childhood Development (ECED)", nameNe: "प्रारम्भिक बाल विकास", code: "ECED", description: "Pre-primary and nursery education for ages 3–5", ageRange: "3–5", sequence: 1, isActive: true },
    { id: "sl-2", tenantId: tenants[0]!.id, name: "Basic Education", nameNe: "आधारभूत शिक्षा", code: "Basic", description: "Classes 1–8 as per Nepal national curriculum", ageRange: "6–13", sequence: 2, isActive: true },
    { id: "sl-3", tenantId: tenants[0]!.id, name: "Secondary Education", nameNe: "माध्यमिक शिक्षा", code: "Secondary", description: "Classes 9–10, SEE preparation", ageRange: "14–15", sequence: 3, isActive: true },
    { id: "sl-4", tenantId: tenants[0]!.id, name: "Higher Secondary (+2/NEB)", nameNe: "उच्च माध्यमिक", code: "Plus2", description: "Classes 11–12 under NEB curriculum", ageRange: "16–17", sequence: 4, isActive: true },
  ];

  const gradeClasses: DBSchema["gradeClasses"] = [
    { id: "gc-1", tenantId: tenants[0]!.id, levelId: "sl-1", levelName: "ECED", name: "Nursery", nameNe: "नर्सरी", code: "NUR", sequence: 1, isActive: true },
    { id: "gc-2", tenantId: tenants[0]!.id, levelId: "sl-1", levelName: "ECED", name: "LKG", nameNe: "एल.के.जी.", code: "LKG", sequence: 2, isActive: true },
    { id: "gc-3", tenantId: tenants[0]!.id, levelId: "sl-1", levelName: "ECED", name: "UKG", nameNe: "यू.के.जी.", code: "UKG", sequence: 3, isActive: true },
    { id: "gc-4", tenantId: tenants[0]!.id, levelId: "sl-2", levelName: "Basic", name: "Class 1", nameNe: "कक्षा १", code: "C01", sequence: 4, isActive: true },
    { id: "gc-5", tenantId: tenants[0]!.id, levelId: "sl-2", levelName: "Basic", name: "Class 5", nameNe: "कक्षा ५", code: "C05", sequence: 8, isActive: true },
    { id: "gc-6", tenantId: tenants[0]!.id, levelId: "sl-2", levelName: "Basic", name: "Class 8", nameNe: "कक्षा ८", code: "C08", sequence: 11, isActive: true },
    { id: "gc-7", tenantId: tenants[0]!.id, levelId: "sl-3", levelName: "Secondary", name: "Class 9", nameNe: "कक्षा ९", code: "C09", sequence: 12, isActive: true },
    { id: "gc-8", tenantId: tenants[0]!.id, levelId: "sl-3", levelName: "Secondary", name: "Class 10", nameNe: "कक्षा १०", code: "C10", sequence: 13, isActive: true },
    { id: "gc-9", tenantId: tenants[0]!.id, levelId: "sl-4", levelName: "Plus2", name: "Class 11", nameNe: "कक्षा ११", code: "C11", sequence: 14, isActive: true },
    { id: "gc-10", tenantId: tenants[0]!.id, levelId: "sl-4", levelName: "Plus2", name: "Class 12", nameNe: "कक्षा १२", code: "C12", sequence: 15, isActive: true },
  ];

  const streams: DBSchema["streams"] = [
    { id: "st-1", tenantId: tenants[0]!.id, name: "Science", nameNe: "विज्ञान", code: "SCI", description: "Physics, Chemistry, Biology/Math focus", gradeClassId: "gc-9", gradeClassName: "Class 11", isActive: true },
    { id: "st-2", tenantId: tenants[0]!.id, name: "Management", nameNe: "व्यवस्थापन", code: "MGT", description: "Accountancy, Economics, Business Studies", gradeClassId: "gc-9", gradeClassName: "Class 11", isActive: true },
    { id: "st-3", tenantId: tenants[0]!.id, name: "Humanities", nameNe: "मानविकी", code: "HUM", description: "Sociology, History, Political Science", gradeClassId: "gc-9", gradeClassName: "Class 11", isActive: true },
    { id: "st-4", tenantId: tenants[0]!.id, name: "Education", nameNe: "शिक्षा", code: "EDU", description: "Pedagogy and educational foundations", gradeClassId: "gc-9", gradeClassName: "Class 11", isActive: true },
  ];

  const subjects: DBSchema["subjects"] = [
    { id: "su-1", tenantId: tenants[0]!.id, name: "Nepali", nameNe: "नेपाली", code: "NEP", description: "Nepali language and literature", type: "core", levelId: "sl-2", levelName: "Basic", isActive: true },
    { id: "su-2", tenantId: tenants[0]!.id, name: "English", nameNe: "अंग्रेजी", code: "ENG", description: "English language and literature", type: "core", levelId: "sl-2", levelName: "Basic", isActive: true },
    { id: "su-3", tenantId: tenants[0]!.id, name: "Mathematics", nameNe: "गणित", code: "MATH", description: "Mathematics and problem solving", type: "core", levelId: "sl-2", levelName: "Basic", isActive: true },
    { id: "su-4", tenantId: tenants[0]!.id, name: "Science", nameNe: "विज्ञान", code: "SCI", description: "General science", type: "core", levelId: "sl-2", levelName: "Basic", isActive: true },
    { id: "su-5", tenantId: tenants[0]!.id, name: "Social Studies", nameNe: "सामाजिक अध्ययन", code: "SST", description: "Social studies and civic education", type: "core", levelId: "sl-2", levelName: "Basic", isActive: true },
    { id: "su-6", tenantId: tenants[0]!.id, name: "Physics", nameNe: "भौतिकशास्त्र", code: "PHY", description: "Physics for +2 Science stream", type: "core", levelId: "sl-4", levelName: "Plus2", isActive: true },
    { id: "su-7", tenantId: tenants[0]!.id, name: "Accountancy", nameNe: "लेखाशास्त्र", code: "ACC", description: "Financial accounting principles", type: "core", levelId: "sl-4", levelName: "Plus2", isActive: true },
    { id: "su-8", tenantId: tenants[0]!.id, name: "Computer Science", nameNe: "कम्प्युटर विज्ञान", code: "CS", description: "Programming and computing fundamentals", type: "elective", levelId: "sl-4", levelName: "Plus2", isActive: true },
  ];

  const curriculumOfferings: DBSchema["curriculumOfferings"] = [
    { id: "co-1", tenantId: tenants[0]!.id, subjectId: "su-1", subjectName: "Nepali", gradeClassId: "gc-4", gradeClassName: "Class 1", isCompulsory: true, fullMarks: 100, passMarks: 40, creditHours: 5, isActive: true },
    { id: "co-2", tenantId: tenants[0]!.id, subjectId: "su-2", subjectName: "English", gradeClassId: "gc-4", gradeClassName: "Class 1", isCompulsory: true, fullMarks: 100, passMarks: 40, creditHours: 5, isActive: true },
    { id: "co-3", tenantId: tenants[0]!.id, subjectId: "su-3", subjectName: "Mathematics", gradeClassId: "gc-8", gradeClassName: "Class 10", isCompulsory: true, fullMarks: 100, passMarks: 40, creditHours: 6, isActive: true },
    { id: "co-4", tenantId: tenants[0]!.id, subjectId: "su-6", subjectName: "Physics", gradeClassId: "gc-9", gradeClassName: "Class 11", streamId: "st-1", streamName: "Science", isCompulsory: true, fullMarks: 100, passMarks: 40, creditHours: 6, isActive: true },
    { id: "co-5", tenantId: tenants[0]!.id, subjectId: "su-7", subjectName: "Accountancy", gradeClassId: "gc-9", gradeClassName: "Class 11", streamId: "st-2", streamName: "Management", isCompulsory: true, fullMarks: 100, passMarks: 40, creditHours: 5, isActive: true },
    { id: "co-6", tenantId: tenants[0]!.id, subjectId: "su-8", subjectName: "Computer Science", gradeClassId: "gc-9", gradeClassName: "Class 11", streamId: "st-1", streamName: "Science", isCompulsory: false, fullMarks: 100, passMarks: 40, creditHours: 4, isActive: true },
  ];

  const sections: DBSchema["sections"] = [
    { id: "sc-1", tenantId: tenants[0]!.id, name: "A", nameNe: "क", gradeClassId: "gc-4", gradeClassName: "Class 1", academicYearId: "ay-1", academicYearName: "2082 BS", capacity: 40, enrolled: 36, classTeacherId: "uid-5", classTeacherName: "Manoj Rai", roomNo: "101", isActive: true },
    { id: "sc-2", tenantId: tenants[0]!.id, name: "B", nameNe: "ख", gradeClassId: "gc-4", gradeClassName: "Class 1", academicYearId: "ay-1", academicYearName: "2082 BS", capacity: 40, enrolled: 38, classTeacherName: "Sita Adhikari", roomNo: "102", isActive: true },
    { id: "sc-3", tenantId: tenants[0]!.id, name: "A", nameNe: "क", gradeClassId: "gc-8", gradeClassName: "Class 10", academicYearId: "ay-1", academicYearName: "2082 BS", capacity: 45, enrolled: 42, classTeacherId: "uid-5", classTeacherName: "Manoj Rai", roomNo: "301", isActive: true },
    { id: "sc-4", tenantId: tenants[0]!.id, name: "Science A", nameNe: "विज्ञान क", gradeClassId: "gc-9", gradeClassName: "Class 11", academicYearId: "ay-1", academicYearName: "2082 BS", capacity: 35, enrolled: 30, classTeacherName: "Dr. Bikash Gurung", roomNo: "401", isActive: true },
  ];

  const houses: DBSchema["houses"] = [
    { id: "hs-1", tenantId: tenants[0]!.id, name: "Sagarmatha", nameNe: "सगरमाथा", code: "SAG", color: "#3B82F6", description: "Named after Mt. Everest — symbol of determination", memberCount: 380 },
    { id: "hs-2", tenantId: tenants[0]!.id, name: "Lumbini", nameNe: "लुम्बिनी", code: "LUM", color: "#10B981", description: "Birthplace of Buddha — symbol of peace and wisdom", memberCount: 365 },
    { id: "hs-3", tenantId: tenants[0]!.id, name: "Machhapuchhre", nameNe: "मछापुच्छ्रे", code: "MAC", color: "#F59E0B", description: "Fishtail mountain — symbol of beauty and resilience", memberCount: 372 },
    { id: "hs-4", tenantId: tenants[0]!.id, name: "Kanchenjunga", nameNe: "कञ्चनजङ्घा", code: "KAN", color: "#EF4444", description: "Third highest peak — symbol of strength and courage", memberCount: 351 },
  ];

  const cohorts: DBSchema["cohorts"] = [
    { id: "ch-1", tenantId: tenants[0]!.id, name: "Class 10 — Batch 2082", nameNe: "कक्षा १० — ब्याच २०८२", academicYearId: "ay-1", academicYearName: "2082 BS", gradeClassId: "gc-8", gradeClassName: "Class 10", description: "SEE appearing batch 2082", studentCount: 84 },
    { id: "ch-2", tenantId: tenants[0]!.id, name: "Class 12 Science — Batch 2082", nameNe: "कक्षा १२ विज्ञान — ब्याच २०८२", academicYearId: "ay-1", academicYearName: "2082 BS", gradeClassId: "gc-10", gradeClassName: "Class 12", description: "NEB +2 Science appearing batch", studentCount: 28 },
    { id: "ch-3", tenantId: tenants[0]!.id, name: "Class 1 — Batch 2082", nameNe: "कक्षा १ — ब्याच २०८२", academicYearId: "ay-1", academicYearName: "2082 BS", gradeClassId: "gc-4", gradeClassName: "Class 1", description: "New admission cohort", studentCount: 74 },
  ];

  const gradingScales: DBSchema["gradingScales"] = [
    {
      id: "gs-1", tenantId: tenants[0]!.id, name: "SEE Grading Scale", nameNe: "SEE ग्रेडिङ स्केल",
      description: "Nepal SEE standard grading scale (Class 10)",
      grades: [
        { letter: "A+", minMark: 90, maxMark: 100, gpa: 4.0, description: "Outstanding" },
        { letter: "A", minMark: 80, maxMark: 89, gpa: 3.6, description: "Excellent" },
        { letter: "B+", minMark: 70, maxMark: 79, gpa: 3.2, description: "Very Good" },
        { letter: "B", minMark: 60, maxMark: 69, gpa: 2.8, description: "Good" },
        { letter: "C+", minMark: 50, maxMark: 59, gpa: 2.4, description: "Above Average" },
        { letter: "C", minMark: 40, maxMark: 49, gpa: 2.0, description: "Average" },
        { letter: "D+", minMark: 30, maxMark: 39, gpa: 1.6, description: "Below Average" },
        { letter: "D", minMark: 20, maxMark: 29, gpa: 1.2, description: "Adequate" },
        { letter: "E", minMark: 0, maxMark: 19, gpa: 0.8, description: "Fail" },
      ],
      isActive: true, isDefault: true,
    },
    {
      id: "gs-2", tenantId: tenants[0]!.id, name: "Basic Education Grading", nameNe: "आधारभूत ग्रेडिङ",
      description: "Internal grading for Classes 1–8",
      grades: [
        { letter: "A", minMark: 80, maxMark: 100, gpa: 4.0, description: "Distinction" },
        { letter: "B", minMark: 60, maxMark: 79, gpa: 3.0, description: "First Division" },
        { letter: "C", minMark: 40, maxMark: 59, gpa: 2.0, description: "Second Division" },
        { letter: "D", minMark: 0, maxMark: 39, gpa: 1.0, description: "Needs Improvement" },
      ],
      isActive: true, isDefault: false,
    },
  ];

  const promotionRules: DBSchema["promotionRules"] = [
    { id: "pr-1", tenantId: tenants[0]!.id, name: "Class 1→2 Promotion", nameNe: "कक्षा १→२ उन्नति", fromGradeId: "gc-4", fromGradeName: "Class 1", toGradeId: "gc-5", toGradeName: "Class 2", minGpa: 1.0, minAttendance: 60, maxBacklogs: 0, isActive: true },
    { id: "pr-2", tenantId: tenants[0]!.id, name: "Class 8→9 Promotion", nameNe: "कक्षा ८→९ उन्नति", fromGradeId: "gc-6", fromGradeName: "Class 8", toGradeId: "gc-7", toGradeName: "Class 9", minGpa: 1.6, minAttendance: 75, maxBacklogs: 2, isActive: true },
    { id: "pr-3", tenantId: tenants[0]!.id, name: "Class 9→10 Promotion", nameNe: "कक्षा ९→१० उन्नति", fromGradeId: "gc-7", fromGradeName: "Class 9", toGradeId: "gc-8", toGradeName: "Class 10", minGpa: 2.0, minAttendance: 80, maxBacklogs: 1, isActive: true },
    { id: "pr-4", tenantId: tenants[0]!.id, name: "Class 11→12 Promotion", nameNe: "कक्षा ११→१२ उन्नति", fromGradeId: "gc-9", fromGradeName: "Class 11", toGradeId: "gc-10", toGradeName: "Class 12", minGpa: 2.0, minAttendance: 80, maxBacklogs: 1, isActive: true },
  ];

  const completionRules: DBSchema["completionRules"] = [
    { id: "cr-1", tenantId: tenants[0]!.id, name: "SEE Completion (Class 10)", nameNe: "SEE उत्तीर्ण", gradeClassId: "gc-8", gradeClassName: "Class 10", minGpa: 1.6, minCreditHours: 0, requirements: "Pass all compulsory subjects with minimum D+ grade; minimum 1.6 overall GPA", isActive: true },
    { id: "cr-2", tenantId: tenants[0]!.id, name: "NEB +2 Completion (Class 12)", nameNe: "NEB +2 उत्तीर्ण", gradeClassId: "gc-10", gradeClassName: "Class 12", minGpa: 2.0, minCreditHours: 24, requirements: "Pass all subjects; minimum 2.0 GPA; complete practical components", isActive: true },
  ];

  const academicPolicies: DBSchema["academicPolicies"] = [
    { id: "ap-1", tenantId: tenants[0]!.id, name: "Minimum Attendance Policy", nameNe: "न्यूनतम उपस्थिति नीति", category: "attendance", description: "Students must maintain minimum 75% attendance to appear in final examinations. Below 60% results in automatic detention.", effectiveFrom: "2025-04-15", status: "published", approvedBy: "Ramesh Shrestha", createdOn: "2025-03-10" },
    { id: "ap-2", tenantId: tenants[0]!.id, name: "Internal Assessment Weightage", nameNe: "आन्तरिक मूल्याङ्कन भार", category: "assessment", description: "Internal assessment contributes 25% to final marks. Includes unit tests, project work, and class participation.", effectiveFrom: "2025-04-15", status: "published", approvedBy: "Ramesh Shrestha", createdOn: "2025-03-10" },
    { id: "ap-3", tenantId: tenants[0]!.id, name: "SEE Preparation Guidelines", nameNe: "SEE तयारी दिशानिर्देश", category: "examination", description: "Mock examinations conducted monthly from Mangsir. Pre-board examination mandatory in Falgun.", effectiveFrom: "2025-04-15", status: "published", createdOn: "2025-03-15" },
    { id: "ap-4", tenantId: tenants[0]!.id, name: "Stream Selection Criteria", nameNe: "विषय छनोट मापदण्ड", category: "promotion", description: "Students must secure minimum 2.8 GPA in SEE to be eligible for Science stream. Management requires 2.4 GPA.", effectiveFrom: "2026-04-15", status: "draft", createdOn: "2026-02-01" },
  ];

  // ── M04 CRM, Enquiry and Admissions ──────────────────────────────────────

  const campaigns: DBSchema["campaigns"] = [
    { id: "cmp-1", tenantId: tenants[0]!.id, name: "SEE 2082 Admission Drive", nameNe: "SEE २०८२ भर्ना अभियान", code: "CMP-SEE-2082", channel: "web", startDate: "2025-11-01", endDate: "2026-03-31", budget: 150000, targetEnquiries: 200, actualEnquiries: 187, status: "completed", createdOn: "2025-10-15" },
    { id: "cmp-2", tenantId: tenants[0]!.id, name: "ECED Open House 2081", nameNe: "ECED खुला घर २०८१", code: "CMP-ECED-2081", channel: "walk_in", startDate: "2025-02-15", endDate: "2025-04-15", budget: 50000, targetEnquiries: 80, actualEnquiries: 92, status: "completed", createdOn: "2025-02-01" },
    { id: "cmp-3", tenantId: tenants[0]!.id, name: "Plus2 Science Fair", nameNe: "प्लस२ विज्ञान मेला", code: "CMP-P2SCI-2083", channel: "social", startDate: "2026-01-10", endDate: "2026-04-30", budget: 80000, targetEnquiries: 120, actualEnquiries: 64, status: "active", createdOn: "2026-01-05" },
  ];

  const enquiries: DBSchema["enquiries"] = [
    { id: "enq-1", tenantId: tenants[0]!.id, campaignId: "cmp-1", campaignName: "SEE 2082 Admission Drive", studentName: "Aarav Sharma", studentNameNe: "आरव शर्मा", guardianName: "Dipak Sharma", guardianPhone: "+977-9841012345", guardianEmail: "dipak.sharma@gmail.com", address: "Baneshwor-32, Kathmandu", interestedGradeId: "gc-9", interestedGradeName: "Class 11", interestedStreamId: "st-1", interestedStreamName: "Science", source: "campaign", status: "applied", assignedTo: "uid-4", assignedToName: "Suresh Thapa", notes: "SEE GPA 3.85 — strong science background", createdOn: "2025-12-15" },
    { id: "enq-2", tenantId: tenants[0]!.id, campaignId: "cmp-1", campaignName: "SEE 2082 Admission Drive", studentName: "Srijana Thapa", studentNameNe: "सृजना थापा", guardianName: "Bikash Thapa", guardianPhone: "+977-9851098765", address: "Suryabinayak-6, Bhaktapur", interestedGradeId: "gc-9", interestedGradeName: "Class 11", interestedStreamId: "st-2", interestedStreamName: "Management", source: "campaign", status: "interested", assignedTo: "uid-4", assignedToName: "Suresh Thapa", notes: "Interested in commerce stream — father runs a trading business", createdOn: "2026-01-05" },
    { id: "enq-3", tenantId: tenants[0]!.id, campaignId: "cmp-2", campaignName: "ECED Open House 2081", studentName: "Anisha Maharjan", studentNameNe: "अनिशा महर्जन", guardianName: "Roshan Maharjan", guardianPhone: "+977-9841056789", guardianEmail: "roshan.maharjan@outlook.com", address: "Patan-14, Lalitpur", interestedGradeId: "gc-1", interestedGradeName: "Nursery", source: "walk_in", status: "converted", assignedTo: "uid-4", assignedToName: "Suresh Thapa", notes: "Visited during Open House — parents liked Montessori approach", createdOn: "2025-03-10" },
    { id: "enq-4", tenantId: tenants[0]!.id, studentName: "Kiran Bhandari", studentNameNe: "किरण भण्डारी", guardianName: "Prakash Bhandari", guardianPhone: "+977-9812345678", address: "Koteshwor-35, Kathmandu", interestedGradeId: "gc-4", interestedGradeName: "Class 1", source: "referral", status: "visit_scheduled", assignedToName: "Suresh Thapa", notes: "Referred by existing parent — wants English medium", createdOn: "2026-08-20" },
    { id: "enq-5", tenantId: tenants[0]!.id, campaignId: "cmp-3", campaignName: "Plus2 Science Fair", studentName: "Suman Gurung", studentNameNe: "सुमन गुरुङ", guardianName: "Dil Bahadur Gurung", guardianPhone: "+977-9861078901", guardianEmail: "dilbahadur.g@yahoo.com", address: "Pokhara-8, Kaski", interestedGradeId: "gc-9", interestedGradeName: "Class 11", interestedStreamId: "st-1", interestedStreamName: "Science", source: "campaign", status: "new", notes: "Enquired via Science Fair website form — SEE GPA 3.6", createdOn: "2026-08-28" },
  ];

  const enquiryInteractions: DBSchema["enquiryInteractions"] = [
    { id: "int-1", tenantId: tenants[0]!.id, enquiryId: "enq-1", enquiryName: "Aarav Sharma", type: "call", occurredAt: "2025-12-20T10:30:00", performedBy: "uid-4", performedByName: "Suresh Thapa", notes: "Called guardian — confirmed interest in Science stream. Father asked about scholarship.", nextAction: "Schedule campus tour", nextFollowUp: "2025-12-27", outcome: "Positive — wants to visit" },
    { id: "int-2", tenantId: tenants[0]!.id, enquiryId: "enq-1", enquiryName: "Aarav Sharma", type: "campus_tour", occurredAt: "2025-12-28T14:00:00", performedBy: "uid-4", performedByName: "Suresh Thapa", notes: "Family visited Baneshwor campus. Showed physics lab and computer lab. Very impressed.", nextAction: "Collect application form", outcome: "Will apply" },
    { id: "int-3", tenantId: tenants[0]!.id, enquiryId: "enq-2", enquiryName: "Srijana Thapa", type: "call", occurredAt: "2026-01-10T11:00:00", performedBy: "uid-4", performedByName: "Suresh Thapa", notes: "Spoke with father — interested in Management stream. Asked about +2 fee structure.", nextAction: "Send fee details via WhatsApp", nextFollowUp: "2026-01-15" },
    { id: "int-4", tenantId: tenants[0]!.id, enquiryId: "enq-4", enquiryName: "Kiran Bhandari", type: "visit", occurredAt: "2026-08-25T09:30:00", performedBy: "uid-4", performedByName: "Suresh Thapa", notes: "Parent and child visited primary section. Child interacted well with nursery teacher.", nextAction: "Submit Class 1 application", nextFollowUp: "2026-09-01", outcome: "Likely to apply" },
  ];

  const applications: DBSchema["applications"] = [
    { id: "app-1", tenantId: tenants[0]!.id, applicationNo: "ADM-2083-0418", enquiryId: "enq-3", studentName: "Anisha Maharjan", studentNameNe: "अनिशा महर्जन", dateOfBirth: "2022-03-15", dateOfBirthBs: "२०७८ चैत २", gender: "female", guardianName: "Roshan Maharjan", guardianPhone: "+977-9841056789", guardianEmail: "roshan.maharjan@outlook.com", address: "Patan-14, Lalitpur", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", appliedGradeId: "gc-1", appliedGradeName: "Nursery", status: "admitted", submittedOn: "2025-03-20", reviewedBy: "Ramesh Shrestha", reviewedOn: "2025-04-01", createdOn: "2025-03-15" },
    { id: "app-2", tenantId: tenants[0]!.id, applicationNo: "ADM-2083-0419", enquiryId: "enq-1", studentName: "Aarav Sharma", studentNameNe: "आरव शर्मा", dateOfBirth: "2010-08-22", dateOfBirthBs: "२०६७ भदौ ६", gender: "male", guardianName: "Dipak Sharma", guardianPhone: "+977-9841012345", guardianEmail: "dipak.sharma@gmail.com", address: "Baneshwor-32, Kathmandu", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", appliedGradeId: "gc-9", appliedGradeName: "Class 11", appliedStreamId: "st-1", appliedStreamName: "Science", previousSchool: "Shree Saraswati Secondary School", previousGrade: "Class 10 (SEE)", status: "eligible", submittedOn: "2026-01-05", reviewedBy: "Suresh Thapa", reviewedOn: "2026-01-10", createdOn: "2026-01-02" },
    { id: "app-3", tenantId: tenants[0]!.id, applicationNo: "ADM-2083-0420", studentName: "Kiran Bhandari", studentNameNe: "किरण भण्डारी", dateOfBirth: "2020-11-05", dateOfBirthBs: "२०७७ कात्तिक २०", gender: "male", guardianName: "Prakash Bhandari", guardianPhone: "+977-9812345678", address: "Koteshwor-35, Kathmandu", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", appliedGradeId: "gc-4", appliedGradeName: "Class 1", status: "submitted", submittedOn: "2026-09-01", createdOn: "2026-08-28" },
    { id: "app-4", tenantId: tenants[0]!.id, applicationNo: "ADM-2083-0421", studentName: "Srijana Thapa", studentNameNe: "सृजना थापा", dateOfBirth: "2010-05-18", dateOfBirthBs: "२०६७ जेठ ४", gender: "female", guardianName: "Bikash Thapa", guardianPhone: "+977-9851098765", address: "Suryabinayak-6, Bhaktapur", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", appliedGradeId: "gc-9", appliedGradeName: "Class 11", appliedStreamId: "st-2", appliedStreamName: "Management", previousSchool: "Bhaktapur Secondary School", previousGrade: "Class 10 (SEE)", status: "under_review", submittedOn: "2026-02-10", createdOn: "2026-02-05" },
  ];

  const applicationChoices: DBSchema["applicationChoices"] = [
    { id: "ach-1", tenantId: tenants[0]!.id, applicationId: "app-1", offeringRef: "co-1", offeringName: "Nursery — Section A", preference: 1 },
    { id: "ach-2", tenantId: tenants[0]!.id, applicationId: "app-2", offeringRef: "co-4", offeringName: "Class 11 Science — Physics", preference: 1 },
    { id: "ach-3", tenantId: tenants[0]!.id, applicationId: "app-2", offeringRef: "co-6", offeringName: "Class 11 Science — Computer Science", preference: 2 },
    { id: "ach-4", tenantId: tenants[0]!.id, applicationId: "app-3", offeringRef: "co-1", offeringName: "Class 1 — Section A", preference: 1 },
    { id: "ach-5", tenantId: tenants[0]!.id, applicationId: "app-3", offeringRef: "co-2", offeringName: "Class 1 — Section B", preference: 2 },
    { id: "ach-6", tenantId: tenants[0]!.id, applicationId: "app-4", offeringRef: "co-5", offeringName: "Class 11 Management — Accountancy", preference: 1 },
  ];

  const applicationDocuments: DBSchema["applicationDocuments"] = [
    { id: "adoc-1", tenantId: tenants[0]!.id, applicationId: "app-1", documentType: "birth_certificate", documentName: "Birth Certificate (Nagarikta Pramanpatra)", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2025-03-22" },
    { id: "adoc-2", tenantId: tenants[0]!.id, applicationId: "app-1", documentType: "photograph", documentName: "Passport-size Photo (35×45mm)", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2025-03-22" },
    { id: "adoc-3", tenantId: tenants[0]!.id, applicationId: "app-1", documentType: "guardian_citizenship", documentName: "Guardian Citizenship Copy", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2025-03-22" },
    { id: "adoc-4", tenantId: tenants[0]!.id, applicationId: "app-2", documentType: "see_transcript", documentName: "SEE Grade Sheet 2082", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2026-01-08", remarks: "GPA 3.85 — verified against OCEC records" },
    { id: "adoc-5", tenantId: tenants[0]!.id, applicationId: "app-2", documentType: "see_character", documentName: "SEE Character Certificate", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2026-01-08" },
    { id: "adoc-6", tenantId: tenants[0]!.id, applicationId: "app-2", documentType: "photograph", documentName: "Passport-size Photo (35×45mm)", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2026-01-08" },
    { id: "adoc-7", tenantId: tenants[0]!.id, applicationId: "app-2", documentType: "citizenship", documentName: "Student Citizenship Copy", status: "missing", remarks: "Student below 16 — not required" },
    { id: "adoc-8", tenantId: tenants[0]!.id, applicationId: "app-3", documentType: "birth_certificate", documentName: "Birth Certificate (Nagarikta Pramanpatra)", status: "received" },
    { id: "adoc-9", tenantId: tenants[0]!.id, applicationId: "app-3", documentType: "photograph", documentName: "Passport-size Photo (35×45mm)", status: "received" },
    { id: "adoc-10", tenantId: tenants[0]!.id, applicationId: "app-3", documentType: "guardian_citizenship", documentName: "Guardian Citizenship Copy", status: "missing" },
    { id: "adoc-11", tenantId: tenants[0]!.id, applicationId: "app-4", documentType: "see_transcript", documentName: "SEE Grade Sheet 2082", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2026-02-12", remarks: "GPA 3.2 — meets Management stream criteria" },
    { id: "adoc-12", tenantId: tenants[0]!.id, applicationId: "app-4", documentType: "see_character", documentName: "SEE Character Certificate", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2026-02-12" },
    { id: "adoc-13", tenantId: tenants[0]!.id, applicationId: "app-4", documentType: "photograph", documentName: "Passport-size Photo (35×45mm)", status: "verified", verifiedBy: "Suresh Thapa", verifiedOn: "2026-02-12" },
  ];

  const eligibilityDecisions: DBSchema["eligibilityDecisions"] = [
    { id: "ed-1", tenantId: tenants[0]!.id, applicationId: "app-1", applicationName: "Anisha Maharjan", ruleName: "Age Eligibility — Nursery (3–4 years)", outcome: "eligible", reason: "Applicant age 3 years 0 months at admission date — within 3–4 year range", decidedBy: "Suresh Thapa", decidedOn: "2025-03-25" },
    { id: "ed-2", tenantId: tenants[0]!.id, applicationId: "app-2", applicationName: "Aarav Sharma", ruleName: "SEE GPA — Science Stream (≥2.8)", outcome: "eligible", reason: "SEE GPA 3.85 exceeds minimum 2.8 requirement for Science stream", decidedBy: "Suresh Thapa", decidedOn: "2026-01-10" },
    { id: "ed-3", tenantId: tenants[0]!.id, applicationId: "app-4", applicationName: "Srijana Thapa", ruleName: "SEE GPA — Management Stream (≥2.4)", outcome: "eligible", reason: "SEE GPA 3.2 exceeds minimum 2.4 requirement for Management stream", decidedBy: "Suresh Thapa", decidedOn: "2026-02-12" },
  ];

  const selectionEvents: DBSchema["selectionEvents"] = [
    { id: "se-1", tenantId: tenants[0]!.id, applicationId: "app-1", applicationName: "Anisha Maharjan", type: "interview", scheduledDate: "2025-03-28", scheduledTime: "10:00", venue: "Room 101 — Primary Block", panelMembers: "Kabita Gurung, Anita Maharjan", status: "completed", createdOn: "2025-03-25" },
    { id: "se-2", tenantId: tenants[0]!.id, applicationId: "app-2", applicationName: "Aarav Sharma", type: "entrance_test", scheduledDate: "2026-01-15", scheduledTime: "09:00", venue: "Room 301 — Secondary Block", panelMembers: "Dr. Bikash Gurung, Nabin Joshi", status: "completed", createdOn: "2026-01-10" },
    { id: "se-3", tenantId: tenants[0]!.id, applicationId: "app-4", applicationName: "Srijana Thapa", type: "both", scheduledDate: "2026-02-18", scheduledTime: "10:30", venue: "Room 401 — Plus2 Block", panelMembers: "Puja Shrestha, Deepak Adhikari", status: "scheduled", createdOn: "2026-02-12" },
  ];

  const selectionScores: DBSchema["selectionScores"] = [
    { id: "ss-1", tenantId: tenants[0]!.id, selectionEventId: "se-1", criterion: "Communication Skills", maxScore: 25, score: 22, evaluatedBy: "Kabita Gurung" },
    { id: "ss-2", tenantId: tenants[0]!.id, selectionEventId: "se-1", criterion: "Readiness & Social Skills", maxScore: 25, score: 20, evaluatedBy: "Anita Maharjan" },
    { id: "ss-3", tenantId: tenants[0]!.id, selectionEventId: "se-1", criterion: "Motor Skills", maxScore: 25, score: 21, evaluatedBy: "Kabita Gurung" },
    { id: "ss-4", tenantId: tenants[0]!.id, selectionEventId: "se-1", criterion: "Parent Engagement", maxScore: 25, score: 24, remarks: "Parents very supportive and involved", evaluatedBy: "Anita Maharjan" },
    { id: "ss-5", tenantId: tenants[0]!.id, selectionEventId: "se-2", criterion: "Mathematics", maxScore: 40, score: 36, evaluatedBy: "Dr. Bikash Gurung" },
    { id: "ss-6", tenantId: tenants[0]!.id, selectionEventId: "se-2", criterion: "Science", maxScore: 40, score: 38, evaluatedBy: "Dr. Bikash Gurung" },
    { id: "ss-7", tenantId: tenants[0]!.id, selectionEventId: "se-2", criterion: "English", maxScore: 30, score: 25, evaluatedBy: "Nabin Joshi" },
    { id: "ss-8", tenantId: tenants[0]!.id, selectionEventId: "se-2", criterion: "General Knowledge", maxScore: 20, score: 17, evaluatedBy: "Nabin Joshi" },
  ];

  const offers: DBSchema["offers"] = [
    { id: "ofr-1", tenantId: tenants[0]!.id, applicationId: "app-1", applicationName: "Anisha Maharjan", offerType: "unconditional", offeredGradeId: "gc-1", offeredGradeName: "Nursery", validUntil: "2025-04-30", status: "accepted", issuedOn: "2025-04-01", issuedBy: "Ramesh Shrestha" },
    { id: "ofr-2", tenantId: tenants[0]!.id, applicationId: "app-2", applicationName: "Aarav Sharma", offerType: "conditional", offeredGradeId: "gc-9", offeredGradeName: "Class 11", offeredStreamId: "st-1", offeredStreamName: "Science", conditions: "Must submit original SEE transcript and character certificate before Baisakh 15", validUntil: "2026-04-30", status: "offered", issuedOn: "2026-01-20", issuedBy: "Suresh Thapa" },
    { id: "ofr-3", tenantId: tenants[0]!.id, applicationId: "app-4", applicationName: "Srijana Thapa", offerType: "waitlist", offeredGradeId: "gc-9", offeredGradeName: "Class 11", offeredStreamId: "st-2", offeredStreamName: "Management", conditions: "Subject to seat availability after first-round admissions close", validUntil: "2026-05-15", status: "waitlisted", issuedOn: "2026-02-25", issuedBy: "Suresh Thapa" },
  ];

  const offerAcceptances: DBSchema["offerAcceptances"] = [
    { id: "oa-1", tenantId: tenants[0]!.id, offerId: "ofr-1", offerName: "Anisha Maharjan — Nursery", acceptedOn: "2025-04-10", acceptedBy: "Roshan Maharjan", depositPaid: true, depositAmount: 15000, remarks: "Admission fee paid via eSewa" },
    { id: "oa-2", tenantId: tenants[0]!.id, offerId: "ofr-2", offerName: "Aarav Sharma — Class 11 Science", acceptedOn: "2026-02-05", acceptedBy: "Dipak Sharma", depositPaid: true, depositAmount: 25000, remarks: "Deposit paid — awaiting original documents" },
  ];

  const conversionCases: DBSchema["conversionCases"] = [
    { id: "cvn-1", tenantId: tenants[0]!.id, acceptanceId: "oa-1", acceptanceName: "Anisha Maharjan — Nursery", applicationId: "app-1", studentName: "Anisha Maharjan", state: "completed", admissionNo: "STU-2082-1201", startedOn: "2025-04-10", completedOn: "2025-04-15", createdOn: "2025-04-10" },
    { id: "cvn-2", tenantId: tenants[0]!.id, acceptanceId: "oa-2", acceptanceName: "Aarav Sharma — Class 11 Science", applicationId: "app-2", studentName: "Aarav Sharma", state: "in_progress", startedOn: "2026-02-05", createdOn: "2026-02-05" },
  ];

  const conversionSteps: DBSchema["conversionSteps"] = [
    { id: "cvs-1", tenantId: tenants[0]!.id, conversionId: "cvn-1", stepCode: "student_record", stepName: "Create Student Record", status: "completed", startedOn: "2025-04-10", completedOn: "2025-04-11", retryCount: 0 },
    { id: "cvs-2", tenantId: tenants[0]!.id, conversionId: "cvn-1", stepCode: "fee_plan", stepName: "Assign Fee Plan", status: "completed", startedOn: "2025-04-11", completedOn: "2025-04-12", retryCount: 0 },
    { id: "cvs-3", tenantId: tenants[0]!.id, conversionId: "cvn-1", stepCode: "id_card", stepName: "Issue ID Card", status: "completed", startedOn: "2025-04-13", completedOn: "2025-04-14", retryCount: 0 },
    { id: "cvs-4", tenantId: tenants[0]!.id, conversionId: "cvn-1", stepCode: "orientation", stepName: "Orientation & Welcome Kit", status: "completed", startedOn: "2025-04-14", completedOn: "2025-04-15", retryCount: 0 },
    { id: "cvs-5", tenantId: tenants[0]!.id, conversionId: "cvn-2", stepCode: "student_record", stepName: "Create Student Record", status: "completed", startedOn: "2026-02-05", completedOn: "2026-02-06", retryCount: 0 },
    { id: "cvs-6", tenantId: tenants[0]!.id, conversionId: "cvn-2", stepCode: "fee_plan", stepName: "Assign Fee Plan", status: "completed", startedOn: "2026-02-06", completedOn: "2026-02-07", retryCount: 0 },
    { id: "cvs-7", tenantId: tenants[0]!.id, conversionId: "cvn-2", stepCode: "id_card", stepName: "Issue ID Card", status: "running", startedOn: "2026-02-08", retryCount: 0 },
    { id: "cvs-8", tenantId: tenants[0]!.id, conversionId: "cvn-2", stepCode: "orientation", stepName: "Orientation & Welcome Kit", status: "pending", retryCount: 0 },
  ];

  // ── M05 Student Information and Lifecycle ────────────────────────────────

  const persons: DBSchema["persons"] = [
    { id: "per-1", tenantId: tenants[0]!.id, legalName: "Ram Bahadur Shrestha", officialName: "Ram Bahadur Shrestha", officialNameNe: "रम बहादुर श्रेष्ठ", preferredName: "Ram", dateOfBirth: "2012-03-15", dateOfBirthBs: "2068-12-02", gender: "male", nationality: "Nepali", dedupeKey: "ram-shrestha-20120315", createdOn: "2025-04-10" },
    { id: "per-2", tenantId: tenants[0]!.id, legalName: "Sita Kumari Thapa", officialName: "Sita Kumari Thapa", officialNameNe: "सिता कुमारी थापा", preferredName: "Sita", dateOfBirth: "2011-07-22", dateOfBirthBs: "2068-04-07", gender: "female", nationality: "Nepali", dedupeKey: "sita-thapa-20110722", createdOn: "2025-04-10" },
    { id: "per-3", tenantId: tenants[0]!.id, legalName: "Bikash Gurung", officialName: "Bikash Gurung", officialNameNe: "बिकाश गुरुङ", dateOfBirth: "2010-11-05", dateOfBirthBs: "2067-07-19", gender: "male", nationality: "Nepali", dedupeKey: "bikash-gurung-20101105", createdOn: "2025-04-12" },
    { id: "per-4", tenantId: tenants[0]!.id, legalName: "Anisha Maharjan", officialName: "Anisha Maharjan", officialNameNe: "अनिशा महर्जन", preferredName: "Anisha", dateOfBirth: "2020-01-10", dateOfBirthBs: "2076-09-26", gender: "female", nationality: "Nepali", dedupeKey: "anisha-maharjan-20200110", createdOn: "2025-03-15" },
    { id: "per-5", tenantId: tenants[0]!.id, legalName: "Kiran Bhandari", officialName: "Kiran Bhandari", officialNameNe: "किरण भण्डारी", dateOfBirth: "2019-06-18", dateOfBirthBs: "2076-03-04", gender: "male", nationality: "Nepali", dedupeKey: "kiran-bhandari-20190618", createdOn: "2026-08-22" },
  ];

  const students: DBSchema["students"] = [
    { id: "stu-1", tenantId: tenants[0]!.id, personId: "per-1", personName: "Ram Bahadur Shrestha", admissionNo: "ADM-2081-001", admissionNumber: "ADM-2081-001", iemisId: "IEMIS-001-2081", status: "active", admittedOn: "2025-04-15", currentGradeId: "gc-4", currentGradeName: "Class 1", currentSectionId: "sc-1", currentSectionName: "A", createdOn: "2025-04-15" },
    { id: "stu-2", tenantId: tenants[0]!.id, personId: "per-2", personName: "Sita Kumari Thapa", admissionNo: "ADM-2081-002", admissionNumber: "ADM-2081-002", iemisId: "IEMIS-002-2081", status: "active", admittedOn: "2025-04-15", currentGradeId: "gc-9", currentGradeName: "Class 11", currentSectionId: "sc-4", currentSectionName: "Science A", createdOn: "2025-04-15" },
    { id: "stu-3", tenantId: tenants[0]!.id, personId: "per-3", personName: "Bikash Gurung", admissionNo: "ADM-2080-015", admissionNumber: "ADM-2080-015", iemisId: "IEMIS-015-2080", status: "active", admittedOn: "2024-04-16", currentGradeId: "gc-8", currentGradeName: "Class 10", currentSectionId: "sc-3", currentSectionName: "A", createdOn: "2024-04-16" },
    { id: "stu-4", tenantId: tenants[0]!.id, personId: "per-4", personName: "Anisha Maharjan", admissionNo: "ADM-2081-003", admissionNumber: "ADM-2081-003", status: "active", admittedOn: "2025-04-15", currentGradeId: "gc-1", currentGradeName: "Nursery", createdOn: "2025-04-15" },
    { id: "stu-5", tenantId: tenants[0]!.id, personId: "per-5", personName: "Kiran Bhandari", admissionNo: "ADM-2083-001", admissionNumber: "ADM-2083-001", status: "active", admittedOn: "2026-09-01", currentGradeId: "gc-4", currentGradeName: "Class 1", createdOn: "2026-09-01" },
  ];

  const guardians: DBSchema["guardians"] = [
    { id: "grd-1", tenantId: tenants[0]!.id, personId: "per-g1", personName: "Hari Prasad Shrestha", name: "Hari Prasad Shrestha", phone: "+977-9841001001", email: "hari.shrestha@gmail.com", occupation: "Government Officer", relationToStudent: "Father", createdOn: "2025-04-10" },
    { id: "grd-2", tenantId: tenants[0]!.id, personId: "per-g2", personName: "Kamala Thapa", name: "Kamala Thapa", phone: "+977-9851002002", occupation: "Teacher", relationToStudent: "Mother", createdOn: "2025-04-10" },
    { id: "grd-3", tenantId: tenants[0]!.id, personId: "per-g3", personName: "Dil Bahadur Gurung", name: "Dil Bahadur Gurung", phone: "+977-9861003003", email: "dilbahadur.g@yahoo.com", occupation: "Businessman", relationToStudent: "Father", createdOn: "2025-04-12" },
    { id: "grd-4", tenantId: tenants[0]!.id, personId: "per-g4", personName: "Roshan Maharjan", name: "Roshan Maharjan", phone: "+977-9841004004", email: "roshan.maharjan@outlook.com", occupation: "Engineer", relationToStudent: "Father", createdOn: "2025-03-15" },
  ];

  const studentGuardians: DBSchema["studentGuardians"] = [
    { id: "sg-1", tenantId: tenants[0]!.id, studentId: "stu-1", studentName: "Ram Bahadur Shrestha", guardianId: "grd-1", guardianName: "Hari Prasad Shrestha", type: "parent", isPrimary: true, validFrom: "2025-04-10" },
    { id: "sg-2", tenantId: tenants[0]!.id, studentId: "stu-2", studentName: "Sita Kumari Thapa", guardianId: "grd-2", guardianName: "Kamala Thapa", type: "parent", isPrimary: true, validFrom: "2025-04-10" },
    { id: "sg-3", tenantId: tenants[0]!.id, studentId: "stu-3", studentName: "Bikash Gurung", guardianId: "grd-3", guardianName: "Dil Bahadur Gurung", type: "parent", isPrimary: true, validFrom: "2025-04-12" },
    { id: "sg-4", tenantId: tenants[0]!.id, studentId: "stu-4", studentName: "Anisha Maharjan", guardianId: "grd-4", guardianName: "Roshan Maharjan", type: "parent", isPrimary: true, validFrom: "2025-03-15" },
    { id: "sg-5", tenantId: tenants[0]!.id, studentId: "stu-5", studentName: "Kiran Bhandari", guardianId: "grd-1", guardianName: "Hari Prasad Shrestha", type: "guardian", isPrimary: true, validFrom: "2026-08-22" },
  ];

  const studentDocuments: DBSchema["studentDocuments"] = [
    { id: "sd-1", tenantId: tenants[0]!.id, studentId: "stu-1", studentName: "Ram Bahadur Shrestha", type: "birth_certificate", documentName: "Birth Certificate — Ram Bahadur Shrestha", verifiedBy: "Suresh Thapa", verifiedOn: "2025-04-12", status: "verified", createdOn: "2025-04-10" },
    { id: "sd-2", tenantId: tenants[0]!.id, studentId: "stu-2", studentName: "Sita Kumari Thapa", type: "photo", documentName: "Passport Photo — Sita Kumari Thapa", status: "pending", createdOn: "2025-04-10" },
    { id: "sd-3", tenantId: tenants[0]!.id, studentId: "stu-3", studentName: "Bikash Gurung", type: "transcript", documentName: "SEE Transcript — Bikash Gurung", verifiedBy: "Suresh Thapa", verifiedOn: "2025-05-20", status: "verified", createdOn: "2025-05-15" },
    { id: "sd-4", tenantId: tenants[0]!.id, studentId: "stu-4", studentName: "Anisha Maharjan", type: "birth_certificate", documentName: "Birth Certificate — Anisha Maharjan", verifiedBy: "Suresh Thapa", verifiedOn: "2025-03-20", status: "verified", createdOn: "2025-03-15" },
  ];

  const enrolments: DBSchema["enrolments"] = [
    { id: "enr-1", tenantId: tenants[0]!.id, studentId: "stu-1", studentName: "Ram Bahadur Shrestha", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", gradeId: "gc-4", gradeName: "Class 1", sectionId: "sc-1", sectionName: "A", rollNumber: "101", status: "enrolled", effectiveFrom: "2025-04-15", createdOn: "2025-04-15" },
    { id: "enr-2", tenantId: tenants[0]!.id, studentId: "stu-2", studentName: "Sita Kumari Thapa", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", gradeId: "gc-9", gradeName: "Class 11", sectionId: "sc-4", sectionName: "Science A", streamId: "st-1", streamName: "Science", rollNumber: "1101", status: "enrolled", effectiveFrom: "2025-04-15", createdOn: "2025-04-15" },
    { id: "enr-3", tenantId: tenants[0]!.id, studentId: "stu-3", studentName: "Bikash Gurung", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", gradeId: "gc-8", gradeName: "Class 10", sectionId: "sc-3", sectionName: "A", rollNumber: "1001", status: "enrolled", effectiveFrom: "2025-04-15", createdOn: "2025-04-15" },
    { id: "enr-4", tenantId: tenants[0]!.id, studentId: "stu-4", studentName: "Anisha Maharjan", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", gradeId: "gc-1", gradeName: "Nursery", rollNumber: "N01", status: "enrolled", effectiveFrom: "2025-04-15", createdOn: "2025-04-15" },
    { id: "enr-5", tenantId: tenants[0]!.id, studentId: "stu-5", studentName: "Kiran Bhandari", academicYearId: "ay-1", academicYearName: "2082 BS (2025/2026)", gradeId: "gc-4", gradeName: "Class 1", rollNumber: "138", status: "enrolled", effectiveFrom: "2026-09-01", createdOn: "2026-09-01" },
  ];

  const subjectSelections: DBSchema["subjectSelections"] = [
    { id: "ss-1", tenantId: tenants[0]!.id, enrolmentId: "enr-2", studentName: "Sita Kumari Thapa", subjectOfferingRef: "co-4", subjectName: "Physics", isCompulsory: true, status: "selected", createdOn: "2025-04-20" },
    { id: "ss-2", tenantId: tenants[0]!.id, enrolmentId: "enr-2", studentName: "Sita Kumari Thapa", subjectOfferingRef: "co-6", subjectName: "Computer Science", isCompulsory: false, status: "selected", createdOn: "2025-04-20" },
    { id: "ss-3", tenantId: tenants[0]!.id, enrolmentId: "enr-1", studentName: "Ram Bahadur Shrestha", subjectOfferingRef: "co-1", subjectName: "Nepali", isCompulsory: true, status: "selected", createdOn: "2025-04-15" },
    { id: "ss-4", tenantId: tenants[0]!.id, enrolmentId: "enr-1", studentName: "Ram Bahadur Shrestha", subjectOfferingRef: "co-2", subjectName: "English", isCompulsory: true, status: "selected", createdOn: "2025-04-15" },
  ];

  const studentMovements: DBSchema["studentMovements"] = [
    { id: "sm-1", tenantId: tenants[0]!.id, enrolmentId: "enr-3", studentName: "Bikash Gurung", type: "promotion", fromGradeName: "Class 9", toGradeName: "Class 10", effectiveDate: "2025-04-15", reason: "Promoted based on annual examination results — GPA 3.2", approvedBy: "Ramesh Shrestha", createdOn: "2025-04-15" },
    { id: "sm-2", tenantId: tenants[0]!.id, enrolmentId: "enr-5", studentName: "Kiran Bhandari", type: "transfer_in", toGradeName: "Class 1", effectiveDate: "2026-09-01", reason: "Transferred from Little Angels Secondary School", createdOn: "2026-09-01" },
    { id: "sm-3", tenantId: tenants[0]!.id, enrolmentId: "enr-1", studentName: "Ram Bahadur Shrestha", type: "promotion", fromGradeName: "Nursery", toGradeName: "Class 1", effectiveDate: "2025-04-15", reason: "Completed ECED and promoted to Basic Education", approvedBy: "Ramesh Shrestha", createdOn: "2025-04-15" },
  ];

  const progressionAudits: DBSchema["progressionAudits"] = [
    { id: "pa-1", tenantId: tenants[0]!.id, enrolmentId: "enr-3", studentName: "Bikash Gurung", gradeName: "Class 9", academicYearName: "2081 BS (2024/2025)", ruleVersion: "PR-v2081", outcome: "promoted", gpa: 3.2, attendance: 88, backlogs: 0, remarks: "Strong performance across all subjects", decidedBy: "Ramesh Shrestha", decidedOn: "2025-03-25" },
    { id: "pa-2", tenantId: tenants[0]!.id, enrolmentId: "enr-2", studentName: "Sita Kumari Thapa", gradeName: "Class 10", academicYearName: "2081 BS (2024/2025)", ruleVersion: "PR-v2081", outcome: "promoted", gpa: 3.6, attendance: 92, backlogs: 0, remarks: "SEE GPA 3.6 — eligible for Science stream", decidedBy: "Ramesh Shrestha", decidedOn: "2025-03-28" },
  ];

  const studentHolds: DBSchema["studentHolds"] = [
    { id: "sh-1", tenantId: tenants[0]!.id, studentId: "stu-3", studentName: "Bikash Gurung", holdType: "financial", ownerModule: "M12 Fees & Finance", reason: "Outstanding tuition fee for Bhadra–Mangsir 2082 — NPR 12,000 pending", placedBy: "Finance Office", placedOn: "2025-12-15", status: "active" },
    { id: "sh-2", tenantId: tenants[0]!.id, studentId: "stu-1", studentName: "Ram Bahadur Shrestha", holdType: "library", ownerModule: "M16 Library", reason: "Overdue library books — 2 books not returned since Kartik 2082", placedBy: "Library", placedOn: "2026-01-10", releasedBy: "Library", releasedOn: "2026-01-20", status: "released" },
  ];

  const clearanceCases: DBSchema["clearanceCases"] = [
    { id: "cc-1", tenantId: tenants[0]!.id, studentId: "stu-2", studentName: "Sita Kumari Thapa", purpose: "transfer", status: "in_progress", initiatedBy: "Suresh Thapa", initiatedOn: "2026-08-25", createdOn: "2026-08-25" },
  ];

  const clearanceResponses: DBSchema["clearanceResponses"] = [
    { id: "cr-1", tenantId: tenants[0]!.id, clearanceId: "cc-1", moduleCode: "M12", moduleName: "Fees & Finance", decision: "cleared", respondedBy: "Finance Office", respondedOn: "2026-08-26", remarks: "All dues cleared" },
    { id: "cr-2", tenantId: tenants[0]!.id, clearanceId: "cc-1", moduleCode: "M16", moduleName: "Library", decision: "cleared", respondedBy: "Library", respondedOn: "2026-08-27", remarks: "All books returned" },
    { id: "cr-3", tenantId: tenants[0]!.id, clearanceId: "cc-1", moduleCode: "M17", moduleName: "Transport", decision: "not_applicable", respondedBy: "Transport Office", respondedOn: "2026-08-27", remarks: "Student not using school transport" },
  ];

  const identityCards: DBSchema["identityCards"] = [
    { id: "idc-1", tenantId: tenants[0]!.id, studentId: "stu-1", studentName: "Ram Bahadur Shrestha", cardType: "student_id", serial: "SID-2082-001", issuedOn: "2025-05-01", validUntil: "2026-04-14", status: "active", createdOn: "2025-05-01" },
    { id: "idc-2", tenantId: tenants[0]!.id, studentId: "stu-2", studentName: "Sita Kumari Thapa", cardType: "library", serial: "LIB-2082-015", issuedOn: "2025-05-05", validUntil: "2026-04-14", status: "active", createdOn: "2025-05-05" },
    { id: "idc-3", tenantId: tenants[0]!.id, studentId: "stu-3", studentName: "Bikash Gurung", cardType: "rfid", serial: "RFID-2082-042", issuedOn: "2025-05-10", validUntil: "2026-04-14", status: "active", createdOn: "2025-05-10" },
  ];

  // ── M06 Curriculum, Teaching and Quality ──────────────────────────────────

  const curriculumMaps: DBSchema["curriculumMaps"] = [
    { id: "cm-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, offeringRef: "co-4", version: 1, status: "published", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "cm-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, offeringRef: "co-1", version: 1, status: "published", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const learningOutcomes: DBSchema["learningOutcomes"] = [
    { id: "lo-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, curriculumMapId: "cm-1", code: "LO-PHY-01", description: "Understand Newton's laws of motion", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "lo-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, curriculumMapId: "cm-1", code: "LO-PHY-02", description: "Apply conservation of energy principles", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "lo-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, curriculumMapId: "cm-2", code: "LO-NEP-01", description: "Read and comprehend Nepali prose and poetry", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const syllabusPlans: DBSchema["syllabusPlans"] = [
    { id: "sp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, offeringRef: "co-4", academicPeriodRef: "ay-1", name: "Physics — Class 11 Science", status: "published", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "sp-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, offeringRef: "co-1", academicPeriodRef: "ay-1", name: "Nepali — Class 1", status: "published", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const contentPlanItems: DBSchema["contentPlanItems"] = [
    { id: "cpi-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, syllabusPlanId: "sp-1", sequence: "1", topic: "Introduction to Mechanics", resources: "Textbook, Lab kit", assessmentMethod: "Unit Test", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "cpi-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, syllabusPlanId: "sp-1", sequence: "2", topic: "Work, Energy and Power", resources: "Simulation, Worksheets", assessmentMethod: "Practical", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "cpi-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, syllabusPlanId: "sp-2", sequence: "1", topic: "स्वर व्यंजन और बार्नमाला", resources: "Story cards, Flash cards", assessmentMethod: "Oral", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const teachingAssignments: DBSchema["teachingAssignments"] = [
    { id: "ta-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", sectionRef: "sc-3", sectionName: "Class 10 A", offeringRef: "co-3", subjectName: "Mathematics", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "ta-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", sectionRef: "sc-4", sectionName: "Science A", offeringRef: "co-4", subjectName: "Physics", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const lessonPlans: DBSchema["lessonPlans"] = [
    { id: "lp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentId: "ta-2", localDate: "2025-08-18", status: "completed", objectives: "Students will understand Newton's First Law", methods: "Lecture + Demonstration", resources: "Cart, Books, Whiteboard", homework: "Exercise 1.1", assessmentCheck: "Exit ticket", createdOn: "2025-08-18", updatedOn: "2025-08-18" },
    { id: "lp-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentId: "ta-1", localDate: "2025-08-19", status: "active", objectives: "Solve quadratic equations", methods: "Guided Practice", resources: "Worksheet, Calculator", homework: "Problems 1–10", assessmentCheck: "Board work", createdOn: "2025-08-19", updatedOn: "2025-08-19" },
  ];

  const coverageEntries: DBSchema["coverageEntries"] = [
    { id: "ce-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, lessonPlanId: "lp-1", completedAt: "2025-08-18T10:30:00", notes: "Completed with extra examples", createdOn: "2025-08-18", updatedOn: "2025-08-18" },
    { id: "ce-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, lessonPlanId: "lp-2", completedAt: "2025-08-19T14:00:00", notes: "Coverage delayed — syllabus re-sequenced", createdOn: "2025-08-19", updatedOn: "2025-08-19" },
    { id: "ce-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, lessonPlanId: "lp-1", completedAt: "2025-08-20T09:45:00", notes: "Remedial class completed", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
  ];

  const workloadAllocations: DBSchema["workloadAllocations"] = [
    { id: "wa-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", activityType: "teaching", units: "25 periods/week", periodStart: "2025-04-15", periodEnd: "2026-04-14", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "wa-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", activityType: "assessment", units: "3 hours/week", periodStart: "2025-04-15", periodEnd: "2026-04-14", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "wa-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-2", staffName: "Ramesh Shrestha", activityType: "administration", units: "10 hours/week", periodStart: "2025-04-15", periodEnd: "2026-04-14", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "wa-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-3", staffName: "Laxmi Poudel", activityType: "guidance", units: "5 hours/week", periodStart: "2025-04-15", periodEnd: "2026-04-14", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const qualityReviews: DBSchema["qualityReviews"] = [
    { id: "qr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, scopeType: "faculty", scopeId: "uid-5", reviewType: "internal", cycle: "Term 2 2082", status: "in_progress", findings: "Good lesson planning; needs more student engagement", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "qr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, scopeType: "subject", scopeId: "su-6", reviewType: "internal", cycle: "Annual 2082", status: "completed", findings: "Lab equipment sufficient; curriculum up to date", createdOn: "2025-06-15", updatedOn: "2025-06-20" },
    { id: "qr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, scopeType: "school", scopeId: campuses[0]!.id, reviewType: "external", cycle: "Annual 2082", status: "certified", findings: "Affiliation standards met — NEB re-accreditation passed", createdOn: "2025-05-01", updatedOn: "2025-05-20" },
  ];

  const qualityEvidences: DBSchema["qualityEvidences"] = [
    { id: "qe-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-1", objectRef: "lp-1", objectType: "lesson_plan", description: "Sample lesson plan for Newton's laws", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "qe-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-2", objectRef: "su-6", objectType: "subject", description: "Physics lab inventory 2082", createdOn: "2025-06-15", updatedOn: "2025-06-15" },
    { id: "qe-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-3", objectRef: "camp-main", objectType: "campus", description: "External audit report — campus infrastructure", createdOn: "2025-05-10", updatedOn: "2025-05-10" },
    { id: "qe-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-1", objectRef: "lp-2", objectType: "lesson_plan", description: "Mathematics remediation plan evidenced", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
  ];

  const moderationReviews: DBSchema["moderationReviews"] = [
    { id: "mr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-1", subjectRef: "su-6", subjectName: "Physics", outcome: "agreed", remarks: "Teaching standard meets expectation", reviewerId: "uid-2", reviewerName: "Ramesh Shrestha", isAnonymous: false, createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "mr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-2", subjectRef: "su-3", subjectName: "Mathematics", outcome: "revised", remarks: "Grading rubric updated for consistency", reviewerId: "uid-1", reviewerName: "Anish Karki", isAnonymous: true, createdOn: "2025-06-18", updatedOn: "2025-06-18" },
    { id: "mr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-3", subjectRef: "su-2", subjectName: "English", outcome: "pending", remarks: "Awaiting external moderator", reviewerId: "uid-4", reviewerName: "Suresh Thapa", isAnonymous: false, createdOn: "2025-09-06", updatedOn: "2025-09-06" },
  ];

  const reviewActions: DBSchema["reviewActions"] = [
    { id: "ra-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-1", ownerRef: "uid-5", ownerName: "Manoj Rai", dueDate: "2025-09-30", status: "open", action: "Increase student participation in practicals", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "ra-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-2", ownerRef: "uid-3", ownerName: "Laxmi Poudel", dueDate: "2025-07-15", status: "completed", action: "Update lab safety checklist", createdOn: "2025-06-20", updatedOn: "2025-07-10" },
    { id: "ra-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reviewId: "qr-3", ownerRef: "uid-2", ownerName: "Ramesh Shrestha", dueDate: "2025-06-01", status: "in_progress", action: "Submit affiliation renewal dossier", createdOn: "2025-05-15", updatedOn: "2025-05-15" },
  ];

  // ── M07 Scheduling, Attendance and Time ──────────────────────────────────

  const timetables: DBSchema["timetables"] = [
    { id: "tt-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", academicPeriodName: "2082 BS (2025/2026)", campusId: "camp-main", campusName: "Baneshwor Main Campus", version: 1, name: "Class 10 — Term 2 Timetable", status: "published", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "tt-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", academicPeriodName: "2082 BS (2025/2026)", campusId: "camp-main", campusName: "Baneshwor Main Campus", version: 1, name: "Class 1 — Term 2 Timetable", status: "approved", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "tt-3", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, academicPeriodRef: "ay-1", academicPeriodName: "2082 BS (2025/2026)", campusId: "camp-bkt", campusName: "Bhaktapur Branch", version: 1, name: "Bhaktapur — Draft Timetable", status: "draft", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const timetableSlots: DBSchema["timetableSlots"] = [
    { id: "ts-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-1", timetableName: "Class 10 — Term 2 Timetable", dayPattern: "Mon", startTime: "10:00", endTime: "10:45", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "ts-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-1", timetableName: "Class 10 — Term 2 Timetable", dayPattern: "Mon", startTime: "10:45", endTime: "11:30", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "ts-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-2", timetableName: "Class 1 — Term 2 Timetable", dayPattern: "Tue", startTime: "09:00", endTime: "09:40", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "ts-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-1", timetableName: "Class 10 — Term 2 Timetable", dayPattern: "Wed", startTime: "13:00", endTime: "13:45", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const timetableAssignments: DBSchema["timetableAssignments"] = [
    { id: "ta-101", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-1", slotId: "ts-1", slotLabel: "Mon 10:00-10:45", sectionRef: "sc-3", sectionName: "Class 10 A", offeringRef: "co-3", offeringName: "Mathematics", staffRef: "uid-5", staffName: "Manoj Rai", locationRef: "loc-rm-201", locationName: "Room 201", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "ta-102", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-1", slotId: "ts-2", slotLabel: "Mon 10:45-11:30", sectionRef: "sc-3", sectionName: "Class 10 A", offeringRef: "co-3", offeringName: "Mathematics", staffRef: "uid-5", staffName: "Manoj Rai", locationRef: "loc-lab-comp", locationName: "Computer Laboratory", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "ta-103", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timetableId: "tt-2", slotId: "ts-3", slotLabel: "Tue 09:00-09:40", sectionRef: "sc-1", sectionName: "Class 1 A", offeringRef: "co-1", offeringName: "Nepali", staffRef: "uid-5", staffName: "Manoj Rai", locationRef: "loc-rm-101", locationName: "Room 101", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const substitutions: DBSchema["substitutions"] = [
    { id: "sub-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentId: "ta-101", assignmentLabel: "Class 10 A — Mathematics", localDate: "2025-09-04", replacementStaffRef: "uid-2", replacementStaffName: "Ramesh Shrestha", reason: "Manoj Rai on leave — Dashain", status: "approved", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "sub-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentId: "ta-102", assignmentLabel: "Class 10 A — Mathematics", localDate: "2025-09-05", replacementStaffRef: "uid-3", replacementStaffName: "Laxmi Poudel", reason: "Timetable swap for lab maintenance", status: "pending", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "sub-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentId: "ta-103", assignmentLabel: "Class 1 A — Nepali", localDate: "2025-09-05", replacementStaffRef: "uid-5", replacementStaffName: "Manoj Rai", reason: "Cover for sick leave", status: "completed", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "sub-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentId: "ta-101", assignmentLabel: "Class 10 A — Mathematics", localDate: "2025-09-06", replacementStaffRef: "uid-4", replacementStaffName: "Suresh Thapa", reason: "Exam invigilation duty", status: "pending", createdOn: "2025-09-06", updatedOn: "2025-09-06" },
  ];

  const attendanceSessions: DBSchema["attendanceSessions"] = [
    { id: "asess-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentRef: "ta-101", localDate: "2025-09-03", status: "finalized", courseOfferingId: "co-3", courseOfferingName: "Mathematics", sectionId: "sc-3", sectionName: "Class 10 A", sessionDate: "2025-09-03", periodNo: 1, scheduledStartAt: "2025-09-03T10:00:00", scheduledEndAt: "2025-09-03T10:45:00", finalizedAt: "2025-09-03T11:00:00", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "asess-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentRef: "ta-103", localDate: "2025-09-03", status: "open", courseOfferingId: "co-1", courseOfferingName: "Nepali", sectionId: "sc-1", sectionName: "Class 1 A", sessionDate: "2025-09-03", periodNo: 1, scheduledStartAt: "2025-09-03T09:00:00", scheduledEndAt: "2025-09-03T09:40:00", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "asess-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentRef: "ta-101", localDate: "2025-09-04", status: "scheduled", courseOfferingId: "co-3", courseOfferingName: "Mathematics", sectionId: "sc-3", sectionName: "Class 10 A", sessionDate: "2025-09-04", periodNo: 1, scheduledStartAt: "2025-09-04T10:00:00", scheduledEndAt: "2025-09-04T10:45:00", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "asess-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentRef: "ta-102", localDate: "2025-09-04", status: "finalized", courseOfferingId: "co-6", courseOfferingName: "Computer Science", sectionId: "sc-4", sectionName: "Science A", sessionDate: "2025-09-04", periodNo: 2, scheduledStartAt: "2025-09-04T10:45:00", scheduledEndAt: "2025-09-04T11:30:00", finalizedAt: "2025-09-04T12:00:00", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "asess-5", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assignmentRef: "ta-103", localDate: "2025-09-04", status: "cancelled", courseOfferingId: "co-1", courseOfferingName: "Nepali", sectionId: "sc-1", sectionName: "Class 1 A", sessionDate: "2025-09-04", periodNo: 1, scheduledStartAt: "2025-09-04T09:00:00", scheduledEndAt: "2025-09-04T09:40:00", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
  ];

  const studentAttendances: DBSchema["studentAttendances"] = [
    { id: "sa-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-1", sessionLabel: "2025-09-03 — Class 10 A", studentRef: "stu-3", studentName: "Bikash Gurung", status: "present", recordedAt: "2025-09-03T10:05:00", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "sa-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-1", sessionLabel: "2025-09-03 — Class 10 A", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", status: "late", recordedAt: "2025-09-03T10:12:00", remarks: "Traffic delay", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "sa-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-2", sessionLabel: "2025-09-03 — Class 1 A", studentRef: "stu-4", studentName: "Anisha Maharjan", status: "absent", recordedAt: "2025-09-03T09:10:00", remarks: "Sick leave", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "sa-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-2", sessionLabel: "2025-09-03 — Class 1 A", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", status: "present", recordedAt: "2025-09-03T09:02:00", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "sa-5", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-4", sessionLabel: "2025-09-04 — Science A", studentRef: "stu-2", studentName: "Sita Kumari Thapa", status: "present", recordedAt: "2025-09-04T10:50:00", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "sa-6", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-4", sessionLabel: "2025-09-04 — Science A", studentRef: "stu-3", studentName: "Bikash Gurung", status: "excused", recordedAt: "2025-09-04T10:55:00", remarks: "Inter-school competition", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "sa-7", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-1", sessionLabel: "2025-09-03 — Class 10 A", studentRef: "stu-2", studentName: "Sita Kumari Thapa", status: "present", recordedAt: "2025-09-03T10:06:00", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
  ];

  const attendanceCorrections: DBSchema["attendanceCorrections"] = [
    { id: "ac-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-1", studentRef: "stu-3", studentName: "Bikash Gurung", fromStatus: "absent", toStatus: "present", reason: "Biometric punch missed — verified via CCTV", approval: "Ramesh Shrestha", status: "approved", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "ac-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-2", studentRef: "stu-4", studentName: "Anisha Maharjan", fromStatus: "absent", toStatus: "excused", reason: "Medical certificate submitted", status: "pending", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "ac-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-4", studentRef: "stu-2", studentName: "Sita Kumari Thapa", fromStatus: "late", toStatus: "present", reason: "Bus delay verified — traffic jam on Ring Road", approval: "Anish Karki", status: "draft", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "ac-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, sessionId: "asess-1", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", fromStatus: "late", toStatus: "present", reason: "Late punch due to fingerprint reader error", status: "rejected", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
  ];

  const attendanceAlerts: DBSchema["attendanceAlerts"] = [
    { id: "aa-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", ruleVersion: "v1-threshold-75", alertType: "chronic_absence", message: "Attendance below 75% — 12 absent days in last 30 days", status: "open", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "aa-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-4", studentName: "Anisha Maharjan", ruleVersion: "v1-late-3", alertType: "late_pattern", message: "3 consecutive late arrivals", status: "acknowledged", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "aa-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", ruleVersion: "v1-sudden-drop", alertType: "sudden_drop", message: "Sudden drop: 95% → 60% this month", status: "open", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "aa-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", ruleVersion: "v1-course-risk", alertType: "course_risk", message: "Course-level risk: Mathematics attendance 68%", status: "resolved", createdOn: "2025-09-02", updatedOn: "2025-09-04" },
  ];

  const shifts: DBSchema["shifts"] = [
    { id: "shift-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, campusId: "camp-main", campusName: "Baneshwor Main Campus", code: "MOR-08", name: "Morning Shift", startTime: "08:00", endTime: "14:00", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "shift-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, campusId: "camp-main", campusName: "Baneshwor Main Campus", code: "DAY-10", name: "Day Shift", startTime: "10:00", endTime: "16:00", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "shift-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, campusId: "camp-bkt", campusName: "Bhaktapur Branch", code: "EVE-14", name: "Evening Shift", startTime: "14:00", endTime: "18:00", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];

  const staffRosters: DBSchema["staffRosters"] = [
    { id: "roster-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", localDate: "2025-09-03", shiftId: "shift-1", shiftName: "Morning Shift", status: "scheduled", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
    { id: "roster-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-2", staffName: "Ramesh Shrestha", localDate: "2025-09-03", shiftId: "shift-2", shiftName: "Day Shift", status: "completed", createdOn: "2025-09-02", updatedOn: "2025-09-03" },
    { id: "roster-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-4", staffName: "Suresh Thapa", localDate: "2025-09-04", shiftId: "shift-1", shiftName: "Morning Shift", status: "absent", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "roster-4", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, staffRef: "uid-5", staffName: "Manoj Rai", localDate: "2025-09-04", shiftId: "shift-3", shiftName: "Evening Shift", status: "on_leave", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
  ];

  const timeEntries: DBSchema["timeEntries"] = [
    { id: "te-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", occurredAt: "2025-09-03T07:58:00", source: "biometric", status: "approved", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "te-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-2", staffName: "Ramesh Shrestha", occurredAt: "2025-09-03T10:05:00", source: "manual", status: "pending", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "te-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-4", staffName: "Suresh Thapa", occurredAt: "2025-09-03T08:15:00", source: "qr", status: "approved", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "te-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", occurredAt: "2025-09-04T07:45:00", source: "rfid", status: "rejected", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
  ];

  const timeAdjustments: DBSchema["timeAdjustments"] = [
    { id: "tadj-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timeEntryId: "te-2", staffName: "Ramesh Shrestha", reason: "Late arrival due to traffic — supporting doc attached", approval: "Anish Karki", status: "pending", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "tadj-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timeEntryId: "te-4", staffName: "Manoj Rai", reason: "RFID missed — manual correction requested", approval: "Ramesh Shrestha", status: "approved", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "tadj-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, timeEntryId: "te-3", staffName: "Suresh Thapa", reason: "QR scan duplicate — deduplication", approval: "", status: "draft", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
  ];

  // ── M08 Assessment, Examinations and Integrity ─────────────────────────────

  const assessments: DBSchema["assessments"] = [
    { id: "ass-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", code: "ASS-2082-T1", name: "First Terminal Examination", type: "terminal", maxMarks: 100, passMarks: 40, weight: 25, status: "active", createdOn: "2025-06-01", updatedOn: "2025-06-01" },
    { id: "ass-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", code: "ASS-2082-UT1", name: "Unit Test 1 — Science", type: "unit_test", maxMarks: 50, passMarks: 20, weight: 10, status: "published", createdOn: "2025-07-10", updatedOn: "2025-07-10" },
    { id: "ass-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", code: "ASS-2082-PRE", name: "Pre-Board Mock — Class 10", type: "board_mock", maxMarks: 100, passMarks: 40, weight: 30, status: "draft", createdOn: "2025-08-15", updatedOn: "2025-08-15" },
    { id: "ass-4", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, academicPeriodRef: "ay-1", code: "ASS-2082-FORM", name: "Formative Assessment — ECED", type: "formative", maxMarks: 20, passMarks: 8, weight: 15, status: "active", createdOn: "2025-07-20", updatedOn: "2025-07-20" },
  ];

  const assessmentComponents: DBSchema["assessmentComponents"] = [
    { id: "acomp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-1", assessmentName: "First Terminal Examination", name: "Theory", maxMarks: 75, weight: 75, createdOn: "2025-06-01", updatedOn: "2025-06-01" },
    { id: "acomp-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-1", assessmentName: "First Terminal Examination", name: "Practical", maxMarks: 25, weight: 25, createdOn: "2025-06-01", updatedOn: "2025-06-01" },
    { id: "acomp-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-2", assessmentName: "Unit Test 1 — Science", name: "MCQ Section", maxMarks: 20, weight: 40, createdOn: "2025-07-10", updatedOn: "2025-07-10" },
    { id: "acomp-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-2", assessmentName: "Unit Test 1 — Science", name: "Subjective", maxMarks: 30, weight: 60, createdOn: "2025-07-10", updatedOn: "2025-07-10" },
  ];

  const questions: DBSchema["questions"] = [
    { id: "q-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, subjectRef: "su-6", subjectName: "Physics", code: "Q-PHY-001", text: "State Newton's First Law of Motion with an example.", type: "short", difficulty: "easy", marks: 5, status: "approved", createdOn: "2025-07-01", updatedOn: "2025-07-01" },
    { id: "q-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, subjectRef: "su-3", subjectName: "Mathematics", code: "Q-MATH-042", text: "Solve: If 2x + 3y = 12 and x - y = 1, find x and y.", type: "long", difficulty: "medium", marks: 8, status: "approved", createdOn: "2025-07-02", updatedOn: "2025-07-02" },
    { id: "q-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, subjectRef: "su-1", subjectName: "Nepali", code: "Q-NEP-011", text: "‘वसन्त ऋतु’ मा निबन्ध लेख्नुहोस्।", type: "long", difficulty: "medium", marks: 10, status: "draft", createdOn: "2025-07-05", updatedOn: "2025-07-05" },
    { id: "q-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, subjectRef: "su-6", subjectName: "Physics", code: "Q-PHY-018", text: "Which unit is used for measuring force?", type: "mcq", difficulty: "easy", marks: 2, status: "approved", createdOn: "2025-07-06", updatedOn: "2025-07-06" },
    { id: "q-5", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, subjectRef: "su-3", subjectName: "Mathematics", code: "Q-MATH-050", text: "Practical: Verify Pythagoras theorem using graph paper.", type: "practical", difficulty: "hard", marks: 10, status: "approved", createdOn: "2025-07-08", updatedOn: "2025-07-08" },
  ];

  const examPapers: DBSchema["examPapers"] = [
    { id: "ep-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-1", assessmentName: "First Terminal Examination", subjectRef: "su-6", subjectName: "Physics", code: "PAP-PHY-T1", title: "Physics — Class 11 — Terminal Paper A", totalMarks: 75, durationMins: 180, status: "approved", createdOn: "2025-08-01", updatedOn: "2025-08-01" },
    { id: "ep-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-1", assessmentName: "First Terminal Examination", subjectRef: "su-3", subjectName: "Mathematics", code: "PAP-MATH-T1", title: "Mathematics — Class 10 — Terminal Paper", totalMarks: 100, durationMins: 180, status: "published", createdOn: "2025-08-02", updatedOn: "2025-08-02" },
    { id: "ep-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, assessmentId: "ass-3", assessmentName: "Pre-Board Mock — Class 10", subjectRef: "su-3", subjectName: "Mathematics", code: "PAP-MATH-PRE", title: "Mock — Mathematics Pre-Board", totalMarks: 100, durationMins: 180, status: "draft", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
  ];

  const exams: DBSchema["exams"] = [
    { id: "exam-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", name: "First Terminal 2082", code: "EXAM-T1-2082", type: "terminal", status: "scheduled", startDate: "2025-09-15", endDate: "2025-09-30", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
    { id: "exam-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", name: "Pre-Board 2082 — Class 10", code: "EXAM-PRE-10", type: "pre_board", status: "scheduled", startDate: "2026-01-05", endDate: "2026-01-20", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "exam-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", name: "Unit Test — Science", code: "EXAM-UT-SCI", type: "unit", status: "ongoing", startDate: "2025-09-02", endDate: "2025-09-05", createdOn: "2025-08-25", updatedOn: "2025-09-02" },
    { id: "exam-4", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, academicPeriodRef: "ay-1", name: "Entrance Test 2083", code: "EXAM-ENT-2083", type: "entrance", status: "draft", startDate: "2026-03-10", endDate: "2026-03-12", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
  ];

  const examRegistrations: DBSchema["examRegistrations"] = [
    { id: "er-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", examName: "First Terminal 2082", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", status: "admitted", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "er-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", examName: "First Terminal 2082", studentRef: "stu-2", studentName: "Sita Kumari Thapa", status: "registered", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "er-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", examName: "First Terminal 2082", studentRef: "stu-3", studentName: "Bikash Gurung", status: "registered", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "er-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-3", examName: "Unit Test — Science", studentRef: "stu-3", studentName: "Bikash Gurung", status: "completed", createdOn: "2025-09-02", updatedOn: "2025-09-03" },
    { id: "er-5", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-2", examName: "Pre-Board 2082 — Class 10", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", status: "registered", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];

  const examRooms: DBSchema["examRooms"] = [
    { id: "eroom-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", examName: "First Terminal 2082", locationRef: "loc-rm-201", locationName: "Room 201", capacity: 36, createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "eroom-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", examName: "First Terminal 2082", locationRef: "loc-hall-asm", locationName: "Assembly Hall", capacity: 400, createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "eroom-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-2", examName: "Pre-Board 2082 — Class 10", locationRef: "loc-rm-101", locationName: "Room 101", capacity: 40, createdOn: "2025-09-12", updatedOn: "2025-09-12" },
  ];

  const seatAllocations: DBSchema["seatAllocations"] = [
    { id: "seat-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", roomId: "eroom-1", roomName: "Room 201", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", seatNo: "A-01", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "seat-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", roomId: "eroom-1", roomName: "Room 201", studentRef: "stu-2", studentName: "Sita Kumari Thapa", seatNo: "A-02", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "seat-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", roomId: "eroom-2", roomName: "Assembly Hall", studentRef: "stu-3", studentName: "Bikash Gurung", seatNo: "H-15", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
  ];

  const invigilationDuties: DBSchema["invigilationDuties"] = [
    { id: "inv-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", roomId: "eroom-1", roomName: "Room 201", staffRef: "uid-5", staffName: "Manoj Rai", role: "chief", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "inv-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", roomId: "eroom-2", roomName: "Assembly Hall", staffRef: "uid-2", staffName: "Ramesh Shrestha", role: "chief", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "inv-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", roomId: "eroom-2", roomName: "Assembly Hall", staffRef: "uid-4", staffName: "Suresh Thapa", role: "assistant", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
  ];

  const markEntries: DBSchema["markEntries"] = [
    { id: "me-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-3", registrationId: "er-4", studentName: "Bikash Gurung", subjectRef: "su-6", subjectName: "Physics", marksObtained: 38, maxMarks: 50, grade: "B+", status: "verified", enteredBy: "Manoj Rai", createdOn: "2025-09-03", updatedOn: "2025-09-03" },
    { id: "me-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", registrationId: "er-1", studentName: "Ram Bahadur Shrestha", subjectRef: "su-3", subjectName: "Mathematics", marksObtained: 78, maxMarks: 100, grade: "A", status: "submitted", enteredBy: "Manoj Rai", createdOn: "2025-09-28", updatedOn: "2025-09-28" },
    { id: "me-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", registrationId: "er-2", studentName: "Sita Kumari Thapa", subjectRef: "su-6", subjectName: "Physics", marksObtained: 42, maxMarks: 75, grade: "B", status: "draft", enteredBy: "Suresh Thapa", createdOn: "2025-09-29", updatedOn: "2025-09-29" },
    { id: "me-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", registrationId: "er-3", studentName: "Bikash Gurung", subjectRef: "su-6", subjectName: "Physics", marksObtained: 68, maxMarks: 75, grade: "A", status: "published", enteredBy: "Manoj Rai", createdOn: "2025-09-29", updatedOn: "2025-09-30" },
  ];

  const moderationRecords: DBSchema["moderationRecords"] = [
    { id: "mod-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", subjectRef: "su-6", action: "scaled", reason: "Difficulty calibration — paper was tougher than standard", adjustment: 5, status: "approved", createdOn: "2025-09-30", updatedOn: "2025-09-30" },
    { id: "mod-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", subjectRef: "su-3", action: "grace", reason: "Grace marks for Q7 ambiguity — 2 marks to all", adjustment: 2, status: "pending", createdOn: "2025-09-30", updatedOn: "2025-09-30" },
    { id: "mod-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-3", subjectRef: "su-6", action: "no_change", reason: "Review: marking consistent — no adjustment", adjustment: 0, status: "approved", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
  ];

  const practicalExams: DBSchema["practicalExams"] = [
    { id: "prac-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", subjectRef: "su-6", subjectName: "Physics", type: "practical", scheduledOn: "2025-09-25T10:00:00", venue: "Physics Laboratory", status: "scheduled", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "prac-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", subjectRef: "su-8", subjectName: "Computer Science", type: "project", scheduledOn: "2025-09-26T13:00:00", venue: "Computer Laboratory", status: "scheduled", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
    { id: "prac-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", subjectRef: "su-6", subjectName: "Physics", type: "viva", scheduledOn: "2025-09-27T09:00:00", venue: "Room 201", status: "completed", createdOn: "2025-09-10", updatedOn: "2025-09-27" },
  ];

  const integrityCases: DBSchema["integrityCases"] = [
    { id: "ic-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", studentRef: "stu-2", studentName: "Sita Kumari Thapa", type: "cheating", description: "Mobile phone found during Mathematics paper", status: "under_review", createdOn: "2025-09-20", updatedOn: "2025-09-20" },
    { id: "ic-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-3", studentRef: "stu-3", studentName: "Bikash Gurung", type: "disruption", description: "Disruptive behavior — warned and relocated", status: "resolved", createdOn: "2025-09-03", updatedOn: "2025-09-04" },
    { id: "ic-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, examId: "exam-1", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", type: "other", description: "Suspected impersonation — ID mismatch, under verification", status: "open", createdOn: "2025-09-21", updatedOn: "2025-09-21" },
  ];

  const recheckRequests: DBSchema["recheckRequests"] = [
    { id: "rr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, markEntryId: "me-2", studentName: "Ram Bahadur Shrestha", subjectRef: "su-3", reason: "Request re-totalling — expected higher in Section B", status: "pending", requestedOn: "2025-10-01", createdOn: "2025-10-01", updatedOn: "2025-10-01" },
    { id: "rr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, markEntryId: "me-3", studentName: "Sita Kumari Thapa", subjectRef: "su-6", reason: "Grace not applied — moderation pending", status: "in_review", requestedOn: "2025-10-02", createdOn: "2025-10-02", updatedOn: "2025-10-02" },
    { id: "rr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, markEntryId: "me-1", studentName: "Bikash Gurung", subjectRef: "su-6", reason: "Re-assessment request — practical marks dispute", status: "completed", requestedOn: "2025-09-05", createdOn: "2025-09-05", updatedOn: "2025-09-06" },
  ];

  // ── M09 School Results, Records and Certificates ───────────────────────────

  const resultRuns: DBSchema["resultRuns"] = [
    { id: "rrun-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", examId: "exam-1", examName: "First Terminal 2082", name: "Terminal 1 — Class 10 — 2082", status: "published", computedOn: "2025-10-05", createdOn: "2025-10-01", updatedOn: "2025-10-05" },
    { id: "rrun-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", examId: "exam-3", examName: "Unit Test — Science", name: "Unit Test — Science — Class 11", status: "computed", computedOn: "2025-09-04", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
    { id: "rrun-3", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, academicPeriodRef: "ay-1", examId: "exam-4", examName: "Entrance Test 2083", name: "Entrance 2083 — Bhaktapur", status: "draft", createdOn: "2025-09-10", updatedOn: "2025-09-10" },
  ];

  const resultLines: DBSchema["resultLines"] = [
    { id: "rl-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultRunId: "rrun-1", resultRunName: "Terminal 1 — Class 10 — 2082", studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", totalMarks: 342, gpa: 3.65, grade: "A", outcome: "pass", rank: 2, createdOn: "2025-10-05", updatedOn: "2025-10-05" },
    { id: "rl-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultRunId: "rrun-1", resultRunName: "Terminal 1 — Class 10 — 2082", studentRef: "stu-3", studentName: "Bikash Gurung", totalMarks: 365, gpa: 3.85, grade: "A+", outcome: "pass", rank: 1, createdOn: "2025-10-05", updatedOn: "2025-10-05" },
    { id: "rl-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultRunId: "rrun-1", resultRunName: "Terminal 1 — Class 10 — 2082", studentRef: "stu-2", studentName: "Sita Kumari Thapa", totalMarks: 198, gpa: 2.1, grade: "C", outcome: "fail", createdOn: "2025-10-05", updatedOn: "2025-10-05" },
    { id: "rl-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultRunId: "rrun-2", resultRunName: "Unit Test — Science — Class 11", studentRef: "stu-3", studentName: "Bikash Gurung", totalMarks: 38, gpa: 3.2, grade: "B+", outcome: "pass", createdOn: "2025-09-04", updatedOn: "2025-09-04" },
  ];

  const resultPublications: DBSchema["resultPublications"] = [
    { id: "rpub-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultRunId: "rrun-1", resultRunName: "Terminal 1 — Class 10 — 2082", publishedOn: "2025-10-06T10:00:00", status: "published", approvedBy: "Ramesh Shrestha", createdOn: "2025-10-06", updatedOn: "2025-10-06" },
    { id: "rpub-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultRunId: "rrun-2", resultRunName: "Unit Test — Science — Class 11", publishedOn: "2025-09-05T09:00:00", status: "approved", approvedBy: "Manoj Rai", createdOn: "2025-09-05", updatedOn: "2025-09-05" },
    { id: "rpub-3", tenantId: tenants[0]!.id, schoolId: campuses[1]!.id, resultRunId: "rrun-3", resultRunName: "Entrance 2083 — Bhaktapur", publishedOn: "2025-09-11", status: "draft", createdOn: "2025-09-11", updatedOn: "2025-09-11" },
  ];

  const resultCorrections: DBSchema["resultCorrections"] = [
    { id: "rcorr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultLineId: "rl-3", studentName: "Sita Kumari Thapa", type: "retotal", reason: "Totalling error — 12 marks missed in English", status: "pending", createdOn: "2025-10-07", updatedOn: "2025-10-07" },
    { id: "rcorr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultLineId: "rl-1", studentName: "Ram Bahadur Shrestha", type: "recheck", reason: "Re-check requested via RR-1 — Mathematics", status: "approved", correctedBy: "Manoj Rai", createdOn: "2025-10-02", updatedOn: "2025-10-03" },
    { id: "rcorr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resultLineId: "rl-2", studentName: "Bikash Gurung", type: "data_fix", reason: "Attendance marks correction — 5 added", status: "applied", correctedBy: "Anish Karki", createdOn: "2025-10-03", updatedOn: "2025-10-04" },
  ];

  const marksheets: DBSchema["marksheets"] = [
    { id: "ms-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", academicPeriodRef: "ay-1", examId: "exam-1", serial: "MS-2082-001", status: "issued", issuedOn: "2025-10-07", createdOn: "2025-10-07", updatedOn: "2025-10-07" },
    { id: "ms-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", academicPeriodRef: "ay-1", examId: "exam-1", serial: "MS-2082-002", status: "issued", issuedOn: "2025-10-07", createdOn: "2025-10-07", updatedOn: "2025-10-07" },
    { id: "ms-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", academicPeriodRef: "ay-1", examId: "exam-1", serial: "MS-2082-003", status: "draft", issuedOn: "2025-10-08", createdOn: "2025-10-08", updatedOn: "2025-10-08" },
  ];

  const transcripts: DBSchema["transcripts"] = [
    { id: "tr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", fromPeriod: "2081", toPeriod: "2082", status: "issued", issuedOn: "2025-10-10", createdOn: "2025-10-10", updatedOn: "2025-10-10" },
    { id: "tr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", fromPeriod: "2080", toPeriod: "2082", status: "draft", issuedOn: "2025-10-11", createdOn: "2025-10-11", updatedOn: "2025-10-11" },
  ];

  const certificates: DBSchema["certificates"] = [
    { id: "cert-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", type: "transfer", serial: "CER-2082-042", status: "issued", issuedOn: "2025-08-20", validUntil: "2026-08-20", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
    { id: "cert-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", type: "character", serial: "CER-2082-043", status: "issued", issuedOn: "2025-08-22", createdOn: "2025-08-22", updatedOn: "2025-08-22" },
    { id: "cert-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", type: "bonafide", serial: "CER-2082-044", status: "draft", issuedOn: "2025-09-01", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];

  const certificateRequests: DBSchema["certificateRequests"] = [
    { id: "creq-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", certificateType: "transfer", purpose: "Admission to new school", status: "issued", requestedOn: "2025-08-18", createdOn: "2025-08-18", updatedOn: "2025-08-20" },
    { id: "creq-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", certificateType: "bonafide", purpose: "Scholarship application", status: "pending", requestedOn: "2025-08-30", createdOn: "2025-08-30", updatedOn: "2025-08-30" },
    { id: "creq-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", certificateType: "character", purpose: "NEB registration", status: "approved", requestedOn: "2025-08-21", createdOn: "2025-08-21", updatedOn: "2025-08-22" },
  ];

  const digitalCredentials: DBSchema["digitalCredentials"] = [
    { id: "dc-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, certificateId: "cert-1", certificateSerial: "CER-2082-042", studentName: "Ram Bahadur Shrestha", credentialCode: "CRED-9F3A2B1C", status: "active", issuedOn: "2025-08-20T14:00:00", verifiedOn: "2025-08-22T09:00:00", createdOn: "2025-08-20", updatedOn: "2025-08-22" },
    { id: "dc-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, certificateId: "cert-2", certificateSerial: "CER-2082-043", studentName: "Bikash Gurung", credentialCode: "CRED-7E1D4A9F", status: "active", issuedOn: "2025-08-22T10:00:00", createdOn: "2025-08-22", updatedOn: "2025-08-22" },
    { id: "dc-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, certificateId: "cert-3", certificateSerial: "CER-2082-044", studentName: "Sita Kumari Thapa", credentialCode: "CRED-3C8B2E7A", status: "expired", issuedOn: "2025-09-01T11:00:00", createdOn: "2025-09-01", updatedOn: "2025-09-05" },
  ];

  const completionRecords: DBSchema["completionRecords"] = [
    { id: "comp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", gradeClassRef: "gc-8", academicPeriodRef: "ay-1", type: "SEE", status: "completed", completedOn: "2025-06-30", createdOn: "2025-06-30", updatedOn: "2025-06-30" },
    { id: "comp-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", gradeClassRef: "gc-10", academicPeriodRef: "ay-1", type: "NEB_12", status: "pending", completedOn: "2026-06-15", createdOn: "2025-10-01", updatedOn: "2025-10-01" },
    { id: "comp-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", gradeClassRef: "gc-10", academicPeriodRef: "ay-1", type: "school_completion", status: "withheld", completedOn: "2026-06-15", createdOn: "2025-10-01", updatedOn: "2025-10-01" },
    { id: "comp-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", gradeClassRef: "gc-8", academicPeriodRef: "ay-2", type: "SEE", status: "certified", completedOn: "2024-06-30", createdOn: "2024-06-30", updatedOn: "2024-06-30" },
  ];

  // ── M11 portals seed ────────────────────────────────────────────────
  const portalAnnouncements: DBSchema["portalAnnouncements"] = [
    { id: "pa-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "SEE Routine Published", body: "SEE exam routine for 2082 published on student portal", targetAudience: "student", publishOn: "2025-04-01", expiresOn: "2025-06-01", status: "published", createdOn: "2025-04-01", updatedOn: "2025-04-01" },
    { id: "pa-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Parent-Teacher Meeting", body: "PTM scheduled 2026-05-10 for all parents", targetAudience: "parent", publishOn: "2026-05-01", status: "published", createdOn: "2026-05-01", updatedOn: "2026-05-01" },
    { id: "pa-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Teacher Training Workshop", body: "Digital teaching workshop for teachers", targetAudience: "teacher", publishOn: "2026-06-15", status: "draft", createdOn: "2026-06-10", updatedOn: "2026-06-10" },
    { id: "pa-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Dashain Holiday Notice", body: "School closed for Dashain 2026-10-14 to 2026-10-22", targetAudience: "all", publishOn: "2026-10-05", status: "published", createdOn: "2026-10-01", updatedOn: "2026-10-01" },
  ];
  const portalAccessLogs: DBSchema["portalAccessLogs"] = [
    { id: "pal-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, portal: "student", userRef: "stu-1", userName: "Ram Bahadur Shrestha", action: "login", ip: "202.51.78.12", accessedOn: "2026-09-01T08:10:00", createdOn: "2026-09-01", updatedOn: "2026-09-01" },
    { id: "pal-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, portal: "parent", userRef: "uid-6", userName: "Sita Adhikari", action: "view_result", ip: "202.51.78.14", accessedOn: "2026-09-01T09:00:00", createdOn: "2026-09-01", updatedOn: "2026-09-01" },
    { id: "pal-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, portal: "teacher", userRef: "uid-5", userName: "Manoj Rai", action: "marks_entry", accessedOn: "2026-09-02T11:00:00", createdOn: "2026-09-02", updatedOn: "2026-09-02" },
  ];
  const kioskSessions: DBSchema["kioskSessions"] = [
    { id: "ks-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, kioskId: "KIOSK-01", location: "Front Desk", startedAt: "2026-09-01T08:00:00", endedAt: "2026-09-01T16:00:00", status: "ended", createdOn: "2026-09-01", updatedOn: "2026-09-01" },
    { id: "ks-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, kioskId: "KIOSK-02", location: "Library", startedAt: "2026-09-02T09:00:00", status: "active", createdOn: "2026-09-02", updatedOn: "2026-09-02" },
    { id: "ks-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, kioskId: "KIOSK-01", location: "Front Desk", startedAt: "2026-09-03T08:05:00", status: "error", createdOn: "2026-09-03", updatedOn: "2026-09-03" },
  ];
  const mobileDevices: DBSchema["mobileDevices"] = [
    { id: "md-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "uid-5", userName: "Manoj Rai", deviceName: "Manoj - Galaxy A55", platform: "android", lastSyncOn: "2026-09-01T18:00:00", status: "active", createdOn: "2026-08-15", updatedOn: "2026-09-01" },
    { id: "md-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "uid-2", userName: "Ramesh Shrestha", deviceName: "Ramesh iPhone 14", platform: "ios", status: "active", createdOn: "2026-08-20", updatedOn: "2026-08-20" },
    { id: "md-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "uid-6", userName: "Sita Adhikari", deviceName: "Sita - Web", platform: "web", lastSyncOn: "2026-09-02T10:00:00", status: "active", createdOn: "2026-08-01", updatedOn: "2026-09-02" },
  ];
  const offlineSyncLogs: DBSchema["offlineSyncLogs"] = [
    { id: "osl-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, deviceId: "md-1", deviceName: "Manoj - Galaxy A55", entityType: "attendance", recordsSynced: 42, status: "synced", syncedOn: "2026-09-01T18:05:00", createdOn: "2026-09-01", updatedOn: "2026-09-01" },
    { id: "osl-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, deviceId: "md-1", entityType: "marks", recordsSynced: 12, status: "pending", createdOn: "2026-09-02", updatedOn: "2026-09-02" },
    { id: "osl-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, deviceId: "md-2", entityType: "leave", recordsSynced: 1, status: "failed", syncedOn: "2026-09-01T19:00:00", createdOn: "2026-09-01", updatedOn: "2026-09-01" },
  ];
  const accessibilityProfiles: DBSchema["accessibilityProfiles"] = [
    { id: "ap-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "uid-6", userName: "Sita Adhikari", theme: "high_contrast", fontScale: 1.25, language: "ne", createdOn: "2026-08-01", updatedOn: "2026-08-01" },
    { id: "ap-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "uid-5", userName: "Manoj Rai", theme: "light", fontScale: 1, language: "en", createdOn: "2026-08-15", updatedOn: "2026-08-15" },
  ];
  const portalTickets: DBSchema["portalTickets"] = [
    { id: "ptk-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, requesterRef: "stu-1", requesterName: "Ram Bahadur Shrestha", category: "access", subject: "Cannot view result", description: "Result page shows blank", status: "open", priority: "high", createdOn: "2026-09-01", updatedOn: "2026-09-01" },
    { id: "ptk-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, requesterRef: "uid-6", requesterName: "Sita Adhikari", category: "technical", subject: "OTP not received", status: "in_progress", priority: "medium", createdOn: "2026-09-02", updatedOn: "2026-09-02" },
    { id: "ptk-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, requesterRef: "uid-5", requesterName: "Manoj Rai", category: "content", subject: "Question paper PDF missing", status: "resolved", priority: "low", createdOn: "2026-08-30", updatedOn: "2026-09-01" },
  ];

  // ── M12 finance seed ──────────────────────────────────────────────
  const fiscalYears: DBSchema["fiscalYears"] = [
    { id: "fy-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "FY 2081/82", startDate: "2024-07-16", endDate: "2025-07-15", status: "closed", createdOn: "2024-07-16", updatedOn: "2025-07-15" },
    { id: "fy-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "FY 2082/83", startDate: "2025-07-16", endDate: "2026-07-15", status: "open", createdOn: "2025-07-16", updatedOn: "2025-07-16" },
    { id: "fy-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "FY 2083/84", startDate: "2026-07-16", endDate: "2027-07-15", status: "draft", createdOn: "2026-06-01", updatedOn: "2026-06-01" },
  ];
  const chartOfAccounts: DBSchema["chartOfAccounts"] = [
    { id: "coa-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "1000", name: "Assets", type: "asset", isActive: true, createdOn: "2024-07-16", updatedOn: "2024-07-16" },
    { id: "coa-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "1100", name: "Cash & Bank", type: "asset", parentId: "coa-1", parentName: "Assets", isActive: true, createdOn: "2024-07-16", updatedOn: "2024-07-16" },
    { id: "coa-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "4000", name: "Fee Income", type: "income", isActive: true, createdOn: "2024-07-16", updatedOn: "2024-07-16" },
    { id: "coa-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "5000", name: "Salaries Expense", type: "expense", isActive: true, createdOn: "2024-07-16", updatedOn: "2024-07-16" },
  ];
  const journalEntries: DBSchema["journalEntries"] = [
    { id: "je-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-2", fiscalYearName: "FY 2082/83", entryNo: "JE-2082-001", entryDate: "2025-08-01", description: "Tuition fee collection July", totalDebit: 850000, totalCredit: 850000, status: "posted", createdOn: "2025-08-01", updatedOn: "2025-08-01" },
    { id: "je-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-2", fiscalYearName: "FY 2082/83", entryNo: "JE-2082-002", entryDate: "2025-08-15", description: "Salary payroll August", totalDebit: 620000, totalCredit: 620000, status: "posted", createdOn: "2025-08-15", updatedOn: "2025-08-15" },
    { id: "je-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-2", entryNo: "JE-2082-003", entryDate: "2025-09-01", description: "Lab equipment purchase", totalDebit: 120000, totalCredit: 120000, status: "draft", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];
  const feeStructures: DBSchema["feeStructures"] = [
    { id: "fs-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", academicPeriodName: "2082 BS", name: "Tuition - Class 10", code: "FEE-TU10", amount: 3500, frequency: "monthly", isActive: true, createdOn: "2025-03-01", updatedOn: "2025-03-01" },
    { id: "fs-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", name: "Admission Fee", code: "FEE-ADM", amount: 15000, frequency: "one_time", isActive: true, createdOn: "2025-03-01", updatedOn: "2025-03-01" },
    { id: "fs-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", name: "Transport Fee", code: "FEE-TRN", amount: 2000, frequency: "monthly", isActive: true, createdOn: "2025-03-01", updatedOn: "2025-03-01" },
    { id: "fs-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, academicPeriodRef: "ay-1", name: "Lab Fee - Science", code: "FEE-LAB", amount: 8000, frequency: "annual", isActive: true, createdOn: "2025-03-01", updatedOn: "2025-03-01" },
  ];
  const feeAssignments: DBSchema["feeAssignments"] = [
    { id: "fa-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", feeStructureId: "fs-1", feeStructureName: "Tuition - Class 10", amount: 3500, discountAmount: 500, dueDate: "2025-09-10", status: "assigned", createdOn: "2025-08-01", updatedOn: "2025-08-01" },
    { id: "fa-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", feeStructureId: "fs-1", amount: 3500, discountAmount: 0, dueDate: "2025-09-10", status: "invoiced", createdOn: "2025-08-01", updatedOn: "2025-08-05" },
    { id: "fa-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", feeStructureId: "fs-2", amount: 15000, discountAmount: 0, dueDate: "2025-04-15", status: "invoiced", createdOn: "2025-04-10", updatedOn: "2025-04-12" },
  ];
  const invoices: DBSchema["invoices"] = [
    { id: "inv-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-1", studentName: "Ram Bahadur Shrestha", academicPeriodRef: "ay-1", invoiceNo: "INV-2082-1001", issueDate: "2025-08-05", dueDate: "2025-09-10", amount: 42000, paidAmount: 3000, balance: 39000, status: "issued", createdOn: "2025-08-05", updatedOn: "2025-08-05" },
    { id: "inv-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-2", studentName: "Sita Kumari Thapa", academicPeriodRef: "ay-1", invoiceNo: "INV-2082-1002", issueDate: "2025-08-05", dueDate: "2025-09-10", amount: 3500, paidAmount: 3500, balance: 0, status: "paid", createdOn: "2025-08-05", updatedOn: "2025-08-20" },
    { id: "inv-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentRef: "stu-3", studentName: "Bikash Gurung", academicPeriodRef: "ay-1", invoiceNo: "INV-2082-1003", issueDate: "2025-07-20", dueDate: "2025-08-20", amount: 18000, paidAmount: 0, balance: 18000, status: "overdue", createdOn: "2025-07-20", updatedOn: "2025-07-20" },
  ];
  const payments: DBSchema["payments"] = [
    { id: "pay-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-2", invoiceNo: "INV-2082-1002", studentName: "Sita Kumari Thapa", amount: 3500, method: "online", paidOn: "2025-08-20", status: "completed", reference: "eSewa TXN 88921", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
    { id: "pay-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-1", studentName: "Ram Bahadur Shrestha", amount: 3000, method: "cash", paidOn: "2025-08-25", status: "completed", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "pay-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-3", studentName: "Bikash Gurung", amount: 5000, method: "bank", paidOn: "2025-08-28", status: "pending", reference: "NMB 4821", createdOn: "2025-08-28", updatedOn: "2025-08-28" },
  ];
  const creditNotes: DBSchema["creditNotes"] = [
    { id: "cn-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-1", invoiceNo: "INV-2082-1001", amount: 2000, reason: "Sibling discount adjustment", status: "approved", createdOn: "2025-08-10", updatedOn: "2025-08-12" },
    { id: "cn-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-3", amount: 1500, reason: "Excess transport fee", status: "draft", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
  ];
  const vendorBills: DBSchema["vendorBills"] = [
    { id: "vb-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vendorName: "Himalayan Stationery Suppliers", billNo: "VB-2025-088", billDate: "2025-08-10", amount: 45000, dueDate: "2025-09-10", status: "approved", createdOn: "2025-08-10", updatedOn: "2025-08-10" },
    { id: "vb-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vendorName: "Everest Lab Equipments", billNo: "VB-2025-089", billDate: "2025-08-20", amount: 120000, dueDate: "2025-09-20", status: "draft", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
  ];
  const expenseClaims: DBSchema["expenseClaims"] = [
    { id: "ec-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-5", staffName: "Manoj Rai", category: "Travel", amount: 3500, claimDate: "2025-08-18", status: "approved", description: "Field visit to Bhaktapur branch", createdOn: "2025-08-18", updatedOn: "2025-08-19" },
    { id: "ec-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "uid-2", staffName: "Ramesh Shrestha", category: "Training", amount: 8000, claimDate: "2025-08-22", status: "submitted", createdOn: "2025-08-22", updatedOn: "2025-08-22" },
  ];
  const recurringJournals: DBSchema["recurringJournals"] = [
    { id: "rj-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Monthly Depreciation — Fixtures", description: "Recurring monthly depreciation entry for school fixtures and equipment", debitAccount: "Depreciation Expense", creditAccount: "Accumulated Depreciation", amount: 15000, frequency: "monthly", nextRunDate: "2025-09-30", lastRunDate: "2025-08-31", totalRuns: 12, maxRuns: 60, status: "active", createdOn: "2024-09-30", updatedOn: "2025-08-31" },
    { id: "rj-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Quarterly Insurance Allocation", description: "Quarterly allocation of prepaid insurance premium", debitAccount: "Insurance Expense", creditAccount: "Prepaid Insurance", amount: 25000, frequency: "quarterly", nextRunDate: "2025-10-01", lastRunDate: "2025-07-01", totalRuns: 3, maxRuns: 12, status: "active", createdOn: "2024-07-01", updatedOn: "2025-07-01" },
    { id: "rj-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Annual Audit Fee Accrual", description: "Yearly audit fee accrual entry", debitAccount: "Audit Fee Expense", creditAccount: "Accrued Liabilities", amount: 75000, frequency: "yearly", nextRunDate: "2026-07-16", lastRunDate: "2025-07-16", totalRuns: 1, maxRuns: 5, status: "active", createdOn: "2025-07-16", updatedOn: "2025-07-16" },
  ];
  const disbursementEntries: DBSchema["disbursementEntries"] = [
    { id: "de-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vendorId: "vb-1", vendorName: "Himalayan Stationery Suppliers", billId: "vb-1", billNumber: "VB-2025-088", amount: 45000, method: "bank_transfer", chequeNumber: "", bankAccount: "NMB Bank", status: "processed", processedAt: "2025-09-01", approvedBy: "Ramesh Shrestha", createdOn: "2025-08-31", updatedOn: "2025-09-01" },
    { id: "de-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vendorId: "vb-2", vendorName: "Everest Lab Equipments", billId: "vb-2", billNumber: "VB-2025-089", amount: 120000, method: "cheque", chequeNumber: "CHQ-001234", bankAccount: "NMB Bank", status: "approved", processedAt: "", approvedBy: "Ramesh Shrestha", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "de-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vendorId: "vb-1", vendorName: "Himalayan Stationery Suppliers", billId: "vb-1", billNumber: "VB-2025-088", amount: 15000, method: "online", chequeNumber: "", bankAccount: "Global IME", status: "pending", processedAt: "", approvedBy: "", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
  ];
  const bankReconciliations: DBSchema["bankReconciliations"] = [
    { id: "br-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, bankAccountId: "ba-1", bankName: "NMB Bank", statementDate: "2025-08-31", statementBalance: 4875000, bookBalance: 4850000, difference: 25000, matchedEntries: 18, unmatchedEntries: 2, status: "completed", completedAt: "2025-09-01", reconciledBy: "Ramesh Shrestha", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "br-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, bankAccountId: "ba-2", bankName: "Global IME", statementDate: "2025-08-31", statementBalance: 622000, bookBalance: 620000, difference: 2000, matchedEntries: 5, unmatchedEntries: 1, status: "in_progress", completedAt: "", reconciledBy: "", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
  ];
  const bankReconciliationEntries: DBSchema["bankReconciliationEntries"] = [
    { id: "bre-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reconciliationId: "br-1", transactionDate: "2025-08-28", description: "Fee collection deposit", bankAmount: 125000, bookAmount: 125000, status: "matched", matchedEntryId: "pay-1", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "bre-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reconciliationId: "br-1", transactionDate: "2025-08-30", description: "Bank service charge", bankAmount: -2500, bookAmount: 0, status: "unmatched", matchedEntryId: "", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
    { id: "bre-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, reconciliationId: "br-1", transactionDate: "2025-08-31", description: "Vendor payment — Himalayan Stationery", bankAmount: -45000, bookAmount: -45000, status: "matched", matchedEntryId: "de-1", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];
  const bankAccounts: DBSchema["bankAccounts"] = [
    { id: "ba-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, bankName: "NMB Bank", accountNo: "00101010101010", accountName: "Sunrise Public School", balance: 4850000, currency: "NPR", isActive: true, createdOn: "2024-07-16", updatedOn: "2025-09-01" },
    { id: "ba-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, bankName: "Global IME", accountNo: "00202020202020", accountName: "Sunrise Scholarship Fund", balance: 620000, currency: "NPR", isActive: true, createdOn: "2024-07-16", updatedOn: "2025-09-01" },
  ];
  const budgets: DBSchema["budgets"] = [
    { id: "bud-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-2", fiscalYearName: "FY 2082/83", department: "Academic Section", allocatedAmount: 2500000, utilizedAmount: 1800000, status: "approved", createdOn: "2025-07-16", updatedOn: "2025-08-20" },
    { id: "bud-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-2", department: "Administration", allocatedAmount: 1200000, utilizedAmount: 450000, status: "draft", createdOn: "2025-07-16", updatedOn: "2025-07-16" },
  ];
  const accountsReceivable: DBSchema["accountsReceivable"] = [
    { id: "ar-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-2", studentName: "Anita Sharma", grade: "9", invoiceId: "inv-2", invoiceNumber: "INV-2082-002", totalAmount: 45000, paidAmount: 20000, balanceAmount: 25000, dueDate: "2025-08-15", status: "overdue", agingDays: 20, lastReminderDate: "2025-09-01", createdOn: "2025-07-16", updatedOn: "2025-09-01" },
    { id: "ar-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-3", studentName: "Rajesh Adhikari", grade: "7", invoiceId: "inv-3", invoiceNumber: "INV-2082-003", totalAmount: 42000, paidAmount: 10000, balanceAmount: 32000, dueDate: "2025-09-10", status: "overdue", agingDays: 10, lastReminderDate: "2025-09-02", createdOn: "2025-07-16", updatedOn: "2025-09-02" },
    { id: "ar-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-4", studentName: "Priya Tamang", grade: "10", invoiceId: "inv-4", invoiceNumber: "INV-2082-004", totalAmount: 48000, paidAmount: 48000, balanceAmount: 0, dueDate: "2025-07-30", status: "current", agingDays: 0, lastReminderDate: "", createdOn: "2025-07-16", updatedOn: "2025-08-15" },
  ];
  const scholarshipSchemes: DBSchema["scholarshipSchemes"] = [
    { id: "ss-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Merit Scholarship", description: "10% discount for students scoring 90%+ in final exam", discountType: "percentage", discountValue: 10, applicableGrades: ["9", "10", "11", "12"], maxRecipients: 20, currentRecipients: 8, status: "active", validFrom: "2025-04-01", validUntil: "2026-03-31", createdOn: "2025-04-01", updatedOn: "2025-08-15" },
    { id: "ss-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Sibling Discount", description: "5% discount for second child from same family", discountType: "sibling", discountValue: 5, applicableGrades: ["1", "2", "3", "4", "5", "6", "7", "8"], maxRecipients: 50, currentRecipients: 12, status: "active", validFrom: "2025-04-01", validUntil: "2026-03-31", createdOn: "2025-04-01", updatedOn: "2025-08-15" },
    { id: "ss-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Need-Based Fee Waiver", description: "25% fee waiver for economically disadvantaged students", discountType: "need", discountValue: 25, applicableGrades: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], maxRecipients: 10, currentRecipients: 4, status: "active", validFrom: "2025-04-01", validUntil: "2026-03-31", createdOn: "2025-04-01", updatedOn: "2025-08-15" },
  ];
  const onlinePaymentTransactions: DBSchema["onlinePaymentTransactions"] = [
    { id: "opt-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-1", studentId: "s-1", studentName: "Sita Poudel", amount: 42000, gateway: "esewa", transactionRef: "ESW-2082-001", gatewayRef: "ESW-REF-12345", status: "completed", initiatedAt: "2025-08-10T10:30:00", completedAt: "2025-08-10T10:32:15", createdOn: "2025-08-10", updatedOn: "2025-08-10" },
    { id: "opt-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-2", studentId: "s-2", studentName: "Anita Sharma", amount: 20000, gateway: "khalti", transactionRef: "KHI-2082-002", gatewayRef: "", status: "completed", initiatedAt: "2025-08-12T14:15:00", completedAt: "2025-08-12T14:17:30", createdOn: "2025-08-12", updatedOn: "2025-08-12" },
    { id: "opt-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-3", studentId: "s-3", studentName: "Rajesh Adhikari", amount: 10000, gateway: "imepay", transactionRef: "IME-2082-003", gatewayRef: "", status: "pending", initiatedAt: "2025-09-01T09:00:00", completedAt: "", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];
  const refundRecords: DBSchema["refundRecords"] = [
    { id: "rf-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-1", studentId: "s-1", studentName: "Sita Poudel", amount: 5000, reason: "Overpayment correction", approvedBy: "Ramesh Shrestha", status: "processed", processedAt: "2025-08-20", createdOn: "2025-08-18", updatedOn: "2025-08-20" },
    { id: "rf-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, invoiceId: "inv-4", studentId: "s-4", studentName: "Priya Tamang", amount: 2000, reason: "Transport fee reversal", approvedBy: "", status: "pending", processedAt: "", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];
  const writeOffEntries: DBSchema["writeOffEntries"] = [
    { id: "wo-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-5", studentName: "Deepa Rai", invoiceId: "inv-5", amount: 15000, reason: "bad_debt", approvedBy: "Ramesh Shrestha", writtenOffAt: "2025-08-25", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "wo-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-6", studentName: "Nabin Karki", invoiceId: "inv-6", amount: 3000, reason: "scholarship_adjustment", approvedBy: "Sita Karki", writtenOffAt: "2025-09-01", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];
  const dunningNotices: DBSchema["dunningNotices"] = [
    { id: "dn-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-2", studentName: "Anita Sharma", invoiceId: "inv-2", balanceAmount: 25000, level: "reminder", status: "sent", sentAt: "2025-08-25", acknowledgedAt: "", nextActionDate: "2025-09-10", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "dn-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-3", studentName: "Rajesh Adhikari", invoiceId: "inv-3", balanceAmount: 32000, level: "warning", status: "sent", sentAt: "2025-09-02", acknowledgedAt: "", nextActionDate: "2025-09-16", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
    { id: "dn-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, studentId: "s-5", studentName: "Deepa Rai", invoiceId: "inv-5", balanceAmount: 15000, level: "final_notice", status: "escalated", sentAt: "2025-08-20", acknowledgedAt: "", nextActionDate: "2025-09-05", createdOn: "2025-08-20", updatedOn: "2025-09-01" },
  ];

  // ── M13 HR seed ───────────────────────────────────────────────────
  const staffProfiles: DBSchema["staffProfiles"] = [
    { id: "sp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffCode: "EMP-001", name: "Ramesh Shrestha", department: "Leadership", designation: "Principal", joinDate: "2018-04-15", status: "active", createdOn: "2018-04-15", updatedOn: "2025-09-01" },
    { id: "sp-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffCode: "EMP-042", name: "Manoj Rai", department: "Lower Secondary", designation: "Teacher", joinDate: "2020-06-10", status: "active", createdOn: "2020-06-10", updatedOn: "2025-09-01" },
    { id: "sp-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffCode: "EMP-088", name: "Anita Maharjan", department: "ECED", designation: "Coordinator", joinDate: "2019-08-01", status: "on_leave", createdOn: "2019-08-01", updatedOn: "2025-08-20" },
    { id: "sp-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffCode: "EMP-102", name: "Bikash Tamang", department: "Academics", designation: "Teacher", joinDate: "2021-04-12", status: "active", createdOn: "2021-04-12", updatedOn: "2025-09-01" },
  ];
  const positions: DBSchema["positions"] = [
    { id: "pos-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Primary Teacher", department: "Primary Department", grade: "G-7", isVacant: true, headCount: 22, createdOn: "2025-01-10", updatedOn: "2025-08-01" },
    { id: "pos-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Accountant", department: "Finance Office", grade: "G-8", isVacant: false, headCount: 4, createdOn: "2024-07-01", updatedOn: "2025-08-01" },
    { id: "pos-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Science Teacher (+2)", department: "Science Stream", grade: "G-9", isVacant: true, headCount: 9, createdOn: "2025-03-15", updatedOn: "2025-08-01" },
  ];
  const recruitments: DBSchema["recruitments"] = [
    { id: "rec-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, positionId: "pos-1", positionTitle: "Primary Teacher", applicantName: "Sunita Karki", stage: "interviewed", appliedOn: "2025-08-10", createdOn: "2025-08-10", updatedOn: "2025-08-25" },
    { id: "rec-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, positionId: "pos-3", applicantName: "Nabin Joshi", stage: "shortlisted", appliedOn: "2025-08-15", createdOn: "2025-08-15", updatedOn: "2025-08-20" },
    { id: "rec-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, positionId: "pos-1", applicantName: "Deepa Bista", stage: "offered", appliedOn: "2025-08-12", createdOn: "2025-08-12", updatedOn: "2025-08-28" },
  ];
  const leaveRequests: DBSchema["leaveRequests"] = [
    { id: "lr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-2", staffName: "Manoj Rai", leaveType: "casual", fromDate: "2025-09-05", toDate: "2025-09-06", days: 2, status: "approved", reason: "Family function", createdOn: "2025-09-01", updatedOn: "2025-09-02" },
    { id: "lr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-3", staffName: "Anita Maharjan", leaveType: "maternity", fromDate: "2025-08-01", toDate: "2025-10-30", days: 91, status: "approved", reason: "Maternity leave", createdOn: "2025-07-20", updatedOn: "2025-07-22" },
    { id: "lr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-4", staffName: "Bikash Tamang", leaveType: "sick", fromDate: "2025-09-02", toDate: "2025-09-03", days: 2, status: "pending", reason: "Fever", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
  ];
  const performanceReviews: DBSchema["performanceReviews"] = [
    { id: "pr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-2", staffName: "Manoj Rai", period: "2081 Annual", rating: 4.2, reviewer: "Ramesh Shrestha", status: "approved", remarks: "Excellent classroom management", createdOn: "2025-06-15", updatedOn: "2025-06-20" },
    { id: "pr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-4", staffName: "Bikash Tamang", period: "2081 Annual", rating: 3.8, reviewer: "Sita Karki", status: "submitted", createdOn: "2025-06-15", updatedOn: "2025-06-15" },
  ];
  const compensations: DBSchema["compensations"] = [
    { id: "compn-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-1", staffName: "Ramesh Shrestha", component: "basic", amount: 85000, effectiveFrom: "2025-04-15", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "compn-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-2", staffName: "Manoj Rai", component: "allowance", amount: 12000, effectiveFrom: "2025-04-15", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "compn-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-2", staffName: "Manoj Rai", component: "deduction", amount: 5000, effectiveFrom: "2025-04-15", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
  ];
  const payrollRuns: DBSchema["payrollRuns"] = [
    { id: "payr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, month: 8, year: 2025, status: "paid", totalAmount: 620000, runOn: "2025-08-31", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
    { id: "payr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, month: 9, year: 2025, status: "computed", totalAmount: 635000, runOn: "2025-09-02", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
  ];
  const payslips: DBSchema["payslips"] = [
    { id: "ps-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, payrollRunId: "payr-1", payrollMonth: "2025-08", staffRef: "sp-1", staffName: "Ramesh Shrestha", gross: 95000, deductions: 8000, net: 87000, status: "paid", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
    { id: "ps-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, payrollRunId: "payr-1", staffRef: "sp-2", staffName: "Manoj Rai", gross: 48000, deductions: 5000, net: 43000, status: "paid", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
    { id: "ps-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, payrollRunId: "payr-2", staffRef: "sp-2", staffName: "Manoj Rai", gross: 48000, deductions: 5000, net: 43000, status: "draft", createdOn: "2025-09-02", updatedOn: "2025-09-02" },
  ];
  const separations: DBSchema["separations"] = [
    { id: "sep-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-3", staffName: "Anita Maharjan", type: "resignation", lastWorkingDate: "2025-10-30", status: "pending", reason: "Personal reasons", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
    { id: "sep-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-4", staffName: "Bikash Tamang", type: "transfer", lastWorkingDate: "2025-09-15", status: "approved", reason: "Transfer to Bhaktapur branch", createdOn: "2025-08-15", updatedOn: "2025-08-18" },
  ];
  const staffContracts: DBSchema["staffContracts"] = [
    { id: "scn-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-1", staffName: "Ramesh Shrestha", contractType: "permanent", startDate: "2018-04-15", salary: 95000, status: "active", createdOn: "2018-04-15", updatedOn: "2025-04-15" },
    { id: "scn-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-2", staffName: "Manoj Rai", contractType: "permanent", startDate: "2020-06-10", salary: 48000, status: "active", createdOn: "2020-06-10", updatedOn: "2025-04-15" },
    { id: "scn-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, staffRef: "sp-4", staffName: "Bikash Tamang", contractType: "contract", startDate: "2021-04-12", endDate: "2026-04-11", salary: 42000, status: "active", createdOn: "2021-04-12", updatedOn: "2025-04-15" },
  ];

  // ── M16 Library seed ──────────────────────────────────────────────────
  const libraryResources: DBSchema["libraryResources"] = [
    { id: "lr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, accessionNo: "ACC-0001", title: "Hamro Nepali Byakaran", author: "D. R. Pokharel", isbn: "9789937012345", publisher: "Sunrise Publications", publishedYear: 2021, language: "ne", category: "Language", type: "book", shelfRef: "A-01-03", tags: ["nepali", "grammar"], status: "available", createdOn: "2022-04-10", updatedOn: "2025-08-01" },
    { id: "lr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, accessionNo: "ACC-0002", title: "Physics for Class 12", author: "H. C. Verma", isbn: "9788126512340", publisher: "Bharti Bhawan", publishedYear: 2022, language: "en", category: "Science", type: "book", shelfRef: "S-11-02", status: "available", createdOn: "2022-06-12", updatedOn: "2025-08-10" },
    { id: "lr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, accessionNo: "ACC-0003", title: "Journal of Nepal Science", author: "NAST", publisher: "NAST", publishedYear: 2024, language: "en", category: "Research", type: "journal", shelfRef: "J-01-01", status: "restricted", createdOn: "2024-01-20", updatedOn: "2025-07-15" },
    { id: "lr-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, accessionNo: "ACC-0004", title: "Digital Atlas of Nepal", author: "Survey Dept", publisher: "GoN", publishedYear: 2023, language: "en", category: "Geography", type: "digital", shelfRef: "D-02-01", tags: ["maps", "gis"], status: "available", createdOn: "2023-08-05", updatedOn: "2025-08-20" },
  ];
  const libraryHoldings: DBSchema["libraryHoldings"] = [
    { id: "lh-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resourceId: "lr-1", resourceTitle: "Hamro Nepali Byakaran", copyNo: "C-001", barcode: "BC-100001", location: "A-01-03", condition: "good", status: "available", acquiredOn: "2022-04-12", createdOn: "2022-04-12", updatedOn: "2025-08-01" },
    { id: "lh-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resourceId: "lr-1", resourceTitle: "Hamro Nepali Byakaran", copyNo: "C-002", barcode: "BC-100002", location: "A-01-03", condition: "worn", status: "issued", acquiredOn: "2022-04-12", createdOn: "2022-04-12", updatedOn: "2025-08-25" },
    { id: "lh-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resourceId: "lr-2", resourceTitle: "Physics for Class 12", copyNo: "C-001", barcode: "BC-200001", location: "S-11-02", condition: "new", status: "reserved", acquiredOn: "2022-06-14", createdOn: "2022-06-14", updatedOn: "2025-08-28" },
    { id: "lh-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resourceId: "lr-4", resourceTitle: "Digital Atlas of Nepal", copyNo: "C-001", barcode: "BC-400001", location: "D-02-01", condition: "good", status: "available", acquiredOn: "2023-08-10", createdOn: "2023-08-10", updatedOn: "2025-08-20" },
  ];
  const libraryMembers: DBSchema["libraryMembers"] = [
    { id: "lm-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "uid-5", userName: "Manoj Rai", memberType: "staff", cardNo: "LIB-S-001", enrolledOn: "2022-04-15", validUntil: "2026-04-14", status: "active", createdOn: "2022-04-15", updatedOn: "2025-04-15" },
    { id: "lm-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "enrol-1", userName: "Aarav Shrestha", memberType: "student", cardNo: "LIB-ST-882", enrolledOn: "2024-04-15", validUntil: "2026-04-14", status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-01" },
    { id: "lm-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, userRef: "sp-2", userName: "Manoj Rai", memberType: "staff", cardNo: "LIB-S-042", enrolledOn: "2020-06-10", validUntil: "2025-12-31", status: "suspended", createdOn: "2020-06-10", updatedOn: "2025-08-10" },
  ];
  const libraryLoans: DBSchema["libraryLoans"] = [
    { id: "ll-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, memberId: "lm-2", memberName: "Aarav Shrestha", holdingId: "lh-2", resourceTitle: "Hamro Nepali Byakaran", issuedOn: "2025-08-20", dueOn: "2025-09-03", status: "issued", fineAmount: 0, createdOn: "2025-08-20", updatedOn: "2025-08-20" },
    { id: "ll-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, memberId: "lm-1", memberName: "Manoj Rai", holdingId: "lh-1", resourceTitle: "Hamro Nepali Byakaran", issuedOn: "2025-08-01", dueOn: "2025-08-15", returnedOn: "2025-08-14", status: "returned", fineAmount: 0, createdOn: "2025-08-01", updatedOn: "2025-08-14" },
    { id: "ll-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, memberId: "lm-2", memberName: "Aarav Shrestha", holdingId: "lh-3", resourceTitle: "Physics for Class 12", issuedOn: "2025-08-10", dueOn: "2025-08-24", status: "overdue", fineAmount: 150, createdOn: "2025-08-10", updatedOn: "2025-08-25" },
  ];
  const libraryReservations: DBSchema["libraryReservations"] = [
    { id: "lres-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, memberId: "lm-2", memberName: "Aarav Shrestha", resourceId: "lr-2", resourceTitle: "Physics for Class 12", reservedOn: "2025-08-25", expiresOn: "2025-09-01", status: "pending", createdOn: "2025-08-25", updatedOn: "2025-08-25" },
    { id: "lres-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, memberId: "lm-1", memberName: "Manoj Rai", resourceId: "lr-3", resourceTitle: "Journal of Nepal Science", reservedOn: "2025-08-20", status: "ready", createdOn: "2025-08-20", updatedOn: "2025-08-22" },
  ];
  const libraryAcquisitions: DBSchema["libraryAcquisitions"] = [
    { id: "la-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Chemistry Lab Manual 11-12", vendorName: "Himalayan Books", orderNo: "PO-LIB-2025-011", source: "purchase", quantity: 30, unitCost: 850, totalCost: 25500, status: "ordered", orderedOn: "2025-08-18", createdOn: "2025-08-18", updatedOn: "2025-08-18" },
    { id: "la-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, resourceId: "lr-4", title: "Digital Atlas of Nepal", vendorName: "Survey Dept", orderNo: "PO-LIB-2025-009", source: "donation", quantity: 1, unitCost: 0, totalCost: 0, status: "cataloged", orderedOn: "2023-08-01", receivedOn: "2023-08-10", createdOn: "2023-08-10", updatedOn: "2023-08-10" },
    { id: "la-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Nepal Yearbook 2082 Serial", vendorName: "Ekta Books", orderNo: "PO-LIB-2025-012", source: "subscription", quantity: 12, unitCost: 1200, totalCost: 14400, status: "received", orderedOn: "2025-07-01", receivedOn: "2025-08-28", createdOn: "2025-07-01", updatedOn: "2025-08-28" },
  ];
  const digitalResources: DBSchema["digitalResources"] = [
    { id: "dr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Pustakalaya E-Library", provider: "OLE Nepal", url: "https://pustakalaya.org", accessType: "subscription", validFrom: "2025-04-15", validUntil: "2026-04-14", status: "active", createdOn: "2025-04-15", updatedOn: "2025-04-15" },
    { id: "dr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, title: "Khan Academy Nepali", provider: "Khan Academy", url: "https://ne.khanacademy.org", accessType: "open", validFrom: "2024-01-01", status: "active", createdOn: "2024-01-01", updatedOn: "2025-01-01" },
  ];

  // ── M17 Transport seed ────────────────────────────────────────────────
  const vehicles: DBSchema["vehicles"] = [
    { id: "veh-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, registrationNo: "Ba 1 Pa 2345", type: "bus", capacity: 35, driverName: "Hari Bahadur", driverContact: "9841002001", fitnessUntil: "2026-03-15", insuranceUntil: "2026-07-20", permitUntil: "2026-07-20", pollutionUntil: "2025-12-31", status: "active", createdOn: "2023-06-12", updatedOn: "2025-08-01" },
    { id: "veh-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, registrationNo: "Ba 1 Pa 7890", type: "minibus", capacity: 22, driverName: "Shyam Thapa", driverContact: "9841002002", fitnessUntil: "2025-10-15", insuranceUntil: "2025-11-30", permitUntil: "2025-11-30", pollutionUntil: "2025-09-15", status: "maintenance", createdOn: "2021-08-10", updatedOn: "2025-08-28" },
    { id: "veh-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, registrationNo: "Ba 2 Cha 1122", type: "van", capacity: 14, driverName: "Gita Gurung", driverContact: "9841002003", fitnessUntil: "2026-01-20", insuranceUntil: "2026-05-10", permitUntil: "2026-05-10", pollutionUntil: "2026-05-10", status: "active", createdOn: "2022-04-05", updatedOn: "2025-08-15" },
  ];
  const transportRoutes: DBSchema["transportRoutes"] = [
    { id: "tr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "R-01", name: "Baneshwor – Koteshwor Loop", direction: "both", vehicleId: "veh-1", vehicleNo: "Ba 1 Pa 2345", totalDistanceKm: 8.5, estimatedMins: 35, status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-01" },
    { id: "tr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "R-02", name: "Bhaktapur – Baneshwor Express", direction: "pickup", vehicleId: "veh-2", vehicleNo: "Ba 1 Pa 7890", totalDistanceKm: 14.2, estimatedMins: 55, status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-10" },
    { id: "tr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "R-03", name: "Satdobato Feeder", direction: "both", totalDistanceKm: 6.0, estimatedMins: 25, status: "inactive", createdOn: "2024-04-15", updatedOn: "2025-07-20" },
  ];
  const busStops: DBSchema["busStops"] = [
    { id: "bs-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, routeId: "tr-1", routeName: "Baneshwor – Koteshwor Loop", name: "Baneshwor Chowk", sequence: 1, arrivalTime: "06:45", latitude: 27.691, longitude: 85.335, status: "active", createdOn: "2024-04-15", updatedOn: "2024-04-15" },
    { id: "bs-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, routeId: "tr-1", routeName: "Baneshwor – Koteshwor Loop", name: "Koteshwor Chowk", sequence: 2, arrivalTime: "07:00", latitude: 27.678, longitude: 85.35, status: "active", createdOn: "2024-04-15", updatedOn: "2024-04-15" },
    { id: "bs-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, routeId: "tr-2", routeName: "Bhaktapur – Baneshwor Express", name: "Suryabinayak", sequence: 1, arrivalTime: "06:30", latitude: 27.666, longitude: 85.436, status: "active", createdOn: "2024-04-15", updatedOn: "2024-04-15" },
  ];
  const routeSchedules: DBSchema["routeSchedules"] = [
    { id: "rs-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, routeId: "tr-1", routeName: "Baneshwor – Koteshwor Loop", dayPattern: "Mon-Sat", departureTime: "06:45", arrivalTime: "07:30", status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-01" },
    { id: "rs-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, routeId: "tr-2", routeName: "Bhaktapur – Baneshwor Express", dayPattern: "Mon-Fri", departureTime: "06:30", arrivalTime: "07:35", status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-01" },
  ];
  const riderAssignments: DBSchema["riderAssignments"] = [
    { id: "ra-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, riderRef: "enrol-1", riderName: "Aarav Shrestha", riderType: "student", routeId: "tr-1", routeName: "Baneshwor – Koteshwor Loop", stopId: "bs-1", stopName: "Baneshwor Chowk", vehicleId: "veh-1", pickupTime: "06:45", status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-01" },
    { id: "ra-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, riderRef: "sp-2", riderName: "Manoj Rai", riderType: "staff", routeId: "tr-2", routeName: "Bhaktapur – Baneshwor Express", stopId: "bs-3", stopName: "Suryabinayak", pickupTime: "06:30", status: "active", createdOn: "2024-04-15", updatedOn: "2025-08-01" },
    { id: "ra-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, riderRef: "enrol-2", riderName: "Sita Kumari", riderType: "student", routeId: "tr-1", routeName: "Baneshwor – Koteshwor Loop", stopId: "bs-2", stopName: "Koteshwor Chowk", pickupTime: "07:00", status: "pending", createdOn: "2025-08-10", updatedOn: "2025-08-10" },
  ];
  const boardingLogs: DBSchema["boardingLogs"] = [
    { id: "bl-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, riderAssignmentId: "ra-1", riderName: "Aarav Shrestha", routeId: "tr-1", vehicleId: "veh-1", logDate: "2025-08-31", boardingStatus: "boarded", recordedOn: "2025-08-31T06:46:00", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
    { id: "bl-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, riderAssignmentId: "ra-2", riderName: "Manoj Rai", routeId: "tr-2", vehicleId: "veh-2", logDate: "2025-08-31", boardingStatus: "absent", recordedOn: "2025-08-31T06:35:00", remarks: "Informed leave", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
  ];
  const gpsTracks: DBSchema["gpsTracks"] = [
    { id: "gps-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vehicleId: "veh-1", vehicleNo: "Ba 1 Pa 2345", latitude: 27.6915, longitude: 85.335, speedKmph: 28, heading: 90, status: "moving", trackedOn: "2025-08-31T06:50:00", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
    { id: "gps-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vehicleId: "veh-2", vehicleNo: "Ba 1 Pa 7890", latitude: 27.670, longitude: 85.430, speedKmph: 0, status: "stopped", trackedOn: "2025-08-31T06:55:00", createdOn: "2025-08-31", updatedOn: "2025-08-31" },
  ];
  const vehicleMaintenance: DBSchema["vehicleMaintenance"] = [
    { id: "vm-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vehicleId: "veh-2", vehicleNo: "Ba 1 Pa 7890", type: "service", description: "Quarterly engine service", cost: 18000, odometerKm: 45200, performedOn: "2025-08-20", nextDueOn: "2025-11-20", status: "completed", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
    { id: "vm-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vehicleId: "veh-1", vehicleNo: "Ba 1 Pa 2345", type: "fuel", description: "Diesel refill 60L", cost: 9800, odometerKm: 38900, performedOn: "2025-08-30", status: "completed", createdOn: "2025-08-30", updatedOn: "2025-08-30" },
    { id: "vm-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, vehicleId: "veh-2", vehicleNo: "Ba 1 Pa 7890", type: "repair", description: "Brake pad replacement", cost: 6500, status: "scheduled", createdOn: "2025-08-28", updatedOn: "2025-08-28" },
  ];

  // ── M12.19–M12.24 seed data ─────────────────────────────────────────────
  const commitmentRecords: DBSchema["commitmentRecords"] = [
    { id: "cr-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, donorName: "Himalayan Foundation", fundName: "Infrastructure Fund", amount: 2500000, pledgeDate: "2025-03-15", expectedDate: "2025-06-30", receivedDate: "2025-06-28", status: "received", remarks: "Building renovation project", createdOn: "2025-03-15", updatedOn: "2025-06-28" },
    { id: "cr-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, donorName: "Sharma Education Trust", fundName: "Scholarship Fund", amount: 500000, pledgeDate: "2025-07-10", expectedDate: "2025-09-30", receivedDate: "", status: "pledged", remarks: "Annual scholarship for underprivileged students", createdOn: "2025-07-10", updatedOn: "2025-07-10" },
    { id: "cr-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, donorName: "Rai Family Trust", fundName: "Library Fund", amount: 150000, pledgeDate: "2025-08-01", expectedDate: "2025-10-15", receivedDate: "", status: "pledged", remarks: "Library book acquisition", createdOn: "2025-08-01", updatedOn: "2025-08-01" },
  ];
  const taxCodes: DBSchema["taxCodes"] = [
    { id: "tc-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "VAT-13", name: "VAT 13%", type: "vat", rate: 13, isExempt: false, description: "Standard VAT rate on goods and services", createdOn: "2025-01-01", updatedOn: "2025-01-01" },
    { id: "tc-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "WHT-10", name: "Withholding Tax 10%", type: "withholding", rate: 10, isExempt: false, description: "WHT on contractor payments", createdOn: "2025-01-01", updatedOn: "2025-01-01" },
    { id: "tc-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "EXEMPT", name: "Tax Exempt", type: "vat", rate: 0, isExempt: true, description: "Educational services exempt from VAT", createdOn: "2025-01-01", updatedOn: "2025-01-01" },
    { id: "tc-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, code: "WHT-5", name: "WHT on Rent 5%", type: "withholding", rate: 5, isExempt: false, description: "Withholding tax on rental payments", createdOn: "2025-01-01", updatedOn: "2025-01-01" },
  ];
  const accrualEntries: DBSchema["accrualEntries"] = [
    { id: "ae-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", entryDate: "2025-08-15", description: "Electricity expense accrual — Shrawan", debitAccount: "5100-Utilities", creditAccount: "2100-Accrued Liabilities", amount: 45000, reversesOn: "2025-09-15", status: "posted", createdOn: "2025-08-15", updatedOn: "2025-08-15" },
    { id: "ae-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", entryDate: "2025-08-20", description: "Teacher salary accrual — last week of Shrawan", debitAccount: "5200-Salaries", creditAccount: "2100-Accrued Liabilities", amount: 320000, reversesOn: "2025-09-20", status: "posted", createdOn: "2025-08-20", updatedOn: "2025-08-20" },
  ];
  const funds: DBSchema["funds"] = [
    { id: "fund-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "General Fund", code: "GF-01", type: "general", balance: 8500000, isRestricted: false, description: "Unrestricted general operations fund", createdOn: "2025-01-01", updatedOn: "2025-08-31" },
    { id: "fund-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Building Construction Fund", code: "BCF-01", type: "restricted", balance: 2500000, isRestricted: true, description: "Restricted fund for new building construction", createdOn: "2025-03-15", updatedOn: "2025-08-31" },
    { id: "fund-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "Library Endowment", code: "LE-01", type: "endowment", balance: 1200000, isRestricted: true, description: "Endowment fund for library resources", createdOn: "2025-06-01", updatedOn: "2025-08-31" },
    { id: "fund-4", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, name: "STEM Lab Project", code: "SLP-01", type: "project", balance: 750000, isRestricted: true, description: "Project fund for science lab equipment", createdOn: "2025-07-01", updatedOn: "2025-08-31" },
  ];
  const periodCloseChecklists: DBSchema["periodCloseChecklists"] = [
    { id: "pc-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", periodName: "Shrawan 2082", closedOn: "2025-08-10", totalJournalEntries: 42, postedEntries: 42, reconciliationsComplete: true, accrualsComplete: true, status: "closed", closedBy: "Laxmi Poudel", createdOn: "2025-08-10", updatedOn: "2025-08-10" },
    { id: "pc-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", periodName: "Bhadra 2082", closedOn: "", totalJournalEntries: 38, postedEntries: 35, reconciliationsComplete: false, accrualsComplete: false, status: "closing", closedBy: "", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];
  const financialStatements: DBSchema["financialStatements"] = [
    { id: "fs-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", name: "Balance Sheet — Shrawan 2082", type: "balance_sheet", asOfDate: "2025-08-14", totalDebit: 15200000, totalCredit: 15200000, status: "final", generatedBy: "Laxmi Poudel", createdOn: "2025-08-15", updatedOn: "2025-08-15" },
    { id: "fs-2", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", name: "Income Statement — Shrawan 2082", type: "income_statement", asOfDate: "2025-08-14", totalDebit: 3200000, totalCredit: 3200000, status: "final", generatedBy: "Laxmi Poudel", createdOn: "2025-08-15", updatedOn: "2025-08-15" },
    { id: "fs-3", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id, fiscalYearId: "fy-1", fiscalYearName: "2082 BS", name: "Trial Balance — Bhadra 2082", type: "trial_balance", asOfDate: "2025-09-01", totalDebit: 16500000, totalCredit: 16500000, status: "draft", generatedBy: "Laxmi Poudel", createdOn: "2025-09-01", updatedOn: "2025-09-01" },
  ];

  // ── M11 Portal Profiles seed ────────────────────────────────────────────
  const studentPortalProfiles: DBSchema["studentPortalProfiles"] = [
    {
      id: "spp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id,
      studentId: "stu-001", studentName: "Aakash Khadka", grade: "10", section: "A",
      enrolledSubjects: ["Mathematics", "Science", "English", "Nepali", "Social Studies"],
      upcomingExams: ["Mid-Term Mathematics", "Science Lab Practical"],
      attendanceSummary: { present: 142, absent: 3, late: 5 },
      feeBalance: 12500,
      lastResults: ["Unit Test 1: 3.6 GPA", "Pre-Board: 3.7 GPA"],
      dashboardConfig: { attendance: true, results: true, fees: true, schedule: true },
      createdOn: "2025-04-01", updatedOn: "2025-08-30",
    },
  ];

  const parentPortalProfiles: DBSchema["parentPortalProfiles"] = [
    {
      id: "ppp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id,
      parentName: "Deepa Khadka", relation: "Mother",
      wardIds: ["stu-001"], wardNames: ["Aakash Khadka"],
      linkedSince: "2024-04-15",
      notificationPrefs: { sms: true, email: true, push: true },
      dashboardConfig: { attendance: true, results: true, fees: true, communication: true },
      createdOn: "2024-04-15", updatedOn: "2025-08-30",
    },
  ];

  const teacherPortalProfiles: DBSchema["teacherPortalProfiles"] = [
    {
      id: "tp-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id,
      teacherId: "sp-1", teacherName: "Sunita Basnet",
      assignedSections: ["10-A"], assignedSubjects: ["Mathematics", "Physics"],
      classesToday: 5, pendingGrading: 12,
      pendingLeaves: 2, advisorStudents: 35,
      dashboardConfig: { attendance: true, grading: true, leaves: true, workload: true },
      createdOn: "2024-04-01", updatedOn: "2025-08-30",
    },
  ];

  const managementDashboards: DBSchema["managementDashboards"] = [
    {
      id: "md-1", tenantId: tenants[0]!.id, schoolId: campuses[0]!.id,
      totalStudents: 1468, totalStaff: 173,
      attendanceRate: 94.5, feeCollectionRate: 87.2,
      activeVehicles: 3, pendingAdmissions: 28,
      openTickets: 5, upcomingEvents: 3,
      kpiWidgets: ["enrollment", "attendance", "finance", "transport", "admissions"],
      createdOn: "2025-04-01", updatedOn: "2025-08-30",
    },
  ];

  // ── M19 Student Services seed data ────────────────────────────────────────

  const healthProfiles: DBSchema["healthProfiles"] = [
    { id: "hp-1", studentName: "Bikash Gurung", studentRef: "stu-3", allergies: "Peanuts, Dust", conditions: "Mild Asthma", medications: "Salbutamol inhaler PRN", emergencyContact: "+977-9861003003", bloodGroup: "B+", sensitivity: "Avoid dusty environments", status: "active", createdOn: "2025-04-15" },
    { id: "hp-2", studentName: "Anisha Maharjan", studentRef: "stu-4", allergies: "None", conditions: "Recurrent tonsillitis", medications: "Amoxicillin 250mg TDS when infected", emergencyContact: "+977-9841004004", bloodGroup: "O+", sensitivity: "None", status: "active", createdOn: "2025-04-15" },
    { id: "hp-3", studentName: "Ram Bahadur Shrestha", studentRef: "stu-1", allergies: "Shellfish", conditions: "None", medications: "None", emergencyContact: "+977-9841001001", bloodGroup: "A+", sensitivity: "Food allergy — carry antihistamine", status: "active", createdOn: "2025-04-15" },
  ];

  const clinicVisits: DBSchema["clinicVisits"] = [
    { id: "cv-1", studentName: "Bikash Gurung", studentRef: "stu-3", visitDate: "2025-08-15", practitioner: "Nurse Sabina Dulal", reason: "Asthma episode during assembly", diagnosis: "Exercise-induced bronchospasm", treatment: "Administered Salbutamol inhaler, rested 30 mins", followUp: "Review inhaler availability in school nurse's office", status: "closed", createdOn: "2025-08-15" },
    { id: "cv-2", studentName: "Anisha Maharjan", studentRef: "stu-4", visitDate: "2025-09-01", practitioner: "Nurse Sabina Dulal", reason: "Sore throat and fever", diagnosis: "Viral pharyngitis", treatment: "Paracetamol 500mg, warm saline gargle advised", followUp: "Return if fever persists beyond 3 days", status: "closed", createdOn: "2025-09-01" },
    { id: "cv-3", studentName: "Ram Bahadur Shrestha", studentRef: "stu-1", visitDate: "2025-09-03", practitioner: "Nurse Sabina Dulal", reason: "Scraped knee during PT period", diagnosis: "Minor abrasion — left knee", treatment: "Cleaned wound, applied antiseptic and bandage", followUp: "None required", status: "closed", createdOn: "2025-09-03" },
  ];

  const counselingCases: DBSchema["counselingCases"] = [
    { id: "cc-1", studentName: "Bikash Gurung", studentRef: "stu-3", caseType: "academic", severity: "medium", status: "in_progress", assignedTo: "Sabina Dulal", description: "Declining grades in Mathematics; reports difficulty concentrating at home due to family financial stress", createdOn: "2025-08-20" },
    { id: "cc-2", studentName: "Ram Bahadur Shrestha", studentRef: "stu-1", caseType: "behavioral", severity: "low", status: "open", assignedTo: "Sabina Dulal", description: "Minor classroom disruptions reported by class teacher; possible attention-seeking behavior", createdOn: "2025-09-01" },
    { id: "cc-3", studentName: "Sita Kumari Thapa", studentRef: "stu-2", caseType: "safeguarding", severity: "high", status: "escalated", assignedTo: "Rekha Bhandari", description: "Student disclosed peer bullying incident; referred to safeguarding lead for investigation", createdOn: "2025-09-02" },
  ];

  const supportNeeds: DBSchema["supportNeeds"] = [
    { id: "sn-1", studentName: "Bikash Gurung", studentRef: "stu-3", category: "learning", description: "Mild dyslexia identified — requires additional reading support and extended time for written examinations", identifiedDate: "2025-05-10", status: "active", createdOn: "2025-05-10" },
    { id: "sn-2", studentName: "Anisha Maharjan", studentRef: "stu-4", category: "medical", description: "Recurrent tonsillitis — school nurse to monitor and ensure timely medication administration during infections", identifiedDate: "2025-06-15", status: "active", createdOn: "2025-06-15" },
  ];

  const conductIncidents: DBSchema["conductIncidents"] = [
    { id: "ci-1", studentName: "Ram Bahadur Shrestha", studentRef: "stu-1", incidentDate: "2025-08-28", category: "minor", description: "Used mobile phone during class — first warning for electronic device policy violation", reportedBy: "Manoj Rai", location: "Room 201", status: "resolved", createdOn: "2025-08-28" },
    { id: "ci-2", studentName: "Sita Kumari Thapa", studentRef: "stu-2", incidentDate: "2025-09-01", category: "major", description: "Verbal altercation with classmate during lunch break; both students involved in shouting match", reportedBy: "Deepak Adhikari", location: "Canteen Area", status: "investigating", createdOn: "2025-09-01" },
  ];

  const grievances: DBSchema["grievances"] = [
    { id: "grv-1", complainantName: "Hari Prasad Shrestha", complainantType: "parent", category: "facilities", description: "Complaint about insufficient ventilation in Room 101 during summer months — children feel unwell", receivedDate: "2025-08-20", assignedTo: "Manoj Rai", status: "investigating", createdOn: "2025-08-20" },
    { id: "grv-2", complainantName: "Kamala Thapa", complainantType: "parent", category: "academic", description: "Concern about Class 10 Mathematics syllabus pace — daughter struggling to keep up with unit tests every two weeks", receivedDate: "2025-09-01", assignedTo: "Sita Karki", status: "acknowledged", createdOn: "2025-09-01" },
  ];

  const advisingAssignments: DBSchema["advisingAssignments"] = [
    { id: "adv-1", studentName: "Bikash Gurung", studentRef: "stu-3", advisorName: "Manoj Rai", advisorRef: "uid-5", validFrom: "2025-04-15", validTo: "2026-04-14", status: "active", createdOn: "2025-04-15" },
    { id: "adv-2", studentName: "Sita Kumari Thapa", studentRef: "stu-2", advisorName: "Manoj Rai", advisorRef: "uid-5", validFrom: "2025-04-15", validTo: "2026-04-14", status: "active", createdOn: "2025-04-15" },
  ];

  // ── M20 Activities & Community seed data ──────────────────────────────────

  const communityEvents: DBSchema["communityEvents"] = [
    { id: "evt-1", name: "Dashain Cultural Program", type: "cultural", startDate: "2026-10-10", endDate: "2026-10-10", venue: "Assembly Hall", capacity: 400, registered: 320, description: "Annual Dashain celebration with cultural performances by students", status: "planned", createdOn: "2026-09-01" },
    { id: "evt-2", name: "Inter-house Cricket Tournament", type: "sports", startDate: "2025-11-15", endDate: "2025-11-20", venue: "Main Sports Field", capacity: 200, registered: 180, description: "Annual inter-house cricket competition for all secondary students", status: "completed", createdOn: "2025-10-15" },
    { id: "evt-3", name: "Science Exhibition 2082", type: "academic", startDate: "2025-09-20", endDate: "2025-09-21", venue: "Computer Laboratory", capacity: 150, registered: 112, description: "Student science project exhibition open to parents and community", status: "completed", createdOn: "2025-09-01" },
  ];

  const activityGroups: DBSchema["activityGroups"] = [
    { id: "ag-1", name: "Science Club", type: "club", code: "SCI-CLUB", description: "Hands-on experiments, science fairs and STEM activities for curious minds", advisorName: "Nabin Joshi", memberCount: 32, status: "active", createdOn: "2024-04-15" },
    { id: "ag-2", name: "Music Society", type: "society", code: "MUS-SOC", description: "School choir, instrument practice and cultural music performances", advisorName: "Sunita Bajracharya", memberCount: 24, status: "active", createdOn: "2024-04-15" },
    { id: "ag-3", name: "Debate Team", type: "team", code: "DEB-TEAM", description: "Competitive debate in English and Nepali; inter-school tournament preparation", advisorName: "Deepak Adhikari", memberCount: 18, status: "active", createdOn: "2024-06-01" },
  ];

  const competitions: DBSchema["competitions"] = [
    { id: "comp-1", name: "Inter-school Cricket Tournament", sport: "Cricket", level: "district", startDate: "2025-11-25", endDate: "2025-11-28", venue: "Bhaktapur Cricket Ground", status: "planned", createdOn: "2025-10-01" },
    { id: "comp-2", name: "Annual Science Fair", sport: "General Science", level: "zone", startDate: "2025-12-10", endDate: "2025-12-11", venue: "Sunrise Public School Assembly Hall", status: "planned", createdOn: "2025-10-15" },
  ];

  const trips: DBSchema["trips"] = [
    { id: "trip-1", name: "Chitwan Study Tour", destination: "Chitwan National Park", startDate: "2025-12-05", endDate: "2025-12-08", purpose: "Biology field study — wildlife and ecology observation", maxStudents: 40, enrolledStudents: 35, cost: 8500, status: "approved", createdOn: "2025-10-20" },
    { id: "trip-2", name: "Hiking Excursion", destination: "Chandragiri Hills", startDate: "2025-11-08", endDate: "2025-11-08", purpose: "Physical fitness and team building for Class 10 students", maxStudents: 45, enrolledStudents: 42, cost: 1200, status: "completed", createdOn: "2025-10-01" },
  ];

  const ptmEvents: DBSchema["ptmEvents"] = [
    { id: "ptm-1", name: "Term 2 Parent-Teacher Meeting", startDate: "2025-10-15", endDate: "2025-10-15", venue: "Classroom Blocks", totalSlots: 150, bookedSlots: 132, status: "completed", createdOn: "2025-09-25" },
    { id: "ptm-2", name: "SEE Preparation PTM", startDate: "2026-01-10", endDate: "2026-01-10", venue: "Assembly Hall", totalSlots: 80, bookedSlots: 45, status: "planned", createdOn: "2025-12-15" },
  ];

  const fundraisingCampaigns: DBSchema["fundraisingCampaigns"] = [
    { id: "fr-1", name: "Library Book Fund 2082", purpose: "Purchase 500 new books for school library renovation", targetAmount: 500000, raisedAmount: 375000, startDate: "2025-07-01", endDate: "2025-12-31", status: "active", createdOn: "2025-07-01" },
    { id: "fr-2", name: "STEM Lab Equipment Drive", purpose: "Upgrade physics and chemistry lab equipment for +2 Science", targetAmount: 800000, raisedAmount: 200000, startDate: "2025-09-01", endDate: "2026-03-31", status: "active", createdOn: "2025-09-01" },
  ];

  const donations: DBSchema["donations"] = [
    { id: "don-1", campaignRef: "fr-1", donorName: "Himalayan Foundation", amount: 200000, donatedDate: "2025-08-10", method: "bank_transfer", receiptNo: "RCP-DON-001", status: "receipted", createdOn: "2025-08-10" },
    { id: "don-2", campaignRef: "fr-1", donorName: "Rai Family Trust", amount: 100000, donatedDate: "2025-09-05", method: "cheque", receiptNo: "RCP-DON-002", status: "receipted", createdOn: "2025-09-05" },
    { id: "don-3", campaignRef: "fr-2", donorName: "Sharma Education Trust", amount: 200000, donatedDate: "2025-09-15", method: "bank_transfer", receiptNo: "RCP-DON-003", status: "acknowledged", createdOn: "2025-09-15" },
  ];

  // ── M21 Senior Secondary seed data ────────────────────────────────────────

  const subjectCombinationRules: DBSchema["subjectCombinationRules"] = [
    { id: "scr-1", board: "NEB", grade: "11", stream: "Science", compulsorySubjects: "English, Nepali, Physics, Chemistry", optionalSubjects: "Biology, Mathematics, Computer Science", maxOptional: 1, version: 1, status: "active", createdOn: "2025-04-01" },
    { id: "scr-2", board: "NEB", grade: "11", stream: "Management", compulsorySubjects: "English, Nepali, Accountancy, Economics", optionalSubjects: "Business Studies, Mathematics, Computer Science", maxOptional: 1, version: 1, status: "active", createdOn: "2025-04-01" },
  ];

  const studentSubjectPlans: DBSchema["studentSubjectPlans"] = [
    { id: "ssp-1", studentName: "Sita Kumari Thapa", studentRef: "stu-2", stream: "Science", subjects: "English, Nepali, Physics, Chemistry, Computer Science", validFrom: "2025-04-15", validTo: "2027-03-31", status: "active", createdOn: "2025-04-15" },
    { id: "ssp-2", studentName: "Bikash Gurung", studentRef: "stu-3", stream: "Management", subjects: "English, Nepali, Accountancy, Economics, Business Studies", validFrom: "2025-04-15", validTo: "2027-03-31", status: "draft", createdOn: "2025-04-20" },
  ];

  const boardRegistrations: DBSchema["boardRegistrations"] = [
    { id: "br-1", studentName: "Sita Kumari Thapa", studentRef: "stu-2", board: "NEB", session: "2082-2084", symbolNo: "SY-2704-0118-001", registrationNo: "REG-NEB-2082-0419", subjects: "English, Nepali, Physics, Chemistry, Computer Science", status: "registered", createdOn: "2025-05-01" },
    { id: "br-2", studentName: "Bikash Gurung", studentRef: "stu-3", board: "NEB", session: "2082-2084", symbolNo: "SY-2704-0118-002", registrationNo: "REG-NEB-2082-0420", subjects: "English, Nepali, Accountancy, Economics, Business Studies", status: "pending", createdOn: "2025-05-10" },
  ];

  const guidanceProfiles: DBSchema["guidanceProfiles"] = [
    { id: "gp-1", studentName: "Sita Kumari Thapa", studentRef: "stu-2", interests: "Physics, Programming, Space Science", careerGoals: "Pursue B.Sc. in Computer Engineering at Pulchowk Campus", aptitudeNotes: "Strong analytical skills; excellent performance in Physics and Mathematics", consentGiven: true, status: "active", createdOn: "2025-06-01" },
    { id: "gp-2", studentName: "Bikash Gurung", studentRef: "stu-3", interests: "Business, Social Media Marketing, Entrepreneurship", careerGoals: "Study BBS and eventually start a tech startup in Nepal", aptitudeNotes: "Creative thinker; good communication skills; needs academic support in Mathematics", consentGiven: true, status: "active", createdOn: "2025-06-15" },
  ];

  const externalApplications: DBSchema["externalApplications"] = [
    { id: "ea-1", studentName: "Sita Kumari Thapa", studentRef: "stu-2", destination: "Pulchowk Campus — B.Sc. Computer Engineering", deadline: "2027-07-15", applicationDate: "2026-06-01", documents: "SEE Transcript, Character Certificate, Citizenship Copy, Photos", status: "preparing", createdOn: "2026-06-01" },
    { id: "ea-2", studentName: "Bikash Gurung", studentRef: "stu-3", destination: "Kathmandu University — BBS", deadline: "2027-08-01", applicationDate: "2026-07-15", documents: "SEE Transcript, Character Certificate, Photos", status: "preparing", createdOn: "2026-07-15" },
  ];

  const schoolExitCases: DBSchema["schoolExitCases"] = [
    { id: "sec-1", studentName: "Anisha Maharjan", studentRef: "stu-4", leavingType: "transfer", lastWorkingDate: "2026-03-31", reason: "Family relocating to Lalitpur — transferring to school near new residence", clearanceStatus: "in_progress", status: "submitted", createdOn: "2026-03-15" },
    { id: "sec-2", studentName: "Kiran Bhandari", studentRef: "stu-5", leavingType: "withdrawal", lastWorkingDate: "2026-06-30", reason: "Guardian decided to enroll student in boarding school in home district", clearanceStatus: "not_started", status: "draft", createdOn: "2026-06-01" },
  ];

  const formerStudents: DBSchema["formerStudents"] = [
    { id: "fs-1", studentName: "Nabin Karki", studentRef: "stu-ext-1", completionYear: 2081, lastClass: "Class 12 Science", contactEmail: "nabin.karki@gmail.com", contactPhone: "+977-9841055555", status: "active", createdOn: "2025-04-01" },
    { id: "fs-2", studentName: "Priya Tamang", studentRef: "stu-ext-2", completionYear: 2080, lastClass: "Class 12 Management", contactEmail: "priya.t@outlook.com", contactPhone: "+977-9851066666", status: "active", createdOn: "2024-04-01" },
  ];

  return {
    tenants, institution, legalEntities, campuses, orgUnits, locations,
    holidays, calendarYears, locale, sequences, featureFlags, configVersions, audit,
    userIdentities, authSessions, authFactors, roles, userRoles, dataScopes,
    delegations, impersonationLogs, dutyRules, dutyViolations, privilegedAccess, accessReviews,
    // M03
    academicYears, terms, schoolLevels, gradeClasses, streams,
    subjects, curriculumOfferings, sections, houses, cohorts,
    gradingScales, promotionRules, completionRules, academicPolicies,
    // M04
    campaigns, enquiries, enquiryInteractions, applications, applicationChoices,
    applicationDocuments, eligibilityDecisions, selectionEvents, selectionScores,
    offers, offerAcceptances, conversionCases, conversionSteps,
    // M05
    persons, students, guardians, studentGuardians, studentDocuments,
    enrolments, subjectSelections, studentMovements, progressionAudits,
    studentHolds, clearanceCases, clearanceResponses, identityCards,
    // M06
    curriculumMaps, learningOutcomes, syllabusPlans, contentPlanItems,
    teachingAssignments, lessonPlans, coverageEntries, workloadAllocations,
    qualityReviews, qualityEvidences, moderationReviews, reviewActions,
    // M07
    timetables, timetableSlots, timetableAssignments, substitutions,
    attendanceSessions, studentAttendances, attendanceCorrections, attendanceAlerts,
    shifts, staffRosters, timeEntries, timeAdjustments,
    // M08
    assessments, assessmentComponents, questions, examPapers, exams, examRegistrations,
    examRooms, seatAllocations, invigilationDuties, markEntries, moderationRecords,
    practicalExams, integrityCases, recheckRequests,
    // M09
    resultRuns, resultLines, resultPublications, resultCorrections, marksheets,
    transcripts, certificates, certificateRequests, digitalCredentials, completionRecords,
    // M11
    portalAnnouncements, portalAccessLogs, kioskSessions, mobileDevices, offlineSyncLogs,
    accessibilityProfiles, portalTickets,
    studentPortalProfiles, parentPortalProfiles, teacherPortalProfiles, managementDashboards,
    // M12
    fiscalYears, chartOfAccounts, journalEntries, feeStructures, feeAssignments,
    invoices, payments, creditNotes, vendorBills, expenseClaims, recurringJournals, disbursementEntries, bankReconciliations, bankReconciliationEntries, bankAccounts, budgets,
    accountsReceivable, scholarshipSchemes, onlinePaymentTransactions, refundRecords, writeOffEntries, dunningNotices,
    commitmentRecords, taxCodes, accrualEntries, funds, periodCloseChecklists, financialStatements,
    // M13
    staffProfiles, positions, recruitments, leaveRequests, performanceReviews,
    compensations, payrollRuns, payslips, separations, staffContracts,
    // M16
    libraryResources, libraryHoldings, libraryMembers, libraryLoans, libraryReservations,
    libraryAcquisitions, digitalResources,
    // M17
    vehicles, transportRoutes, busStops, routeSchedules, riderAssignments,
    boardingLogs, gpsTracks, vehicleMaintenance,
    // M19
    healthProfiles, clinicVisits, counselingCases, supportNeeds,
    conductIncidents, grievances, advisingAssignments,
    // M20
    communityEvents, activityGroups, competitions, trips,
    ptmEvents, fundraisingCampaigns, donations,
    // M21
    subjectCombinationRules, studentSubjectPlans, boardRegistrations,
    guidanceProfiles, externalApplications, schoolExitCases, formerStudents,
  };
}
