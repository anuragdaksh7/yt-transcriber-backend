import type { User } from "@prisma/client";

export type CreateUser = {
  email: string;
  first_name: string;
  last_name: string;
  provider: string;
  verified: boolean;
  image_url: string;
  verification_code: string;
}

export interface UserRepositoryContract {
  create({
    email,
    first_name,
    last_name,
    provider,
    verified,
    image_url,
    verification_code
  }: CreateUser): Promise<User>;
  getUserByEmail({ email }: { email: string }): Promise<User | null>;
}