import type { Response } from "express";
import type { YoutubeControllerContract } from "../contracts/youtube.controller.contract";
import { getYoutubeTranscript } from "../../utils/generateTranscript";
import { BadRequestResponse, InternalServerErrorResponse, SuccessResponse } from "../../utils/responses";
import logger from "../../utils/logger";
import type GoogleGenAIInstance from "../../integrations/google/gemini";
import { parseSentimentAnalysis } from "../../utils/parsers/sentimentAnalysis.parser";

class YoutubeController implements YoutubeControllerContract {
  private gemini: GoogleGenAIInstance;

  constructor(gemini: GoogleGenAIInstance) {
    this.gemini = gemini;
  }

  getVideoSummary = async (req: any, res: Response): Promise<any> => {
    try {
      const { url } = req.body;
      if (!url) {
        return BadRequestResponse.send(res, "No url provided");
      }
      const transcriptions = await getYoutubeTranscript(url)
      let wholeText = ""
      for (const transcript of transcriptions) {
        wholeText += transcript.text+". ";
      }

      const summary = await this.gemini.generateVideoSummary(wholeText)
      const detailedSummary = await this.gemini.generateVideoDetailedSummary(wholeText)
      const sentimentScoreUnparsed = await this.gemini.generateVideoSenitmentalAnalysis(wholeText)
      const sentimentalAnalysis = parseSentimentAnalysis(sentimentScoreUnparsed)

      return SuccessResponse.send(res, {
        summary: summary,
        detailedSummary: detailedSummary,
        sentimentScore: sentimentalAnalysis,
        transcription: transcriptions,
      }, "Video Summary")
    } catch (error: any) {
      logger.error(error?.mesasge)
      return InternalServerErrorResponse.send(res, error.message)
    }
  }
}

export default YoutubeController