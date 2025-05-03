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
      Here is the video's full subtitles can you provide me with a summary for the video, keep it consise and give it to me with no formatting also dont include any extra information just paragraph for the summary also include keywords and response should be like {
    "text": "This [topic] uses [method] with <highlight keyword='[Concept 1]'>[Concept 1]</highlight> (like [analogy]). Focus on <highlight keyword='[Concept 2]'>[Concept 2]</highlight> by finding [gap]. Price with <highlight keyword='[Concept 3]'>[Concept 3]</highlight> (outcomes, not [units]). Avoid <highlight keyword='[Concept 4]'>[Concept 4]</highlight>. <highlight keyword='[Concept 5]'>[Concept 5]</highlight> for uniqueness. Use <highlight keyword='[Concept 6]'>[Concept 6]</highlight> for scale.",
    "keywords": {
      "[Concept 1]": "[Short Description 1]",
      "[Concept 2]": "[Short Description 2]",
      "[Concept 3]": "[Short Description 3]",
      "[Concept 4]": "[Short Description 4]",
      "[Concept 5]": "[Short Description 5]",
      "[Concept 6]": "[Short Description 6]"
    },
    "final_thought": "Next [big thing] is [simple combo]."
  } -> the text field contains the summary of the video, stick rigidly to defined response and number of concepts can be variable and the concepts must be present in the text feild, stick to the format RIGIDLY, also complete the placeholder in final thought by adding big thing and the simple combo about the video: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  generateVideoDetailedSummary = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a detailed summary for the video, keep it consise and give it to me with no formatting also dont include any extra information just paragraph for the summary with details in about 500 words ${text}
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

  getVideoHashTags = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a list of hashtags for the video, keep it consise and give it to me with no formatting also dont include any extra information just return the hashtags in a json array format: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  getVideoImageGenerationPrompt = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a prompt for image generation for the video, keep it consise and give it to me with no formatting also dont include any extra information: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  generateTwitterPost = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a tweet for the video, keep it consise and give it to me with no formatting also dont include any extra information: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  generateBlogPostLayout = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a blog post layout for the video, keep it consise and give it to me with no formatting also dont include any extra information, the response should be in markdown format: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }

  generateLinkedinPost = async (text: String) => {
    const response = await this.model?.generateContent(`
      Here is the video's full subtitles can you provide me with a linkedin post for the video, keep it consise and give it to me with no formatting also dont include any extra information: ${text}
    `)
      
    const result = response?.response;
    const content = result.text();

    return content;
  }
}

export default GoogleGenAIInstance