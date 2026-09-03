import { type ReactNode } from "react";
import {
  hasPermission,
  hasAbacPermission,
  getSession,
  type UserRole,
  type PermissionResource,
  type PermissionAction,
  type AbacContext,
} from "@/lib/role-permissions";

// ── usePermission Hook ───────────────────────────────────────────────────────
// Provides easy access to permission checks from any component.

export function usePermission() {
  const session = getSession();
  const role: UserRole = session?.role ?? "admin";

  return {
    role,
    /** Check RBAC permission (role + resource + action). */
    can: (resource: PermissionResource, action: PermissionAction): boolean =>
      hasPermission(role, resource, action),

    /** Check ABAC permission (RBAC + attribute conditions). */
    canAbac: (
      resource: PermissionResource,
      action: PermissionAction,
      ctx?: AbacContext
    ): boolean => hasAbacPermission(role, resource, action, ctx),

    /** Convenience: can this role create on this resource? */
    canCreate: (resource: PermissionResource) => hasPermission(role, resource, "create"),

    /** Convenience: can this role read this resource? */
    canRead: (resource: PermissionResource) => hasPermission(role, resource, "read"),

    /** Convenience: can this role update this resource? */
    canUpdate: (resource: PermissionResource) => hasPermission(role, resource, "update"),

    /** Convenience: can this role delete this resource? */
    canDelete: (resource: PermissionResource) => hasPermission(role, resource, "delete"),

    /** Convenience: can this role export this resource? */
    canExport: (resource: PermissionResource) => hasPermission(role, resource, "export"),

    /** Convenience: can this role approve this resource? */
    canApprove: (resource: PermissionResource) => hasPermission(role, resource, "approve"),
  };
}

// ── PermissionGate Component ─────────────────────────────────────────────────
// Conditionally renders children based on role + resource + action permissions.
// If the user lacks permission, renders nothing (or the fallback).

interface PermissionGateProps {
  resource: PermissionResource;
  action: PermissionAction;
  abacContext?: AbacContext;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  resource,
  action,
  abacContext,
  fallback = null,
  children,
}: PermissionGateProps) {
  const session = getSession();
  const role: UserRole = session?.role ?? "admin";

  const allowed = abacContext
    ? hasAbacPermission(role, resource, action, abacContext)
    : hasPermission(role, resource, action);

  return allowed ? <>{children}</> : <>{fallback}</>;
}

// ── Compact CRUD Gate Components ─────────────────────────────────────────────
// Shorthand components for the most common CRUD gate patterns.

export function CanCreate({
  resource,
  children,
  fallback,
}: {
  resource: PermissionResource;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate resource={resource} action="create" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function CanUpdate({
  resource,
  children,
  fallback,
}: {
  resource: PermissionResource;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate resource={resource} action="update" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function CanDelete({
  resource,
  children,
  fallback,
}: {
  resource: PermissionResource;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate resource={resource} action="delete" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function CanExport({
  resource,
  children,
  fallback,
}: {
  resource: PermissionResource;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate resource={resource} action="export" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function CanApprove({
  resource,
  children,
  fallback,
}: {
  resource: PermissionResource;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGate resource={resource} action="approve" fallback={fallback}>
      {children}
    </PermissionGate>
  );
}
