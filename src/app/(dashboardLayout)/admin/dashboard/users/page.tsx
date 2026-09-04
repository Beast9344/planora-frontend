'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AdminUserRowActions from '@/components/modules/Dashboard/AdminUserRowActions';
import { extractArrayPayload } from '@/lib/apiMappers';
import {
  fetchAdminUsersAction,
  fetchAdminStatsAction,
  fetchCurrentUserAction,
} from './users.actions';

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
};

const pickString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const pickNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

type TUserRecord = {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED' | string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER' | string;
  _count?: {
    events?: number;
    eventParticipants?: number;
    eventReviews?: number;
  };
};

const UserManagementPage = () => {
  const defaultLimit = 20;
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<TUserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(defaultLimit);
  const [totalUsersOverall, setTotalUsersOverall] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<
    'SUPER_ADMIN' | 'ADMIN' | 'USER'
  >('ADMIN');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchAdminUsersAction({
        page,
        limit: defaultLimit,
        ...(appliedSearch ? { searchTerm: appliedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(roleFilter ? { role: roleFilter } : {}),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to load users');
      }

      const payload = extractArrayPayload(response.data) as TUserRecord[];
      const nextTotal = pickNumber(response.meta?.total, payload.length);
      const nextLimit = pickNumber(response.meta?.limit, defaultLimit);
      const totalPagesFromMeta = Math.max(
        1,
        Math.ceil(nextTotal / Math.max(1, nextLimit)),
      );

      if (page > totalPagesFromMeta && nextTotal > 0) {
        setPage(1);
        setIsLoading(false);
        return;
      }

      setUsers(payload);
      setTotal(nextTotal);
      setLimit(nextLimit);
    } catch (err) {
      console.error('fetchUsers error:', err);
      setUsers([]);
      setTotal(0);
      setErrorMessage('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, roleFilter, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const statsResponse = await fetchAdminStatsAction();
      if (statsResponse.success) {
        setTotalUsersOverall(
          pickNumber(asRecord(statsResponse.data).totalUsers),
        );
      }
    } catch {
      setTotalUsersOverall(0);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const result = await fetchCurrentUserAction();

      if (!result.success) {
        return;
      }

      const role = pickString(asRecord(result.data).role).toUpperCase();

      if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'USER') {
        setCurrentUserRole(role);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput('');
    setAppliedSearch('');
    setStatusFilter('');
    setRoleFilter('');
    setPage(1);
  };

  const handleStatusUpdated = (
    userId: string,
    nextStatus: 'ACTIVE' | 'BLOCKED',
  ) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? {
              ...user,
              status: nextStatus,
            }
          : user,
      ),
    );
  };

  const handleRoleUpdated = (
    userId: string,
    nextRole: 'SUPER_ADMIN' | 'ADMIN' | 'USER',
  ) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? {
              ...user,
              role: nextRole,
            }
          : user,
      ),
    );
  };

  const blockedCount = useMemo(
    () =>
      users.filter(user => pickString(user.status).toUpperCase() === 'BLOCKED')
        .length,
    [users],
  );
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-primary p-7 text-primary-foreground dark:bg-card dark:text-card-foreground sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">User Management</h1>
        <p className="mt-3 max-w-3xl text-primary-foreground/80 dark:text-muted-foreground">
          Search and filter users instantly without page reload, then update
          user role and status inline.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Users (All)</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {totalUsersOverall}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Blocked Users In List</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {blockedCount}
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Current Page</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{page}</p>
        </article>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <form
          className="mb-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSearchSubmit}
        >
          <input
            name="searchTerm"
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
            placeholder="Search by name or email"
            className="h-11 flex-1 rounded-lg border border-border px-3 text-sm"
          />
          <Button
            type="submit"
            className="h-11 bg-primary text-white hover:bg-primary/90"
          >
            Search
          </Button>
          <select
            name="status"
            value={statusFilter}
            onChange={event => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <select
            name="role"
            value={roleFilter}
            onChange={event => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
            className="h-11 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={handleReset}
          >
            Reset
          </Button>
        </form>

        {errorMessage ? (
          <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mb-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            Loading users...
          </p>
        ) : null}

        <div className="space-y-3">
          {users.map(user => {
            const count = asRecord(user._count);
            const userId = pickString(user.id);

            return (
              <article
                key={`${userId}-${pickString(user.status)}`}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {pickString(user.name, 'Unnamed user')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pickString(user.email, 'N/A')}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Status: {pickString(user.status, 'UNKNOWN')} | Hosted:{' '}
                      {pickNumber(count.events)} | Joined:{' '}
                      {pickNumber(count.eventParticipants)} | Reviews:{' '}
                      {pickNumber(count.eventReviews)}
                    </p>
                    <div className="mt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/dashboard/users/${userId}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <AdminUserRowActions
                    userId={userId}
                    status={pickString(user.status)}
                    role={pickString(user.role)}
                    currentUserRole={currentUserRole}
                    onStatusUpdated={handleStatusUpdated}
                    onRoleUpdated={handleRoleUpdated}
                  />
                </div>
              </article>
            );
          })}

          {users.length === 0 ? (
            <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              No users found.
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {users.length} users on this page. Page {page} of{' '}
            {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserManagementPage;
