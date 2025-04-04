import type { YoutubeTranscription } from "@prisma/client";

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
  }): Promise<YoutubeTranscription | null>;
}