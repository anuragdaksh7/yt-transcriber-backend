import express from "express"
import GoogleOAuthController from "../controller/implementation/google.oauth.controller";
import GoogleOAuth from "../integrations/google/auth";
import UserTokenRepository from "../repository/implementation/userToken.repository";
import _prisma from "../db/dbConn";
import CryptoEncoder from "../helpers/cryptoEncoder";
import { UserRepository } from "../repository/implementation/user.repository";
import JwtHelper from "../helpers/jwtHelper";
import YoutubeController from "../controller/implementation/youtube.controller";
import GoogleGenAIInstance from "../integrations/google/gemini";

const v1Router = express.Router();

const _cryptoEncoder = new CryptoEncoder();
const _jwtHelper = new JwtHelper();

const _userTokenRepository = new UserTokenRepository(_cryptoEncoder, _prisma);
const _userRepository = new UserRepository(_prisma)

const _gemini = new GoogleGenAIInstance(Bun.env.GOOGLE_GEMINI_API_KEY || "")
const _googleOAuth = new GoogleOAuth(_userTokenRepository, _userRepository, _cryptoEncoder, _jwtHelper)

const googleOAuthController = new GoogleOAuthController(_googleOAuth)
const youtubeController = new YoutubeController(_gemini)

const OAuthRouter = express.Router();

const googleOAuthRouter = express.Router();
googleOAuthRouter.get('/redirect-uri', googleOAuthController.getRedirectUriForGoogle)
googleOAuthRouter.post("/verify", googleOAuthController.verifyCodeForGoogle)

const youtubeRouter = express.Router()
youtubeRouter.post("/summary", youtubeController.getVideoSummary)

OAuthRouter.use("/google", googleOAuthRouter)
v1Router.use("/oauth", OAuthRouter)
v1Router.use("/youtube", youtubeRouter);


export default v1Router