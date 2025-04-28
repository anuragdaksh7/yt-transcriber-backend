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
import YoutubeService from "../services/implementation/youtube.service";
import SentimentRepository from "../repository/implementation/sentiment.repository";
import HashTagsRepository from "../repository/implementation/hashtags.repository";
import KeywordRepository from "../repository/implementation/keyword.repository";
import YoutubeTranscriptionRepository from "../repository/implementation/youtubeTranscription.repository";
import { UserService } from "../services/implementation/user.service";
import AuthMiddleware from "../middleware/auth.middleware";
import YoutubeUserRepository from "../repository/implementation/youtubeUser.repository";

const v1Router = express.Router();

const _cryptoEncoder = new CryptoEncoder();
const _jwtHelper = new JwtHelper();

const _userTokenRepository = new UserTokenRepository(_cryptoEncoder, _prisma);
const _userRepository = new UserRepository(_prisma)
const _youtubeTranscriptionRepository = new YoutubeTranscriptionRepository(_prisma)
const _sentimentRepository = new SentimentRepository(_prisma);
const _hashTagsRepository = new HashTagsRepository(_prisma);
const _keywordsRepository = new KeywordRepository(_prisma);
const _youtubeUserRepository = new YoutubeUserRepository(_prisma)

const _gemini = new GoogleGenAIInstance(Bun.env.GOOGLE_GEMINI_API_KEY || "")
const _googleOAuth = new GoogleOAuth(_userTokenRepository, _userRepository, _cryptoEncoder, _jwtHelper)

const _youtubeService = new YoutubeService(_gemini, _youtubeTranscriptionRepository, _hashTagsRepository, _sentimentRepository, _keywordsRepository, _youtubeUserRepository)
const _userService = new UserService(_userRepository)

const _authHelper = new AuthMiddleware(_jwtHelper, _userService);

const googleOAuthController = new GoogleOAuthController(_googleOAuth)
const youtubeController = new YoutubeController(_gemini, _youtubeService)

const OAuthRouter = express.Router();

const googleOAuthRouter = express.Router();
googleOAuthRouter.get('/redirect-uri', googleOAuthController.getRedirectUriForGoogle)
googleOAuthRouter.post("/verify", googleOAuthController.verifyCodeForGoogle)

const youtubeRouter = express.Router()
youtubeRouter.post("/summary", _authHelper.authenticate, youtubeController.getVideoSummary)
youtubeRouter.post("/share", _authHelper.authenticate, youtubeController.getVideoUserData)
youtubeRouter.post("/update-name", _authHelper.authenticate, youtubeController.updateVideoName)

OAuthRouter.use("/google", googleOAuthRouter)
v1Router.use("/oauth", OAuthRouter)
v1Router.use("/youtube", youtubeRouter);


export default v1Router