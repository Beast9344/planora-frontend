'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AiEventSearchInput from '@/components/modules/Event/AiEventSearchInput';

type SortOption =
  | 'date_desc'
  | 'date_asc'
  | 'fee_asc'
  | 'fee_desc'
  | 'title_asc'
  | 'title_desc';

type EventFiltersFormProps = {
  searchTerm: string;
  visibilityFilter: string;
  feeTypeFilter: string;
  statusFilter: string;
  sortBy: SortOption;
};

const filterSelectClassName =
  'h-11 rounded-md border border-white/20 bg-background/90 px-3 text-foreground shadow-sm md:col-span-2 dark:border-white/20 dark:bg-slate-900/80 dark:text-slate-100';

const filterOptionClassName =
  'bg-background text-foreground dark:bg-slate-900 dark:text-slate-100';

const EventFiltersForm = ({
  searchTerm,
  visibilityFilter,
  feeTypeFilter,
  statusFilter,
  sortBy,
}: EventFiltersFormProps) => {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();

    const nextSearchTerm = String(formData.get('searchTerm') || '').trim();
    const nextVisibility = String(formData.get('visibility') || '').trim();
    const nextFeeType = String(formData.get('feeType') || '').trim();
    const nextStatus = String(formData.get('status') || '').trim();
    const nextSortBy = String(formData.get('sortBy') || 'date_desc').trim();

    if (nextSearchTerm) {
      params.set('searchTerm', nextSearchTerm);
    }

    if (nextVisibility) {
      params.set('visibility', nextVisibility);
    }

    if (nextFeeType) {
      params.set('feeType', nextFeeType);
    }

    if (nextStatus) {
      params.set('status', nextStatus);
    }

    if (nextSortBy) {
      params.set('sortBy', nextSortBy);
    }

    params.set('page', '1');

    router.push(`/events?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/events');
  };

  return (
    <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-12">
        <AiEventSearchInput
          name="searchTerm"
          defaultValue={searchTerm}
          placeholder="Search by title, organizer, or venue"
        />
        <select
          name="visibility"
          defaultValue={visibilityFilter}
          aria-label="Filter by visibility"
          className={filterSelectClassName}
        >
          <option value="" className={filterOptionClassName}>
            All Visibility
          </option>
          <option value="PUBLIC" className={filterOptionClassName}>
            Public
          </option>
          <option value="PRIVATE" className={filterOptionClassName}>
            Private
          </option>
        </select>
        <select
          name="feeType"
          defaultValue={feeTypeFilter}
          aria-label="Filter by fee type"
          className={filterSelectClassName}
        >
          <option value="" className={filterOptionClassName}>
            All Fee Types
          </option>
          <option value="FREE" className={filterOptionClassName}>
            Free
          </option>
          <option value="PAID" className={filterOptionClassName}>
            Paid
          </option>
        </select>
        <select
          name="status"
          defaultValue={statusFilter}
          aria-label="Filter by status"
          className={filterSelectClassName}
        >
          <option value="" className={filterOptionClassName}>
            All Status
          </option>
          <option value="ACTIVE" className={filterOptionClassName}>
            Active
          </option>
          <option value="COMPLETED" className={filterOptionClassName}>
            Completed
          </option>
          <option value="CANCELLED" className={filterOptionClassName}>
            Cancelled
          </option>
        </select>
        <select
          name="sortBy"
          defaultValue={sortBy}
          aria-label="Sort events"
          className={filterSelectClassName}
        >
          <option value="date_desc" className={filterOptionClassName}>
            Sort: Newest
          </option>
          <option value="date_asc" className={filterOptionClassName}>
            Sort: Oldest
          </option>
          <option value="fee_asc" className={filterOptionClassName}>
            Sort: Fee Low to High
          </option>
          <option value="fee_desc" className={filterOptionClassName}>
            Sort: Fee High to Low
          </option>
          <option value="title_asc" className={filterOptionClassName}>
            Sort: Title A-Z
          </option>
          <option value="title_desc" className={filterOptionClassName}>
            Sort: Title Z-A
          </option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          className="h-10 min-w-28 bg-orange-500 text-white hover:bg-orange-400"
        >
          Apply Filters
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 min-w-28 border-border bg-transparent text-primary-foreground hover:bg-primary/80 dark:text-foreground dark:hover:bg-muted"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default EventFiltersForm;
