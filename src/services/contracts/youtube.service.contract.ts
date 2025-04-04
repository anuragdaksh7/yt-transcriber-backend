export type YoutubeDataResponse = {
  summary: {
    text: string,
    keywords: {
      [key: string]: {
        surrounding_text: string,
        definition: string
      }
    },
    final_thought: string
  } | null,
  detailedSummary: string | null,
  sentimentScore: {
    overallSentiment: string,
    sentimentScore: {
      positive: number,
      neutral: number,
      negative: number
    }
  } | null,
  hashtags: string[],
  transcription: { text: string, duration: number, offset: number, lang?: string | undefined }[]
}

export interface YoutubeServiceContract {
  getVideoData(youtubeUrl: string): Promise<YoutubeDataResponse>;
}