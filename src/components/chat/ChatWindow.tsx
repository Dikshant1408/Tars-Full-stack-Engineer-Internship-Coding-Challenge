"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn, formatTimestamp } from "@/lib/utils";
import { MessageInput } from "./MessageInput";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatWindowProps {
  conversationId: Id<"conversations">;
  currentUser: Doc<"users">;
}

export function ChatWindow({ conversationId, currentUser }: ChatWindowProps) {
  const router = useRouter();
  const conversations = useQuery(api.conversations.listForUser, {
    userId: currentUser._id,
  });
  const messages = useQuery(api.messages.list, { conversationId });
  const typingUsers = useQuery(api.typing.getTypingUsers, {
    conversationId,
    currentUserId: currentUser._id,
  });
  const markAsRead = useMutation(api.messages.markAsRead);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevMessageCountRef = useRef(0);

  const currentConv = conversations?.find((c) => c._id === conversationId);
  const otherUser = currentConv?.otherUser;

  const displayName = (u: Doc<"users">) => u.name || u.email;
  const initials = (u: Doc<"users">) => (u.name || u.email)[0].toUpperCase();

  // Track whether user is near the bottom of the scroll area
  const handleScroll = useCallback(() => {
    const el = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (!el) return;
    const threshold = 120;
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  // Smart auto-scroll: always scroll for own new message, only scroll for others' if near bottom
  useEffect(() => {
    if (!messages) return;
    const newCount = messages.length;
    const prevCount = prevMessageCountRef.current;

    if (newCount > prevCount) {
      const latestMsg = messages[newCount - 1];
      const isOwn = latestMsg?.senderId === currentUser._id;
      if (isOwn || isAtBottomRef.current) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
    prevMessageCountRef.current = newCount;
  }, [messages, currentUser._id]);

  // Mark as read whenever conversation is opened or new messages arrive
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    markAsRead({ conversationId, userId: currentUser._id }).catch(() => {});
  }, [messages, conversationId, currentUser._id, markAsRead]);

  const typingText =
    typingUsers && typingUsers.length > 0
      ? typingUsers
          .filter(Boolean)
          .map((u) => u!.name || u!.email.split("@")[0])
          .join(", ") +
        (typingUsers.length === 1 ? " is typing…" : " are typing…")
      : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 md:p-4">
        {/* Back button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={() => router.push("/chat")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {otherUser ? (
          <>
            <div className="relative shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={otherUser.imageUrl} />
                <AvatarFallback>{initials(otherUser)}</AvatarFallback>
              </Avatar>
              {otherUser.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {displayName(otherUser)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {otherUser.isOnline ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        )}
      </div>

      <Separator />

      {/* Message list */}
      {messages === undefined ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 p-4"
          onScrollCapture={handleScroll}
        >
          <div className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                <p className="text-4xl">👋</p>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs">Say hi to get the conversation started!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.senderId === currentUser._id;
                const senderInitial = msg.sender
                  ? (msg.sender.name || msg.sender.email)[0].toUpperCase()
                  : "?";

                return (
                  <div
                    key={msg._id}
                    className={cn(
                      "flex items-end gap-2",
                      isOwn ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={msg.sender?.imageUrl} />
                        <AvatarFallback className="text-xs">
                          {senderInitial}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "flex flex-col gap-1",
                        isOwn ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm sm:max-w-xs lg:max-w-md",
                          isOwn
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-muted text-foreground"
                        )}
                      >
                        {msg.body}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing indicator */}
            {typingText && (
              <div className="flex items-end gap-2">
                {otherUser && (
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={otherUser.imageUrl} />
                    <AvatarFallback className="text-xs">
                      {initials(otherUser)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        senderId={currentUser._id}
      />
    </div>
  );
}
