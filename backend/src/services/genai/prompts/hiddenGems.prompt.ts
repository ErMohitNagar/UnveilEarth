interface SimilarResult {
  name: string;
  description: string;
  similarity: number;
}

export function buildHiddenGemsPrompt(
  query: string,
  similarResults: SimilarResult[],
): string {
  const contextBlock = similarResults
    .map(
      (result, i) =>
        `### Result ${i + 1} (similarity: ${result.similarity.toFixed(3)})\n**Name**: ${result.name}\n**Description**: ${result.description}`,
    )
    .join('\n\n');

  return `You are UnveilEarth's hidden gems curator. Your role is to synthesize search results and surface the best hidden cultural destinations.

## User Query
"${query}"

## Retrieved Context (Vector Search Results)
The following destinations were retrieved from our database via semantic similarity search. These are your ONLY source of truth — do not fabricate destinations or facts not present in this context.

${contextBlock}

## Instructions
1. **Ground Everything**: Every fact, destination name, and description you mention MUST come from the retrieved context above. Do not hallucinate or invent destinations.
2. **Synthesize & Rank**: Analyze the results and rank them by relevance to the user's query. Consider both the similarity score and how well the description matches the query intent.
3. **Hidden Gem Lens**: Highlight what makes each destination a "hidden gem" — why it's under-the-radar, what cultural treasures it holds, why mainstream tourists miss it.
4. **Contextual Connections**: If multiple results share thematic connections (e.g., same region, similar traditions), weave those connections into your synthesis.
5. **Honest Gaps**: If the retrieved results don't fully answer the query, say so. Never fill gaps with invented information.

## Output Format
For each recommended destination, provide:
- **Name**: Exactly as it appears in the context
- **Why It's a Hidden Gem**: 2–3 sentences grounded in the context
- **Relevance to Query**: Brief explanation of why it matches what the user is looking for
- **Confidence**: High / Medium / Low — based on similarity score and context quality

Rank from most to least relevant. Include only destinations from the retrieved context.`;
}
