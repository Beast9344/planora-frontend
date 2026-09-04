'use client';

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2 } from 'lucide-react';
import {
  updateMyProfileAction,
  uploadAvatarAction,
} from '@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_actions';

type ProfileEditorCardProps = {
  name: string;
  email: string;
  image: string;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 5;

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.trim()[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const ProfileEditorCard = ({ name, email, image }: ProfileEditorCardProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [fullName, setFullName] = useState(name);
  const [imageUrl, setImageUrl] = useState(image);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const initials = useMemo(
    () => getInitials(fullName || name),
    [fullName, name],
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFeedback({
        type: 'error',
        message: 'Only JPEG, PNG, WebP, or GIF images are allowed.',
      });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: `Image must be smaller than ${MAX_SIZE_MB} MB.`,
      });
      return;
    }

    setFeedback(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadAvatarAction(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      if (result.imageUrl) setImageUrl(result.imageUrl);
      setFeedback({ type: 'success', message: 'Profile image updated.' });
      router.refresh();
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Image upload failed.',
      });
    } finally {
      setIsUploading(false);
      // reset so re-picking the same file still fires change
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const trimmedName = fullName.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setFeedback({
        type: 'error',
        message: 'Name must be at least 2 characters long.',
      });
      return;
    }

    startTransition(async () => {
      const result = await updateMyProfileAction({ name: trimmedName });

      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) {
        router.refresh();
      }
    });
  };

  const isBusy = isPending || isUploading;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your display information up to date.
          </p>
        </div>

        {/* Clickable avatar for image upload */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="group relative block size-16 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label="Change profile photo"
          >
            <Avatar className="size-16 ring-2 ring-slate-200">
              {imageUrl ? (
                <AvatarImage src={imageUrl} alt={fullName || name} />
              ) : null}
              <AvatarFallback>{initials || 'U'}</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              {isUploading ? (
                <Loader2 className="size-5 animate-spin text-white" />
              ) : (
                <Camera className="size-5 text-white" />
              )}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
            disabled={isBusy}
          />
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Click to change
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Full Name</Label>
          <Input
            id="profile-name"
            value={fullName}
            onChange={event => setFullName(event.target.value)}
            placeholder="Enter your full name"
            disabled={isBusy}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-email">Email (read only)</Label>
          <Input
            id="profile-email"
            value={email}
            disabled
            readOnly
            className="h-11 bg-muted"
          />
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

        <Button
          type="submit"
          disabled={isBusy}
          className="h-11 bg-primary text-white hover:bg-primary/90"
        >
          {isPending ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </section>
  );
};

export default ProfileEditorCard;
