import { OpenAI } from "openai";

// Unified AI client for the Devvit co-pilot features.
// Uses OpenAI-compatible endpoints; configure per the provider in env.

const apiKey = process.env.AI_API_KEY;
const baseURL = process.env.AI_BASE_URL;
const model = process.env.AI_MODEL ?? "gpt-4o-mini";

export const aiConfigured = () => Boolean(apiKey);

const getClient = () => {
  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured.");
  }
  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
};

export const complete = async (messages: { role: string; content: string }[]) => {
  const client = getClient();
  const response = await client.chat.completions.create({
    model,
    messages: messages as { role: "system" | "user"; content: string }[],
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content ?? "";
};

export const completeJSON = async <T>(
  system: string,
  user: string
): Promise<T | null> => {
  const content = await complete([
    { role: "system", content: `${system}\nRespond with raw JSON only.` },
    { role: "user", content: user },
  ]);

  try {
    const cleaned = content
      .replace(/```json\s*/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
};
