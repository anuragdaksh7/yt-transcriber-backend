import type { Response } from "express";

import type GoogleOAuth from "../../integrations/google/auth";

import type { GoogleOAuthControllerContract } from "../contracts/google.oauth.controller.contract";

import {
  InternalServerErrorResponse,
  SuccessResponse,
  UnprocessableEntityResponse,
} from "../../utils/responses";
import logger from "../../utils/logger";

class GoogleOAuthController implements GoogleOAuthControllerContract {
  private googleOAuth: GoogleOAuth;
  constructor(_googleOAuth: GoogleOAuth) {
    this.googleOAuth = _googleOAuth;
  }

  getRedirectUriForGoogle = async (req: any, res: Response): Promise<any> => {
    try {
      const redirectUri = this.googleOAuth.getRedirectUriForGoogle();

      return SuccessResponse.send(
        res,
        redirectUri,
        "Google redirect uri fetched successfully."
      );
    } catch (error: any) {
      logger.error(`Error in generating redirect uri: ${error.message}`);
      return InternalServerErrorResponse.send(res, error?.message);
    }
  };

  verifyCodeForGoogle = async (req: any, res: Response): Promise<any> => {
    try {
      const { code } = req.body;

      if (!code) {
        logger.error("Code is required");
        return UnprocessableEntityResponse.send(res, "Code is required");
      }

      const googleData = await this.googleOAuth.getTokenByCodeForGoogle(code);
      if (!googleData) {
        logger.error(`Error in verifying google code: ${code}`);
        return InternalServerErrorResponse.send(res, "Unknown error");
      }

      const updateUserRes = await this.googleOAuth.createLoginUser(
        googleData.access_token,
        googleData.refresh_token,
        googleData.exprires_in
      );

      return SuccessResponse.send(
        res,
        updateUserRes,
        "User created successfully"
      );
    } catch (error: any) {
      logger.error(`Error: ${error.message}`, error);
      return InternalServerErrorResponse.send(res, error?.message || error);
    }
  };
}

export default GoogleOAuthController;
