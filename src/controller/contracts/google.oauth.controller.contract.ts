import type { Response } from "express";

export interface GoogleOAuthControllerContract {
  getRedirectUriForGoogle(req: any, res: Response): Promise<any>;
  verifyCodeForGoogle(req: any, res: Response): Promise<any>;
}
