import { FormEvent, useMemo, useState } from "react";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AiProvider,
  ChatMessage,
  getDefaultModel,
  requestAssistantResponse,
} from "@/lib/aiChat";

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY ?? "";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";

interface AIAssistantPanelProps {
  mode: "consumer" | "business";
}

function getWelcomeMessage(mode: "consumer" | "business"): string {
  if (mode === "business") {
    return "I can help with neighborhood targeting, campaign strategy, and offer ideas for Seattle expansion.";
  }

  return "I can help you choose Seattle neighborhoods based on commute, budget, and wellness priorities.";
}

export default function AIAssistantPanel({ mode }: AIAssistantPanelProps) {
  const [provider, setProvider] = useState<AiProvider>("openai");
  const [openAiKey, setOpenAiKey] = useState(OPENAI_KEY);
  const [geminiKey, setGeminiKey] = useState(GEMINI_KEY);
  const [model, setModel] = useState(getDefaultModel("openai"));
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: getWelcomeMessage(mode) },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const title = mode === "business" ? "Business AI Assistant" : "Consumer AI Assistant";
  const subtitle = mode === "business"
    ? "Ask for market strategy, neighborhood opportunity analysis, or campaign recommendations."
    : "Ask for personalized neighborhood guidance, comparison help, or move planning advice.";

  const apiKey = useMemo(() => {
    return provider === "openai" ? openAiKey : geminiKey;
  }, [provider, openAiKey, geminiKey]);

  const onProviderChange = (nextProvider: AiProvider) => {
    setProvider(nextProvider);
    setModel(getDefaultModel(nextProvider));
  };

  const onSend = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const assistantReply = await requestAssistantResponse({
        provider,
        apiKey,
        model,
        messages: nextMessages,
        mode,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: assistantReply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to get AI response.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered planning assistant
          </div>
          <h1 className="mt-3 text-3xl font-display font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-base">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-xs font-medium text-muted-foreground">
                Provider
                <select
                  value={provider}
                  onChange={(event) => onProviderChange(event.target.value as AiProvider)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-muted-foreground">
                Model
                <Input
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  placeholder={getDefaultModel(provider)}
                  className="mt-1"
                />
              </label>

              <label className="block text-xs font-medium text-muted-foreground">
                {provider === "openai" ? "OpenAI API Key" : "Gemini API Key"}
                <Input
                  type="password"
                  value={provider === "openai" ? openAiKey : geminiKey}
                  onChange={(event) => {
                    if (provider === "openai") {
                      setOpenAiKey(event.target.value);
                    } else {
                      setGeminiKey(event.target.value);
                    }
                  }}
                  placeholder="Paste API key (optional for mock mode)"
                  className="mt-1"
                />
              </label>

              <p className="text-xs text-muted-foreground">
                Without a key, this runs in mock mode so you can demo UX immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[420px] overflow-y-auto rounded-lg border border-border bg-secondary/25 p-3 space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading ? <p className="text-xs text-muted-foreground">Assistant is thinking...</p> : null}
              </div>

              <form onSubmit={onSend} className="mt-3 flex gap-2">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={mode === "business" ? "Example: Recommend a 30-day launch campaign for Ballard" : "Example: I need a safe neighborhood under $1800 near UW"}
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <SendHorizonal className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </form>

              {errorMessage ? (
                <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
