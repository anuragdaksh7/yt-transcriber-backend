import type { Response } from "express";

export interface YoutubeControllerContract {
  getVideoSummary(req: any, res: Response): Promise<any>;
}