"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, KeyboardEvent, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
}

export function MessageInput({ conversationId, senderId }: MessageInputProps) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const sendMessage = useMutation(api.messages.send);
  const setTyping = useMutation(api.typing.setTyping);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear typing indicator on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setTyping({ conversationId, userId: senderId, isTyping: false }).catch(
        () => {}
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, senderId]);

  const stopTyping = useCallback(() => {
    setTyping({ conversationId, userId: senderId, isTyping: false }).catch(
      () => {}
    );
  }, [conversationId, senderId, setTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);

    // Emit typing indicator
    setTyping({ conversationId, userId: senderId, isTyping: true }).catch(
      () => {}
    );

    // Auto-stop typing after 2.5s of no input
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 2500);
  };

  const handleSend = async () => {
    if (!body.trim() || sending) return;
    // Clear typing indicator immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    stopTyping();
    setSending(true);
    try {
      await sendMessage({ conversationId, senderId, body: body.trim() });
      setBody("");
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t p-3 md:p-4">
      <textarea
        value={body}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
        rows={1}
        className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        style={{ maxHeight: "8rem", overflowY: "auto" }}
      />
      <Button
        onClick={handleSend}
        disabled={!body.trim() || sending}
        size="icon"
        className="shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
