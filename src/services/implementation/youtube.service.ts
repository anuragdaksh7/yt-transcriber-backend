import type GoogleGenAIInstance from "../../integrations/google/gemini";
import { getYoutubeTranscript } from "../../utils/generateTranscript";
import { parseHashtagJson } from "../../utils/parsers/hashtag.parser";
import { parseSentimentAnalysis } from "../../utils/parsers/sentimentAnalysis.parser";
import { parseSummaryJson, processSummary } from "../../utils/parsers/summary.parser";
import type { YoutubeDataResponse, YoutubeServiceContract } from "../contracts/youtube.service.contract";

class YoutubeService implements YoutubeServiceContract {
  private gemini: GoogleGenAIInstance;
  
  constructor(gemini: GoogleGenAIInstance) {
    this.gemini = gemini;
  }

  getVideoData = async (youtubeUrl: string): Promise<YoutubeDataResponse> => {
    try {
      const transcriptions = await getYoutubeTranscript(youtubeUrl);
      let wholeText = "";
      for (const transcript of transcriptions) {
        wholeText += transcript.text + ". ";
      }

      const summaryRaw = await this.gemini.generateVideoSummary(wholeText);
      const summarySemiParsed = parseSummaryJson(summaryRaw);
      const summary = processSummary(summarySemiParsed);

      const detailedSummary = await this.gemini.generateVideoDetailedSummary(
        wholeText
      );

      const hashtagsRaw = await this.gemini.getVideoHashTags(wholeText);
      const hashtags = parseHashtagJson(hashtagsRaw)

      const sentimentScoreUnparsed =
        await this.gemini.generateVideoSenitmentalAnalysis(wholeText);
      const sentimentalAnalysis = parseSentimentAnalysis(
        sentimentScoreUnparsed
      );

      const data = {
        summary: summary,
        detailedSummary: detailedSummary,
        sentimentScore: sentimentalAnalysis,
        hashtags: hashtags,
        transcription: transcriptions,
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}

export default YoutubeService