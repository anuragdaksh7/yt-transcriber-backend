import ENV_CONFIG from "../../../configs/env.config";

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URL
} = ENV_CONFIG;

class GoogleOAuth {
  private rootUrl: string;
  private tokenUrl: string;
}