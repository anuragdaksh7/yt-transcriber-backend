import type { Hashtags, PrismaClient } from "@prisma/client";
import type { HashTagsRepositoryContract } from "../contracts/hashtags.repository.contract";
import logger from "../../utils/logger";

class HashTagsRepository implements HashTagsRepositoryContract {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  createHashTags = async (videoId: string, _hashTags: string[]): Promise<Hashtags[]> => {
    try {
      const data = [];
      for (const tag of _hashTags) {
        data.push({
          yt_id: videoId,
          hashtag: tag
        })
      }
      const hashTags = await this.prismaClient.hashtags.createMany({
        data: data
      })

      const hashTagsRes = await this.prismaClient.hashtags.findMany({
        where: {
          yt_id: videoId,
        }
      })

      return hashTagsRes
    } catch (error) {
      logger.error("Error creating hashtags", error);
      throw new Error(`Error creating hashtags: ${error}`);
    }
  }

  getHashTags = async (videoId: string): Promise<Hashtags[]> => {
    try {
      const hashTags = await this.prismaClient.hashtags.findMany({
        where: {
          yt_id: videoId
        }
      })

      return hashTags
    } catch (error) {
      logger.error("Error getting hashtags", error);
      throw new Error(`Error getting hashtags: ${error}`);
    }
  }
}

export default HashTagsRepository