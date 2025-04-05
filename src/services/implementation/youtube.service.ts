import type GoogleGenAIInstance from "../../integrations/google/gemini";
import type HashTagsRepository from "../../repository/implementation/hashtags.repository";
import type KeywordRepository from "../../repository/implementation/keyword.repository";
import type SentimentRepository from "../../repository/implementation/sentiment.repository";
import type YoutubeTranscriptionRepository from "../../repository/implementation/youtubeTranscription.repository";
import { getYoutubeTranscript } from "../../utils/generateTranscript";
import { parseHashtagJson } from "../../utils/parsers/hashtag.parser";
import { parseSentimentAnalysis } from "../../utils/parsers/sentimentAnalysis.parser";
import { parseSummaryJson, processSummary } from "../../utils/parsers/summary.parser";
import type { YoutubeDataResponse, YoutubeServiceContract } from "../contracts/youtube.service.contract";

class YoutubeService implements YoutubeServiceContract {
  private gemini: GoogleGenAIInstance;
  private youtubeTranscriptionRepository: YoutubeTranscriptionRepository;
  private hashTagsRepository: HashTagsRepository;
  private sentimentRepository: SentimentRepository
  private keywordRepository: KeywordRepository
  
  constructor(gemini: GoogleGenAIInstance, youtubeTranscriptionRepository: YoutubeTranscriptionRepository, hashTagsRepository: HashTagsRepository, sentimentRepository: SentimentRepository, keywordRepository: KeywordRepository) {
    this.gemini = gemini;
    this.youtubeTranscriptionRepository = youtubeTranscriptionRepository;
    this.hashTagsRepository = hashTagsRepository;
    this.sentimentRepository = sentimentRepository;
    this.keywordRepository = keywordRepository;
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

      const imageGenerationPrompt = await this.gemini.getVideoImageGenerationPrompt(wholeText);

      const youtubeTranscriptionRes = await this.youtubeTranscriptionRepository.createYoutubeTranscription({
        videoId: youtubeUrl,
        detailedAnalysis: detailedSummary,
        summary: summary?.text || "",
        finalThought: summary?.final_thought || "",
        imageGenerationPrompt: imageGenerationPrompt,
      })

      const hashTags = await this.hashTagsRepository.createHashTags(
        youtubeTranscriptionRes.id,
        hashtags
      )

      const sentiment = await this.sentimentRepository.createSentimentAnalysis(
        youtubeTranscriptionRes.id,
        sentimentalAnalysis?.sentimentScore?.positive || 0,
        sentimentalAnalysis?.sentimentScore?.negative || 0,
        sentimentalAnalysis?.sentimentScore?.neutral || 0,
        sentimentalAnalysis?.overallSentiment || "",
      )

      const keywordRepository = this.keywordRepository.createKeyword(
        youtubeTranscriptionRes.id,
        summary?.keywords || {}
      )

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