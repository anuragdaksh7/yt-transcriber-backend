import type { YoutubeTranscriptionUserHybrid } from "@prisma/client";
import type GoogleGenAIInstance from "../../integrations/google/gemini";
import type HashTagsRepository from "../../repository/implementation/hashtags.repository";
import type KeywordRepository from "../../repository/implementation/keyword.repository";
import type SentimentRepository from "../../repository/implementation/sentiment.repository";
import type YoutubeTranscriptionRepository from "../../repository/implementation/youtubeTranscription.repository";
import type YoutubeUserRepository from "../../repository/implementation/youtubeUser.repository";
import { getYoutubeTranscript } from "../../utils/generateTranscript";
import logger from "../../utils/logger";
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
  private youtubeUserRepository: YoutubeUserRepository
  
  constructor(gemini: GoogleGenAIInstance, youtubeTranscriptionRepository: YoutubeTranscriptionRepository, hashTagsRepository: HashTagsRepository, sentimentRepository: SentimentRepository, keywordRepository: KeywordRepository, youtubeUserRepository: YoutubeUserRepository) {
    this.gemini = gemini;
    this.youtubeTranscriptionRepository = youtubeTranscriptionRepository;
    this.hashTagsRepository = hashTagsRepository;
    this.sentimentRepository = sentimentRepository;
    this.keywordRepository = keywordRepository;
    this.youtubeUserRepository = youtubeUserRepository;
  }

  getVideoData = async (youtubeUrl: string, user_id: string): Promise<YoutubeDataResponse> => {
    try {
      const transcriptions = await getYoutubeTranscript(youtubeUrl);
      const existingData = await this.youtubeTranscriptionRepository.getYoutubeTranscription({ videoId: youtubeUrl })
      if (existingData) {
        let youtubeUser = await this.youtubeUserRepository.getYoutubeUser(existingData.id, user_id)
        if (!youtubeUser) {
          youtubeUser = await this.youtubeUserRepository.createYoutubeUser(existingData.id, user_id)
        }

        const keywords: {[key: string]: {
          surrounding_text: string;
          definition: string;
        }} = {}
        for (const key of existingData.Keywords) {
          keywords[key.key] = {
            surrounding_text: key.surrounding_text,
            definition: key.definition,
          }
        }
        const returnData = {
          summary: {
            text: existingData.summary,
            final_thought: existingData.finalThought,
            keywords: keywords,
          },
          detailedSummary: existingData.detailedAnalysis,
          sentimentScore: {
            sentimentScore: {
              positive: existingData.Sentiment?.positive || 0,
              negative: existingData.Sentiment?.negative || 0,
              neutral: existingData.Sentiment?.neutral || 0,
            },
            overallSentiment: existingData.Sentiment?.overallSentiment || "",
          },
          hashtags: existingData.Hashtags.map((hashtag) => hashtag.hashtag),
          transcription: transcriptions,
          results: existingData,
          youtubeUser: youtubeUser
        }
        return returnData
      }

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

      let youtubeUser = await this.youtubeUserRepository.createYoutubeUser(youtubeTranscriptionRes.id, user_id)

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
        youtubeUser: youtubeUser,
        transcription: transcriptions,
      }
      return data;
    } catch (error: any) {
      logger.error("Error in YoutubeService:", error);
      throw new Error(error)
    }
  }

  getVideoByVideoUser = async (youtubeUserId: string) => {
    try {
      const youtubeUser = await this.youtubeUserRepository.getYoutubeUserById(youtubeUserId)
      if (!youtubeUser) {
        logger.info("YouTube user not found")
        throw new Error("Youtube user not found")
      }

      const existingData = youtubeUser.youtubeTranscription
      const user_id = youtubeUser.user_id
      const transcriptions = await getYoutubeTranscript(existingData.videoId);
      
      if (existingData) {
        let youtubeUser = await this.youtubeUserRepository.getYoutubeUser(existingData.id, user_id)
        if (!youtubeUser) {
          youtubeUser = await this.youtubeUserRepository.createYoutubeUser(existingData.id, user_id)
        }

        const keywords: {[key: string]: {
          surrounding_text: string;
          definition: string;
        }} = {}
        for (const key of existingData.Keywords) {
          keywords[key.key] = {
            surrounding_text: key.surrounding_text,
            definition: key.definition,
          }
        }
        const returnData = {
          summary: {
            text: existingData.summary,
            final_thought: existingData.finalThought,
            keywords: keywords,
          },
          detailedSummary: existingData.detailedAnalysis,
          sentimentScore: {
            sentimentScore: {
              positive: existingData.Sentiment?.positive || 0,
              negative: existingData.Sentiment?.negative || 0,
              neutral: existingData.Sentiment?.neutral || 0,
            },
            overallSentiment: existingData.Sentiment?.overallSentiment || "",
          },
          hashtags: existingData.Hashtags.map((hashtag) => hashtag.hashtag),
          transcription: transcriptions,
          results: existingData,
          youtubeUser: youtubeUser
        }
        return returnData
      }
      return null;
    } catch (error: any) {
      logger.error("Error in YoutubeService: ", error);
      throw new Error(error)
    }
  }

  updateVideoName = async (id: string, user_id: string, name: string): Promise<YoutubeTranscriptionUserHybrid | null> => {
    try {
      const updatedVideo = await this.youtubeUserRepository.updateVideoName(id, user_id, name)
      if (!updatedVideo) {
        logger.info("YouTube user not found")
        throw new Error("Youtube user not found")
      }

      return updatedVideo
    } catch (error: any) {
      logger.error("Error in YoutubeService: ", error);
      throw new Error(error)      
    }
  }
}

export default YoutubeService