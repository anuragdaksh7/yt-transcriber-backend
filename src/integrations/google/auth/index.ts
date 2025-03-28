import axios from "axios";
import ENV_CONFIG from "../../../configs/env.config";
import scopes from "../../../configs/scopes";
import type CryptoEncoder from "../../../helpers/cryptoEncoder";
import type { UserRepository } from "../../../repository/implementation/user.repository";
import type UserTokenRepository from "../../../repository/implementation/userToken.repository";
import logger from "../../../utils/logger";
import type { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import type { User } from "@prisma/client";
import type JwtHelper from "../../../helpers/jwtHelper";

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URL
} = ENV_CONFIG;

interface GoogleOAuthContract {
  getRedirectUriForGoogle(): string;
  getTokenByCodeForGoogle(code: string): any;
  getOauth2Client(token: Credentials): OAuth2Client;
  createLoginUser(access_token: string, refresh_token: string, expires_in: any): Promise<any>;
}

class GoogleOAuth implements GoogleOAuthContract {
  private rootUrl: string;
  private tokenUrl: string;
  private userTokenRepository: UserTokenRepository;
  private userRepository: UserRepository;
  private cryptoEncoder: CryptoEncoder;
  private jwtHelper: JwtHelper;

  constructor(_userTokenRepository: UserTokenRepository, _userRepository: UserRepository, _cryptoEncoder: CryptoEncoder, _jwtHelper: JwtHelper) {
    this.rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
    this.tokenUrl = "https://oauth2.googleapis.com/token";
    this.userTokenRepository = _userTokenRepository;
    this.userRepository = _userRepository;
    this.cryptoEncoder = _cryptoEncoder;
    this.jwtHelper = _jwtHelper;
  }

  getRedirectUriForGoogle(): string {
    try {
      const options = {
        redirect_uri: GOOGLE_OAUTH_REDIRECT_URL,
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: scopes.join(" ")
      }
      
      const qs = new URLSearchParams(options);
      let URL = `${this.rootUrl}?${qs.toString()}`;

      return URL
    } catch (error: any) {
      logger.error(
        `Error while getting access token and instance url from go high level auth: ${
          error?.response?.data?.message ?? error.message
        }`,
      );
      throw new Error(error);
    }
  }

  getTokenByCodeForGoogle = async (code: string) => {
    try {
      const options = {
        url: this.tokenUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          code: code,
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri: GOOGLE_OAUTH_REDIRECT_URL,
          grant_type: "authorization_code",
        },
      }

      const google_response = await axios.request(options)
      return google_response?.data
    } catch (error: any) {
      logger.error(
        `Error while getting Access token: ${error?.response?.data?.error_description ?? error.message}`,
        error,
      );
      throw new Error(error?.response?.data?.error_description ?? error.message);
    }
  }

  getOauth2Client = (token: Credentials): OAuth2Client => {
    try {
      const oauth2Client = new google.auth.OAuth2(
        GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET,
        GOOGLE_OAUTH_REDIRECT_URL,
      );
      oauth2Client.setCredentials(token);
      return oauth2Client;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  createLoginUser = async (access_token: string, refresh_token: string, expires_in: any): Promise<any> => {
    try {
      const userResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          }
        }
      )

      let userRes = await this.userRepository.getUserByEmail(
        userResponse?.data?.email
      )
      if (!userRes) {
        logger.info("User not found, creating new user")
      }
      
      userRes = await this.userRepository.create({
        email: userResponse.data.email,
        first_name: userResponse.data.given_name.split(" ")[0],
        last_name: userResponse.data.given_name.split(" ")[1] || "",
        image_url: userResponse.data.picture,
        provider: "GOOGLE",
        verified: true,
        verification_code: ""
      })

      await this.userTokenRepository.createUserToken({
        userId: userRes.id
      })

      const accessToken = this.jwtHelper.generateAccessToken({
        user_id: userRes.id,
        email: userRes.email
      })

      const refreshToken = this.jwtHelper.generateAccessToken({
        user_id: userRes.id,
        email: userRes.email,
      });

      const updateUserGoogleToken = await this.userTokenRepository.updateGoogleToken({
        userId: userRes.id,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken
      })

      logger.info("Google data updated successfully")
      return {
        user: userRes,
        access_token: accessToken,
        refresh_token: refreshToken
      }
    } catch (error: any) {
      logger.error(`Error in verifying google code: ${error.message}`);
      throw new Error(error)
    }
  }
}

export default GoogleOAuth;
