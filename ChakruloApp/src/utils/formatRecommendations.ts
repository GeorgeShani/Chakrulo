export function formatRecommendations(text: string): string[] {
   return text
     .split("\n")
     .map((line) => line.replace(/^\d+\.\s*/, "").trim())
     .filter((line) => line.length > 0);
}