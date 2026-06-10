import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

import { MentorLogo } from "@/components/MentorLogo";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { currentDayNumber, getThread, loadProgress, upsertThread } from "@/lib/storage";
import { getDay } from "@/lib/datasets/roadmap";
import { buildStudentContext } from "@/lib/mentor-prompt";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThread,
});

const STARTERS = [
  "What is the difference between Array and ArrayList?",
  "How do I connect MySQL with Spring Boot?",
  "Give me a study plan for today.",
  "Explain inheritance with a real-life example.",
];

function ChatThread() {
  const { threadId } = Route.useParams();
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    const t = getThread(threadId);
    setInitialMessages(t?.messages ?? []);
  }, [threadId]);

  if (initialMessages === null) {
    return (
      <div className="flex h-[calc(100dvh-3rem)] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <ChatInner key={threadId} threadId={threadId} initialMessages={initialMessages} />
  );
}

function ChatInner({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: UIMessage[];
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const day = currentDayNumber();
  const today = getDay(day);
  const context = useMemo(
    () => buildStudentContext({ day, progress: loadProgress() }),
    [day],
  );

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  useEffect(() => {
    if (messages.length === 0) return;
    const firstUser = messages.find((m) => m.role === "user");
    const firstText =
      firstUser?.parts.find((p) => p.type === "text")?.text ?? "New chat";
    const title = firstText.slice(0, 48);
    upsertThread({
      id: threadId,
      title,
      updatedAt: Date.now(),
      messages,
    });
    window.dispatchEvent(new Event("l2c:threads-changed"));
  }, [messages, threadId]);

  // Pick up a seed prompt set from the landing page / mentor hub quick actions.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialMessages.length > 0) return;
    const seed = window.sessionStorage.getItem("l2c.seedPrompt");
    if (!seed) return;
    window.sessionStorage.removeItem("l2c.seedPrompt");
    void sendMessage({ text: seed }, { body: { context } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = status === "submitted" || status === "streaming";

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await sendMessage({ text: trimmed }, { body: { context } });
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MentorLogo size={48} />}
              title="How can I mentor you today?"
              description={`You're on Day ${day} — ${today.topic}. Ask anything, or pick a starter below.`}
            >
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              return (
                <Message key={m.id} from={m.role}>
                  {m.role === "assistant" ? (
                    <div className="mentor-markdown max-w-none text-foreground">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  ) : (
                    <MessageContent>{text}</MessageContent>
                  )}
                </Message>
              );
            })
          )}
          {loading && messages[messages.length - 1]?.role !== "assistant" ? (
            <Message from="assistant">
              <div className="px-2">
                <Shimmer>Thinking…</Shimmer>
              </div>
            </Message>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/60 p-3 backdrop-blur">
        <PromptInput
          onSubmit={async (msg) => {
            await handleSend(msg.text);
          }}
        >
          <PromptInputTextarea
            placeholder="Ask your mentor anything — Java, SQL, projects, interviews, career…"
            autoFocus
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={loading} />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Day {day} of 120 · {today.module} · {today.topic}
        </p>
      </div>
    </div>
  );
}