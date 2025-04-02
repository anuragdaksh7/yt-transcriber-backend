export function parseSentimentAnalysis(jsonString: string) {
  try {
    // Remove the ```json and ``` parts from the string
    const cleanedString = jsonString.replace(/```json\n|```\n/g, '');

    const data = JSON.parse(cleanedString);

    if (
      data &&
      data.sentimental_analysis &&
      data.sentimental_analysis.overall_sentiment &&
      data.sentimental_analysis.sentiment_score &&
      typeof data.sentimental_analysis.sentiment_score.positive === 'number' &&
      typeof data.sentimental_analysis.sentiment_score.neutral === 'number' &&
      typeof data.sentimental_analysis.sentiment_score.negative === 'number'
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
      console.error('Invalid sentimental analysis JSON format.');
      return null; // Or throw an error, depending on your needs.
    }
  } catch (error) {
    console.error('Error parsing sentimental analysis JSON:', error);
    return null; // Or throw an error.
  }
}

// const jsonString = "```json\n{\n  \"sentimental_analysis\": {\n    \"overall_sentiment\": \"Positive and Encouraging\",\n    \"sentiment_score\": {\n      \"positive\": 0.75,\n      \"neutral\": 0.20,\n      \"negative\": 0.05\n    }\n  }\n}\n```\n";

// const sentimentData = parseSentimentAnalysis(jsonString);