"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn, formatTimestamp } from "@/lib/utils";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
  conversationId: Id<"conversations">;
  currentUser: Doc<"users">;
}

export function ChatWindow({ conversationId, currentUser }: ChatWindowProps) {
  const conversations = useQuery(api.conversations.listForUser, {
    userId: currentUser._id,
  });
  const messages = useQuery(api.messages.list, { conversationId });
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentConv = conversations?.find((c) => c._id === conversationId);
  const otherUser = currentConv?.otherUser;

  const displayName = (u: Doc<"users">) => u.name || u.email;
  const initials = (u: Doc<"users">) => (u.name || u.email)[0].toUpperCase();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {otherUser ? (
          <>
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={otherUser.imageUrl} />
                <AvatarFallback>{initials(otherUser)}</AvatarFallback>
              </Avatar>
              {otherUser.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">{displayName(otherUser)}</p>
              <p className="text-xs text-muted-foreground">
                {otherUser.isOnline ? "Online" : otherUser.email}
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
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                No messages yet. Say hi! 👋
              </p>
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
                          "max-w-xs rounded-2xl px-4 py-2 text-sm shadow-sm lg:max-w-md",
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
