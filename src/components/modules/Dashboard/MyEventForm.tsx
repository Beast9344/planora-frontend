'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  createMyEventAction,
  MyEventPayload,
  updateMyEventAction,
} from '@/app/(dashboardLayout)/dashboard/my-events/_actions';

type MyEventFormProps = {
  mode: 'create' | 'edit';
  eventId?: string;
  initialValues?: Partial<MyEventPayload>;
};

const defaultValues: MyEventPayload = {
  title: '',
  description: '',
  image: '',
  eventDate: '',
  eventTime: '',
  venue: '',
  eventLink: '',
  visibility: 'PUBLIC',
  registrationFee: 0,
};

const MyEventForm = ({ mode, eventId, initialValues }: MyEventFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [eventType, setEventType] = useState<'FREE' | 'PAID'>(
    Number(initialValues?.registrationFee || 0) > 0 ? 'PAID' : 'FREE',
  );
  const [form, setForm] = useState<MyEventPayload>({
    ...defaultValues,
    ...initialValues,
    visibility: initialValues?.visibility === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
    registrationFee: Number(initialValues?.registrationFee || 0),
  });
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const selectedDate = useMemo(() => {
    if (!form.eventDate) {
      return undefined;
    }

    const date = new Date(`${form.eventDate}T00:00:00`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }, [form.eventDate]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const payload = {
        ...form,
        registrationFee: eventType === 'FREE' ? 0 : form.registrationFee,
      };

      const eventFormData = new FormData();
      eventFormData.append('title', payload.title);
      eventFormData.append('description', payload.description);
      eventFormData.append('eventDate', payload.eventDate);
      eventFormData.append('eventTime', payload.eventTime);
      eventFormData.append('venue', payload.venue || '');
      eventFormData.append('eventLink', payload.eventLink || '');
      eventFormData.append('visibility', payload.visibility);
      eventFormData.append(
        'registrationFee',
        String(payload.registrationFee || 0),
      );

      if (imageFile) {
        eventFormData.append('image', imageFile);
      }

      const result =
        mode === 'create'
          ? await createMyEventAction(eventFormData)
          : await updateMyEventAction(eventId as string, eventFormData);

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        if (mode === 'create') {
          router.push('/dashboard/my-events');
          return;
        }

        router.push(`/dashboard/my-events/${eventId}`);
        router.refresh();
      }
    });
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="event-title">Event Title</Label>
            <Input
              id="event-title"
              value={form.title}
              onChange={event =>
                setForm(prev => ({ ...prev, title: event.target.value }))
              }
              placeholder="Write a clear event title"
              className="h-11"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              value={form.description}
              onChange={event =>
                setForm(prev => ({ ...prev, description: event.target.value }))
              }
              placeholder="Describe what this event is about"
              className="min-h-28"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="event-image">Event Image</Label>
            <Input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={event => {
                const file = event.target.files?.[0] || null;
                setImageFile(file);
              }}
              className="h-11"
              disabled={isPending}
            />
            {form.image ? (
              <p className="text-xs text-muted-foreground">
                Current image is set. Upload a new one to replace it.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-date">Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="event-date"
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="h-11 w-full justify-start border-border text-left font-normal"
                >
                  <CalendarDays className="mr-2 size-4" />
                  {selectedDate
                    ? format(selectedDate, 'PPP')
                    : 'Pick event date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => {
                    setForm(prev => ({
                      ...prev,
                      eventDate: date ? format(date, 'yyyy-MM-dd') : '',
                    }));
                  }}
                  disabled={date =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {!form.eventDate ? (
              <p className="text-xs text-muted-foreground">
                Please choose a date.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-time">Event Time</Label>
            <Input
              id="event-time"
              type="time"
              value={form.eventTime}
              onChange={event =>
                setForm(prev => ({ ...prev, eventTime: event.target.value }))
              }
              className="h-11"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-venue">Venue</Label>
            <Input
              id="event-venue"
              value={form.venue || ''}
              onChange={event =>
                setForm(prev => ({ ...prev, venue: event.target.value }))
              }
              placeholder="Physical venue (optional if link is provided)"
              className="h-11"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-link">Event Link</Label>
            <Input
              id="event-link"
              type="url"
              value={form.eventLink || ''}
              onChange={event =>
                setForm(prev => ({ ...prev, eventLink: event.target.value }))
              }
              placeholder="https://meet.example.com/room"
              className="h-11"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-visibility">Visibility</Label>
            <Select
              disabled={isPending}
              value={form.visibility}
              onValueChange={value =>
                setForm(prev => ({
                  ...prev,
                  visibility: value === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC',
                }))
              }
            >
              <SelectTrigger id="event-visibility" className="h-11 w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select
              disabled={isPending}
              value={eventType}
              onValueChange={value => {
                const nextType = value === 'PAID' ? 'PAID' : 'FREE';
                setEventType(nextType);

                if (nextType === 'FREE') {
                  setForm(prev => ({ ...prev, registrationFee: 0 }));
                }
              }}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {eventType === 'PAID' ? (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="registration-fee">Registration Fee</Label>
              <Input
                id="registration-fee"
                type="number"
                min={0}
                step="0.01"
                value={String(form.registrationFee || 0)}
                onChange={event =>
                  setForm(prev => ({
                    ...prev,
                    registrationFee: Number(event.target.value || 0),
                  }))
                }
                className="h-11"
                disabled={isPending}
              />
            </div>
          ) : null}

          {eventType === 'FREE' ? (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 md:col-span-2">
              This event is marked as free. Registration fee will be saved as 0.
            </p>
          ) : null}
        </div>

        {feedback ? (
          <p
            className={`rounded-lg p-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 bg-primary text-white hover:bg-primary/90"
          >
            {isPending
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Event'
                : 'Save Changes'}
          </Button>

          <Button asChild variant="outline" className="h-11">
            <Link href="/dashboard/my-events">Back to My Events</Link>
          </Button>
        </div>
      </form>
    </section>
  );
};

export default MyEventForm;
