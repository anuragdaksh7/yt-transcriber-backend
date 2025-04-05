import type { Keywords, PrismaClient } from "@prisma/client";
import type { KeywordRepositoryContract } from "../contracts/keyword.repository.contract";
import logger from "../../utils/logger";

class KeywordRepository implements KeywordRepositoryContract {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
  
  createKeyword = async (videoId: string, _keywords: { [key: string]: { surrounding_text: string; definition: string; }; }): Promise<Keywords[]> => {
    try {
      const data = Object.entries(_keywords).map(([keyword, { surrounding_text, definition }]) => ({
        yt_id: videoId,
        key: keyword,
        surrounding_text,
        definition,
      }));

      await this.prismaClient.keywords.createMany({
        data: data,
      });

      const keywordsRes = await this.prismaClient.keywords.findMany({
        where: {
          yt_id: videoId,
        }
      })
      return keywordsRes;
    } catch (error) {
      logger.error("Error creating keywords", error);
      throw new Error(`Error creating keywords: ${error}`);
    }
  }

  getKeywords = async (videoId: string): Promise<Keywords[]> => {
    try {
      const keywords = await this.prismaClient.keywords.findMany({
        where: {
          yt_id: videoId
        }
      })

      return keywords;
    } catch (error) {
      logger.error("Error getting keywords", error);
      throw new Error(`Error getting keywords: ${error}`);
    }
  }
}

export default KeywordRepository