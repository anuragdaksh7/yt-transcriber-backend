import type { Hashtags } from "@prisma/client";

export interface HashTagsRepositoryContract {
  createHashTags(videoId: string, hashTags: string[]): Promise<Hashtags[]>;
  getHashTags(videoId: string): Promise<Hashtags[]>;
}