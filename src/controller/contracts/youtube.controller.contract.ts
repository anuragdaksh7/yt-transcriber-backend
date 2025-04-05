import type { Response } from "express";
import type { AuthUser } from "../../types";

export interface YoutubeControllerContract {
  getVideoSummary(req: AuthUser, res: Response): Promise<any>;
}