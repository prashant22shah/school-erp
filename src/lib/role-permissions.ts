// ── ABAC Role-Permission Matrix ─────────────────────────────────────────────
// Defines which routes each role can access in the prototype.
// In production this would come from the RBAC/ABAC engine (M02.03).

export type UserRole =
  | "admin"
  | "principal"
  | "accountant"
  | "teacher"
  | "student"
  | "parent";

export interface RoleProfile {
  id: UserRole;
  label: string;
  labelNe: string;
  description: string;
  initials: string;
  email: string;
  color: string; // tailwind bg color for avatar
}

export const ROLE_PROFILES: RoleProfile[] = [
  {
    id: "admin",
    label: "Platform Admin",
    labelNe: "प्रणाली प्रशासक",
    description: "Full access to all modules, tenants, and system configuration.",
    initials: "AK",
    email: "anish.karki@sunrise.edu.np",
    color: "bg-indigo-500",
  },
  {
    id: "principal",
    label: "Principal",
    labelNe: "प्रधानाध्यापक",
    description: "Academic oversight, admissions decisions, student lifecycle, staff identity.",
    initials: "RS",
    email: "ramesh.shrestha@sunrise.edu.np",
    color: "bg-violet-500",
  },
  {
    id: "accountant",
    label: "Accountant",
    labelNe: "लेखापाल",
    description: "Finance, fee collection, student records for billing, calendar.",
    initials: "LP",
    email: "laxmi.poudel@sunrise.edu.np",
    color: "bg-emerald-500",
  },
  {
    id: "teacher",
    label: "Teacher",
    labelNe: "शिक्षक",
    description: "Class sections, subjects, grading, attendance, student roster.",
    initials: "SB",
    email: "sunita.basnet@sunrise.edu.np",
    color: "bg-amber-500",
  },
  {
    id: "student",
    label: "Student",
    labelNe: "विद्यार्थी",
    description: "View own profile, subjects, enrolment, schedule, results.",
    initials: "AK",
    email: "aakash.khadka@sunrise.edu.np",
    color: "bg-sky-500",
  },
  {
    id: "parent",
    label: "Parent / Guardian",
    labelNe: "अभिभावक",
    description: "View child profile, attendance, fees, results, communication.",
    initials: "DK",
    email: "deepa.khadka@sunrise.edu.np",
    color: "bg-rose-500",
  },
];

// Route paths each role is allowed to access.
// "/" (dashboard) is always allowed.
const ALL_ADMIN_ROUTES = [
  "/tenants", "/institution", "/organization", "/locations", "/calendar", "/features",
  "/identity", "/auth", "/rbac", "/delegation", "/duties", "/privileges",
  "/academic-year", "/levels", "/subjects", "/sections", "/grading", "/policies",
  "/campaigns", "/applications", "/selections", "/conversions",
  "/students", "/enrolments", "/holds",
  "/curriculum", "/syllabus", "/lesson-planning", "/workload", "/quality-review", "/faculty-review",
  "/timetable", "/substitutions", "/attendance", "/attendance-corrections", "/shifts", "/attendance-alerts",
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
  ],

  accountant: [
    "/institution", "/calendar",
    "/students", "/enrolments", "/holds",
  ],

  teacher: [
    "/calendar",
    "/academic-year", "/subjects", "/sections", "/grading",
    "/students", "/enrolments",
    "/curriculum", "/syllabus", "/lesson-planning", "/workload", "/quality-review", "/faculty-review",
    "/timetable", "/substitutions", "/attendance", "/attendance-corrections", "/shifts", "/attendance-alerts",
  ],

  student: [
    "/calendar",
    "/subjects",
    "/students",
  ],

  parent: [
    "/calendar",
    "/students",
  ],
};

/** Check if a role has access to a given route path. */
export function canAccess(role: UserRole, path: string): boolean {
  if (path === "/" || path === "") return true;
  return ROLE_ROUTES[role]?.some((r) => path.startsWith(r)) ?? false;
}

/** Get all allowed routes for a role (for nav filtering). */
export function getAllowedRoutes(role: UserRole): string[] {
  return ["/", ...ROLE_ROUTES[role]];
}

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
