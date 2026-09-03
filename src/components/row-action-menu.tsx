import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermission } from "@/components/permission-gate";
import type { PermissionResource } from "@/lib/role-permissions";

// ── RowActionMenu ────────────────────────────────────────────────────────────
// Reusable row-level action menu that automatically hides Edit/Delete based on
// the current user's RBAC permissions for the given resource.

interface RowActionMenuProps {
  /** The permission resource this row belongs to (e.g. "students", "staffProfiles"). */
  resource: PermissionResource;
  /** Called when the user clicks "Edit". */
  onEdit?: () => void;
  /** Called when the user clicks "Delete". */
  onDelete?: () => void;
  /** Optional extra items to show in the menu. */
  extraItems?: React.ReactNode;
  /** Label for the edit action. Default: "Edit". */
  editLabel?: string;
  /** Label for the delete action. Default: "Delete". */
  deleteLabel?: string;
}

export function RowActionMenu({
  resource,
  onEdit,
  onDelete,
  extraItems,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: RowActionMenuProps) {
  const { canUpdate, canDelete } = usePermission();
  const showEdit = canUpdate(resource) && onEdit;
  const showDelete = canDelete(resource) && onDelete;
  const showExtra = !!extraItems;

  if (!showEdit && !showDelete && !showExtra) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {extraItems}
        {showExtra && showEdit && <DropdownMenuSeparator />}
        {showEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            {editLabel}
          </DropdownMenuItem>
        )}
        {showDelete && (
          <>
            {(showEdit || showExtra) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLabel}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
