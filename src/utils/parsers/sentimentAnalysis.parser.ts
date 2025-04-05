export function parseSentimentAnalysis(jsonString: string) {
  try {
    const cleanedString = jsonString.replace(/```json\n|```\n|```/g, "");
    const data = JSON.parse(cleanedString);

    if (
      data &&
      data.sentimental_analysis &&
      data.sentimental_analysis.overall_sentiment &&
      data.sentimental_analysis.sentiment_score &&
      typeof data.sentimental_analysis.sentiment_score.positive === "number" &&
      typeof data.sentimental_analysis.sentiment_score.neutral === "number" &&
      typeof data.sentimental_analysis.sentiment_score.negative === "number"
    ) {
      return {
        overallSentiment: data.sentimental_analysis.overall_sentiment,
        sentimentScore: {
          positive: data.sentimental_analysis.sentiment_score.positive,
          neutral: data.sentimental_analysis.sentiment_score.neutral,
          negative: data.sentimental_analysis.sentiment_score.negative,
        },
      };
    } else {
      console.error("Invalid sentimental analysis JSON format.");
      return null;
    }
  } catch (error) {
    console.error("Error parsing sentimental analysis JSON:", error);
    return null;
  }
}

const jsonString =
  '```json\n{\n  "sentimental_analysis": {\n    "overall_sentiment": "Mixed. Predominantly negative due to the recounting of tragic incidents, but with neutral framing and a concluding positive note.",\n    "sentiment_score": {\n      "positive": 0.15,\n      "neutral": 0.45,\n      "negative": 0.40\n    }\n  }\n}\n```';

const sentimentData = parseSentimentAnalysis(jsonString);
