import type { PrismaClient, Sentiment } from "@prisma/client";
import type { SentimentRepositoryContract } from "../contracts/sentiment.repository.contract";
import logger from "../../utils/logger";

class SentimentRepository implements SentimentRepositoryContract {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
  
  createSentimentAnalysis = async (videoId: string, positive: number, negative: number, neutral: number, overallSentiment: string): Promise<Sentiment> => {
    try {
      const sentiment = await this.prismaClient.sentiment.create({
        data: {
          yt_id: videoId,
          positive,
          negative,
          neutral,
          overallSentiment: overallSentiment,
        }
      })

      return sentiment;
    } catch (error) {
      logger.error("Error creating sentiment analysis", error);
      throw new Error("Error creating sentiment analysis: " + error);
    }
  }

  getSentimentAnalysis(videoId: string): Promise<Sentiment | null> {
    try {
      const sentiment = this.prismaClient.sentiment.findUnique({
        where: {
          yt_id: videoId,
        }
      })

      return sentiment;
    } catch (error) {
      logger.error("Error getting sentiment analysis", error);
      throw new Error("Error getting sentiment analysis: " + error);
    }
  }
}

export default SentimentRepository