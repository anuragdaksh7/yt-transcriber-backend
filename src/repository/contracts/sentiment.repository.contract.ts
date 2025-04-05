import type { Sentiment } from "@prisma/client";

export interface SentimentRepositoryContract {
  createSentimentAnalysis(
    videoId: string,
    positive: number,
    negative: number,
    neutral: number,
    overallSentiment: string
  ): Promise<Sentiment>;
  getSentimentAnalysis(videoId: string): Promise<Sentiment | null>;
}