import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Network, Landmark, MapPin, CalendarRange,
  ToggleLeft, School, Blocks,
  // M02 icons
  Users, KeyRound, ShieldCheck, ArrowRightLeft, ShieldAlert, Crown,
  // M03 icons
  CalendarDays, Layers, BookOpen, Award, FileText,
  // M04+M05 icons
  Megaphone, ClipboardCheck, UserCheck, GraduationCap, ShieldBan,
  // M06 icons
  Target, ScrollText, NotebookPen, Clock, CheckCircle, UsersRound,
  // M07 icons
  CalendarClock, Repeat2, ClipboardList, FilePenLine, Clock3, BellRing,
  // M08 icons
  FileText as FileTextM08, HelpCircle, FileCheck, Building2, Scale, FlaskConical, RefreshCw,
  // M09 icons
  BadgeCheck, Trophy,
  // M11 icons
  Monitor, Smartphone, Accessibility, Ticket,
  // M12 icons
  Receipt, Wallet, Tag, PiggyBank, DollarSign, Briefcase, UserPlus, CalendarOff, Calculator,
  CreditCard, RotateCcw, Bell, Banknote, PieChart, Percent, Lock, FileBarChart, Repeat,
  // M16 icons
  Package,
  // M17 icons
  Bus, Route, Navigation, Wrench,
  // M19-M21 icons
  Heart, Shield, AlertCircle, Map, MessageSquare, Compass, FileOutput,
  // M22 icons
  CalendarCheck, Key, Zap, ShieldCheck as ShieldCheckM22,
  // M23 icons
  MessageCircle, GitBranch, PenTool, Archive, Settings,
  // M24 icons
  LayoutDashboard as LayoutDashboardM24, Binary, Database, Brain,
  // M10 icons
  FileStack, Plug, TrendingUp, Utensils,
  // M14 icons
  ShoppingCart, PackageCheck, FileSignature,
  // M15 icons
  TrendingDown,
  // M18 icons
  Home,
  // Logout
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, canAccess, logout, type UserRole } from "@/lib/role-permissions";

interface NavItem {
  to: string;
  label: string;
  labelNe: string;
  icon: React.ComponentType<{ className?: string }>;
  micro?: string;
  end?: boolean;
}

const m01Nav: NavItem[] = [
  { to: "/", label: "Dashboard", labelNe: "डास्बोर्ड", icon: LayoutDashboard, end: true },
  { to: "/tenants", label: "Tenants & Subscriptions", labelNe: "किरायेदार", icon: Blocks, micro: "M01.01" },
  { to: "/institution", label: "Institution & Campuses", labelNe: "विद्यालय", icon: Landmark, micro: "M01.02" },
  { to: "/organization", label: "Organization Structure", labelNe: "संरचना", icon: Network, micro: "M01.03" },
  { to: "/locations", label: "Facilities & Locations", labelNe: "स्थान", icon: MapPin, micro: "M01.04" },
  { to: "/calendar", label: "Calendar & Numbering", labelNe: "पात्रो", icon: CalendarRange, micro: "M01.05" },
  { to: "/features", label: "Features & Policies", labelNe: "सुविधा", icon: ToggleLeft, micro: "M01.06" },
];

const m02Nav: NavItem[] = [
  { to: "/identity", label: "Identity Lifecycle", labelNe: "पहिचान", icon: Users, micro: "M02.01" },
  { to: "/auth", label: "Authentication", labelNe: "प्रमाणीकरण", icon: KeyRound, micro: "M02.02" },
  { to: "/rbac", label: "RBAC & Data Scope", labelNe: "भूमिका", icon: ShieldCheck, micro: "M02.03" },
  { to: "/delegation", label: "Delegation", labelNe: "प्रतिनिधित्व", icon: ArrowRightLeft, micro: "M02.04" },
  { to: "/duties", label: "Segregation of Duties", labelNe: "कर्तव्य", icon: ShieldAlert, micro: "M02.05" },
  { to: "/privileges", label: "Privileged Access", labelNe: "विशेष पहुँच", icon: Crown, micro: "M02.06" },
];

const m03Nav: NavItem[] = [
  { to: "/academic-year", label: "Academic Year", labelNe: "शैक्षिक वर्ष", icon: CalendarDays, micro: "M03.01" },
  { to: "/levels", label: "Levels & Grades", labelNe: "तह तथा कक्षा", icon: Layers, micro: "M03.02" },
  { to: "/subjects", label: "Subjects & Curriculum", labelNe: "विषय", icon: BookOpen, micro: "M03.03" },
  { to: "/sections", label: "Sections & Houses", labelNe: "सेक्सन", icon: Users, micro: "M03.04" },
  { to: "/grading", label: "Grading & Promotion", labelNe: "ग्रेडिङ", icon: Award, micro: "M03.05" },
  { to: "/policies", label: "Academic Policies", labelNe: "नीति", icon: FileText, micro: "M03.06" },
];

const m04Nav: NavItem[] = [
  { to: "/campaigns", label: "Campaigns & Enquiries", labelNe: "अभियान", icon: Megaphone, micro: "M04.01" },
  { to: "/admissions-counseling", label: "Admissions Counseling", labelNe: "प्रवेश परामर्श", icon: MessageSquare, micro: "M04.02" },
  { to: "/applications", label: "Applications", labelNe: "आवेदन", icon: FileText, micro: "M04.03" },
  { to: "/eligibility-verification", label: "Eligibility & Documents", labelNe: "योग्यता", icon: ClipboardCheck, micro: "M04.04" },
  { to: "/entrance-test-interview", label: "Entrance Test & Interview", labelNe: "प्रवेश परीक्षा", icon: FileCheck, micro: "M04.05" },
  { to: "/selections", label: "Selections & Offers", labelNe: "छनोट", icon: ClipboardCheck, micro: "M04.06" },
  { to: "/conversions", label: "Conversions", labelNe: "रूपान्तरण", icon: UserCheck, micro: "M04.07" },
];

const m05Nav: NavItem[] = [
  { to: "/students", label: "Student Master", labelNe: "विद्यार्थी", icon: GraduationCap, micro: "M05.01" },
  { to: "/guardians-families", label: "Guardians & Families", labelNe: "अभिभावक", icon: Users, micro: "M05.02" },
  { to: "/student-documents", label: "Student Documents", labelNe: "कागजात", icon: FileText, micro: "M05.03" },
  { to: "/enrolments", label: "Enrolment & Movement", labelNe: "भर्ना", icon: ArrowRightLeft, micro: "M05.04" },
  { to: "/holds", label: "Holds & Clearance", labelNe: "रोक", icon: ShieldBan, micro: "M05.07" },
  { to: "/id-card-campus-identity", label: "ID Card & Identity", labelNe: "परिचयपत्र", icon: BadgeCheck, micro: "M05.08" },
];

const m06Nav: NavItem[] = [
  { to: "/curriculum", label: "Curriculum Mapping", labelNe: "पाठ्यक्रम", icon: Target, micro: "M06.01" },
  { to: "/syllabus", label: "Syllabus & Content", labelNe: "पाठ्यक्रम योजना", icon: ScrollText, micro: "M06.02" },
  { to: "/lesson-planning", label: "Lesson Planning", labelNe: "पाठ योजना", icon: NotebookPen, micro: "M06.03" },
  { to: "/workload", label: "Teaching Workload", labelNe: "कार्य भार", icon: Clock, micro: "M06.04" },
  { to: "/quality-review", label: "Quality Review", labelNe: "गुणस्तर", icon: CheckCircle, micro: "M06.05" },
  { to: "/faculty-review", label: "Faculty Review", labelNe: "शिक्षक समीक्षा", icon: UsersRound, micro: "M06.06" },
];

const m07Nav: NavItem[] = [
  { to: "/timetable", label: "Timetable Planning", labelNe: "समय तालिका", icon: CalendarClock, micro: "M07.01" },
  { to: "/substitutions", label: "Substitution & Change", labelNe: "प्रतिस्थापन", icon: Repeat2, micro: "M07.02" },
  { to: "/attendance", label: "Student Attendance", labelNe: "उपस्थिति", icon: ClipboardList, micro: "M07.03" },
  { to: "/attendance-corrections", label: "Attendance Corrections", labelNe: "सच्याउने", icon: FilePenLine, micro: "M07.04" },
  { to: "/shifts", label: "Staff Time & Shifts", labelNe: "समय पालो", icon: Clock3, micro: "M07.05" },
  { to: "/attendance-alerts", label: "Attendance Alerts", labelNe: "सतर्कता", icon: BellRing, micro: "M07.06" },
];

const m08Nav: NavItem[] = [
  { to: "/assessments", label: "Assessment Design", labelNe: "मूल्यांकन", icon: FileTextM08, micro: "M08.01" },
  { to: "/question-bank", label: "Question Bank", labelNe: "प्रश्न बैंक", icon: HelpCircle, micro: "M08.02" },
  { to: "/exams", label: "Exams & Registration", labelNe: "परीक्षा", icon: CalendarDays, micro: "M08.03" },
  { to: "/exam-rooms", label: "Rooms, Seats & Invigilation", labelNe: "हल व्यवस्थापन", icon: Building2, micro: "M08.04" },
  { to: "/marks", label: "Marks & Grades", labelNe: "अङ्क", icon: ClipboardCheck, micro: "M08.05" },
  { to: "/moderation", label: "Moderation & Scaling", labelNe: "मध्यस्थता", icon: Scale, micro: "M08.06" },
  { to: "/practicals", label: "Practical & Viva", labelNe: "प्रयोगात्मक", icon: FlaskConical, micro: "M08.07" },
  { to: "/integrity", label: "Integrity Cases", labelNe: "अनुशासन", icon: ShieldAlert, micro: "M08.08" },
  { to: "/rechecks", label: "Recheck & Retotal", labelNe: "पुन: जाँच", icon: RefreshCw, micro: "M08.09" },
];

const m09Nav: NavItem[] = [
  { to: "/results", label: "Result Calculation", labelNe: "परिणाम", icon: Award, micro: "M09.01" },
  { to: "/result-publications", label: "Result Publication", labelNe: "प्रकाशन", icon: Megaphone, micro: "M09.02" },
  { to: "/result-corrections", label: "Result Corrections", labelNe: "सच्च्याउने", icon: FilePenLine, micro: "M09.03" },
  { to: "/marksheets", label: "Marksheets & Transcripts", labelNe: "लेजर", icon: ScrollText, micro: "M09.04" },
  { to: "/certificates", label: "Certificates & Letters", labelNe: "प्रमाणपत्र", icon: GraduationCap, micro: "M09.05" },
  { to: "/credentials", label: "Digital Credentials", labelNe: "डिजिटल प्रमाण", icon: BadgeCheck, micro: "M09.06" },
  { to: "/completions", label: "Class 10/12 Completion", labelNe: "उत्तीर्ण", icon: Trophy, micro: "M09.07" },
];

const m10Nav: NavItem[] = [
  { to: "/course-spaces", label: "Course Spaces & Rosters", labelNe: "कोर्स स्पेस", icon: Monitor, micro: "M10.01" },
  { to: "/content-resources", label: "Content & Resources", labelNe: "सामग्री", icon: FileStack, micro: "M10.02" },
  { to: "/lms-assignments", label: "Assignments & Submissions", labelNe: "गृहकार्य", icon: ClipboardList, micro: "M10.03" },
  { to: "/quizzes-practice", label: "Quizzes & Practice", labelNe: "क्विज", icon: HelpCircle, micro: "M10.04" },
  { to: "/discussions-collaboration", label: "Discussion & Collaboration", labelNe: "छलफल", icon: MessageSquare, micro: "M10.05" },
  { to: "/learning-analytics", label: "Learning Analytics", labelNe: "विश्लेषण", icon: TrendingUp, micro: "M10.06" },
  { to: "/lti-content-interop", label: "LTI & Interoperability", labelNe: "LTI", icon: Plug, micro: "M10.07" },
];

const m11Nav: NavItem[] = [
  { to: "/student-portal", label: "Student Portal", labelNe: "विद्यार्थी पोर्टल", icon: GraduationCap, micro: "M11.01" },
  { to: "/parent-portal", label: "Parent Portal", labelNe: "अभिभावक पोर्टल", icon: Users, micro: "M11.02" },
  { to: "/teacher-portal", label: "Teacher Portal", labelNe: "शिक्षक पोर्टल", icon: BookOpen, micro: "M11.03" },
  { to: "/management-portal", label: "Management Portal", labelNe: "व्यवस्थापन पोर्टल", icon: LayoutDashboard, micro: "M11.04" },
  { to: "/portal-announcements", label: "Portal Announcements", labelNe: "सूचना", icon: Megaphone, micro: "M11.05" },
  { to: "/portal-access", label: "Portal Access Logs", labelNe: "पहुँच लग", icon: ShieldCheck, micro: "M11.06" },
  { to: "/kiosk-sessions", label: "Kiosk Sessions", labelNe: "कियोस्क", icon: Monitor, micro: "M11.07" },
  { to: "/mobile-devices", label: "Mobile & Offline", labelNe: "मोबाइल", icon: Smartphone, micro: "M11.08" },
  { to: "/accessibility", label: "Accessibility & Tickets", labelNe: "पहुँचयोग्यता", icon: Accessibility, micro: "M11.09" },
];

const m12Nav: NavItem[] = [
  { to: "/finance-setup", label: "Finance Setup", labelNe: "वित्त सेटअप", icon: Landmark, micro: "M12.01" },
  { to: "/chart-of-accounts", label: "Chart of Accounts", labelNe: "खाता चार्ट", icon: Network, micro: "M12.02" },
  { to: "/journals", label: "General Ledger", labelNe: "जर्नल", icon: BookOpen, micro: "M12.03" },
  { to: "/recurring-journals", label: "Recurring Journals", labelNe: "आवर्ती जर्नल", icon: Repeat, micro: "M12.04" },
  { to: "/fee-catalog", label: "Fee Catalog", labelNe: "शुल्क सूची", icon: Tag, micro: "M12.05" },
  { to: "/fee-assignments", label: "Fee Assignments", labelNe: "शुल्क नियुक्ति", icon: UserCheck, micro: "M12.06" },
  { to: "/invoices", label: "Invoices", labelNe: "बीजक", icon: Receipt, micro: "M12.07" },
  { to: "/accounts-receivable", label: "Accounts Receivable", labelNe: "बक्सा खाता", icon: Receipt, micro: "M12.08" },
  { to: "/scholarships", label: "Scholarships", labelNe: "छात्रवृत्ति", icon: Award, micro: "M12.09" },
  { to: "/collections", label: "Collections", labelNe: "भुक्तानी", icon: Wallet, micro: "M12.10" },
  { to: "/online-payments", label: "Online Payments", labelNe: "अनलाइन भुक्तानी", icon: CreditCard, micro: "M12.11" },
  { to: "/refunds-writeoffs", label: "Refunds & Write-offs", labelNe: "फिर्ता र छुट", icon: RotateCcw, micro: "M12.12" },
  { to: "/dunning", label: "Dunning & Collections", labelNe: "सम्झौता पत्र", icon: Bell, micro: "M12.13" },
  { to: "/vendor-bills", label: "Vendor Bills", labelNe: "विक्रेता", icon: Building2, micro: "M12.14" },
  { to: "/expense-claims", label: "Expense Claims", labelNe: "खर्च दावी", icon: FileText, micro: "M12.15" },
  { to: "/disbursements", label: "Disbursements", labelNe: "भुक्तानी", icon: Banknote, micro: "M12.16" },
  { to: "/bank-budget", label: "Bank & Budget", labelNe: "बैंक बजेट", icon: PiggyBank, micro: "M12.17" },
  { to: "/bank-reconciliation", label: "Bank Reconciliation", labelNe: "बैंक मिलान", icon: Scale, micro: "M12.18" },
  { to: "/budgeting-commitments", label: "Budgeting", labelNe: "बजेट", icon: PieChart, micro: "M12.19" },
  { to: "/tax-withholding", label: "Tax & Withholding", labelNe: "कर", icon: Percent, micro: "M12.20" },
  { to: "/accruals-deferrals", label: "Accruals", labelNe: "उत्क्रमण", icon: CalendarClock, micro: "M12.21" },
  { to: "/fund-accounting", label: "Fund Accounting", labelNe: "कोष लेखा", icon: Landmark, micro: "M12.22" },
  { to: "/period-close", label: "Period Close", labelNe: "अवधि बन्द", icon: Lock, micro: "M12.23" },
  { to: "/financial-statements", label: "Financial Statements", labelNe: "वित्तीय विवरण", icon: FileBarChart, micro: "M12.24" },
];

const m13Nav: NavItem[] = [
  { to: "/staff", label: "Staff & Positions", labelNe: "कर्मचारी", icon: Users, micro: "M13.01" },
  { to: "/position-control", label: "Position & Establishment", labelNe: "पद स्थापना", icon: Briefcase, micro: "M13.02" },
  { to: "/recruitment", label: "Recruitment", labelNe: "भर्ती", icon: UserPlus, micro: "M13.03" },
  { to: "/leave-requests", label: "Leave & Absence", labelNe: "बिदा", icon: CalendarOff, micro: "M13.04" },
  { to: "/performance", label: "Performance", labelNe: "प्रदर्शन", icon: Award, micro: "M13.05" },
  { to: "/compensation-benefits", label: "Compensation & Benefits", labelNe: "सुविधा लाभ", icon: DollarSign, micro: "M13.06" },
  { to: "/payroll-rules", label: "Payroll Rules", labelNe: "तलब नियम", icon: Calculator, micro: "M13.07-08" },
  { to: "/payslip-management", label: "Payslips & Disbursement", labelNe: "तलबपत्र", icon: Receipt, micro: "M13.09" },
  { to: "/separations", label: "Separation & Contracts", labelNe: "अवकाश", icon: Briefcase, micro: "M13.10" },
];

const m14Nav: NavItem[] = [
  { to: "/vendor-master", label: "Vendor Master", labelNe: "विक्रेता", icon: Building2, micro: "M14.01" },
  { to: "/purchase-requisition", label: "Purchase Requisitions", labelNe: "खरिद माग", icon: ClipboardList, micro: "M14.02" },
  { to: "/sourcing-evaluation", label: "Sourcing & Evaluation", labelNe: "स्रोत मूल्यांकन", icon: Scale, micro: "M14.03" },
  { to: "/purchase-orders", label: "Purchase Orders", labelNe: "खरिद आदेश", icon: ShoppingCart, micro: "M14.04" },
  { to: "/receipt-inspection", label: "Receipt & Inspection", labelNe: "रसीद", icon: PackageCheck, micro: "M14.05" },
  { to: "/contract-management", label: "Contract Management", labelNe: "सम्झौता", icon: FileSignature, micro: "M14.06" },
  { to: "/supplier-performance", label: "Supplier Performance", labelNe: "आपूर्तिकर्ता", icon: TrendingUp, micro: "M14.07" },
];

const m15Nav: NavItem[] = [
  { to: "/item-store-master", label: "Item & Store Master", labelNe: "वस्तु र भण्डार", icon: Package, micro: "M15.01" },
  { to: "/stock-transactions", label: "Stock Transactions", labelNe: "स्टक कारोबार", icon: ArrowRightLeft, micro: "M15.02" },
  { to: "/counts-reconciliation", label: "Counts & Reconciliation", labelNe: "भौतिक गणना", icon: ClipboardCheck, micro: "M15.03" },
  { to: "/asset-register", label: "Asset Register", labelNe: "सम्पत्ति", icon: Landmark, micro: "M15.04" },
  { to: "/asset-movement-custody", label: "Asset Movement", labelNe: "सम्पत्ति स्थानान्तरण", icon: ArrowRightLeft, micro: "M15.05" },
  { to: "/depreciation-impairment", label: "Depreciation & Impairment", labelNe: "मूल्यह्रास", icon: TrendingDown, micro: "M15.06" },
  { to: "/asset-maintenance-disposal", label: "Maintenance & Disposal", labelNe: "मर्मत र विलोपन", icon: Wrench, micro: "M15.07" },
];

const m16Nav: NavItem[] = [
  { to: "/library-catalog", label: "Catalog & Digital", labelNe: "सूची तथा डिजिटल", icon: BookOpen, micro: "M16.01" },
  { to: "/library-holdings", label: "Holdings & Shelving", labelNe: "प्रति तथा शेल्फ", icon: Layers, micro: "M16.02" },
  { to: "/library-circulation", label: "Circulation", labelNe: "परिचालन", icon: ClipboardList, micro: "M16.03" },
  { to: "/library-acquisitions", label: "Acquisitions & Serials", labelNe: "खरिद तथा शृङ्खला", icon: Package, micro: "M16.04" },
  { to: "/library-digital", label: "Digital Resources", labelNe: "डिजिटल स्रोत", icon: Monitor, micro: "M16.05" },
];

const m17Nav: NavItem[] = [
  { to: "/fleet", label: "Fleet & Compliance", labelNe: "फ्लीट", icon: Bus, micro: "M17.01" },
  { to: "/transport-routes", label: "Routes & Schedules", labelNe: "मार्ग तालिका", icon: Route, micro: "M17.02" },
  { to: "/transport-riders", label: "Riders & Boarding", labelNe: "यात्रु बोर्डिङ", icon: Users, micro: "M17.03" },
  { to: "/boarding-safety", label: "Boarding & Safety", labelNe: "बोर्डिङ सुरक्षा", icon: ShieldCheck, micro: "M17.04" },
  { to: "/transport-operations", label: "GPS & Operations", labelNe: "जिपिएस", icon: Navigation, micro: "M17.05" },
  { to: "/fuel-maintenance", label: "Fuel & Maintenance", labelNe: "इन्धन मर्मत", icon: Wrench, micro: "M17.06" },
];

const m18Nav: NavItem[] = [
  { to: "/residence-inventory", label: "Residence Inventory", labelNe: "निवास", icon: Building2, micro: "M18.01" },
  { to: "/hostel-allocation", label: "Application & Allocation", labelNe: "आवेदन", icon: Home, micro: "M18.02" },
  { to: "/residence-operations", label: "Residence Operations", labelNe: "निवास सञ्चालन", icon: ClipboardList, micro: "M18.03" },
  { to: "/meal-plans-dining", label: "Meal Plans & Dining", labelNe: "खाना योजना", icon: Utensils, micro: "M18.05" },
  { to: "/campus-pos-wallet", label: "Campus POS & Wallet", labelNe: "क्याम्पस POS", icon: Wallet, micro: "M18.06" },
];

const m19Nav: NavItem[] = [
  { to: "/health-clinic", label: "Health & Clinic", labelNe: "स्वास्थ्य", icon: Heart, micro: "M19.01" },
  { to: "/counseling", label: "Counseling & Safeguarding", labelNe: "परामर्श", icon: Shield, micro: "M19.02-03" },
  { to: "/special-education", label: "Special Education", labelNe: "विशेष शिक्षा", icon: Accessibility, micro: "M19.04" },
  { to: "/student-conduct", label: "Student Conduct", labelNe: "आचरण", icon: ShieldAlert, micro: "M19.05" },
  { to: "/grievances", label: "Grievances", labelNe: "शिकायत", icon: AlertCircle, micro: "M19.06" },
  { to: "/advising", label: "Advising & Intervention", labelNe: "सल्लाह", icon: Users, micro: "M19.07" },
];

const m20Nav: NavItem[] = [
  { to: "/events", label: "Events & Registration", labelNe: "कार्यक्रम", icon: CalendarDays, micro: "M20.01" },
  { to: "/clubs", label: "Clubs & Activities", labelNe: "क्लब", icon: UsersRound, micro: "M20.02" },
  { to: "/sports", label: "Sports & Competition", labelNe: "खेलकुद", icon: Trophy, micro: "M20.03" },
  { to: "/trips", label: "Trips & Excursions", labelNe: "भ्रमण", icon: Map, micro: "M20.04" },
  { to: "/ptm", label: "Parent-Teacher Meetings", labelNe: "अभिभावक भेट", icon: MessageSquare, micro: "M20.05" },
  { to: "/fundraising", label: "Fundraising & Donations", labelNe: "कोष संकलन", icon: Heart, micro: "M20.06" },
];

const m21Nav: NavItem[] = [
  { to: "/subject-combinations", label: "Subject Combinations", labelNe: "विषय संयोजन", icon: BookOpen, micro: "M21.01" },
  { to: "/board-registration", label: "Board Registration", labelNe: "बोर्ड दर्ता", icon: ClipboardCheck, micro: "M21.02-03" },
  { to: "/career-guidance", label: "Career Guidance", labelNe: "करियर मार्गदर्शन", icon: Compass, micro: "M21.04-05" },
  { to: "/school-leaving", label: "School Leaving", labelNe: "विद्यालय छोड्ने", icon: FileOutput, micro: "M21.06" },
  { to: "/alumni", label: "Alumni & Former Students", labelNe: "पूर्व विद्यार्थी", icon: Users, micro: "M21.07" },
];

const m22Nav: NavItem[] = [
  { to: "/work-orders", label: "Work Orders", labelNe: "कार्य आदेश", icon: Wrench, micro: "M22.01" },
  { to: "/preventive-maintenance", label: "Preventive Maintenance", labelNe: "निवारण मर्मत", icon: CalendarClock, micro: "M22.02" },
  { to: "/room-booking", label: "Room Booking", labelNe: "कोठा बुकिङ", icon: CalendarCheck, micro: "M22.03" },
  { to: "/safety-incidents", label: "Safety & Incidents", labelNe: "सुरक्षा", icon: ShieldAlert, micro: "M22.04" },
  { to: "/visitor-key-control", label: "Visitor & Key Control", labelNe: "भ्रमणकर्ता", icon: Key, micro: "M22.05" },
  { to: "/utilities", label: "Utilities", labelNe: "उपयोगिता", icon: Zap, micro: "M22.06" },
  { to: "/business-continuity", label: "Business Continuity", labelNe: "निरन्तरता", icon: ShieldCheckM22, micro: "M22.07" },
];

const m23Nav: NavItem[] = [
  { to: "/notices", label: "Notices & Announcements", labelNe: "सूचना", icon: Bell, micro: "M23.01-02" },
  { to: "/conversations", label: "Conversations", labelNe: "संवाद", icon: MessageCircle, micro: "M23.03" },
  { to: "/workflow-designer", label: "Workflow Designer", labelNe: "कार्यप्रवाह", icon: GitBranch, micro: "M23.04" },
  { to: "/case-management", label: "Case Management", labelNe: "केस व्यवस्थापन", icon: Ticket, micro: "M23.05" },
  { to: "/document-templates", label: "Document Templates", labelNe: "कागजात टेम्पलेट", icon: FileText, micro: "M23.06" },
  { to: "/electronic-signature", label: "Electronic Signature", labelNe: "इलेक्ट्रोनिक सही", icon: PenTool, micro: "M23.07" },
  { to: "/records-retention", label: "Records & Retention", labelNe: "अभिलेख", icon: Archive, micro: "M23.08" },
  { to: "/notification-preferences", label: "Notification Preferences", labelNe: "सूचना सेटिङ", icon: Settings, micro: "M23.02" },
];

const m24Nav: NavItem[] = [
  { to: "/operational-reports", label: "Operational Reports", labelNe: "अभिलेख रिपोर्ट", icon: FileText, micro: "M24.01" },
  { to: "/dashboards", label: "Management Dashboards", labelNe: "ड्यासबोर्ड", icon: LayoutDashboardM24, micro: "M24.02" },
  { to: "/metrics", label: "Metric & Semantic Layer", labelNe: "मेट्रिक", icon: Binary, micro: "M24.03" },
  { to: "/data-pipelines", label: "Data Pipelines", labelNe: "डेटा पाइपलाइन", icon: Database, micro: "M24.04" },
  { to: "/ai-models", label: "AI Models & Analytics", labelNe: "AI मोडेल", icon: Brain, micro: "M24.05-06" },
  { to: "/student-success-analytics", label: "Student Success Analytics", labelNe: "विद्यार्थी सफलता", icon: GraduationCap, micro: "M24.05" },
  { to: "/finance-workforce-analytics", label: "Finance & Workforce Analytics", labelNe: "वित्त विश्लेषण", icon: FileBarChart, micro: "M24.06" },
  { to: "/report-builder-governance", label: "Report Builder", labelNe: "रिपोर्ट निर्माण", icon: FileBarChart, micro: "M24.07" },
];

function NavSection({ label, items, role }: { label: string; items: NavItem[]; role: UserRole }) {
  const filtered = items.filter((item) => canAccess(role, item.to));
  if (filtered.length === 0) return null;
  return (
    <>
      <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      {filtered.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-white/10 text-white shadow-inner"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive && "text-indigo-300")} />
              <span className="flex-1 leading-tight">{item.label}</span>
              {item.micro && (
                <span className="rounded bg-white/5 px-1 py-0.5 text-[9px] font-semibold text-slate-500 group-hover:text-slate-400">
                  {item.micro}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

export function AppShell() {
  const session = getSession();
  const role: UserRole = session?.role ?? "admin";
  const userName = session?.name ?? "User";
  const initials = session?.initials ?? "U";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar text-slate-300 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4.5 h-16">
          <div className="rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 p-1.5 text-white shadow-lg shadow-indigo-500/30">
            <School className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Shikshya ERP</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">M01 – M24</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <NavSection label="Institution Core" items={m01Nav} role={role} />
          <NavSection label="Identity & Access" items={m02Nav} role={role} />
          <NavSection label="Academic Foundation" items={m03Nav} role={role} />
          <NavSection label="CRM & Admissions" items={m04Nav} role={role} />
          <NavSection label="Student Lifecycle" items={m05Nav} role={role} />
          <NavSection label="Curriculum & Teaching" items={m06Nav} role={role} />
          <NavSection label="Scheduling & Attendance" items={m07Nav} role={role} />
          <NavSection label="Assessment & Exams" items={m08Nav} role={role} />
          <NavSection label="Results & Certificates" items={m09Nav} role={role} />
          <NavSection label="Learning Management" items={m10Nav} role={role} />
          <NavSection label="Portals & Self-Service" items={m11Nav} role={role} />
          <NavSection label="Finance & Accounting" items={m12Nav} role={role} />
          <NavSection label="HR & Payroll" items={m13Nav} role={role} />
          <NavSection label="Procurement & Vendors" items={m14Nav} role={role} />
          <NavSection label="Inventory & Assets" items={m15Nav} role={role} />
          <NavSection label="Library & Resources" items={m16Nav} role={role} />
          <NavSection label="Transport & Fleet" items={m17Nav} role={role} />
          <NavSection label="Hostel & Residence" items={m18Nav} role={role} />
          <NavSection label="Student Services & Wellbeing" items={m19Nav} role={role} />
          <NavSection label="Activities & Community" items={m20Nav} role={role} />
          <NavSection label="Senior Secondary & Guidance" items={m21Nav} role={role} />
          <NavSection label="Facilities & Safety" items={m22Nav} role={role} />
          <NavSection label="Communication & Workflow" items={m23Nav} role={role} />
          <NavSection label="Analytics & Reporting" items={m24Nav} role={role} />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
              {initials}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur-md sm:px-6 lg:hidden">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 p-1.5 text-white">
              <School className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">Shikshya ERP</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Mobile user + logout */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300">
                {initials}
              </span>
              <button onClick={logout} className="text-muted-foreground hover:text-red-500">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
