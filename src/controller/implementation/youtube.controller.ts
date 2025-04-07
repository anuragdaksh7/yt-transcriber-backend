import type { Response } from "express";

import type { getVideoUserDataRequest, YoutubeControllerContract } from "../contracts/youtube.controller.contract";

import {
  BadRequestResponse,
  InternalServerErrorResponse,
  SuccessResponse,
} from "../../utils/responses";
import logger from "../../utils/logger";
import { getYoutubeTranscript } from "../../utils/generateTranscript";
import { parseSentimentAnalysis } from "../../utils/parsers/sentimentAnalysis.parser";

import type GoogleGenAIInstance from "../../integrations/google/gemini";
import { parseSummaryJson, processSummary } from "../../utils/parsers/summary.parser";
import { parseHashtagJson } from "../../utils/parsers/hashtag.parser";
import type YoutubeService from "../../services/implementation/youtube.service";
import type { AuthUser } from "../../types";

class YoutubeController implements YoutubeControllerContract {
  private gemini: GoogleGenAIInstance;
  private youtubeService: YoutubeService

  constructor(gemini: GoogleGenAIInstance, youtubeService: YoutubeService) {
    this.gemini = gemini;
    this.youtubeService = youtubeService
  }

  getVideoSummary = async (req: AuthUser, res: Response): Promise<any> => {
    try {
      if (!req.user) {
        return BadRequestResponse.send(res, "No user found");
      }
      const { url } = req.body;
      const { id } = req.user
      if (!url) {
        return BadRequestResponse.send(res, "No url provided");
      }
      const response = await this.youtubeService.getVideoData(url, id);

      return SuccessResponse.send(
        res,
        response,
        "Video Summary"
      );
    } catch (error: any) {
      logger.error(error?.mesasge);
      return InternalServerErrorResponse.send(res, error.message);
    }
  };

  getVideoUserData = async (req: getVideoUserDataRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.body;
      if (!id) {
        return BadRequestResponse.send(res, "No id provided");
      }
      const response = await this.youtubeService.getVideoByVideoUser(id);
      return SuccessResponse.send(res, response, "Youtube User Data");
    } catch (error: any) {
      logger.error(
        "Error in YoutubeController.getVideoUserData: ",
        error
      );
      return InternalServerErrorResponse.send(res, error.message);
    }
  }
}

export default YoutubeController;
