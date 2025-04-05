import type { Request } from "express";

export interface AuthUser extends Request {
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string | null;
    password: null | string;
    provider: string;
    verified: boolean;
    verification_code: string;
    image_url: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

