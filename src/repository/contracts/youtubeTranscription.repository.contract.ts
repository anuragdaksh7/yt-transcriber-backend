import type { YoutubeTranscription } from "@prisma/client";

import type { Hashtags, Keywords, Sentiment } from "@prisma/client";

export type YoutubeTranscriptionExtend = {
  id: string;
  videoId: string;
  imageGenerationPrompt: string;
  detailedAnalysis: string;
  summary: string;
  finalThought: string;
  Sentiment: Sentiment | null;
  Hashtags: Hashtags[];
  Keywords: Keywords[];
} | null;

export interface YoutubeTranscriptionRepositoryContract {
  createYoutubeTranscription({
    videoId,
    imageGenerationPrompt,
    detailedAnalysis,
    summary,
    finalThought,
  }: {
    videoId: string;
    imageGenerationPrompt: string
    detailedAnalysis: string
    summary: string
    finalThought: string
  }): Promise<YoutubeTranscription>;
  getYoutubeTranscription({
    videoId,
  }: {
    videoId: string;
  }): Promise<YoutubeTranscriptionExtend | null>;
}