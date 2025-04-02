import type { User } from "@prisma/client";
import type { Request } from "express";

export type CreateUserRepository = {
  email: string;
  first_name: string;
  last_name: string;
  provider: string;
  verified: boolean;
  image_url: string;
  verification_code: string;
};

export interface UserControllerContract {
  create(req: Request, res: Response): Promise<User>;
  login(req: Request, res: Response): Promise<User>;
  verify(req: Request, res: Response): Promise<User>;
}
