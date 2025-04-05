import type { Keywords } from "@prisma/client";

export interface KeywordRepositoryContract {
  createKeyword(
    videoId: string,
    keywords: {
      [key: string]: {
          surrounding_text: string;
          definition: string;
      };
    }
  ): Promise<Keywords[]>;
  getKeywords(videoId: string): Promise<Keywords[]>;
}