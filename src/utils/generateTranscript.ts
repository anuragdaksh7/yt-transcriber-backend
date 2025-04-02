import { YoutubeTranscript } from 'youtube-transcript';

export const getYoutubeTranscript = async (url: string) => {
  const response = await YoutubeTranscript.fetchTranscript(url)
  return response;
}
