"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MessagePanelProps {
  conversationId: Id<"conversations">;
  currentUser: Doc<"users">;
}

export function MessagePanel({
  conversationId,
  currentUser,
}: MessagePanelProps) {
  const conversation = useQuery(api.conversations.listForUser, {
    userId: currentUser._id,
  });

  const currentConv = conversation?.find((c) => c._id === conversationId);
  const otherUser = currentConv?.otherUser;

  const displayName = (u: Doc<"users">) => u.name || u.email;

  const initials = (u: Doc<"users">) =>
    (u.name || u.email)[0].toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        {otherUser ? (
          <>
            <Avatar className="h-9 w-9">
              <AvatarImage src={otherUser.imageUrl} />
              <AvatarFallback>{initials(otherUser)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{displayName(otherUser)}</p>
              <p className="text-xs text-muted-foreground">{otherUser.email}</p>
            </div>
          </>
        ) : (
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        )}
      </div>

      <Separator />

      {/* Messages */}
      <MessageList
        conversationId={conversationId}
        currentUserId={currentUser._id}
      />

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        senderId={currentUser._id}
      />
    </div>
  );
}
