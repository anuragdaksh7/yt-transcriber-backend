export function parseHashtagJson(jsonString: string) {
  try {
    // Remove the "```json\n" and "```" surrounding the JSON
    jsonString = jsonString.replace("```json\n", "").replace("```", "");
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(`Error parsing JSON: ${e}`);
    return null;
  }
}

// Example usage:
// const jsonString = "```json\n[\"#scary\", \"#mountains\", \"#hiking\", \"#disaster\", \"#truecrime\", \"#survival\", \"#missingpersons\", \"#unexplained\", \"#alpine\", \"#krippenstein\", \"#rokkō\", \"#hypothermia\"]\n```"

// const parsedHashtags = parseHashtagJson(jsonString);

// if (parsedHashtags) {
//   console.log(parsedHashtags);
// }