import type { PrismaClient, User } from "@prisma/client";
import type { CreateUser, UserRepositoryContract } from "../contracts/user.repository.contract";

export class UserRepository implements UserRepositoryContract {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  create = async ({ email, first_name, last_name, provider, verified, image_url, verification_code }: CreateUser): Promise<User> => {
    try {
      const user = this.prismaClient.user.create({
        data: {
          email,
          first_name,
          last_name,
          provider,
          verified,
          image_url,
          verification_code,
        }
      })
      return user;
    } catch (error: any) {
      throw new Error(error)
    }
  }

  getUserByEmail = async ({ email }: { email: string; }): Promise<User | null> => {
    try {
      console.log(email)
      const user = await this.prismaClient.user.findUnique({
        where: {
          email
        }
      })
      console.log(user)

      return user
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
