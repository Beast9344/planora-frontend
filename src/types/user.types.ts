import { UserRole } from '@/lib/authUtils';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
}
