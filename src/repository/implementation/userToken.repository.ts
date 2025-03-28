import type { PrismaClient, UserToken } from "@prisma/client";
import type { UserTokenRepositoryContract } from "../contracts/userToken.repository.contract";
import type CryptoEncoder from "../../helpers/cryptoEncoder";

class UserTokenRepository implements UserTokenRepositoryContract {
  private cryptoEncoder: CryptoEncoder;
  private prismaClient: PrismaClient;

  constructor(_cryptoEncoder: CryptoEncoder, _prismaClient: PrismaClient) {
    this.cryptoEncoder = _cryptoEncoder;
    this.prismaClient = _prismaClient;
  }

  createUserToken = async ({ userId }: { userId: string; }): Promise<UserToken> => {
    try {
      const userToken = await this.prismaClient.userToken.create({
        data: {
          user_id: userId,
          googleRefreshToken: null,
          googleAccessToken: null,
        },
      })

      return userToken;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  getUserToken = async ({ userId }: { userId: string; }): Promise<UserToken | null> => {
    try {
      const userToken = await this.prismaClient.userToken.findUnique({
        where: {
          user_id: userId,
        }
      })
      return userToken;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  updateGoogleToken = async ({ userId, googleRefreshToken, googleAccessToken, }: { userId: string; googleRefreshToken: string; googleAccessToken: string; }): Promise<UserToken> => {
    try {
      const {
        data: encryptedGoogleAccessToken,
        error: encryptedGoogleAccessTokenErr
      } = this.cryptoEncoder.encrypt(googleAccessToken);
      if (encryptedGoogleAccessTokenErr) {
        throw new Error(encryptedGoogleAccessTokenErr);
      }

      const {
        data: encryptedGoogleRefreshToken,
        error: encryptedGoogleRefreshTokenErr,
      } = this.cryptoEncoder.encrypt(googleRefreshToken);
      if (encryptedGoogleRefreshTokenErr)
        throw new Error(encryptedGoogleRefreshTokenErr);

      await this.prismaClient.userToken.update({
        data: {
          googleRefreshToken: encryptedGoogleRefreshToken,
          googleAccessToken: encryptedGoogleAccessToken,
        },
        where: {
          user_id: userId,
        }
      })

      const userToken = await this.prismaClient.userToken.findUnique({
        where: {
          user_id: userId,
        }
      })
      if (!userToken) {
        throw new Error("User token not found");
      }
      
      return userToken;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default UserTokenRepository