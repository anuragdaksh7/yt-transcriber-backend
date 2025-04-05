export function parseHashtagJson(jsonString: string) {
  try {
    jsonString = jsonString.replace("```json\n", "").replace("```", "");
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(`Error parsing JSON: ${e}`);
    return null;
  }
}

// const jsonString = "```json\n[\"#scary\", \"#mountains\", \"#hiking\", \"#disaster\", \"#truecrime\", \"#survival\", \"#missingpersons\", \"#unexplained\", \"#alpine\", \"#krippenstein\", \"#rokkō\", \"#hypothermia\"]\n```"

// const parsedHashtags = parseHashtagJson(jsonString);

// if (parsedHashtags) {
//   console.log(parsedHashtags);
// }
