import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bot, CornerDownLeft, Loader2, MessageSquareText, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import CriteriaSummaryCard from "@/components/chat/CriteriaSummaryCard";

const samplePrompts = [
  "I’m moving near UW, need rent under $1800, and want a 20 minute commute with good parks.",
  "I work in South Lake Union, want something walkable and social, but not Capitol Hill.",
  "I’m remote, want a quiet neighborhood with trails, and my max is $1700.",
];

export default function ConversationIntakePanel() {
  const navigate = useNavigate();
  const {
    conversation,
    sendIntakeMessage,
    criteria,
    updateCriteria,
    criteriaReady,
    continueToApp,
    hasEnteredApp,
    resetIntake,
    isSending,
  } = useApp();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll conversation to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isSending]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || isSending) return;
    const msg = draft;
    setDraft("");
    await sendIntakeMessage(msg);
  };

  const handleContinue = () => {
    continueToApp();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <MessageSquareText className="h-3.5 w-3.5 text-primary" />
              Conversational intake and criteria handoff
            </div>
            <h1 className="mt-3 text-3xl font-display font-bold">Start with a guided conversation</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Tell PulsePath what matters, let the assistant refine your needs into structured criteria,
              and then use those criteria to drive maps, rankings, and recommendations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasEnteredApp ? (
              <Button variant="outline" onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
            ) : null}
            <Button variant="outline" onClick={resetIntake}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Session
            </Button>
            <Button onClick={handleContinue} disabled={!criteriaReady}>
              Continue to App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-12">
          <Card className="xl:col-span-7 border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Decision Guide Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={scrollRef} className="h-[520px] overflow-y-auto rounded-xl border border-border bg-secondary/20 p-3">
                <div className="space-y-3">
                  {conversation.map((message) => (
                    <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                      <div
                        className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card text-foreground"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Bot className="inline-block w-3.5 h-3.5 mr-1.5 mb-0.5 text-primary opacity-70" />
                        )}
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start mt-2">
                      <div className="border border-border bg-card rounded-2xl px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        Analyzing your message…
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {samplePrompts.map((prompt) => (
                  <Button key={prompt} type="button" variant="outline" size="sm" onClick={() => setDraft(prompt)}>
                    {prompt}
                  </Button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Example: I need to be near UW, keep rent under $1800, and I care a lot about parks and walkability."
                  className="min-h-[120px]"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    The assistant will ask follow-up questions until your criteria is strong enough to drive recommendations.
                  </p>
                  <Button type="submit" disabled={!draft.trim() || isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSending ? "Analyzing…" : "Send"}
                    <CornerDownLeft className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="xl:col-span-5 space-y-4">
            <CriteriaSummaryCard criteria={criteria} editable onChange={updateCriteria} />
          </div>
        </div>
      </div>
    </div>
  );
}
