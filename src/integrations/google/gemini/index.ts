import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"

class GoogleGenAIInstance {
  private apiKey: string;
  private model: GenerativeModel;

  constructor(_apiKey: string) {
    this.apiKey = _apiKey
    const genAI = new GoogleGenerativeAI(_apiKey);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  }

  generateVideoSummary = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a summary for the video, keep it consise and give it to me with no formatting also dont include any extra information just paragraph for the summary: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  generateVideoDetailedSummary = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a detailed summary for the video, keep it consise and give it to me with no formatting also dont include any extra information just paragraph for the summary: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  generateVideoSenitmentalAnalysis = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's subtitles can you provide me with a sentimental analysis of this video provide me the results in such format 
      "sentimental_analysis": {
        "overall_sentiment": "Positive and Encouraging",
        "sentiment_score": {
          "positive": <Float>,
          "neutral": <Float>,
          "negative": <Float>,
        },
      }
        also the value can be between 0-1
      dont include any unnecessary text only return this object
      the transcript is: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }
}

export default GoogleGenAIInstance