import type { UserToken } from "@prisma/client";

export interface UserTokenRepositoryContract {
  createUserToken({
    userId
  }: {
    userId: string;
  }): Promise<UserToken>;
  getUserToken({ userId }: { userId: string }): Promise<UserToken | null>;
  updateGoogleToken({
    userId,
    googleRefreshToken,
    googleAccessToken,
  }: {
    userId: string;
    googleRefreshToken: string;
    googleAccessToken: string;
  }): Promise<UserToken>;
}