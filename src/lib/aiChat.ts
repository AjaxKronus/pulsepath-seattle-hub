export type AiProvider = "openai" | "gemini";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SendChatRequest {
  provider: AiProvider;
  apiKey: string;
  model?: string;
  messages: ChatMessage[];
  mode: "consumer" | "business";
}

const MODE_PROMPTS: Record<"consumer" | "business", string> = {
  consumer:
    "You are PulsePath Seattle's consumer relocation assistant. Help users choose neighborhoods based on rent, commute, wellness, safety, and lifestyle preferences. Be practical and concise.",
  business:
    "You are PulsePath Seattle's business expansion assistant. Help operators choose neighborhoods, campaigns, and offers based on opportunity score, transit, competition, and audience fit. Provide clear tactical recommendations.",
};

export function getDefaultModel(provider: AiProvider): string {
  return provider === "openai" ? "gpt-4o-mini" : "gemini-3-flash-preview";
}

function toOpenAiMessages(systemPrompt: string, messages: ChatMessage[]) {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

async function callOpenAi({ apiKey, model, messages, mode }: SendChatRequest): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || getDefaultModel("openai"),
      messages: toOpenAiMessages(MODE_PROMPTS[mode], messages),
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}

async function callGemini({ apiKey, model, messages, mode }: SendChatRequest): Promise<string> {
  const selectedModel = model || getDefaultModel("gemini");
  const fallbackModels = [
    "gemini-3-flash-preview",
    "gemini-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-latest",
  ];
  const candidateModels = [selectedModel, ...fallbackModels.filter((name) => name !== selectedModel)];

  let lastStatus = 0;
  let lastBody = "";

  for (const candidateModel of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: MODE_PROMPTS[mode] }],
        },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      lastStatus = response.status;
      lastBody = body;

      // Retry automatically when the model is unavailable.
      if (response.status === 404) {
        continue;
      }

      throw new Error(`Gemini request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    if (!content) {
      throw new Error("Gemini returned an empty response.");
    }

    return content;
  }

  throw new Error(`Gemini request failed (${lastStatus}): ${lastBody}`);
}

export function buildMockReply(mode: "consumer" | "business", prompt: string): string {
  const normalizedPrompt = prompt.trim();

  if (mode === "business") {
    return [
      "Mock business assistant response (no API key configured).",
      `Request understood: \"${normalizedPrompt}\"`,
      "",
      "Suggested action plan:",
      "1. Pick 2-3 target neighborhoods with high transit and fit.",
      "2. Run a 30-day offer test with clear conversion tracking.",
      "3. Compare lead quality and CAC before scaling budget.",
      "",
      "Tip: Add VITE_OPENAI_API_KEY or VITE_GEMINI_API_KEY in your .env.local to enable live AI responses.",
    ].join("\n");
  }

  return [
    "Mock consumer assistant response (no API key configured).",
    `Request understood: \"${normalizedPrompt}\"`,
    "",
    "Suggested action plan:",
    "1. Set budget and max commute constraints first.",
    "2. Compare top neighborhoods by resilience and wellness fit.",
    "3. Save 2-3 options, then review the resilience report.",
    "",
    "Tip: Add VITE_OPENAI_API_KEY or VITE_GEMINI_API_KEY in your .env.local to enable live AI responses.",
  ].join("\n");
}

export async function requestAssistantResponse(request: SendChatRequest): Promise<string> {
  if (!request.apiKey.trim()) {
    return buildMockReply(request.mode, request.messages[request.messages.length - 1]?.content || "");
  }

  if (request.provider === "openai") {
    return callOpenAi(request);
  }

  return callGemini(request);
}
