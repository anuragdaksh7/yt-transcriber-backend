import type { Request, Response } from "express";
import type { AuthUser } from "../../types";

export interface getVideoUserDataRequest extends Request {
  body: {
    id: string;
  };
}

export interface YoutubeControllerContract {
  getVideoSummary(req: AuthUser, res: Response): Promise<any>;
  getVideoUserData(req: getVideoUserDataRequest, res: Response): Promise<any>;
}
