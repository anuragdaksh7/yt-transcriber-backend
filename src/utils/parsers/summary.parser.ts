import logger from "../logger";

export function parseSummaryJson(jsonString: string): any {
  /**
   * Parses a JSON string containing a summary with highlighted keywords.
   *
   * @param {string} jsonString The string containing the JSON data.
   * @returns {object|null} A dictionary containing the parsed data, or null if parsing fails.
   */
  try {
    // Remove the "```json\n" and "```" surrounding the JSON
    jsonString = jsonString.replace("```json\n", "").replace("```", "");
    return JSON.parse(jsonString);
  } catch (e) {
    logger.error("Error parsing JSON:", e);
    throw new Error(`Error parsing JSON`);
  }
}

function extractHighlightedKeywords(text: any) {
  /**
   * Extracts highlighted keywords and their surrounding text from a string.
   *
   * @param {string} text The string containing highlighted keywords.
   * @returns {Array<Array<string>>} A list of tuples, where each tuple contains [keyword, surrounding_text].
   */
  const keywords = [];
  const regex = /<highlight keyword='(.*?)'>(.*?)<\/highlight>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    keywords.push([match[1], match[2]]);
  }
  return keywords;
}

export function processSummary(jsonData: any) {
  if (!jsonData) {
    return null;
  }

  const text = jsonData.text || "";
  const keywords = jsonData.keywords || {};
  const finalThought = jsonData.final_thought || "";

  const highlightedKeywords = extractHighlightedKeywords(text);
  const processedKeywords: { [key: string]: { surrounding_text: string, definition: string } } = {};

  highlightedKeywords.forEach(([keyword, surroundingText]) => {
    processedKeywords[keyword] = {
      surrounding_text: surroundingText,
      definition: keywords[keyword] || "",
    };
  });

  const processedText = text.replace(/<highlight keyword='(.*?)'>(.*?)<\/highlight>/g, "$2");

  return {
    text: processedText,
    keywords: processedKeywords,
    final_thought: finalThought,
  };
}

// const jsonString = "```json\n{\n    \"text\": \"This video recounts three disturbing mountain incidents. The first involves two <highlight keyword='Austrian Climbers'>Austrian Climbers</highlight> (experienced, but met with unknown fate). Focus on <highlight keyword='Mitsutaka'>Mitsutaka</highlight> by surviving <highlight keyword='Hypothermia'>Hypothermia</highlight>. Dr. Minami created <highlight keyword='Hibernation Theory'>Hibernation Theory</highlight>. Avoid <highlight keyword='Overconfidence'>Overconfidence</highlight>. <highlight keyword='Krippenstein'>Krippenstein</highlight> tragic end due to poor choices.\",\n    \"keywords\": {\n      \"Austrian Climbers\": \"Experienced climbers who died in the Julian Alps, cause unknown.\",\n      \"Mitsutaka\": \"A man who survived severe hypothermia for 24 days on Mount Rokko.\",\n      \"Hypothermia\": \"A condition where the body temperature drops to a dangerously low level.\",\n      \"Hibernation Theory\": \"Dr. Minami's theory that Mitsutaka survived due to entering a state of hibernation.\",\n      \"Overconfidence\": \"Hans' inability to heed warnings and ending in tragedy\",\n      \"Krippenstein\": \"A mountain trip gone wrong\"\n    },\n    \"final_thought\": \"Scary Interesting stories retold in audio\"\n  }\n```"

// const parsedData = parseSummaryJson(jsonString);
// const processedData = processSummary(parsedData);

// if (processedData) {
//   console.log(JSON.stringify(processedData, null, 2));
// }