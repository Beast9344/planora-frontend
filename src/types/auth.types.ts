export interface ILoginResponse {
  redirect: boolean;
  token: string;
  accessToken: string;
  refreshToken: string;
  url?: string | undefined;
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role: string;
    needPasswordChange: boolean;
    isDeleted: boolean;
    status: string;
    deletedAt?: Date | null | undefined;
  };
}
