import type { User } from "@prisma/client";

export type CreateUserService = {
  email: string;
  first_name: string;
  last_name: string;
  provider: string;
  verified: boolean;
  image_url: string;
}

export interface UserServiceContract {
  create({
    email,
    first_name,
    last_name,
    provider,
    verified,
    image_url
  }: CreateUserService): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
}