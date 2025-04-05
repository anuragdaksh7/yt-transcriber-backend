import type { YoutubeTranscriptionUserHybrid } from "@prisma/client";

export interface YoutubeUserRepositoryContract {
  getYoutubeUser(video_id: string, user_id: string): Promise<YoutubeTranscriptionUserHybrid | null>;
  createYoutubeUser(video_id: string, user_id: string, name: string): Promise<YoutubeTranscriptionUserHybrid>
}