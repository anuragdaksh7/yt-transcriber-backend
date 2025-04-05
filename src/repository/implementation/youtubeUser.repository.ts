import type { PrismaClient } from "@prisma/client";
import type { YoutubeUserRepositoryContract } from "../contracts/youtubeUser.repository.contract";

class YoutubeUserRepository implements YoutubeUserRepositoryContract {
  private prisma: PrismaClient; // Replace with actual Prisma client type

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getYoutubeUser(video_id: string, user_id: string) {
    return await this.prisma.youtubeTranscriptionUserHybrid.findFirst({
      where: {
        yt_id: video_id,
        user_id,
      },
      include: {
        user: {
          select: {
            first_name: true
          }
        }
      }
    });
  }

  async createYoutubeUser(video_id: string, user_id: string) {
    return await this.prisma.youtubeTranscriptionUserHybrid.create({
      data: {
        yt_id: video_id,
        user_id,
      },
      include: {
        user: {
          select: {
            first_name: true
          }
        }
      }
    });
  }
}

export default YoutubeUserRepository