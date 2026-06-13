import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { MENTOR_SYSTEM_PROMPT } from "@/lib/mentor-prompt";

const MAX_MESSAGES = 50;
const MAX_MESSAGE_CHARS = 4000;
const MAX_CONTEXT_CHARS = 2000;

// Loose UIMessage shape — we only enforce size limits here; the AI SDK
// validates the rest of the structure when converting to model messages.
const messageSchema = z
  .object({
    id: z.string().max(128).optional(),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(z.unknown()).max(20).optional(),
    content: z.unknown().optional(),
  })
  .passthrough()
  .refine(
    (m) => JSON.stringify(m).length <= MAX_MESSAGE_CHARS,
    { message: `Message exceeds ${MAX_MESSAGE_CHARS} characters` },
  );

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
  context: z.string().max(MAX_CONTEXT_CHARS).optional(),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) {
          return new Response("Invalid request payload", { status: 400 });
        }
        const { messages, context } = parsed.data;

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const contextBlock = context && context.length > 0
          ? `\n\n# Student context\n${context}`
          : "";

        const result = streamText({
          model,
          system: MENTOR_SYSTEM_PROMPT + contextBlock,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});