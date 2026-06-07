import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { loadThreads, newThreadId, upsertThread } from "@/lib/storage";

export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    const existing = loadThreads();
    const id = existing[0]?.id ?? newThreadId();
    if (!existing[0]) {
      upsertThread({
        id,
        title: "New chat",
        updatedAt: Date.now(),
        messages: [],
      });
      window.dispatchEvent(new Event("l2c:threads-changed"));
    }
    navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
  }, [navigate]);

  return (
    <div className="flex h-[calc(100vh-3rem)] items-center justify-center text-sm text-muted-foreground">
      Opening your chat…
    </div>
  );
}