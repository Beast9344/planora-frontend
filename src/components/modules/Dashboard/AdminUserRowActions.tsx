'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateAdminUserAction } from '@/app/(dashboardLayout)/admin/dashboard/users/users.actions';

type AdminUserRowActionsProps = {
  userId: string;
  status: string;
  role?: string;
  currentUserRole?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  onStatusUpdated?: (userId: string, nextStatus: 'ACTIVE' | 'BLOCKED') => void;
  onRoleUpdated?: (
    userId: string,
    nextRole: 'SUPER_ADMIN' | 'ADMIN' | 'USER',
  ) => void;
};

const AdminUserRowActions = ({
  userId,
  status,
  role,
  currentUserRole,
  onStatusUpdated,
  onRoleUpdated,
}: AdminUserRowActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState(
    status.toUpperCase() === 'BLOCKED' ? 'BLOCKED' : 'ACTIVE',
  );
  const [selectedRole, setSelectedRole] = useState(
    role?.toUpperCase() === 'SUPER_ADMIN'
      ? 'SUPER_ADMIN'
      : role?.toUpperCase() === 'ADMIN'
        ? 'ADMIN'
        : 'USER',
  );
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const normalizedStatus = status.toUpperCase();
  const normalizedRole = (role || '').toUpperCase();
  const normalizedCurrentUserRole = (currentUserRole || '').toUpperCase();
  const isSuperAdminActor = normalizedCurrentUserRole === 'SUPER_ADMIN';
  const isAdminUser = normalizedRole === 'ADMIN';
  const isSuperAdminUser = normalizedRole === 'SUPER_ADMIN';

  const runAction = () => {
    setFeedback(null);

    startTransition(async () => {
      try {
        const payload: {
          status?: 'ACTIVE' | 'BLOCKED';
          role?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
        } = {};

        if (selectedStatus !== normalizedStatus) {
          payload.status = selectedStatus as 'ACTIVE' | 'BLOCKED';
        }

        if (selectedRole !== (normalizedRole || 'USER')) {
          payload.role = selectedRole as 'SUPER_ADMIN' | 'ADMIN' | 'USER';
        }

        const response = await updateAdminUserAction(userId, {
          ...payload,
        });

        if (!response.success) {
          throw new Error(response.error || 'Failed to update user status');
        }

        setFeedback({
          type: 'success',
          message: 'User role and status updated successfully.',
        });
        onStatusUpdated?.(userId, selectedStatus as 'ACTIVE' | 'BLOCKED');
        onRoleUpdated?.(
          userId,
          selectedRole as 'SUPER_ADMIN' | 'ADMIN' | 'USER',
        );
      } catch {
        setFeedback({
          type: 'error',
          message: 'Failed to update user role or status.',
        });
      }
    });
  };

  if (isSuperAdminUser) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-rose-500">
          Super admin accounts cannot be modified from this panel.
        </p>
        <div className="flex flex-wrap gap-2">
          <p className="flex h-9 items-center rounded-md border border-border bg-muted px-2 text-xs font-semibold text-muted-foreground">
            Role: SUPER_ADMIN
          </p>
          <p className="flex h-9 items-center rounded-md border border-border bg-muted px-2 text-xs font-semibold text-muted-foreground">
            Status: {normalizedStatus}
          </p>
        </div>
      </div>
    );
  }

  if (isAdminUser && !isSuperAdminActor) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-rose-500">
          Only super admin can demote admin accounts to user.
        </p>
        <div className="flex flex-wrap gap-2">
          <p className="flex h-9 items-center rounded-md border border-border bg-muted px-2 text-xs font-semibold text-muted-foreground">
            Role: ADMIN
          </p>
          <p className="flex h-9 items-center rounded-md border border-border bg-muted px-2 text-xs font-semibold text-muted-foreground">
            Status: {normalizedStatus}
          </p>
        </div>
      </div>
    );
  }

  const isStatusUnchanged = selectedStatus === normalizedStatus;
  const isRoleUnchanged = selectedRole === (normalizedRole || 'USER');

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <p className="flex h-9 items-center rounded-md border border-border px-2 text-xs font-semibold text-muted-foreground">
          Current: {normalizedStatus}
        </p>
        <select
          className="h-9 rounded-md border border-border px-2 text-sm"
          value={selectedStatus}
          disabled={isPending}
          onChange={event => setSelectedStatus(event.target.value)}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
        <select
          className="h-9 rounded-md border border-border px-2 text-sm"
          value={selectedRole}
          disabled={isPending}
          onChange={event => setSelectedRole(event.target.value)}
        >
          <option value="USER">USER</option>
          {!isAdminUser || isSuperAdminActor ? (
            <option value="ADMIN">ADMIN</option>
          ) : null}
        </select>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending || (isStatusUnchanged && isRoleUnchanged)}
          onClick={runAction}
        >
          Update User
        </Button>
      </div>
      {feedback ? (
        <p
          className={`text-xs ${
            feedback.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
};

export default AdminUserRowActions;
