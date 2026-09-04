'use client';

import { logoutAction } from '@/app/(commonLayout)/(auth)/logout/_action';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/types/user.types';
import { ChevronUp, Key, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type SidebarUserDropdownProps = {
  userInfo: UserInfo;
};

const SidebarUserDropdown = ({ userInfo }: SidebarUserDropdownProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-between rounded-xl px-2 py-2 hover:bg-accent"
        >
          <span className="flex min-w-0 items-center gap-3">
            <Avatar className="size-8">
              {userInfo.image ? (
                <AvatarImage src={userInfo.image} alt={userInfo.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {userInfo.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 text-left">
              <span className="block truncate text-sm font-medium text-foreground">
                {userInfo.name}
              </span>
              <span className="block truncate text-xs capitalize text-muted-foreground">
                {userInfo.role.toLowerCase().replace('_', ' ')}
              </span>
            </span>
          </span>
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground">{userInfo.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/my-profile">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/change-password">
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600"
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserDropdown;
